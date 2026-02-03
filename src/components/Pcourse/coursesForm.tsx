import { useState } from "react";
import { useCourseMutations } from "@/hooks/course/useCourses";

export const CourseForm = () => {
    // Local state for the form inputs
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    const { createMutation } = useCourseMutations();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Convert price to number and send data
        createMutation.mutate(
            { title, price: Number(price), description },
            {
                onSuccess: () => {
                    // Clear form after success
                    setTitle("");
                    setPrice("");
                    setDescription("");
                }
            }
        );
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Course</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Course Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Advanced React Patterns"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* Price Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 5000"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* Description Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your course..."
                        required
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
                >
                    {createMutation.isPending ? "Creating..." : "Create Course"}
                </button>
            </form>
        </div>
    );
};