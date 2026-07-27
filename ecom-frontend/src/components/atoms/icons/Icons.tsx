import React from "react";

// Interfaz base para todos los íconos
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const ChevronLeftIcon = ({ size = 16, className = "", ...props }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path 
      d="M11.0822 3.65766C11.4178 3.32198 11.4179 2.77784 11.0822 2.44221C10.7466 2.10671 10.2024 2.10671 9.86677 2.44221L4.91682 7.39216C4.58119 7.72779 4.58128 8.27193 4.91682 8.60762L9.86677 13.5576C10.2024 13.8932 10.7466 13.8932 11.0822 13.5576C11.4179 13.2219 11.4179 12.6778 11.0822 12.3421L6.74 7.99989L11.0822 3.65766Z" 
      fill="currentColor" // <-- La magia ocurre aquí
    />
  </svg>
);

export const ChevronRightIcon = ({ size = 16, className = "", ...props }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path 
      d="M4.91777 3.65766C4.58223 3.32198 4.58214 2.77784 4.91777 2.44221C5.25341 2.10671 5.79759 2.10671 6.13323 2.44221L11.0832 7.39216C11.4188 7.72779 11.4187 8.27193 11.0832 8.60762L6.13323 13.5576C5.79755 13.8932 5.25345 13.8932 4.91777 13.5576C4.5821 13.2219 4.5821 12.6778 4.91777 12.3421L9.26 7.99989L4.91777 3.65766Z" 
      fill="currentColor" // <-- Y aquí
    />
  </svg>
);

export const ChevronDownIcon = ({ size = 16, className = "", ...props }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path 
      d="M12.3421 4.91728C12.6778 4.58174 13.2219 4.58165 13.5575 4.91728C13.893 5.25292 13.893 5.7971 13.5575 6.13274L8.60759 11.0827C8.27197 11.4183 7.72782 11.4182 7.39214 11.0827L2.44219 6.13274C2.10651 5.79706 2.10651 5.25296 2.44219 4.91728C2.77786 4.58161 3.32197 4.58161 3.65764 4.91728L7.99987 9.25951L12.3421 4.91728Z" 
      fill="currentColor" // <-- Y aquí
    />
  </svg>
);