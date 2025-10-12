"use client";
import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import ResumeUpload from "@/features/AITest/components/smart/ResumeUpload";
import CodeModal from "@/features/AITest/components/CodeModal";
import FileUpload from "@/features/AITest/components/FileUpload";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  isQuestion?: boolean;
}

interface Question {
  id: string;
  question: string;
  topics: string[];
  constraints: string;
  testCases: Array<{
    input: string;
    output: string;
  }>;
  explanation: string;
}

const Avatar = ({ isAI = false }: { isAI?: boolean }) => (
  <div
    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
      isAI ? "bg-purple-100" : "bg-blue-100"
    }`}
  >
    {isAI ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-purple-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10a1 1 0 01-1.64 0l-7-10A1 1 0 014 7h4V2a1 1 0 011.3-.954z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-blue-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        />
      </svg>
    )}
  </div>
);

const AIInterviewPage = () => {
  const [questions, setQuestions] = useState<Array<any> | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! How can I assist you further?",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleCloseModal = () => {
    setShowCodeModal(false);
    setCurrentQuestion(null);
  };

  const handleCodeSave = (id: string, code: string, language: string) => {
    console.log(
      "Code submitted for question:",
      id,
      "Language:",
      language,
      "Code:",
      code
    );

    setQuestions((prev) => {
      const submittedQuestion =
        prev?.map((question) =>
          question.id === id
            ? {
                ...question,
                solution: code,
                language,
                submittedAt: new Date().toISOString(),
              }
            : question
        ) || [];

      localStorage.setItem("questions", JSON.stringify(submittedQuestion));
      return submittedQuestion;
    });

    const submission = {
      questionId: currentQuestion?.id,
      question: currentQuestion?.question,
      code,
      language,
      submittedAt: new Date().toISOString(),
    };

    const submissions = JSON.parse(
      localStorage.getItem("code_submissions") || "[]"
    );
    submissions.push(submission);
    localStorage.setItem("code_submissions", JSON.stringify(submissions));

    setShowCodeModal(false);
    setCurrentQuestion(null);
  };

  const onResumeUploadSuccess = (data: any) => {
    setQuestions(data.questions);
    localStorage.setItem("questions", JSON.stringify(data.questions));
  };

  const handleFileUpload = (file: File) => {
    console.log(file);
  };

  const handleClearChat = () => {
    alert("Clear Chat");
  };

  const handleQuestionClick = (question: Question) => {
    setCurrentQuestion(question);
    setShowCodeModal(true);
  };

  const handleSubmitTest = () => {
    console.log("Questions:", questions);

    const solutions = questions?.map((question) => question.solution || "");
    const questionsData = questions?.map(({ id, question, aiSolution }) => ({
      id,
      question,
      aiSolution,
    }));

    console.log({ solutions, questions: questionsData });
    alert("Submited Test....");

    setShowCodeModal(false);
    setCurrentQuestion(null);
  };

  useEffect(() => {
    setQuestions(JSON.parse(localStorage.getItem("questions") || "[]"));
  }, []);

  if (!questions || questions.length === 0) {
    return <ResumeUpload onUploadSuccess={onResumeUploadSuccess} />;
  }

  return (
    <main>
      <div className="relative flex flex-col h-full font-sans">
        <div className="sticky top-0 z-10 p-4 border-b bg-white flex justify-between items-center">
          <h2 className="text-lg font-semibold">Resume Chat</h2>

          <button
            className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded transition-colors"
            onClick={handleClearChat}
          >
            Clear Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
          <div className="flex items-start justify-end gap-3">
            <div className="flex flex-col items-end max-w-[80%]">
              <div className="bg-[#d9e8ff] text-black rounded-lg p-3 rounded-br-none">
                <p>
                  Review my resume & prepare the question curated from my
                  resume.
                </p>
                <FileUpload onFileChange={handleFileUpload} />
              </div>
            </div>
            <Avatar />
          </div>

          {error && (
            <div className="flex items-start gap-3">
              <Avatar isAI />
              <div className="flex-1">
                <div className="text-gray-800 max-w-[80%]">
                  <p className="font-medium text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          {questions.length > 0 && (
            <div className="flex items-start gap-3">
              <Avatar isAI />
              <div className="flex-1">
                <div className="text-gray-800 max-w-[80%]">
                  <p className="font-medium">
                    These are the {questions.length} curated questions, given
                    below :-
                  </p>
                </div>

                {/* Questions List */}
                <div className="mt-4 space-y-3 flex flex-col items-start w-[70%]">
                  {questions.map((question, index) => (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionClick(question)}
                      className="w-full text-left p-3 bg-[#ebf0f8] text-black rounded-md border border-blue-200 hover:bg-[#d9e0eb] transition-colors flex items-start gap-3"
                    >
                      <span className="font-medium text-black">
                        {index + 1}.
                      </span>
                      <div className="text-left">
                        <div className="font-medium">{question.question}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Topics: {question.topics.join(", ")}
                        </div>
                      </div>
                    </button>
                  ))}
                  <div className="w-full flex justify-end">
                    <button
                      onClick={handleSubmitTest}
                      className=" text-left px-3 py-2 bg-blue-500 text-white rounded-md border border-blue-200 hover:bg-blue-600 transition-colors flex items-start gap-3 disabled:bg-blue-200 disabled:text-gray-400 cursor-pointer"
                      disabled={questions.length === 0}
                    >
                      <span className="font-medium">Submit Test</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="space-y-1">
              {message.sender === "ai" ? (
                // AI Message
                <div className="flex items-start gap-3">
                  <Avatar isAI />
                  <div className="flex-1">
                    <div className="text-gray-800 max-w-[80%]">
                      <p className="font-medium">{message.text}</p>
                    </div>
                  </div>
                </div>
              ) : (
                // User Message
                <div className="flex items-start justify-end gap-3">
                  <div className="flex flex-col items-end max-w-[80%]">
                    <div className="bg-[#d9e8ff] text-black rounded-lg p-3 rounded-br-none">
                      <p>{message.text}</p>
                      {message.id === "1" && (
                        <>
                          <FileUpload onFileChange={handleFileUpload} />
                        </>
                      )}
                    </div>
                  </div>
                  <Avatar />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-white sticky bottom-0">
          <div className="flex justify-center">
            <div className="flex w-full max-w-2xl mx-auto">
              <input
                type="text"
                value={inputValue}
                onChange={onInputChange}
                onKeyPress={onInputKeyDown}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[#ebf0f8]"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <CodeModal
          question={currentQuestion!}
          isOpen={showCodeModal}
          onClose={handleCloseModal}
          onSubmit={handleCodeSave}
        />
      </div>
    </main>
  );
};

export default AIInterviewPage;
