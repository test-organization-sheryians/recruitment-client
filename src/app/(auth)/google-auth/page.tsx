import LoginButton from "@/components/LoginButton";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-500 mb-6">
          Sign in to continue to your dashboard
        </p>

        <LoginButton />

      </div>
      
    </div>
  );
}