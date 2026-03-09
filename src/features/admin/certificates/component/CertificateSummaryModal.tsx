"use client";

export default function CertificateSummaryModal({ data, onClose }: any) {

  if (!data) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

      <div className="bg-white rounded-xl shadow-xl p-8 w-[380px] text-center">

        <h2 className="text-xl font-bold mb-4">
          Certificate Summary
        </h2>

        <p>
          Total Rows: <b>{data.totalRows}</b>
        </p>

        <p className="text-green-600">
          Certificates Sent: <b>{data.successCount}</b>
        </p>

        <p className="text-red-500">
          Missing Emails: <b>{data.failedCount}</b>
        </p>

        <button
          onClick={onClose}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-ponter"
        >
          Close
        </button>

      </div>

    </div>
  );
}