"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addInterview } from "@/lib/interviews";
import { getJobs } from "@/lib/jobs";
import { getCandidates } from "@/lib/candidates";
import { Candidate, Job } from "@/types";

export default function CreateInterviewPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [form, setForm] = useState({
    jobId: "",
    candidateId: "",
    scheduledAt: "",
    date: "", // Added date field
    type: "",
    score: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      const jobList = await getJobs();
      const candidateList = await getCandidates();
      setJobs(jobList);
      setCandidates(candidateList);
    };
    fetchData();
  }, []);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.jobId) errs.jobId = "Job is required.";
    if (!form.candidateId) errs.candidateId = "Candidate is required.";
    if (!form.scheduledAt) {
      errs.scheduledAt = "Scheduled time is required.";
    } else if (new Date(form.scheduledAt) < new Date()) {
      errs.scheduledAt = "Scheduled time must be in the future.";
    }
    if (!form.date) {
      errs.date = "Date is required.";
    } else if (new Date(form.date) < new Date()) {
      errs.date = "Date must be in the future.";
    }
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    await addInterview({
      ...form,
      scheduledAt: new Date(form.scheduledAt),
      date: new Date(form.date), // Include date
      createdAt: new Date(),
      score: form.score ? parseFloat(form.score) : undefined, // Convert score to number or undefined
    });

    router.push("/interviews");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Interview</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        <div>
          <label className="block font-semibold">Job</label>
          <select
            name="jobId"
            value={form.jobId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select a job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          {errors.jobId && (
            <p className="text-red-600 text-sm">{errors.jobId}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Candidate</label>
          <select
            name="candidateId"
            value={form.candidateId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select a candidate</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.candidateId && (
            <p className="text-red-600 text-sm">{errors.candidateId}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Scheduled Date & Time</label>
          <input
            type="datetime-local"
            name="scheduledAt"
            value={form.scheduledAt}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.scheduledAt && (
            <p className="text-red-600 text-sm">{errors.scheduledAt}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Interview Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
        </div>

        <div>
          <label className="block font-semibold">
            Type (e.g. phone, on-site)
          </label>
          <input
            type="text"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Score (optional, 0-10)</label>
          <input
            type="number"
            name="score"
            value={form.score}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            min={0}
            max={10}
            step={0.1}
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Save Interview
        </button>
      </form>
    </div>
  );
}
