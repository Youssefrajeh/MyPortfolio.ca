import React, { useState, useEffect } from 'react';
import { Windows95LogoIcon, SoundIcon } from './RetroIcons';

interface TaskbarProps {
  windows: {
    id: string;
    title: string;
    isOpen: boolean;
    isMinimized: boolean;
    isActive: boolean;
    icon?: React.ReactNode;
  }[];
  onToggleStartMenu: (e: React.MouseEvent) => void;
  isStartMenuOpen: boolean;
  onTaskClick: (id: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  onToggleStartMenu,
  isStartMenuOpen,
  onTaskClick
}) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const strMinutes = minutes < 10 ? '0' + minutes : minutes;
      setTime(`${hours}:${strMinutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000); // Update every 10 seconds is fine
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="win95-raised fixed bottom-0 left-0 w-full h-[40px] z-50 flex items-center justify-between px-1 border-t-2 select-none">
      {/* Start Button & Tasks Container */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0 h-full py-0.5">
        {/* Start Button */}
        <button
          onClick={onToggleStartMenu}
          className={`win95-button h-full px-2 flex items-center gap-1.5 font-bold ${
            isStartMenuOpen ? 'win95-button-pressed' : ''
          }`}
          style={{ width: '80px' }}
        >
          <Windows95LogoIcon size={18} />
          <span className="text-sm">Start</span>
        </button>

        {/* Separator vertical line */}
        <div className="w-[2px] h-[28px] bg-[#808080] border-r border-white mx-1" />

        {/* Running Tasks list */}
        <div className="flex items-center gap-1 overflow-x-auto h-full flex-1 scrollbar-none">
          {windows
            .filter((win) => win.isOpen)
            .map((win) => (
              <button
                key={win.id}
                onClick={() => onTaskClick(win.id)}
                className={`win95-button h-full text-left justify-start px-2 gap-1.5 text-xs truncate max-w-[150px] min-w-[80px] ${
                  win.isActive ? 'win95-button-pressed font-bold' : ''
                }`}
              >
                {win.icon && <span className="flex-shrink-0 flex items-center">{win.icon}</span>}
                <span className="truncate">{win.title}</span>
              </button>
            ))}
        </div>
      </div>

      <div className="win95-sunken-gray h-full flex items-center gap-2.5 px-3 ml-2 text-xs py-0.5 border-2">
        <span title="Volume" className="opacity-70 cursor-pointer flex items-center">
          <SoundIcon size={14} />
        </span>
        {/* Separator vertical */}
        <div className="w-[1px] h-[16px] bg-[#808080] border-r border-white" />
        <span className="font-medium tabular-nums">{time}</span>
      </div>
    </div>
  );
};

export default Taskbar;
