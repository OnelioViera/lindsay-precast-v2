import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create a unique filename
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    const uniqueId = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const filename = `${uniqueId}-${file.name}`;

    // Convert File to Buffer
    const bytes2 = await file.arrayBuffer();
    const buffer = Buffer.from(bytes2);

    // Save file to public/pdfs directory
    const path = join(process.cwd(), "public", "pdfs", filename);
    await writeFile(path, buffer);

    // Return success response with file URL
    return NextResponse.json({
      id: uniqueId,
      url: `/pdfs/${filename}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
