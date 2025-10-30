'use client';

import React from 'react';

type LoadingProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
};

export default function Loading({ className = '', size = 'sm', ariaLabel = '로딩 중' }: LoadingProps) {
  const sizeClass = {
    sm: 'dot-sm',
    md: 'dot-md',
    lg: 'dot-lg',
  }[size];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={`flex items-center justify-center ${className}`}
    >
      <div className="flex items-end gap-2" aria-hidden>
        <span className={`dot ${sizeClass}`} style={{ animationDelay: '0s' }} />
        <span className={`dot ${sizeClass}`} style={{ animationDelay: '0.12s' }} />
        <span className={`dot ${sizeClass}`} style={{ animationDelay: '0.24s' }} />
      </div>

      <style jsx>{`
        .dot {
          display: inline-block;
          border-radius: 9999px;
          background-color: #41d596;
          animation: updown 0.42s infinite ease-in-out;
        }
        .dot-sm {
          width: 8px;
          height: 8px;
        }
        .dot-md {
          width: 12px;
          height: 12px;
        }
        .dot-lg {
          width: 16px;
          height: 16px;
        }
        @keyframes updown {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
