import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ConcreteCalculatorModalProps {
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
  height: Dimension;
  quantity: string;
}

interface CalculationResult {
  cubicYards: number;
  pounds: number;
  tons: number;
}

export default function ConcreteCalculatorModal({
  isOpen,
  onClose,
}: ConcreteCalculatorModalProps) {
  const [dimensions, setDimensions] = useState<Dimensions>({
    length: { value: "0", unit: "inches" },
    width: { value: "0", unit: "inches" },
    height: { value: "0", unit: "inches" },
    quantity: "1",
  });
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateConcrete = () => {
    const l = parseFloat(dimensions.length.value);
    const w = parseFloat(dimensions.width.value);
    const h = parseFloat(dimensions.height.value);
    const qty = parseFloat(dimensions.quantity);

    if (isNaN(l) || isNaN(w) || isNaN(h) || isNaN(qty)) {
      return;
    }

    // Convert all dimensions to feet
    const lengthInFeet = dimensions.length.unit === "inches" ? l / 12 : l;
    const widthInFeet = dimensions.width.unit === "inches" ? w / 12 : w;
    const heightInFeet = dimensions.height.unit === "inches" ? h / 12 : h;

    const cubicYards = (lengthInFeet * widthInFeet * heightInFeet * qty) / 27;

    // Calculate weight (1 cubic yard = 4050 lbs = 2.025 tons)
    const pounds = cubicYards * 4050;
    const tons = pounds / 2000;

    setResult({
      cubicYards,
      pounds,
      tons,
    });
  };

  const handleInputChange = (field: keyof Dimensions, value: string) => {
    if (field === "quantity") {
      setDimensions((prev) => ({ ...prev, [field]: value }));
    } else {
      setDimensions((prev) => ({
        ...prev,
        [field]: { ...prev[field], value },
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
      height: { value: "0", unit: "inches" },
      quantity: "1",
    });
    setResult(null);
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
                      Concrete Calculator
                    </Dialog.Title>

                    <div className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Results Section */}
                        <div className="bg-gray-700 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-white mb-4">
                            Results
                          </h4>
                          {result !== null ? (
                            <div className="space-y-4">
                              <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-300 text-sm">
                                  Required Concrete
                                </p>
                                <p className="text-2xl font-bold text-blue-400">
                                  {result.cubicYards.toFixed(2)} cubic yards
                                </p>
                              </div>
                              <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-300 text-sm">Weight</p>
                                <p className="text-2xl font-bold text-blue-400">
                                  {result.pounds.toLocaleString()} lbs
                                </p>
                                <p className="text-lg text-gray-400">
                                  ({result.tons.toFixed(2)} tons)
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
                            <label
                              htmlFor="length"
                              className="block text-sm font-medium text-gray-300 mb-2"
                            >
                              Length (l)
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
                              Width (w)
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
                              htmlFor="height"
                              className="block text-sm font-medium text-gray-300 mb-2"
                            >
                              Thickness or Height (h)
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="number"
                                id="height"
                                value={dimensions.height.value}
                                onChange={(e) =>
                                  handleInputChange("height", e.target.value)
                                }
                                onFocus={() => handleFocus("height")}
                                onBlur={() => handleBlur("height")}
                                className="block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="0"
                              />
                              <div className="flex">
                                <button
                                  onClick={() =>
                                    handleUnitChange("height", "inches")
                                  }
                                  className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                    dimensions.height.unit === "inches"
                                      ? "bg-blue-600 text-white shadow-inner"
                                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                  }`}
                                >
                                  in
                                </button>
                                <button
                                  onClick={() =>
                                    handleUnitChange("height", "feet")
                                  }
                                  className={`px-4 py-3 border-l border-gray-600 transition-colors duration-200 ${
                                    dimensions.height.unit === "feet"
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
                            <div className="mt-1 flex rounded-md shadow-sm">
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
                          </div>

                          <div className="flex gap-4">
                            <button
                              onClick={calculateConcrete}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors text-sm font-medium"
                            >
                              Calculate
                            </button>
                            <button
                              onClick={handleClear}
                              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors text-sm font-medium"
                            >
                              Clear
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
