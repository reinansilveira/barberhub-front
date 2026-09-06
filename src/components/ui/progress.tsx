import type { ComponentProps, ReactNode } from "react";

type ProgressProps = ComponentProps<"div"> & { value?: number; children?: ReactNode };

export function Progress({ value = 0, className = "", children, ...props }: ProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className={`ui-progress ${className}`.trim()} {...props}>
      <div className="ui-progress__meta">{children}</div>
      <div className="ui-progress__track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={safeValue}>
        <span className="ui-progress__indicator" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

export function ProgressLabel({ children }: { children: ReactNode }) {
  return <span className="ui-progress__label">{children}</span>;
}

export function ProgressValue({ children }: { children: (value: string | null) => ReactNode }) {
  return <span className="ui-progress__value">{children(null)}</span>;
}
