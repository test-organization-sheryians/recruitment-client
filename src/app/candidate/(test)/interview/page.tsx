"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);


  const dummyData = [
    {
      id: 1,
      question:
        "Given a large dataset of oceanographic and agricultural records, write a function to efficiently query and analyze the data using GenAI-driven prompt parsing and auto-chart generation.",
      topics: ["GenAI", "Data Analysis", "Full-Stack Development"],
      constraints:
        "The function should handle 10,000+ records and reduce manual processing time by 70%.",
      testCases: [
        {
          input: "ARGO dataset with 10,000+ records",
          output: "Auto-generated charts + analysis",
        },
      ],
      explanation:
        "This question checks your ability to design a GenAI-driven data analysis pipeline.",
      aiSolution: "function analyzeData(dataset){ return 'sample'; }",
      isCoding: true,
    },
    {
      id: 2,
      question:
        "Design and implement a real-time auto-save system with debounced state updates.",
      topics: ["React", "Node.js", "Real-Time Systems"],
      constraints:
        "Must improve reliability by 45% and reduce server load by 30%.",
      testCases: [{ input: "User typing", output: "Debounced save request" }],
      explanation:
        "This question checks your understanding of debounce + real-time state sync.",
      aiSolution: "function autoSave(){ return true; }",
      isCoding: false,
    },
    {
      id: 3,
      question:
        "Explain the Node.js Event Loop in simple words with an example.",
      topics: ["Node.js", "Backend", "Event Loop"],
      constraints: "Answer should be beginner friendly.",
      testCases: [],
      explanation: "Tests conceptual understanding.",
      aiSolution: "",
      isCoding: false,
    },
  ];

  // -------------------------------
  // Load Dummy Data
  // -------------------------------
  useEffect(() => {
    setQuestions(dummyData);
  }, []);

  // -------------------------------
  // NEXT BUTTON LOGIC
  // -------------------------------
  const handleNext = () => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === current ? { ...q, userAnswer: answer } : q))
    );

    setAnswer("");

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setSubmitted(true);
    }
  };

  // -------------------------------
  // SUBMITTED UI
  // -------------------------------
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Interview Complete</h1>

        <pre className="bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap">
          {JSON.stringify(questions, null, 2)}
        </pre>
      </div>
    );
  }

  // -------------------------------
  // LOAD CURRENT QUESTION
  // -------------------------------
  const q = questions[current];
  if (!q) return <p className="mt-20 text-center">Loading questions...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-14 bg-white p-8 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        Question {current + 1} of {questions.length}
      </h2>

      <p className="text-lg font-medium mb-4">{q.question}</p>

      {/* Metadata */}
      {q.topics?.length > 0 && (
        <div className="mb-3">
          <p className="font-semibold">Topics:</p>
          <p className="text-sm text-gray-700">{q.topics.join(", ")}</p>
        </div>
      )}

      {q.constraints && (
        <div className="mb-3">
          <p className="font-semibold">Constraints:</p>
          <p className="text-sm text-gray-700">{q.constraints}</p>
        </div>
      )}

      {q.testCases?.length > 0 && (
        <div className="mb-3">
          <p className="font-semibold">Test Cases:</p>
          <pre className="bg-gray-100 text-xs p-3 rounded">
            {JSON.stringify(q.testCases, null, 2)}
          </pre>
        </div>
      )}

      {/* Answer Box */}
      {q.isCoding ? (
        <div className="mb-4">
          <Editor
            height="300px"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={answer}
            onChange={(value) => setAnswer(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
            }}
          />
        </div>
      ) : (
        <textarea
          className="w-full border p-3 rounded-lg h-40"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      )}

      <button
        onClick={handleNext}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg"
      >
        {current === questions.length - 1 ? "Submit" : "Next →"}
      </button>
    </div>
  );
}
