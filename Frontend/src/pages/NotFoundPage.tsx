export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 text-xl mb-8">Page not found</p>
        <a 
          href="/" 
          className="inline-block px-8 py-3 bg-yellow-400 text-teal-900 font-bold rounded-full hover:bg-yellow-300 transition-all duration-300"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}