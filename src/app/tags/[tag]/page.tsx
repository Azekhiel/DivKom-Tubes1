import { request, ALL_CONTENT_QUERY } from "@/lib/datocms";
import Link from "next/link";

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const data: any = await request({
    query: ALL_CONTENT_QUERY,
  });

  const allArticles = data.allArticles || [];
  const articles = allArticles.filter((article: any) => 
    article.tags.some((t: any) => t.title === decodedTag)
  );

  if (!articles || articles.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Tag "{decodedTag}" gak ketemu</h1>
        <Link href="/" className="text-blue-500 hover:underline">Balik ke Home aja</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-blue-500 mb-6 block hover:underline">&larr; Kembali</Link>
        <div className="mb-8 border-b pb-4">
            <h1 className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">Kategori</h1>
            <h2 className="text-4xl font-bold text-gray-900">#{decodedTag}</h2>
            <p className="text-gray-500 mt-2">Jumlah Artikel ada {articles.length} di tag ini</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((rec: any) => (
              <Link href={`/blog/${rec.slug}`} key={rec.id} className="group">
                <div className="bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <div className="h-48 overflow-hidden bg-gray-100">
                   {rec.coverImage?.url ? (
                      <img src={rec.coverImage.url} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (<div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>)}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h4 className="font-bold text-lg mb-2 group-hover:text-blue-600 line-clamp-2">{rec.title}</h4>
                    <p className="text-sm text-gray-500 mt-auto">{new Date(rec.date).toLocaleDateString("id-ID")}</p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
}