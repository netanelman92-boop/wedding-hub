"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("images")
        .select("image_url, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
        return;
      }

      setImages(data);
    };

    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-stone-100 p-6">
      <a
        href="/"
        className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow"
      >
        חזרה
      </a>

      <h1 className="mt-6 text-center text-3xl font-bold">
        גלריית חתונה 🖼️
      </h1>

      {images.length === 0 ? (
        <p className="mt-10 text-center text-stone-600">
          עדיין לא הועלו תמונות
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <img
              key={index}
              src={image.image_url}
              alt={`תמונה ${index + 1}`}
              className="h-48 w-full rounded-2xl object-cover shadow"
            />
          ))}
        </div>
      )}
    </div>
  );
}