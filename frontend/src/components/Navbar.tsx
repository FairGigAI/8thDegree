import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
      <Link href="/" className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
        8thDegree.io
      </Link>
      <div className="flex space-x-6">
        <Link href="/about" className="text-gray-300 hover:text-white transition">
          About
        </Link>
        <Link href="/login" className="bg-gradient-to-r from-green-400 to-blue-500 px-4 py-2 rounded-lg text-white hover:opacity-90 transition">
          Login
        </Link>
      </div>
    </nav>
  );
}
