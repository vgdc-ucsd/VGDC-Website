import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { s3 as localS3, S3_IMAGES_BUCKET } from '@/lib/r2.server';
import { runWithConcurrency } from '../lib/image-uploader';
import { hostOf } from './guards';

const CONCURRENCY = 6;

/**
 * Copies images from R2 into the local Garage bucket. Images already there with
 * the same size are skipped, since dashboard uploads get a new UUID path and
 * never change. `force` re-copies everything.
 */
export async function pullImages({ force }: { force: boolean }) {
  const remoteS3 = new S3Client({
    region: 'auto',
    endpoint: process.env.SYNC_R2_ENDPOINT!,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.SYNC_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.SYNC_R2_SECRET_ACCESS_KEY!,
    },
  });

  console.log(`\n🔍 Listing images on ${hostOf('SYNC_R2_ENDPOINT')} and locally...`);
  const [remote, local] = await Promise.all([listSizes(remoteS3), listSizes(localS3)]);
  const toCopy = [...remote.keys()].filter((key) => force || local.get(key) !== remote.get(key));
  console.log(`Found ${remote.size} remote images, ${toCopy.length} to copy`);

  let copied = 0;
  const failed: { key: string; reason: string }[] = [];

  await runWithConcurrency(
    toCopy.map((key) => async () => {
      try {
        const object = await remoteS3.send(new GetObjectCommand({ Bucket: S3_IMAGES_BUCKET, Key: key }));
        await localS3.send(new PutObjectCommand({
          Bucket: S3_IMAGES_BUCKET,
          Key: key,
          // Images are capped at MAX_IMAGE_BYTES, so buffering them is fine
          Body: await object.Body!.transformToByteArray(),
          ContentType: object.ContentType,
          CacheControl: object.CacheControl,
        }));
        copied++;
        if (copied % 25 === 0) console.log(`   ...copied ${copied}`);
      } catch (error) {
        failed.push({ key, reason: (error as Error).message });
      }
    }),
    CONCURRENCY,
  );

  console.log(`✅ Copied ${copied}, skipped ${remote.size - toCopy.length} already local${failed.length ? `, ${failed.length} failed` : ''}`);
  if (failed.length > 0) {
    console.warn('⚠️  These images could not be copied (re-run to retry them):');
    for (const { key, reason } of failed) console.warn(`   - ${key}: ${reason}`);
    process.exitCode = 1;
  }
}

/** Every key in the images bucket, mapped to its size in bytes. */
async function listSizes(client: S3Client): Promise<Map<string, number | undefined>> {
  const sizes = new Map<string, number | undefined>();
  let ContinuationToken: string | undefined;
  do {
    const page = await client.send(new ListObjectsV2Command({ Bucket: S3_IMAGES_BUCKET, ContinuationToken }));
    for (const object of page.Contents ?? []) {
      if (object.Key) sizes.set(object.Key, object.Size);
    }
    ContinuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (ContinuationToken);
  return sizes;
}
