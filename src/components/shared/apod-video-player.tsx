'use client';

interface ApodVideoPlayerProps {
  url: string;
  title: string;
}

function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

function isYouTubeEmbed(url: string): boolean {
  return url.includes('youtube.com/embed') || url.includes('youtu.be');
}

function isVimeoEmbed(url: string): boolean {
  return url.includes('player.vimeo.com');
}

export function ApodVideoPlayer({ url, title }: ApodVideoPlayerProps) {
  if (isDirectVideo(url)) {
    return (
      <video
        src={url}
        controls
        playsInline
        className="h-full w-full rounded-lg bg-black"
        title={title}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  if (isYouTubeEmbed(url) || isVimeoEmbed(url)) {
    return (
      <iframe
        src={url}
        title={title}
        className="h-full w-full rounded-lg"
        allowFullScreen
        allow="autoplay; encrypted-media"
      />
    );
  }

  // Fallback: try iframe but with a link fallback
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg bg-space-850 p-6">
      <p className="text-sm text-muted-foreground text-center">
        This video cannot be embedded directly.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-nebula-blue/20 px-4 py-2 text-sm font-medium text-nebula-blue hover:bg-nebula-blue/30 transition-colors"
      >
        Open Video
      </a>
    </div>
  );
}
