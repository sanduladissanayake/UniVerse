export function ClubsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            University Clubs
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Join clubs that match your interests and connect with like-minded students
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder content */}
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-white text-xl font-semibold mb-2">Tech Club</h3>
            <p className="text-white/60 mb-4">Learn about latest technologies and programming</p>
            <span className="text-purple-400">50 members</span>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-white text-xl font-semibold mb-2">Environmental Club</h3>
            <p className="text-white/60 mb-4">Make a difference for our planet</p>
            <span className="text-purple-400">75 members</span>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-white text-xl font-semibold mb-2">Sports Club</h3>
            <p className="text-white/60 mb-4">Stay active and compete in various sports</p>
            <span className="text-purple-400">120 members</span>
          </div>
        </div>
      </div>
    </div>
  );
}