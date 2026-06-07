import { Article, GlobalConfig } from "@/lib/types";

type JsonLd = Record<string, unknown>;

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface OrganizationProps {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

interface WebsiteProps {
  name: string;
  url: string;
  description?: string;
  searchUrl?: string;
}

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://dailydestiny.com";
}

export const SchemaGenerator = {
  breadcrumb(items: BreadcrumbItem[]): JsonLd {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  },

  organization(props: OrganizationProps): JsonLd {
    const { name, url, logo, description, sameAs } = props;
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name,
      url,
      ...(logo ? { logo } : {}),
      ...(description ? { description } : {}),
      ...(sameAs?.length ? { sameAs } : {}),
    };
  },

  website(props: WebsiteProps): JsonLd {
    const { name, url, description, searchUrl } = props;
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name,
      url,
      ...(description ? { description } : {}),
      ...(searchUrl
        ? {
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${searchUrl}?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }
        : {}),
    };
  },

  article(article: Article, config: GlobalConfig): JsonLd {
    const siteUrl = getSiteUrl();
    const image = article.coverImage ? [article.coverImage] : [];

    return {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${siteUrl}/news/${article.category?.slug}/${article.code}`,
      },
      headline: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      image,
      author: {
        "@type": "Person",
        name: article.author?.name || "Daily Destiny",
      },
      publisher: {
        "@type": "Organization",
        name: config.identity.name,
        logo: {
          "@type": "ImageObject",
          url: config.identity.logo,
        },
      },
      datePublished: article.date || article.createdAt,
      dateModified: article.updatedAt,
      keywords: article.tags || [],
      inLanguage: article.language === "Bengali" ? "bn" : "en",
      articleSection: article.category?.title,
    };
  },
};

