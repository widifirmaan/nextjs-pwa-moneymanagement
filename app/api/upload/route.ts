import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Sanitize filename and add timestamp
        const filename = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');

        // Define upload directory
        // Use process.cwd() for compatibility with both local and docker 
        // (Assuming public folder is mapped or available)
        const relativeUploadDir = "uploads/transactions"; // without leading slash for path.join
        const uploadDir = path.join(process.cwd(), "public", relativeUploadDir);

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore error if directory exists
        }

        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // Return the relative URL to be stored in DB
        // Add leading slash for URL usage
        const fileUrl = "/" + path.join(relativeUploadDir, filename);

        return NextResponse.json({ url: fileUrl });
    } catch (e) {
        console.error("Upload error:", e);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
