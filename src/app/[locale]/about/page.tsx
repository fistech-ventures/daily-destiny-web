import enMessages from "@/messages/en.json";
import bnMessages from "@/messages/bn.json";
import { generateFallbackMetadata } from "@/lib/metadata";
import { getPage } from "@/lib/api";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    ...generateFallbackMetadata({ path: "/about", locale }),
    title: "About Us | Daily Destiny",
    description: "Learn more about Daily Destiny and our mission",
  };
}

export default async function AboutPage() {
  const { data: page } = await getPage("about");
  const pageStatus = page?.isActive;

  if (!pageStatus) {
    return notFound();
  }

  const en = enMessages.about;
  const bn = bnMessages.about;

  const sections = [
    { title: "missionTitle", text: "missionText" },
    { title: "visionTitle", text: "visionText" },
    { title: "teamTitle", text: "teamText" },
    { title: "valuesTitle", text: "valuesText" },
    { title: "contactTitle", text: "contactText" },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      {/* Bangla */}
      <div className="leading-relaxed text-justify">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-primary mb-3">
            {bn.title}
          </h1>
          <p className="text-base md:text-xl text-foreground leading-normal">
            {bn["description"]}
          </p>
        </div>
        {sections.map(({ title, text }) => (
          <div key={title} className="mb-6">
            <h3 className="font-semibold text-lg md:text-xl lg:text-2xl mb-2">
              {bn[title]}
            </h3>
            <p className="text-base md:text-xl text-foreground leading-normal">
              {bn[text]}
            </p>
          </div>
        ))}
      </div>

      {/* English */}
      <div className="leading-relaxed text-justify">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-primary mb-3">
            {en.title}
          </h1>
          <p className="text-base md:text-xl text-foreground leading-normal">
            {en["description"]}
          </p>
        </div>
        {sections.map(({ title, text }) => (
          <div key={title} className="mb-6">
            <h3 className="font-semibold text-lg md:text-xl lg:text-2xl mb-2">
              {en[title]}
            </h3>
            <p className="text-base md:text-xl text-foreground leading-normal">
              {en[text]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
