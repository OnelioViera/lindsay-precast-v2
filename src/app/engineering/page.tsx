"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import UploadModal from "@/components/UploadModal";
import ConcreteCalculatorModal from "@/components/ConcreteCalculatorModal";
import ConcreteVolumeCalculatorModal from "@/components/ConcreteVolumeCalculatorModal";
import VolumeCalculatorModal from "@/components/VolumeCalculatorModal";

interface PDFFile {
  id: string;
  name: string;
  description: string;
  url: string;
  date: string;
}

interface WebsiteLink {
  id: string;
  title: string;
  url: string;
  description: string;
  date: string;
}

export default function EngineeringPage() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [websiteLinks, setWebsiteLinks] = useState<WebsiteLink[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [newLink, setNewLink] = useState<Omit<WebsiteLink, "id" | "date">>({
    title: "",
    url: "",
    description: "",
  });
  const [
    isConcreteVolumeCalculatorModalOpen,
    setIsConcreteVolumeCalculatorModalOpen,
  ] = useState(false);
  const [isVolumeCalculatorModalOpen, setIsVolumeCalculatorModalOpen] =
    useState(false);

  // Load saved files and links from localStorage on component mount
  useEffect(() => {
    try {
      const savedFiles = localStorage.getItem("pdfFiles");
      const savedLinks = localStorage.getItem("websiteLinks");
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);
        setPdfFiles(parsedFiles);
      }
      if (savedLinks) {
        const parsedLinks = JSON.parse(savedLinks);
        setWebsiteLinks(parsedLinks);
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
        localStorage.setItem("pdfFiles", JSON.stringify(pdfFiles));
      } else {
        localStorage.removeItem("pdfFiles");
      }
      if (websiteLinks.length > 0) {
        localStorage.setItem("websiteLinks", JSON.stringify(websiteLinks));
      } else {
        localStorage.removeItem("websiteLinks");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data");
    }
  }, [pdfFiles, websiteLinks]);

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

  const handleAddLink = () => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      toast.error("Please fill in both title and URL");
      return;
    }

    const link: WebsiteLink = {
      ...newLink,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };

    setWebsiteLinks((prevLinks) => [...prevLinks, link]);
    setNewLink({ title: "", url: "", description: "" });
    setIsAddLinkModalOpen(false);
    toast.success("Link added successfully!");
  };

  const handleDeleteLink = (id: string) => {
    setWebsiteLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
    toast.success("Link deleted successfully!");
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
                Concrete Calculator
              </button>
              <button
                onClick={() => setIsConcreteVolumeCalculatorModalOpen(true)}
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
                Concrete Volume Calculator
              </button>
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
            </div>

            {/* Website Links Section */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg w-full max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Useful Links</h2>
                <button
                  onClick={() => setIsAddLinkModalOpen(true)}
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
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Add Link
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {websiteLinks.map((link) => (
                  <div
                    key={link.id}
                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-semibold">
                          {link.title}
                        </h3>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm break-all"
                        >
                          {link.url}
                        </a>
                        {link.description && (
                          <p className="text-gray-300 text-sm mt-2">
                            {link.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
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
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PDF Storage Section */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg w-full max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">PDF Storage</h2>
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

      {/* Concrete Volume Calculator Modal */}
      <ConcreteVolumeCalculatorModal
        isOpen={isConcreteVolumeCalculatorModalOpen}
        onClose={() => setIsConcreteVolumeCalculatorModalOpen(false)}
      />

      {/* Volume Calculator Modal */}
      <VolumeCalculatorModal
        isOpen={isVolumeCalculatorModalOpen}
        onClose={() => setIsVolumeCalculatorModalOpen(false)}
      />

      {/* Add Link Modal */}
      {isAddLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Add New Link</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink({ ...newLink, title: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter link title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink({ ...newLink, url: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newLink.description}
                  onChange={(e) =>
                    setNewLink({ ...newLink, description: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter link description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsAddLinkModalOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLink}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Add Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
