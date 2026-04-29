"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Upload() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

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
    if (!file) return;

    const fileName = `${Date.now()}.jpg`;

    // העלאה ל-Storage
    const { data, error } = await supabase.storage
      .from("wedding-images")
      .upload(fileName, file);

    if (error) {
      setMessage("שגיאה בהעלאה ❌");
      return;
    }

    // קבלת URL ציבורי
    const { data: publicUrlData } = supabase.storage
      .from("wedding-images")
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // שמירה בטבלה
    await supabase.from("images").insert([
      {
        image_url: imageUrl,
      },
    ]);

    setPreview(null);
    setFile(null);
    setMessage("התמונה עלתה לגלריה 🎉");
  };

  const handleRetake = () => {
    setPreview(null);
    setFile(null);
    setMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-stone-100 p-6 text-center relative">
      <a
        href="/"
        className="absolute top-5 right-5 rounded-full bg-white px-4 py-2 text-sm font-bold shadow"
      >
        חזרה
      </a>

      <h1 className="text-3xl font-bold">תמונה לאלבום 📸</h1>

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
            alt="preview"
            className="max-h-80 w-full max-w-sm rounded-2xl object-cover shadow"
          />

          <div className="flex w-full max-w-sm gap-3">
            <button
              onClick={handleRetake}
              className="w-1/2 rounded-2xl bg-gray-300 px-4 py-4 font-bold"
            >
              צלם מחדש
            </button>

            <button
              onClick={handleUpload}
              className="w-1/2 rounded-2xl bg-black px-4 py-4 text-white font-bold"
            >
              העלה לגלריה
            </button>
          </div>
        </>
      )}

      {message && <p className="font-bold">{message}</p>}

      <a href="/gallery" className="underline">
        מעבר לגלריה
      </a>
    </div>
  );
}