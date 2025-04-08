"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface TypesFormHolesData {
  id: string;
  description: string;
  wallThickness: string;
  type: "foam" | "former";
  holeDiameter: string;
  skewedHoles: string;
  // Removed holeType and dimensions
}

export default function TypesFormHolesPage() {
  const [savedForms, setSavedForms] = useState<TypesFormHolesData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<TypesFormHolesData, "id">>({
    description: "",
    wallThickness: "",
    type: "foam",
    holeDiameter: "",
    skewedHoles: "",
  });
  const [jobInfo, setJobInfo] = useState({
    jobName: "",
    jobNumber: "",
  });
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    formId: string | null;
  }>({
    isOpen: false,
    formId: null,
  });

  // Load saved forms from localStorage on component mount
  useEffect(() => {
    try {
      const savedFormsData = localStorage.getItem("typesFormHoles");
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
        localStorage.setItem("typesFormHoles", JSON.stringify(savedForms));
      } else {
        localStorage.removeItem("typesFormHoles");
      }
    } catch (error) {
      console.error("Error saving forms:", error);
    }
  }, [savedForms]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.wallThickness || !formData.type) {
      alert("Please fill in all required fields");
      return;
    }

    // Check if at least one of holeDiameter or skewedHoles is provided
    if (!formData.holeDiameter && !formData.skewedHoles) {
      alert("Please enter either a hole diameter or skewed holes");
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
      const newForm: TypesFormHolesData = {
        id: Date.now().toString(),
        ...formData,
      };
      setSavedForms((prevForms) => [...prevForms, newForm]);
    }

    // Reset form and close modal
    setFormData({
      description: "",
      wallThickness: "",
      type: "foam",
      holeDiameter: "",
      skewedHoles: "",
    });
    setEditingFormId(null);
    setIsModalOpen(false);
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

  const exportToExcel = () => {
    const summaryData = {
      foam: savedForms
        .filter((form) => form.type === "foam")
        .reduce(
          (acc, form) => {
            const wallKey = `${form.wallThickness} inch wall`;
            if (!acc[wallKey]) {
              acc[wallKey] = {
                roundHoles: {} as Record<string, number>,
                skewedHoles: {} as Record<string, number>,
              };
            }
            if (form.holeDiameter) {
              const holeKey = `${form.holeDiameter}"`;
              acc[wallKey].roundHoles[holeKey] =
                (acc[wallKey].roundHoles[holeKey] || 0) + 1;
            }
            if (form.skewedHoles) {
              acc[wallKey].skewedHoles[form.skewedHoles] =
                (acc[wallKey].skewedHoles[form.skewedHoles] || 0) + 1;
            }
            return acc;
          },
          {} as Record<
            string,
            {
              roundHoles: Record<string, number>;
              skewedHoles: Record<string, number>;
            }
          >
        ),
      former: savedForms
        .filter((form) => form.type === "former")
        .reduce(
          (acc, form) => {
            const wallKey = `${form.wallThickness} inch wall`;
            if (!acc[wallKey]) {
              acc[wallKey] = {
                roundHoles: {} as Record<string, number>,
                skewedHoles: {} as Record<string, number>,
              };
            }
            if (form.holeDiameter) {
              const holeKey = `${form.holeDiameter}"`;
              acc[wallKey].roundHoles[holeKey] =
                (acc[wallKey].roundHoles[holeKey] || 0) + 1;
            }
            if (form.skewedHoles) {
              acc[wallKey].skewedHoles[form.skewedHoles] =
                (acc[wallKey].skewedHoles[form.skewedHoles] || 0) + 1;
            }
            return acc;
          },
          {} as Record<
            string,
            {
              roundHoles: Record<string, number>;
              skewedHoles: Record<string, number>;
            }
          >
        ),
    };

    // Create a workbook with a single sheet
    const workbook = XLSX.utils.book_new();

    // Prepare data for the worksheet
    const worksheetData = [
      ["Hole Summary Report", "", "", ""],
      ["Generated on:", new Date().toLocaleDateString(), "", ""],
      ["", "", "", ""],
      ["Type", "Wall Thickness", "Hole Type", "Count"],
    ];

    // Add Foam data
    Object.entries(summaryData.foam).forEach(([wallThickness, data]) => {
      // Add wall thickness header
      worksheetData.push(["Foam", wallThickness, "", ""]);

      // Add round holes
      Object.entries(data.roundHoles).forEach(([size, count]) => {
        worksheetData.push(["", "", `Round ${size}`, count.toString()]);
      });

      // Add skewed holes
      Object.entries(data.skewedHoles).forEach(([size, count]) => {
        worksheetData.push(["", "", `Skewed ${size}`, count.toString()]);
      });

      // Add empty row for spacing
      worksheetData.push(["", "", "", ""]);
    });

    // Add Former data
    Object.entries(summaryData.former).forEach(([wallThickness, data]) => {
      // Add wall thickness header
      worksheetData.push(["Former", wallThickness, "", ""]);

      // Add round holes
      Object.entries(data.roundHoles).forEach(([size, count]) => {
        worksheetData.push(["", "", `Round ${size}`, count.toString()]);
      });

      // Add skewed holes
      Object.entries(data.skewedHoles).forEach(([size, count]) => {
        worksheetData.push(["", "", `Skewed ${size}`, count.toString()]);
      });

      // Add empty row for spacing
      worksheetData.push(["", "", "", ""]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 15 }, // Type
      { wch: 20 }, // Wall Thickness
      { wch: 20 }, // Hole Type
      { wch: 10 }, // Count
    ];

    // Add some basic styling
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!worksheet[cell_ref]) continue;

        // Style headers
        if (R === 0 || R === 3) {
          worksheet[cell_ref].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "E6E6E6" } },
            alignment: { horizontal: "center" },
          };
        }

        // Style wall thickness rows
        if (R > 3 && C === 1 && worksheet[cell_ref].v) {
          worksheet[cell_ref].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "F2F2F2" } },
          };
        }

        // Style hole type rows
        if (R > 3 && C === 2 && worksheet[cell_ref].v) {
          worksheet[cell_ref].s = {
            alignment: { indent: 1 },
          };
        }
      }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Hole Summary");
    XLSX.writeFile(workbook, "hole_summary.xlsx");
  };

  const exportToPDF = () => {
    const summaryData = {
      foam: savedForms
        .filter((form) => form.type === "foam")
        .reduce(
          (acc, form) => {
            const wallKey = `${form.wallThickness} inch wall`;
            if (!acc[wallKey]) {
              acc[wallKey] = {
                roundHoles: {} as Record<string, number>,
                skewedHoles: {} as Record<string, number>,
              };
            }
            if (form.holeDiameter) {
              const holeKey = `${form.holeDiameter}"`;
              acc[wallKey].roundHoles[holeKey] =
                (acc[wallKey].roundHoles[holeKey] || 0) + 1;
            }
            if (form.skewedHoles) {
              acc[wallKey].skewedHoles[form.skewedHoles] =
                (acc[wallKey].skewedHoles[form.skewedHoles] || 0) + 1;
            }
            return acc;
          },
          {} as Record<
            string,
            {
              roundHoles: Record<string, number>;
              skewedHoles: Record<string, number>;
            }
          >
        ),
      former: savedForms
        .filter((form) => form.type === "former")
        .reduce(
          (acc, form) => {
            const wallKey = `${form.wallThickness} inch wall`;
            if (!acc[wallKey]) {
              acc[wallKey] = {
                roundHoles: {} as Record<string, number>,
                skewedHoles: {} as Record<string, number>,
              };
            }
            if (form.holeDiameter) {
              const holeKey = `${form.holeDiameter}"`;
              acc[wallKey].roundHoles[holeKey] =
                (acc[wallKey].roundHoles[holeKey] || 0) + 1;
            }
            if (form.skewedHoles) {
              acc[wallKey].skewedHoles[form.skewedHoles] =
                (acc[wallKey].skewedHoles[form.skewedHoles] || 0) + 1;
            }
            return acc;
          },
          {} as Record<
            string,
            {
              roundHoles: Record<string, number>;
              skewedHoles: Record<string, number>;
            }
          >
        ),
    };

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Add company header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Lindsay Precast", pageWidth / 2, yPos, { align: "center" });
    yPos += 10;

    // Add job information if available
    if (jobInfo.jobName || jobInfo.jobNumber) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      if (jobInfo.jobName) {
        doc.text(`Job Name: ${jobInfo.jobName}`, pageWidth / 2, yPos, {
          align: "center",
        });
        yPos += 8;
      }
      if (jobInfo.jobNumber) {
        doc.text(`Job Number: ${jobInfo.jobNumber}`, pageWidth / 2, yPos, {
          align: "center",
        });
        yPos += 8;
      }
      yPos += 5;
    }

    // Add order form title
    doc.setFontSize(14);
    doc.text("Hole Order Sheet", pageWidth / 2, yPos, { align: "center" });
    yPos += 10;

    // Add date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      yPos,
      { align: "center" }
    );
    yPos += 20;

    // Prepare data for the table
    const tableData = [];
    let foamTotal = 0;
    let formerTotal = 0;

    // Add Foam data first (without total)
    Object.entries(summaryData.foam).forEach(([wallThickness, data]) => {
      // Add round holes
      Object.entries(data.roundHoles).forEach(([size, count]) => {
        tableData.push({
          type: "Foam",
          wallThickness,
          holeType: `Round ${size}`,
          quantity: count,
          description: "",
        });
        foamTotal += count;
      });

      // Add skewed holes
      Object.entries(data.skewedHoles).forEach(([size, count]) => {
        tableData.push({
          type: "Foam",
          wallThickness,
          holeType: `Skewed ${size}`,
          quantity: count,
          description: "",
        });
        foamTotal += count;
      });
    });

    // Add Former data second (without total)
    Object.entries(summaryData.former).forEach(([wallThickness, data]) => {
      // Add round holes
      Object.entries(data.roundHoles).forEach(([size, count]) => {
        tableData.push({
          type: "Former",
          wallThickness,
          holeType: `Round ${size}`,
          quantity: count,
          description: "",
        });
        formerTotal += count;
      });

      // Add skewed holes
      Object.entries(data.skewedHoles).forEach(([size, count]) => {
        tableData.push({
          type: "Former",
          wallThickness,
          holeType: `Skewed ${size}`,
          quantity: count,
          description: "",
        });
        formerTotal += count;
      });
    });

    // Add both totals at the bottom
    if (foamTotal > 0) {
      tableData.push({
        type: "Foam",
        wallThickness: "",
        holeType: "TOTAL",
        quantity: foamTotal,
        description: "",
      });
    }

    if (formerTotal > 0) {
      tableData.push({
        type: "Former",
        wallThickness: "",
        holeType: "TOTAL",
        quantity: formerTotal,
        description: "",
      });
    }

    // Create the table
    autoTable(doc, {
      startY: yPos,
      head: [
        ["Type", "Wall Thickness", "Hole Type", "Quantity", "Description"],
      ],
      body: tableData.map((row) => {
        // Check if this is a total row
        const isTotal = row.holeType === "TOTAL";

        return [
          {
            content: row.type,
            styles: isTotal
              ? {
                  textColor: [0, 0, 0],
                  fontStyle: "bold",
                  fontSize: 14,
                }
              : undefined,
          },
          row.wallThickness,
          {
            content: row.holeType,
            styles: isTotal
              ? {
                  textColor: [0, 0, 0],
                  fontStyle: "bold",
                  fontSize: 14,
                }
              : undefined,
          },
          {
            content: row.quantity,
            styles: {
              textColor: [0, 0, 0],
              fontStyle: "bold",
              fontSize: isTotal ? 14 : undefined,
            },
          },
          row.description,
        ];
      }),
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 10,
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 40 },
        2: { cellWidth: 50 },
        3: { cellWidth: 30, halign: "center" },
        4: { cellWidth: 40 },
      },
      styles: {
        cellPadding: 5,
        lineColor: [41, 128, 185],
        lineWidth: 0.5,
      },
      didDrawCell: (data: any) => {
        // Style the total rows
        if (
          data.row.index === tableData.length - 1 ||
          (foamTotal > 0 &&
            formerTotal > 0 &&
            data.row.index === tableData.length - 2)
        ) {
          // Set background color
          data.cell.styles.fillColor = [255, 255, 255];
          // Add a border
          data.doc.setDrawColor(41, 128, 185);
          data.doc.rect(
            data.cell.x,
            data.cell.y,
            data.cell.width,
            data.cell.height,
            "S"
          );
        }
      },
    });

    // Add footer
    const finalY = (doc as any).lastAutoTable.finalY || yPos;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Please review quantities and descriptions",
      pageWidth / 2,
      finalY + 20,
      { align: "center" }
    );

    doc.save("hole_order_sheet.pdf");
  };

  const getHoleSummary = () => {
    const summary: Record<
      string,
      {
        counts: { form: number };
      }
    > = {};

    savedForms.forEach((form) => {
      const holeSize = `${form.holeDiameter} inches`;
      const key = `${form.wallThickness} inch wall - ${holeSize}`;

      if (!summary[key]) {
        summary[key] = {
          counts: { form: 0 },
        };
      }
      summary[key].counts.form++;
    });

    // Sort the summary entries by wall thickness and then by hole size
    return Object.fromEntries(
      Object.entries(summary).sort(([a], [b]) => {
        const [aWall, aSize] = a.split(" - ");
        const [bWall, bSize] = b.split(" - ");

        // First sort by wall thickness
        const wallCompare = parseInt(aWall) - parseInt(bWall);
        if (wallCompare !== 0) return wallCompare;

        // Then sort by hole size
        return aSize.localeCompare(bSize);
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 transition-colors duration-300">
      <Navbar />
      <main className="w-full max-w-[1920px] mx-auto px-8 sm:px-12 lg:px-16 pb-24 mt-16">
        <div className="flex flex-col items-center space-y-6 sm:space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl sm:text-6xl font-bold text-white">
              Lindsay Precast
            </h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-300">
              Types Form Holes
            </h2>
          </div>

          {/* Summary Section */}
          {savedForms.length > 0 && (
            <div className="w-full max-w-5xl bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
                Hole Summary
              </h3>

              {/* Job Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="jobName"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Job Name
                  </label>
                  <input
                    type="text"
                    id="jobName"
                    value={jobInfo.jobName}
                    onChange={(e) =>
                      setJobInfo({ ...jobInfo, jobName: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter job name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="jobNumber"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Job Number
                  </label>
                  <input
                    type="text"
                    id="jobNumber"
                    value={jobInfo.jobNumber}
                    onChange={(e) =>
                      setJobInfo({ ...jobInfo, jobNumber: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter job number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Foam Summary */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Foam Holes
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(
                      savedForms
                        .filter((form) => form.type === "foam")
                        .reduce(
                          (acc, form) => {
                            const wallKey = `${form.wallThickness} inch wall`;
                            if (!acc[wallKey]) {
                              acc[wallKey] = {
                                roundHoles: {} as Record<string, number>,
                                skewedHoles: {} as Record<string, number>,
                              };
                            }
                            if (form.holeDiameter) {
                              const holeKey = `${form.holeDiameter}"`;
                              acc[wallKey].roundHoles[holeKey] =
                                (acc[wallKey].roundHoles[holeKey] || 0) + 1;
                            }
                            if (form.skewedHoles) {
                              acc[wallKey].skewedHoles[form.skewedHoles] =
                                (acc[wallKey].skewedHoles[form.skewedHoles] ||
                                  0) + 1;
                            }
                            return acc;
                          },
                          {} as Record<
                            string,
                            {
                              roundHoles: Record<string, number>;
                              skewedHoles: Record<string, number>;
                            }
                          >
                        )
                    ).map(([wallThickness, data]) => (
                      <div key={wallThickness} className="space-y-2">
                        <h5 className="text-gray-300 font-medium">
                          {wallThickness}
                        </h5>
                        {Object.entries(data.roundHoles).length > 0 && (
                          <div className="ml-2">
                            <div className="text-sm text-gray-400 mb-1">
                              Round Holes:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(data.roundHoles).map(
                                ([size, count]) => (
                                  <div
                                    key={size}
                                    className="text-sm text-gray-300"
                                  >
                                    {size}: {count}{" "}
                                    {count === 1 ? "hole" : "holes"}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                        {Object.entries(data.skewedHoles).length > 0 && (
                          <div className="ml-2">
                            <div className="text-sm text-gray-400 mb-1">
                              Skewed Holes:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(data.skewedHoles).map(
                                ([size, count]) => (
                                  <div
                                    key={size}
                                    className="text-sm text-gray-300"
                                  >
                                    {size}: {count}{" "}
                                    {count === 1 ? "hole" : "holes"}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Former Summary */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Former Holes
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(
                      savedForms
                        .filter((form) => form.type === "former")
                        .reduce(
                          (acc, form) => {
                            const wallKey = `${form.wallThickness} inch wall`;
                            if (!acc[wallKey]) {
                              acc[wallKey] = {
                                roundHoles: {} as Record<string, number>,
                                skewedHoles: {} as Record<string, number>,
                              };
                            }
                            if (form.holeDiameter) {
                              const holeKey = `${form.holeDiameter}"`;
                              acc[wallKey].roundHoles[holeKey] =
                                (acc[wallKey].roundHoles[holeKey] || 0) + 1;
                            }
                            if (form.skewedHoles) {
                              acc[wallKey].skewedHoles[form.skewedHoles] =
                                (acc[wallKey].skewedHoles[form.skewedHoles] ||
                                  0) + 1;
                            }
                            return acc;
                          },
                          {} as Record<
                            string,
                            {
                              roundHoles: Record<string, number>;
                              skewedHoles: Record<string, number>;
                            }
                          >
                        )
                    ).map(([wallThickness, data]) => (
                      <div key={wallThickness} className="space-y-2">
                        <h5 className="text-gray-300 font-medium">
                          {wallThickness}
                        </h5>
                        {Object.entries(data.roundHoles).length > 0 && (
                          <div className="ml-2">
                            <div className="text-sm text-gray-400 mb-1">
                              Round Holes:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(data.roundHoles).map(
                                ([size, count]) => (
                                  <div
                                    key={size}
                                    className="text-sm text-gray-300"
                                  >
                                    {size}: {count}{" "}
                                    {count === 1 ? "hole" : "holes"}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                        {Object.entries(data.skewedHoles).length > 0 && (
                          <div className="ml-2">
                            <div className="text-sm text-gray-400 mb-1">
                              Skewed Holes:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(data.skewedHoles).map(
                                ([size, count]) => (
                                  <div
                                    key={size}
                                    className="text-sm text-gray-300"
                                  >
                                    {size}: {count}{" "}
                                    {count === 1 ? "hole" : "holes"}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content placeholder */}
          <div className="w-full max-w-5xl text-gray-300 space-y-4 sm:space-y-6">
            {savedForms.length > 0 ? (
              <div className="w-full space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
                  Saved Forms
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {savedForms.map((form) => (
                    <div
                      key={form.id}
                      className="bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {form.type.charAt(0).toUpperCase() +
                              form.type.slice(1)}
                          </h3>
                          <div className="mt-2 space-y-1">
                            <p className="text-gray-300">
                              <span className="font-medium">
                                Wall Thickness:
                              </span>{" "}
                              {form.wallThickness} inches
                            </p>
                            <p className="text-gray-300">
                              <span className="font-medium">
                                Hole Diameter:
                              </span>{" "}
                              {form.holeDiameter} inches
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setFormData(form);
                              setEditingFormId(form.id);
                              setIsModalOpen(true);
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteForm(form.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
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

      {/* Footer with Create Button and Export Buttons */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-center space-x-4">
          <button
            onClick={() => {
              setFormData({
                description: "",
                wallThickness: "",
                type: "foam",
                holeDiameter: "",
                skewedHoles: "",
              });
              setEditingFormId(null);
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
            <span>Create New Form Hold</span>
          </button>

          <button
            onClick={exportToExcel}
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
            <span>Export to Excel</span>
          </button>

          <button
            onClick={exportToPDF}
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
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            <span>Export to PDF</span>
          </button>
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingFormId ? "Edit Form Holes" : "Create New Form Holes"}
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
                  htmlFor="wallThickness"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Wall Thickness
                </label>
                <select
                  id="wallThickness"
                  value={formData.wallThickness}
                  onChange={(e) =>
                    setFormData({ ...formData, wallThickness: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Wall Thickness</option>
                  <option value="4">4 inches</option>
                  <option value="6">6 inches</option>
                  <option value="8">8 inches</option>
                  <option value="10">10 inches</option>
                  <option value="12">12 inches</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="holeDiameter"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Hole Diameter (inches)
                </label>
                <input
                  type="number"
                  id="holeDiameter"
                  value={formData.holeDiameter}
                  onChange={(e) =>
                    setFormData({ ...formData, holeDiameter: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter hole diameter"
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label
                  htmlFor="skewedHoles"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Skewed Holes (inches)
                </label>
                <input
                  type="text"
                  id="skewedHoles"
                  value={formData.skewedHoles}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty string or format like 25x45
                    if (value === "" || /^(\d+)?x?(\d+)?$/.test(value)) {
                      setFormData({ ...formData, skewedHoles: value });
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter in format 25x45"
                />
                <p className="mt-1 text-sm text-gray-400">
                  Format: 25x45 (width x length in inches)
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Type
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="foam"
                      checked={formData.type === "foam"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as "foam" | "former",
                        })
                      }
                      className="form-radio h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-300">Foam</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="former"
                      checked={formData.type === "former"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as "foam" | "former",
                        })
                      }
                      className="form-radio h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-300">Former</span>
                  </label>
                </div>
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
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
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
