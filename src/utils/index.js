export function createPageUrl(pageName) {
  const pageMap = {
    'Home': '/',
    'Settings': '/Settings',
  };
  return pageMap[pageName] || `/${pageName}`;
}
