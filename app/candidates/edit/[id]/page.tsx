"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCandidateById, updateCandidate } from "@/lib/candidates";
import { getJobs } from "@/lib/jobs";
import { Candidate, Job } from "@/types";
import Link from "next/link";

export default function EditCandidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { id } = await params;
      const [c, j] = await Promise.all([getCandidateById(id), getJobs()]);
      if (c) setCandidate(c as Candidate);
      setJobs(j);
      setLoading(false);
    };
    loadData();
  }, [params]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!candidate) return;
    setCandidate({ ...candidate, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (candidate) {
      await updateCandidate(candidate.id!, candidate);
      router.push("/candidates");
    }
  };

  if (loading || !candidate) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Candidate</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        <div>
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={candidate.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={candidate.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Stage</label>
          <select
            name="stage"
            value={candidate.stage}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option>Applied</option>
            <option>Screened</option>
            <option>Interviewed</option>
            <option>Offered</option>
            <option>Hired</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">Applied Job</label>
          <select
            name="appliedJobId"
            value={candidate.appliedJobId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold">Resume URL</label>
          <input
            type="url"
            name="resumeUrl"
            value={candidate.resumeUrl ?? ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
          <Link href="/candidates">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
