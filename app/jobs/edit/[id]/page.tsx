"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJobById, updateJob, deleteJob } from "@/lib/jobs";
import { JobStatus, Job } from "@/types";
import { notFound } from "next/navigation";

export default function JobEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);

  const [form, setForm] = useState({
    title: "",
    department: "",
    status: "Open" as JobStatus,
    description: "",
    skills: [] as string[],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    async function fetchJob() {
      const { id } = await params;
      const data = (await getJobById(id)) as Job;
      if (!data) return notFound();
      setJob(data);
      setForm({
        title: data.title || "",
        department: data.department || "",
        status: data.status || "Open",
        description: data.description || "",
        skills: data.requiredSkills || [],
      });
    }
    fetchJob();
  }, [params]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.department.trim())
      newErrors.department = "Department is required.";
    return newErrors;
  };

  const handleSkillAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSkill.trim()) {
      e.preventDefault();
      if (!form.skills.includes(newSkill.trim())) {
        setForm((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill.trim()],
        }));
        setNewSkill("");
      }
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
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const { id } = await params;
    await updateJob(id, {
      title: form.title,
      department: form.department,
      status: form.status,
      description: form.description,
      requiredSkills: form.skills,
    });
    router.push("/jobs");
  };

  const handleDelete = async () => {
    const { id } = await params;
    if (confirm("Are you sure you want to delete this job?")) {
      await deleteJob(id);
      router.push("/jobs");
    }
  };

  if (!job) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Job</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 shadow rounded"
      >
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={form.department}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded ${
              errors.department ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.department && (
            <p className="text-red-600 text-sm mt-1">{errors.department}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Required Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleSkillAdd}
            placeholder="Type skill and press Enter"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Job
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-100"
          >
            Delete Job
          </button>
        </div>
      </form>
    </div>
  );
}
