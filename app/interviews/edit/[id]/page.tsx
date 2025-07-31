"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getInterviewById, updateInterview } from "@/lib/interviews";
import { getCandidateById } from "@/lib/candidates";
import { getJobById } from "@/lib/jobs";
import { Candidate, Interview, Job } from "@/types";

export default function EditInterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: "",
    notes: "",
  });
  const [candidateName, setCandidateName] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { id } = await params;
      const interview = (await getInterviewById(id)) as Interview;
      if (!interview) return;

      setForm({
        date: new Date(interview.date).toISOString().slice(0, 16), // "yyyy-MM-ddTHH:mm"
        notes: interview.notes || "",
      });

      const candidate = (await getCandidateById(
        interview.candidateId
      )) as Candidate;

      const job = (await getJobById(interview.jobId)) as Job;

      setCandidateName(candidate?.name || "Unknown");
      setJobTitle(job?.title || "Unknown");
      setLoading(false);
    };

    fetchData();
  }, [params]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id } = await params;
    await updateInterview(id, {
      date: new Date(form.date),
      notes: form.notes,
    });
    router.push(`/interviews/${id}`);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Edit Interview</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Candidate</label>
          <p>{candidateName}</p>
        </div>

        <div>
          <label className="block font-semibold">Job</label>
          <p>{jobTitle}</p>
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="date">
            Interview Date & Time
          </label>
          <input
            id="date"
            name="date"
            type="datetime-local"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={4}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
