const STARFIELD = [
  { left: "4%", top: "12%", size: 2, duration: 3.4, delay: 0 },
  { left: "11%", top: "34%", size: 1.5, duration: 4.2, delay: 0.8 },
  { left: "18%", top: "8%", size: 2, duration: 3.8, delay: 1.6 },
  { left: "24%", top: "52%", size: 1.5, duration: 5, delay: 0.4 },
  { left: "31%", top: "22%", size: 2, duration: 3.1, delay: 2.2 },
  { left: "37%", top: "66%", size: 1.5, duration: 4.6, delay: 1.1 },
  { left: "44%", top: "14%", size: 2, duration: 3.9, delay: 2.8 },
  { left: "50%", top: "42%", size: 1.5, duration: 4.4, delay: 0.2 },
  { left: "56%", top: "6%", size: 2, duration: 3.3, delay: 1.9 },
  { left: "62%", top: "58%", size: 1.5, duration: 4.8, delay: 0.9 },
  { left: "68%", top: "26%", size: 2, duration: 3.6, delay: 2.5 },
  { left: "74%", top: "72%", size: 1.5, duration: 4.1, delay: 1.4 },
  { left: "80%", top: "16%", size: 2, duration: 3.7, delay: 3.1 },
  { left: "86%", top: "46%", size: 1.5, duration: 4.9, delay: 0.6 },
  { left: "92%", top: "8%", size: 2, duration: 3.2, delay: 2 },
  { left: "8%", top: "70%", size: 1.5, duration: 4.5, delay: 1.7 },
  { left: "28%", top: "84%", size: 2, duration: 3.5, delay: 2.9 },
  { left: "48%", top: "78%", size: 1.5, duration: 4.3, delay: 0.3 },
  { left: "66%", top: "88%", size: 2, duration: 4, delay: 1.2 },
  { left: "84%", top: "80%", size: 1.5, duration: 3.4, delay: 2.4 },
  { left: "95%", top: "62%", size: 2, duration: 4.7, delay: 0.7 },
  { left: "15%", top: "58%", size: 1.5, duration: 3.9, delay: 3.3 },
] as const;

/** A quiet night sky for dark sections. Reduced motion stills the twinkle. */
export function Stars({ className, count }: { className?: string; count?: number }) {
  const stars = count ? STARFIELD.slice(0, count) : STARFIELD;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-cream"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animation: `star-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
