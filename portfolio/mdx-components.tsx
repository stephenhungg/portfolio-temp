import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";

const components: MDXComponents = {
  h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
  h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
  h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
  h4: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
  p: ({ children, ...props }) => <p {...props}>{children}</p>,
  code: ({ children, ...props }) => <code {...props}>{children}</code>,
  a: ({ href, children, ...props }) => {
    const url = href ?? "#";
    const isExternal = /^https?:\/\//.test(url);
    if (isExternal) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-muted-medium" {...props}>
          {children}
        </a>
      );
    }
    return (
      <Link href={url} className="underline hover:text-muted-medium">
        {children}
      </Link>
    );
  },
  img: ({ alt, src, width, height, ...rest }) => (
    <Image
      src={src ?? ""}
      alt={alt ?? ""}
      width={typeof width === "number" ? width : 1600}
      height={typeof height === "number" ? height : 900}
      sizes="100vw"
      style={{ width: "100%", height: "auto" }}
      {...(rest as Omit<ImageProps, "src" | "alt" | "width" | "height">)}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
