import { S3_IMAGES_BUCKET } from '@/lib/r2.server';
import { compose, garage } from './docker';

/**
 * The website endpoint picks a bucket from the Host header, ignoring the port,
 * so this alias makes http://localhost:3902/<key> serve the images bucket.
 */
const WEBSITE_ALIAS = 'localhost';

/** Starts the containers and waits until they're healthy. Safe to run repeatedly. */
export function startServices() {
  console.log('🐳 Starting local Postgres and Garage...');
  compose(['up', '-d', '--wait'], { label: 'Starting the containers' });
  setUpPublicImageUrls();
  console.log('✅ Services are running');
}

/** Garage has no public-read bucket policies, so images are served through its website endpoint instead. */
function setUpPublicImageUrls() {
  garage(['bucket', 'website', '--allow', S3_IMAGES_BUCKET], {
    label: 'Enabling website access on the images bucket',
    capture: true,
  });

  const aliasExists = garage(['bucket', 'info', WEBSITE_ALIAS], {
    label: 'Checking the bucket alias',
    capture: true,
    allowFailure: true,
  }).status === 0;

  if (!aliasExists) {
    garage(['bucket', 'alias', S3_IMAGES_BUCKET, WEBSITE_ALIAS], {
      label: `Adding the "${WEBSITE_ALIAS}" alias to the images bucket`,
      capture: true,
    });
  }
}
