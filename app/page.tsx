import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/candidates">
          <div className="bg-white shadow hover:shadow-md transition p-6 rounded-2xl border cursor-pointer">
            <h2 className="text-xl font-semibold text-blue-600">Candidates</h2>
            <p className="text-gray-600 mt-2">
              View and manage all applicants.
            </p>
          </div>
        </Link>

        <Link href="/jobs">
          <div className="bg-white shadow hover:shadow-md transition p-6 rounded-2xl border cursor-pointer">
            <h2 className="text-xl font-semibold text-green-600">Jobs</h2>
            <p className="text-gray-600 mt-2">
              List, edit or create job postings.
            </p>
          </div>
        </Link>

        <Link href="/interviews">
          <div className="bg-white shadow hover:shadow-md transition p-6 rounded-2xl border cursor-pointer">
            <h2 className="text-xl font-semibold text-purple-600">
              Interviews
            </h2>
            <p className="text-gray-600 mt-2">Schedule and track interviews.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
