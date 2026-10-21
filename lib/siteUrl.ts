// Production URL on Vercel, otherwise the URL env var (set by Netlify, or in .env locally)
export function getSiteUrl(): string {
  return (
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.URL
  ) as string;
}
