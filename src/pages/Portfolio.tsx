import React, { useState, useEffect } from 'react';
import DesktopIcon from '../components/DesktopIcon';
import Window from '../components/Window';
import StartMenu from '../components/StartMenu';
import Taskbar from '../components/Taskbar';

// Icons
import {
  ComputerIcon,
  NetworkIcon,
  FolderIcon,
  NotepadIcon,
  WordPadIcon,
  MailIcon,
  MinesweeperIcon,
  PaintIcon,
  RecycleBinEmptyIcon,
  RecycleBinFullIcon
} from '../components/RetroIcons';

// Sections
import About from '../sections/About';
import Experience from '../sections/Experience';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';

// Games & Apps
import Minesweeper from '../components/Minesweeper';
import Paint from '../components/Paint';

interface WindowItem {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  defaultX: number;
  defaultY: number;
  defaultWidth: number;
  defaultHeight: number;
  icon: React.ReactNode;
}

const Portfolio: React.FC = () => {
  const [windows, setWindows] = useState<WindowItem[]>([
    {
      id: 'about',
      title: 'About Me.txt - Notepad',
      isOpen: true, // Open by default
      isMinimized: false,
      isMaximized: false,
      defaultX: 60,
      defaultY: 40,
      defaultWidth: 460,
      defaultHeight: 340,
      icon: <NotepadIcon size={16} />
    },
    {
      id: 'experience',
      title: 'Experience.doc - WordPad',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      defaultX: 120,
      defaultY: 80,
      defaultWidth: 550,
      defaultHeight: 450,
      icon: <WordPadIcon size={16} />
    },
    {
      id: 'skills',
      title: 'Skills Folder',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      defaultX: 180,
      defaultY: 120,
      defaultWidth: 480,
      defaultHeight: 380,
      icon: <FolderIcon size={16} />
    },
    {
      id: 'projects',
      title: 'Projects Folder',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      defaultX: 80,
      defaultY: 160,
      defaultWidth: 550,
      defaultHeight: 400,
      icon: <FolderIcon size={16} />
    },
    {
      id: 'contact',
      title: 'Contact Mail client',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      defaultX: 240,
      defaultY: 100,
      defaultWidth: 560,
      defaultHeight: 440,
      icon: <MailIcon size={16} />
    },
    {
      id: 'minesweeper',
      title: 'Minesweeper',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      defaultX: 300,
      defaultY: 60,
      defaultWidth: 265,
      defaultHeight: 325,
      icon: <MinesweeperIcon size={16} />
    },
    {
      id: 'paint',
      title: 'MS Paint',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      defaultX: 140,
      defaultY: 100,
      defaultWidth: 510,
      defaultHeight: 410,
      icon: <PaintIcon size={16} />
    },
    {
      id: 'computer',
      title: 'System Properties',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      defaultX: 100,
      defaultY: 60,
      defaultWidth: 320,
      defaultHeight: 280,
      icon: <ComputerIcon size={16} />
    },
    {
      id: 'trash',
      title: 'Recycle Bin',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      defaultX: 220,
      defaultY: 140,
      defaultWidth: 340,
      defaultHeight: 280,
      icon: <RecycleBinEmptyIcon size={16} />
    }
  ]);

  const [activeWindowId, setActiveWindowId] = useState<string | null>('about');
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [showShutDownDialog, setShowShutDownDialog] = useState(false);
  const [isShutDown, setIsShutDown] = useState(false);
  const [isSafeToTurnOff, setIsSafeToTurnOff] = useState(false);
  const [showRunDialog, setShowRunDialog] = useState(false);
  const [runCommand, setRunCommand] = useState('');
  const [runError, setRunError] = useState<string | null>(null);
  const [trashFiles, setTrashFiles] = useState<string[]>([
    'Legacy Portfolio.lnk',
    'Boring Design.doc',
    'TailwindCSS.bak'
  ]);
  const [trashFull, setTrashFull] = useState(true);

  // Detect mobile for auto-maximizing windows
  const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

  // Auto-maximize the default open window on mobile screens
  useEffect(() => {
    if (isMobile()) {
      setWindows((prev) =>
        prev.map((win) => win.isOpen ? { ...win, isMaximized: true } : win)
      );
    }
  }, []);

  // Click outside start menu to close it
  useEffect(() => {
    const handleOutsideClick = () => {
      setIsStartMenuOpen(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const openWindow = (id: string) => {
    const mobile = isMobile();
    setWindows((prev) =>
      prev.map((win) =>
        win.id === id
          ? { ...win, isOpen: true, isMinimized: false, isMaximized: mobile ? true : win.isMaximized }
          : win
      )
    );
    setActiveWindowId(id);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, isOpen: false } : win))
    );
    if (activeWindowId === id) {
      // Find another open window to focus
      const remaining = windows.filter((w) => w.id !== id && w.isOpen && !w.isMinimized);
      if (remaining.length > 0) {
        setActiveWindowId(remaining[remaining.length - 1].id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, isMinimized: true } : win))
    );
    if (activeWindowId === id) {
      // Focus another window
      const remaining = windows.filter((w) => w.id !== id && w.isOpen && !w.isMinimized);
      if (remaining.length > 0) {
        setActiveWindowId(remaining[remaining.length - 1].id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const toggleMaximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((win) =>
        win.id === id ? { ...win, isMaximized: !win.isMaximized } : win
      )
    );
  };

  const focusWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((win) =>
        win.id === id ? { ...win, isMinimized: false } : win
      )
    );
    setActiveWindowId(id);
  };

  const handleTaskClick = (id: string) => {
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    if (win.isMinimized) {
      // Restore and focus
      openWindow(id);
    } else if (activeWindowId === win.id) {
      // Minimize
      minimizeWindow(id);
    } else {
      // Focus
      focusWindow(id);
    }
  };

  // Run Command execution
  const executeRunCommand = () => {
    const cmd = runCommand.trim().toLowerCase();
    if (!cmd) return;

    const matchedWin = windows.find(
      (w) => w.id === cmd || (cmd === 'wordpad' && w.id === 'experience') || (cmd === 'notepad' && w.id === 'about')
    );

    if (matchedWin) {
      openWindow(matchedWin.id);
      setShowRunDialog(false);
      setRunCommand('');
      setRunError(null);
    } else if (cmd === 'calc' || cmd === 'calculator') {
      openWindow('minesweeper');
      setShowRunDialog(false);
      setRunCommand('');
      setRunError(null);
      alert('Windows 95 Calculator is out of order. Minesweeper has been loaded instead!');
    } else if (cmd === 'shutdown' || cmd === 'exit') {
      setShowRunDialog(false);
      setRunCommand('');
      setRunError(null);
      setShowShutDownDialog(true);
    } else {
      setRunError(`Windows cannot find '${runCommand}'. Make sure you typed the name correctly, and then try again.`);
    }
  };

  // Desktop Icons config
  const desktopIcons = [
    {
      id: 'computer',
      title: 'My Computer',
      icon: <ComputerIcon size={32} />
    },
    {
      id: 'network',
      title: 'Network Neighborhood',
      icon: <NetworkIcon size={32} />
    },
    {
      id: 'trash',
      title: 'Recycle Bin',
      icon: trashFull ? <RecycleBinFullIcon size={32} /> : <RecycleBinEmptyIcon size={32} />
    },
    {
      id: 'about',
      title: 'About Me.txt',
      icon: <NotepadIcon size={32} />
    },
    {
      id: 'experience',
      title: 'Experience.doc',
      icon: <WordPadIcon size={32} />
    },
    {
      id: 'skills',
      title: 'Skills Folder',
      icon: <FolderIcon size={32} />
    },
    {
      id: 'projects',
      title: 'Projects Folder',
      icon: <FolderIcon size={32} />
    },
    {
      id: 'contact',
      title: 'Contact Mail Client.lnk',
      icon: <MailIcon size={32} />
    },
    {
      id: 'minesweeper',
      title: 'Minesweeper.exe',
      icon: <MinesweeperIcon size={32} />
    },
    {
      id: 'paint',
      title: 'MS Paint.exe',
      icon: <PaintIcon size={32} />
    }
  ];

  // Helper to map window components
  const renderWindowContent = (id: string) => {
    switch (id) {
      case 'about':
        return <About />;
      case 'experience':
        return <Experience />;
      case 'skills':
        return <Skills />;
      case 'projects':
        return <Projects />;
      case 'contact':
        return <Contact />;
      case 'minesweeper':
        return <Minesweeper />;
      case 'paint':
        return <Paint />;
      case 'computer':
        return (
          <div className="flex flex-col gap-3 font-sans text-xs text-black">
            <div className="flex gap-4">
              <div className="text-4xl flex items-center justify-center">💻</div>
              <div className="flex-1">
                <h2 className="font-bold text-sm mb-1">System Properties</h2>
                <div className="h-[1px] bg-[#808080] border-b border-white my-1.5" />
                <p className="font-bold text-[#000080] mb-0.5">System:</p>
                <p className="pl-3 mb-2 text-gray-800">Microsoft Windows 95<br />Version 4.00.950 B (OSR2)</p>
                
                <p className="font-bold text-[#000080] mb-0.5">Computer:</p>
                <p className="pl-3 mb-2 text-gray-800">GenuineIntel Pentium(R) II Processor<br />32.0 MB RAM<br />Hard Disk (C:) 1.2 GB Capacity</p>
                
                <p className="font-bold text-[#000080] mb-0.5">Registered to:</p>
                <p className="pl-3 text-gray-800 font-semibold">Youssef Rajeh<br />GPA: 3.9 / 4.0</p>
              </div>
            </div>
          </div>
        );
      case 'trash':
        return (
          <div className="flex flex-col h-full bg-[#c0c0c0] text-black font-sans text-xs">
            <div className="win95-raised p-1 border-b border-[#808080] flex items-center gap-1.5 select-none">
              <button 
                onClick={() => {
                  setTrashFiles([]);
                  setTrashFull(false);
                }} 
                disabled={trashFiles.length === 0}
                className="win95-button py-0.5 px-2 font-bold text-xs"
              >
                Empty Recycle Bin
              </button>
            </div>
            <div className="win95-sunken bg-white p-3 border-2 flex-1 overflow-auto min-h-[140px] select-none">
              {trashFiles.length === 0 ? (
                <div className="text-gray-400 text-center py-8">Recycle Bin is empty.</div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {trashFiles.map((file) => (
                    <div key={file} className="flex items-center gap-2 p-1 border border-transparent hover:bg-gray-100 rounded">
                      <span className="text-base select-none">📄</span>
                      <span className="font-mono text-[11px] truncate">{file}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Click handler for desktop background to deselect icons
  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedIconId(null);
    }
  };

  // Render Shut Down screen
  if (isShutDown) {
    return (
      <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center font-mono select-none text-center">
        {!isSafeToTurnOff ? (
          <div className="text-orange-500 text-xl font-bold flex flex-col items-center gap-4">
            <div className="animate-pulse">Windows is shutting down...</div>
          </div>
        ) : (
          <div className="text-[#a05000] text-lg font-semibold flex flex-col items-center gap-6 max-w-md px-6">
            <div>It is now safe to turn off your computer.</div>
            <button
              onClick={() => {
                setIsShutDown(false);
                setIsSafeToTurnOff(false);
                // Re-open About Me by default
                setWindows((prev) =>
                  prev.map((win) => ({
                    ...win,
                    isOpen: win.id === 'about',
                    isMinimized: false,
                    isMaximized: false
                  }))
                );
                setActiveWindowId('about');
              }}
              className="win95-button text-xs font-semibold py-1.5 px-4 text-black border-2 border-orange-700 bg-[#c0c0c0]"
            >
              Restart Portfolio
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={handleDesktopClick}
      className="win95-desktop w-screen h-screen flex flex-col relative select-none"
    >
      {/* ── Mobile / Tablet Funny Warning Overlay ── */}
      <div className="md:hidden fixed inset-0 z-[999] bg-[#008080] flex items-center justify-center p-4 pointer-events-auto">
        {/* Tiled desktop background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #007070 0px, #007070 1px, transparent 1px, transparent 8px)`,
          }}
        />

        {/* The Win95 error dialog box */}
        <div className="win95-raised border-2 w-full max-w-sm relative z-10">
          {/* Title Bar */}
          <div className="flex items-center justify-between p-1.5 bg-gradient-to-r from-[#000080] to-[#1084d0] text-white select-none">
            <div className="flex items-center gap-2 font-bold text-sm">
              <span>⚠️</span>
              <span>CRITICAL ERROR</span>
            </div>
            <button className="win95-button w-5 h-5 p-0 text-xs font-bold flex items-center justify-center border-2">
              X
            </button>
          </div>

          {/* Dialog Body */}
          <div className="bg-[#c0c0c0] p-5 flex flex-col gap-4">
            {/* Error icon + message row */}
            <div className="flex items-start gap-4">
              {/* Classic Windows stop icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-600 border-4 border-red-800 flex items-center justify-center text-white font-black text-2xl shadow-md">
                🛑
              </div>
              <div className="flex flex-col gap-1 text-xs font-sans text-black">
                <p className="font-bold text-sm leading-snug">
                  Wrong device detected.
                </p>
                <p className="leading-relaxed text-gray-800">
                  This portfolio requires a{' '}
                  <span className="font-bold underline">laptop or desktop computer</span>{' '}
                  to function properly.
                </p>
                <p className="leading-relaxed text-gray-800 italic mt-1">
                  "Open this on a laptop — I have a life to live."
                </p>
                <p className="text-[10px] text-gray-600 mt-2 font-mono">
                  Error code: MOBILE_SCREEN_TOO_SMOL_0x0001
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-[#808080] border-b border-white" />

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 select-none">
              <a
                href="mailto:?subject=Check%20this%20out&body=https://youssefrajeh.com"
                className="win95-button text-xs font-bold py-1.5 px-4 border-2 hover:no-underline text-black"
              >
                📧 Email link to myself
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Hide the overlay by removing the md:hidden's parent
                  const overlay = (e.target as HTMLElement).closest('.md\\:hidden');
                  if (overlay) (overlay as HTMLElement).style.display = 'none';
                }}
                className="win95-button text-xs font-bold py-1.5 px-4 border-2 text-gray-600"
              >
                Continue anyway 🥲
              </button>
            </div>

            {/* Fine print */}
            <p className="text-[9px] text-gray-500 text-center font-mono">
              Windows 95™ is not responsible for any neck pain incurred from squinting at this portfolio on a 5-inch screen.
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Icons Left Column */}
      <div 
        className="flex-1 flex flex-col flex-wrap items-start justify-start p-2 gap-1 content-start select-none z-10"
        style={{ height: 'calc(100vh - 40px)' }}
      >
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            title={icon.title}
            icon={icon.icon}
            isSelected={selectedIconId === icon.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIconId(icon.id);
            }}
            onDoubleClick={() => {
              if (icon.id === 'network') {
                alert('Network Neighborhood: No other computers found on this local workgroup.');
              } else {
                openWindow(icon.id);
              }
            }}
          />
        ))}
      </div>

      {/* Render Draggable Windows */}
      {windows.map((win) => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          isOpen={win.isOpen}
          isMinimized={win.isMinimized}
          isMaximized={win.isMaximized}
          isActive={activeWindowId === win.id}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onMaximize={() => toggleMaximizeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
          defaultX={win.defaultX}
          defaultY={win.defaultY}
          defaultWidth={win.defaultWidth}
          defaultHeight={win.defaultHeight}
          icon={win.icon}
        >
          {renderWindowContent(win.id)}
        </Window>
      ))}

      {/* Start Menu */}
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onOpenWindow={openWindow}
        onTriggerShutDown={() => setShowShutDownDialog(true)}
        onTriggerRun={() => setShowRunDialog(true)}
      />

      {/* Bottom Taskbar */}
      <Taskbar
        windows={windows.map((w) => ({
          id: w.id,
          title: w.title.split(' - ')[0],
          isOpen: w.isOpen,
          isMinimized: w.isMinimized,
          isActive: activeWindowId === w.id,
          icon: w.icon
        }))}
        onToggleStartMenu={(e) => {
          e.stopPropagation();
          setIsStartMenuOpen(!isStartMenuOpen);
        }}
        isStartMenuOpen={isStartMenuOpen}
        onTaskClick={handleTaskClick}
      />

      {/* Run Dialog Box */}
      {showRunDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 pointer-events-auto">
          <div className="win95-raised p-1 w-[360px] flex flex-col border-2 select-none text-black">
            {/* Title Bar */}
            <div className="flex items-center justify-between p-1 bg-gradient-to-r from-[#000080] to-[#1084d0] text-white font-bold text-xs">
              <span className="flex items-center gap-1.5">🏃 Run</span>
              <button 
                onClick={() => {
                  setShowRunDialog(false);
                  setRunError(null);
                }} 
                className="win95-button w-4 h-4 p-0 text-xs font-bold leading-none flex items-center justify-center"
              >
                X
              </button>
            </div>
            {/* Body */}
            <div className="p-4 bg-[#c0c0c0] flex flex-col gap-3">
              <div className="flex gap-3">
                <span className="text-3xl">🏃</span>
                <div className="text-xs">
                  Type the name of a program, folder, or document, and Windows will open it for you.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span>Open:</span>
                <input
                  type="text"
                  value={runCommand}
                  onChange={(e) => setRunCommand(e.target.value)}
                  className="flex-1 win95-sunken bg-white px-2 py-1 text-black font-mono text-xs select-text focus:outline-none"
                  placeholder="e.g. minesweeper, paint, about, contact"
                  onKeyDown={(e) => e.key === 'Enter' && executeRunCommand()}
                  autoFocus
                />
              </div>

              {runError && (
                <div className="text-[10px] text-red-700 bg-red-100 border border-red-400 p-1.5">
                  ⚠️ {runError}
                </div>
              )}

              <div className="flex justify-end gap-2 select-none mt-2">
                <button
                  onClick={executeRunCommand}
                  className="win95-button text-xs font-semibold py-1 px-4 border-2"
                >
                  OK
                </button>
                <button
                  onClick={() => {
                    setShowRunDialog(false);
                    setRunError(null);
                  }}
                  className="win95-button text-xs font-semibold py-1 px-4 border-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shut Down Dialog Box */}
      {showShutDownDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 pointer-events-auto">
          <div className="win95-raised p-1 w-[300px] flex flex-col border-2 select-none text-black">
            {/* Title Bar */}
            <div className="flex items-center justify-between p-1 bg-gradient-to-r from-[#000080] to-[#1084d0] text-white font-bold text-xs">
              <span className="flex items-center gap-1.5">💻 Shut Down Windows</span>
              <button 
                onClick={() => setShowShutDownDialog(false)} 
                className="win95-button w-4 h-4 p-0 text-xs font-bold leading-none flex items-center justify-center"
              >
                X
              </button>
            </div>
            {/* Body */}
            <div className="p-4 bg-[#c0c0c0] flex flex-col gap-4">
              <div className="flex gap-3">
                <span className="text-3xl">💻</span>
                <div className="text-xs">
                  Are you sure you want to:
                  <div className="mt-2.5 space-y-1.5 font-semibold">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="shutdown_opt" defaultChecked className="cursor-pointer" /> Shut down the computer?
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer opacity-50">
                      <input type="radio" name="shutdown_opt" disabled className="cursor-pointer" /> Restart the computer?
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 select-none">
                <button
                  onClick={() => {
                    setShowShutDownDialog(false);
                    setIsShutDown(true);
                    setTimeout(() => {
                      setIsSafeToTurnOff(true);
                    }, 2500);
                  }}
                  className="win95-button text-xs font-semibold py-1 px-4 border-2"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowShutDownDialog(false)}
                  className="win95-button text-xs font-semibold py-1 px-4 border-2"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
