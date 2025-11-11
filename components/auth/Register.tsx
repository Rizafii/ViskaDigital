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
import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface RegisterProps {
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export default function Register({ onClose, onSwitchToLogin }: RegisterProps) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            window.location.origin,
          data: {
            display_name: displayName,
            full_name: displayName,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setDisplayName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
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
          <CardTitle className="text-2xl ">Daftar</CardTitle>
          <CardDescription>Buat akun baru Anda</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="flex flex-col gap-4 text-center">
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                Akun berhasil dibuat! Silakan periksa email Anda untuk
                verifikasi.
              </div>
              <Button onClick={onClose} className="w-full text-white">
                Tutup
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleRegister}
              className="flex flex-col items-start gap-3"
            >
              {error && (
                <div className="w-full p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <Label>Nama Lengkap</Label>
              <Input
                placeholder="Nama Lengkap"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-primary/5 border-black/20"
                disabled={loading}
                required
              />
              <Label className="mt-2">Email</Label>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-primary/5 border-black/20"
                disabled={loading}
                required
              />
              <Label className="mt-2">Password</Label>
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-primary/5 border-black/20"
                disabled={loading}
                required
              />
              <Label className="mt-2">Konfirmasi Password</Label>
              <Input
                placeholder="Konfirmasi Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-primary/5 border-black/20"
                disabled={loading}
                required
              />
              <Button
                type="submit"
                className="w-full mt-4 text-white font-semibold h-11"
                disabled={loading}
              >
                {loading ? "Sedang Mendaftar..." : "Daftar"}
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
                  Daftar dengan Google
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
                  Daftar dengan Facebook
                </Button>
              </div> */}
              <CardFooter className="mt-4 items-center flex w-full justify-center p-0">
                <span className="text-sm text-foreground/70 flex items-center gap-1">
                  Sudah punya akun?
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-primary font-semibold hover:underline"
                  >
                    Masuk
                  </button>
                </span>
              </CardFooter>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
