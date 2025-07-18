import Link from "next/link";
import Image from "next/image";
import GlobalSearchBar from "./components/GlobalSearchBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section - Dynamic Gradient with Floating Elements */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-sky-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-violet-500 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight">
              Find Your Perfect
              <br />
              <span className="text-transparent bg-gradient-to-r from-sky-400 via-emerald-400 to-violet-400 bg-clip-text animate-pulse">
                Coach
              </span>
            </h1>
            <p className="text-xl sm:text-2xl mb-12 text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Over 1 million authentic reviews from athletes worldwide. 
              <span className="block mt-2 text-sky-400 font-semibold">Discover. Connect. Excel.</span>
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
              <Link href="/search?q=swimming" className="gradient-swimming text-white px-4 py-2 rounded-full transition-all hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/20">
                🏊 Swimming
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Sports Mosaic - No Gap Grid */}
      <div className="bg-slate-950 relative">
        <div className="w-full">
          {/* Dynamic Sports Mosaic */}
          <div className="grid grid-cols-6 grid-rows-4 gap-0 w-full h-screen">
            {/* Basketball - Large */}
            <Link
              href="/search?q=basketball"
              className="col-span-2 row-span-2 group relative"
            >
              <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-600/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-600/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-600/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-600/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-600/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-600/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-pink-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-600/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-teal-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-600/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-slate-500 to-blue-600 hover:from-slate-400 hover:to-blue-500 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-red-700 to-orange-700 hover:from-red-600 hover:to-orange-600 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-700/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-lime-500 to-green-500 hover:from-lime-400 hover:to-green-400 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-lime-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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
              <div className="w-full h-full bg-gradient-to-br from-amber-700 to-orange-800 hover:from-amber-600 hover:to-orange-700 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-700/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
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

      {/* Testimonials Carousel - Sliding Cards */}
      <div className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-50 mb-6">
              Athletes <span className="text-emerald-400">Love</span> Us
            </h2>
            <p className="text-xl text-slate-400">Real stories from real athletes</p>
          </div>
          
          <div className="relative">
            <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
              {[
                {
                  name: "Marcus Thompson",
                  sport: "Basketball",
                  text: "Found my dream coach through ReviewMyCoach! Improved my free throw percentage by 40% in just 3 months.",
                  rating: 5,
                  avatar: "MT",
                  location: "Los Angeles"
                },
                {
                  name: "Sofia Rodriguez",
                  sport: "Soccer",
                  text: "The reviews helped me find a coach who understood my goals. Now I'm playing college soccer!",
                  rating: 5,
                  avatar: "SR",
                  location: "Miami"
                },
                {
                  name: "David Chen",
                  sport: "Tennis",
                  text: "Incredible platform! The detailed reviews gave me confidence to choose the right coach for my playing style.",
                  rating: 5,
                  avatar: "DC",
                  location: "New York"
                },
                {
                  name: "Emma Johnson",
                  sport: "Swimming",
                  text: "Cut 15 seconds off my 400m time with a coach I found here. The community is amazing!",
                  rating: 5,
                  avatar: "EJ",
                  location: "Chicago"
                },
                {
                  name: "Alex Kim",
                  sport: "Boxing",
                  text: "From complete beginner to competing in local tournaments. My coach is phenomenal!",
                  rating: 5,
                  avatar: "AK",
                  location: "Seattle"
                }
              ].map((testimonial, index) => (
                <div key={index} className="flex-shrink-0 w-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="text-slate-50 font-semibold">{testimonial.name}</h4>
                      <p className="text-slate-400 text-sm">{testimonial.sport} • {testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-300 italic leading-relaxed">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Coach Spotlight - Magazine Style Layout */}
      <div className="bg-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-50 mb-6">
              Featured <span className="text-violet-400">Coaches</span>
            </h2>
            <p className="text-xl text-slate-400">Meet the stars of our coaching community</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Featured Coach */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 hover:border-violet-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10">
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                    SJ
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-slate-50">Sarah Johnson</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-slate-300 font-semibold">4.9</span>
                      </div>
                    </div>
                    <p className="text-violet-400 font-semibold mb-2">Elite Basketball Coach</p>
                    <p className="text-slate-400 text-sm mb-3">Los Angeles, CA</p>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                      Former WNBA player with 12 years of professional coaching experience. 
                      Specializes in developing young talent and perfecting shooting techniques.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-semibold">147 Reviews</span>
                      <Link href="/coach/sarah-johnson" className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-lg transition-colors">
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Coaches Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { name: "Mike Chen", sport: "Soccer", rating: 4.8, reviews: 89, initial: "MC", color: "from-green-500 to-emerald-500" },
                { name: "Alex Rodriguez", sport: "Tennis", rating: 4.9, reviews: 156, initial: "AR", color: "from-yellow-500 to-orange-500" },
                { name: "Emma Williams", sport: "Swimming", rating: 4.7, reviews: 93, initial: "EW", color: "from-blue-500 to-cyan-500" },
                { name: "Jordan Smith", sport: "Boxing", rating: 4.8, reviews: 67, initial: "JS", color: "from-red-500 to-pink-500" },
              ].map((coach, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 hover:border-sky-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10">
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${coach.color} rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg`}>
                      {coach.initial}
                    </div>
                    <h4 className="text-slate-50 font-semibold text-lg mb-1">{coach.name}</h4>
                    <p className="text-slate-400 text-sm mb-2">{coach.sport}</p>
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-slate-300 text-sm">{coach.rating}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{coach.reviews} reviews</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories Timeline */}
      <div className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-50 mb-6">
              Success <span className="text-sky-400">Timeline</span>
            </h2>
            <p className="text-xl text-slate-400">Journey through our community's achievements</p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-sky-500 via-emerald-500 to-violet-500 rounded-full"></div>
            
            <div className="space-y-16">
              {[
                {
                  year: "2024",
                  title: "Platform Launch",
                  description: "ReviewMyCoach launches with 5,000 verified coaches",
                  stats: "5K+ Coaches",
                  side: "left"
                },
                {
                  year: "2024",
                  title: "100K Athletes",
                  description: "Reached 100,000 active athletes using our platform",
                  stats: "100K+ Athletes",
                  side: "right"
                },
                {
                  year: "2024",
                  title: "1M Reviews",
                  description: "Community contributed over 1 million authentic reviews",
                  stats: "1M+ Reviews",
                  side: "left"
                },
                {
                  year: "2024",
                  title: "Global Expansion",
                  description: "Expanded to 25 countries with local coach verification",
                  stats: "25+ Countries",
                  side: "right"
                },
              ].map((milestone, index) => (
                <div key={index} className={`flex items-center ${milestone.side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${milestone.side === 'left' ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 hover:border-sky-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10">
                      <div className="text-sky-400 font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="text-slate-50 font-bold text-xl mb-3">{milestone.title}</h3>
                      <p className="text-slate-400 mb-4">{milestone.description}</p>
                      <div className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold inline-block">
                        {milestone.stats}
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full border-4 border-slate-900 relative z-10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Community Hub - Interactive Section */}
      <div className="bg-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-50 mb-6">
              Join Our <span className="text-emerald-400">Community</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Connect with athletes and coaches worldwide. Share your journey, get inspired, and grow together.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Live Stats */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 text-center hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-slate-50 mb-2">Live Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Active Now</span>
                  <span className="text-emerald-400 font-semibold">2,347</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Reviews Today</span>
                  <span className="text-sky-400 font-semibold">189</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">New Coaches</span>
                  <span className="text-violet-400 font-semibold">23</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 text-center hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-slate-50 mb-6">Get Started</h3>
              <div className="space-y-3">
                <Link href="/signup" className="block bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold">
                  Join as Athlete
                </Link>
                <Link href="/onboarding" className="block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold">
                  Join as Coach
                </Link>
                <Link href="/coaches" className="block border-2 border-slate-600 hover:border-sky-500 text-slate-300 hover:text-sky-400 px-6 py-3 rounded-lg transition-colors font-semibold">
                  Browse Coaches
                </Link>
              </div>
            </div>

            {/* Community Features */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 text-center hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold text-slate-50 mb-6">Features</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                  <span className="text-slate-300">Verified Reviews</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-slate-300">Direct Messaging</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                  <span className="text-slate-300">Smart Matching</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-slate-300">Progress Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Footer */}
      <footer className="bg-slate-950 text-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Newsletter Section */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Stay in the Game</h3>
            <p className="text-slate-400 mb-6">Get the latest coaching tips, success stories, and platform updates</p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-l-lg px-4 py-3 text-slate-300 focus:outline-none focus:border-sky-500"
              />
              <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-r-lg transition-colors font-semibold">
                Subscribe
              </button>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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
                The world's leading platform for finding and reviewing sports coaches. 
                Connecting athletes with excellence since 2024.
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
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">For Athletes</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/coaches" className="hover:text-sky-400 transition-colors">Find Coaches</Link></li>
                <li><Link href="/search" className="hover:text-sky-400 transition-colors">Advanced Search</Link></li>
                <li><Link href="/signup" className="hover:text-sky-400 transition-colors">Join Free</Link></li>
                <li><Link href="/about" className="hover:text-sky-400 transition-colors">How it Works</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">For Coaches</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/onboarding" className="hover:text-sky-400 transition-colors">Get Listed</Link></li>
                <li><Link href="/dashboard" className="hover:text-sky-400 transition-colors">Coach Portal</Link></li>
                <li><Link href="/subscription" className="hover:text-sky-400 transition-colors">Pro Features</Link></li>
                <li><Link href="/support" className="hover:text-sky-400 transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
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
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
