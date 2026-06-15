interface ShareIconProps {
  className?: string;
}

export function XShareIcon({ className = "h-5 w-5" }: ShareIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="#FFFFFF"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function FacebookShareIcon({ className = "h-5 w-5" }: ShareIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#1877F2"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

export function IMessageShareIcon({ className = "h-5 w-5" }: ShareIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#34C759"
        d="M12 2C6.477 2 2 6.145 2 11.243c0 2.906 1.446 5.502 3.708 7.177L4.5 21.5l3.38-1.9c1.114.314 2.293.483 3.52.483 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm0 1.5c4.87 0 8.75 3.58 8.75 7.743 0 4.163-3.88 7.743-8.75 7.743-.98 0-1.93-.15-2.82-.43l-2.93 1.65.98-2.85a8.2 8.2 0 0 1-2.24-5.113C5.25 7.08 9.13 3.5 12 3.5z"
      />
      <circle cx="8.75" cy="11.25" r="1.1" fill="#FFFFFF" />
      <circle cx="12" cy="11.25" r="1.1" fill="#FFFFFF" />
      <circle cx="15.25" cy="11.25" r="1.1" fill="#FFFFFF" />
    </svg>
  );
}
