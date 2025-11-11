"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface LoginProps {
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

export default function Login({ onClose, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        onClose();
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed w-full h-screen z-50">
      <div
        className="overlay absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md shadow-lg bg-white ">
        <CardHeader>
          <CardTitle className="text-2xl ">Login</CardTitle>
          <CardDescription>Masuk untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleLogin}
            className="flex flex-col items-start gap-3"
          >
            {error && (
              <div className="w-full p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <Label>Email</Label>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-primary/5 border-black/20"
              disabled={loading}
            />
            <Label className="mt-2">Password</Label>
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-primary/5 border-black/20"
              disabled={loading}
            />
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-primary"
            >
              Lupa password?
            </Link>
            <Button
              type="submit"
              className="w-full mt-4 text-white font-semibold h-11"
              disabled={loading}
            >
              {loading ? "Sedang Masuk..." : "Masuk"}
            </Button>
            <Separator className="w-full my-2" />
            {/* <div className="another w-full flex flex-col gap-6">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 font-semibold flex items-center gap-2 rounded-full text-sm border-black/30 bg-transparent"
                disabled={loading}
              >
                <Image
                  src="/logo/google.svg"
                  alt="Google Logo"
                  width={18}
                  height={18}
                />
                Masuk dengan Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 font-semibold flex items-center gap-2 rounded-full text-sm border-black/30 bg-transparent"
                disabled={loading}
              >
                <Image
                  src="/logo/facebook.svg"
                  alt="Facebook Logo"
                  width={18}
                  height={18}
                />
                Masuk dengan Facebook
              </Button>
            </div> */}
          </form>
          <CardFooter className="mt-4 items-center flex w-full justify-center p-0">
            <span className="text-sm text-foreground/70 flex items-center gap-1">
              Belum punya akun?
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-primary font-semibold hover:underline"
              >
                Daftar
              </button>
            </span>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
