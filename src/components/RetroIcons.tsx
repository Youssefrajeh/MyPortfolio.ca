import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

export const ComputerIcon: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} style={{ shapeRendering: 'crispEdges' }}>
    {/* Monitor Shadow */}
    <rect x="2" y="3" width="24" height="18" fill="#808080" />
    {/* Monitor Bevel */}
    <rect x="1" y="2" width="24" height="18" fill="#ffffff" />
    <rect x="2" y="3" width="22" height="16" fill="#c0c0c0" />
    {/* Monitor Screen Frame */}
    <rect x="4" y="5" width="18" height="12" fill="#808080" />
    <rect x="5" y="6" width="17" height="11" fill="#000000" />
    {/* Screen Blue */}
    <rect x="6" y="7" width="15" height="9" fill="#000080" />
    {/* Monitor Stand */}
    <rect x="10" y="20" width="6" height="4" fill="#c0c0c0" />
    <rect x="10" y="20" width="1" height="4" fill="#ffffff" />
    <rect x="15" y="20" width="1" height="4" fill="#808080" />
    {/* Monitor Base */}
    <rect x="6" y="23" width="14" height="3" fill="#c0c0c0" />
    <rect x="6" y="23" width="14" height="1" fill="#ffffff" />
    <rect x="6" y="23" width="1" height="3" fill="#ffffff" />
    <rect x="19" y="23" width="1" height="3" fill="#808080" />
    <rect x="6" y="25" width="14" height="1" fill="#000000" />
    {/* Computer Case (tower) */}
    <rect x="20" y="10" width="8" height="14" fill="#c0c0c0" />
    <rect x="20" y="10" width="8" height="1" fill="#ffffff" />
    <rect x="20" y="10" width="1" height="14" fill="#ffffff" />
    <rect x="27" y="10" width="1" height="14" fill="#808080" />
    <rect x="20" y="23" width="8" height="1" fill="#000000" />
    {/* Case details (floppy drive) */}
    <rect x="22" y="13" width="4" height="1" fill="#808080" />
    <rect x="22" y="16" width="4" height="2" fill="#000000" />
    {/* Power LED */}
    <rect x="22" y="20" width="1" height="1" fill="#00ff00" />
  </svg>
);

export const NetworkIcon: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} style={{ shapeRendering: 'crispEdges' }}>
    {/* Top Computer */}
    <rect x="10" y="2" width="12" height="9" fill="#ffffff" />
    <rect x="11" y="3" width="10" height="7" fill="#c0c0c0" />
    <rect x="12" y="4" width="8" height="5" fill="#000000" />
    <rect x="10" y="10" width="12" height="2" fill="#808080" />
    {/* Bottom Left Computer */}
    <rect x="2" y="16" width="12" height="9" fill="#ffffff" />
    <rect x="3" y="17" width="10" height="7" fill="#c0c0c0" />
    <rect x="4" y="18" width="8" height="5" fill="#000000" />
    <rect x="2" y="24" width="12" height="2" fill="#808080" />
    {/* Bottom Right Computer */}
    <rect x="18" y="16" width="12" height="9" fill="#ffffff" />
    <rect x="19" y="17" width="10" height="7" fill="#c0c0c0" />
    <rect x="20" y="18" width="8" height="5" fill="#000000" />
    <rect x="18" y="24" width="12" height="2" fill="#808080" />
    {/* Network Cables (T-connector style) */}
    <rect x="15" y="12" width="2" height="14" fill="#ff0000" />
    <rect x="7" y="26" width="18" height="2" fill="#ff0000" />
    <rect x="7" y="25" width="2" height="1" fill="#ff0000" />
    <rect x="23" y="25" width="2" height="1" fill="#ff0000" />
  </svg>
);

export const FolderIcon: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} style={{ shapeRendering: 'crispEdges' }}>
    {/* Folder Back/Outline */}
    <path d="M2 6V26H30V9H14L11 6H2Z" fill="#d09010" />
    {/* Tab & Front Bevel */}
    <path d="M3 7V25H29V10H13L10 7H3Z" fill="#ffc040" />
    {/* Folder Open/Front Inner Shadow */}
    <path d="M4 11H28V24H4V11Z" fill="#ffe080" />
    {/* Document poking out */}
    <rect x="14" y="4" width="12" height="8" fill="#ffffff" />
    <rect x="15" y="5" width="10" height="1" fill="#000000" />
    <rect x="15" y="7" width="7" height="1" fill="#000000" />
    {/* Front folder leaf shadow */}
    <path d="M3 10L9 10L12 13L29 13V25H3V10Z" fill="#ffc040" />
    <path d="M12 13L29 13V14H12V13Z" fill="#ffffff" />
    <path d="M3 25H29V26H3V25Z" fill="#805000" />
  </svg>
);

