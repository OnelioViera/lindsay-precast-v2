"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { jsPDF as JSPDF } from "jspdf";
import toast, { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface FormData {
  id: string;
  title: string;
  formSize: {
    width: number;
    length: number;
  };
  wallThickness: {
    "6": boolean;
    "8": boolean;
    "10": boolean;
  };
  baseThickness: {
    "6": boolean;
    "8": boolean;
    "10": boolean;
    "12": boolean;
  };
  lidThickness: {
    "4": boolean;
    "6": boolean;
    "8": boolean;
    "10": boolean;
    antiSkid: boolean;
    deck: boolean;
    clamshell: boolean;
    trafficRating: boolean | null;
    grate: boolean | null;
  };
  antiSkidBase: boolean;
  clamShell: boolean;
  maxPourHeight: number;
  maxRiserPour: number;
  engineered: boolean;
  dynamicBlocks: boolean;
  trafficRating: boolean | null;
  grate: boolean | null;
  notes: string;
  maxPorhithe: boolean;
  maxRiserPourCheck: boolean;
}

export default function FormsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedForms, setSavedForms] = useState<FormData[]>([]);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    formId: string | null;
  }>({
    isOpen: false,
    formId: null,
  });
  const [activeExportMenu, setActiveExportMenu] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<FormData, "id">>({
    title: "",
    formSize: {
      width: 0,
      length: 0,
    },
    wallThickness: {
      "6": false,
      "8": false,
      "10": false,
    },
    baseThickness: {
      "6": false,
      "8": false,
      "10": false,
      "12": false,
    },
    lidThickness: {
      "4": false,
      "6": false,
      "8": false,
      "10": false,
      antiSkid: false,
      deck: false,
      clamshell: false,
      trafficRating: null,
      grate: null,
    },
    antiSkidBase: false,
    clamShell: false,
    maxPourHeight: 0,
    maxRiserPour: 0,
    engineered: false,
    dynamicBlocks: false,
    trafficRating: null,
    grate: null,
    notes: "",
    maxPorhithe: false,
    maxRiserPourCheck: false,
  });

  // Load saved forms from localStorage on component mount
  useEffect(() => {
    try {
      const savedFormsData = localStorage.getItem("savedForms");
      if (savedFormsData) {
        const parsedData = JSON.parse(savedFormsData);
        if (Array.isArray(parsedData)) {
          setSavedForms(parsedData);
        }
      }
    } catch (error) {
      console.error("Error loading saved forms:", error);
    }
  }, []);

  // Save forms to localStorage whenever they change
  useEffect(() => {
    try {
      if (savedForms.length > 0) {
        localStorage.setItem("savedForms", JSON.stringify(savedForms));
      } else {
        localStorage.removeItem("savedForms");
      }
    } catch (error) {
      console.error("Error saving forms:", error);
    }
  }, [savedForms]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form title
    if (!formData.title.trim()) {
      toast.error("Please enter a form title");
      return;
    }

    // Validate form size
    if (!formData.formSize.width || !formData.formSize.length) {
      toast.error("Please enter both width and length for form size");
      return;
    }

    // Validate max pour height
    if (!formData.maxPourHeight) {
      toast.error("Please enter max pour height");
      return;
    }

    // Validate wall thickness
    if (!Object.values(formData.wallThickness).some((value) => value)) {
      toast.error("Please select at least one wall thickness option");
      return;
    }

    // Validate base thickness
    const hasBaseThickness =
      Object.values(formData.baseThickness).some((value) => value === true) ||
      formData.antiSkidBase ||
      formData.clamShell;
    if (!hasBaseThickness) {
      toast.error("Please select at least one base thickness option");
      return;
    }

    // Validate lid thickness
    if (!Object.values(formData.lidThickness).some((value) => value)) {
      toast.error("Please select at least one lid thickness option");
      return;
    }

    if (editingFormId) {
      // Update existing form
      setSavedForms((prevForms) =>
        prevForms.map((form) =>
          form.id === editingFormId ? { ...formData, id: editingFormId } : form
        )
      );
    } else {
      // Create new form
      const newForm: FormData = {
        id: Date.now().toString(),
        ...formData,
      };
      setSavedForms((prevForms) => [...prevForms, newForm]);
    }

    // Reset form data and close modal
    setFormData({
      title: "",
      formSize: {
        width: 0,
        length: 0,
      },
      wallThickness: {
        "6": false,
        "8": false,
        "10": false,
      },
      baseThickness: {
        "6": false,
        "8": false,
        "10": false,
        "12": false,
      },
      lidThickness: {
        "4": false,
        "6": false,
        "8": false,
        "10": false,
        antiSkid: false,
        deck: false,
        clamshell: false,
        trafficRating: null,
        grate: null,
      },
      antiSkidBase: false,
      clamShell: false,
      maxPourHeight: 0,
      maxRiserPour: 0,
      engineered: false,
      dynamicBlocks: false,
      trafficRating: null,
      grate: null,
      notes: "",
      maxPorhithe: false,
      maxRiserPourCheck: false,
    });
    setEditingFormId(null);
    setIsModalOpen(false);
    toast.success("Form saved successfully!");
  };

  const deleteForm = (id: string) => {
    setDeleteConfirmModal({ isOpen: true, formId: id });
  };

  const confirmDelete = () => {
    if (deleteConfirmModal.formId) {
      setSavedForms((prevForms) =>
        prevForms.filter((form) => form.id !== deleteConfirmModal.formId)
      );
      setDeleteConfirmModal({ isOpen: false, formId: null });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmModal({ isOpen: false, formId: null });
  };

  const exportToExcel = async (form: FormData) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Form Details");

    // Add title row with styling
    worksheet.addRow(["Form Details"]).font = { bold: true, size: 14 };
    worksheet.mergeCells("A1:B1");

    // Add data rows
    worksheet.addRow(["Field", "Value"]);
    worksheet.addRow(["Form Title", form.title]);
    worksheet.addRow([
      "Form Size",
      `${form.formSize.width}" x ${form.formSize.length}"`,
    ]);
    worksheet.addRow(["Max Base/wall Pour height", `${form.maxPourHeight}"`]);
    worksheet.addRow(["Max Riser Pour", `${form.maxRiserPour}"`]);
    worksheet.addRow([
      "Wall Thickness",
      Object.entries(form.wallThickness)
        .filter(([_, value]) => value)
        .map(([key]) => `${key}"`)
        .join(", "),
    ]);
    worksheet.addRow([
      "Base Thickness",
      Object.entries(form.baseThickness)
        .filter(([_, value]) => value)
        .map(([key]) => `${key}"`)
        .join(", "),
    ]);
    worksheet.addRow([
      "Lid Thickness",
      Object.entries(form.lidThickness)
        .filter(([_, value]) => value)
        .map(([key]) => {
          if (key === "deck" || key === "clamshell") {
            return key.charAt(0).toUpperCase() + key.slice(1);
          }
          return `${key}"`;
        })
        .join(", "),
    ]);
    worksheet.addRow(["Anti-skid Base", form.antiSkidBase ? "Yes" : "No"]);
    worksheet.addRow(["Clam Shell", form.clamShell ? "Yes" : "No"]);
    worksheet.addRow(["Engineered", form.engineered ? "Yes" : "No"]);
    worksheet.addRow(["Dynamic Blocks", form.dynamicBlocks ? "Yes" : "No"]);
    worksheet.addRow(["Traffic Rating", form.trafficRating ? "Yes" : "No"]);
    worksheet.addRow(["Grate", form.grate ? "Yes" : "No"]);
    worksheet.addRow(["Notes", form.notes || "N/A"]);

    // Style the header row
    worksheet.getRow(2).font = { bold: true };

    // Auto-fit columns
    worksheet.columns.forEach((column: Partial<ExcelJS.Column>) => {
      if (column.width !== undefined) {
        column.width = 20;
      }
    });

    // Generate the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title.replace(/\s+/g, "_")}_form_details.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = (form: FormData) => {
    const doc = new jsPDF();
    autoTable(doc, {
      startY: 25,
      head: [["Field", "Value"]],
      body: [
        ["Form Size", `${form.formSize.width}" x ${form.formSize.length}"`],
        ["Max Base/wall Pour height", `${form.maxPourHeight}"`],
        ["Max Riser Pour", `${form.maxRiserPour}"`],
        [
          "Wall Thickness",
          Object.entries(form.wallThickness)
            .filter(([_, value]) => value)
            .map(([key]) => `${key}"`)
            .join(", "),
        ],
        [
          "Base Thickness",
          [
            ...Object.entries(form.baseThickness)
              .filter(([_, value]) => value)
              .map(([key]) => `${key}"`),
            form.antiSkidBase ? "Anti-skid Base" : "",
            form.clamShell ? "Clam Shell" : "",
          ]
            .filter(Boolean)
            .join(", "),
        ],
        [
          "Lid Thickness",
          Object.entries(form.lidThickness)
            .filter(([_, value]) => value)
            .map(([key]) => {
              if (key === "deck" || key === "clamshell") {
                return key.charAt(0).toUpperCase() + key.slice(1);
              }
              return `${key}"`;
            })
            .join(", "),
        ],
        ["Anti-skid Base", form.antiSkidBase ? "Yes" : "No"],
        ["Clam Shell", form.clamShell ? "Yes" : "No"],
        ["Engineered", form.engineered ? "Yes" : "No"],
        ["Dynamic Blocks", form.dynamicBlocks ? "Yes" : "No"],
        ["Traffic Rating", form.trafficRating ? "Yes" : "No"],
        ["Grate", form.grate ? "Yes" : "No"],
      ],
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 10 },
    });

    // Add title
    doc.setFontSize(16);
    doc.text(form.title, 14, 15);

    // Add notes if they exist
    if (form.notes) {
      const finalY = (doc as any).lastAutoTable.finalY || 100;
      doc.setFontSize(12);
      doc.text("Notes:", 14, finalY + 10);
      doc.setFontSize(10);
      const splitNotes = doc.splitTextToSize(form.notes, 180);
      doc.text(splitNotes, 14, finalY + 20);
    }

    doc.save(`${form.title}_form.pdf`);
  };

  const handleExportClick = (formId: string) => {
    setActiveExportMenu(formId);
  };

  const handleExportClose = () => {
    setActiveExportMenu(null);
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
              Forms Information
            </h2>
          </div>

          {/* Content placeholder */}
          <div className="w-full max-w-5xl text-gray-300 space-y-4 sm:space-y-6">
            {savedForms.length > 0 ? (
              <div className="w-full space-y-4 sm:space-y-6 mt-6 sm:mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {savedForms.map((form) => (
                    <div
                      key={form.id}
                      className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700"
                    >
                      <div className="flex justify-between items-center bg-blue-600 px-4 py-2 rounded-t-xl">
                        <h3 className="text-lg sm:text-xl font-semibold text-white">
                          {form.title}
                        </h3>
                        <div className="text-white flex items-center space-x-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                          <span className="text-sm">Form Details</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="bg-white p-2 rounded-lg border border-gray-100">
                            <p className="text-sm font-medium text-gray-500">
                              Form Size
                            </p>
                            <p className="text-gray-900">
                              {form.formSize.width}" x {form.formSize.length}"
                            </p>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-gray-100">
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Max Base/wall Pour height
                              </p>
                              <p className="text-gray-900 mb-2">
                                {form.maxPourHeight}"
                              </p>
                            </div>
                            <div className="border-t border-gray-200 pt-2">
                              <p className="text-sm font-medium text-gray-500">
                                Max Riser Pour
                              </p>
                              <p className="text-gray-900">
                                {form.maxRiserPour}"
                              </p>
                            </div>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-gray-100">
                            <p className="text-sm font-medium text-gray-500">
                              Wall Thickness
                            </p>
                            <p className="text-gray-900">
                              {Object.entries(form.wallThickness)
                                .filter(([_, value]) => value)
                                .map(([key]) => `${key}"`)
                                .join(", ")}
                            </p>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-gray-100">
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Base Thickness
                              </p>
                              <p className="text-gray-900 mb-2">
                                {[
                                  ...Object.entries(form.baseThickness)
                                    .filter(([_, value]) => value)
                                    .map(([key]) => `${key}"`),
                                  form.antiSkidBase ? "Anti-skid Base" : "",
                                  form.clamShell ? "Clam Shell" : "",
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            </div>
                            <div className="border-t border-gray-200 pt-2">
                              <p className="text-sm font-medium text-gray-500">
                                Lid Thickness
                              </p>
                              <p className="text-gray-900">
                                {Object.entries(form.lidThickness)
                                  .filter(([_, value]) => value)
                                  .map(([key]) => {
                                    if (key === "deck" || key === "clamshell") {
                                      return (
                                        key.charAt(0).toUpperCase() +
                                        key.slice(1)
                                      );
                                    }
                                    return `${key}"`;
                                  })
                                  .join(", ")}
                              </p>
                            </div>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-gray-100">
                            <p className="text-sm font-medium text-gray-500">
                              Anti-skid Base
                            </p>
                            <p className="text-gray-900">
                              {form.antiSkidBase ? "Yes" : "No"}
                            </p>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-gray-100">
                            <p className="text-sm font-medium text-gray-500">
                              Clam Shell
                            </p>
                            <p className="text-gray-900">
                              {form.clamShell ? "Yes" : "No"}
                            </p>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-gray-100">
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Engineered
                              </p>
                              <p className="text-gray-900 mb-2">
                                {form.engineered ? "Yes" : "No"}
                              </p>
                            </div>
                            <div className="border-t border-gray-200 pt-2">
                              <p className="text-sm font-medium text-gray-500">
                                Dynamic Blocks
                              </p>
                              <p className="text-gray-900">
                                {form.dynamicBlocks ? "Yes" : "No"}
                              </p>
                            </div>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-gray-100">
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Traffic Rating
                              </p>
                              <p className="text-gray-900 mb-2">
                                {form.trafficRating === true
                                  ? "Yes"
                                  : form.trafficRating === false
                                  ? "No"
                                  : ""}
                              </p>
                            </div>
                            <div className="border-t border-gray-200 pt-2">
                              <p className="text-sm font-medium text-gray-500">
                                Grate
                              </p>
                              <p className="text-gray-900">
                                {form.grate === true
                                  ? "Yes"
                                  : form.grate === false
                                  ? "No"
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                        {form.notes && (
                          <div className="mt-2 bg-white p-2 rounded-lg border border-gray-100">
                            <p className="text-sm font-medium text-gray-500">
                              Notes
                            </p>
                            <p className="text-gray-900 text-sm">
                              {form.notes}
                            </p>
                          </div>
                        )}
                        <div className="mt-4 flex justify-center space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteForm(form.id);
                            }}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            Delete
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData(form);
                              setEditingFormId(form.id);
                              setIsModalOpen(true);
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExportClick(form.id);
                              }}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                              Export
                            </button>
                            {activeExportMenu === form.id && (
                              <div
                                className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-lg shadow-xl py-1 z-50"
                                onMouseLeave={handleExportClose}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    exportToExcel(form);
                                    handleExportClose();
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                >
                                  Excel
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    exportToPDF(form);
                                    handleExportClose();
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                >
                                  PDF
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  No forms saved yet. Click "Create New Form" to add one.
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
            onClick={() => setIsModalOpen(true)}
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
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Create New Form</span>
          </button>
          {savedForms.length > 0 && (
            <>
              <button
                onClick={async () => {
                  const workbook = new ExcelJS.Workbook();
                  const worksheet = workbook.addWorksheet("Forms");

                  worksheet.columns = [
                    { header: "Form Title", key: "title" },
                    { header: "Form Size", key: "size" },
                    { header: "Wall Thickness", key: "wallThickness" },
                    { header: "Base Thickness", key: "baseThickness" },
                    { header: "Lid Thickness", key: "lidThickness" },
                    { header: "Anti-Skid Base", key: "antiSkidBase" },
                    { header: "Clam Shell", key: "clamShell" },
                    { header: "Max Pour Height", key: "maxPourHeight" },
                    { header: "Engineered", key: "engineered" },
                    { header: "Dynamic Blocks", key: "dynamicBlocks" },
                    { header: "Traffic Rating", key: "trafficRating" },
                    { header: "Grate", key: "grate" },
                    { header: "Notes", key: "notes" },
                  ];

                  savedForms.forEach((form) => {
                    worksheet.addRow({
                      title: form.title,
                      size: `${form.formSize.width}" x ${form.formSize.length}"`,
                      wallThickness: Object.entries(form.wallThickness)
                        .filter(([_, value]) => value)
                        .map(([key]) => `${key}"`)
                        .join(", "),
                      baseThickness: Object.entries(form.baseThickness)
                        .filter(([_, value]) => value)
                        .map(([key]) => `${key}"`)
                        .join(", "),
                      lidThickness: Object.entries(form.lidThickness)
                        .filter(([_, value]) => value)
                        .map(([key]) => {
                          if (key === "deck" || key === "clamshell") {
                            return key.charAt(0).toUpperCase() + key.slice(1);
                          }
                          return `${key}"`;
                        })
                        .join(", "),
                      antiSkidBase: form.antiSkidBase ? "Yes" : "No",
                      clamShell: form.clamShell ? "Yes" : "No",
                      maxPourHeight: form.maxPourHeight,
                      engineered: form.engineered ? "Yes" : "No",
                      dynamicBlocks: form.dynamicBlocks ? "Yes" : "No",
                      trafficRating: form.trafficRating ? "Yes" : "No",
                      grate: form.grate ? "Yes" : "No",
                      notes: form.notes,
                    });
                  });

                  const buffer = await workbook.xlsx.writeBuffer();
                  const blob = new Blob([buffer], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "forms.xlsx";
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
              >
                Export All Forms
              </button>
              <button
                onClick={() => {
                  const doc = new jsPDF();
                  let currentY = 15;

                  // Add title for all forms
                  doc.setFontSize(16);
                  doc.text("All Forms", 14, currentY);
                  currentY += 15;

                  // Create a single table with all forms
                  const allData = savedForms.flatMap((form) =>
                    [
                      ["Form Title", form.title],
                      [
                        "Form Size",
                        `${form.formSize.width}" x ${form.formSize.length}"`,
                      ],
                      ["Max Pour Height", `${form.maxPourHeight}"`],
                      ["Max Base/wall Pour height", `${form.maxPourHeight}"`],
                      ["Max Riser Pour", `${form.maxRiserPour}"`],
                      [
                        "Wall Thickness",
                        Object.entries(form.wallThickness)
                          .filter(([_, value]) => value)
                          .map(([key]) => `${key}"`)
                          .join(", "),
                      ],
                      [
                        "Base Thickness",
                        [
                          ...Object.entries(form.baseThickness)
                            .filter(([_, value]) => value)
                            .map(([key]) => `${key}"`),
                          form.antiSkidBase ? "Anti-skid Base" : "",
                          form.clamShell ? "Clam Shell" : "",
                        ]
                          .filter(Boolean)
                          .join(", "),
                      ],
                      [
                        "Lid Thickness",
                        Object.entries(form.lidThickness)
                          .filter(([_, value]) => value)
                          .map(([key]) => {
                            if (key === "deck" || key === "clamshell") {
                              return key.charAt(0).toUpperCase() + key.slice(1);
                            }
                            return `${key}"`;
                          })
                          .join(", "),
                      ],
                      ["Anti-skid Base", form.antiSkidBase ? "Yes" : "No"],
                      ["Clam Shell", form.clamShell ? "Yes" : "No"],
                      ["Engineered", form.engineered ? "Yes" : "No"],
                      ["Dynamic Blocks", form.dynamicBlocks ? "Yes" : "No"],
                      ["Traffic Rating", form.trafficRating ? "Yes" : "No"],
                      ["Grate", form.grate ? "Yes" : "No"],
                      form.notes ? ["Notes", form.notes] : [],
                      ["", ""], // Empty row for spacing between forms
                    ].filter((row) => row.length > 0)
                  );

                  autoTable(doc, {
                    startY: currentY,
                    head: [["Field", "Value"]],
                    body: allData,
                    theme: "grid",
                    headStyles: { fillColor: [59, 130, 246] },
                    styles: { fontSize: 9 },
                    columnStyles: {
                      0: { cellWidth: 60 },
                      1: { cellWidth: 120 },
                    },
                  });

                  doc.save("all_forms.pdf");
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
                <span>Export All as PDF</span>
              </button>
            </>
          )}
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-gray-800 rounded-xl p-4 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Create New Form
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
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
                  Form Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="width"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Form Width (inches) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="width"
                    value={formData.formSize.width || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        formSize: {
                          ...formData.formSize,
                          width: e.target.value ? Number(e.target.value) : 0,
                        },
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="length"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Form Length (inches) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="length"
                    value={formData.formSize.length || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        formSize: {
                          ...formData.formSize,
                          length: e.target.value ? Number(e.target.value) : 0,
                        },
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Wall Thickness (inches){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="wall6"
                      checked={formData.wallThickness["6"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          wallThickness: {
                            ...formData.wallThickness,
                            "6": e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="wall6"
                      className="text-sm font-medium text-gray-300"
                    >
                      6"
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="wall8"
                      checked={formData.wallThickness["8"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          wallThickness: {
                            ...formData.wallThickness,
                            "8": e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="wall8"
                      className="text-sm font-medium text-gray-300"
                    >
                      8"
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="wall10"
                      checked={formData.wallThickness["10"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          wallThickness: {
                            ...formData.wallThickness,
                            "10": e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="wall10"
                      className="text-sm font-medium text-gray-300"
                    >
                      10"
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Lid Thickness (inches) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="lid4"
                      checked={formData.lidThickness["4"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lidThickness: {
                            ...formData.lidThickness,
                            "4": e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="lid4"
                      className="text-sm font-medium text-gray-300"
                    >
                      4"
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="lid6"
                      checked={formData.lidThickness["6"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lidThickness: {
                            ...formData.lidThickness,
                            "6": e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="lid6"
                      className="text-sm font-medium text-gray-300"
                    >
                      6"
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="lid8"
                      checked={formData.lidThickness["8"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lidThickness: {
                            ...formData.lidThickness,
                            "8": e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="lid8"
                      className="text-sm font-medium text-gray-300"
                    >
                      8"
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="lid10"
                      checked={formData.lidThickness["10"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lidThickness: {
                            ...formData.lidThickness,
                            "10": e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="lid10"
                      className="text-sm font-medium text-gray-300"
                    >
                      10"
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="antiSkidLid"
                      checked={formData.lidThickness.antiSkid}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lidThickness: {
                            ...formData.lidThickness,
                            antiSkid: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="antiSkidLid"
                      className="text-sm font-medium text-gray-300"
                    >
                      Anti-skid Lid
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="deck"
                      checked={formData.lidThickness.deck}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lidThickness: {
                            ...formData.lidThickness,
                            deck: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="deck"
                      className="text-sm font-medium text-gray-300"
                    >
                      Deck
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="clamshell"
                      checked={formData.lidThickness.clamshell}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lidThickness: {
                            ...formData.lidThickness,
                            clamshell: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="clamshell"
                      className="text-sm font-medium text-gray-300"
                    >
                      Clamshell
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Traffic Rating
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="trafficRatingYes"
                          name="trafficRating"
                          checked={formData.trafficRating === true}
                          onChange={(e) => {
                            console.log("Setting Traffic Rating to Yes");
                            setFormData((prev) => ({
                              ...prev,
                              trafficRating:
                                prev.trafficRating === true ? null : true,
                            }));
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor="trafficRatingYes"
                          className="text-sm font-medium text-gray-300"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="trafficRatingNo"
                          name="trafficRating"
                          checked={formData.trafficRating === false}
                          onChange={(e) => {
                            console.log("Setting Traffic Rating to No");
                            setFormData((prev) => ({
                              ...prev,
                              trafficRating:
                                prev.trafficRating === false ? null : false,
                            }));
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor="trafficRatingNo"
                          className="text-sm font-medium text-gray-300"
                        >
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Grate
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="grateYes"
                          name="grate"
                          checked={formData.grate === true}
                          onChange={(e) => {
                            console.log("Setting Grate to Yes");
                            setFormData((prev) => ({
                              ...prev,
                              grate: prev.grate === true ? null : true,
                            }));
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor="grateYes"
                          className="text-sm font-medium text-gray-300"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="grateNo"
                          name="grate"
                          checked={formData.grate === false}
                          onChange={(e) => {
                            console.log("Setting Grate to No");
                            setFormData((prev) => ({
                              ...prev,
                              grate: prev.grate === false ? null : false,
                            }));
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor="grateNo"
                          className="text-sm font-medium text-gray-300"
                        >
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Base Thickness (inches){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="base6"
                      checked={formData.baseThickness["6"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          baseThickness: {
                            ...formData.baseThickness,
                            "6": e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="base6"
                      className="text-sm font-medium text-gray-300"
                    >
                      6"
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="base8"
                      checked={formData.baseThickness["8"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          baseThickness: {
                            ...formData.baseThickness,
                            "8": e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="base8"
                      className="text-sm font-medium text-gray-300"
                    >
                      8"
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="base10"
                      checked={formData.baseThickness["10"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          baseThickness: {
                            ...formData.baseThickness,
                            "10": e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="base10"
                      className="text-sm font-medium text-gray-300"
                    >
                      10"
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="base12"
                      checked={formData.baseThickness["12"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          baseThickness: {
                            ...formData.baseThickness,
                            "12": e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="base12"
                      className="text-sm font-medium text-gray-300"
                    >
                      12"
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="antiSkidBase"
                      checked={formData.antiSkidBase}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          antiSkidBase: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="antiSkidBase"
                      className="text-sm font-medium text-gray-300"
                    >
                      Anti-skid Base
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="clamShell"
                      checked={formData.clamShell}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          clamShell: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="clamShell"
                      className="text-sm font-medium text-gray-300"
                    >
                      Clam Shell
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="maxPourHeight"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Max Base/wall Pour height (inches){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="maxPourHeight"
                  value={formData.maxPourHeight || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxPourHeight: e.target.value
                        ? Number(e.target.value)
                        : 0,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="maxRiserPour"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Max Riser Pour (inches){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="maxRiserPour"
                  value={formData.maxRiserPour || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxRiserPour: e.target.value ? Number(e.target.value) : 0,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="engineered"
                    checked={formData.engineered}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        engineered: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="engineered"
                    className="text-sm font-medium text-gray-300"
                  >
                    Engineered
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="dynamicBlocks"
                    checked={formData.dynamicBlocks}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dynamicBlocks: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="dynamicBlocks"
                    className="text-sm font-medium text-gray-300"
                  >
                    Dynamic Blocks
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
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
              <h3 className="text-xl font-bold text-white mb-4">Delete Form</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this form? This action cannot be
                undone.
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
