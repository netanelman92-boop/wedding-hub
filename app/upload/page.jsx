"use client";

import { useState } from "react";

export default function Upload() {
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setMessage("");
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!preview) return;

    const saved =
      JSON.parse(localStorage.getItem("weddingImages")) || [];
    saved.push(preview);
    localStorage.setItem("weddingImages", JSON.stringify(saved));

    setPreview(null);
    setMessage("התמונה נוספה לאלבום 🎉");
  };

  const handleRetake = () => {
    setPreview(null);
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

      {/* כשאין תמונה – כפתור מצלמה בלבד */}
      {!preview && (
        <>
          <p className="text-stone-600">
            לחצו לצילום תמונה והוסיפו אותה לגלריית החתונה
          </p>

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
        </>
      )}

      {/* כשיש תמונה – Preview + 2 כפתורים */}
      {preview && (
        <>
          <img
            src={preview}
            alt="תצוגה מקדימה"
            className="max-h-80 w-full max-w-sm rounded-2xl object-cover shadow-lg"
          />

          <div className="flex w-full max-w-sm gap-3">
            {/* שמאל */}
            <button
              onClick={handleRetake}
              className="w-1/2 rounded-2xl bg-gray-300 px-4 py-4 font-bold"
            >
              צלם מחדש
            </button>

            {/* ימין */}
            <button
              onClick={handleUpload}
              className="w-1/2 rounded-2xl bg-black px-4 py-4 text-white font-bold"
            >
              העלה לגלריה
            </button>
          </div>
        </>
      )}

      {message && <p className="font-bold text-green-700">{message}</p>}

      <a href="/gallery" className="underline">
        מעבר לגלריה
      </a>
    </div>
  );
}