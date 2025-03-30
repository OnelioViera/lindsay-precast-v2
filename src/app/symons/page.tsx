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
  // Add other fields as needed
  title: string;
  description: string;
}

export default function SymonsPage() {
  const [savedSymons, setSavedSymons] = useState<SymonsData[]>([]);

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
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {symon.title}
                      </h3>
                      <p className="text-gray-300">{symon.description}</p>
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
              // Add your create new symons logic here
              console.log("Create new symons clicked");
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
                      // Add other fields as needed
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
                    head: [["Title", "Description"]],
                    body: savedSymons.map((symon) => [
                      symon.title,
                      symon.description,
                      // Add other fields as needed
                    ]),
                    theme: "grid",
                    headStyles: { fillColor: [59, 130, 246] },
                    styles: { fontSize: 9 },
                    columnStyles: {
                      0: { cellWidth: 60 },
                      1: { cellWidth: 120 },
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
    </div>
  );
}
