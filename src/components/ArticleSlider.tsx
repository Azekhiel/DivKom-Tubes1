'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ArticleSlider({ articles }: { articles: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? articles.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === articles.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (!articles || articles.length === 0) return <div>Belum ada artikel.</div>;

  const currentArticle = articles[currentIndex];

  return (
    <div className="w-full max-w-3xl mx-auto px-4"> 
      
      <div className="relative group">
        {/* Card buat preview artikel */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 h-[850px] flex flex-col">
          {/* Komponen Gambar */}
          <div className="h-[70%] w-full bg-gray-100 relative overflow-hidden">
             <img 
               src={currentArticle.coverImage.url} 
               alt={currentArticle.title}
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
             />
          </div>

          {/* Penjelasan Preview Konten */}
          <div className="h-[30%] p-6 flex flex-col items-center justify-center text-center">
             
             <span className="text-xs font-bold text-blue-600 mb-2 tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full">
                Artikel {currentIndex + 1} / {articles.length}
             </span>
             
             <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 leading-tight line-clamp-2 px-4">
               {currentArticle.title}
             </h2>
             
             <p className="text-gray-500 text-sm mb-6 font-medium">
               {new Date(currentArticle.date).toLocaleDateString('id-ID', { dateStyle: 'full' })}
             </p>

             <Link 
               href={`/blog/${currentArticle.slug}`}
               className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-all transform hover:-translate-y-1 shadow-lg"
             >
               Baca
             </Link>
          </div>
        </div>

        <button 
          onClick={prevSlide}
          className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 bg-gray-200 text-black p-4 rounded-full shadow-xl hover:bg-gray-100 transition border border-gray-100 z-10"
        >
          Prev
        </button>

        <button 
          onClick={nextSlide}
          className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 bg-gray-200 text-black p-4 rounded-full shadow-xl hover:bg-gray-100 transition border border-gray-100 z-10"
        >
          Next
        </button>

      </div>
    </div>
  );
}