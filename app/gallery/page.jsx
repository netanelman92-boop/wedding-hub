"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchImages = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("images")
      .select("image_url, created_at")
      .order("created_at", { ascending: false });

    if (!error) {
      setImages(data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-stone-100 p-6">
      <div className="flex items-center justify-between">
        <a href="/" className="bg-white px-4 py-2 rounded-full shadow font-bold">
          חזרה
        </a>

        <button
          onClick={fetchImages}
          disabled={isLoading}
          className="bg-black text-white px-4 py-2 rounded-full shadow font-bold disabled:opacity-50"
        >
          {isLoading ? "מרענן..." : "רענן גלריה"}
        </button>
      </div>

      <h1 className="text-3xl font-bold text-center mt-6">
        גלריית חתונה 🖼️
      </h1>

      {images.length === 0 ? (
        <p className="text-center mt-10 text-stone-600">
          עדיין לא הועלו תמונות
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {images.map((img, index) => (
            <img
              key={index}
              src={img.image_url}
              alt={`תמונה ${index + 1}`}
              onClick={() => setSelectedImage(img.image_url)}
              className="h-48 w-full object-cover rounded-2xl shadow cursor-pointer"
            />
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
        >
          <img
            src={selectedImage}
            alt="תמונה מוגדלת"
            className="max-h-[90%] max-w-[90%] rounded-2xl"
          />
        </div>
      )}
    </div>
  );
}