"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  consentAllDenied,
  consentAllGranted,
  getStoredConsent,
  updateConsent,
  type ConsentState,
} from "@/lib/analytics";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      // Apply stored consent on mount
      updateConsent(stored);
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: "accept" | "reject") => {
    const state: ConsentState =
      choice === "accept" ? consentAllGranted() : consentAllDenied();
    updateConsent(state);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4">
      <div className="w-full max-w-3xl rounded-lg border bg-background p-4 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-foreground/80">
            We use cookies to enhance your experience, analyze traffic, and for
            marketing. You can accept or reject non-essential cookies.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => handleChoice("reject")}>
              Reject all
            </Button>
            <Button onClick={() => handleChoice("accept")}>Accept all</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
