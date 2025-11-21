export function NotFoundPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-white/60 text-xl mb-8">Page not found</p>
        <a 
          href="/" 
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}