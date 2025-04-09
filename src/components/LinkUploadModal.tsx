import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { XMarkIcon, LinkIcon } from "@heroicons/react/24/outline";

interface LinkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (url: string, name: string, description: string) => void;
}

export default function LinkUploadModal({
  isOpen,
  onClose,
  onUpload,
}: LinkUploadModalProps) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && name) {
      onUpload(url, name, description);
      setUrl("");
      setName("");
      setDescription("");
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
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-gray-800/95 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-full bg-gray-700/50 p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-700/70 transition-colors"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <LinkIcon className="h-6 w-6 text-blue-500" />
                      </div>
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-semibold leading-6 text-white"
                      >
                        Add New Link
                      </Dialog.Title>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="url"
                          className="block text-sm font-medium text-gray-300"
                        >
                          URL
                        </label>
                        <input
                          type="url"
                          id="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="block w-full rounded-xl border-0 bg-gray-700/50 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all"
                          placeholder="https://example.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-300"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="block w-full rounded-xl border-0 bg-gray-700/50 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all"
                          placeholder="Link Name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-300"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="block w-full rounded-xl border-0 bg-gray-700/50 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all"
                          placeholder="Link Description"
                          rows={3}
                        />
                      </div>
                      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-xl bg-gray-700/50 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-700/70 transition-colors sm:w-auto"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition-colors sm:w-auto"
                        >
                          Add Link
                        </button>
                      </div>
                    </form>
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
