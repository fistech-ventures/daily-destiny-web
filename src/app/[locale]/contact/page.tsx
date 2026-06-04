import enMessages from "@/messages/en.json";
import bnMessages from "@/messages/bn.json";
import { generateFallbackMetadata } from "@/lib/metadata";
import { getPage } from "@/lib/api";
import { notFound } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/contact/contact-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    ...generateFallbackMetadata({ path: "/contact", locale }),
    title: "Contact Us | Prime Tv",
    description: "Get in touch with Prime Satellite TV",
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { data: page } = await getPage("contact");
  const pageStatus = page?.isActive;
  const { locale } = await params;

  if (!pageStatus) {
    return notFound();
  }

  // Get messages based on locale
  const messages = locale === "bn" ? bnMessages.contact : enMessages.contact;

  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side - Contact Information */}
        <div className="space-y-2">
          {/* Contact Information */}
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-primary mb-3">
              {messages.title}
            </h1>
            <p className="text-base md:text-xl text-foreground leading-normal">
              {messages.description}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg md:text-xl lg:text-2xl mb-4">
              {messages.contactInfoTitle}
            </h3>
            <div className="space-y-4 text-base md:text-xl text-foreground">
              <div className="flex items-start space-x-3">
                <MapPin />
                <div>
                  <p className="font-medium">{messages.addressLabel}:</p>
                  <p>{messages.address}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone />
                <div>
                  <p className="font-medium">{messages.phoneLabel}:</p>
                  <p>{messages.phone}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail />
                <div>
                  <p className="font-medium">{messages.emailLabel}:</p>
                  <p>{messages.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div>
          <ContactForm messages={messages} />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg md:text-xl lg:text-2xl mb-4">
          {messages.mapTitle}
        </h3>
        <div className="aspect-4/2 w-full rounded-lg overflow-hidden">
          <iframe
            src={messages.mapEmbed}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
