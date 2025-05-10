import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync } from "fs";

interface FileData {
    type: string;
    name: string;
    arrayBuffer: () => Promise<ArrayBuffer>;
}

interface FormData {
    get: (name: string) => FileData | null;
}

export async function POST(request: Request): Promise<Response> {
    try {
        const formData: FormData = await request.formData() as unknown as FormData;
        const file: FileData | null = formData.get("transactionFile");
        
        if (!file) {
            return NextResponse.json(
                { success: false, message: "No file uploaded" },
                { status: 400 }
            );
        }
        
        // Verify file type - only allow CSV
        const fileType: string = file.type;
        const fileExtension: string = file.name.split('.').pop()?.toLowerCase() || '';
        
        if (fileType !== "text/csv" && fileExtension !== 'csv') {
            return NextResponse.json(
                { success: false, message: "Only CSV files are allowed" },
                { status: 400 }
            );
        }

        // Get file data as buffer
        const fileBuffer: Buffer = Buffer.from(await file.arrayBuffer());
        
        // Generate unique filename
        const fileName: string = `${uuidv4()}-${file.name}`;
        
        // Ensure tmp directory exists
        const tmpDir: string = join(process.cwd(), "tmp");
        if (!existsSync(tmpDir)) {
            await mkdir(tmpDir, { recursive: true });
        }
        
        // Save the file temporarily
        const filePath: string = join(tmpDir, fileName);
        await writeFile(filePath, fileBuffer);
        
        // For now, we'll just simulate success instead of hitting the analysis API
        // In production, you would integrate with your actual analysis service
        
        /* 
        // Commented out since the analysis API might not exist yet
        const analysisResponse = await fetch("http://localhost:8080/api/insurance/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                filePath: filePath,
                fileName: file.name,
                fileType: file.type,
            }),
        });
        
        if (!analysisResponse.ok) {
            throw new Error("Failed to analyze transactions");
        }
        
        // Store the analysis results
        const analysisData = await analysisResponse.json();
        */
        
        // Return success response
        return NextResponse.json({
            success: true,
            message: "CSV file uploaded successfully",
            redirectUrl: "/dashboard",
        });
        
    } catch (error) {
        console.error("Error uploading file:", error);
        const errorMessage: string = error instanceof Error ? error.message : "Failed to upload file";
        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
        );
    }
}