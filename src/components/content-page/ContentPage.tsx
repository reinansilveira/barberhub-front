import type { ReactNode } from "react";
import { cn } from "@/utils/class-names";
import "./ContentPage.scss";

type ContentPageProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  updatedAt?: string;
  tone?: "light" | "dark";
  children: ReactNode;
};

export function ContentPage({
  eyebrow,
  title,
  description,
  updatedAt,
  tone = "light",
  children,
}: ContentPageProps) {
  return (
    <section
      className={cn("content-page", tone === "dark" && "content-page--dark")}
      aria-labelledby="content-page-title"
    >
      <header className="content-page__hero">
        <div className="wrapper content-page__hero-inner">
          {eyebrow && <p className="content-page__eyebrow">{eyebrow}</p>}
          <h1 className="content-page__title" id="content-page-title">
            {title}
          </h1>
          {description && (
            <p className="content-page__description">{description}</p>
          )}
          {updatedAt && (
            <p className="content-page__updated">
              Última atualização: {updatedAt}
            </p>
          )}
        </div>
      </header>
      <div className="wrapper content-page__body">{children}</div>
    </section>
  );
}
