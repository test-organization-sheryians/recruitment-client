import { useState } from "react";

interface Props {
  isDirty: boolean;
  isReviewed: boolean;
}

export function usePreventNavigation({ isDirty, isReviewed }: Props) {
  const [showSaveWarning, setShowSaveWarning] = useState(false);
  const [pendingNav, setPendingNav] = useState<null | (() => void)>(null);

  const tryNavigate = (action: () => void) => {
    if (isDirty && !isReviewed) {
      setPendingNav(() => action);
      setShowSaveWarning(true);
      return;
    }
    action();
  };

  const clearWarning = () => {
    setShowSaveWarning(false);
    setPendingNav(null);
  };

  const confirmAndNavigate = () => {
  setShowSaveWarning(false);
  if (pendingNav) pendingNav();
  setPendingNav(null);
};


  return {
    tryNavigate,
    showSaveWarning,
    pendingNav,
    clearWarning,
    confirmAndNavigate
  };
}
