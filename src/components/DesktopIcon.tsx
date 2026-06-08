import React, { useRef } from 'react';

interface DesktopIconProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({
  id,
  title,
  icon,
  isSelected,
  onClick,
  onDoubleClick
}) => {
  const lastTapRef = useRef<number>(0);

  // Custom touch handler for mobile (since double-click isn't native/easy)
  const handleTouchEnd = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected -> Open
      onDoubleClick();
    } else {
      // Single tap -> Select
      // Synthesize mouse event to trigger parent's click selection handler
      const mockEvent = {
        stopPropagation: () => {},
        preventDefault: () => {}
      } as unknown as React.MouseEvent;
      onClick(mockEvent);
    }
    lastTapRef.current = now;
  };

  return (
    <div
      id={id}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onTouchEnd={handleTouchEnd}
      className={`desktop-icon-container group ${
        isSelected ? 'desktop-icon-selected' : ''
      }`}
    >
      {/* Icon Image Graphic */}
      <div className="desktop-icon-image flex items-center justify-center p-1 w-[42px] h-[42px] select-none rounded">
        {icon}
      </div>
      {/* Title label */}
      <span className="desktop-icon-text truncate max-w-[85px] leading-tight select-none">
        {title}
      </span>
    </div>
  );
};

export default DesktopIcon;
