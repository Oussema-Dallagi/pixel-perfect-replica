export const seo = (title: string, description: string) => ({
  meta: [
    { title: `${title} · SmartMeet AI` }, { name: "description", content: description },
    { property: "og:title", content: `${title} · SmartMeet AI` }, { property: "og:description", content: description },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ],
});
