"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { RotateCw, ZoomIn, ZoomOut, Download, Upload } from "lucide-react";
import { toast } from "sonner";

interface TwibbonEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  twibbonUrl: string;
  twibbonName: string;
}

export default function TwibbonEditor({
  open,
  onOpenChange,
  twibbonUrl,
  twibbonName,
}: TwibbonEditorProps) {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!userPhoto) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !userPhoto) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const userImg = new Image();
    userImg.crossOrigin = "anonymous";
    userImg.src = userPhoto;

    userImg.onload = () => {
      // Set canvas size
      canvas.width = 1080;
      canvas.height = 1080;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save context state
      ctx.save();

      // Move to center of canvas
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Apply rotation
      ctx.rotate((rotation * Math.PI) / 180);

      // Apply zoom and position
      const scaledWidth = userImg.width * zoom;
      const scaledHeight = userImg.height * zoom;

      ctx.drawImage(
        userImg,
        -scaledWidth / 2 + position.x,
        -scaledHeight / 2 + position.y,
        scaledWidth,
        scaledHeight
      );

      // Restore context
      ctx.restore();

      // Draw twibbon frame on top
      const twibbonImg = new Image();
      twibbonImg.crossOrigin = "anonymous";
      twibbonImg.src = twibbonUrl;

      twibbonImg.onload = () => {
        ctx.drawImage(twibbonImg, 0, 0, canvas.width, canvas.height);
      };
    };
  };

  useEffect(() => {
    if (userPhoto) {
      drawCanvas();
    }
  }, [userPhoto, rotation, zoom, position, twibbonUrl]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !userPhoto) {
      toast.error("Please upload a photo first");
      return;
    }

    // Trigger final draw
    drawCanvas();

    // Wait a bit for the image to render
    setTimeout(() => {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `${twibbonName}-twibbon.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          toast.success("Photo downloaded successfully!");
        }
      }, "image/png");
    }, 100);
  };

  const handleReset = () => {
    setUserPhoto(null);
    setRotation(0);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Your Twibbon</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left - Canvas Preview */}
            <div className="lg:col-span-2">
              <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
                {!userPhoto ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <Upload className="h-16 w-16 text-gray-400" />
                    <p className="text-gray-500">Upload your photo to start</p>
                    <Button onClick={() => fileInputRef.current?.click()}>
                      Choose Photo
                    </Button>
                  </div>
                ) : (
                  <div
                    className="relative w-full h-full cursor-move"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full object-contain"
                      style={{ touchAction: "none" }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right - Controls */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              {userPhoto && (
                <>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Controls</h3>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRotate}
                        className="gap-2 w-full justify-start"
                      >
                        <RotateCw className="h-4 w-4" />
                        Rotate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleZoomIn}
                        className="gap-2 w-full justify-start"
                      >
                        <ZoomIn className="h-4 w-4" />
                        Zoom In
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleZoomOut}
                        className="gap-2 w-full justify-start"
                      >
                        <ZoomOut className="h-4 w-4" />
                        Zoom Out
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2 w-full justify-start"
                      >
                        <Upload className="h-4 w-4" />
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Zoom: {zoom.toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-2 mt-auto">
                    <Button onClick={handleDownload} className="gap-2 w-full">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="w-full"
                    >
                      Reset
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
