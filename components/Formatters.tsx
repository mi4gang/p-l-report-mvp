
import React from 'react';

export const Money = ({ value, className = "", lightMode = false }: { value: number; className?: string; lightMode?: boolean }) => {
  const isNegative = value < 0;
  const formatted = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);

  const defaultColor = lightMode ? 'text-white' : 'text-slate-900';
  const negativeColor = lightMode ? 'text-red-400 font-bold' : 'text-red-600 font-bold';

  return (
    <span className={`${isNegative ? negativeColor : defaultColor} ${className}`}>
      {formatted}
    </span>
  );
};

export const Margin = ({ value, lightMode = false }: { value: number; lightMode?: boolean }) => {
  const positiveColor = lightMode ? 'text-green-400' : 'text-green-700';
  const negativeColor = lightMode ? 'text-red-400 font-bold' : 'text-red-600 font-bold';
  const neutralColor = lightMode ? 'text-slate-400' : 'text-slate-400';
  
  const colorClass = value > 0 ? positiveColor : value < 0 ? negativeColor : neutralColor;
  return <Money value={value} className={`${colorClass} ${lightMode ? 'font-black text-lg' : ''}`} lightMode={lightMode} />;
};

export const ExternalLink = ({ href, children }: { href: string; children?: React.ReactNode }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-blue-600 hover:text-blue-800 underline decoration-blue-200"
  >
    {children}
  </a>
);
