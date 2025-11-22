export function AnnouncementsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Announcements
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Stay updated with the latest news and important information
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white text-xl font-semibold mb-2">Registration Open for Spring Events</h3>
                <span className="text-purple-400 text-sm">December 10, 2025</span>
              </div>
              <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">High Priority</span>
            </div>
            <p className="text-white/70">
              Registration is now open for all spring semester events. Don't miss out on exciting workshops and activities!
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white text-xl font-semibold mb-2">New Club Formation Guidelines</h3>
                <span className="text-purple-400 text-sm">December 8, 2025</span>
              </div>
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">Medium Priority</span>
            </div>
            <p className="text-white/70">
              Updated guidelines for forming new student clubs are now available. Check the student portal for more details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}