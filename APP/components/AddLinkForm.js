import { useState } from 'react';

export default function AddLinkForm({ onAdd }) {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          code: code.trim() || undefined,
        }),
      });

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
        return;
      }

      if (!response.ok) {
        setError(data.error || 'Failed to create link');
        return;
      }

      setSuccess('Link created successfully!');
      setUrl('');
      setCode('');
      if (onAdd) {
        onAdd(data);
      }
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
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Short Link</h2>
      
      <div className="mb-4">
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
          URL <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            error && !url
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        <p className="mt-1 text-xs text-gray-500">Must start with http:// or https://</p>
      </div>

      <div className="mb-4">
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
          Custom Code (Optional)
        </label>
        <input
          type="text"
          id="code"
          value={code}
          onChange={(e) => {
            const value = e.target.value.replace(/[^A-Za-z0-9]/g, '');
            if (value.length <= 8) {
              setCode(value);
            }
          }}
          placeholder="6-8 alphanumeric characters"
          pattern="[A-Za-z0-9]{6,8}"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            error && code && !/^[A-Za-z0-9]{6,8}$/.test(code)
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        <p className="mt-1 text-xs text-gray-500">
          {code && !/^[A-Za-z0-9]{6,8}$/.test(code) && (
            <span className="text-red-500">Code must be 6-8 alphanumeric characters</span>
          )}
          {code && /^[A-Za-z0-9]{6,8}$/.test(code) && (
            <span className="text-green-500">Valid code format</span>
          )}
          {!code && 'Leave empty for auto-generated code'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !url.trim()}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          loading || !url.trim()
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
        }`}
      >
        {loading ? 'Creating...' : 'Create Short Link'}
      </button>
    </form>
  );
}

