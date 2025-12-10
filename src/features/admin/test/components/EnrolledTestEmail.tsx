"use client";
import React, { useState } from "react";
import Input from "@/components/Input";
import { useEnrollTestuser } from "@/features/admin/test/hooks/useTest";
import { useSearchUserTest } from "@/features/admin/test/hooks/useTest";
import toast from "react-hot-toast";

type Props = { testId: string };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EnrolledTestEmail: React.FC<Props> = ({ testId }) => {
  const [value, setValue] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // ⭐ Search Hook (fixed)
  const {
    data: searchResults = [],
    isLoading: searchLoading,
  } = useSearchUserTest(value);

  // enroll hook
  const { mutate, isPending } = useEnrollTestuser();

  const addEmail = (email?: string) => {
    setError(null);

    const raw = email || value;
    if (!raw) return;

    const parts = raw
      .split(/[\s,;\n]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0);

    const invalid = parts.filter((e) => !emailRegex.test(e));
    if (invalid.length > 0) {
      return setError(`Invalid emails: ${invalid.join(", ")}`);
    }

    const newOnes = parts.filter((e) => !emails.includes(e));
    if (newOnes.length === 0) return setError("Email already added.");

    setEmails((prev) => [...prev, ...newOnes]);
    setValue("");
    setShowDropdown(false);
  };

  const removeEmail = (email: string) =>
    setEmails((prev) => prev.filter((e) => e !== email));

  const handleSubmit = () => {
    if (emails.length === 0) {
      toast.error("Please add at least one email");
      return;
    }

    mutate(
      { testId, emails },
      {
        onSuccess: () => {
          toast.success("Users enrolled successfully!");
          setEmails([]);
        },
        onError: (err: unknown) => {
          if (err instanceof Error) {
            toast.error(err.message);
          } else {
            toast.error("Something went wrong");
          }
        },
      }
    );
  };


  return (
    <div className="w-full max-w-full mx-auto">

      <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
        Enroll Users — <span className="text-blue-600">{testId}</span>
      </h2>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">

        {/* INPUT */}
        <div className="relative">
          <div className="flex gap-3 mb-2">
            <Input
              type="text"
              placeholder="Enter email or search users..."
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className={`flex-1 px-4 py-2.5 rounded-lg border text-sm shadow-sm ${error ? "border-red-500" : "border-gray-300"
                }`}
            />

            {/* <button
              onClick={() => addEmail()}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-black transition"
            >
              Add
            </button> */}
          </div>

          {/* ⭐ DROPDOWN */}
          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">

              {searchLoading && (
                <div className="px-4 py-2 text-sm text-gray-500">
                  Searching...
                </div>
              )}

              {!searchLoading &&
                searchResults.length > 0 &&
                searchResults.map((userEmail: string) => (
                  <div
                    key={userEmail}
                    onClick={() => addEmail(userEmail)}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                  >
                    {userEmail}
                  </div>
                ))}

              {!searchLoading &&
                searchResults.length === 0 &&
                value.length > 1 && (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No users found
                  </div>
                )}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        {/* LIST HEADER */}
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

        {/* EMAIL LIST */}
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
                  className="text-gray-500 hover:text-red-600 transition text-lg"
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
