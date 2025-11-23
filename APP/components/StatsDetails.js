import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function StatsDetails() {
  const router = useRouter();
  const { code } = router.query;
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) return;

    async function fetchStats() {
      try {
        const response = await fetch(`/api/links/${code}`);
        
        // Try to parse JSON - handle both JSON and non-JSON responses gracefully
        let data;
        try {
          const text = await response.text();
          if (!text) {
            throw new Error('Empty response');
          }
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('Failed to parse response:', parseError);
          if (!response.ok) {
            setError(`Server error (${response.status}). Please check if the database is configured correctly.`);
          } else {
            setError('Server returned invalid response. Please check the server logs.');
          }
          setLoading(false);
          return;
        }

        if (!response.ok) {
          setError(data.error || 'Failed to fetch stats');
          return;
        }

        setLink(data);
      } catch (err) {
        console.error('Network error:', err);
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          setError('Cannot connect to server. Please make sure the development server is running (npm run dev).');
        } else {
          setError('Network error. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [code]);

  const getShortUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/${code}`;
    }
    return `/${code}`;
  };

  const handleCopy = async () => {
    const url = getShortUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        alert('Failed to copy URL');
      }
      document.body.removeChild(textArea);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stats...</p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Link not found'}</p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Link Statistics</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Code</label>
              <p className="text-lg font-mono font-semibold text-gray-900">{link.code}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Short URL</label>
              <div className="flex items-center gap-2">
                <a
                  href={getShortUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all flex-1"
                >
                  {getShortUrl()}
                </a>
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  title="Copy short URL"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Original URL</label>
              <a
                href={link.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 break-all"
              >
                {link.originalUrl}
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 mb-1">Total Clicks</label>
                <p className="text-3xl font-bold text-blue-600">{link.clicks || 0}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                <p className="text-lg font-semibold text-green-600">
                  {new Date(link.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {link.lastClickedAt && (
              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">Last Clicked</label>
                <p className="text-lg font-semibold text-yellow-600">
                  {new Date(link.lastClickedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

