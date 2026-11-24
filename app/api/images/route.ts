import { auth } from "@/lib/auth";
import { getImageType, IMAGE_FOLDERS, ImageFolder, MAX_IMAGE_BYTES } from "@/lib/images.shared";
import { removeImages, uploadImage } from "@/lib/images.server";
import { BYTES_IN_MEGABYTE } from "@/lib/utils";
import { randomUUID } from "crypto";

interface DeleteImageRequest { paths: string | string[] }

export async function POST(request: Request) {
  const session = await auth()
  if (session?.user.role != "officer") {
    return Response.json({ error: "Not signed in as an officer" }, { status: 403 });
  }

  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ error: "Bad origin"}, { status: 403 });
  }

  if (Number(request.headers.get("content-length") ?? 0) > MAX_IMAGE_BYTES) {
    return Response.json({ error: `Image is larger than ${MAX_IMAGE_BYTES / BYTES_IN_MEGABYTE} MB`}, { status: 413 });
  }

  const folder = new URL(request.url).searchParams.get("folder");

  if (!IMAGE_FOLDERS.includes((folder as ImageFolder))) {
    return Response.json({ error: `${folder?.toString()} is not one of ${IMAGE_FOLDERS.join(", ")}`}, { status: 400});
  }

  const blob = await request.blob();
  if (blob.size === 0) {
    return Response.json({ error: "Missing image data" }, { status: 400 });
  }
  if (blob.size > MAX_IMAGE_BYTES) {
    return Response.json({ error: `Image is larger than ${MAX_IMAGE_BYTES / BYTES_IN_MEGABYTE} MB`}, { status: 413 });
  }

  const imageType = await getImageType(blob);
  if (!imageType) {
    return Response.json({ error: "Image must be a valid PNG, JPEG, WebP, GIF, or AVIF" }, { status: 415 });
  }

  const imageFileExtension = imageType.split("/")[1];
  const path = `${folder}/${randomUUID()}.${imageFileExtension}`;

  try {
    await uploadImage(path, blob, { contentType: imageType });
  } catch (error) {
    console.error("Failed to upload image", error);
    return Response.json({ error: "Couldn't upload the image for some reason. PLease try again." }, { status: 502 });
  }

  return Response.json({ path }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (session?.user.role != "officer") {
    return Response.json({ error: "Not signed in as an officer" }, { status: 403 })
  }

  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ error: "Bad origin"}, { status: 403 })
  }

  // deleteImages() in images.client.ts sends either a single path or a list
  const { paths } = await request.json() as DeleteImageRequest
  const pathArray = typeof paths === "string" ? [paths] : paths
  if (!Array.isArray(pathArray) || pathArray.length === 0 || !pathArray.every((p) => typeof p === "string")) {
    return Response.json({ error: "Invalid or empty image paths" }, { status: 400 })
  }

  try {
    await removeImages(pathArray);
  } catch (error) {
    console.error("Failed to delete image", error);
    return Response.json({ error: "Couldn't delete the image for some reason. PLease try again." }, { status: 502 })
  }

  return Response.json({}, { status: 201 })
}
