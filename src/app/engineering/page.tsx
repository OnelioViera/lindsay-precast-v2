"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import UploadModal from "@/components/UploadModal";
import ConcreteCalculatorModal from "@/components/ConcreteCalculatorModal";

interface PDFFile {
  id: string;
  name: string;
  description: string;
  url: string;
  date: string;
}

export default function EngineeringPage() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);

  // Load saved files from localStorage on component mount
  useEffect(() => {
    try {
      const savedFiles = localStorage.getItem("pdfFiles");
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);
        setPdfFiles(parsedFiles);
      }
    } catch (error) {
      console.error("Error loading files:", error);
      toast.error("Error loading saved files");
    }
  }, []);

  // Save files to localStorage whenever they change
  useEffect(() => {
    try {
      if (pdfFiles.length > 0) {
        // Check if we're approaching storage limit
        const storageSize = new Blob([JSON.stringify(pdfFiles)]).size;
        const maxStorageSize = 4.5 * 1024 * 1024; // 4.5MB limit to be safe

        if (storageSize > maxStorageSize) {
          // Remove oldest files until we're under the limit
          const sortedFiles = [...pdfFiles].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

          let currentSize = storageSize;
          const filesToKeep: PDFFile[] = [];

          for (let i = sortedFiles.length - 1; i >= 0; i--) {
            const fileSize = new Blob([JSON.stringify(sortedFiles[i])]).size;
            if (currentSize - fileSize > maxStorageSize) {
              currentSize -= fileSize;
            } else {
              filesToKeep.unshift(sortedFiles[i]);
            }
          }

          setPdfFiles(filesToKeep);
          toast.warning(
            "Storage limit reached. Some older files were removed."
          );
        } else {
          localStorage.setItem("pdfFiles", JSON.stringify(pdfFiles));
        }
      } else {
        localStorage.removeItem("pdfFiles");
      }
    } catch (error) {
      console.error("Error saving files:", error);
      toast.error("Error saving files. Some files may be lost.");
    }
  }, [pdfFiles]);

  const handleFileUpload = (file: File, description: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newFile: PDFFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        description: description,
        url: e.target?.result as string,
        date: new Date().toISOString(),
      };
      setPdfFiles((prevFiles) => [...prevFiles, newFile]);
      setIsUploadModalOpen(false);
      toast.success("File uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id: string, name: string) => {
    setPdfFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    toast.success("File deleted successfully!");
  };

  const handleDownload = (file: PDFFile) => {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(file.url.split(",")[1]);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 transition-colors duration-300">
      <Toaster position="top-right" />
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

          <div className="space-y-8">
            {/* Concrete Calculator Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsCalculatorModalOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 15.75V18m-7.5-6h15m-15 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0Z"
                  />
                </svg>
                Create Concrete Calculator
              </button>
            </div>

            {/* PDF Storage Section */}
            <div className="bg-gray-800 rounded-xl p-4 shadow-lg w-full max-w-3xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">PDF Storage</h2>
              </div>

              <div className="space-y-3">
                {pdfFiles.map((pdf) => (
                  <div
                    key={pdf.id}
                    className="bg-gray-700 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0"
                  >
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white">
                        {pdf.name}
                      </h3>
                      <p className="text-sm text-gray-300">{pdf.description}</p>
                      <p className="text-xs text-gray-400">
                        Uploaded: {new Date(pdf.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleDownload(pdf)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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

      {/* Concrete Calculator Modal */}
      <ConcreteCalculatorModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
      />
    </div>
  );
}
