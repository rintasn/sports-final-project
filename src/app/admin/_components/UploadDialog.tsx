import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';

interface UploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadDialog({ isOpen, onOpenChange }: UploadDialogProps) {
  const [uploadType, setUploadType] = useState('image');
  const [file, setFile] = useState<File | null>(null);
  const [uploadResponse, setUploadResponse] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
    const API_ENDPOINT = uploadType === 'image' ? '/api/v1/upload-image' : '/api/v1/upload-file';
    const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');

    if (!BEARER_TOKEN) {
      toast({
        title: "Error",
        description: "Bearer token not found in localStorage.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.message || "An unknown error occurred while uploading file.");
      }

      setUploadResponse(data.result);
      toast({
        title: "Success",
        description: "File uploaded successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload an image or file to the server.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="upload-type">Upload Type:</Label>
            <select
              id="upload-type"
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="image">Image</option>
              <option value="file">File</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="file">Select File:</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="border p-2 rounded"
            />
          </div>
          <Button onClick={handleUpload}>Upload</Button>
          {uploadResponse && (
            <div className="mt-4">
              <Label>Upload Result:</Label>
              <Textarea
                value={uploadResponse}
                readOnly
                className="border p-2 rounded mt-2"
              />
              <Button
                onClick={() => navigator.clipboard.writeText(uploadResponse)}
                className="mt-2"
              >
                Copy Link
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}