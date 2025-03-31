import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

interface VolumeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VolumeCalculatorModal({
  isOpen,
  onClose,
}: VolumeCalculatorModalProps) {
  const [outerDiameter, setOuterDiameter] = useState("");
  const [innerDiameter, setInnerDiameter] = useState("");
  const [height, setHeight] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [result, setResult] = useState<{
    volumeCubicFeet: number;
    volumeCubicYards: number;
    volumeCubicMeters: number;
  } | null>(null);

  const calculateVolume = () => {
    const d1 = parseFloat(outerDiameter);
    const d2 = parseFloat(innerDiameter);
    const h = parseFloat(height) / 12; // Convert inches to feet
    const q = parseFloat(quantity);

    if (isNaN(d1) || isNaN(d2) || isNaN(h) || isNaN(q)) {
      return;
    }

    // Calculate area of outer circle
    const r1 = d1 / 2;
    const area1 = Math.PI * r1 * r1;

    // Calculate area of inner circle
    const r2 = d2 / 2;
    const area2 = Math.PI * r2 * r2;

    // Calculate volume in cubic feet (area difference * height * quantity)
    const volumeCubicFeet = (area1 - area2) * h * q;

    // Convert to other volume units
    const volumeCubicYards = volumeCubicFeet / 27;
    const volumeCubicMeters = volumeCubicFeet * 0.0283168;

    setResult({
      volumeCubicFeet,
      volumeCubicYards,
      volumeCubicMeters,
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white mb-4"
                >
                  Circular Slab/Tube Volume Calculator
                </Dialog.Title>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Outer Diameter (feet)
                    </label>
                    <input
                      type="number"
                      value={outerDiameter}
                      onChange={(e) => setOuterDiameter(e.target.value)}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Inner Diameter (feet)
                    </label>
                    <input
                      type="number"
                      value={innerDiameter}
                      onChange={(e) => setInnerDiameter(e.target.value)}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Length or Height (inches)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={calculateVolume}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Calculate
                  </button>
                  {result !== null && (
                    <div className="mt-4 p-4 bg-gray-700 rounded-lg space-y-2">
                      <h4 className="text-white font-semibold">Volume:</h4>
                      <p className="text-gray-300">
                        {result.volumeCubicFeet.toFixed(2)} cubic feet
                      </p>
                      <p className="text-gray-300">
                        {result.volumeCubicYards.toFixed(2)} cubic yards
                      </p>
                      <p className="text-gray-300">
                        {result.volumeCubicMeters.toFixed(2)} cubic meters
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
