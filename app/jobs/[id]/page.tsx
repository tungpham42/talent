import { getJobById } from "@/lib/jobs";
import { Job } from "@/types";
import { notFound } from "next/navigation";

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = (await getJobById(id)) as Job;

  if (!job) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Department</h2>
          <p>{job.department || "N/A"}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Status</h2>
          <p
            className={`inline-block px-2 py-1 rounded text-sm ${
              job.status === "Open"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {job.status}
          </p>
        </div>

        {job.description && (
          <div>
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="whitespace-pre-line">{job.description}</p>
          </div>
        )}

        {job.requiredSkills.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">Required Skills</h2>
            <ul className="list-disc pl-6">
              {job.requiredSkills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

        {job.createdAt && (
          <div>
            <h2 className="text-lg font-semibold">Created At</h2>
            <p>{new Date(job.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
