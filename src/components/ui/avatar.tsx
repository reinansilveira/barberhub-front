import type { ComponentProps, ReactNode } from "react";

type AvatarProps = ComponentProps<"span"> & { children?: ReactNode };

export function Avatar({ className = "", children, ...props }: AvatarProps) {
  return <span className={`ui-avatar ${className}`.trim()} {...props}>{children}</span>;
}

export function AvatarImage({ className = "", alt = "", ...props }: ComponentProps<"img">) {
  return <img className={`ui-avatar__image ${className}`.trim()} alt={alt} {...props} />;
}

export function AvatarFallback({ className = "", ...props }: ComponentProps<"span">) {
  return <span className={`ui-avatar__fallback ${className}`.trim()} {...props} />;
}

export function AvatarBadge({ className = "", ...props }: ComponentProps<"span">) {
  return <span className={`ui-avatar__badge ${className}`.trim()} aria-label="Online" {...props} />;
}
