"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getInterviews } from "@/lib/interviews";
import { getCandidates } from "@/lib/candidates";
import { getJobs } from "@/lib/jobs";
import { Candidate, Interview, Job } from "@/types";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 5;

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filtered, setFiltered] = useState<Interview[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const [jobsData, candidatesData, interviewsData] = await Promise.all([
        getJobs(),
        getCandidates(),
        getInterviews(),
      ]);

      setJobs(jobsData);
      setCandidates(candidatesData);
      setInterviews(interviewsData);
      setFiltered(interviewsData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = interviews;

    if (search) {
      result = result.filter((i) =>
        candidates
          .find((c) => c.id === i.candidateId)
          ?.name.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (selectedJob) {
      result = result.filter((i) => i.jobId === selectedJob);
    }

    if (selectedCandidate) {
      result = result.filter((i) => i.candidateId === selectedCandidate);
    }

    if (selectedDate) {
      result = result.filter(
        (i) => new Date(i.date).toISOString().slice(0, 10) === selectedDate
      );
    }

    setFiltered(result);
    setPage(1);
  }, [
    search,
    selectedJob,
    selectedCandidate,
    selectedDate,
    interviews,
    candidates,
  ]);

  const getCandidateName = (id: string) =>
    candidates.find((c) => c.id === id)?.name || id;

  const getJobTitle = (id: string) =>
    jobs.find((j) => j.id === id)?.title || id;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedInterviews = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Interviews</h1>
        <Link
          href="/interviews/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Interview
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search candidate..."
          className="border rounded px-3 py-2 w-full sm:w-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Jobs</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
        <select
          value={selectedCandidate}
          onChange={(e) => setSelectedCandidate(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Candidates</option>
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {paginatedInterviews.length === 0 ? (
        <p>No interviews found.</p>
      ) : (
        <div className="space-y-4">
          {paginatedInterviews.map((interview) => (
            <div
              key={interview.id}
              className="bg-white shadow-sm rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  {getCandidateName(interview.candidateId)}
                </h2>
                <p className="text-sm text-gray-600">
                  Job: {getJobTitle(interview.jobId)} • Date:{" "}
                  {new Date(interview.date).toLocaleDateString()}
                </p>
              </div>
              <div className="space-x-2">
                <Link
                  href={`/interviews/${interview.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
                <Link
                  href={`/interviews/edit/${interview.id}`}
                  className="text-yellow-600 hover:underline"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      )}
    </div>
  );
}
