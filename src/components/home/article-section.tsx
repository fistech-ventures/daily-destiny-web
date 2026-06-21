// import React from "react";
// import Link from "next/link";
// import { getArticles } from "@/lib/api";
// import { Article } from "@/lib/types";

// const FeaturedNewsCard = ({ article }: { article: Article }) => (
//   <div className="col-span-8">
//     <Link href={`/news/${article.category?.slug || "others"}/${article.code}`}>
//       <div className="bg-white grid grid-cols-1 md:grid-cols-2">
//         <div className="">
//           <img
//             src={article.coverImage}
//             alt={article.title}
//             className="w-full aspect-video object-cover"
//           />
//           <p className="text-base text-gray-500 p-2">
//             {article.coverImageCredit}
//           </p>
//         </div>
//         <div className="px-4">
//           <h1 className="text-lg md:text-2xl font-bold mb-2">
//             {article.title}
//           </h1>
//           <p className="text-gray-600 text-sm md:text-base">
//             {article.excerpt}
//           </p>
//         </div>
//       </div>
//     </Link>
//   </div>
// );

// const SideNewsCard = ({ article }: { article: Article }) => (
//   <div className="flex flex-col md:flex-row items-start border-b border-gray-200 py-2">
//     <div className="flex-1">
//       <Link
//         href={`/news/${article.category?.slug || "others"}/${article.code}`}
//       >
//         <div className="grid grid-cols-3 items-start">
//           <h2 className="col-span-2 lg:col-span-3 text-xs md:text-base font-semibold ">
//             {article.title}
//           </h2>
//           <img
//             src={article.coverImage}
//             alt={article.title}
//             className="col-span-1 w-full aspect-video object-contain lg:hidden md:w-20 md:h-16"
//           />
//         </div>
//         <p className="text-sm text-gray-500 mt-1 line-cl-3">{article.excerpt}</p>
//       </Link>
//     </div>
//     <img
//       src={article.coverImage}
//       alt={article.title}
//       className="w-full aspect-video object-contain hidden lg:block md:w-20 md:h-16 mt-2 md:mt-0 md:ml-4"
//     />
//   </div>
// );

// const NewsGrid = ({ articles }: { articles: Article[] }) => (
//   <div className="grid grid-cols-1 md:grid-cols-2 col-span-12 border-b border-gray-300">
//     {articles.map((article, index: number) => (
//       <Link
//         key={article.id}
//         href={`/news/${article.category?.slug || "others"}/${article.code}`}
//       >
//         <div
//           className={`${
//             index === 0 ? "md:pr-2 md:border-r md:border-gray-300" : "md:pl-2"
//           }`}
//         >
//           <img
//             src={article.coverImage}
//             alt={article.title}
//             className="w-full aspect-video object-contain"
//           />
//           <div className="p-2">
//             <h3 className="text-sm md:text-md font-semibold mb-1">
//               {article.title}
//             </h3>
//             <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
//               {article.excerpt}
//             </p>
//           </div>
//         </div>
//       </Link>
//     ))}
//   </div>
// );

// export default async function ArticleSection() {
//   // Get featured news
//   const { data: articles } = await getArticles({
//     page: 1,
//     limit: 16,
//     isFeatured: true,
//     sortBy: "position",
//     sortOrder: "ASC",
//   });

//   // Get exclusive articles
//   const { data: exclusiveArticles } = await getArticles({
//     page: 1,
//     limit: 7,
//     isExclusive: true,
//     sortBy: "position",
//     sortOrder: "ASC",
//   });

//   return (
//     <section className="!p-0">
//       <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
//         {/* Left Sidebar - Moves to 2nd position on mobile, resets on desktop */}
//         <div className="col-span-12 md:col-span-3 md:pr-4 order-2 md:order-1">
//           {articles.slice(0, 8).map((article: Article) => (
//             <SideNewsCard key={article.id} article={article} />
//           ))}
//         </div>

//         {/* Center Main Column - Jumps to the top on mobile, sits 2nd on desktop */}
//         <div className="col-span-12 md:col-span-6 md:px-4 md:border-x-2 md:border-gray-300 order-1 md:order-2">
//           {/* {articles[0] && (
//             <div className=" border-b border-gray-300">
//               <FeaturedNewsCard article={exclusiveArticles[0]} />
//             </div>
//           )} */}
//           <div className="pt-4">
//             <NewsGrid articles={exclusiveArticles.slice(1, 3)} />
//           </div>
//           <div className="pt-4">
//             <NewsGrid articles={exclusiveArticles.slice(3, 5)} />
//           </div>
//           <div className="pt-4">
//             <NewsGrid articles={exclusiveArticles.slice(5, 7)} />
//           </div>
//         </div>

//         {/* Right Sidebar - Stays at the bottom on mobile, sits 3rd on desktop */}
//         <div className="col-span-12 md:col-span-3 md:pl-4 order-3">
//           {articles.slice(8, 18).map((article: Article) => (
//             <SideNewsCard key={article.id} article={article} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

import React from "react";
import Link from "next/link";
import { getArticles } from "@/lib/api";
import { Article } from "@/lib/types";

interface FeaturedSectionProps {
  article: Article;
}

