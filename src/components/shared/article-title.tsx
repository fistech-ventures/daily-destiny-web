import React from "react";

interface ArticleTitleProps {
  article: {
    title: string;
    hanger?: string;
    shoulder?: string;
  };
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span";
  style?: React.CSSProperties;
}

export default function ArticleTitle({
  article,
  className = "",
  as: Tag = "span",
  style,
}: ArticleTitleProps) {
  return (
    <Tag className={className} style={style}>
      {article.shoulder && (
        <span className="block text-base uppercase tracking-wider text-blue-600 font-bold mb-1.5">
          {article.shoulder}
        </span>
      )}
      <span>{article.title}</span>
      {article.hanger && (
        <span className="block py-4 text-sm uppercase tracking-wider text-blue-600 font-semibold">
          {article.hanger}
        </span>
      )}
    </Tag>
  );
}
