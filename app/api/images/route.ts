import { auth } from "@/lib/auth";
import { getImageType, IMAGE_FOLDERS, ImageFolder, MAX_IMAGE_BYTES } from "@/lib/images.shared";
import { supabaseAdmin } from "@/lib/supabase.server";
import { BYTES_IN_MEGABYTE } from "@/lib/utils";
import { randomUUID } from "crypto";

interface DeleteImageRequest { paths: string[] }

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

  const { error } = await supabaseAdmin.storage
    .from("Images")
    .upload(path, await blob.arrayBuffer(), { contentType: imageType} );
  if (error) {
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

  const { paths } = await request.json() as DeleteImageRequest
  if (!paths) {
    return Response.json({ error: "Invalid or empty image paths" }, { status: 400 })
  }

  const { error } = await supabaseAdmin.storage
    .from("Images")
    .remove(paths)
  if (error) {
    console.error("Failed to delete image", error);
    return Response.json({ error: "Couldn't delete the image for some reason. PLease try again." }, { status: 502 })
  }

  return Response.json({}, { status: 201 })
}
