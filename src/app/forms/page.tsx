"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

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
  };
  baseThickness: {
    "6": boolean;
    "8": boolean;
    "10": boolean;
    "12": boolean;
  };
  lidThickness: {
    "6": boolean;
    "8": boolean;
    "10": boolean;
    "12": boolean;
  };
  antiSkidBase: boolean;
  antiSkidLid: boolean;
  maxPourHeight: number;
  engineered: boolean;
  dynamicBlocks: boolean;
  notes: string;
}

export default function FormsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedForms, setSavedForms] = useState<FormData[]>([]);
  const [formData, setFormData] = useState<Omit<FormData, "id">>({
    title: "",
    formSize: {
      width: 0,
      length: 0,
    },
    wallThickness: {
      "6": false,
      "8": false,
    },
    baseThickness: {
      "6": false,
      "8": false,
      "10": false,
      "12": false,
    },
    lidThickness: {
      "6": false,
      "8": false,
      "10": false,
      "12": false,
    },
    antiSkidBase: false,
    antiSkidLid: false,
    maxPourHeight: 0,
    engineered: false,
    dynamicBlocks: false,
    notes: "",
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

    // Validate that at least one option is selected for each thickness
    const hasWallThickness = Object.values(formData.wallThickness).some(
      (value) => value
    );
    const hasBaseThickness = Object.values(formData.baseThickness).some(
      (value) => value
    );
    const hasLidThickness = Object.values(formData.lidThickness).some(
      (value) => value
    );

    if (!hasWallThickness || !hasBaseThickness || !hasLidThickness) {
      alert("Please select at least one option for each thickness type");
      return;
    }

    // Validate number inputs
    if (
      !formData.formSize.width ||
      !formData.formSize.length ||
      !formData.maxPourHeight
    ) {
      alert("Please fill in all required number fields");
      return;
    }

    const newForm: FormData = {
      id: Date.now().toString(),
      ...formData,
    };

    // Update state with the new form
    setSavedForms((prevForms) => [...prevForms, newForm]);

    // Reset form data
    setFormData({
      title: "",
      formSize: {
        width: 0,
        length: 0,
      },
      wallThickness: {
        "6": false,
        "8": false,
      },
      baseThickness: {
        "6": false,
        "8": false,
        "10": false,
        "12": false,
      },
      lidThickness: {
        "6": false,
        "8": false,
        "10": false,
        "12": false,
      },
      antiSkidBase: false,
      antiSkidLid: false,
      maxPourHeight: 0,
      engineered: false,
      dynamicBlocks: false,
      notes: "",
    });

    setIsModalOpen(false);
  };

  const deleteForm = (id: string) => {
    setSavedForms((prevForms) => prevForms.filter((form) => form.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 transition-colors duration-300">
      <main className="w-full max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center space-y-6 sm:space-y-8">
          {/* Back button */}
          <Link
            href="/"
            className="self-start text-white hover:text-gray-300 transition-colors flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>

          {/* Page title */}
          <h1 className="text-4xl sm:text-6xl font-bold text-white text-center">
            Forms Information
          </h1>

          {/* Content placeholder */}
          <div className="w-full max-w-3xl text-gray-300 space-y-4 sm:space-y-6">
            <p className="text-base sm:text-lg">
              Welcome to the Forms Information page. This section will contain
              all the necessary forms and documentation for Lindsay Precast.
            </p>

            {/* Create New Form Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 text-base sm:text-lg font-medium shadow-lg hover:shadow-xl hover:scale-105"
              >
                Create New Form
              </button>
            </div>

            {/* Saved Forms Display */}
            {savedForms.length > 0 && (
              <div className="w-full space-y-4 sm:space-y-6 mt-6 sm:mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
                  Saved Forms
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {savedForms.map((form) => (
                    <div
                      key={form.id}
                      className="bg-gray-50 rounded-xl p-4 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl relative"
                    >
                      <div className="flex justify-between items-center mb-3 bg-blue-600 -mx-4 -mt-4 px-4 py-2 rounded-t-xl">
                        <h3 className="text-lg sm:text-xl font-semibold text-white">
                          {form.title}
                        </h3>
                        <button
                          onClick={() => deleteForm(form.id)}
                          className="text-white hover:text-red-200 transition-colors p-2 hover:bg-blue-700 rounded-full flex items-center justify-center w-8 h-8"
                          aria-label="Delete form"
                        >
                          ✕
                        </button>
                      </div>
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
                          <p className="text-sm font-medium text-gray-500">
                            Max Pour Height
                          </p>
                          <p className="text-gray-900">{form.maxPourHeight}"</p>
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
                          <p className="text-sm font-medium text-gray-500">
                            Base Thickness
                          </p>
                          <p className="text-gray-900">
                            {Object.entries(form.baseThickness)
                              .filter(([_, value]) => value)
                              .map(([key]) => `${key}"`)
                              .join(", ")}
                          </p>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-gray-100">
                          <p className="text-sm font-medium text-gray-500">
                            Lid Thickness
                          </p>
                          <p className="text-gray-900">
                            {Object.entries(form.lidThickness)
                              .filter(([_, value]) => value)
                              .map(([key]) => `${key}"`)
                              .join(", ")}
                          </p>
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
                            Anti-skid Lid
                          </p>
                          <p className="text-gray-900">
                            {form.antiSkidLid ? "Yes" : "No"}
                          </p>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-gray-100">
                          <p className="text-sm font-medium text-gray-500">
                            Engineered
                          </p>
                          <p className="text-gray-900">
                            {form.engineered ? "Yes" : "No"}
                          </p>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-gray-100">
                          <p className="text-sm font-medium text-gray-500">
                            Dynamic Blocks
                          </p>
                          <p className="text-gray-900">
                            {form.dynamicBlocks ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                      {form.notes && (
                        <div className="mt-2 bg-white p-2 rounded-lg border border-gray-100">
                          <p className="text-sm font-medium text-gray-500">
                            Notes
                          </p>
                          <p className="text-gray-900 text-sm">{form.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-4 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                  Form Title
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
                    Form Width (inches)
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
                    Form Length (inches)
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
                  Wall Thickness (inches)
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
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Base Thickness (inches)
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
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Lid Thickness (inches)
                </label>
                <div className="grid grid-cols-2 gap-4">
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
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="lid12"
                      checked={formData.lidThickness["12"]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lidThickness: {
                            ...formData.lidThickness,
                            "12": e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="lid12"
                      className="text-sm font-medium text-gray-300"
                    >
                      12"
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    id="antiSkidLid"
                    checked={formData.antiSkidLid}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        antiSkidLid: e.target.checked,
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
              </div>

              <div>
                <label
                  htmlFor="maxPourHeight"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Max Pour Height (inches)
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
    </div>
  );
}
