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
      <div className="h-screen flex flex-col items-center justify-center text-center gap-5 p-6 bg-stone-100">
        <h1 className="text-3xl font-bold">{getMessage()}</h1>

        <p className="text-lg">
          עניתם נכון על {score} מתוך {selectedQuestions.length}
        </p>

        <a
          href="/upload"
          className="mt-4 rounded-2xl bg-black px-6 py-4 text-white font-bold"
        >
          המשך להעלאת תמונה 📸
        </a>
      </div>
    );
  }

  const q = selectedQuestions[current];

  return (
  <div className="h-screen flex flex-col items-center justify-center p-6 text-center gap-6 bg-stone-100 relative">
    <a
      href="/"
      className="absolute top-5 right-5 rounded-full bg-white px-4 py-2 text-sm font-bold shadow"
    >
      חזרה
    </a>

    <p className="text-sm text-stone-500">
      שאלה {current + 1} מתוך {selectedQuestions.length}
    </p>

      <h1 className="text-2xl font-bold">{q.question}</h1>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {q.answers.map((answer, index) => {
          let buttonColor = "bg-white text-black";

          if (selectedAnswer !== null) {
            if (index === q.correct) {
              buttonColor = "bg-green-500 text-white";
            } else if (index === selectedAnswer) {
              buttonColor = "bg-red-500 text-white";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              className={`${buttonColor} p-4 rounded-xl font-bold shadow transition`}
            >
              {answer}
            </button>
          );
        })}
      </div>
    </div>
  );
}