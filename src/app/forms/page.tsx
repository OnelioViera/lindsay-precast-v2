"use client";

import Link from "next/link";
import { useState } from "react";

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

    const newForm: FormData = {
      id: Date.now().toString(),
      ...formData,
    };
    setSavedForms([...savedForms, newForm]);
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

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4">
      <main className="w-full max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center space-y-8">
          {/* Back button */}
          <Link
            href="/"
            className="self-start text-white hover:text-gray-300 transition-colors"
          >
            ← Back to Home
          </Link>

          {/* Page title */}
          <h1 className="text-6xl font-bold text-white text-center">
            Forms Information
          </h1>

          {/* Content placeholder */}
          <div className="w-full max-w-3xl text-gray-300 space-y-6">
            <p className="text-lg">
              Welcome to the Forms Information page. This section will contain
              all the necessary forms and documentation for Lindsay Precast.
            </p>

            {/* Create New Form Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl hover:scale-105"
              >
                Create New Form
              </button>
            </div>

            {/* Saved Forms Display */}
            {savedForms.length > 0 && (
              <div className="w-full space-y-6 mt-8">
                <h2 className="text-2xl font-bold text-white text-center">
                  Saved Forms
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedForms.map((form) => (
                    <div
                      key={form.id}
                      className="bg-gray-50 rounded-xl p-6 shadow-lg border border-gray-200"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {form.title}
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Form Size</p>
                          <p className="text-gray-800">
                            {form.formSize.width}" x {form.formSize.length}"
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Wall Thickness
                          </p>
                          <p className="text-gray-800">
                            {Object.entries(form.wallThickness)
                              .filter(([_, value]) => value)
                              .map(([key]) => `${key}"`)
                              .join(", ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Base Thickness
                          </p>
                          <p className="text-gray-800">
                            {Object.entries(form.baseThickness)
                              .filter(([_, value]) => value)
                              .map(([key]) => `${key}"`)
                              .join(", ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Lid Thickness</p>
                          <p className="text-gray-800">
                            {Object.entries(form.lidThickness)
                              .filter(([_, value]) => value)
                              .map(([key]) => `${key}"`)
                              .join(", ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Anti-skid Base
                          </p>
                          <p className="text-gray-800">
                            {form.antiSkidBase ? "Yes" : "No"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Anti-skid Lid</p>
                          <p className="text-gray-800">
                            {form.antiSkidLid ? "Yes" : "No"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Max Pour Height
                          </p>
                          <p className="text-gray-800">{form.maxPourHeight}"</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Engineered</p>
                          <p className="text-gray-800">
                            {form.engineered ? "Yes" : "No"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Dynamic Blocks
                          </p>
                          <p className="text-gray-800">
                            {form.dynamicBlocks ? "Yes" : "No"}
                          </p>
                        </div>
                        {form.notes && (
                          <div>
                            <p className="text-sm text-gray-500">Notes</p>
                            <p className="text-gray-800">{form.notes}</p>
                          </div>
                        )}
                      </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Form</h2>
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
                    value={formData.formSize.width}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        formSize: {
                          ...formData.formSize,
                          width: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={formData.formSize.length}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        formSize: {
                          ...formData.formSize,
                          length: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  value={formData.maxPourHeight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxPourHeight: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
