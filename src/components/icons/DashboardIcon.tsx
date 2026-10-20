interface DashboardIconProps {
  className?: string;
}

export function DashboardIcon({ className = 'h-4 w-4' }: DashboardIconProps) {
  return (
    <svg
      className={className}
      viewBox="40 139.5 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M48.3333 144.5V139.5H55V144.5H48.3333V144.5M40 147.833V139.5H46.6667V147.833H40V147.833M48.3333 154.5V146.167H55V154.5H48.3333V154.5M40 154.5V149.5H46.6667V154.5H40V154.5M41.6667 146.167H45V141.167H41.6667V146.167V146.167M50 152.833H53.3333V147.833H50V152.833V152.833M50 142.833H53.3333V141.167H50V142.833V142.833M41.6667 152.833H45V151.167H41.6667V152.833V152.833"
        fill="#36654A"
      />
    </svg>
  );
}
