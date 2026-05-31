import { useEffect, useRef, type RefObject } from "react";
import { useLocation } from "react-router-dom";

/**
 * Moves focus to the given element whenever the route changes so keyboard and
 * screen-reader users land on the new page's content rather than back at the top
 * of the document, NFR-A11Y-08. Skips the initial render to avoid stealing
 * focus on first paint (e.g. from an autofocused field or the skip link).
 */
export function useRouteFocus(ref: RefObject<HTMLElement>) {
  const { pathname } = useLocation();
  const isInitial = useRef(true);

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    ref.current?.focus();
  }, [pathname, ref]);
}
