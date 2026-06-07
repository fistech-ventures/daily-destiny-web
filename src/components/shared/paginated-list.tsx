"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown } from "lucide-react";

interface PaginatedListProps<T> {
  initialData: T[];
  initialMeta?: { total?: number; page?: number; limit?: number };
  fetchData: (
    page: number,
  ) => Promise<
    | { data: T[]; meta?: { total?: number; page?: number; limit?: number } }
    | T[]
  >;
  renderItem: (item: T, index: number) => React.ReactNode;
  listClassName?: string;
  wrapperClassName?: string;
  noDataMessage?: string;
}

export default function PaginatedList<T>({
  initialData,
  initialMeta,
  fetchData,
  renderItem,
  listClassName = "grid grid-cols-3 gap-6",
  wrapperClassName = "w-full",
  noDataMessage = "কোনো ডেটা পাওয়া যায়নি",
}: PaginatedListProps<T>) {
  const [items, setItems] = useState<T[]>(initialData || []);
  const [page, setPage] = useState(initialMeta?.page || 1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(initialMeta?.total || 0);

  const hasMore = total > 0 ? items.length < total : false;

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const response = await fetchData(nextPage);

      let newItems: T[] = [];
      let newMeta:
        | { total?: number; page?: number; limit?: number }
        | undefined
        | null = null;

      if (Array.isArray(response)) {
        newItems = response;
      } else if (
        response &&
        typeof response === "object" &&
        Array.isArray(
          (
            response as {
              data: T[];
              meta?: { total?: number; page?: number; limit?: number };
            }
          ).data,
        )
      ) {
        newItems = (
          response as {
            data: T[];
            meta?: { total?: number; page?: number; limit?: number };
          }
        ).data;
        newMeta = (
          response as {
            data: T[];
            meta?: { total?: number; page?: number; limit?: number };
          }
        ).meta;
      }

      setItems(prev => [...prev, ...newItems]);
      setPage(nextPage);

      if (newMeta?.total !== undefined) {
        setTotal(newMeta.total);
      }
    } catch (error) {
      console.error("Failed to load more:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={wrapperClassName}>
      <div className={listClassName}>
        {items.length > 0 ? (
          items.map((item, index) => renderItem(item, index))
        ) : (
          <div className="py-12 text-center text-gray-500 col-span-full">
            <p>{noDataMessage}</p>
          </div>
        )}
      </div>

      {hasMore && items.length > 0 && (
        <div className="py-8 flex justify-center border-t border-gray-100 bg-gray-50/50 mt-6 rounded-xl">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            variant="outline"
            className="group h-12 px-8 rounded-full bg-primary hover:bg-primary/80 border-none text-primary-foreground font-bold text-lg transition-all active:scale-95 shadow-sm"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <ChevronDown className="mr-2 h-5 w-5 transition-transform group-hover:translate-y-0.5" />
            )}
            আরও দেখুন
          </Button>
        </div>
      )}
    </div>
  );
}
