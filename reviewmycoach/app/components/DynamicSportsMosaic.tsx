'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase-client';

interface SportConfig {
  name: string;
  searchTerm: string;
  emoji: string;
  gradient: string;
  backgroundImage: string;
  gridClass: string;
  textSize: string;
}

const SPORTS_CONFIG: SportConfig[] = [
  {
    name: 'Basketball',
    searchTerm: 'basketball',
    emoji: '🏀',
    gradient: 'from-orange-500 to-red-500',
    backgroundImage: '/sports/basketball.jpg',
    gridClass: 'col-span-2 row-span-2',
    textSize: 'text-6xl mb-4'
  },
  {
    name: 'Soccer',
    searchTerm: 'soccer',
    emoji: '⚽',
    gradient: 'from-green-500 to-emerald-500',
    backgroundImage: '/sports/soccer.jpg',
    gridClass: 'col-span-2 row-span-1',
    textSize: 'text-5xl mb-3'
  },
  {
    name: 'Tennis',
    searchTerm: 'tennis',
    emoji: '🎾',
    gradient: 'from-yellow-500 to-orange-500',
    backgroundImage: '/sports/tennis.jpg',
    gridClass: 'col-span-1 row-span-2',
    textSize: 'text-5xl mb-3'
  },
  {
    name: 'Swimming',
    searchTerm: 'swimming',
    emoji: '🏊',
    gradient: 'from-neutral-700 to-neutral-500',
    backgroundImage: '/sports/swimming.jpg',
    gridClass: 'col-span-1 row-span-2',
    textSize: 'text-5xl mb-3'
  },
  {
    name: 'Baseball',
    searchTerm: 'baseball',
    emoji: '⚾',
    gradient: 'from-red-500 to-pink-500',
    backgroundImage: '/sports/baseball.jpg',
    gridClass: 'col-span-1 row-span-2',
    textSize: 'text-5xl mb-3'
  },
  {
    name: 'Golf',
    searchTerm: 'golf',
    emoji: '⛳',
    gradient: 'from-green-600 to-teal-600',
    backgroundImage: '/sports/golf.jpg',
    gridClass: 'col-span-1 row-span-1',
    textSize: 'text-4xl mb-2'
  },
  {
    name: 'Running',
    searchTerm: 'running',
    emoji: '🏃',
    gradient: 'from-purple-500 to-violet-500',
    backgroundImage: '/sports/running.jpg',
    gridClass: 'col-span-1 row-span-1',
    textSize: 'text-4xl mb-2'
  },
  {
    name: 'Boxing',
    searchTerm: 'boxing',
    emoji: '🥊',
    gradient: 'from-red-600 to-orange-600',
    backgroundImage: '/sports/boxing.jpg',
    gridClass: 'col-span-2 row-span-1',
    textSize: 'text-5xl mb-3'
  },
  {
    name: 'Yoga',
    searchTerm: 'yoga',
    emoji: '🧘',
    gradient: 'from-purple-600 to-pink-600',
    backgroundImage: '/sports/yoga.jpg',
    gridClass: 'col-span-1 row-span-1',
    textSize: 'text-4xl mb-2'
  },
  {
    name: 'Wrestling',
    searchTerm: 'wrestling',
    emoji: '🤼',
    gradient: 'from-slate-600 to-slate-700',
    backgroundImage: '/sports/wrestling.jpg',
    gridClass: 'col-span-1 row-span-1',
    textSize: 'text-4xl mb-2'
  },
  {
    name: 'Cycling',
    searchTerm: 'cycling',
    emoji: '🚴',
    gradient: 'from-neutral-700 to-neutral-500',
    backgroundImage: '/sports/cycling.jpg',
    gridClass: 'col-span-2 row-span-1',
    textSize: 'text-5xl mb-3'
  },
  {
    name: 'Volleyball',
    searchTerm: 'volleyball',
    emoji: '🏐',
    gradient: 'from-yellow-600 to-orange-600',
    backgroundImage: '/sports/volleyball.jpg',
    gridClass: 'col-span-1 row-span-1',
    textSize: 'text-4xl mb-2'
  },
  {
    name: 'Martial Arts',
    searchTerm: 'martial-arts',
    emoji: '🥋',
    gradient: 'from-indigo-600 to-purple-600',
    backgroundImage: '/sports/martial-arts.jpg',
    gridClass: 'col-span-1 row-span-1',
    textSize: 'text-4xl mb-2'
  },
  {
    name: 'Gymnastics',
    searchTerm: 'gymnastics',
    emoji: '🤸',
    gradient: 'from-pink-500 to-rose-500',
    backgroundImage: '/sports/gymnastics.jpg',
    gridClass: 'col-span-1 row-span-1',
    textSize: 'text-4xl mb-2'
  },
  {
    name: 'Climbing',
    searchTerm: 'climbing',
    emoji: '🧗',
    gradient: 'from-gray-600 to-gray-700',
    backgroundImage: '/sports/climbing.jpg',
    gridClass: 'col-span-1 row-span-1',
    textSize: 'text-4xl mb-2'
  },
  {
    name: 'Surfing',
    searchTerm: 'surfing',
    emoji: '🏄',
    gradient: 'from-teal-500 to-cyan-600',
    backgroundImage: '/sports/surfing.jpg',
    gridClass: 'col-span-1 row-span-1',
    textSize: 'text-4xl mb-2'
  },
  {
    name: 'Skiing',
    searchTerm: 'skiing',
    emoji: '🎿',
    gradient: 'from-neutral-700 to-neutral-600',
    backgroundImage: '/sports/skiing.jpg',
    gridClass: 'col-span-1 row-span-1',
    textSize: 'text-4xl mb-2'
  },
  {
    name: 'Track & Field',
    searchTerm: 'track-field',
    emoji: '🏃‍♂️',
    gradient: 'from-amber-500 to-orange-500',
    backgroundImage: '/sports/track-field.jpg',
    gridClass: 'col-span-1 row-span-1',
    textSize: 'text-4xl mb-2'
  },
  {
    name: 'Hockey',
    searchTerm: 'hockey',
    emoji: '🏒',
    gradient: 'from-neutral-700 to-neutral-600',
    backgroundImage: '/sports/hockey.jpg',
    gridClass: 'col-span-1 row-span-1',
    textSize: 'text-4xl mb-2'
  },
  {
    name: 'CrossFit',
    searchTerm: 'crossfit',
    emoji: '🏋️',
    gradient: 'from-red-700 to-orange-700',
    backgroundImage: '/sports/crossfit.jpg',
    gridClass: 'col-span-2 row-span-2',
    textSize: 'text-6xl mb-4'
  },
  {
    name: 'Badminton',
    searchTerm: 'badminton',
    emoji: '🏸',
    gradient: 'from-lime-500 to-green-500',
    backgroundImage: '/sports/badminton.jpg',
    gridClass: 'col-span-1 row-span-1',
    textSize: 'text-4xl mb-2'
  },
  {
    name: 'Football',
    searchTerm: 'football',
    emoji: '🏈',
    gradient: 'from-amber-700 to-orange-800',
    backgroundImage: '/sports/football.jpg',
    gridClass: 'col-span-1 row-span-1',
    textSize: 'text-4xl mb-2'
  }
];

