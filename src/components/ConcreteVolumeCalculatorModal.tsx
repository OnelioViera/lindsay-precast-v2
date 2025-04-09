import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ConcreteVolumeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Unit = "feet" | "inches";
type Shape = "round" | "square";

interface Dimension {
  value: string;
  unit: Unit;
}

interface Dimensions {
  shape: Shape;
  diameter: Dimension;
  length: Dimension;
  width: Dimension;
  depth: Dimension;
  quantity: string;
}

interface CalculationResult {
  volumeCubicFeet: number;
  volumeCubicYards: number;
  volumeCubicMeters: number;
  weightLbs: number;
  weightKg: number;
}

export default function ConcreteVolumeCalculatorModal({
  isOpen,
  onClose,
}: ConcreteVolumeCalculatorModalProps) {
  const [dimensions, setDimensions] = useState<Dimensions>({
    shape: "round",
    diameter: { value: "0", unit: "inches" },
    length: { value: "0", unit: "inches" },
    width: { value: "0", unit: "inches" },
    depth: { value: "0", unit: "inches" },
    quantity: "1",
  });
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateConcrete = () => {
    const d = parseFloat(dimensions.diameter.value);
    const l = parseFloat(dimensions.length.value);
    const w = parseFloat(dimensions.width.value);
    const h = parseFloat(dimensions.depth.value);
    const q = parseFloat(dimensions.quantity);

    if (isNaN(h) || isNaN(q)) {
      return;
    }

    // Convert all measurements to feet
    const depthInFeet = dimensions.depth.unit === "inches" ? h / 12 : h;
    let volumeCubicFeet;

    if (dimensions.shape === "round") {
      if (isNaN(d)) return;
      const diameterInFeet = dimensions.diameter.unit === "inches" ? d / 12 : d;
      const radius = diameterInFeet / 2;
      volumeCubicFeet = Math.PI * radius * radius * depthInFeet * q;
    } else {
      if (isNaN(l) || isNaN(w)) return;
      const lengthInFeet = dimensions.length.unit === "inches" ? l / 12 : l;
      const widthInFeet = dimensions.width.unit === "inches" ? w / 12 : w;
      volumeCubicFeet = lengthInFeet * widthInFeet * depthInFeet * q;
    }

    // Convert to other volume units
    const volumeCubicYards = volumeCubicFeet / 27;
    const volumeCubicMeters = volumeCubicFeet * 0.0283168;

    // Calculate weight using standard concrete density of 150 lbs/ft³
    const weightLbs = volumeCubicFeet * 150;
    const weightKg = weightLbs * 0.453592;

    setResult({
      volumeCubicFeet,
      volumeCubicYards,
      volumeCubicMeters,
      weightLbs,
      weightKg,
    });
  };

  const handleShapeChange = (shape: Shape) => {
    setDimensions((prev) => ({
      ...prev,
      shape,
    }));
    setResult(null);
  };

  const handleInputChange = (field: keyof Dimensions, value: string) => {
    if (field === "quantity") {
      setDimensions((prev) => ({ ...prev, [field]: value }));
    } else if (field !== "shape") {
      setDimensions((prev) => {
        const dimension = prev[field] as Dimension;
        return {
          ...prev,
          [field]: { ...dimension, value },
        };
      });
    }
    setResult(null);
  };

  const handleUnitChange = (
    field: keyof Omit<Dimensions, "quantity" | "shape">,
    unit: Unit
  ) => {
    setDimensions((prev) => {
      const dimension = prev[field] as Dimension;
      return {
        ...prev,
        [field]: { ...dimension, unit },
      };
    });
    setResult(null);
  };

  const handleFocus = (field: keyof Dimensions) => {
    if (field === "quantity") {
      if (dimensions[field] === "0") {
        setDimensions((prev) => ({ ...prev, [field]: "" }));
      }
    } else if (field !== "shape") {
      if ((dimensions[field] as Dimension).value === "0") {
        setDimensions((prev) => ({
          ...prev,
          [field]: { ...(prev[field] as Dimension), value: "" },
        }));
      }
    }
  };

  const handleBlur = (field: keyof Dimensions) => {
    if (field === "quantity") {
      if (dimensions[field] === "") {
        setDimensions((prev) => ({ ...prev, [field]: "0" }));
      }
    } else if (field !== "shape") {
      if ((dimensions[field] as Dimension).value === "") {
        setDimensions((prev) => ({
          ...prev,
          [field]: { ...(prev[field] as Dimension), value: "0" },
        }));
      }
    }
  };

  const handleClear = () => {
    setDimensions({
      shape: "round",
      diameter: { value: "0", unit: "inches" },
      length: { value: "0", unit: "inches" },
      width: { value: "0", unit: "inches" },
      depth: { value: "0", unit: "inches" },
      quantity: "1",
    });
    setResult(null);
  };

  const handleExportPDF = () => {
    if (!result) return;

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text("Concrete Weight Calculator Results", 20, 20);

    // Add calculation details
    doc.setFontSize(12);
    doc.text(`Shape: ${dimensions.shape}`, 20, 30);
    if (dimensions.shape === "round") {
      doc.text(
        `Diameter: ${dimensions.diameter.value} ${dimensions.diameter.unit}`,
        20,
        40
      );
    } else {
      doc.text(
        `Length: ${dimensions.length.value} ${dimensions.length.unit}`,
        20,
        40
      );
      doc.text(
        `Width: ${dimensions.width.value} ${dimensions.width.unit}`,
        20,
        50
      );
    }
    doc.text(
      `Depth: ${dimensions.depth.value} ${dimensions.depth.unit}`,
      20,
      60
    );

    // Add results
    doc.setFontSize(14);
    doc.text("Results:", 20, 80);

    // Create table data
    const tableData = [
      [
        "Weight",
        `${result?.weightLbs?.toFixed(2) ?? "0.00"} lbs`,
        `${result?.weightKg?.toFixed(2) ?? "0.00"} kg`,
        `${((result?.weightLbs ?? 0) / 2000).toFixed(2)} tons`,
      ],
      [
        "Volume",
        `${result?.volumeCubicYards?.toFixed(2) ?? "0.00"} cubic yards`,
        `${result?.volumeCubicFeet?.toFixed(2) ?? "0.00"} cubic feet`,
        `${result?.volumeCubicMeters?.toFixed(2) ?? "0.00"} cubic meters`,
      ],
    ];

    // Add table
    autoTable(doc, {
      startY: 90,
      head: [["Measurement", "Value 1", "Value 2", "Value 3"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 },
    });

    // Add timestamp
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      20,
      (doc as any).lastAutoTable.finalY + 20
    );

    // Save the PDF
    doc.save("concrete_calculator_results.pdf");
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-lg bg-gray-800 px-6 pb-6 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-8">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-gray-800 text-gray-400 hover:text-gray-300"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-bold leading-6 text-white mb-8"
                    >
                      Concrete Weight Calculator
                    </Dialog.Title>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Results Section */}
                      <div className="bg-gray-700 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">
                          Results
                        </h4>
                        {result !== null ? (
                          <div className="space-y-4">
                            <div className="bg-gray-800 rounded-lg p-4">
                              <p className="text-gray-300 text-sm">Weight</p>
                              <p className="text-2xl font-bold text-blue-400">
                                {Math.round(result.weightLbs).toLocaleString()}{" "}
                                lbs
                              </p>
                              <p className="text-lg text-gray-400">
                                ({Math.round(result.weightKg)} kg)
                              </p>
                              <p className="text-lg text-gray-400">
                                ({(result.weightLbs / 2000).toFixed(2)} tons)
                              </p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                              <p className="text-gray-300 text-sm">Volume</p>
                              <p className="text-xl font-bold text-blue-400">
                                {result.volumeCubicYards.toFixed(2)} cubic yards
                              </p>
                              <p className="text-lg text-gray-400">
                                ({result.volumeCubicFeet.toFixed(2)} cubic feet)
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-center py-8">
                            Enter dimensions to see results
                          </div>
                        )}
                      </div>

                      {/* Inputs Section */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Shape
                          </label>
                          <div className="flex space-x-4">
                            <button
                              onClick={() => handleShapeChange("round")}
                              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                                dimensions.shape === "round"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              }`}
                            >
                              Round
                            </button>
                            <button
                              onClick={() => handleShapeChange("square")}
                              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                                dimensions.shape === "square"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              }`}
                            >
                              Square
                            </button>
                          </div>
                        </div>

                        {dimensions.shape === "round" ? (
                          <div>
                            <label
                              htmlFor="diameter"
                              className="block text-sm font-medium text-gray-300 mb-2"
                            >
                              Diameter
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="number"
                                id="diameter"
                                value={dimensions.diameter.value}
                                onChange={(e) =>
                                  handleInputChange("diameter", e.target.value)
                                }
                                onFocus={() => handleFocus("diameter")}
                                onBlur={() => handleBlur("diameter")}
                                className="block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="0"
                              />
                              <div className="flex">
                                <button
                                  onClick={() =>
                                    handleUnitChange("diameter", "inches")
                                  }
                                  className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                    dimensions.diameter.unit === "inches"
                                      ? "bg-blue-600 text-white shadow-inner"
                                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                  }`}
                                >
                                  in
                                </button>
                                <button
                                  onClick={() =>
                                    handleUnitChange("diameter", "feet")
                                  }
                                  className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                    dimensions.diameter.unit === "feet"
                                      ? "bg-blue-600 text-white shadow-inner"
                                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                  }`}
                                >
                                  ft
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div>
                              <label
                                htmlFor="length"
                                className="block text-sm font-medium text-gray-300 mb-2"
                              >
                                Length
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm">
                                <input
                                  type="number"
                                  id="length"
                                  value={dimensions.length.value}
                                  onChange={(e) =>
                                    handleInputChange("length", e.target.value)
                                  }
                                  onFocus={() => handleFocus("length")}
                                  onBlur={() => handleBlur("length")}
                                  className="block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  placeholder="0"
                                />
                                <div className="flex">
                                  <button
                                    onClick={() =>
                                      handleUnitChange("length", "inches")
                                    }
                                    className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                      dimensions.length.unit === "inches"
                                        ? "bg-blue-600 text-white shadow-inner"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                                  >
                                    in
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleUnitChange("length", "feet")
                                    }
                                    className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                      dimensions.length.unit === "feet"
                                        ? "bg-blue-600 text-white shadow-inner"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                                  >
                                    ft
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="width"
                                className="block text-sm font-medium text-gray-300 mb-2"
                              >
                                Width
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm">
                                <input
                                  type="number"
                                  id="width"
                                  value={dimensions.width.value}
                                  onChange={(e) =>
                                    handleInputChange("width", e.target.value)
                                  }
                                  onFocus={() => handleFocus("width")}
                                  onBlur={() => handleBlur("width")}
                                  className="block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  placeholder="0"
                                />
                                <div className="flex">
                                  <button
                                    onClick={() =>
                                      handleUnitChange("width", "inches")
                                    }
                                    className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                      dimensions.width.unit === "inches"
                                        ? "bg-blue-600 text-white shadow-inner"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                                  >
                                    in
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleUnitChange("width", "feet")
                                    }
                                    className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                      dimensions.width.unit === "feet"
                                        ? "bg-blue-600 text-white shadow-inner"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                                  >
                                    ft
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        <div>
                          <label
                            htmlFor="depth"
                            className="block text-sm font-medium text-gray-300 mb-2"
                          >
                            Depth
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                              type="number"
                              id="depth"
                              value={dimensions.depth.value}
                              onChange={(e) =>
                                handleInputChange("depth", e.target.value)
                              }
                              onFocus={() => handleFocus("depth")}
                              onBlur={() => handleBlur("depth")}
                              className="block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="0"
                            />
                            <div className="flex">
                              <button
                                onClick={() =>
                                  handleUnitChange("depth", "inches")
                                }
                                className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                  dimensions.depth.unit === "inches"
                                    ? "bg-blue-600 text-white shadow-inner"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                              >
                                in
                              </button>
                              <button
                                onClick={() =>
                                  handleUnitChange("depth", "feet")
                                }
                                className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                  dimensions.depth.unit === "feet"
                                    ? "bg-blue-600 text-white shadow-inner"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                              >
                                ft
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="quantity"
                            className="block text-sm font-medium text-gray-300 mb-2"
                          >
                            Quantity
                          </label>
                          <input
                            type="number"
                            id="quantity"
                            value={dimensions.quantity}
                            onChange={(e) =>
                              handleInputChange("quantity", e.target.value)
                            }
                            onFocus={() => handleFocus("quantity")}
                            onBlur={() => handleBlur("quantity")}
                            className="block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="1"
                          />
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={calculateConcrete}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            Calculate
                          </button>
                          <button
                            onClick={handleClear}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            Clear
                          </button>
                        </div>

                        {/* Add export buttons next to the clear button */}
                        <div className="flex justify-between items-center mt-4">
                          <button
                            onClick={handleClear}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            Clear
                          </button>
                          <div className="flex gap-2">
                            <button
                              onClick={handleExportPDF}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
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
                                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                />
                              </svg>
                              Export PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
