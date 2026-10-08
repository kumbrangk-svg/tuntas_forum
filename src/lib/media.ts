export const validateImageUrl = (url: string, blockedDomains: string[] = []): boolean => {
  if (!url || typeof url !== 'string' || url.length > 500) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    if (blockedDomains.some((d) => parsed.hostname.endsWith(d))) return false;
    return true;
  } catch {
    return false;
  }
};

export const toEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  try {
    const parsed = new URL(url);

    // YouTube -> youtube-nocookie
    if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
      const videoId = parsed.searchParams.get('v') || parsed.pathname.split('/').filter(Boolean).pop();
      if (!videoId) return null;
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }

    // Vimeo
    if (parsed.hostname.includes('vimeo.com')) {
      const videoId = parsed.pathname.split('/').filter(Boolean).pop();
      if (!videoId || isNaN(Number(videoId))) return null;
      return `https://player.vimeo.com/video/${videoId}`;
    }

    return null;
  } catch {
    return null;
  }
};