export default function DynamicSportsMosaic() {
  const [sportsCounts, setSportsCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoachCounts = async () => {
      try {
        // Fetch all coaches from Firebase
        const coachesCollection = collection(db, 'coaches');
        const snapshot = await getDocs(coachesCollection);
        
        // Count coaches by sport
        const counts: Record<string, number> = {};
        
        // Initialize all sports counts to 0
        SPORTS_CONFIG.forEach(sport => {
          counts[sport.searchTerm] = 0;
        });
        
        // Count coaches for each sport
        snapshot.docs.forEach(doc => {
          const coach = doc.data();
          const sports = coach.sports || [];
          
          // For each sport the coach has, increment the count
          sports.forEach((sport: string) => {
            const sportLower = sport.toLowerCase();
            
            // Map common sport variations to our search terms
            const sportMapping: Record<string, string> = {
              'basketball': 'basketball',
              'soccer': 'soccer',
              'tennis': 'tennis',
              'swimming': 'swimming',
              'baseball': 'baseball',
              'golf': 'golf',
              'running': 'running',
              'boxing': 'boxing',
              'yoga': 'yoga',
              'wrestling': 'wrestling',
              'cycling': 'cycling',
              'volleyball': 'volleyball',
              'martial arts': 'martial-arts',
              'karate': 'martial-arts',
              'judo': 'martial-arts',
              'taekwondo': 'martial-arts',
              'gymnastics': 'gymnastics',
              'climbing': 'climbing',
              'rock climbing': 'climbing',
              'surfing': 'surfing',
              'skiing': 'skiing',
              'snowboarding': 'skiing',
              'track and field': 'running',
              'athletics': 'running',
              'hockey': 'hockey',
              'ice hockey': 'hockey',
              'crossfit': 'crossfit',
              'cross training': 'crossfit',
              'badminton': 'badminton',
              'football': 'football',
              'american football': 'football'
            };
            
            // Find matching sport
            Object.entries(sportMapping).forEach(([key, value]) => {
              if (sportLower.includes(key) && counts[value] !== undefined) {
                counts[value]++;
              }
            });
          });
        });
        
        setSportsCounts(counts);
      } catch (error) {
        console.error('Error fetching coach counts:', error);
        // Fallback to showing 0 for all sports if there's an error
        const fallbackCounts: Record<string, number> = {};
        SPORTS_CONFIG.forEach(sport => {
          fallbackCounts[sport.searchTerm] = 0;
        });
        setSportsCounts(fallbackCounts);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachCounts();
  }, []);

  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="bg-black relative">
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
            {SPORTS_CONFIG.map((sport) => (
              <div key={sport.searchTerm} className="group relative min-h-[16rem] sm:min-h-[18rem] md:min-h-[20rem] rounded-xl overflow-hidden bg-neutral-900/80">
                <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 relative">
      <div className="w-full">
        {/* Minimal sport cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
          {SPORTS_CONFIG.map((sport) => (
            <Link key={sport.searchTerm} href={`/search?q=${sport.searchTerm}`} className="group relative h-64 sm:h-72 md:h-80 rounded-xl overflow-hidden transition-shadow">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${sport.backgroundImage})` }} />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
              <div className="relative z-10 h-full w-full p-4 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl leading-none">{sport.emoji}</span>
                  <h3 className="text-sm font-semibold tracking-wide">{sport.name}</h3>
                </div>
                <div className="self-start text-[10px] px-2 py-1 rounded-full bg-white/15 text-white font-medium">
                  {formatCount(sportsCounts[sport.searchTerm] || 0)} coaches
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}