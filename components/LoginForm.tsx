"use client";

import { signIn } from "next-auth/react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { calSans } from "@/app/fonts";
import { useState } from "react";

export default function LoginForm() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      // Affiche un message personnalisé si l'erreur est CredentialsSignin
      if (res.error === "CredentialsSignin") {
        setError("Email ou mot de passe incorrect.");
      } else {
        setError(res.error);
      }
    } else {
      window.location.href = "/dashboard";
    }

    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${calSans.className} mb-3 text-2xl dark:text-black`}>
          Please log in to continue.
        </h1>

        <LoginButton />

        <Button
          className="mt-4 w-full"
          variant={"secondary"}
          onClick={() => setShowEmailForm(true)}
        >
          Log in with Email
        </Button>

        {showEmailForm && (
          <form
            onSubmit={handleEmailLogin}
            className="flex flex-col items-center mt-4 w-full"
          >
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-2 py-1 rounded mb-2 w-full"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border px-2 py-1 rounded mb-2 w-full"
            />
            <Button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Submit"}
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="mt-4 w-full"
      variant={"secondary"}
      aria-disabled={pending}
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    >
      Log in with Google
    </Button>
  );
}