export const NotepadIcon: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} style={{ shapeRendering: 'crispEdges' }}>
    {/* Base Pad (Yellow backing / Ring binding) */}
    <rect x="4" y="2" width="24" height="28" fill="#808080" />
    <rect x="5" y="3" width="22" height="26" fill="#ffffff" />
    {/* Top Binding Part */}
    <rect x="5" y="3" width="22" height="4" fill="#000080" />
    <rect x="8" y="1" width="2" height="4" fill="#c0c0c0" />
    <rect x="14" y="1" width="2" height="4" fill="#c0c0c0" />
    <rect x="20" y="1" width="2" height="4" fill="#c0c0c0" />
    {/* Notepad Lines */}
    <rect x="8" y="10" width="16" height="1" fill="#a0a0ff" />
    <rect x="8" y="14" width="16" height="1" fill="#a0a0ff" />
    <rect x="8" y="18" width="16" height="1" fill="#a0a0ff" />
    <rect x="8" y="22" width="16" height="1" fill="#a0a0ff" />
    <rect x="8" y="26" width="10" height="1" fill="#a0a0ff" />
    {/* Pencil */}
    <path d="M22 18L28 24L26 26L20 20L22 18Z" fill="#ffc000" />
    <path d="M28 24L29 25L28 26L26 26L28 24Z" fill="#ff8080" /> {/* Eraser */}
    <path d="M20 20L19 19L21 19L20 20Z" fill="#000000" /> {/* Tip */}
  </svg>
);

export const WordPadIcon: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} style={{ shapeRendering: 'crispEdges' }}>
    {/* Document outline */}
    <rect x="4" y="2" width="24" height="28" fill="#808080" />
    <rect x="5" y="3" width="22" height="26" fill="#ffffff" />
    {/* Red Margin line */}
    <rect x="9" y="3" width="1" height="26" fill="#ff8080" />
    {/* Styled header bar */}
    <rect x="5" y="3" width="22" height="3" fill="#1084d0" />
    {/* Fake Text lines */}
    <rect x="12" y="9" width="12" height="2" fill="#000000" />
    <rect x="12" y="13" width="10" height="2" fill="#404040" />
    <rect x="12" y="17" width="13" height="2" fill="#404040" />
    <rect x="12" y="21" width="8" height="2" fill="#404040" />
    {/* Blue "A" icon (WordPad style) */}
    <path d="M12 9L15 3L18 9" stroke="#000080" strokeWidth="1" fill="none" />
    {/* Large Blue 'A' pixel art */}
    <rect x="6" y="11" width="4" height="8" fill="#000080" />
    <rect x="7" y="10" width="2" height="2" fill="#000080" />
    <rect x="6" y="15" width="4" height="1" fill="#ffffff" />
  </svg>
);

export const MailIcon: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} style={{ shapeRendering: 'crispEdges' }}>
    {/* Envelope Back */}
    <rect x="3" y="8" width="26" height="16" fill="#808080" />
    <rect x="4" y="9" width="24" height="14" fill="#ffffff" />
    {/* Flap details */}
    <path d="M4 9L16 17L28 9" stroke="#c0c0c0" strokeWidth="2" fill="none" />
    <path d="M4 23L12 15" stroke="#808080" strokeWidth="1.5" fill="none" />
    <path d="M28 23L20 15" stroke="#808080" strokeWidth="1.5" fill="none" />
    {/* Post stamp */}
    <rect x="22" y="11" width="4" height="4" fill="#ff8080" />
  </svg>
);

