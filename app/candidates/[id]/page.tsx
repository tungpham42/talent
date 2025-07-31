import { getCandidateById } from "@/lib/candidates";
import { getJobs } from "@/lib/jobs";
import { notFound } from "next/navigation";
import { Candidate } from "@/types";
import Link from "next/link";

export default async function CandidateViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Resolve the params promise to access id
  const candidate = (await getCandidateById(id)) as Candidate;
  const jobs = await getJobs();

  if (!candidate) return notFound();

  const job = jobs.find((j) => j.id === candidate.appliedJobId);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Candidate Details</h1>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <strong>Name:</strong> {candidate.name}
        </div>
        <div>
          <strong>Email:</strong> {candidate.email}
        </div>
        <div>
          <strong>Stage:</strong> {candidate.stage}
        </div>
        <div>
          <strong>Applied Job:</strong> {job?.title || candidate.appliedJobId}
        </div>
        <div>
          <strong>Source:</strong> {candidate.source ?? "—"}
        </div>
        <div>
          <strong>Resume:</strong>{" "}
          {candidate.resumeUrl ? (
            <a
              href={candidate.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Resume
            </a>
          ) : (
            "—"
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Link href={`/candidates/edit/${id}`}>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
            Edit
          </button>
        </Link>
        <Link href="/candidates">
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
            Back
          </button>
        </Link>
      </div>
    </div>
  );
}
