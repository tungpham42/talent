import Link from "next/link";

export default function JobCard({
  title,
  department,
  status,
}: {
  title: string;
  department: string;
  status: string;
}) {
  return (
    <Link href={`/jobs/${title}`}>
      <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{department}</p>
        <span
          className={`inline-block mt-2 px-3 py-1 text-xs rounded-full 
          ${
            status === "Open"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {status}
        </span>
      </div>
    </Link>
  );
}