export const MinesweeperIcon: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} style={{ shapeRendering: 'crispEdges' }}>
    {/* Gray button base */}
    <rect x="2" y="2" width="28" height="28" fill="#c0c0c0" />
    {/* Raised borders */}
    <path d="M2 2H30V3H3V30H2V2Z" fill="#ffffff" />
    <path d="M30 2V30H2V29H29V2H30Z" fill="#808080" />
    {/* Bomb ball */}
    <circle cx="16" cy="17" r="7" fill="#000000" />
    {/* Spikes */}
    <rect x="15" y="6" width="2" height="4" fill="#000000" />
    <rect x="15" y="24" width="2" height="4" fill="#000000" />
    <rect x="5" y="16" width="4" height="2" fill="#000000" />
    <rect x="23" y="16" width="4" height="2" fill="#000000" />
    {/* Diagonal Spikes */}
    <rect x="8" y="9" width="2" height="2" fill="#000000" />
    <rect x="22" y="9" width="2" height="2" fill="#000000" />
    <rect x="8" y="23" width="2" height="2" fill="#000000" />
    <rect x="22" y="23" width="2" height="2" fill="#000000" />
    {/* Lit Fuse */}
    <path d="M17 9C17 7 19 6 21 6" stroke="#ff0000" strokeWidth="1.5" fill="none" />
    <circle cx="22" cy="5" r="1.5" fill="#ffff00" />
    {/* Bomb highlight */}
    <rect x="13" y="14" width="2" height="2" fill="#ffffff" />
  </svg>
);

export const PaintIcon: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} style={{ shapeRendering: 'crispEdges' }}>
    {/* Palette (Yellowish wood) */}
    <path d="M6 16C6 10 10 6 18 6C24 6 27 10 27 14C27 18 25 21 22 23C20 24.5 16 26 12 26C7 26 6 21 6 16Z" fill="#dfa060" />
    <path d="M6 16C6 10 10 6 18 6C24 6 27 10 27 14C27 18 25 21 22 23C20 24.5 16 26 12 26C7 26 6 21 6 16Z" stroke="#805000" strokeWidth="1.5" fill="none" />
    {/* Thumb hole */}
    <ellipse cx="11" cy="20" rx="2" ry="1.5" fill="#008080" />
    {/* Paint drops (Red, Blue, Green, Yellow) */}
    <circle cx="12" cy="11" r="2.5" fill="#ff0000" />
    <circle cx="18" cy="10" r="2.5" fill="#0000ff" />
    <circle cx="23" cy="13" r="2.5" fill="#00ff00" />
    <circle cx="21" cy="18" r="2.5" fill="#ffff00" />
    {/* Paintbrush */}
    <path d="M7 26L16 17" stroke="#808080" strokeWidth="3" fill="none" />
    <path d="M16 17L19 14" stroke="#ffc000" strokeWidth="3.5" fill="none" />
    <path d="M19 14L22 11" stroke="#000000" strokeWidth="4" fill="none" />
  </svg>
);

export const RecycleBinEmptyIcon: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} style={{ shapeRendering: 'crispEdges' }}>
    {/* Bin Rim */}
    <ellipse cx="16" cy="6" rx="9" ry="2.5" fill="#c0c0c0" stroke="#808080" strokeWidth="1.5" />
    {/* Bin Body */}
    <path d="M7 6L9 26H23L25 6" fill="#c0c0c0" stroke="#808080" strokeWidth="1.5" />
    {/* Metal Mesh Lines */}
    <line x1="10" y1="8" x2="11" y2="24" stroke="#808080" strokeWidth="1" />
    <line x1="13" y1="8" x2="13.5" y2="24" stroke="#808080" strokeWidth="1" />
    <line x1="16" y1="8" x2="16" y2="24" stroke="#808080" strokeWidth="1" />
    <line x1="19" y1="8" x2="18.5" y2="24" stroke="#808080" strokeWidth="1" />
    <line x1="22" y1="8" x2="21" y2="24" stroke="#808080" strokeWidth="1" />
    {/* Horizontal Mesh rings */}
    <path d="M8 12H24" stroke="#808080" strokeWidth="1" />
    <path d="M9 18H23" stroke="#808080" strokeWidth="1" />
  </svg>
);

