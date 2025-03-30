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

const SAMPLE_FILE: PDFFile = {
  id: "1",
  name: "Sample Engineering Document",
  description:
    "This is a sample engineering document for demonstration purposes.",
  url: "/pdfs/sample.pdf",
  date: "2024-03-20",
};

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
    } else {
      // Only set the sample file if there are no saved files
      setPdfFiles([SAMPLE_FILE]);
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
      setPdfFiles((prev) => prev.filter((file) => file.id !== fileId));

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

          {/* PDF Storage Section */}
          <div className="w-full max-w-7xl">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">
                  Engineering Documents
                </h3>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Upload Document</span>
                </button>
              </div>

              {/* PDF Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pdfFiles.map((pdf) => (
                  <div
                    key={pdf.id}
                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200 flex flex-col"
                  >
                    <div className="flex-grow">
                      <h4 className="text-lg font-medium text-white mb-2">
                        {pdf.name}
                      </h4>
                      <p className="text-gray-300 text-sm mb-2">
                        {pdf.description}
                      </p>
                      <p className="text-gray-400 text-xs">
                        Last updated: {pdf.date}
                      </p>
                    </div>
                    <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-600">
                      <button
                        onClick={() => window.open(pdf.url, "_blank")}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => handleDelete(pdf.id, pdf.name)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-center space-x-4">
          {/* Add footer content here */}
        </div>
      </footer>
    </div>
  );
}
