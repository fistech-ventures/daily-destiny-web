import React from "react";

interface ArticleTitleProps {
  article: {
    title: string;
    hanger?: string;
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
      {article.hanger && (
        <span className="text-red-600 font-semibold mr-1">
          {article.hanger}{" "}
        </span>
      )}
      {article.title}
    </Tag>
  );
}
