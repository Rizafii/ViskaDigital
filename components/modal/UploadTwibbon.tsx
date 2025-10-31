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
import { AlertCircle, Upload, CheckCircle, X } from "lucide-react";
import Image from "next/image";

interface UploadTwibbonProps {
  onClose: () => void;
}

export default function UploadTwibbon({ onClose }: UploadTwibbonProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const DOMAIN_PREFIX = "twibbon.app/"; // define the fixed domain prefix

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError("");

    if (!selectedFile) return;

    // Validate PNG format
    if (!selectedFile.type.includes("image/png")) {
      setError("Format file harus PNG. Silakan upload file PNG.");
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB.");
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleResetFile = () => {
    setFile(null);
    setPreview("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Silakan upload file twibbon PNG.");
      return;
    }

    if (!name.trim()) {
      setError("Nama twibbon tidak boleh kosong.");
      return;
    }

    if (!customUrl.trim()) {
      setError("Custom URL tidak boleh kosong.");
      return;
    }

    setLoading(true);
    try {
      // Add your API call here to upload the twibbon
      console.log("Uploading:", {
        file,
        name,
        description,
        customUrl: `${DOMAIN_PREFIX}${customUrl}`,
      });
      // await uploadTwibbon(file, name, description, customUrl);
      onClose();
    } catch (err) {
      setError("Gagal mengunggah twibbon. Silakan coba lagi.");
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
      <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md shadow-lg bg-white overflow-y-auto max-h-[90vh]">
        <CardHeader>
          <CardTitle className="text-2xl">Upload Twibbon</CardTitle>
          <CardDescription>
            Upload desain twibbon PNG dan mulai kampanye Anda
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {!file ? (
              <div className="space-y-2">
                <Label htmlFor="file-upload" className="text-base font-medium">
                  File Twibbon (PNG)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Klik untuk upload atau drag file PNG di sini
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Maksimal ukuran file: 5MB
                    </p>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-base font-medium">File Twibbon</Label>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col items-center gap-3">
                  <div
                    className="relative w-32 h-32 flex-shrink-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)",
                      backgroundSize: "20px 20px",
                      backgroundPosition: "0 0, 10px 10px",
                    }}
                  >
                    <Image
                      src={preview || "/placeholder.svg"}
                      alt="Preview twibbon"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2 w-full">
                    <p className="text-xs text-gray-500 text-center truncate max-w-full">
                      {file.name}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleResetFile}
                      className="gap-2 text-gray-600 hover:text-gray-900"
                    >
                      <X className="h-4 w-4" />
                      Pilih Ulang
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Nama Twibbon
              </Label>
              <Input
                id="name"
                placeholder="Contoh: Twibbon Hari Kemerdekaan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customUrl" className="text-base font-medium">
                Custom URL
              </Label>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
                <span className="px-3 py-2 bg-gray-100 text-gray-600 text-sm font-medium whitespace-nowrap">
                  {DOMAIN_PREFIX}
                </span>
                <Input
                  id="customUrl"
                  placeholder="custom-url"
                  value={customUrl}
                  onChange={(e) =>
                    setCustomUrl(
                      e.target.value.toLowerCase().replace(/\s+/g, "-")
                    )
                  }
                  className="border-0 flex-1"
                />
              </div>
              {customUrl && (
                <p className="text-xs text-gray-500">
                  URL Lengkap:{" "}
                  <span className="font-medium">
                    {DOMAIN_PREFIX}
                    {customUrl}
                  </span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                Deskripsi
              </Label>
              <Textarea
                id="description"
                placeholder="Jelaskan tentang twibbon Anda..."
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
              disabled={loading || !file || !name.trim() || !customUrl.trim()}
              className="gap-2 text-white"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Mengunggah...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Upload Twibbon
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
