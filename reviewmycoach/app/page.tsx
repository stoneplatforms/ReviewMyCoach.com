import Link from "next/link";
import GlobalSearchBar from "./components/GlobalSearchBar";
import HeroCoachCarousel from "./components/HeroCoachCarousel";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - Dynamic Gradient with Floating Elements */}
      <div className="relative bg-black text-slate-50 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gray-800 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gray-800 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gray-800 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight">
              Find Your Perfect
              <br />
              <span className="text-transparent bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 bg-clip-text animate-pulse">
                Coach
              </span>
            </h1>
            <p className="text-xl sm:text-2xl mb-12 text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Over 1 million authentic reviews from athletes worldwide. 
              <span className="block mt-2 text-gray-400 font-semibold">Discover. Connect. Excel.</span>
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto mb-12">
              <GlobalSearchBar 
                placeholder="Search by sport, location, or coach name..."
                className="text-slate-900 shadow-2xl"
              />
            </div>
            
            {/* Popular Sports Pills */}
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="text-slate-400 mr-2">Trending:</span>
              <Link href="/search?q=basketball" className="gradient-basketball text-white px-4 py-2 rounded-full transition-all hover:scale-110 hover:shadow-2xl hover:shadow-orange-500/20">
                🏀 Basketball
              </Link>
              <Link href="/search?q=soccer" className="gradient-soccer text-white px-4 py-2 rounded-full transition-all hover:scale-110 hover:shadow-2xl hover:shadow-green-500/20">
                ⚽ Soccer
              </Link>
              <Link href="/search?q=tennis" className="gradient-tennis text-white px-4 py-2 rounded-full transition-all hover:scale-110 hover:shadow-2xl hover:shadow-yellow-500/20">
                🎾 Tennis
              </Link>
              <Link href="/search?q=swimming" className="gradient-swimming text-white px-4 py-2 rounded-full transition-all hover:scale-110 hover:shadow-2xl hover:shadow-gray-500/20">
                🏊 Swimming
              </Link>
            </div>
          </div>
        </div>
        
        {/* Featured Coaches Carousel */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Meet Our Top Coaches
            </h2>
            <p className="text-gray-400">
              Discover amazing coaches ready to help you reach your goals
            </p>
          </div>
          <HeroCoachCarousel />
        </div>
      </div>

      {/* Dynamic Sports Mosaic - No Gap Grid */}
      <div className="bg-black relative">
        <div className="w-full">
          {/* Dynamic Sports Mosaic */}
          <div className="grid grid-cols-6 grid-rows-4 gap-0 w-full h-screen">
            {/* Basketball - Large */}
            <Link
              href="/search?q=basketball"
              className="col-span-2 row-span-2 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/basketball.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-6xl mb-4">🏀</div>
                  <h3 className="text-white font-bold text-2xl mb-2">Basketball</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    2.3K
                  </div>
                </div>
              </div>
            </Link>

            {/* Soccer - Wide */}
            <Link
              href="/search?q=soccer"
              className="col-span-2 row-span-1 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-500 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/soccer.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-3">⚽</div>
                  <h3 className="text-white font-bold text-xl mb-2">Soccer</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    1.8K
                  </div>
                </div>
              </div>
            </Link>

            {/* Tennis - Tall */}
            <Link
              href="/search?q=tennis"
              className="col-span-1 row-span-2 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-orange-500 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/tennis.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-3">🎾</div>
                  <h3 className="text-white font-bold text-xl mb-2">Tennis</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    1.2K
                  </div>
                </div>
              </div>
            </Link>

            {/* Swimming - Tall */}
            <Link
              href="/search?q=swimming"
              className="col-span-1 row-span-2 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/swimming.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-3">🏊</div>
                  <h3 className="text-white font-bold text-xl mb-2">Swimming</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    940
                  </div>
                </div>
              </div>
            </Link>

            {/* Baseball - Tall */}
            <Link
              href="/search?q=baseball"
              className="col-span-1 row-span-2 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-500 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/baseball.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-3">⚾</div>
                  <h3 className="text-white font-bold text-xl mb-2">Baseball</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    1.5K
                  </div>
                </div>
              </div>
            </Link>

            {/* Golf */}
            <Link
              href="/search?q=golf"
              className="col-span-1 row-span-1 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-green-600 to-teal-600 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/golf.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-2 ">⛳</div>
                  <h3 className="text-white font-bold text-lg mb-1">Golf</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    820
                  </div>
                </div>
              </div>
            </Link>

            {/* Running */}
            <Link
              href="/search?q=running"
              className="col-span-1 row-span-1 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-violet-500 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/running.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-2 ">🏃</div>
                  <h3 className="text-white font-bold text-lg mb-1">Running</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    1.9K
                  </div>
                </div>
              </div>
            </Link>

            {/* Boxing - Wide */}
            <Link
              href="/search?q=boxing"
              className="col-span-2 row-span-1 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-red-600 to-orange-600 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/boxing.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-3">🥊</div>
                  <h3 className="text-white font-bold text-xl mb-2">Boxing</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    650
                  </div>
                </div>
              </div>
            </Link>

            {/* Yoga */}
            <Link
              href="/search?q=yoga"
              className="col-span-1 row-span-1 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/yoga.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-2 ">🧘</div>
                  <h3 className="text-white font-bold text-lg mb-1">Yoga</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    1.1K
                  </div>
                </div>
              </div>
            </Link>

            {/* Wrestling */}
            <Link
              href="/search?q=wrestling"
              className="col-span-1 row-span-1 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/wrestling.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-2 ">🤼</div>
                  <h3 className="text-white font-bold text-lg mb-1">Wrestling</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    480
                  </div>
                </div>
              </div>
            </Link>

            {/* Cycling - Wide */}
            <Link
              href="/search?q=cycling"
              className="col-span-2 row-span-1 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-500 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/cycling.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-3">🚴</div>
                  <h3 className="text-white font-bold text-xl mb-2">Cycling</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    720
                  </div>
                </div>
              </div>
            </Link>

            {/* Volleyball */}
            <Link
              href="/search?q=volleyball"
              className="col-span-1 row-span-1 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-yellow-600 to-orange-600 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/volleyball.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-2 ">🏐</div>
                  <h3 className="text-white font-bold text-lg mb-1">Volleyball</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    890
                  </div>
                </div>
              </div>
            </Link>

            {/* Martial Arts */}
            <Link
              href="/search?q=martial-arts"
              className="col-span-1 row-span-1 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/martial-arts.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-2 ">🥋</div>
                  <h3 className="text-white font-bold text-lg mb-1">Martial Arts</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    340
                  </div>
                </div>
              </div>
            </Link>

            {/* Gymnastics */}
            <Link
              href="/search?q=gymnastics"
              className="col-span-1 row-span-1 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-pink-500 to-rose-500 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/gymnastics.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-2 ">🤸</div>
                  <h3 className="text-white font-bold text-lg mb-1">Gymnastics</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    620
                  </div>
                </div>
              </div>
            </Link>

            {/* Rock Climbing */}
            <Link
              href="/search?q=climbing"
              className="col-span-1 row-span-1 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/climbing.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-2 ">🧗</div>
                  <h3 className="text-white font-bold text-lg mb-1">Climbing</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    290
                  </div>
                </div>
              </div>
            </Link>

            {/* Surfing */}
            <Link
              href="/search?q=surfing"
              className="col-span-1 row-span-1 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-teal-500 to-cyan-600 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/surfing.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-2 ">🏄</div>
                  <h3 className="text-white font-bold text-lg mb-1">Surfing</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    180
                  </div>
                </div>
              </div>
            </Link>

            {/* Skiing */}
            <Link
              href="/search?q=skiing"
              className="col-span-1 row-span-1 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/skiing.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-2 ">🎿</div>
                  <h3 className="text-white font-bold text-lg mb-1">Skiing</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    420
                  </div>
                </div>
              </div>
            </Link>

            {/* Track & Field */}
            <Link
              href="/search?q=track-field"
              className="col-span-1 row-span-1 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-500 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/track-field.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-2 ">🏃‍♂️</div>
                  <h3 className="text-white font-bold text-lg mb-1">Track & Field</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    950
                  </div>
                </div>
              </div>
            </Link>

            {/* Hockey */}
            <Link
              href="/search?q=hockey"
              className="col-span-1 row-span-1 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-slate-500 to-blue-600 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/hockey.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-2 ">🏒</div>
                  <h3 className="text-white font-bold text-lg mb-1">Hockey</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    680
                  </div>
                </div>
              </div>
            </Link>

            {/* CrossFit - Large */}
            <Link
              href="/search?q=crossfit"
              className="col-span-2 row-span-2 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-red-700 to-orange-700 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/crossfit.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-6xl mb-4">🏋️</div>
                  <h3 className="text-white font-bold text-2xl mb-2">CrossFit</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    1.3K
                  </div>
                </div>
              </div>
            </Link>

            {/* Badminton */}
            <Link
              href="/search?q=badminton"
              className="col-span-1 row-span-1 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-lime-500 to-green-500 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/badminton.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-2 ">🏸</div>
                  <h3 className="text-white font-bold text-lg mb-1">Badminton</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    380
                  </div>
                </div>
              </div>
            </Link>

            {/* Football */}
            <Link
              href="/search?q=football"
              className="col-span-1 row-span-1 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-amber-700 to-orange-800 transition-all duration-300 opacity-70 hover:opacity-100 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/sports/football.jpg)'}}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-2 ">🏈</div>
                  <h3 className="text-white font-bold text-lg mb-1">Football</h3>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/20 text-white font-medium">
                    2.1K
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Coach Pro Subscription Section */}
      <div className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></span>
              Exclusive for Coaches
            </div>
            <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
              Supercharge Your
              <br />
              <span className="bg-gradient-to-r from-white via-orange-400 to-orange-600 bg-clip-text text-transparent">
                Coaching Business
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join Coach Pro and unlock premium features designed to help you attract more athletes, 
              manage your coaching business, and maximize your earnings.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Features List */}
            <div className="space-y-8">
              {[
                {
                  icon: "⭐",
                  title: "Priority Placement",
                  description: "Get featured at the top of search results and sport categories"
                },
                {
                  icon: "📊",
                  title: "Advanced Analytics",
                  description: "Track your profile views, review trends, and athlete engagement"
                },
                {
                  icon: "💬",
                  title: "Direct Messaging",
                  description: "Connect directly with potential athletes and manage bookings"
                },
                {
                  icon: "🎯",
                  title: "Smart Matching",
                  description: "Get matched with athletes looking for your specific expertise"
                },
                {
                  icon: "🏆",
                  title: "Verified Coach Badge",
                  description: "Stand out with our exclusive verified coach certification"
                },
                {
                  icon: "💳",
                  title: "Integrated Payments",
                  description: "Accept payments seamlessly through our Stripe integration"
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-orange-500/30 transition-colors">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-orange-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Card */}
            <div className="bg-black/80 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5"></div>
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-4 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-full text-sm font-medium mb-4">
                    Most Popular
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Coach Pro</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-5xl font-bold text-white tracking-tight">$10</span>
                    <span className="text-xl text-gray-400 ml-2">/month</span>
                  </div>
                  <p className="text-gray-400 text-sm">or $96/year (save $24)</p>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    "Priority search placement",
                    "Advanced analytics dashboard", 
                    "Direct athlete messaging",
                    "Verified coach badge",
                    "Payment processing",
                    "Smart athlete matching",
                    "24/7 premium support"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-orange-500/20 border border-orange-500/30 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  href="/onboarding"
                  className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white py-4 px-8 rounded-2xl font-semibold text-center transition-all transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
                >
                  Start Your Coach Journey
                </Link>
                
                <p className="text-gray-500 text-sm text-center mt-4">
                  Already a coach? <Link href="/subscription" className="text-orange-400 hover:text-orange-300">Upgrade to Pro →</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 text-center">
            <p className="text-gray-500 mb-8">Trusted by thousands of coaches worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏀</span>
                <span>2,300+ Basketball Coaches</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⚽</span>
                <span>1,800+ Soccer Coaches</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎾</span>
                <span>1,200+ Tennis Coaches</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏊</span>
                <span>940+ Swimming Coaches</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
