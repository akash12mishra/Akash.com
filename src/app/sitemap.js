export default async function sitemap() {
  const baseUrl = "https://arkalalchakravarty.com";

  // Add all your static pages
  const routes = ["", "/chatPlay"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return routes;
}
