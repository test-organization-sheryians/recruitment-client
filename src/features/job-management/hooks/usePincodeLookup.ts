import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type PincodeStatus = {
  loading: boolean;
  message: string;
  type: "info" | "error" | "";
};

type Location = {
  city: string;
  state: string;
  country: string;
  pincode: string;
};

/* ================= HOOK ================= */

export function usePincodeLookup(
  pincode: string,
  onSuccess: (location: Partial<Location>) => void
) {
  const [status, setStatus] = useState<PincodeStatus>({
    loading: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    const pin = pincode?.trim();

    // Reset when empty
    if (!pin) {
      setStatus({ loading: false, message: "", type: "" });
      return;
    }

    // Validate Indian pincode
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setStatus({
        loading: false,
        message: "Please enter a valid 6-digit pincode",
        type: "error",
      });
      return;
    }

    let cancelled = false;

    setStatus({
      loading: true,
      message: "Looking up location from pincode...",
      type: "info",
    });

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${pin}`
        );
        const data = await res.json();

        if (cancelled) return;

        const po = data?.[0]?.PostOffice?.[0];
        if (!po) {
          setStatus({
            loading: false,
            message: "No location found for this pincode",
            type: "error",
          });
          return;
        }

        // ✅ SUCCESS CALLBACK
        onSuccess({
          city: po.District,
          state: po.State,
          country: po.Country || "India",
          pincode: pin,
        });

        setStatus({
          loading: false,
          message: `Detected ${po.District}, ${po.State}`,
          type: "info",
        });
      } catch {
        if (cancelled) return;
        setStatus({
          loading: false,
          message: "Failed to fetch location. Please fill manually.",
          type: "error",
        });
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [pincode]); 

  return status;
}
