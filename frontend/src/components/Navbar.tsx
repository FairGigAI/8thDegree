import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        FairGigAI
      </Link>
      <div>
        {/* Add navigation links here */}
        <Link href="/about" className="mr-4">About</Link>
        <Link href="/login">Login</Link>
      </div>
    </nav>
  );
}
