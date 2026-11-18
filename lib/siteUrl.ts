// Production URL on Vercel, otherwise the URL env var (set by Netlify, or in .env locally)
export function getSiteUrl(): string {
  const { VERCEL_PROJECT_PRODUCTION_URL, URL } = process.env;
  if (VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (!URL) throw new Error('Missing environment variable URL');
  return URL;
}
