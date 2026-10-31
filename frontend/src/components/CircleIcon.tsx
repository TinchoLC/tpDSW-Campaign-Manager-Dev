interface CircleIconProps {
  diametro?: number;
  className?: string;
  alt?: string;
}

export function CircleIcon({
  diametro = 32,
  className = '',
  alt = 'Campaign Manager',
}: CircleIconProps) {
  return (
    <img
      src="/logo.png"
      alt={alt}
      width={diametro}
      height={diametro}
      className={`rounded-circle shadow-sm ${className}`.trim()}
    />
  );
}
