import { request } from "@/lib/datocms";
import ArticleSlider from "@/components/ArticleSlider";
import SearchBar from "@/components/SearchBar";
import Link from "next/link"; 

export const dynamic = 'force-dynamic';

const HOMEPAGE_QUERY = `
query HomePage {
  allArticles(orderBy: date_DESC) {
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

export default async function Home() {
  const data: any = await request({ query: HOMEPAGE_QUERY });
  const articles = data.allArticles;

  // Buat ekstrak tag unik dari artike
  const allTags = Array.from(new Set(
    articles.flatMap((article: any) => article.tags.map((t: any) => t.title))
  ));

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-8 text-center w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Kumpulan Stiker WA</h1>
        <p className="text-gray-500 mb-6">Liat penjelasannya yuk</p>
        <SearchBar />
      </div>

      <ArticleSlider articles={articles} />
      
      <div className="mt-16 w-full max-w-3xl text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-4">List tags</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {allTags.map((tag: any, index: number) => (
            <Link 
              key={index} 
              href={`/tags/${tag}`}
              className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}