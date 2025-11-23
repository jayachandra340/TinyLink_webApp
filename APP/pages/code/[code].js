import Head from 'next/head';
import StatsDetails from '../../components/StatsDetails';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function StatsPage() {
  return (
    <>
      <Head>
        <title>Link Statistics - TinyLink</title>
        <meta name="description" content="View detailed statistics for your shortened link" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <StatsDetails />
        <Footer />
      </div>
    </>
  );
}

