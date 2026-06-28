const paths = {
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  home: (
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10.5V20h13v-9.5" />
      <path d="M9.5 20v-6h5v6" />
    </>
  ),
  cloud: (
    <>
      <path d="M7.5 18.5H17a4 4 0 0 0 .5-7.96 6 6 0 0 0-11.13-1.8A4.75 4.75 0 0 0 7.5 18.5Z" />
      <path d="M12 13v7" />
      <path d="m8.5 16.5 3.5-3.5 3.5 3.5" />
    </>
  ),
  cloudOff: (
    <>
      <path d="m3 3 18 18" />
      <path d="M9.6 6.2A6 6 0 0 1 17.5 10.5 4 4 0 0 1 17 18.5h-4.5" />
      <path d="M7.5 18.5a4.75 4.75 0 0 1-1.15-9.36" />
    </>
  ),
  tasks: (
    <>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="m3 6 1 1 2-2" />
      <path d="m3 12 1 1 2-2" />
      <path d="m3 18 1 1 2-2" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </>
  ),
  location: (
    <>
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  chart: (
    <>
      <path d="M5 20V10" />
      <path d="M12 20V4" />
      <path d="M19 20v-7" />
    </>
  ),
  table: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="1.5" />
      <path d="M4 10h16" />
      <path d="M10 5v14" />
    </>
  ),
  report: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v5h4" />
      <path d="M9.5 13h5" />
      <path d="M9.5 17h5" />
    </>
  ),
  filter: (
    <>
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </>
  ),
  map: (
    <>
      <path d="m9 18-5 2V6l5-2 6 2 5-2v14l-5 2z" />
      <path d="M9 4v14" />
      <path d="M15 6v14" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </>
  ),
  file: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v5h4" />
      <path d="M9.5 13h5" />
      <path d="M9.5 17h4" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 0 1-13.66 5.66" />
      <path d="M4 12A8 8 0 0 1 17.66 6.34" />
      <path d="M17 2v5h5" />
      <path d="M7 22v-5H2" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16z" />
      <path d="m13.5 6.5 4 4" />
    </>
  ),
};

export default function Icon({ name, size = 22, strokeWidth = 2, className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name] || paths.more}
    </svg>
  );
}
