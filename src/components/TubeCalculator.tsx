"use client";

import { useState } from "react";

interface CalculatorInputs {
  outerDiameter: {
    value: number;
    unit: "meters" | "feet" | "inches";
  };
  innerDiameter: {
    value: number;
    unit: "meters" | "feet" | "inches";
  };
  height: {
    value: number;
    unit: "meters" | "feet" | "inches";
  };
  quantity: number;
}

export default function TubeCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    outerDiameter: { value: 0, unit: "inches" },
    innerDiameter: { value: 0, unit: "inches" },
    height: { value: 0, unit: "inches" },
    quantity: 0,
  });
  const [showResults, setShowResults] = useState(false);

  const convertToMeters = (
    value: number,
    unit: CalculatorInputs["outerDiameter"]["unit"]
  ) => {
    switch (unit) {
      case "feet":
        return value * 0.3048;
      case "inches":
        return value * 0.0254;
      default:
        return value;
    }
  };

  const calculateVolume = () => {
    const outerDiameterInMeters = convertToMeters(
      inputs.outerDiameter.value,
      inputs.outerDiameter.unit
    );
    const innerDiameterInMeters = convertToMeters(
      inputs.innerDiameter.value,
      inputs.innerDiameter.unit
    );
    const heightInMeters = convertToMeters(
      inputs.height.value,
      inputs.height.unit
    );

    // Volume = π * ((D² - d²) / 4) * h * quantity
    // where D is outer diameter and d is inner diameter
    const volumeInCubicMeters =
      Math.PI *
      ((Math.pow(outerDiameterInMeters, 2) -
        Math.pow(innerDiameterInMeters, 2)) /
        4) *
      heightInMeters *
      inputs.quantity;
    return volumeInCubicMeters;
  };

  const convertToCubicYards = (cubicMeters: number) => {
    return cubicMeters * 1.30795; // Convert m³ to yd³
  };

  const convertToPounds = (kilograms: number) => {
    return kilograms * 2.20462; // Convert kg to lbs
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleInputChange = (
    field: keyof CalculatorInputs,
    value:
      | number
      | {
          value: number;
          unit: CalculatorInputs[keyof CalculatorInputs]["unit"];
        }
  ) => {
    setInputs({
      ...inputs,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Outer Diameter
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={inputs.outerDiameter.value}
                onChange={(e) =>
                  handleInputChange("outerDiameter", {
                    value: parseFloat(e.target.value),
                    unit: inputs.outerDiameter.unit,
                  })
                }
                onFocus={(e) => {
                  if (e.target.value === "0") {
                    e.target.value = "";
                  }
                }}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <select
                value={inputs.outerDiameter.unit}
                onChange={(e) =>
                  handleInputChange("outerDiameter", {
                    value: inputs.outerDiameter.value,
                    unit: e.target
                      .value as CalculatorInputs["outerDiameter"]["unit"],
                  })
                }
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="meters">meters</option>
                <option value="feet">feet</option>
                <option value="inches">inches</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Inner Diameter
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={inputs.innerDiameter.value}
                onChange={(e) =>
                  handleInputChange("innerDiameter", {
                    value: parseFloat(e.target.value),
                    unit: inputs.innerDiameter.unit,
                  })
                }
                onFocus={(e) => {
                  if (e.target.value === "0") {
                    e.target.value = "";
                  }
                }}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <select
                value={inputs.innerDiameter.unit}
                onChange={(e) =>
                  handleInputChange("innerDiameter", {
                    value: inputs.innerDiameter.value,
                    unit: e.target
                      .value as CalculatorInputs["innerDiameter"]["unit"],
                  })
                }
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="meters">meters</option>
                <option value="feet">feet</option>
                <option value="inches">inches</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Height
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={inputs.height.value}
                onChange={(e) =>
                  handleInputChange("height", {
                    value: parseFloat(e.target.value),
                    unit: inputs.height.unit,
                  })
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
                  handleInputChange("height", {
                    value: inputs.height.value,
                    unit: e.target.value as CalculatorInputs["height"]["unit"],
                  })
                }
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="meters">meters</option>
                <option value="feet">feet</option>
                <option value="inches">inches</option>
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
              onChange={(e) =>
                handleInputChange("quantity", parseInt(e.target.value))
              }
              onFocus={(e) => {
                if (e.target.value === "0") {
                  e.target.value = "";
                }
              }}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
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
        </div>

        {/* Results Section */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-white mb-4">Results</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Volume:</span>
              <span className="text-white font-medium">
                {showResults
                  ? convertToCubicYards(calculateVolume()).toFixed(2)
                  : "0.00"}{" "}
                yd³
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Weight:</span>
              <span className="text-white font-medium">
                {showResults
                  ? Math.round(
                      convertToPounds(calculateVolume() * 2400)
                    ).toLocaleString()
                  : "0"}{" "}
                lbs
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Weight (tons):</span>
              <span className="text-white font-medium">
                {showResults
                  ? (
                      convertToPounds(calculateVolume() * 2400) / 2000
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 1,
                    })
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
