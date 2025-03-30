import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    console.log("Upload request received");
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("No file found in formData");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("File received:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Check if file is a PDF
    if (file.type !== "application/pdf") {
      console.log("Invalid file type:", file.type);
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Create a unique filename
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    const uniqueId = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const filename = `${uniqueId}-${file.name}`;
    console.log("Generated filename:", filename);

    // Check if BLOB_READ_WRITE_TOKEN is set
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN is not set");
      return NextResponse.json(
        { error: "Storage configuration error" },
        { status: 500 }
      );
    }

    console.log("Attempting to upload to Vercel Blob Storage");
    // Upload to Vercel Blob Storage
    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    console.log("Upload successful:", blob.url);

    // Return success response with file URL
    return NextResponse.json({
      id: uniqueId,
      url: blob.url,
    });
  } catch (error) {
    console.error("Upload error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload file",
      },
      { status: 500 }
    );
  }
}
