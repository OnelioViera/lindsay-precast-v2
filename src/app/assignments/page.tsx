"use client";

import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "@/components/Navbar";

interface Assignment {
  id: string;
  title: string;
  description: string;
  pdfUrl?: string;
  createdAt: Date;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    pdfFile: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setNewAssignment({ ...newAssignment, pdfFile: file });
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAssignment.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!newAssignment.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    try {
      // Here you would typically upload the PDF to your server/storage
      // For now, we'll just create a local URL
      const pdfUrl = newAssignment.pdfFile
        ? URL.createObjectURL(newAssignment.pdfFile)
        : undefined;

      const newAssignmentObj: Assignment = {
        id: Date.now().toString(),
        title: newAssignment.title,
        description: newAssignment.description,
        pdfUrl,
        createdAt: new Date(),
      };

      setAssignments([...assignments, newAssignmentObj]);
      setNewAssignment({ title: "", description: "", pdfFile: null });
      setIsModalOpen(false);
      toast.success("Assignment created successfully!");
    } catch (error) {
      toast.error("Error creating assignment");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4">
      <Toaster position="top-right" />
      <Navbar />
      <main className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Assignments</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Create New Assignment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
            >
              <h2 className="text-xl font-semibold text-white mb-2">
                {assignment.title}
              </h2>
              <p className="text-gray-300 mb-4">{assignment.description}</p>
              {assignment.pdfUrl && (
                <a
                  href={assignment.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  View PDF
                </a>
              )}
              <div className="mt-4 text-sm text-gray-400">
                Created: {assignment.createdAt.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {assignments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No assignments yet.</p>
          </div>
        )}
      </main>

      {/* Create Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Create New Assignment
              </h2>
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
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={newAssignment.description}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="pdf"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  PDF File
                </label>
                <input
                  type="file"
                  id="pdf"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {newAssignment.pdfFile && (
                  <p className="mt-1 text-sm text-gray-400">
                    Selected file: {newAssignment.pdfFile.name}
                  </p>
                )}
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
