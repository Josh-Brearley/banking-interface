import { useEffect } from "react";

const BRAND = "Eagle Bank";

/**
 * Sets a descriptive `document.title` for the current route and restores the
 * previous title on unmount, NFR-A11Y-10. Pass the page name; the brand suffix
 * is appended. Call once per page component.
 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · ${BRAND}` : BRAND;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
