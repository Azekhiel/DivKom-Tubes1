'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md mx-auto mb-8 relative z-10">
      <div className="relative group">
        <input
          type="text"
          placeholder="Cari konten"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 shadow-lg transition-all text-gray-800"
        />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors shadow-md"
        >
          Cari
        </button>
      </div>
    </form>
  );
}