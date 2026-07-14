import { Article } from "@/lib/types";
import { getArticleCategory } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

// Reused the Article interface provided
export interface Author {
  id: string;
  name: string;
  profileImage?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleMedia {
  id: string;
  url: string;
  type: string;
}

export interface SeoMetaData {
  keywords?: string[];
  canonicalUrl?: string;
}

interface PoliticsSectionProps {
  articles: Article[];
}

const PoliticsSection: React.FC<PoliticsSectionProps> = ({ articles }) => {
  // Ensure we have at least one main article and fallback for missing items
  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 7); // Captures up to 6 articles for the remaining 3x2 grid

  if (!mainArticle) {
    return (
      <div className="text-center py-10 text-gray-500">
        No articles available.
      </div>
    );
  }

  const categorySlug = mainArticle.category?.slug || "politics";
  const title =
    mainArticle.category?.titleBn || mainArticle.category?.title || "রাজনীতি";

  return (
    <div className="w-full flex flex-col gap-4 select-none font-sans mt-2">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <Link
          href={`/${categorySlug}`}
          className="flex items-center gap-1.5 group cursor-pointer"
        >
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-red-600 pb-2 -mb-[10px]">
            {title}
          </h2>
          <ChevronRight className="h-5 w-5 text-[#000058] mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* প্যারেন্ট গ্রিড:
        - মোবাইলে ২টি কলাম (grid-cols-2) 
        - ডেস্কটপে ৫টি কলাম (md:grid-cols-5)
      */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 items-start mt-2">
        {/* বড় কার্ড (Main Hero Card):
          - মোবাইলে ২টি কলামের পুরোটা দখল করবে (col-span-2)
          - ডেস্কটপে ৫টির মধ্যে ২টি কলাম এবং ২টি রো জুড়ে থাকবে (md:col-span-2 md:row-span-2)
        */}
        <div className="col-span-2 md:col-span-2 md:row-span-2 flex flex-col h-full border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-6">
          <a
            href={`/news/${getArticleCategory(mainArticle)?.slug || "politics"}/${mainArticle.code}`}
            className="group block flex-col h-full justify-between"
          >
            <div>
              <div className="overflow-hidden rounded-lg bg-gray-100 aspect-[16/10]">
                <img
                  src={mainArticle.coverImage}
                  alt={mainArticle.title}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                />
              </div>
              <div className="mt-4">
                <h2 className="text-lg md:text-2xl font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors duration-200">
                  {mainArticle.title}
                </h2>
                <p
                  className="mt-3 text-xs md:text-sm text-gray-600 leading-relaxed"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  {mainArticle.excerpt}
                </p>
              </div>
            </div>
          </a>
        </div>

        {/* পার্শ্ববর্তী ছোট ৬টি কার্ড (Side Cards):
          - মোবাইলে প্রতিটি কার্ড ১টি করে কলাম নেবে (col-span-1), ফলে পাশাপাশি ২টি করে সুন্দর কার্ড বসবে।
          - ডেস্কটপে প্রতিটি কার্ড ১টি করে কলাম নেবে (col-span-1), ফলে ৩টি করে ২ সারিতে সাজানো থাকবে।
        */}
        {sideArticles.map((article, index) => {
          const isRow1 = index < 3;
          const isNotLastCol = (index + 1) % 3 !== 0;

          return (
            <div
              key={article.id}
              className={[
                "col-span-1 flex flex-col h-full pb-4 md:pb-0 border-gray-100",
                isRow1 ? "md:border-b md:pb-6" : "md:pt-2",
                isNotLastCol ? "md:border-r md:pr-6" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <a
                href={`/news/${getArticleCategory(article)?.slug || "politics"}/${article.code}`}
                className="group block flex-col justify-between h-full"
              >
                <div>
                  <div className="overflow-hidden rounded-lg bg-gray-100 aspect-[16/10]">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                    />
                  </div>
                  <h3
                    className="mt-3 text-xs sm:text-sm font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors duration-200"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      width: "100%",
                    }}
                  >
                    {article.title}
                  </h3>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PoliticsSection;