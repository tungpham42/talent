"use client";
import { useState } from "react";

export default function InterviewScheduler({
  onSchedule,
}: {
  onSchedule: (datetime: string) => void;
}) {
  const [datetime, setDatetime] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSchedule(datetime);
      }}
    >
      <label className="block text-sm font-medium">Interview Date & Time</label>
      <input
        type="datetime-local"
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Schedule Interview
      </button>
    </form>
  );
}
