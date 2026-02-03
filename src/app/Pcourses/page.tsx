"use client";

import { useCourses } from "@/hooks/course/useCourses";
import { CourseCard } from "@/components/Pcourse/courseCard";
import { CourseForm } from "@/components/Pcourse/coursesForm";

export default function CoursesPage() {
    // Fetch data using the Hook
    const { data: courses, isLoading, isError } = useCourses();

    return (
        <div className="min-h-screen bg-gray-50 p-10">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Course Management
                </h1>

                {/* PART 1: The Creation Form */}
                <div className="mb-12">
                    <CourseForm />
                </div>

                {/* PART 2: The Course List */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Courses</h2>
                    
                    {isLoading && <div className="text-center">Loading List...</div>}
                    {isError && <div className="text-red-500 text-center">Error loading courses.</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses?.map((course) => (
                            <CourseCard key={course._id} data={course} />
                        ))}
                        
                        {/* Empty State Message */}
                        {!isLoading && courses?.length === 0 && (
                            <p className="text-gray-500 col-span-full text-center">
                                No courses found. Add one above!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}