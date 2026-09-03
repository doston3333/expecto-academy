interface OwlPostProps {
  className?: string;
}

/** Geometric owl carrying a letter. Original line mark, stroke-only. */
export function OwlPost({ className }: OwlPostProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 5 Q12 1.5 19 5" />
      <circle cx="8.6" cy="9.4" r="3.1" />
      <circle cx="15.4" cy="9.4" r="3.1" />
      <circle cx="8.6" cy="9.4" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="15.4" cy="9.4" r="0.6" fill="currentColor" stroke="none" />
      <path d="M12 11.4 L10.9 13.4 L13.1 13.4 Z" fill="currentColor" stroke="none" />
      <path d="M6.2 12.6 Q4.6 20 12 21.4 Q19.4 20 17.8 12.6" />
      <path d="M8.6 15.4 L15.4 15.4 L15.4 18.4 L8.6 18.4 Z" />
      <path d="M8.6 15.4 L12 17.2 L15.4 15.4" />
    </svg>
  );
}
