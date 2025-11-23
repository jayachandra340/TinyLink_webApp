import { useState, useEffect } from 'react';
import Head from 'next/head';
import AddLinkForm from '../components/AddLinkForm';
import LinkTable from '../components/LinkTable';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');

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
        setError(data.error || 'Failed to fetch links');
        return;
      }

      setLinks(data);
      setError('');
    } catch (err) {
      console.error('Network error:', err);
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Cannot connect to server. Please make sure the development server is running (npm run dev) and DATABASE_URL is set in .env file.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleAdd = (newLink) => {
    setLinks([newLink, ...links]);
  };

  const handleDelete = (code) => {
    setLinks(links.filter((link) => link.code !== code));
  };

  // Check for error query parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const errorParam = params.get('error');
      if (errorParam === 'notfound') {
        setError('Link not found');
      } else if (errorParam === 'redirect') {
        setError('Redirect error occurred');
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>TinyLink - Dashboard</title>
        <meta name="description" content="TinyLink - URL shortening service with analytics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Create, manage, and track your shortened links</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1">
              <AddLinkForm onAdd={handleAdd} />
            </div>
            <div className="lg:col-span-2">
              {loading ? (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading links...</p>
                </div>
              ) : (
                <LinkTable
                  links={links}
                  onDelete={handleDelete}
                  onRefresh={fetchLinks}
                />
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

