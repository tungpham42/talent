"use client";
import { useState } from "react";

export default function EvaluationForm({
  onSubmit,
}: {
  onSubmit: (score: number, notes: string) => void;
}) {
  const [score, setScore] = useState(0);
  const [notes, setNotes] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(score, notes);
      }}
    >
      <label className="block text-sm font-medium">Score (1–5):</label>
      <input
        type="number"
        min={1}
        max={5}
        value={score}
        onChange={(e) => setScore(Number(e.target.value))}
        className="border p-2 rounded w-full"
      />

      <label className="block text-sm font-medium mt-4">Notes:</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="border p-2 rounded w-full"
        rows={4}
      />

      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
