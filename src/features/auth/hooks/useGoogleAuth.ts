const useGoogleAuth = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`;
  };

  return { handleGoogleLogin };
};

export default useGoogleAuth;