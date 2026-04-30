"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target.result;
    };

    reader.onerror = reject;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 1200;

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Image compression failed"));
            return;
          }

          const compressedFile = new File([blob], `${Date.now()}.jpg`, {
            type: "image/jpeg",
          });

          resolve(compressedFile);
        },
        "image/jpeg",
        0.7
      );
    };

    img.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Upload() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setMessage("");
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;

    setIsUploading(true);
    setMessage("מכווץ ומעלה תמונה... רגע קטן 📸");

    try {
      const compressedFile = await compressImage(file);
      const fileName = `${Date.now()}.jpg`;

      const { error } = await supabase.storage
        .from("wedding-images")
        .upload(fileName, compressedFile);

      if (error) {
        setMessage("שגיאה בהעלאה ❌ נסו שוב");
        setIsUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("wedding-images")
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabase.from("images").insert([
        {
          image_url: imageUrl,
        },
      ]);

      if (insertError) {
        setMessage("התמונה עלתה, אבל לא נוספה לגלריה ❌");
        setIsUploading(false);
        return;
      }

      setPreview(null);
      setFile(null);
      setMessage("התמונה נוספה לגלריית החתונה 🎉");
    } catch (error) {
      setMessage("שגיאה בעיבוד התמונה ❌ נסו שוב");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRetake = () => {
    if (isUploading) return;
    setPreview(null);
    setFile(null);
    setMessage("");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center relative bg-cover bg-center"
      style={{ backgroundImage: "url('/images/upload-bg.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-full flex flex-col items-center gap-6">
        <a
          href="/"
          className="absolute top-5 right-5 rounded-full bg-white px-4 py-2 text-sm font-bold shadow"
        >
          חזרה
        </a>

        <h1 className="text-3xl font-bold text-white">תמונה לאלבום 📸</h1>

        {!preview && (
          <label className="w-full max-w-sm rounded-2xl bg-black px-6 py-5 text-white font-bold shadow cursor-pointer active:scale-95 transition">
            צלם תמונה 📸
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}

        {preview && (
          <>
            <img
              src={preview}
              alt="תצוגה מקדימה"
              className="max-h-80 w-full max-w-sm rounded-2xl object-cover shadow"
            />

            <div className="flex w-full max-w-sm gap-3">
              <button
                onClick={handleRetake}
                disabled={isUploading}
                className="w-1/2 rounded-2xl bg-gray-300 px-4 py-4 font-bold disabled:opacity-50 active:scale-95 transition"
              >
                צלם מחדש
              </button>

              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-1/2 rounded-2xl bg-black px-4 py-4 text-white font-bold disabled:opacity-50 active:scale-95 transition"
              >
                {isUploading ? "מעלה..." : "העלה לגלריה"}
              </button>
            </div>
          </>
        )}

        {message && <p className="font-bold text-white">{message}</p>}

        <a href="/gallery" className="underline text-white font-bold">
          מעבר לגלריה
        </a>
      </div>
    </div>
  );
}