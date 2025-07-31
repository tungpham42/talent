"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addJob } from "@/lib/jobs";
import { JobStatus } from "@/types";

export default function CreateJobPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    department: "",
    description: "",
    status: "Open" as JobStatus,
    skillInput: "",
    skills: [] as string[],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.department.trim()) errs.department = "Department is required.";
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    await addJob({
      title: form.title,
      department: form.department,
      description: form.description,
      status: form.status,
      requiredSkills: form.skills,
      createdAt: new Date(),
    });

    router.push("/jobs");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Job</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        <div>
          <label className="block font-semibold">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.title && (
            <p className="text-red-600 text-sm">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Department</label>
          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.department && (
            <p className="text-red-600 text-sm">{errors.department}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              value={form.skillInput}
              onChange={(e) => setForm({ ...form, skillInput: e.target.value })}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addSkill())
              }
              placeholder="Add a skill and press Enter"
              className="flex-1 border p-2 rounded"
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
                onClick={() => removeSkill(skill)}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm cursor-pointer"
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
          Save Job
        </button>
      </form>
    </div>
  );
}
