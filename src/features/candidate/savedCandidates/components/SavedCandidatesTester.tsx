"use client";

import { ChangeEvent, useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import {
	useGetSavedCandidates,
	useRemoveSavedCandidate,
	useSavedCandidateStatus,
	useSaveCandidate,
} from "../hooks/useSavedCandidatesApi";

type OutputData = Record<string, unknown>;

const extractErrorMessage = (error: unknown) => {
	const typedError = error as { response?: { data?: { message?: string } } } & Error;
	return typedError.response?.data?.message || typedError.message || "Something went wrong";
};

export default function SavedCandidatesTester() {
	const [candidateId, setCandidateId] = useState("");
	const [output, setOutput] = useState<OutputData | null>(null);
	const [errorMessage, setErrorMessage] = useState("");

	const saveCandidateMutation = useSaveCandidate();
	const removeCandidateMutation = useRemoveSavedCandidate();
	const savedCandidatesListQuery = useGetSavedCandidates();
	const savedCandidateStatusQuery = useSavedCandidateStatus(candidateId);

	const resetUi = () => {
		setErrorMessage("");
		setOutput(null);
	};

	const requireCandidateId = () => {
		if (candidateId.trim()) {
			return true;
		}
		setErrorMessage("Please enter a Candidate ID");
		return false;
	};

	const handleSave = async () => {
		if (!requireCandidateId()) return;
		resetUi();

		try {
			await saveCandidateMutation.mutateAsync(candidateId);
			setOutput({ message: "Candidate saved successfully" });
			setCandidateId("");
		} catch (error) {
			setErrorMessage(extractErrorMessage(error));
		}
	};

	const handleCheckStatus = async () => {
		if (!requireCandidateId()) return;
		resetUi();

		try {
			const result = await savedCandidateStatusQuery.refetch();
			if (result.error) throw result.error;
			setOutput((result.data as OutputData) || {});
		} catch (error) {
			setErrorMessage(extractErrorMessage(error));
		}
	};

	const handleGetList = async () => {
		resetUi();

		try {
			const result = await savedCandidatesListQuery.refetch();
			if (result.error) throw result.error;
			setOutput((result.data as OutputData) || {});
		} catch (error) {
			setErrorMessage(extractErrorMessage(error));
		}
	};

	const handleRemove = async () => {
		if (!requireCandidateId()) return;
		resetUi();

		try {
			await removeCandidateMutation.mutateAsync(candidateId);
			setOutput({ message: "Candidate removed successfully" });
			setCandidateId("");
		} catch (error) {
			setErrorMessage(extractErrorMessage(error));
		}
	};

	return (
		<div className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
			<h1 className="mb-6 text-3xl font-bold text-gray-800">Saved Candidates Tester</h1>

			<div className="mb-6">
				<label className="mb-2 block text-sm font-medium text-gray-700">Candidate ID</label>
				<Input
					type="text"
					value={candidateId}
					onChange={(event: ChangeEvent<HTMLInputElement>) => setCandidateId(event.target.value)}
					placeholder="Enter candidate ID"
					className="w-full"
				/>
			</div>

			<div className="mb-6 grid grid-cols-2 gap-4">
				<Button
					onClick={handleSave}
					disabled={saveCandidateMutation.isPending}
					className="w-full rounded-lg bg-green-600 py-2 font-semibold text-white transition hover:bg-green-700"
				>
					{saveCandidateMutation.isPending ? "Saving..." : "Save Candidate"}
				</Button>

				<Button
					onClick={handleCheckStatus}
					className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700"
				>
					Check Status
				</Button>

				<Button
					onClick={handleGetList}
					className="w-full rounded-lg bg-purple-600 py-2 font-semibold text-white transition hover:bg-purple-700"
				>
					Get List
				</Button>

				<Button
					onClick={handleRemove}
					disabled={removeCandidateMutation.isPending}
					className="w-full rounded-lg bg-red-600 py-2 font-semibold text-white transition hover:bg-red-700"
				>
					{removeCandidateMutation.isPending ? "Removing..." : "Remove Candidate"}
				</Button>
			</div>

			{errorMessage && (
				<div className="mb-6 rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
					<p className="font-semibold">Error:</p>
					<p>{errorMessage}</p>
				</div>
			)}

			{output && (
				<div className="mb-6 rounded-lg border border-gray-300 bg-gray-100 p-4">
					<p className="mb-2 font-semibold text-gray-800">Response:</p>
					<pre className="max-h-96 overflow-auto rounded border border-gray-200 bg-white p-3 text-sm text-gray-700">
						{JSON.stringify(output, null, 2)}
					</pre>
				</div>
			)}
		</div>
	);
}
