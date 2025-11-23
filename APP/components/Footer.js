export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} TinyLink. Built with Next.js and PostgreSQL.</p>
        </div>
      </div>
    </footer>
  );
}

