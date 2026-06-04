export type SeoMetaData = {
  title: string;
  description: string;
  keywords: string[];
  image: string;
};

export interface Category {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  title: string;
  titleBn: string;
  slug: string;
  slugBn: string;
  subCategories: Category[];
  seoMetaData?: SeoMetaData;
}

export interface ArticleQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isActive?: boolean;
  isExclusive?: boolean;
  isFeatured?: boolean;
  categoryId?: string;
  subCategoryId?: string;
  authorId?: string;
  type?: "news" | "poll" | "series" | "stories" | "video" | "photo";
  status?: "Drafted" | "Published" | "Archived";
  topics?: string[];
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface Author {
  name: string;
  nameBn: string;
}

export interface Article {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  code: string;
  slug: string;
  type: string;
  coverImage: string;
  excerpt: string;
  details: string;
  language: "English" | "Bengali" | string;
  status: "Published" | "Drafted" | "Archived";
  date: string;
  isExclusive: boolean;
  isFeatured: boolean;
  tags: string[];
  author: Author;
  category: Category;
  medias?: ArticleMedia[];
  coverImageCredit: string;
  seoMetaData?: SeoMetaData;
}

export interface ArticleMedia {
  id?: string;
  title?: string;
  caption?: string;
  credit?: string;
  altText?: string;
  url?: string;
  source?: string;
  mimetype?: string;
  extension?: string;
  key?: string;
}

export interface CategoryQueryParam {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isActive?: boolean;
}

export interface MarketPrice {
  title: string;
  titleBn: string;
  priceRange: string;
  image: string;
}

export interface GlobalConfig {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  identity: {
    icon: string;
    logo: string;
    name: string;
    currency: string;
    phoneCode: string;
    socialUrls: Record<string, string>;
    initialName: string;
    needWebView: boolean;
    otpExpiresInMin: number;
    themePrimaryColor: string;
    themeSecondayColor: string;
    allowUserRegistration: boolean;
    userRegistrationVerificationRequired: boolean;
  };
  trackingCodes: {
    gtm_id?: string;
    gtag_id?: string;
    [key: string]: string | undefined;
  };
  trackingScripts: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: any;
}
