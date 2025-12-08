"use client";

import React, { useEffect, useState, useMemo } from "react";
import Input from "@/components/Input";
import { useEnrollTest, useSearchUser } from "@/features/admin/test/hooks/useTest";

interface User {
  _id: string;
  email: string;
  phoneNumber: string;
}

type Props = { testId: string };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple debounce hook
function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

const EnrolledTestEmail: React.FC<Props> = ({ testId }) => {
  const [value, setValue] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const { mutate, isPending } = useEnrollTest(testId);
  const debouncedValue = useDebounce(value, 400);
  const { data: searchResult } = useSearchUser(debouncedValue);

  /** -------- FETCH CURRENT ENROLLED USERS -------- */
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`/api/tests/${testId}/users`);
        const result = await res.json();
        setUsers(Array.isArray(result?.data) ? result.data : []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    }
    fetchUsers();
  }, [testId]);

  /** -------- MULTI EMAIL ADD LOGIC -------- */
  const addEmail = (inputValue?: string) => {
    const input = inputValue ?? value;
    setError(null);

    const parts = input
      .split(/[\s,;\n]+/)
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email.length > 0);

    if (parts.length === 0) return setError("Please enter at least one email.");

    const invalidEmails = parts.filter((email) => !emailRegex.test(email));
    if (invalidEmails.length > 0)
      return setError(`Invalid emails: ${invalidEmails.join(", ")}`);

    const newEmails = parts.filter((email) => !emails.includes(email));
    if (newEmails.length === 0) return setError("All emails already added.");

    setEmails((prev) => [...prev, ...newEmails]);
    setValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  /** -------- SUBMIT ENROLLMENT -------- */
  const handleSubmit = () => {
    if (emails.length === 0) return alert("Please add at least one email");

    mutate(
      { testId, emails },
      {
        onSuccess: () => {
          alert("Users enrolled successfully!");
          setEmails([]);
          setTimeout(() => window.location.reload(), 600);
        },
        onError: (err: Error) => alert(`Failed: ${err.message}`),
      }
    );
  };

  /** -------- MEMOIZED SEARCH RESULTS -------- */
  const filteredSearchResults = useMemo(() => {
    if (!searchResult || !Array.isArray(searchResult)) return [];
    return searchResult.filter((u: User) => !emails.includes(u.email));
  }, [searchResult, emails]);

  return (
    <div className="w-full max-w-full mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
        Enroll Users — <span className="text-blue-600 font-medium">{testId}</span>
      </h2>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        {/* INPUT */}
        <div className="flex gap-3 mb-2 relative">
          <Input
            type="text"
            placeholder="Enter email(s)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            className={`flex-1 px-4 py-2.5 rounded-lg border text-sm shadow-sm ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />

          <button
            onClick={() => addEmail()}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-black transition"
          >
            Add
          </button>

          {/* AUTOCOMPLETE DROPDOWN */}
          {filteredSearchResults.length > 0 && value.length > 2 && (
            <div className="absolute top-full left-0 right-0 bg-gray-100 border border-gray-300 rounded mt-1 z-10 max-h-60 overflow-y-auto">
              {filteredSearchResults.map((user: User) => (
                <div
                  key={user._id}
                  className="cursor-pointer p-2 hover:bg-gray-200 rounded"
                  onClick={() => addEmail(user.email)}
                >
                  {user.email} — {user.phoneNumber}
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        {/* HEADER */}
        <div className="flex justify-between items-center mt-6 mb-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Recipients ({emails.length})
          </h3>

          <button
            onClick={handleSubmit}
            disabled={isPending || emails.length === 0}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
          >
            {isPending ? "Enrolling..." : "Enroll Users"}
          </button>
        </div>

        {/* LIST OF ADDED EMAILS */}
        {emails.length === 0 ? (
          <div className="p-6 text-center rounded-lg border bg-gray-50 text-gray-500 text-sm">
            No recipients added yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3 py-3">
            {emails.map((email, idx) => (
              <div key={idx} className="flex justify-between p-3 rounded-lg bg-white border">
                <span>{email}</span>
              </div>
            ))}
          </div>
        )}

        {/* CURRENT ENROLLED USERS */}
        {users.length > 0 && (
          <>
            <h3 className="mt-6 text-sm font-semibold text-gray-700">
              Already Enrolled Users ({users.length})
            </h3>
            <div className="flex flex-col gap-3 py-3">
              {users.map((user) => (
                <div key={user._id} className="flex justify-between p-3 rounded-lg bg-white border">
                  <span>{user.email} — {user.phoneNumber}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EnrolledTestEmail;
