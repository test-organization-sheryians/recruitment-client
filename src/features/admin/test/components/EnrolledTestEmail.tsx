"use client";
import React, { useState } from "react";
// import Button from "@/components/Button";
import Input from "@/components/Input";
import { useEnRollTest } from "@/features/admin/test/hooks/useTest";

type Props = { testId: string };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EnrolledTestEmail: React.FC<Props> = ({ testId }) => {
  const [value, setValue] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useEnRollTest(testId);

  // MULTI EMAIL ADD LOGIC
  const addEmail = () => {
    setError(null);

    // Split by comma, space, semicolon, new lines
    const parts = value
      .split(/[\s,;\n]+/)
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email.length > 0);

    if (parts.length === 0) {
      return setError("Please enter at least one email.");
    }

    const invalidEmails = parts.filter((email) => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      return setError(`Invalid emails: ${invalidEmails.join(", ")}`);
    }

    const newEmails = parts.filter((email) => !emails.includes(email));

    if (newEmails.length === 0) {
      return setError("All emails already added.");
    }

    setEmails((prev) => [...prev, ...newEmails]);
    setValue(""); // Clear input
  };

  const removeEmail = (email: string) => {
    setEmails((prev) => prev.filter((x) => x !== email));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  const handleSubmit = () => {
    if (emails.length === 0) return alert("Please add at least one email");

    mutate(
      { testId, emails },
      {
        onSuccess: () => {
          alert("Users enrolled successfully!");
          setEmails([]);
        },
        onError: (err: Error) => alert(`Failed: ${err.message}`),
      }
    );
  };

  return (
    <div className="w-full max-w-full mx-auto">

      {/* MODAL TITLE */}
      <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
        Enroll Users —{" "}
        <span className="text-blue-600 font-medium">{testId}</span>
      </h2>

      {/* INNER CLEAN CARD */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">

        {/* EMAIL INPUT */}
        <div className="flex gap-3 mb-2">
          <Input
            type="text"
            placeholder="Enter one or multiple emails (comma, space, new line)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            className={`flex-1 px-4 py-2.5 rounded-lg border text-sm shadow-sm ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />

          <button
            onClick={addEmail}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-black transition"
          >
            Add
          </button>
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        {/* HEADER ROW */}
        <div className="flex justify-between items-center mt-6 mb-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Recipients ({emails.length})
          </h3>

          <button
            onClick={handleSubmit}
            disabled={isPending || emails.length === 0}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg 
            hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isPending ? "Enrolling..." : "Enroll Users"}
          </button>
        </div>

        {/* RECIPIENT LIST */}
        {emails.length === 0 ? (
          <div className="p-6 text-center rounded-lg border bg-gray-50 text-gray-500 text-sm">
            No recipients added yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3 py-3 w-full">
            {emails.map((email) => (
              <div
                key={email}
                className="w-full flex items-center justify-between px-5 py-3
                bg-white border border-gray-200 rounded-xl shadow-sm"
              >
                <span className="text-gray-800 font-medium text-sm break-all">
                  {email}
                </span>

                <button
                  onClick={() => removeEmail(email)}
                  className="text-gray-500 hover:text-red-600 transition text-lg leading-none"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledTestEmail;
