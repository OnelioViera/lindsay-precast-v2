"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ConcreteCalculator from "./ConcreteCalculator";
import RoundCalculator from "./RoundCalculator";
import TubeCalculator from "./TubeCalculator";

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "square" | "round" | "tube";
}

export default function CalculatorModal({
  isOpen,
  onClose,
  type,
}: CalculatorModalProps) {
  const getTitle = () => {
    switch (type) {
      case "square":
        return "Concrete Calculator - Slabs, Square Footings, or Walls";
      case "round":
        return "Concrete Calculator - Holes, Columns, or Round Footings";
      case "tube":
        return "Concrete Calculator - Circular Slab or Tube";
      default:
        return "Concrete Calculator";
    }
  };

  const getCalculator = () => {
    switch (type) {
      case "square":
        return <ConcreteCalculator />;
      case "round":
        return <RoundCalculator />;
      case "tube":
        return <TubeCalculator />;
      default:
        return <ConcreteCalculator />;
    }
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

        <div className="fixed inset-0 z-10 overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-gray-800 text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-white mb-6"
                  >
                    {getTitle()}
                  </Dialog.Title>
                  {getCalculator()}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
