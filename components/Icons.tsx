import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polygon } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const Plane: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </Svg>
);

export const PlaneFilled: React.FC<IconProps> = ({ size = 24, color = 'currentColor' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <Path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </Svg>
);

export const Radio: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Circle cx="12" cy="12" r="2" />
    <Path d="M4.93 4.93a10 10 0 0 1 14.14 0M8.46 8.46a5 5 0 0 1 7.08 0M1.42 1.42a16 16 0 0 1 21.16 0" />
  </Svg>
);

export const Zap: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </Svg>
);

export const ZapFilled: React.FC<IconProps> = ({ size = 24, color = 'currentColor' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </Svg>
);

export const AlertTriangle: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <Line x1="12" y1="9" x2="12" y2="13" />
    <Line x1="12" y1="17" x2="12.01" y2="17" />
  </Svg>
);

export const AlertTriangleFilled: React.FC<IconProps> = ({ size = 24, color = 'currentColor' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
  </Svg>
);

export const Fuel: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Line x1="3" y1="22" x2="15" y2="22" />
    <Line x1="4" y1="9" x2="14" y2="9" />
    <Path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
    <Path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5" />
  </Svg>
);

export const Box: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <Path d="M3.3 7L12 12l8.7-5M12 22V12" />
  </Svg>
);

export const Cone: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M12 2L2 20h20L12 2z" />
    <Path d="M5 20h14" />
  </Svg>
);

export const CloudRain: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
    <Line x1="8" y1="19" x2="8" y2="21" />
    <Line x1="8" y1="13" x2="8" y2="15" />
    <Line x1="16" y1="19" x2="16" y2="21" />
    <Line x1="16" y1="13" x2="16" y2="15" />
    <Line x1="12" y1="21" x2="12" y2="23" />
    <Line x1="12" y1="15" x2="12" y2="17" />
  </Svg>
);

export const Sun: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Circle cx="12" cy="12" r="5" />
    <Line x1="12" y1="1" x2="12" y2="3" />
    <Line x1="12" y1="21" x2="12" y2="23" />
    <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <Line x1="1" y1="12" x2="3" y2="12" />
    <Line x1="21" y1="12" x2="23" y2="12" />
    <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </Svg>
);

export const RefreshCw: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
  </Svg>
);

export const Play: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Polygon points="5 3 19 12 5 21 5 3" />
  </Svg>
);

export const PlayFilled: React.FC<IconProps> = ({ size = 24, color = 'currentColor' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <Polygon points="5 3 19 12 5 21 5 3" />
  </Svg>
);

export const Radar: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Circle cx="12" cy="12" r="10" />
    <Circle cx="12" cy="12" r="6" />
    <Circle cx="12" cy="12" r="2" />
    <Line x1="12" y1="12" x2="18" y2="12" />
  </Svg>
);

export const ShieldCheck: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Path d="M9 12l2 2 4-4" />
  </Svg>
);

export const Lock: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

export const Fingerprint: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
    <Path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2" />
    <Path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
    <Path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
    <Path d="M8.65 22c.21-.66.45-1.32.57-2" />
    <Path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
    <Path d="M2 16h.01" />
    <Path d="M21.8 16c.2-2 .131-5.354 0-6" />
    <Path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" />
  </Svg>
);

export const Loader2: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Line x1="12" y1="2" x2="12" y2="6" />
    <Line x1="12" y1="18" x2="12" y2="22" />
    <Line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <Line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <Line x1="2" y1="12" x2="6" y2="12" />
    <Line x1="18" y1="12" x2="22" y2="12" />
    <Line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <Line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </Svg>
);

export const ChevronRight: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

export const Settings: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Circle cx="12" cy="12" r="3" />
    <Path d="M12 1v6m0 6v6" />
    <Path d="M17 3.34A10 10 0 0 1 21.54 12a10 10 0 0 1-4.54 8.66m-5 0A10 10 0 0 1 2.46 12 10 10 0 0 1 7 3.34" />
  </Svg>
);

export const Volume2: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <Path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
  </Svg>
);

export const FastForward: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Polygon points="13 19 22 12 13 5 13 19" />
    <Polygon points="2 19 11 12 2 5 2 19" />
  </Svg>
);

export const X: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);
