import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface WallCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Unit = "feet" | "inches";

interface Dimension {
  value: string;
  unit: Unit;
}

interface Dimensions {
  length: Dimension;
  width: Dimension;
  wallHeight1: Dimension;
  wallHeight2: Dimension;
  wallHeight3: Dimension;
  baseThickness: Dimension;
  baseExtended: Dimension;
  wallThickness: Dimension;
  wallFitness: Dimension;
  lidThickness: Dimension;
  quantity: string;
}

interface CalculationResult {
  baseVolumeCubicYards: number;
  wallVolumeCubicYards: number;
  lidVolumeCubicYards: number;
  totalVolumeCubicYards: number;
  baseWeightLbs: number;
  wallWeightLbs: number;
  lidWeightLbs: number;
  totalWeightLbs: number;
  totalWeightTons: number;
}

export default function WallCalculatorModal({
  isOpen,
  onClose,
}: WallCalculatorModalProps) {
  const [dimensions, setDimensions] = useState<Dimensions>({
    length: { value: "0", unit: "inches" },
    width: { value: "0", unit: "inches" },
    wallHeight1: { value: "0", unit: "inches" },
    wallHeight2: { value: "0", unit: "inches" },
    wallHeight3: { value: "0", unit: "inches" },
    baseThickness: { value: "0", unit: "inches" },
    baseExtended: { value: "0", unit: "inches" },
    wallThickness: { value: "0", unit: "inches" },
    wallFitness: { value: "0", unit: "inches" },
    lidThickness: { value: "0", unit: "inches" },
    quantity: "1",
  });
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateWall = () => {
    const length = parseFloat(dimensions.length.value);
    const width = parseFloat(dimensions.width.value);
    const wallHeight1 = parseFloat(dimensions.wallHeight1.value);
    const wallHeight2 = parseFloat(dimensions.wallHeight2.value);
    const wallHeight3 = parseFloat(dimensions.wallHeight3.value);
    const baseThickness = parseFloat(dimensions.baseThickness.value);
    const baseExtended = parseFloat(dimensions.baseExtended.value);
    const wallThickness = parseFloat(dimensions.wallThickness.value);
    const wallFitness = parseFloat(dimensions.wallFitness.value);
    const lidThickness = parseFloat(dimensions.lidThickness.value);
    const q = parseFloat(dimensions.quantity);

    if (
      isNaN(length) ||
      isNaN(width) ||
      isNaN(wallHeight1) ||
      isNaN(wallHeight2) ||
      isNaN(wallHeight3) ||
      isNaN(baseThickness) ||
      isNaN(baseExtended) ||
      isNaN(wallThickness) ||
      isNaN(wallFitness) ||
      isNaN(lidThickness) ||
      isNaN(q)
    ) {
      return;
    }

    // Convert all measurements to feet
    const lengthInFeet =
      dimensions.length.unit === "inches" ? length / 12 : length;
    const widthInFeet = dimensions.width.unit === "inches" ? width / 12 : width;
    const wallHeight1InFeet =
      dimensions.wallHeight1.unit === "inches" ? wallHeight1 / 12 : wallHeight1;
    const wallHeight2InFeet =
      dimensions.wallHeight2.unit === "inches" ? wallHeight2 / 12 : wallHeight2;
    const wallHeight3InFeet =
      dimensions.wallHeight3.unit === "inches" ? wallHeight3 / 12 : wallHeight3;
    const baseThicknessInFeet =
      dimensions.baseThickness.unit === "inches"
        ? baseThickness / 12
        : baseThickness;
    const baseExtendedInFeet =
      dimensions.baseExtended.unit === "inches"
        ? baseExtended / 12
        : baseExtended;
    const wallThicknessInFeet =
      dimensions.wallThickness.unit === "inches"
        ? wallThickness / 12
        : wallThickness;
    const wallFitnessInFeet =
      dimensions.wallFitness.unit === "inches" ? wallFitness / 12 : wallFitness;
    const lidThicknessInFeet =
      dimensions.lidThickness.unit === "inches"
        ? lidThickness / 12
        : lidThickness;

    // Calculate base volume (including extended base)
    const baseVolumeCubicFeet =
      (lengthInFeet + 2 * baseExtendedInFeet) *
      (widthInFeet + 2 * baseExtendedInFeet) *
      baseThicknessInFeet *
      q;

    // Calculate wall volumes (four walls with different heights)
    const wallVolumeCubicFeet =
      (widthInFeet * wallHeight1InFeet * wallThicknessInFeet + // Wall 1
        widthInFeet * wallHeight2InFeet * wallThicknessInFeet + // Wall 2
        widthInFeet * wallHeight3InFeet * wallThicknessInFeet) * // Wall 3
      4 * // Multiply by 4 for all four walls
      q; // Multiply by quantity

    // Calculate lid volume
    const lidVolumeCubicFeet =
      lengthInFeet * widthInFeet * lidThicknessInFeet * q;

    // Convert to cubic yards
    const baseVolumeCubicYards = baseVolumeCubicFeet / 27;
    const wallVolumeCubicYards = wallVolumeCubicFeet / 27;
    const lidVolumeCubicYards = lidVolumeCubicFeet / 27;
    const totalVolumeCubicYards =
      baseVolumeCubicYards + wallVolumeCubicYards + lidVolumeCubicYards;

    // Calculate individual weights (using 4,000 lbs per cubic yard)
    const baseWeightLbs = baseVolumeCubicYards * 4000;
    const wallWeightLbs = wallVolumeCubicYards * 4000;
    const lidWeightLbs = lidVolumeCubicYards * 4000;
    const totalWeightLbs = baseWeightLbs + wallWeightLbs + lidWeightLbs;
    const totalWeightTons = totalWeightLbs / 2000;

    setResult({
      baseVolumeCubicYards,
      wallVolumeCubicYards,
      lidVolumeCubicYards,
      totalVolumeCubicYards,
      baseWeightLbs,
      wallWeightLbs,
      lidWeightLbs,
      totalWeightLbs,
      totalWeightTons,
    });
  };

  const handleInputChange = (field: keyof Dimensions, value: string) => {
    if (field === "quantity") {
      setDimensions((prev) => ({ ...prev, [field]: value }));
    } else {
      setDimensions((prev) => ({
        ...prev,
        [field]: {
          ...prev[field as keyof Omit<Dimensions, "quantity">],
          value,
        },
      }));
    }
    setResult(null);
  };

  const handleUnitChange = (
    field: keyof Omit<Dimensions, "quantity">,
    unit: Unit
  ) => {
    setDimensions((prev) => ({
      ...prev,
      [field]: { ...prev[field], unit },
    }));
    setResult(null);
  };

  const handleFocus = (field: keyof Dimensions) => {
    if (field === "quantity") {
      if (dimensions[field] === "0") {
        setDimensions((prev) => ({ ...prev, [field]: "" }));
      }
    } else {
      if (dimensions[field].value === "0") {
        setDimensions((prev) => ({
          ...prev,
          [field]: { ...prev[field], value: "" },
        }));
      }
    }
  };

  const handleBlur = (field: keyof Dimensions) => {
    if (field === "quantity") {
      if (dimensions[field] === "") {
        setDimensions((prev) => ({ ...prev, [field]: "0" }));
      }
    } else {
      if (dimensions[field].value === "") {
        setDimensions((prev) => ({
          ...prev,
          [field]: { ...prev[field], value: "0" },
        }));
      }
    }
  };

  const handleClear = () => {
    setDimensions({
      length: { value: "0", unit: "inches" },
      width: { value: "0", unit: "inches" },
      wallHeight1: { value: "0", unit: "inches" },
      wallHeight2: { value: "0", unit: "inches" },
      wallHeight3: { value: "0", unit: "inches" },
      baseThickness: { value: "0", unit: "inches" },
      baseExtended: { value: "0", unit: "inches" },
      wallThickness: { value: "0", unit: "inches" },
      wallFitness: { value: "0", unit: "inches" },
      lidThickness: { value: "0", unit: "inches" },
      quantity: "1",
    });
    setResult(null);
  };

  const handleExportPDF = () => {
    if (!result) return;

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text("Wall Calculator Results", 20, 20);

    // Add calculation details
    doc.setFontSize(12);
    doc.text(
      `Length: ${dimensions.length.value} ${dimensions.length.unit}`,
      20,
      30
    );
    doc.text(
      `Width: ${dimensions.width.value} ${dimensions.width.unit}`,
      20,
      40
    );
    doc.text(
      `Base Thickness: ${dimensions.baseThickness.value} ${dimensions.baseThickness.unit}`,
      20,
      50
    );
    doc.text(
      `Wall Height 1: ${dimensions.wallHeight1.value} ${dimensions.wallHeight1.unit}`,
      20,
      60
    );
    doc.text(
      `Wall Height 2: ${dimensions.wallHeight2.value} ${dimensions.wallHeight2.unit}`,
      20,
      70
    );
    doc.text(
      `Wall Height 3: ${dimensions.wallHeight3.value} ${dimensions.wallHeight3.unit}`,
      20,
      80
    );
    doc.text(
      `Wall Thickness: ${dimensions.wallThickness.value} ${dimensions.wallThickness.unit}`,
      20,
      90
    );
    doc.text(
      `Lid Thickness: ${dimensions.lidThickness.value} ${dimensions.lidThickness.unit}`,
      20,
      100
    );
    doc.text(`Quantity: ${dimensions.quantity}`, 20, 110);

    // Add results
    doc.setFontSize(14);
    doc.text("Results:", 20, 130);

    // Create table data
    const tableData = [
      ["Base Volume", `${result.baseVolumeCubicYards.toFixed(2)} cubic yards`],
      ["Wall Volume", `${result.wallVolumeCubicYards.toFixed(2)} cubic yards`],
      ["Lid Volume", `${result.lidVolumeCubicYards.toFixed(2)} cubic yards`],
      [
        "Total Volume",
        `${result.totalVolumeCubicYards.toFixed(2)} cubic yards`,
      ],
      [
        "Base Weight",
        `${result.baseWeightLbs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} lbs`,
      ],
      [
        "Wall Weight",
        `${result.wallWeightLbs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} lbs`,
      ],
      [
        "Lid Weight",
        `${result.lidWeightLbs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} lbs`,
      ],
      [
        "Total Weight",
        `${result.totalWeightLbs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} lbs (${result.totalWeightTons.toFixed(2)} tons)`,
      ],
    ];

    // Add table
    autoTable(doc, {
      startY: 140,
      head: [["Measurement", "Value"]],
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
    doc.save("wall_calculator_results.pdf");
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
              <Dialog.Panel className="relative transform rounded-lg bg-gray-800 px-6 pb-6 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-8 max-h-[90vh] overflow-y-auto">
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
                      Base and Wall Calculator
                    </Dialog.Title>

                    <div className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Results Section */}
                        <div className="bg-gray-700 rounded-lg p-6 sticky top-0 h-fit">
                          <h4 className="text-lg font-semibold text-white mb-4">
                            Results
                          </h4>
                          {result !== null ? (
                            <div className="space-y-4">
                              <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-300 text-sm">
                                  Base Volume
                                </p>
                                <p className="text-2xl font-bold text-blue-400">
                                  {result.baseVolumeCubicYards.toFixed(2)} cubic
                                  yards
                                </p>
                              </div>
                              <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-300 text-sm">
                                  Wall Volume
                                </p>
                                <p className="text-2xl font-bold text-blue-400">
                                  {result.wallVolumeCubicYards.toFixed(2)} cubic
                                  yards
                                </p>
                              </div>
                              <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-300 text-sm">
                                  Lid Volume
                                </p>
                                <p className="text-2xl font-bold text-blue-400">
                                  {result.lidVolumeCubicYards.toFixed(2)} cubic
                                  yards
                                </p>
                              </div>
                              <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-300 text-sm">
                                  Total Volume
                                </p>
                                <p className="text-2xl font-bold text-blue-400">
                                  {result.totalVolumeCubicYards.toFixed(2)}{" "}
                                  cubic yards
                                </p>
                              </div>
                              <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-300 text-sm">
                                  Base Weight
                                </p>
                                <p className="text-2xl font-bold text-blue-400">
                                  {result.baseWeightLbs.toLocaleString(
                                    undefined,
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}{" "}
                                  lbs
                                </p>
                              </div>
                              <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-300 text-sm">
                                  Wall Weight
                                </p>
                                <p className="text-2xl font-bold text-blue-400">
                                  {result.wallWeightLbs.toLocaleString(
                                    undefined,
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}{" "}
                                  lbs
                                </p>
                              </div>
                              <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-300 text-sm">
                                  Lid Weight
                                </p>
                                <p className="text-2xl font-bold text-blue-400">
                                  {result.lidWeightLbs.toLocaleString(
                                    undefined,
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}{" "}
                                  lbs
                                </p>
                              </div>
                              <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-300 text-sm">
                                  Total Weight
                                </p>
                                <p className="text-2xl font-bold text-blue-400">
                                  {result.totalWeightLbs.toLocaleString(
                                    undefined,
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}{" "}
                                  lbs
                                </p>
                                <p className="text-lg text-gray-400">
                                  ({result.totalWeightTons.toFixed(2)} tons)
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
                          {/* Dimensions */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white">
                              Dimensions
                            </h4>
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
                            <div>
                              <label
                                htmlFor="baseThickness"
                                className="block text-sm font-medium text-gray-300 mb-2"
                              >
                                Base Thickness
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm">
                                <input
                                  type="number"
                                  id="baseThickness"
                                  value={dimensions.baseThickness.value}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "baseThickness",
                                      e.target.value
                                    )
                                  }
                                  onFocus={() => handleFocus("baseThickness")}
                                  onBlur={() => handleBlur("baseThickness")}
                                  className="block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  placeholder="0"
                                />
                                <div className="flex">
                                  <button
                                    onClick={() =>
                                      handleUnitChange(
                                        "baseThickness",
                                        "inches"
                                      )
                                    }
                                    className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                      dimensions.baseThickness.unit === "inches"
                                        ? "bg-blue-600 text-white shadow-inner"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                                  >
                                    in
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleUnitChange("baseThickness", "feet")
                                    }
                                    className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                      dimensions.baseThickness.unit === "feet"
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
                                htmlFor="wallHeight1"
                                className="block text-sm font-medium text-gray-300 mb-2"
                              >
                                Wall Height 1
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm">
                                <input
                                  type="number"
                                  id="wallHeight1"
                                  value={dimensions.wallHeight1.value}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "wallHeight1",
                                      e.target.value
                                    )
                                  }
                                  onFocus={() => handleFocus("wallHeight1")}
                                  onBlur={() => handleBlur("wallHeight1")}
                                  className="block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  placeholder="0"
                                />
                                <div className="flex">
                                  <button
                                    onClick={() =>
                                      handleUnitChange("wallHeight1", "inches")
                                    }
                                    className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                      dimensions.wallHeight1.unit === "inches"
                                        ? "bg-blue-600 text-white shadow-inner"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                                  >
                                    in
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleUnitChange("wallHeight1", "feet")
                                    }
                                    className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                      dimensions.wallHeight1.unit === "feet"
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
                                htmlFor="wallHeight2"
                                className="block text-sm font-medium text-gray-300 mb-2"
                              >
                                Wall Height 2
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm">
                                <input
                                  type="number"
                                  id="wallHeight2"
                                  value={dimensions.wallHeight2.value}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "wallHeight2",
                                      e.target.value
                                    )
                                  }
                                  onFocus={() => handleFocus("wallHeight2")}
                                  onBlur={() => handleBlur("wallHeight2")}
                                  className="block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  placeholder="0"
                                />
                                <div className="flex">
                                  <button
                                    onClick={() =>
                                      handleUnitChange("wallHeight2", "inches")
                                    }
                                    className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                      dimensions.wallHeight2.unit === "inches"
                                        ? "bg-blue-600 text-white shadow-inner"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                                  >
                                    in
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleUnitChange("wallHeight2", "feet")
                                    }
                                    className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                      dimensions.wallHeight2.unit === "feet"
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
                                htmlFor="wallHeight3"
                                className="block text-sm font-medium text-gray-300 mb-2"
                              >
                                Wall Height 3
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm">
                                <input
                                  type="number"
                                  id="wallHeight3"
                                  value={dimensions.wallHeight3.value}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "wallHeight3",
                                      e.target.value
                                    )
                                  }
                                  onFocus={() => handleFocus("wallHeight3")}
                                  onBlur={() => handleBlur("wallHeight3")}
                                  className="block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  placeholder="0"
                                />
                                <div className="flex">
                                  <button
                                    onClick={() =>
                                      handleUnitChange("wallHeight3", "inches")
                                    }
                                    className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                      dimensions.wallHeight3.unit === "inches"
                                        ? "bg-blue-600 text-white shadow-inner"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                                  >
                                    in
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleUnitChange("wallHeight3", "feet")
                                    }
                                    className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                      dimensions.wallHeight3.unit === "feet"
                                        ? "bg-blue-600 text-white shadow-inner"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                                  >
                                    ft
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="wallThickness"
                              className="block text-sm font-medium text-gray-300 mb-2"
                            >
                              Wall Thickness
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="number"
                                id="wallThickness"
                                value={dimensions.wallThickness.value}
                                onChange={(e) =>
                                  handleInputChange(
                                    "wallThickness",
                                    e.target.value
                                  )
                                }
                                onFocus={() => handleFocus("wallThickness")}
                                onBlur={() => handleBlur("wallThickness")}
                                className="block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="8"
                              />
                              <div className="flex">
                                <button
                                  onClick={() =>
                                    handleUnitChange("wallThickness", "inches")
                                  }
                                  className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                    dimensions.wallThickness.unit === "inches"
                                      ? "bg-blue-600 text-white shadow-inner"
                                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                  }`}
                                >
                                  in
                                </button>
                                <button
                                  onClick={() =>
                                    handleUnitChange("wallThickness", "feet")
                                  }
                                  className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                    dimensions.wallThickness.unit === "feet"
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
                              htmlFor="lidThickness"
                              className="block text-sm font-medium text-gray-300 mb-2"
                            >
                              Lid Thickness
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="number"
                                id="lidThickness"
                                value={dimensions.lidThickness.value}
                                onChange={(e) =>
                                  handleInputChange(
                                    "lidThickness",
                                    e.target.value
                                  )
                                }
                                onFocus={() => handleFocus("lidThickness")}
                                onBlur={() => handleBlur("lidThickness")}
                                className="block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="0"
                              />
                              <div className="flex">
                                <button
                                  onClick={() =>
                                    handleUnitChange("lidThickness", "inches")
                                  }
                                  className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                    dimensions.lidThickness.unit === "inches"
                                      ? "bg-blue-600 text-white shadow-inner"
                                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                  }`}
                                >
                                  in
                                </button>
                                <button
                                  onClick={() =>
                                    handleUnitChange("lidThickness", "feet")
                                  }
                                  className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                    dimensions.lidThickness.unit === "feet"
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
                              onClick={calculateWall}
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
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
