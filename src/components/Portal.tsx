import { useLayoutEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import useMounted from "@/hooks/useMounted";
import { createPortalRoot } from "@/libs/portal";

type Props = {
  children: React.ReactNode;
  container?: React.RefObject<HTMLElement>;
  id?: string;
};

const RenderPortal = ({ container, children, id = "portal" }: Props) => {
  const mountElement = useMemo(() => {
    return container?.current || document.body;
  }, [container]);

  const portalElement = useMemo(() => {
    const portal = document.getElementById(id) || createPortalRoot(id);
    return portal;
  }, [id]);

  useLayoutEffect(() => {
    mountElement.appendChild(portalElement);

    return () => {
      if (mountElement.contains(portalElement)) {
        mountElement.removeChild(portalElement);
      }
    };
  }, [mountElement, portalElement]);

  return createPortal(children, portalElement);
};

const Portal = ({ children, ...rest }: Props) => {
  const isMounted = useMounted();

  if (!isMounted) return null;

  return <RenderPortal {...rest}>{children}</RenderPortal>;
};

export default Portal;
