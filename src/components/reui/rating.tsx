import { Star } from "lucide-react";

export function Rating({ rating, showValue = false, className = "" }: { rating: number; showValue?: boolean; className?: string }) {
  return (
    <span className={`ui-rating ${className}`.trim()} aria-label={`Nota ${rating} de 5`}>
      <span className="ui-rating__stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <Star key={index} size={13} fill={index + 1 <= rating ? "currentColor" : "none"} />
        ))}
      </span>
      {showValue && <span className="ui-rating__value">{rating.toFixed(1)}</span>}
    </span>
  );
}
