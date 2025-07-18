import Link from "next/link";
import Image from "next/image";
import GlobalSearchBar from "./components/GlobalSearchBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Find the Perfect <span className="text-transparent bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text">Coach</span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-slate-300 max-w-3xl mx-auto">
              Over 1 million reviews from athletes to help you find the best sports coaches in your area
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <GlobalSearchBar 
                placeholder="Search coaches, sports, or locations..."
                className="text-slate-900"
              />
            </div>
            
            {/* Popular Searches */}
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="text-slate-400">Popular:</span>
              <Link href="/search?q=basketball" className="gradient-basketball text-white px-3 py-1 rounded-full transition-all hover:scale-105 hover:shadow-lg">
                Basketball
              </Link>
              <Link href="/search?q=soccer" className="gradient-soccer text-white px-3 py-1 rounded-full transition-all hover:scale-105 hover:shadow-lg">
                Soccer
              </Link>
              <Link href="/search?q=tennis" className="gradient-tennis text-white px-3 py-1 rounded-full transition-all hover:scale-105 hover:shadow-lg">
                Tennis
              </Link>
              <Link href="/search?q=swimming" className="gradient-swimming text-white px-3 py-1 rounded-full transition-all hover:scale-105 hover:shadow-lg">
                Swimming
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="minimal-card py-8">
              <div className="text-3xl font-bold text-sky-400 mb-2">1M+</div>
              <div className="text-slate-300">Coach Reviews</div>
            </div>
            <div className="minimal-card py-8">
              <div className="text-3xl font-bold text-emerald-400 mb-2">50K+</div>
              <div className="text-slate-300">Registered Coaches</div>
            </div>
            <div className="minimal-card py-8">
              <div className="text-3xl font-bold text-violet-400 mb-2">100+</div>
              <div className="text-slate-300">Sports Covered</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-50 mb-4">How ReviewMyCoach Works</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Find and review sports coaches just like Rate My Professor, but for athletics
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center minimal-card">
              <div className="bg-sky-500 bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 ring-2 ring-sky-400/30">
                <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-50 mb-2">Search Coaches</h3>
              <p className="text-slate-400">
                Search by sport, location, or coach name to find the perfect match for your athletic goals
              </p>
            </div>
            
            <div className="text-center minimal-card">
              <div className="bg-emerald-500 bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 ring-2 ring-emerald-400/30">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-50 mb-2">Read Reviews</h3>
              <p className="text-slate-400">
                Read authentic reviews from other athletes about training style, effectiveness, and coaching quality
              </p>
            </div>
            
            <div className="text-center minimal-card">
              <div className="bg-violet-500 bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 ring-2 ring-violet-400/30">
                <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-50 mb-2">Write Reviews</h3>
              <p className="text-slate-400">
                Share your experience to help other athletes find great coaches and improve the coaching community
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Coaches Section */}
      <div className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-50 mb-4">Top Rated Coaches</h2>
            <p className="text-lg text-slate-300">
              Discover highly-rated coaches across different sports
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Sarah Johnson", sport: "Basketball", rating: 4.9, reviews: 127, location: "Los Angeles, CA", color: "amber" },
              { name: "Mike Chen", sport: "Soccer", rating: 4.8, reviews: 89, location: "New York, NY", color: "emerald" },
              { name: "Alex Rodriguez", sport: "Tennis", rating: 4.9, reviews: 156, location: "Miami, FL", color: "violet" },
              { name: "Emma Williams", sport: "Swimming", rating: 4.7, reviews: 93, location: "Chicago, IL", color: "blue" },
            ].map((coach, index) => (
              <div key={index} className="minimal-card hover:border-sky-500/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-r from-slate-600 to-slate-500 rounded-full w-12 h-12 flex items-center justify-center ring-2 ring-slate-500/30`}>
                    <span className={`text-sky-400 font-bold text-lg`}>{coach.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-slate-300">{coach.rating}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-50 mb-1">{coach.name}</h3>
                <p className="text-sm text-slate-300 mb-2">{coach.sport}</p>
                <p className="text-sm text-slate-400 mb-3">{coach.location}</p>
                <p className="text-sm text-slate-300">{coach.reviews} reviews</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/coaches" className="btn-accent px-6 py-3 rounded-lg font-medium">
              View All Coaches
            </Link>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-50 mb-4">Why Choose ReviewMyCoach?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="minimal-card">
              <div className="bg-sky-500 bg-opacity-20 rounded-lg w-12 h-12 flex items-center justify-center mb-4 ring-2 ring-sky-400/30">
                <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-50 mb-2">Verified Reviews</h3>
              <p className="text-slate-400">
                All reviews are from real athletes who have trained with these coaches
              </p>
            </div>
            
            <div className="minimal-card">
              <div className="bg-emerald-500 bg-opacity-20 rounded-lg w-12 h-12 flex items-center justify-center mb-4 ring-2 ring-emerald-400/30">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-50 mb-2">Find Coaches Fast</h3>
              <p className="text-slate-400">
                Powerful search filters help you find the perfect coach in seconds
              </p>
            </div>
            
            <div className="minimal-card">
              <div className="bg-violet-500 bg-opacity-20 rounded-lg w-12 h-12 flex items-center justify-center mb-4 ring-2 ring-violet-400/30">
                <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-50 mb-2">Community Driven</h3>
              <p className="text-slate-400">
                Built by athletes, for athletes to improve the coaching experience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-50 mb-4">Ready to Find Your Coach?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of athletes who use ReviewMyCoach to find the best coaches and improve their game
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-accent px-8 py-3 rounded-lg font-medium">
              Sign Up Free
            </Link>
            <Link href="/coaches" className="border-2 border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white px-8 py-3 rounded-lg font-medium transition-all">
              Browse Coaches
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Image
                  src="/reviewmycoachlogo.png"
                  alt="ReviewMyCoach Logo"
                  className="h-8 w-auto mr-3"
                  width={32}
                  height={32}
                />
                <span className="text-xl font-bold">ReviewMyCoach</span>
              </div>
              <p className="text-slate-400 mb-4">
                The leading platform for finding and reviewing sports coaches. Connect with verified coaches across all sports and skill levels.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.995 1.488-1.995.219 0 .406.164.406.359 0 .219-.139.547-.219.852-.179.73.219 1.406.959 1.406.959 0 1.797-1.406 1.797-2.862 0-1.218-.662-2.403-2.403-2.403-1.797 0-2.965 1.406-2.965 2.403 0 .547.219.959.547 1.316.059.219-.041.547-.219.547-.179 0-.547-.219-.547-.547 0-.959.662-1.797 1.797-1.797.959 0 1.797.662 1.797 1.797 0 .959-.547 1.797-1.797 1.797-.547 0-.959-.219-1.316-.547-.219.547-.547 1.316-.547 1.316-.179.547-.547.959-.959.959-.547 0-.959-.547-.959-.959 0-.547.219-.959.547-1.316-.547-.219-.959-.662-.959-1.316 0-.959.547-1.797 1.797-1.797.547 0 .959.219 1.316.547.219-.547.547-1.316.547-1.316.179-.547.547-.959.959-.959.547 0 .959.547.959.959 0 .547-.219.959-.547 1.316.547.219.959.662.959 1.316 0 .959-.547 1.797-1.797 1.797-.547 0-.959-.219-1.316-.547-.219.547-.547 1.316-.547 1.316z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">For Athletes</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/coaches" className="hover:text-sky-400 transition-colors">Find Coaches</Link></li>
                <li><Link href="/search" className="hover:text-sky-400 transition-colors">Search</Link></li>
                <li><Link href="/signup" className="hover:text-sky-400 transition-colors">Sign Up</Link></li>
                <li><Link href="/about" className="hover:text-sky-400 transition-colors">About Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">For Coaches</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/onboarding" className="hover:text-sky-400 transition-colors">Join as Coach</Link></li>
                <li><Link href="/dashboard" className="hover:text-sky-400 transition-colors">Coach Dashboard</Link></li>
                <li><Link href="/subscription" className="hover:text-sky-400 transition-colors">Pricing</Link></li>
                <li><Link href="/support" className="hover:text-sky-400 transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 ReviewMyCoach. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-slate-400 hover:text-sky-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-sky-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-slate-400 hover:text-sky-400 text-sm transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
