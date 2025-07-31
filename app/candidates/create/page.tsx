"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addCandidate } from "@/lib/candidates";
import { getJobs } from "@/lib/jobs";
import { CandidateStage, Job } from "@/types";

const stages: CandidateStage[] = [
  "Applied",
  "Screened",
  "Interviewed",
  "Offered",
  "Hired",
];

export default function CreateCandidatePage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    appliedJobId: "",
    resumeUrl: "",
    stage: "Applied",
    source: "",
    skillInput: "",
    skills: [] as string[],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    if (!form.appliedJobId)
      newErrors.appliedJobId = "Job selection is required.";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    const trimmed = form.skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
        skillInput: "",
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }
    await addCandidate({
      name: form.name,
      email: form.email,
      appliedJobId: form.appliedJobId,
      resumeUrl: form.resumeUrl,
      stage: form.stage as CandidateStage,
      source: form.source,
      skills: form.skills,
      createdAt: new Date(),
    });
    router.push("/candidates");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Candidate</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        <div>
          <label className="block font-semibold">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block font-semibold">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Applied Job</label>
          <select
            name="appliedJobId"
            value={form.appliedJobId}
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
          {errors.appliedJobId && (
            <p className="text-red-600 text-sm">{errors.appliedJobId}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Resume URL</label>
          <input
            name="resumeUrl"
            value={form.resumeUrl}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Stage</label>
          <select
            name="stage"
            value={form.stage}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold">Source</label>
          <input
            name="source"
            value={form.source}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              value={form.skillInput}
              onChange={(e) => setForm({ ...form, skillInput: e.target.value })}
              className="flex-1 border p-2 rounded"
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addSkill())
              }
              placeholder="Enter a skill and press Enter"
            />
            <button
              type="button"
              onClick={addSkill}
              className="bg-blue-500 text-white px-4 rounded"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm cursor-pointer"
                onClick={() => removeSkill(skill)}
              >
                {skill} ×
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Save Candidate
        </button>
      </form>
    </div>
  );
}
