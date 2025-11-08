"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getUserData } = useAuth();

  const [status, setStatus] = useState("Verifying...");
  const [loading, setLoading] = useState(true);
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const token = searchParams.get("token");
    if (!token) {
      setStatus("Invalid verification link.");
      setLoading(false);
      setTimeout(() => router.push("/"), 3000);
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await axios.post("/api/auth/verify-email", { token });

        if (res.data?.message?.includes("success")) {
          setStatus("Your email has been successfully verified!");
          getUserData();
        } else {
          setStatus(res.data?.message || "Failed to verify email.");
        }
      } catch (err) {
        console.error("Email verification error:", err);
        setStatus(err.response?.data?.error || "Server error verifying email.");
      } finally {
        setLoading(false);
        setTimeout(() => router.push("/"), 3000);
      }
    };

    verifyToken();
  }, [searchParams, router, getUserData]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="bg-white shadow-md rounded-md p-6 max-w-md text-center">
        {loading ? (
          <p className="text-gray-500">{status}</p>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">
              {status.includes("successfully") ? "Success!" : "Oops!"}
            </h1>
            <p className="text-gray-600">{status}</p>
            {status.includes("successfully") && (
              <p className="mt-4 text-sm text-gray-500">
                Redirecting to Home page...
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
