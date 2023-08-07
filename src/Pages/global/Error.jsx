import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { log } from "jsvjp/index.js";
import { useLocation } from "react-router-dom";
export default function Error() {
  const { pathname: path } = useLocation();
  const useRefs = useRef();
  const linkRef = useMemo(() => useRefs, [useRefs]);
  const render = useCallback(() => {
    log(`throw new Error("404 - Page not found");
(function Error() {console.log('${path}')})();
HTML("a", "error", "Go to Home!", { href: "/" });`);
  }, [path]);
  useEffect(() => {
    render();
  }, [render]);
  const handleKeyDown = useCallback(
    (e) => {
      const keyMap = {
        13: "enter",
      };
      if (keyMap[e.keyCode] === "enter") {
        linkRef.current.click();
      }
    },
    [linkRef]
  );
  useEffect(() => {
    linkRef.current.focus();
  }, [linkRef]);
  return (
    <a
      href="/"
      className="error"
      ref={linkRef}
      onKeyDown={(e) => handleKeyDown(e)}
    >
      Go to Home!
    </a>
  );
}
