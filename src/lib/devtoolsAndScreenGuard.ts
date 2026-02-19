export function enableDevToolsGuard() {
  // 1. Track if the guard is currently active
  let isGuardActive = true;

  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

  /* =========================
     BLOCK RIGHT CLICK
     ========================= */
  const onContextMenu = (e: MouseEvent) => {
    if (!isGuardActive) return;

    e.preventDefault();
    e.stopPropagation();
  };

  /* =========================
    KEYBOARD GUARD
     ========================= */
  const onKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();

    // Normalize modifier keys for cross-platform ease
    const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

    /* SECRET SHORTCUT: TOGGLE PROTECTION 
      Mac: Cmd + Shift + O 
      Win: Ctrl + Shift + O 
    */
    if (ctrlOrCmd && e.shiftKey && key === "o") {
      e.preventDefault(); // Stop "Open File" dialog

      isGuardActive = !isGuardActive;

      if (!isGuardActive) {
        // Visual feedback for the tester
        alert("🛡️ DEV MODE: Shortcuts & Right Click UNLOCKED.\n\nYou can now use Cmd+Option+I (Mac) or F12.");
        debugger;
      } else {
        alert("🔒 App is now LOCKED.");
      }
      return;
    }

    if (!isGuardActive) return;


    /* BLOCK STANDARD DEVTOOLS SHORTCUTS (Only if Locked) */

    // F12
    if (key === "f12") {
      e.preventDefault();
      return;
    }

    // Ctrl/Cmd + Shift + I/J/C (Inspect, Console, Element)
    if (ctrlOrCmd && e.shiftKey && ["i", "j", "c"].includes(key)) {
      e.preventDefault();
      return;
    }

    // Ctrl/Cmd + U (View Source) or S (Save)
    if (ctrlOrCmd && ["u", "s"].includes(key)) {
      e.preventDefault();
      return;
    }

    // Mac Specific: Cmd + Option + I/J/C (The standard Mac DevTools keys)
    if (isMac && e.metaKey && e.altKey && ["i", "j", "c"].includes(key)) {
      e.preventDefault();
      return;
    }
  };

  // Add Listeners
  document.addEventListener("contextmenu", onContextMenu, true);
  document.addEventListener("keydown", onKeyDown, true);

  /* =========================
     CLEANUP
     ========================= */
  return () => {
    document.removeEventListener("contextmenu", onContextMenu, true);
    document.removeEventListener("keydown", onKeyDown, true);
  };
}

/* =========================================
   FUNCTION 2: FULL SCREEN ENFORCER
   ========================================= */
export function enforceFullScreen() {
  const blockerId = "fullscreen-enforcer-overlay";

  // 1. Create the Blocking Overlay (The "Curtain")
  const createBlocker = () => {
    if (document.getElementById(blockerId)) return; // Already exists

    const overlay = document.createElement("div");
    overlay.id = blockerId;

    // High Z-Index to sit on top of everything
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: #000; color: #fff; z-index: 2147483647;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center; font-family: system-ui, sans-serif;
    `;

    overlay.innerHTML = `
      <h1 style="margin-bottom: 20px;">⚠️ Full Screen Required</h1>
      <p style="margin-bottom: 30px; font-size: 1.1rem; max-width: 500px;">
        To continue this test, you must enable Full Screen mode. 
        Reducing the window size or splitting the screen is not allowed.
      </p>
      <button id="btn-enable-fs" style="
        padding: 12px 24px; font-size: 1rem; font-weight: bold; cursor: pointer;
        background-color: #2563eb; color: white; border: none; border-radius: 6px;
      ">
        ENABLE FULL SCREEN
      </button>
    `;

    document.body.appendChild(overlay);

    // Add click listener to the button inside
    document.getElementById("btn-enable-fs")?.addEventListener("click", () => {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    });
  };

  // 2. Logic to Show/Hide Blocker
  const checkScreenStatus = () => {
    const isFullScreen = !!document.fullscreenElement;
    const overlay = document.getElementById(blockerId);

    if (!isFullScreen) {
      // If overlay doesn't exist, create it. If it does, make sure it's visible.
      if (!overlay) {
        createBlocker();
      } else {
        overlay.style.display = "flex";
      }
    } else {
      // If we are in full screen, hide the overlay
      if (overlay) {
        overlay.style.display = "none";
      }
    }
  };

  // 3. Listeners
  document.addEventListener("fullscreenchange", checkScreenStatus);

  // Run check immediately on load
  checkScreenStatus();

  // Cleanup function
  return () => {
    document.removeEventListener("fullscreenchange", checkScreenStatus);
    const overlay = document.getElementById(blockerId);
    if (overlay) overlay.remove();
  };
}