export const RecycleBinFullIcon: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} style={{ shapeRendering: 'crispEdges' }}>
    {/* Trash papers inside */}
    <path d="M10 2L13 7L8 8L10 2Z" fill="#ffffff" stroke="#808080" />
    <path d="M16 1L20 6L15 7L16 1Z" fill="#ffffff" stroke="#808080" />
    <path d="M22 3L23 8L19 7L22 3Z" fill="#3080c0" stroke="#000000" />
    {/* Bin Rim */}
    <ellipse cx="16" cy="6" rx="9" ry="2.5" fill="#c0c0c0" stroke="#808080" strokeWidth="1.5" />
    {/* Bin Body */}
    <path d="M7 6L9 26H23L25 6" fill="#c0c0c0" stroke="#808080" strokeWidth="1.5" />
    {/* Metal Mesh Lines */}
    <line x1="10" y1="8" x2="11" y2="24" stroke="#808080" strokeWidth="1" />
    <line x1="13" y1="8" x2="13.5" y2="24" stroke="#808080" strokeWidth="1" />
    <line x1="16" y1="8" x2="16" y2="24" stroke="#808080" strokeWidth="1" />
    <line x1="19" y1="8" x2="18.5" y2="24" stroke="#808080" strokeWidth="1" />
    <line x1="22" y1="8" x2="21" y2="24" stroke="#808080" strokeWidth="1" />
    {/* Horizontal Mesh rings */}
    <path d="M8 12H24" stroke="#808080" strokeWidth="1" />
    <path d="M9 18H23" stroke="#808080" strokeWidth="1" />
  </svg>
);

export const Windows95LogoIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} style={{ shapeRendering: 'crispEdges' }}>
    {/* Red Panel */}
    <path d="M2 3C4.5 2.5 7.5 3 9 4.5V11C7.5 9.5 4.5 9 2 9.5V3Z" fill="#ff0000" />
    {/* Green Panel */}
    <path d="M10 4.5C11.5 3 14.5 2.5 17 3V9.5C14.5 9 11.5 9.5 10 11V4.5Z" fill="#00cc00" />
    {/* Blue Panel */}
    <path d="M2 10.5C4.5 10 7.5 10.5 9 12V18.5C7.5 17 4.5 16.5 2 17V10.5Z" fill="#0000ff" />
    {/* Yellow Panel */}
    <path d="M10 12C11.5 10.5 14.5 10 17 10.5V17C14.5 16.5 11.5 17 10 18.5V12Z" fill="#ffcc00" />
    {/* Black trails (trail pixels) */}
    <rect x="1" y="5" width="1" height="1" fill="#000" />
    <rect x="0" y="8" width="1" height="1" fill="#000" />
    <rect x="18" y="6" width="1" height="1" fill="#000" />
    <rect x="19" y="9" width="1" height="1" fill="#000" />
  </svg>
);

export const SoundIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} style={{ shapeRendering: 'crispEdges' }}>
    <path d="M2 5H5L9 1V15L5 11H2V5Z" fill="#000000" />
    {/* Sound waves */}
    <path d="M11 5C12 6 12 10 11 11" stroke="#000000" strokeWidth="1.5" fill="none" />
    <path d="M13 3C15 5 15 11 13 13" stroke="#000000" strokeWidth="1.5" fill="none" />
  </svg>
);

export const RunIcon: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ shapeRendering: 'crispEdges' }}>
    <rect x="2" y="2" width="20" height="20" fill="#ffffff" />
    <rect x="3" y="3" width="18" height="18" fill="#c0c0c0" />
    {/* Window graphic in Run icon */}
    <rect x="5" y="5" width="10" height="8" fill="#000080" />
    <rect x="6" y="7" width="8" height="5" fill="#ffffff" />
    {/* Arrow/Run path */}
    <path d="M10 16L18 10L14 8L15 14L10 16Z" fill="#ff0000" />
  </svg>
);

export const ShutDownIcon: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ shapeRendering: 'crispEdges' }}>
    <circle cx="12" cy="12" r="8" stroke="#ff0000" strokeWidth="2.5" fill="none" />
    <line x1="12" y1="4" x2="12" y2="12" stroke="#ff0000" strokeWidth="2.5" />
  </svg>
);

export const HelpIcon: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ shapeRendering: 'crispEdges' }}>
    <circle cx="12" cy="12" r="10" fill="#c0c0c0" stroke="#000080" strokeWidth="2" />
    <text x="12" y="17" fill="#000080" fontFamily="sans-serif" fontSize="14" fontWeight="bold" textAnchor="middle">?</text>
  </svg>
);
