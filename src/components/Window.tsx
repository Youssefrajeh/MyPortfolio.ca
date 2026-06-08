import React, { useState, useEffect, useRef } from 'react';

interface WindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isActive: boolean;
  onFocus: () => void;
  defaultX?: number;
  defaultY?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  icon?: React.ReactNode;
  menuItems?: { label: string; onClick?: () => void }[];
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({
  id,
  title,
  isOpen,
  isMinimized,
  isMaximized,
  onClose,
  onMinimize,
  onMaximize,
  isActive,
  onFocus,
  defaultX = 50,
  defaultY = 50,
  defaultWidth = 500,
  defaultHeight = 400,
  icon,
  menuItems = [
    { label: 'File' },
    { label: 'Edit' },
    { label: 'Search' },
    { label: 'Help' }
  ],
  children
}) => {
  const [position, setPosition] = useState({ x: defaultX, y: defaultY });
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);

  // Initialize random offset to avoid windows overlapping perfectly
  useEffect(() => {
    const randomOffset = Math.floor(Math.random() * 30);
    setPosition({ x: defaultX + randomOffset, y: defaultY + randomOffset });
  }, [defaultX, defaultY]);

  // Clean up global listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    
    const newX = Math.max(0, Math.min(window.innerWidth - 150, dragRef.current.posX + dx));
    const newY = Math.max(0, Math.min(window.innerHeight - 80, dragRef.current.posY + dy));
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    dragRef.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMaximized) return;
    onFocus();
    const touch = e.touches[0];
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      posX: position.x,
      posY: position.y
    };
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!dragRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragRef.current.startX;
    const dy = touch.clientY - dragRef.current.startY;
    
    const newX = Math.max(0, Math.min(window.innerWidth - 100, dragRef.current.posX + dx));
    const newY = Math.max(0, Math.min(window.innerHeight - 80, dragRef.current.posY + dy));
    
    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    dragRef.current = null;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  if (!isOpen || isMinimized) return null;

  const style: React.CSSProperties = isMaximized
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 'calc(100% - 40px)', // Subtract taskbar height
        zIndex: isActive ? 40 : 30,
      }
    : {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${defaultWidth}px`,
        height: `${defaultHeight}px`,
        zIndex: isActive ? 40 : 30,
      };

  return (
    <div
      data-window-id={id}
      onClick={onFocus}
      style={style}
      className="win95-raised flex flex-col p-1 select-none pointer-events-auto"
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={onMaximize}
        className={`flex items-center justify-between p-1 cursor-default ${
          isActive
            ? 'bg-gradient-to-r from-[#000080] to-[#1084d0] text-white'
            : 'bg-[#808080] text-[#c0c0c0]'
        }`}
      >
        <div className="flex items-center gap-1.5 font-bold truncate pr-4 text-sm">
          {icon && <span className="flex items-center">{icon}</span>}
          <span className="select-none tracking-wide truncate">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Minimize Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="win95-button w-4 h-4 p-0 text-xs font-bold leading-none flex items-center justify-center"
            title="Minimize"
          >
            <span style={{ transform: 'translateY(-2px)' }}>_</span>
          </button>
          
          {/* Maximize Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
            className="win95-button w-4 h-4 p-0 text-xs font-bold leading-none flex items-center justify-center"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? (
              <div className="w-2.5 h-2.5 border border-black relative">
                <div className="w-1.5 h-1.5 border-t border-l border-black absolute -top-[3px] -left-[3px] bg-[#c0c0c0]" />
              </div>
            ) : (
              <div className="w-2.5 h-2.5 border-2 border-black" />
            )}
          </button>
          
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="win95-button w-4 h-4 p-0 text-xs font-bold leading-none flex items-center justify-center ml-0.5"
            title="Close"
          >
            <span>X</span>
          </button>
        </div>
      </div>

      {/* Menu Bar */}
      {menuItems && menuItems.length > 0 && (
        <div className="flex items-center gap-4 py-1 px-1.5 border-b border-white text-xs select-none">
          {menuItems.map((item, index) => (
            <span
              key={index}
              onClick={item.onClick}
              className="cursor-default hover:bg-[#000080] hover:text-white px-1.5 py-0.5"
            >
              {item.label}
            </span>
          ))}
        </div>
      )}

      {/* Window Body Container */}
      <div className="win95-sunken flex-1 overflow-auto bg-white p-4 relative pointer-events-auto">
        {children}
      </div>
    </div>
  );
};

export default Window;
