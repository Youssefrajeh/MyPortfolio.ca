import React, { useState } from 'react';
import { 
  FolderIcon, 
  NotepadIcon, 
  WordPadIcon, 
  MailIcon, 
  MinesweeperIcon, 
  PaintIcon, 
  HelpIcon,
  RunIcon,
  ShutDownIcon
} from './RetroIcons';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWindow: (id: string) => void;
  onTriggerShutDown: () => void;
  onTriggerRun: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onOpenWindow,
  onTriggerShutDown,
  onTriggerRun
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleItemClick = (windowId: string) => {
    onOpenWindow(windowId);
    onClose();
  };

  return (
    <div 
      className="win95-raised fixed left-0 bottom-[40px] z-50 flex select-none w-60 border-2"
      style={{ minHeight: '280px' }}
      onMouseLeave={() => setActiveSubmenu(null)}
    >
      {/* Sidebar (Vertical blue strip) */}
      <div 
        className="w-8 flex flex-col justify-end items-center py-2"
        style={{
          background: 'linear-gradient(180deg, #000080 0%, #1084d0 100%)',
        }}
      >
        <span 
          className="text-white font-bold tracking-widest text-lg select-none whitespace-nowrap"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          Windows<span className="font-normal text-slate-300 ml-1">95</span>
        </span>
      </div>

      {/* Main Menu Items */}
      <div className="flex-1 flex flex-col bg-[#c0c0c0] relative py-1 text-xs">
        {/* Programs */}
        <div 
          className={`flex items-center justify-between px-3 py-2 cursor-default hover:bg-[#000080] hover:text-white group relative ${
            activeSubmenu === 'programs' ? 'bg-[#000080] text-white' : ''
          }`}
          onMouseEnter={() => setActiveSubmenu('programs')}
        >
          <div className="flex items-center gap-3">
            <FolderIcon size={20} />
            <span className="font-semibold">Programs</span>
          </div>
          <span>▶</span>

          {/* Programs Cascading Submenu */}
          {activeSubmenu === 'programs' && (
            <div className="win95-raised absolute left-full top-0 ml-0.5 z-[60] w-48 flex flex-col py-1 text-black bg-[#c0c0c0] border-2">
              <div 
                onClick={() => handleItemClick('about')}
                className="flex items-center gap-3 px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default"
              >
                <NotepadIcon size={16} />
                <span>About Me.txt</span>
              </div>
              <div 
                onClick={() => handleItemClick('experience')}
                className="flex items-center gap-3 px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default"
              >
                <WordPadIcon size={16} />
                <span>Experience.doc</span>
              </div>
              <div 
                onClick={() => handleItemClick('skills')}
                className="flex items-center gap-3 px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default"
              >
                <FolderIcon size={16} />
                <span>Skills Folder</span>
              </div>
              <div 
                onClick={() => handleItemClick('projects')}
                className="flex items-center gap-3 px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default"
              >
                <FolderIcon size={16} />
                <span>Projects Folder</span>
              </div>
              <div 
                onClick={() => handleItemClick('contact')}
                className="flex items-center gap-3 px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default"
              >
                <MailIcon size={16} />
                <span>Contact Client</span>
              </div>
              <div className="h-[1px] bg-[#808080] my-1 mx-2 border-b border-white" />
              <div 
                onClick={() => handleItemClick('minesweeper')}
                className="flex items-center gap-3 px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default"
              >
                <MinesweeperIcon size={16} />
                <span>Minesweeper.exe</span>
              </div>
              <div 
                onClick={() => handleItemClick('paint')}
                className="flex items-center gap-3 px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-default"
              >
                <PaintIcon size={16} />
                <span>MS Paint.exe</span>
              </div>
            </div>
          )}
        </div>

        {/* Documents */}
        <a 
          href="/Youssef Rajeh.pdf" 
          download 
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 cursor-default hover:bg-[#000080] hover:text-white text-[#000] hover:no-underline"
          onMouseEnter={() => setActiveSubmenu(null)}
        >
          <WordPadIcon size={20} />
          <span className="font-semibold">Documents (CV.pdf)</span>
        </a>

        {/* Divider */}
        <div className="h-[1px] bg-[#808080] my-1.5 mx-1 border-b border-white" />

        {/* Help */}
        <div 
          onClick={() => handleItemClick('computer')}
          className="flex items-center gap-3 px-3 py-2 cursor-default hover:bg-[#000080] hover:text-white"
          onMouseEnter={() => setActiveSubmenu(null)}
        >
          <HelpIcon size={20} />
          <span className="font-semibold">Help (My Computer)</span>
        </div>

        {/* Run */}
        <div 
          onClick={() => {
            onTriggerRun();
            onClose();
          }}
          className="flex items-center gap-3 px-3 py-2 cursor-default hover:bg-[#000080] hover:text-white"
          onMouseEnter={() => setActiveSubmenu(null)}
        >
          <RunIcon size={20} />
          <span className="font-semibold">Run...</span>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[#808080] my-1.5 mx-1 border-b border-white" />

        {/* Shut Down */}
        <div 
          onClick={() => {
            onTriggerShutDown();
            onClose();
          }}
          className="flex items-center gap-3 px-3 py-2 cursor-default hover:bg-[#000080] hover:text-white mb-1"
          onMouseEnter={() => setActiveSubmenu(null)}
        >
          <ShutDownIcon size={20} />
          <span className="font-semibold">Shut Down...</span>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
