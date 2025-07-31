"use client";

import { useEffect, useState } from "react";
import { getCandidates, deleteCandidate } from "@/lib/candidates";
import { Candidate } from "@/types";
import Link from "next/link";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 5;

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filtered, setFiltered] = useState<Candidate[]>([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const all = await getCandidates();
      setCandidates(all);
      setFiltered(all);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let data = candidates;

    if (search) {
      data = data.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (stageFilter) {
      data = data.filter((c) => c.stage === stageFilter);
    }

    setFiltered(data);
    setPage(1);
  }, [candidates, search, stageFilter]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this candidate?");
    if (confirmed) {
      await deleteCandidate(id);
      setCandidates((prev) => prev.filter((c) => c.id !== id));
      setFiltered((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedCandidates = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Candidates</h1>
        <Link
          href="/candidates/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Candidate
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search name..."
          className="border rounded px-3 py-2 w-full sm:w-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Stages</option>
          {[...new Set(candidates.map((c) => c.stage))].map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </div>

      {paginatedCandidates.length === 0 ? (
        <p>No candidates found.</p>
      ) : (
        <div className="space-y-4">
          {paginatedCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white shadow-sm rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{candidate.name}</h2>
                <p className="text-sm text-gray-600">
                  {candidate.email} • Stage: {candidate.stage}
                </p>
              </div>
              <div className="space-x-2">
                <Link
                  href={`/candidates/${candidate.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
                <Link
                  href={`/candidates/edit/${candidate.id}`}
                  className="text-yellow-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(candidate.id!)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
                {candidate.resumeUrl && (
                  <a
                    href={candidate.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    Resume
                  </a>
                )}
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
