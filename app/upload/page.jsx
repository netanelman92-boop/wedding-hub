"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

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
    setMessage("מעלה תמונה... רגע קטן 📸");

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("wedding-images")
      .upload(fileName, file);

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
    setIsUploading(false);
    setMessage("התמונה נוספה לגלריית החתונה 🎉");
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
          <label className="w-full max-w-sm rounded-2xl bg-black px-6 py-5 text-white font-bold shadow cursor-pointer">
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
                className="w-1/2 rounded-2xl bg-gray-300 px-4 py-4 font-bold disabled:opacity-50"
              >
                צלם מחדש
              </button>

              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-1/2 rounded-2xl bg-black px-4 py-4 text-white font-bold disabled:opacity-50"
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