import React, { Suspense } from "react";
import BlinkingLiveButton from "./live-button";
import LiveClock from "./live-clock";
import CategorySidebar from "./category-sidebar";
import { getAllcategories } from "@/lib/api";

export default async function HomeSidebar() {
  let categories = [];
  try {
    const res = await getAllcategories();
    categories = res?.data || [];
  } catch (error) {
    console.error("Failed to fetch categories for sidebar:", error);
  }

  return (
    <aside className="">
      <div className="hidden lg:block">
        <BlinkingLiveButton />
        <LiveClock isBorderShadow={true} />
      </div>
      <div className="hidden lg:block">
        <Suspense fallback={null}>
          <CategorySidebar categories={categories} />
        </Suspense>
      </div>
    </aside>
  );
}
