import enMessages from "@/messages/en.json";
import bnMessages from "@/messages/bn.json";
import { generateFallbackMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    ...generateFallbackMetadata({ path: "/terms", locale }),
    title: "Terms of Use | Daily Destiny",
    description: "Terms and conditions for using Daily Destiny",
  };
}

export default function TermsPage() {
  const en = enMessages.terms;
  const bn = bnMessages.terms;

  const sections = [
    { title: "disclaimerTitle", text: "disclaimerText" },
    { title: "intelectualTitle", text: "intelectualText" },
    { title: "legalTitle", text: "legalText" },
    { title: "contentTitle", text: "contentText" },
    { title: "advertisementTitle", text: "advertisementText" },
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
