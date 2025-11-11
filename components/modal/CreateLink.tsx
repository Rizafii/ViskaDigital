"use client";

import type React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Link2, CheckCircle } from "lucide-react";
import { createLink } from "@/lib/supabase/link";

interface CreateLinkProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateLink({ onClose, onSuccess }: CreateLinkProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [originalLink, setOriginalLink] = useState("");
  const [customShortLink, setCustomShortLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shortLink, setShortLink] = useState("");

  const DOMAIN_PREFIX = "viska.app/"; // define the fixed domain prefix

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim()) {
      setError("Nama link tidak boleh kosong.");
      return;
    }

    if (!originalLink.trim()) {
      setError("URL original link tidak boleh kosong.");
      return;
    }

    if (!isValidUrl(originalLink)) {
      setError(
        "Format URL tidak valid. Pastikan URL dimulai dengan http:// atau https://"
      );
      return;
    }

    setLoading(true);
    try {
      const result = await createLink({
        name: name.trim(),
        description: description.trim(),
        originalLink: originalLink.trim(),
        customShortLink: customShortLink.trim() || undefined,
      });

      if (result.success && result.data) {
        setSuccess(true);
        setShortLink(result.data.short_link);

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }

        // Close modal after short delay
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.error || "Gagal membuat link. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Create link error:", err);
      setError("Gagal membuat link. Silakan coba lagi.");
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
      <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-2xl">Buat Link</CardTitle>
          <CardDescription>Buat link baru untuk kampanye Anda</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Nama Link
              </Label>
              <Input
                id="name"
                placeholder="Contoh: Link Kampanye A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="original-link" className="text-base font-medium">
                URL Original Link
              </Label>
              <Input
                id="original-link"
                type="url"
                placeholder="https://example.com"
                value={originalLink}
                onChange={(e) => setOriginalLink(e.target.value)}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="custom-short-link"
                className="text-base font-medium"
              >
                Custom Short Link{" "}
                <span className="text-gray-400 font-normal">(Opsional)</span>
              </Label>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
                <span className="px-3 py-2 bg-gray-100 text-gray-600 text-sm font-medium whitespace-nowrap">
                  {DOMAIN_PREFIX}
                </span>
                <Input
                  id="custom-short-link"
                  placeholder="custom-link"
                  value={customShortLink}
                  onChange={(e) =>
                    setCustomShortLink(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "")
                        .replace(/\s+/g, "-")
                    )
                  }
                  className="border-0 flex-1"
                />
              </div>
              {customShortLink && (
                <p className="text-xs text-gray-500">
                  Short Link:{" "}
                  <span className="font-medium">
                    {DOMAIN_PREFIX}
                    {customShortLink}
                  </span>
                </p>
              )}
              {!customShortLink && (
                <p className="text-xs text-gray-500">
                  Kosongkan untuk generate otomatis (6 karakter random)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                Deskripsi{" "}
                <span className="text-gray-400 font-normal">(Opsional)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Jelaskan tentang link ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="border-gray-300 resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && shortLink && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span>Link berhasil dibuat!</span>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Label className="text-xs text-blue-700 font-medium">
                    Short Link Anda:
                  </Label>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="text-sm font-mono text-blue-900 flex-1 break-all">
                      {DOMAIN_PREFIX}
                      {shortLink}
                    </code>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${DOMAIN_PREFIX}${shortLink}`
                        );
                      }}
                      className="text-xs flex-shrink-0"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              disabled={loading}
            >
              {success ? "Tutup" : "Batal"}
            </Button>
            {!success && (
              <Button
                onClick={handleSubmit}
                disabled={loading || !name.trim() || !originalLink.trim()}
                className="gap-2 text-white"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Membuat...
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" />
                    Buat Link
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
