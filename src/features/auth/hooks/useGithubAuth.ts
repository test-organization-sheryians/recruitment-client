const useGithubAuth = () => {
  const handleGithubLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/github`;
  };

  return { handleGithubLogin };
};

export default useGithubAuth;