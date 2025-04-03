"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface PDFFile {
  id: string;
  name: string;
  description: string;
  url: string;
  date: string;
}

// Upload Modal Component
function UploadModal({
  isOpen,
  onClose,
  onUpload,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: FileList | null) => Promise<void>;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    onUpload(e.dataTransfer.files);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Upload Documents</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex flex-col items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className={`flex flex-col items-center justify-center w-full h-64 border-2 ${
                isDragging
                  ? "border-blue-500 bg-blue-900/20"
                  : "border-gray-600"
              } border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors duration-200`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-2 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-1 text-sm text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-400">
                  Multiple PDF files supported
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept=".pdf"
                multiple
                onChange={(e) => onUpload(e.target.files)}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EngineeringPage() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Load saved files from localStorage on component mount
  useEffect(() => {
    const savedFiles = localStorage.getItem("pdfFiles");
    if (savedFiles) {
      const parsedFiles = JSON.parse(savedFiles);
      setPdfFiles(parsedFiles);
    }
  }, []);

  // Save files to localStorage whenever they change
  useEffect(() => {
    if (pdfFiles.length > 0) {
      localStorage.setItem("pdfFiles", JSON.stringify(pdfFiles));
    }
  }, [pdfFiles]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      console.log("No files selected");
      return;
    }

    console.log(
      "Files selected:",
      Array.from(files).map((f) => ({
        name: f.name,
        type: f.type,
        size: f.size,
      }))
    );

    // Check if all files are PDFs
    const nonPDFFiles = Array.from(files).filter(
      (file) => file.type !== "application/pdf"
    );
    if (nonPDFFiles.length > 0) {
      console.log(
        "Non-PDF files detected:",
        nonPDFFiles.map((f) => f.name)
      );
      toast.error("Please upload only PDF files");
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading(
        `Uploading ${files.length} file${files.length > 1 ? "s" : ""}...`
      );

      // Upload each file
      const uploadPromises = Array.from(files).map(async (file) => {
        console.log("Starting upload for file:", file.name);
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Upload failed:", errorData);
          throw new Error(errorData.error || `Failed to upload ${file.name}`);
        }

        const data = await response.json();
        console.log("Upload successful:", data);
        return {
          id: data.id,
          name: file.name,
          description: "Newly uploaded document",
          url: data.url,
          date: new Date().toISOString().split("T")[0],
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      console.log("All files uploaded successfully:", uploadedFiles);

      // Add new files to state
      setPdfFiles((prev) => [...prev, ...uploadedFiles]);

      // Update toast
      toast.success(
        `Successfully uploaded ${files.length} file${
          files.length > 1 ? "s" : ""
        }!`,
        {
          id: loadingToast,
        }
      );

      // Close the modal after successful upload
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload one or more files"
      );
    }
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Deleting file...");

      // Remove file from state
      setPdfFiles((prev) => {
        const newFiles = prev.filter((file) => file.id !== fileId);
        // If this was the last file, remove from localStorage
        if (newFiles.length === 0) {
          localStorage.removeItem("pdfFiles");
        }
        return newFiles;
      });

      // Update toast
      toast.success("File deleted successfully!", {
        id: loadingToast,
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete file");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 transition-colors duration-300">
      <Navbar />
      <main className="w-full max-w-[1920px] mx-auto px-8 sm:px-12 lg:px-16 pb-24 mt-16">
        <div className="flex flex-col items-center space-y-6 sm:space-y-8">
          {/* Page title */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl sm:text-6xl font-bold text-white">
              Lindsay Precast
            </h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-300">
              Engineering Information
            </h2>
          </div>

          {/* Content placeholder */}
          <div className="w-full max-w-5xl text-gray-300 space-y-4 sm:space-y-6">
            <p className="text-center">
              Engineering information will be displayed here.
            </p>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
}
