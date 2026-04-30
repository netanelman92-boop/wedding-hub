"use client";

import { useMemo, useState } from "react";
import questions from "@/data/triviaQuestions";

function getRandomQuestions(allQuestions, amount) {
  return [...allQuestions].sort(() => Math.random() - 0.5).slice(0, amount);
}

export default function Trivia() {
  const selectedQuestions = useMemo(() => getRandomQuestions(questions, 5), []);

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);

    const isCorrect = index === selectedQuestions[current].correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (current + 1 < selectedQuestions.length) {
        setCurrent((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  const getMessage = () => {
    if (score <= 1) return "וואלה... אנחנו צריכים לשבת יותר 😂";
    if (score <= 3) return "לא רע בכלל! אבל לא יזיק לשבת על איזה קפה 😎";
    if (score === 4) return "יפה מאוד! אתם באמת חברים טובים ❤️";
    return "ימלחיצים מה אתם עוקבים אחרינו?!! 🥂";
  };

  if (finished) {
    return (
      <div
        className="h-screen flex items-center justify-center p-6 text-center relative bg-cover bg-center"
        style={{ backgroundImage: "url('/images/trivia-bg.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 flex flex-col items-center gap-5 text-white">
          <h1 className="text-3xl font-bold drop-shadow-lg">{getMessage()}</h1>

          <p className="text-lg drop-shadow">
            עניתם נכון על {score} מתוך {selectedQuestions.length}
          </p>

          <a
            href="/upload"
            className="mt-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 px-5 py-3 text-white font-bold shadow active:scale-95 transition"
          >
            המשך להעלאת תמונה 📸
          </a>

          <a href="/" className="text-sm underline drop-shadow">
            חזרה למסך הבית
          </a>
        </div>
      </div>
    );
  }

  const q = selectedQuestions[current];

  return (
    <div
      className="h-screen flex items-center justify-center p-5 text-center relative bg-cover bg-center"
      style={{ backgroundImage: "url('/images/trivia-bg.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex w-full flex-col items-center gap-5 text-white">
        <a
          href="/"
          className="absolute top-0 right-0 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 text-sm font-bold text-white shadow active:scale-95 transition"
        >
          חזרה
        </a>

        <p className="text-sm text-white/80 drop-shadow">
          שאלה {current + 1} מתוך {selectedQuestions.length}
        </p>

        <h1 className="text-2xl font-bold drop-shadow-lg">{q.question}</h1>

        <div className="flex w-full max-w-sm flex-col gap-3">
          {q.answers.map((answer, index) => {
            let buttonColor =
              "bg-white/20 backdrop-blur-md border border-white/30 text-white";

            if (selectedAnswer !== null) {
              if (index === q.correct) {
                buttonColor = "bg-green-500 text-white border border-green-300";
              } else if (index === selectedAnswer) {
                buttonColor = "bg-red-500 text-white border border-red-300";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`${buttonColor} p-3 rounded-2xl font-bold shadow active:scale-95 transition`}
              >
                {answer}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}