const iconProps = {
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const small = { ...iconProps, viewBox: '0 0 16 16' };

export const BookmarkIcon = (
  <svg {...iconProps}>
    <path d="M6 3.5h8v13l-4-2.75-4 2.75z" />
  </svg>
);
export const SearchIcon = (
  <svg {...iconProps}>
    <circle cx="9" cy="9" r="5" />
    <path d="M13 13l3.5 3.5" />
  </svg>
);
export const AlertIcon = (
  <svg {...iconProps}>
    <circle cx="10" cy="10" r="6.75" />
    <path d="M10 6.5v4.25" />
    <path d="M10 13.5v.01" />
  </svg>
);
export const RefreshIcon = (
  <svg {...small}>
    <path d="M13 8a5 5 0 1 1-1.46-3.54" />
    <path d="M13 3v2.5h-2.5" />
  </svg>
);
export const CopyIcon = (
  <svg {...small}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
    <path d="M10.5 5.5V3.75a1.25 1.25 0 0 0-1.25-1.25h-5.5A1.25 1.25 0 0 0 2.5 3.75v5.5a1.25 1.25 0 0 0 1.25 1.25H5.5" />
  </svg>
);
export const CheckIcon = (
  <svg {...small}>
    <path d="M3 8.5l3.25 3.25L13 4.75" />
  </svg>
);
export const PencilIcon = (
  <svg {...small}>
    <path d="M10.75 3.25l2 2L5.5 12.5l-2.75.75.75-2.75z" />
  </svg>
);
export const ArchiveIcon = (
  <svg {...small}>
    <rect x="2.5" y="3" width="11" height="3" rx="0.75" />
    <path d="M3.5 6v6a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V6" />
    <path d="M6.5 8.75h3" />
  </svg>
);
export const TrashIcon = (
  <svg {...small}>
    <path d="M3 4.5h10" />
    <path d="M6.25 4.5V3.25h3.5V4.5" />
    <path d="M4.25 4.5l.6 8.25h6.3l.6-8.25" />
  </svg>
);
export const MoreIcon = (
  <svg {...small}>
    <path d="M3.5 8v.01M8 8v.01M12.5 8v.01" strokeWidth="2" />
  </svg>
);
export const ArrowLeftIcon = (
  <svg {...small}>
    <path d="M9.75 3.5L5.25 8l4.5 4.5" />
  </svg>
);
export const ArrowRightIcon = (
  <svg {...small}>
    <path d="M6.25 3.5L10.75 8l-4.5 4.5" />
  </svg>
);
