export default async function sitemap() {
  const baseUrl = "https://arkalalchakravarty.com";
  const routes = [
    "",
    "/chatPlay",
    "/signIn",
    "/privacyPolicy",
    "/termsOfService",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));
  return routes;
}
