import { getLinkByCode, incrementClick, isValidCode } from '../lib/db';

export default function RedirectPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { code } = context.params;
  
  // Validate code parameter
  if (!code || typeof code !== 'string') {
    return {
      redirect: {
        destination: '/?error=notfound',
        permanent: false,
      },
    };
  }
  
  const trimmedCode = code.trim();
  
  // Check for reserved routes that shouldn't be treated as codes
  const reservedRoutes = ['api', 'healthz', 'code', '_next', 'favicon.ico'];
  if (reservedRoutes.includes(trimmedCode.toLowerCase())) {
    return {
      notFound: true,
    };
  }
  
  // Validate code format (6-8 alphanumeric)
  if (!isValidCode(trimmedCode)) {
    return {
      redirect: {
        destination: '/?error=notfound',
        permanent: false,
      },
    };
  }
  
  try {
    const link = await getLinkByCode(trimmedCode);
    
    if (!link) {
      return {
        redirect: {
          destination: '/?error=notfound',
          permanent: false,
        },
      };
    }
    
    // Validate original URL before redirecting
    if (!link.original_url || typeof link.original_url !== 'string') {
      return {
        redirect: {
          destination: '/?error=redirect',
          permanent: false,
        },
      };
    }
    
    // Increment click count (don't fail redirect if this fails)
    try {
      await incrementClick(trimmedCode);
    } catch (clickError) {
      console.error('Error incrementing click count:', clickError);
      // Continue with redirect even if click tracking fails
    }
    
    // Redirect with 302
    return {
      redirect: {
        destination: link.original_url,
        permanent: false,
      },
    };
  } catch (error) {
    console.error('Redirect error:', error);
    return {
      redirect: {
        destination: '/?error=redirect',
        permanent: false,
      },
    };
  }
}

