"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import UploadModal from "@/components/UploadModal";
import VolumeCalculatorModal from "@/components/VolumeCalculatorModal";
import ConcreteVolumeCalculatorModal from "@/components/ConcreteVolumeCalculatorModal";
import WallCalculatorModal from "@/components/WallCalculatorModal";
import LinkUploadModal from "@/components/LinkUploadModal";
import EditModal from "@/components/EditModal";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

interface Link {
  id: string;
  name: string;
  description: string;
  url: string;
  type: "link";
}

interface PDFFile {
  id: string;
  name: string;
  description: string;
  url: string;
  type: "file";
  selected?: boolean;
  pages?: string[]; // Array of base64 strings for each page
}

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function EngineeringPage() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<PDFFile | null>(null);
  const [previewFile, setPreviewFile] = useState<PDFFile | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isVolumeCalculatorModalOpen, setIsVolumeCalculatorModalOpen] =
    useState(false);
  const [isConcreteCalculatorModalOpen, setIsConcreteCalculatorModalOpen] =
    useState(false);
  const [isWallCalculatorModalOpen, setIsWallCalculatorModalOpen] =
    useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fileToEdit, setFileToEdit] = useState<PDFFile | null>(null);
  const [currentPreviewPage, setCurrentPreviewPage] = useState(0);

  // Load saved files and links from localStorage on component mount
  useEffect(() => {
    try {
      const savedFiles = localStorage.getItem("pdfFiles");
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);
        setPdfFiles(parsedFiles);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error loading saved data");
    }
  }, []);

  // Save files and links to localStorage whenever they change
  useEffect(() => {
    try {
      if (pdfFiles.length > 0) {
        // Only save metadata, not the actual file data
        const filesToSave = pdfFiles.map((file) => ({
          id: file.id,
          name: file.name,
          description: file.description,
          type: file.type,
          url: file.url.startsWith("http") ? file.url : null, // Only save URLs for links
        }));
        localStorage.setItem("pdfFiles", JSON.stringify(filesToSave));
      } else {
        localStorage.removeItem("pdfFiles");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data. Some files may be too large to save.");
    }
  }, [pdfFiles]);

  const handleFileUpload = (file: File, description: string) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      // Check if the file is a PDF
      if (file.type === "application/pdf") {
        const newFile: PDFFile = {
          id: Date.now().toString(),
          name: file.name,
          description,
          url: base64Url,
          type: "file",
        };
        setPdfFiles((prevFiles) => [...prevFiles, newFile]);
        toast.success("PDF uploaded successfully!");
      } else {
        toast.error("Please upload only PDF files");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLinkUpload = (url: string, name: string, description: string) => {
    const newLink: PDFFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      description: description,
      url: url,
      type: "file",
    };
    setPdfFiles((prevFiles) => [...prevFiles, newLink]);
    setIsLinkModalOpen(false);
    toast.success("Link added successfully!");
  };

  const handleDelete = (file: PDFFile) => {
    setFileToDelete(file);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      setPdfFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== fileToDelete.id)
      );
      setFileToDelete(null);
      setIsDeleteModalOpen(false);
      toast.success("Item deleted successfully!");
    }
  };

  const cancelDelete = () => {
    setFileToDelete(null);
    setIsDeleteModalOpen(false);
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

  const handlePreview = (file: PDFFile) => {
    if (file.url.startsWith("http")) {
      window.open(file.url, "_blank");
    } else {
      setPreviewFile(file);
      setCurrentPreviewPage(0);
      setIsPreviewModalOpen(true);
    }
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleBulkDelete = () => {
    if (selectedFiles.length > 0) {
      setPdfFiles((prevFiles) =>
        prevFiles.filter((file) => !selectedFiles.includes(file.id))
      );
      setSelectedFiles([]);
      toast.success(`${selectedFiles.length} files deleted successfully!`);
    }
  };

  const handleEdit = (file: PDFFile) => {
    setFileToEdit(file);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (name: string, description: string) => {
    if (fileToEdit) {
      setPdfFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === fileToEdit.id ? { ...file, name, description } : file
        )
      );
      setIsEditModalOpen(false);
      setFileToEdit(null);
      toast.success("Changes saved successfully!");
    }
  };

  const renderFiles = (files: PDFFile[]) => {
    return files.map((file) => (
      <div
        key={file.id}
        className={`flex items-center justify-between bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors ${
          selectedFiles.includes(file.id) ? "ring-2 ring-blue-500" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => handlePreview(file)}
            className="flex items-center gap-2 text-white hover:text-gray-300"
          >
            {file.url.startsWith("http") ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="font-medium">{file.name}</span>
          </button>
          <span className="text-sm text-gray-400">{file.description}</span>
        </div>
        <div className="flex items-center gap-2">
          {!file.url.startsWith("http") && (
            <button
              onClick={() => handleDownload(file)}
              className="p-2 text-blue-400 hover:text-blue-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          <button
            onClick={() => handleEdit(file)}
            className="p-2 text-yellow-400 hover:text-yellow-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608c-.676.255-1.482.99-1.482 2.026v5.542c0 1.1.9 2 2 2h6.5c1.1 0 2-.9 2-2v-5.542c0-1.036-.806-1.771-1.482-2.026a.798.798 0 01-.517-.608l-.091-.55a1.93 1.93 0 00-1.85-1.566h-3.172zm0 2.25h3.172a.43.43 0 01.43.43l.041.248a2.25 2.25 0 01-2.134 2.5 2.25 2.25 0 01-2.134-2.5l.041-.247a.43.43 0 01.43-.431zM12 9a.75.75 0 100 1.5.75.75 0 000-1.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="flex items-center gap-2 border-l border-gray-700 pl-2">
            <input
              type="checkbox"
              checked={selectedFiles.includes(file.id)}
              onChange={() => handleFileSelect(file.id)}
              className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
              title="Select for bulk delete"
            />
            <button
              onClick={() => handleDelete(file)}
              className="p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    ));
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

          <div className="space-y-8 w-full">
            {/* Calculator Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setIsVolumeCalculatorModalOpen(true)}
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
                Circular Slab/Tube Calculator
              </button>
              <button
                onClick={() => setIsConcreteCalculatorModalOpen(true)}
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
                Concrete Weight Calculator
              </button>
              <button
                onClick={() => setIsWallCalculatorModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg transition-colors flex items-center gap-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                  />
                </svg>
                Base and Wall Calculator
              </button>
            </div>

            {/* PDF Storage Section */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg w-full max-w-6xl mx-auto">
              <div className="flex flex-col items-center mb-4">
                <h2 className="text-xl font-bold text-white mb-4">
                  Document Storage
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
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
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    Upload PDF
                  </button>
                  <button
                    onClick={() => setIsLinkModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
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
                        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                      />
                    </svg>
                    Add Link
                  </button>
                </div>
              </div>

              <div className="mt-8 space-y-8">
                {/* PDF Documents Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">
                      PDF Documents
                    </h2>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white italic">
                      Click on a PDF file to view its contents
                    </p>
                    <div className="flex items-center gap-2">
                      {pdfFiles.filter(
                        (file) => file?.url && !file.url.startsWith("http")
                      ).length > 0 && (
                        <>
                          <p className="text-sm text-white">
                            Select items to delete multiple files at once
                          </p>
                          {selectedFiles.length > 0 && (
                            <button
                              onClick={handleBulkDelete}
                              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors text-sm"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                              Delete Selected ({selectedFiles.length})
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {renderFiles(
                      pdfFiles.filter(
                        (file) => file?.url && !file.url.startsWith("http")
                      )
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 my-4"></div>

                {/* Links Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Links</h2>
                  </div>
                  <div className="space-y-2">
                    {renderFiles(
                      pdfFiles.filter((file) => file.url.startsWith("http"))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <UploadModal
        isOpen={isUploadModalOpen}
        onCloseAction={() => setIsUploadModalOpen(false)}
        onUploadAction={handleFileUpload}
      />

      <LinkUploadModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onUpload={handleLinkUpload}
      />

      <VolumeCalculatorModal
        isOpen={isVolumeCalculatorModalOpen}
        onClose={() => setIsVolumeCalculatorModalOpen(false)}
      />

      <ConcreteVolumeCalculatorModal
        isOpen={isConcreteCalculatorModalOpen}
        onClose={() => setIsConcreteCalculatorModalOpen(false)}
      />

      <WallCalculatorModal
        isOpen={isWallCalculatorModalOpen}
        onClose={() => setIsWallCalculatorModalOpen(false)}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setFileToEdit(null);
        }}
        onSave={handleSaveEdit}
        initialName={fileToEdit?.name || ""}
        initialDescription={fileToEdit?.description || ""}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && fileToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">
                Delete {fileToDelete.name}?
              </h3>
              <p className="text-gray-300 mb-6">
                This action cannot be undone. Are you sure you want to delete
                this item?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewModalOpen && previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                {previewFile.name}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(previewFile)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => {
                    setIsPreviewModalOpen(false);
                    setPreviewFile(null);
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-white rounded-lg">
              <embed
                src={previewFile.url}
                type="application/pdf"
                className="w-full h-full min-h-[500px]"
                style={{ minHeight: "500px" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
