import React from 'react';

const symbols = [
  { sym: '+', x: 5, y: 10, size: 48, color: '#FBBF24', delay: 0, dur: 4 },
  { sym: '÷', x: 85, y: 15, size: 56, color: '#EC4899', delay: 1, dur: 5 },
  { sym: '×', x: 15, y: 70, size: 40, color: '#10B981', delay: 2, dur: 6 },
  { sym: '=', x: 90, y: 65, size: 44, color: '#3B82F6', delay: 0.5, dur: 4.5 },
  { sym: '∑', x: 50, y: 5, size: 52, color: '#F97316', delay: 1.5, dur: 5.5 },
  { sym: '√', x: 3, y: 40, size: 36, color: '#7C3AED', delay: 3, dur: 4 },
  { sym: 'π', x: 92, y: 40, size: 50, color: '#14B8A6', delay: 0.8, dur: 6 },
  { sym: '∞', x: 70, y: 85, size: 38, color: '#FBBF24', delay: 2.2, dur: 5 },
  { sym: '%', x: 25, y: 88, size: 42, color: '#EC4899', delay: 1.8, dur: 4.8 },
  { sym: '△', x: 60, y: 12, size: 34, color: '#10B981', delay: 0.3, dur: 5.2 },
  { sym: '²', x: 40, y: 95, size: 30, color: '#7C3AED', delay: 2.5, dur: 4.3 },
  { sym: '⬡', x: 78, y: 55, size: 32, color: '#F97316', delay: 3.5, dur: 6.2 },
];

export default function MathBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
    }}>
      {symbols.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
            color: s.color,
            opacity: 0.12,
            fontFamily: "'Fredoka One', cursive",
            fontWeight: 'bold',
            animation: `${i % 2 === 0 ? 'float' : 'floatReverse'} ${s.dur}s ease-in-out ${s.delay}s infinite`,
            userSelect: 'none',
          }}
        >
          {s.sym}
        </div>
      ))}
    </div>
  );
}
