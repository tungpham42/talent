import { getInterviewById } from "@/lib/interviews";
import { getJobById } from "@/lib/jobs";
import { getCandidateById } from "@/lib/candidates";
import { notFound } from "next/navigation";
import { Candidate, Interview, Job } from "@/types";
import Link from "next/link";

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Resolve the params promise to access id
  const interview = (await getInterviewById(id)) as Interview;

  if (!interview) return notFound();

  const candidate = (await getCandidateById(
    interview.candidateId
  )) as Candidate;
  const job = (await getJobById(interview.jobId)) as Job;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Interview Details</h1>

      <section className="bg-white shadow rounded-lg p-6 space-y-4">
        <Info
          label="Candidate"
          value={candidate?.name}
          fallback="Unknown Candidate"
        />
        <Info label="Job" value={job?.title} fallback="Unknown Job" />
        <Info
          label="Date & Time"
          value={new Date(interview.date).toLocaleString()}
        />
        <Info
          label="Notes"
          value={interview.notes}
          fallback="No notes available."
          multiline
        />
      </section>
      <div className="text-right mt-4">
        <Link
          href={`/interviews/edit/${id}`}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Edit Interview
        </Link>
      </div>
    </div>
  );
}

type InfoProps = {
  label: string;
  value?: string;
  fallback?: string;
  multiline?: boolean;
};

function Info({ label, value, fallback = "", multiline = false }: InfoProps) {
  return (
    <div>
      <h2 className="font-semibold">{label}</h2>
      <p className={multiline ? "whitespace-pre-line" : ""}>
        {value || fallback}
      </p>
    </div>
  );
}
