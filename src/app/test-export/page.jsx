"use client";

import React, { useMemo } from 'react';
import TemplatePreview from '@/components/export/TemplatePreview';
import ExportButtons from '@/components/export/ExportButtons';
import buildProfileTemplate from '@/templates/profileTemplate';
import { sampleProfile } from '@/data/sampleData';

// Isolated test page for validating export flows (HTML preview, PDF, Excel).
const TestExportPage = () => {
    const htmlContent = useMemo(() => buildProfileTemplate(sampleProfile), []);

    return (
        <main className="min-h-screen bg-slate-50 py-10">
            <div className="max-w-5xl mx-auto px-4 space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-600 font-semibold">Test Route Only</p>
                    <h1 className="text-2xl font-bold text-slate-900 mt-2">Profile Export Sandbox</h1>
                    <p className="text-sm text-slate-600 mt-1">
                        Use this isolated page to verify HTML preview plus PDF and Excel exports. No production data or state is touched.
                    </p>
                </div>

                <TemplatePreview html={htmlContent} />
                <ExportButtons htmlContent={htmlContent} data={sampleProfile} />
            </div>
        </main>
    );
};

export default TestExportPage;
