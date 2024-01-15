import { RefObject, useEffect, useRef } from "react";

export const useClickAway = (
  callback: () => void,
  exact?: Array<RefObject<any>>
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exact)
        for (const obj of exact) {
          if (obj.current && obj.current.contains(event.target as Node)) {
            return false;
          }
        }
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, exact]);

  return ref;
};
