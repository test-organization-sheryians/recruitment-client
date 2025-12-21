"use client";

const TemplatePreview = ({ html }) => {
    if (!html) return null;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
            <div className="mb-3">
                <p className="text-sm font-semibold text-slate-800">Template Preview (Test Only)</p>
                <p className="text-xs text-slate-500">Rendered below using dangerouslySetInnerHTML.</p>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="bg-white" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </div>
    );
};

export default TemplatePreview;
