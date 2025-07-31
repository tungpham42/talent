"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getJobs } from "@/lib/jobs";
import { Job } from "@/types";
import Pagination from "@/components/Pagination";

const JOBS_PER_PAGE = 5;

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filtered, setFiltered] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  useEffect(() => {
    let data = jobs;

    if (search) {
      data = data.filter((j) =>
        j.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      data = data.filter((j) => j.status === statusFilter);
    }

    if (deptFilter) {
      data = data.filter((j) => j.department === deptFilter);
    }

    setFiltered(data);
    setPage(1);
  }, [jobs, search, statusFilter, deptFilter]);

  const totalPages = Math.ceil(filtered.length / JOBS_PER_PAGE);
  const paginatedJobs = filtered.slice(
    (page - 1) * JOBS_PER_PAGE,
    page * JOBS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Link
          href="/jobs/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Job
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search title..."
          className="border rounded px-3 py-2 w-full sm:w-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Departments</option>
          {[...new Set(jobs.map((j) => j.department))].map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {paginatedJobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="space-y-4">
          {paginatedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white shadow-sm rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="text-sm text-gray-600">
                  {job.department} • {job.status}
                </p>
              </div>

              <div className="space-x-2">
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
                <Link
                  href={`/jobs/edit/${job.id}`}
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
