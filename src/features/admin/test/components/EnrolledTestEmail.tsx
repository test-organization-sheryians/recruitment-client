"use client";
import React, { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";

type Props = {
  initialEmails?: string[];
  onChange?: (emails: string[]) => void;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EnrolledTestEmail: React.FC<Props> = ({ initialEmails = [], onChange }) => {
  const [value, setValue] = useState<string>("");
  const [emails, setEmails] = useState<string[]>(initialEmails.map((e) => e.toLowerCase()));
  const [error, setError] = useState<string | null>(null);

  /**
   * Add one or multiple emails at once
   */
  const addEmail = () => {
    const raw = value.trim().toLowerCase();
    setError(null);

    if (!raw) {
      setError("Email address cannot be empty.");
      return;
    }

    // Split by comma OR space
    const parts = raw.split(/[\s,]+/).filter(Boolean);

    const invalid: string[] = [];
    const validNew: string[] = [];

    parts.forEach((email) => {
      if (!emailRegex.test(email)) {
        invalid.push(email);
        return;
      }
      if (!emails.includes(email)) {
        validNew.push(email);
      }
    });

    if (invalid.length) {
      setError(`Invalid emails: ${invalid.join(", ")}`);
    }

    if (validNew.length === 0) return;

    const next = [...emails, ...validNew];
    setEmails(next);
    onChange?.(next);
    setValue(""); // clear input after adding
  };

  /**
   * Enter key handler (add all emails at once)
   */
  const onKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      addEmail();
    }
  };

  /** Remove email */
  const removeEmail = (e: string) => {
    const next = emails.filter((x) => x !== e);
    setEmails(next);
    onChange?.(next);
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white border border-gray-200 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
        Recipient Management
      </h2>

      <div className="flex gap-2">
        <Input
          id="inrole-email-pro"
          type="text"
          placeholder="Enter emails (comma or space separated)"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          className={`flex-1 px-3 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-150 text-base`}
          aria-label="Enter email"
        />

        <Button
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-150 shadow-sm"
          onClick={addEmail}
        >
          Add
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-100 mt-3 p-3 rounded-md border border-red-300">
          <strong>Error:</strong> {error}
        </p>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
          Current Recipients ({emails.length})
        </h3>

        {emails.length === 0 ? (
          <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-md border border-gray-200">
            No recipients have been added.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2">
            {emails.map((e) => (
              <div
                key={e}
                className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-200"
              >
                <span className="truncate max-w-full">{e}</span>
                <button
                  onClick={() => removeEmail(e)}
                  className="text-gray-500 hover:text-red-600 ml-1 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
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
 