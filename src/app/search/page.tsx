import { request, ALL_CONTENT_QUERY } from "@/lib/datocms";
import Link from "next/link";
import Fuse from "fuse.js"; 
import SearchBar from "@/components/SearchBar";

export const revalidate = 60; 

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const { q } = await searchParams;
  const decodedQuery = decodeURIComponent(q || "");
  const data: any = await request({ query: ALL_CONTENT_QUERY });
  const articles = data.allArticles || [];

  let results = [];
  
  if (!decodedQuery) {
    // Kalo gak ada query, balikin semua
    results = articles;
  } else {
    // Config buat fuzzy
    const fuse = new Fuse(articles, {
      includeScore: true,
      keys: [
        'title', 
        'tags.title', 
        'content.value.document.children.children.value' 
      ],
      threshold: 0.4, // Tuning lagi aja nanti
    });

    results = fuse.search(decodedQuery).map(result => result.item);
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-blue-500 mb-6 block hover:underline">&larr; Kembali ke Home</Link>
        
        <div className="mb-8">
            <SearchBar initialQuery={decodedQuery} />
        </div>

        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          {decodedQuery ? (
            <>Hasil pencarian: <span className="text-blue-600">"{decodedQuery}"</span></>
          ) : (
            "Semua Koleksi"
          )}
        </h1>
        
        {/* Buat cek ada hasil apa enggak */}
        {results.length === 0 ? (
           <div className="text-center py-20 text-gray-500 italic bg-white rounded-2xl border">
             Waduh, gak nemu stiker yang dicari nih.
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item: any) => (
              <Link href={`/blog/${item.slug}`} key={item.id} className="group">
                <div className="bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <div className="h-48 overflow-hidden bg-gray-100">
                    {/* Safety check image */}
                    {item.coverImage?.url ? (
                      <img
                        src={item.coverImage.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 line-clamp-2">{item.title}</h3>
                    <div className="flex gap-2 flex-wrap mt-2">
                        {item.tags?.map((t: any, idx: number) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">#{t.title}</span>
                        ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}