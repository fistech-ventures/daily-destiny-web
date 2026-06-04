import { Article, GlobalConfig } from "./types";
import { SchemaGenerator } from "./schema";

export function buildArticleLdJson(article: Article, config: GlobalConfig) {
  return SchemaGenerator.article(article, config);
}
