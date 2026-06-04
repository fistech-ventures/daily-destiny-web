import { VideoArticle } from "@/lib/api";
import { formatRelativeTime } from "@/utils/date-formatter";
import { Timer } from "lucide-react";
import SocialShare from "../shared/social-share";

interface VideoPlayerDetailsProps {
  video: VideoArticle;
}

const getThumbnail = (video: VideoArticle): string => {
  if (video.source === "youtube" && video.key) {
    return `https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`;
  }
  return video.coverImage ?? "";
};

const getFacebookEmbedUrl = (url: string) => {
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true&allowfullscreen=true`;
};

export default function VideoPlayerDetails({ video }: VideoPlayerDetailsProps) {
  const thumbnail = getThumbnail(video);

  return (
    <div className="flex flex-col gap-2 lg:gap-6">
      {/* Player */}
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-black">
        {video.source === "youtube" ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.key}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : video.source === "facebook" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <iframe
              src={getFacebookEmbedUrl(video.url)}
              title={video.title}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              scrolling="no"
              className="border-0"
              style={{
                height: "100%",
                width: "calc(100% * 9 / 16)",
                maxWidth: "100%",
              }}
            />
          </div>
        ) : (
          <video
            src={video.url}
            controls
            autoPlay
            poster={thumbnail}
            className="absolute inset-0 h-full w-full object-contain"
          />
        )}
      </div>

      {/* Metadata */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-primary font-bold">
          <Timer className="h-5 w-5" />
          <span className="text-sm uppercase tracking-wide">
            {formatRelativeTime(video.date)}
          </span>
        </div>
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 leading-[1.2]">
          {video.title}
        </h1>
        <p className="text-sm font-normal text-muted-foreground">
          {video.excerpt}
        </p>
        <SocialShare title={video.title} />
      </div>
    </div>
  );
}
