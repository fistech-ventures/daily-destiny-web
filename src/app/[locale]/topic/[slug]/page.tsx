import TopicListClient from "@/components/topic/topic-list-client";
import { getArticles } from "@/lib/api";
import { generateFallbackMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  return {
    ...generateFallbackMetadata({ path: `/topic/${decodedSlug}`, locale }),
    title: `${decodedSlug} | Daily Destiny`,
    description: `Latest news about ${decodedSlug} - Trusted | Timely | True`,
  };
}

export default async function TpoicPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const response = await getArticles({ topics: [decodedSlug], limit: 10 });
  const articles = response?.data || [];
  const meta = response?.meta;

  return (
    <div>
      <h2 className="lg:text-2xl text-xl font-bold">{decodedSlug}</h2>
      <div className="mt-4">
        <TopicListClient
          initialData={articles}
          initialMeta={meta}
          topic={decodedSlug}
        />
      </div>
    </div>
  );
}
