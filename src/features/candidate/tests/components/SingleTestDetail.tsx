import React from 'react';
import { Test } from '@/types/Test'; // ✅ Import real type
import { Clock, CheckCircle, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface SingleTestDetailProps {
  test: Test; // ✅ Strictly typed
}

const SingleTestDetail = ({ test }: SingleTestDetailProps) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/tests" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Tests
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-4">
              {test.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{test.title}</h1>
            <p className="text-gray-600 text-lg">
              {test.summury || "No summary available."}
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50/50">
            <div className="p-6 text-center">
              <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="font-bold text-xl">{test.duration > 1000 ? "Unlimited" : test.duration}</div>
              <div className="text-xs text-gray-500 uppercase">Duration (min)</div>
            </div>
            <div className="p-6 text-center">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="font-bold text-xl">{test.passingScore}%</div>
              <div className="text-xs text-gray-500 uppercase">Passing Score</div>
            </div>
            <div className="p-6 text-center">
              <Calendar className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="font-bold text-xl">
                {test.createdAt ? new Date(test.createdAt).toLocaleDateString() : "N/A"}
              </div>
              <div className="text-xs text-gray-500 uppercase">Created</div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Instructions</h3>
            <div className="prose max-w-none text-gray-600">
              {test.prompt || test.description || "No specific instructions provided."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTestDetail;