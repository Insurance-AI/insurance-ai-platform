"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function TransactionUploadForm() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;
    
    // Check file type - ONLY allow CSV files
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (selectedFile.type !== "text/csv" && fileExtension !== 'csv') {
      setError("Please upload only CSV files");
      setFile(null);
      setFileName("");
      return;
    }
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError("");
  };

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 95) {
        progress = 95;
        clearInterval(interval);
      }
      setUploadProgress(Math.min(progress, 95));
    }, 300);
    
    return interval;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a CSV file to upload");
      return;
    }
    
    setIsUploading(true);
    setError("");
    
    // Simulate progress while uploading
    const progressInterval = simulateProgress();
    
    try {
      const formData = new FormData();
      formData.append("transactionFile", file);
      
      // Make the request to your API endpoint
      const response = await fetch("/api/upload-transactions", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload file");
      }
      
      // After successful upload, analyze the transactions in a single API call
      try {
        // Create a new FormData object for the analysis request
        const analysisFormData = new FormData();
        analysisFormData.append("file", file);
        
        const analysisResponse = await fetch("http://localhost:8080/api/insurance/analyze", {
          method: "POST",
          body: analysisFormData,
        });
        
        if (!analysisResponse.ok) {
          throw new Error("Failed to analyze transactions");
        }
        
        // Get the analysis result
        const analysisData = await analysisResponse.json();
        
        // Clear interval and complete progress
        clearInterval(progressInterval);
        setUploadProgress(100);
        setSuccess(true);
        
        // Store the analysis data in sessionStorage to pass it to the dashboard
        sessionStorage.setItem("insuranceAnalysisData", JSON.stringify(analysisData));
        
        // Redirect to the dashboard after a short delay
        setTimeout(() => {
          router.push("/recommendations/dashboard");
        }, 1500);
        
      } catch (analysisErr) {
        throw new Error("Analysis failed: " + analysisErr.message);
      }
      
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message || "An error occurred during upload");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="border rounded-lg shadow-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isUploading && !success ? (
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                error ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              } transition-colors cursor-pointer`}
              onClick={() => document.getElementById("file-upload").click()}
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
              />
              
              {file ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-3">
                    <span className="font-medium text-xs">CSV</span>
                  </div>
                  <p className="text-sm font-medium">{fileName}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to change file
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium">
                    Drag and drop your transaction file or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports CSV format only
                  </p>
                </div>
              )}
              
              {error && (
                <div className="mt-4 text-sm text-red-600 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              {isUploading && !success ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                  </div>
                  <p className="font-medium">Uploading and analyzing your transactions...</p>
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-gray-500">This may take a moment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="rounded-full bg-green-100 p-2">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="font-medium text-green-600">Upload successful!</p>
                  <p className="text-sm text-gray-500">Redirecting to your recommendations...</p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!file || isUploading || success}
              className="px-6"
            >
              {isUploading ? "Processing..." : "Upload and Analyze"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}