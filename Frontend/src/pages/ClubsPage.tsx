export function ClubsPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-16 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight">
            Explore <span className="gradient-text">University Clubs</span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Discover communities that inspire creativity, leadership, and lifelong connections
          </p>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Club Card */}
          <div className="group bg-white border-2 border-teal-200 rounded-2xl p-8 hover:shadow-2xl hover:shadow-teal-400/30 transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-gray-900 text-2xl font-bold mb-3 group-hover:text-teal-600 transition">
              Tech Club
            </h3>
            <p className="text-gray-600 mb-6">
              Explore modern technologies, coding competitions, and innovation projects.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-teal-600 font-bold">50 members</span>
              <button className="px-5 py-2 bg-yellow-400 text-teal-900 rounded-full text-sm font-bold hover:bg-yellow-300 transition">
                View Club →
              </button>
            </div>
          </div>

          {/* Club Card */}
          <div className="group bg-white border-2 border-teal-200 rounded-2xl p-8 hover:shadow-2xl hover:shadow-teal-400/30 transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-gray-900 text-2xl font-bold mb-3 group-hover:text-teal-600 transition">
              Environmental Club
            </h3>
            <p className="text-gray-600 mb-6">
              Promote sustainability, conservation, and environmental awareness.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-teal-600 font-bold">75 members</span>
              <button className="px-5 py-2 bg-yellow-400 text-teal-900 rounded-full text-sm font-bold hover:bg-yellow-300 transition">
                View Club →
              </button>
            </div>
          </div>

          {/* Club Card */}
          <div className="group bg-white border-2 border-teal-200 rounded-2xl p-8 hover:shadow-2xl hover:shadow-teal-400/30 transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-gray-900 text-2xl font-bold mb-3 group-hover:text-teal-600 transition">
              Sports Club
            </h3>
            <p className="text-gray-600 mb-6">
              Stay active, compete, and represent the university in sports events.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-teal-600 font-bold">120 members</span>
              <button className="px-5 py-2 bg-yellow-400 text-teal-900 rounded-full text-sm font-bold hover:bg-yellow-300 transition">
                View Club →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .gradient-text {
          background: linear-gradient(135deg, #00897b, #0097a7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}
