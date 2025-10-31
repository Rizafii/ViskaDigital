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
import { AlertCircle, Link2 } from "lucide-react";

interface CreateLinkProps {
  onClose: () => void;
}

export default function CreateLink({ onClose }: CreateLinkProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [originalLink, setOriginalLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      // Add your API call here to create the link
      console.log("Creating link:", { name, description, originalLink });
      // await createLink(name, description, originalLink);
      onClose();
    } catch (err) {
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
          </CardContent>

          <CardFooter className="gap-2 justify-end mt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Batal
            </Button>
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
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
