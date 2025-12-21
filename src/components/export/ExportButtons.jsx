"use client";

import React from 'react';
import exportPDF from '@/utils/exportPDF';
import exportExcel from '@/utils/exportExcel';
import exportDocx from '@/utils/exportDocx';

// Test-only controls for exporting the generated template
const ExportButtons = ({ htmlContent, data }) => {
    const handlePdf = async () => {
        await exportPDF(htmlContent, 'profile.pdf', data);
    };
    const handleExcel = () => exportExcel(data);
    const handleDocx = async () => {
        await exportDocx(data);
    };

    return (
        <div className="flex flex-wrap gap-3 ">
            <button
                type="button"
                onClick={handlePdf}
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition cursor-pointer"
            >
                Download PDF
            </button>
            <button
                type="button"
                onClick={handleExcel}
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition cursor-pointer"
            >
                Download Excel
            </button>
            <button
                type="button"
                onClick={handleDocx}
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-slate-700 text-white font-semibold shadow hover:bg-slate-800 transition cursor-pointer"
            >
                Download Word
            </button>
        </div>
    );
};

export default ExportButtons;
