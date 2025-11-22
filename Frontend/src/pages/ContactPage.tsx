export function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Contact Us
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Have questions? We're here to help you navigate the UniVerse
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-6">Get in Touch</h3>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h4 className="text-white text-lg font-semibold mb-3">Student Services Office</h4>
              <div className="space-y-2 text-white/70">
                <p>📧 student.services@university.edu</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>📍 Building A, Room 101</p>
                <p>🕒 Mon-Fri: 9:00 AM - 5:00 PM</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h4 className="text-white text-lg font-semibold mb-3">Technical Support</h4>
              <div className="space-y-2 text-white/70">
                <p>📧 tech.support@university.edu</p>
                <p>📞 +1 (555) 987-6543</p>
                <p>💬 Live chat available 24/7</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-2xl font-semibold text-white mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Name</label>
                <input
                  type="text"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                  placeholder="your.email@university.edu"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Message</label>
                <textarea
                  rows={5}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}