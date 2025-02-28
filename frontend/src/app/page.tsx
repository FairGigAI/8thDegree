import Link from "next/link";
import DarkModeWrapper from "@/components/DarkModeWrapper";

export default function Home() {
  return (
    <DarkModeWrapper>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Navbar Placeholder */}
        <nav className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-bold text-blue-400">FairGigAI</h1>
          <div className="space-x-4">
            <Link href="/jobs" className="hover:underline">Jobs</Link>
            <Link href="/freelancers" className="hover:underline">Freelancers</Link>
            <Link href="/profile" className="hover:underline">Profile</Link>
          </div>
        </nav>

        {/* Main Section */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-200">
            The Future of Fair Freelancing ◎
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Connect. Work. Earn. No Bidding Wars. No Exploitation.
          </p>
        </div>

        {/* Network Visualization Placeholder */}
        <div className="mt-12 flex justify-center">
          <div className="relative w-full h-[400px] bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
            🔗 Future: Interactive Network Graph (Clients ↔ Freelancers ↔ Jobs)
          </div>
        </div>

        {/* Call-to-Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link href="/jobs" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Browse Jobs
          </Link>
          <Link href="/signup" className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition">
            Join Now
          </Link>
        </div>
      </div>
    </DarkModeWrapper>
  );
}
