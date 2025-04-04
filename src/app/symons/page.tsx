"use client";

import Link from "next/link";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { jsPDF as JSPDF } from "jspdf";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";

interface SymonsData {
  id: string;
  title: string;
  description: string;
  links: {
    id: string;
    title: string;
    url: string;
  }[];
  pdfFile?: {
    name: string;
    url: string;
  };
}

export default function SymonsPage() {
  const [savedSymons, setSavedSymons] = useState<SymonsData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSymonId, setEditingSymonId] = useState<string | null>(null);
  const [symonData, setSymonData] = useState<Omit<SymonsData, "id">>({
    title: "",
    description: "",
    links: [],
    pdfFile: undefined,
  });
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    symonId: string | null;
  }>({
    isOpen: false,
    symonId: null,
  });

  // Load saved symons from localStorage on component mount
  useEffect(() => {
    try {
      const savedSymonsData = localStorage.getItem("savedSymons");
      if (savedSymonsData) {
        const parsedData = JSON.parse(savedSymonsData);
        if (Array.isArray(parsedData)) {
          setSavedSymons(parsedData);
        }
      }
    } catch (error) {
      console.error("Error loading saved symons:", error);
    }
  }, []);

  // Save symons to localStorage whenever they change
  useEffect(() => {
    try {
      if (savedSymons.length > 0) {
        localStorage.setItem("savedSymons", JSON.stringify(savedSymons));
      } else {
        localStorage.removeItem("savedSymons");
      }
    } catch (error) {
      console.error("Error saving symons:", error);
    }
  }, [savedSymons]);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a URL for the file
      const fileUrl = URL.createObjectURL(file);
      setSymonData((prev) => ({
        ...prev,
        pdfFile: {
          name: file.name,
          url: fileUrl,
        },
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!symonData.title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (editingSymonId) {
      // Update existing symon
      setSavedSymons((prevSymons) =>
        prevSymons.map((symon) =>
          symon.id === editingSymonId
            ? { ...symonData, id: editingSymonId }
            : symon
        )
      );
    } else {
      // Create new symon
      const newSymon: SymonsData = {
        id: Date.now().toString(),
        ...symonData,
      };
      setSavedSymons((prevSymons) => [...prevSymons, newSymon]);
    }

    // Reset form and close modal
    setSymonData({
      title: "",
      description: "",
      links: [],
      pdfFile: undefined,
    });
    setEditingSymonId(null);
    setIsModalOpen(false);
  };

  const deleteSymon = (id: string) => {
    setDeleteConfirmModal({ isOpen: true, symonId: id });
  };

  const confirmDelete = () => {
    if (deleteConfirmModal.symonId) {
      setSavedSymons((prevSymons) =>
        prevSymons.filter((symon) => symon.id !== deleteConfirmModal.symonId)
      );
      setDeleteConfirmModal({ isOpen: false, symonId: null });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmModal({ isOpen: false, symonId: null });
  };

  const addLink = () => {
    setSymonData((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        {
          id: Date.now().toString(),
          title: "",
          url: "",
        },
      ],
    }));
  };

  const removeLink = (linkId: string) => {
    setSymonData((prev) => ({
      ...prev,
      links: prev.links.filter((link) => link.id !== linkId),
    }));
  };

  const updateLink = (
    linkId: string,
    field: "title" | "url",
    value: string
  ) => {
    setSymonData((prev) => ({
      ...prev,
      links: prev.links.map((link) =>
        link.id === linkId ? { ...link, [field]: value } : link
      ),
    }));
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
              Symons Information
            </h2>
          </div>

          {/* Content placeholder */}
          <div className="w-full max-w-5xl text-gray-300 space-y-4 sm:space-y-6">
            {savedSymons.length > 0 && (
              <div className="w-full space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
                  Saved Symons
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {savedSymons.map((symon) => (
                    <div
                      key={symon.id}
                      className="bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-white">
                          {symon.title}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSymonData(symon);
                              setEditingSymonId(symon.id);
                              setIsModalOpen(true);
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteSymon(symon.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      {symon.description && (
                        <p className="text-gray-300 mb-4">
                          {symon.description}
                        </p>
                      )}
                      {symon.pdfFile && (
                        <div className="mb-4">
                          <a
                            href={symon.pdfFile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 flex items-center"
                          >
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            View PDF: {symon.pdfFile.name}
                          </a>
                        </div>
                      )}
                      {symon.links.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-400 mb-2">
                            Links:
                          </h4>
                          <div className="space-y-2">
                            {symon.links.map((link) => (
                              <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-400 hover:text-blue-300 hover:underline"
                              >
                                {link.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {savedSymons.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  No Symons entries yet. Click "Create New Symons" to add one.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer with Export Buttons */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-center space-x-4">
          <button
            onClick={() => {
              setSymonData({
                title: "",
                description: "",
                links: [],
                pdfFile: undefined,
              });
              setEditingSymonId(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Create New Symons</span>
          </button>
          {savedSymons.length > 0 && (
            <>
              <button
                onClick={() => {
                  const ws = XLSX.utils.json_to_sheet(
                    savedSymons.map((symon) => ({
                      Title: symon.title,
                      Description: symon.description,
                      Links: symon.links
                        .map((link) => `${link.title}: ${link.url}`)
                        .join(", "),
                    }))
                  );
                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, "Symons");
                  XLSX.writeFile(wb, "symons_info.xlsx");
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300 flex items-center space-x-2"
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
                <span>Export as Excel</span>
              </button>
              <button
                onClick={() => {
                  const doc = new jsPDF();
                  doc.setFontSize(16);
                  doc.text("Symons Information", 14, 15);
                  autoTable(doc, {
                    startY: 25,
                    head: [["Title", "Description", "Links"]],
                    body: savedSymons.map((symon) => [
                      symon.title,
                      symon.description,
                      symon.links
                        .map((link) => `${link.title}: ${link.url}`)
                        .join(", "),
                    ]),
                    theme: "grid",
                    headStyles: { fillColor: [59, 130, 246] },
                    styles: { fontSize: 9 },
                    columnStyles: {
                      0: { cellWidth: 40 },
                      1: { cellWidth: 80 },
                      2: { cellWidth: 60 },
                    },
                  });
                  doc.save("symons_info.pdf");
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300 flex items-center space-x-2"
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
                <span>Export as PDF</span>
              </button>
            </>
          )}
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingSymonId ? "Edit Symon" : "Create New Symon"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={symonData.title}
                  onChange={(e) =>
                    setSymonData({ ...symonData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={symonData.description}
                  onChange={(e) =>
                    setSymonData({ ...symonData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  PDF File
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {symonData.pdfFile && (
                  <div className="mt-2 text-sm text-gray-300">
                    Selected file: {symonData.pdfFile.name}
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Links
                  </label>
                  <button
                    type="button"
                    onClick={addLink}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    + Add Link
                  </button>
                </div>
                <div className="space-y-2">
                  {symonData.links.map((link) => (
                    <div key={link.id} className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Link Title"
                        value={link.title}
                        onChange={(e) =>
                          updateLink(link.id, "title", e.target.value)
                        }
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="url"
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) =>
                          updateLink(link.id, "url", e.target.value)
                        }
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeLink(link.id)}
                        className="px-3 py-2 text-red-400 hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">
                Delete Symons
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this entry? This action cannot
                be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
