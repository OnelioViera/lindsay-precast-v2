"use client";

import { useState } from "react";
import { Unit, DimensionInput, BaseCalculatorInputs } from "@/types/calculator";

interface CalculatorInputs extends BaseCalculatorInputs {
  length: DimensionInput;
  width: DimensionInput;
  height: DimensionInput;
}

export default function ConcreteCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    length: { value: 0, unit: "inches" },
    width: { value: 0, unit: "inches" },
    height: { value: 0, unit: "inches" },
    quantity: 0,
  });
  const [showResults, setShowResults] = useState(false);

  const convertToFeet = (value: number, unit: Unit) => {
    switch (unit) {
      case "inches":
        return value / 12;
      case "yards":
        return value * 3;
      case "meters":
        return value * 3.28084;
      case "centimeters":
        return value / 30.48;
      default:
        return value;
    }
  };

  const calculateVolume = () => {
    const lengthInFeet = convertToFeet(inputs.length.value, inputs.length.unit);
    const widthInFeet = convertToFeet(inputs.width.value, inputs.width.unit);
    const heightInFeet = convertToFeet(inputs.height.value, inputs.height.unit);

    const volumeInCubicFeet = lengthInFeet * widthInFeet * heightInFeet;
    return volumeInCubicFeet / 27; // Convert to cubic yards
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleInputChange = (
    dimension: "length" | "width" | "height",
    value: number,
    unit: Unit
  ) => {
    setInputs({
      ...inputs,
      [dimension]: { value, unit },
    });
  };

  const handleQuantityChange = (value: number) => {
    setInputs({
      ...inputs,
      quantity: value,
    });
  };

  const handleClear = () => {
    setInputs({
      length: { value: 0, unit: "inches" },
      width: { value: 0, unit: "inches" },
      height: { value: 0, unit: "inches" },
      quantity: 0,
    });
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Length
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={inputs.length.value}
                onChange={(e) =>
                  handleInputChange(
                    "length",
                    parseFloat(e.target.value),
                    inputs.length.unit
                  )
                }
                onFocus={(e) => {
                  if (e.target.value === "0") {
                    e.target.value = "";
                  }
                }}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <select
                value={inputs.length.unit}
                onChange={(e) =>
                  handleInputChange(
                    "length",
                    inputs.length.value,
                    e.target.value as Unit
                  )
                }
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="feet">feet</option>
                <option value="inches">inches</option>
                <option value="yards">yards</option>
                <option value="meters">meters</option>
                <option value="centimeters">centimeters</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Width
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={inputs.width.value}
                onChange={(e) =>
                  handleInputChange(
                    "width",
                    parseFloat(e.target.value),
                    inputs.width.unit
                  )
                }
                onFocus={(e) => {
                  if (e.target.value === "0") {
                    e.target.value = "";
                  }
                }}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <select
                value={inputs.width.unit}
                onChange={(e) =>
                  handleInputChange(
                    "width",
                    inputs.width.value,
                    e.target.value as Unit
                  )
                }
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="feet">feet</option>
                <option value="inches">inches</option>
                <option value="yards">yards</option>
                <option value="meters">meters</option>
                <option value="centimeters">centimeters</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Height/Thickness
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={inputs.height.value}
                onChange={(e) =>
                  handleInputChange(
                    "height",
                    parseFloat(e.target.value),
                    inputs.height.unit
                  )
                }
                onFocus={(e) => {
                  if (e.target.value === "0") {
                    e.target.value = "";
                  }
                }}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <select
                value={inputs.height.unit}
                onChange={(e) =>
                  handleInputChange(
                    "height",
                    inputs.height.value,
                    e.target.value as Unit
                  )
                }
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="feet">feet</option>
                <option value="inches">inches</option>
                <option value="yards">yards</option>
                <option value="meters">meters</option>
                <option value="centimeters">centimeters</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={inputs.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              onFocus={(e) => {
                if (e.target.value === "0") {
                  e.target.value = "";
                }
              }}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleCalculate}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
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
              <span>Calculate</span>
            </button>
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-white mb-4">Results</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Volume:</span>
              <span className="text-white font-medium">
                {showResults ? calculateVolume().toFixed(2) : "0.00"} cubic
                yards
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Weight:</span>
              <span className="text-white font-medium">
                {showResults
                  ? (calculateVolume() * 4050).toLocaleString()
                  : "0"}{" "}
                lbs
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Weight (tons):</span>
              <span className="text-white font-medium">
                {showResults
                  ? ((calculateVolume() * 4050) / 2000).toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits: 1,
                      }
                    )
                  : "0.0"}{" "}
                tons
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
