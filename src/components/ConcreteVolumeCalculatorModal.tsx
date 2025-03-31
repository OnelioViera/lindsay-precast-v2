import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ConcreteVolumeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Unit = "feet" | "inches";

interface Dimension {
  value: string;
  unit: Unit;
}

interface Dimensions {
  diameter: Dimension;
  depth: Dimension;
  quantity: string;
}

interface CalculationResult {
  volumeCubicFeet: number;
  volumeCubicYards: number;
  volumeCubicMeters: number;
  weightLbs: number;
  weightKg: number;
  bags60Lb: number;
  bags80Lb: number;
}

export default function ConcreteVolumeCalculatorModal({
  isOpen,
  onClose,
}: ConcreteVolumeCalculatorModalProps) {
  const [dimensions, setDimensions] = useState<Dimensions>({
    diameter: { value: "0", unit: "feet" },
    depth: { value: "0", unit: "inches" },
    quantity: "1",
  });
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateConcrete = () => {
    const d = parseFloat(dimensions.diameter.value);
    const h = parseFloat(dimensions.depth.value);
    const q = parseFloat(dimensions.quantity);

    if (isNaN(d) || isNaN(h) || isNaN(q)) {
      return;
    }

    // Convert depth to feet if in inches
    const depthInFeet = dimensions.depth.unit === "inches" ? h / 12 : h;

    // Calculate volume in cubic feet (using cylinder formula: πr²h)
    const radius = d / 2;
    const volumeCubicFeet = Math.PI * radius * radius * depthInFeet * q;

    // Convert to other volume units
    const volumeCubicYards = volumeCubicFeet / 27;
    const volumeCubicMeters = volumeCubicFeet * 0.0283168;

    // Calculate weight using density of 133 lbs/ft³
    const weightLbs = volumeCubicFeet * 133;
    const weightKg = weightLbs * 0.453592;

    // Calculate number of bags needed
    const bags60Lb = weightLbs / 60;
    const bags80Lb = weightLbs / 80;

    setResult({
      volumeCubicFeet,
      volumeCubicYards,
      volumeCubicMeters,
      weightLbs,
      weightKg,
      bags60Lb,
      bags80Lb,
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
      diameter: { value: "0", unit: "feet" },
      depth: { value: "0", unit: "inches" },
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
                      Concrete Volume Calculator
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
                                <p className="text-gray-300 text-sm">Volume</p>
                                <p className="text-2xl font-bold text-blue-400">
                                  {result.volumeCubicFeet.toFixed(2)} cubic feet
                                </p>
                                <p className="text-lg text-gray-400">
                                  ({result.volumeCubicYards.toFixed(2)} cubic
                                  yards)
                                </p>
                              </div>
                              <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-300 text-sm">Weight</p>
                                <p className="text-2xl font-bold text-blue-400">
                                  {result.weightLbs.toLocaleString()} lbs
                                </p>
                                <p className="text-lg text-gray-400">
                                  ({result.weightKg.toFixed(2)} kg)
                                </p>
                              </div>
                              <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-300 text-sm">
                                  Bags Needed
                                </p>
                                <p className="text-2xl font-bold text-blue-400">
                                  {result.bags60Lb.toFixed(2)} 60-lb bags
                                </p>
                                <p className="text-lg text-gray-400">
                                  ({result.bags80Lb.toFixed(2)} 80-lb bags)
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
