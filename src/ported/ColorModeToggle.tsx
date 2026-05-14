interface ColorModeToggleProps {
  pageKey: string;
  className?: string;
}

export function ColorModeToggle({ pageKey, className = 'theme-toggle mode-toggle' }: ColorModeToggleProps) {
  return (
    <button
      type="button"
      className={className}
      id="color-mode-toggle"
      data-mode-toggle={pageKey}
      aria-label="Toggle light/dark mode"
      title="Toggle light/dark mode"
    >
      <span className="mode-toggle__state mode-toggle__state--to-light">
        <svg
          className="mode-toggle__icon mode-toggle__icon--moon"
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3a6.8 6.8 0 0 0 8.77 8.77A8.25 8.25 0 1 1 12 3Z" />
        </svg>
        <span className="mode-toggle__text">Light</span>
      </span>
      <span className="mode-toggle__state mode-toggle__state--to-dark">
        <svg
          className="mode-toggle__icon mode-toggle__icon--sun"
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx={12} cy={12} r={4} />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
        <span className="mode-toggle__text">Dark</span>
      </span>
    </button>
  );
}
