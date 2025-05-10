"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, FileUp, RefreshCw } from "lucide-react";

export default function TransactionUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // For demonstration purposes, we'll simulate an upload
      // In a real app, you would upload the file to your API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to the recommendations page
      router.push("/recommendations/dashboard");
    } catch (err) {
      setError("Failed to upload transaction file. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Upload Your Transactions</CardTitle>
        <CardDescription>
          Upload your transaction data file to receive personalized insurance recommendations
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Transaction File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                {file ? file.name : "CSV, Excel, or JSON files accepted"}
              </p>
              <Input
                id="file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".csv,.xlsx,.xls,.json"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("file")?.click()}
              >
                <FileUp className="mr-2 h-4 w-4" />
                Select File
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Transactions"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}