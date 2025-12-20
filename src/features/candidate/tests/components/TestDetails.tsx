import React from 'react';
import Link from 'next/link';
import { Clock, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Enrollment } from '@/types/Test'; // ✅ Import the real type

interface TestDetailsProps {
  tests: Enrollment[]; // ✅ Strictly typed array
}

const TestDetails = ({ tests }: TestDetailsProps) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">My Enrolled Tests</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests?.map((enrollment) => {
            // ✅ Unwrap the test object from the enrollment
            const test = enrollment.test;
            
            // Safety check: if data is missing, skip this card
            if (!test) return null;

            return (
              <div key={enrollment._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                
                {/* Category & Status */}
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {test.category || "General"}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${test.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {test.status ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {test.title}
                </h3>

                {/* Summary (Using 'summury') */}
                <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">
                  {test.summury || "No summary available."}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{test.duration > 1000 ? "Unlimited" : `${test.duration} min`}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Pass: {test.passingScore}%</span>
                  </div>
                </div>

                {/* Button */}
                <Link 
                  href={`/tests/${test._id}`}
                  className="mt-auto w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestDetails;