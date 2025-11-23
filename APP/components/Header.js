import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">TinyLink</h1>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/healthz"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Health
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

