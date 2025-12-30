export function ClubsPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30" />
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 animate-pulse" style={{ animationDuration: '6s' }} />

      {/* Content */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center space-y-4 mb-16 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              Explore{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                University Clubs
              </span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl">
              Discover communities that inspire creativity, leadership, and lifelong connections
            </p>
          </div>

          {/* Clubs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Club Card */}
            <div className="group bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-white text-2xl font-semibold mb-3 group-hover:text-purple-300 transition">
                Tech Club
              </h3>
              <p className="text-white/60 mb-6">
                Explore modern technologies, coding competitions, and innovation projects.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-medium">50 members</span>
                <button className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm hover:from-purple-500 hover:to-blue-500 transition">
                  View Club →
                </button>
              </div>
            </div>

            {/* Club Card */}
            <div className="group bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-white text-2xl font-semibold mb-3 group-hover:text-blue-300 transition">
                Environmental Club
              </h3>
              <p className="text-white/60 mb-6">
                Promote sustainability, conservation, and environmental awareness.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-medium">75 members</span>
                <button className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm hover:from-purple-500 hover:to-blue-500 transition">
                  View Club →
                </button>
              </div>
            </div>

            {/* Club Card */}
            <div className="group bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-white text-2xl font-semibold mb-3 group-hover:text-pink-300 transition">
                Sports Club
              </h3>
              <p className="text-white/60 mb-6">
                Stay active, compete, and represent the university in sports events.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-pink-400 font-medium">120 members</span>
                <button className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm hover:from-purple-500 hover:to-blue-500 transition">
                  View Club →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
