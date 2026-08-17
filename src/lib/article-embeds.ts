import { getArticleByCode } from "./api";
import { Article } from "./types";
import { getArticleCategory } from "./utils";

/**
 * Embedded article cards are stored in the article body as plain anchor tags
 * pointing at another article URL, e.g.:
 *
 *   <a target="_blank" href="http://host/bn/news/religion/2608130770">Headline</a>
 *
 * These helpers detect those anchors, fetch the linked article's metadata, and
 * build a styled card (thumbnail + bold headline) to replace the plain link
 * when rendering the article body.
 */

interface ArticleEmbed {
  code: string;
  href: string;
  title: string;
}

// Matches <a ... href=".../news/...">...</a> — href is captured in group 1,
// inner HTML in group 2.
const ARTICLE_LINK_REGEX =
  /<a\b[^>]*?\bhref=["']([^"']*?\/news\/[^"']*?)["'][^>]*>([\s\S]*?)<\/a>/gi;

/** Extracts the numeric article code from a /news/{category}/{code} href. */
function extractArticleCode(href: string): string | null {
  const m = href.match(/\/news\/[^/]+\/(\d+)/);
  return m ? m[1] : null;
}

/** Finds all anchors in the body that link to other articles. */
export function findArticleEmbeds(html: string): ArticleEmbed[] {
  const embeds: ArticleEmbed[] = [];
  const re = new RegExp(ARTICLE_LINK_REGEX.source, "gi");
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const code = extractArticleCode(m[1]);
    if (!code) continue;
    embeds.push({
      code,
      href: m[1],
      title: m[2].replace(/<[^>]*>/g, "").trim(),
    });
  }
  return embeds;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Builds the styled card markup matching the site's horizontal article card. */
function buildEmbedCardHtml(article: Article): string {
  const categorySlug = getArticleCategory(article)?.slug || "others";
  const href = `/news/${categorySlug}/${article.code}`;
  const title = escapeHtml(article.title || "");
  const image = escapeHtml(article.coverImage || "");
  const alt = escapeHtml(article.title || "article");

  return (
    `<div class="article-embed-card not-prose my-4" data-embed-code="${escapeHtml(article.code)}">` +
    `<a href="${href}" class="group flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-2.5 no-underline hover:border-gray-300 hover:shadow-sm transition-all">` +
    `<div class="relative h-16 w-24 sm:h-20 sm:w-32 shrink-0 overflow-hidden rounded-md bg-gray-100">` +
    `<img src="${image}" alt="${alt}" loading="lazy" class="h-full w-full object-cover" />` +
    `</div>` +
    `<h3 class="m-0 text-sm sm:text-base font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors">${title}</h3>` +
    `</a>` +
    `</div>`
  );
}

/**
 * Replaces anchors pointing at other articles in the body with styled embed
 * cards. Linked article metadata is fetched server-side (one request per
 * unique code). If a linked article can't be fetched, the original anchor is
 * kept as-is so the body never breaks.
 */
export async function enrichArticleBodyWithCards(html: string): Promise<string> {
  const embeds = findArticleEmbeds(html);
  if (embeds.length === 0) return html;

  const uniqueCodes = [...new Set(embeds.map((e) => e.code))];
  const articles = new Map<string, Article>();
  await Promise.all(
    uniqueCodes.map(async (code) => {
      try {
        const res = await getArticleByCode(code);
        if (res?.data) articles.set(code, res.data);
      } catch {
        // Keep the original anchor for links that fail to resolve.
      }
    }),
  );

  const re = new RegExp(ARTICLE_LINK_REGEX.source, "gi");
  let result = "";
  let cursor = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(html)) !== null) {
    const code = extractArticleCode(m[1]);
    if (!code) continue;

    const start = m.index;
    const end = start + m[0].length;

    // Drop <br> tags hugging the anchor so the card sits cleanly between
    // paragraphs instead of leaving stray line breaks.
    const tailAfter = html.slice(end);
    const cleanedAfter = tailAfter.replace(/^\s*(?:<br\s*\/?>)+/i, "");
    const removedCount = tailAfter.length - cleanedAfter.length;

    result += html.slice(cursor, start).replace(/(?:<br\s*\/?>\s*)+$/i, "");

    const article = articles.get(code);
    result += article ? buildEmbedCardHtml(article) : m[0];

    cursor = end + removedCount;
  }

  result += html.slice(cursor);
  return result;
}