interface GridCardProps {
  article: Article;
}

interface ExclusiveCardProps {
  article: Article;
}

interface ExclusiveSmallCardProps {
  article: Article;
}

// Featured Section - 1 Big Image + Title & Description
const FeaturedSection: React.FC<FeaturedSectionProps> = ({ article }) => (
  <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
      {/* Left: 1 Big Image (col-span-2) */}
      <div className="col-span-2 p-3 bg-gray-50 flex justify-center">
        <Link
          href={`/news/${article.category?.slug || "others"}/${article.code}`}
        >
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover rounded cursor-pointer hover:opacity-80"
          />
        </Link>
      </div>

      {/* Right: Title & Description (col-span-1) */}
      <div className="col-span-1 p-6 flex flex-col border-l border-gray-200">
        <Link
          href={`/news/${article.category?.slug || "others"}/${article.code}`}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-4 hover:text-blue-600">
            {article.title}
          </h1>
        </Link>
        <p className="text-sm md:text-base text-gray-600 line-clamp-4">
          {article.excerpt}
        </p>
      </div>
    </div>
  </div>
);

// Grid Card - Image on top, Title below
const GridCard: React.FC<GridCardProps> = ({ article }) => (
  <Link href={`/news/${article.category?.slug || "others"}/${article.code}`}>
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
      <img
        src={article.coverImage}
        alt={article.title}
        className="w-full aspect-video object-cover hover:opacity-90"
      />
      <div className="p-4">
        <h3 className="text-sm md:text-base font-bold line-clamp-3 hover:text-blue-600">
          {article.title}
        </h3>
      </div>
    </div>
  </Link>
);

// Big Card for sidebar top
const BigCard: React.FC<ExclusiveCardProps> = ({ article }) => (
  <Link href={`/news/${article.category?.slug || "others"}/${article.code}`}>
    <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
      <img
        src={article.coverImage}
        alt={article.title}
        className="w-full aspect-video object-cover hover:opacity-90"
      />
      <div className="p-4">
        <h3 className="text-sm md:text-base font-bold line-clamp-2 hover:text-blue-600">
          {article.title}
        </h3>
      </div>
    </div>
  </Link>
);

// Small Cards
const SmallCard: React.FC<ExclusiveSmallCardProps> = ({ article }) => (
  <Link href={`/news/${article.category?.slug || "others"}/${article.code}`}>
    <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow p-3 flex gap-3">
      {/* Thumbnail */}
      <div className="shrink-0 w-20 h-16">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover rounded hover:opacity-90"
        />
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-semibold line-clamp-2 hover:text-blue-600">
          {article.title}
        </h4>
      </div>
    </div>
  </Link>
);

export default async function ArticleSection(): Promise<React.ReactNode> {
  try {
    const response = await getArticles({
      page: 1,
      limit: 50,
      sortBy: "position",
      sortOrder: "ASC",
    });

    const allArticles: Article[] = response.data || [];

    const featuredArticles = allArticles.filter(a => a.isFeatured === true);
    const exclusiveArticles = allArticles.filter(a => a.isExclusive === true);
    const regularArticles = allArticles.filter(
      a => a.isExclusive !== true && a.isFeatured !== true,
    );

    console.log("Featured:", featuredArticles.length);
    console.log("Exclusive:", exclusiveArticles.length);
    console.log("Regular:", regularArticles.length);

    const exclusiveTop = exclusiveArticles[0];
    const gridArticles = regularArticles.slice(0, 12);

    const featuredTop = featuredArticles[0];
    const featuredSmall = featuredArticles.slice(1, 12);

    return (
      <section className="!p-0">
        <div className="flex flex-col lg:flex-row gap-5 px-4">
          <div className="w-full lg:w-3/4 flex flex-col gap-5">
            {exclusiveTop ? (
              <FeaturedSection article={exclusiveTop} />
            ) : (
              <div className="bg-gray-100 h-48 rounded flex items-center justify-center text-gray-500">
                No exclusive articles
              </div>
            )}

            {gridArticles.length > 0 ? (
              <div>
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {gridArticles.slice(0, 3).map(article => (
                    <GridCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {gridArticles.slice(3, 6).map(article => (
                    <GridCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {gridArticles.slice(6, 9).map(article => (
                    <GridCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gridArticles.slice(9, 12).map(article => (
                    <GridCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No articles available
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR - 1/4 width */}
          <div className="w-full lg:w-1/4 flex flex-col gap-5">
            {/* FEATURED TOP - BIG */}
            {featuredTop ? (
              <BigCard article={featuredTop} />
            ) : (
              <div className="bg-gray-100 h-48 rounded flex items-center justify-center text-gray-500">
                No featured articles
              </div>
            )}

            {/* FEATURED SMALL - STACK */}
            {featuredSmall.length > 0 && (
              <div className="flex flex-col gap-3">
                {featuredSmall.map(article => (
                  <SmallCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error loading articles:", error);
    return (
      <section className="!p-0">
        <div className="text-center py-10">
          <p className="text-red-500">Error loading articles</p>
          <p className="text-gray-500 text-sm">{String(error)}</p>
        </div>
      </section>
    );
  }
}
