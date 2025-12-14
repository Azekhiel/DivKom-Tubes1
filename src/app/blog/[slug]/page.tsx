import { request } from "@/lib/datocms";
import { StructuredText } from "react-datocms";
import Link from "next/link";
import { notFound } from "next/navigation";

const POST_QUERY = `
query BlogPost($slug: String) {
  # Artikel yang sedang dibuka
  article(filter: {slug: {eq: $slug}}) {
    id
    title
    date
    coverImage {
      url
    }
    content {
      value
    }
    # Asumsi nama field di DatoCMS adalah 'tags'
    tags {
      title
    }
  }

  # Ambil artikel lain untuk dicari yang mirip (limit 100 biar gak berat)
  allArticles(orderBy: date_DESC, first: 100) {
    id
    title
    slug
    date
    coverImage {
      url
    }
    tags {
      title
    }
  }
}
`;

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const data: any = await request({
    query: POST_QUERY,
    variables: { slug: slug },
  });

  const article = data.article;
  const allArticles = data.allArticles;

  if (!article) return notFound();

  // Simple Tag Matfching
  const currentTags = article.tags || [];
  const currentTagTitles = currentTags.map((t: any) => t.title);

  let relatedPosts = allArticles
    .filter((a: any) => a.id !== article.id) 
    .map((a: any) => {
      // Hitung jumlah tag yang sama
      const otherTags = a.tags || [];
      const matchCount = otherTags.filter((t: any) => currentTagTitles.includes(t.title)).length;
      return { ...a, matchCount };
    })
    .filter((a: any) => a.matchCount > 0)
    // Sort pake jumlah tag lalu tanggal
    .sort((a: any, b: any) => {
      if (b.matchCount !== a.matchCount) {
        return b.matchCount - a.matchCount;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime(); 
    });

  const recommendations = relatedPosts.slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <Link href="/" className="text-blue-500 mb-6 block hover:underline">
        &larr; Kembali
      </Link>

      <h1 className="text-4xl font-bold mb-2">{article.title || "Tanpa Judul"}</h1>
      <p className="text-gray-500 mb-6">
        {article.date ? new Date(article.date).toLocaleDateString("id-ID", { dateStyle: "full" }) : "-"}
      </p>

      {currentTags.length > 0 && (
        <div className="flex gap-2 mb-6">
          {currentTags.map((tag: any, index: number) => (
            <Link 
                key={index} 
                href={`/tags/${tag.title}`}
                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-100 hover:text-blue-600 transition-colors"
            >
              #{tag.title}
            </Link>
          ))}
        </div>
      )}

      {article.coverImage?.url && (
        <img
          src={article.coverImage.url}
          alt={article.title}
          className="w-full h-auto rounded-xl mb-8 shadow-sm"
        />
      )}

      <div className="flex flex-col gap-4 text-lg leading-relaxed text-gray-800 border-b pb-12 mb-12">
        <StructuredText data={article.content} />
      </div>

      {/* Rekomendasi artikel */}
      {recommendations.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-6">Cek koleksi stiker relevan lain</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec: any) => (
              <Link href={`/blog/${rec.slug}`} key={rec.id} className="group">
                <div className="bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <div className="h-48 overflow-hidden bg-gray-100">
                    {/* Safety check image untuk rekomendasi */}
                    {rec.coverImage?.url ? (
                      <img
                        src={rec.coverImage.url}
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h4 className="font-bold text-lg mb-2 group-hover:text-blue-600 line-clamp-2">
                      {rec.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-auto">
                      {new Date(rec.date).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Fallback kalo gak ada rekomendasi */}
      {recommendations.length === 0 && (
        <div className="mt-10 text-center text-gray-400 italic">
          Belum ada stiker lain yang mirip nih.
        </div>
      )}
    </div>
  );
}