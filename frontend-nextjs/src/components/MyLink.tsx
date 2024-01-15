"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link, { LinkProps } from "next/link";
import LoaderModal from "./Loading/LoaderModal";

interface Properties {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const MyLink = React.forwardRef<
  HTMLAnchorElement,
  Properties &
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
    LinkProps
>(function MyLink(
  {
    children,
    onClick,
    ...props
  }: Properties &
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
    LinkProps,
  ref
) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <>
      <LoaderModal open={isLoading && props.target != "_blank"} />
      <Link
        style={{
          textDecoration: "none",
          pointerEvents:
            pathname !== props.href && `${pathname}/` !== props.href
              ? "auto"
              : "none",
        }}
        {...props}
        onClick={(e) => {
          if (pathname !== props.href && `${pathname}/` !== props.href)
            setIsLoading(true);
          onClick?.(e);
        }}
        ref={ref}
      >
        {children}
      </Link>
    </>
  );
});

export default MyLink;
