import React, { useState, useEffect, useRef } from 'react';

const COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'
];

const Paint: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const [isDrawing, setIsDrawing] = useState(false);
  const prevPos = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas with white background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    prevPos.current = coords;
    
    // Draw single dot on tap/click
    draw(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !prevPos.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const coords = getCoordinates(e);
    if (!ctx || !coords) return;

    ctx.beginPath();
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.moveTo(prevPos.current.x, prevPos.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    prevPos.current = coords;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    prevPos.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-[#c0c0c0] font-sans text-black select-none h-full">
      {/* Tool panel */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 win95-raised border">
        {/* Tool Mode Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTool('pencil')}
            className={`win95-button text-xs py-1 px-2.5 font-bold ${
              tool === 'pencil' ? 'win95-button-pressed font-extrabold' : ''
            }`}
          >
            ✏️ Pencil
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`win95-button text-xs py-1 px-2.5 font-bold ${
              tool === 'eraser' ? 'win95-button-pressed font-extrabold' : ''
            }`}
          >
            🧽 Eraser
          </button>
          <button
            onClick={clearCanvas}
            className="win95-button text-xs py-1 px-2.5 font-bold"
          >
            🗑️ Clear
          </button>
        </div>

        {/* Brush Size Selector */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span>Brush Size:</span>
          {[1, 3, 5, 8, 12].map((size) => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={`win95-button w-6 h-6 flex items-center justify-center p-0 font-bold ${
                brushSize === size ? 'win95-button-pressed' : ''
              }`}
            >
              <div 
                className="bg-black rounded-full" 
                style={{ width: `${Math.max(1, size - 2)}px`, height: `${Math.max(1, size - 2)}px` }} 
              />
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="win95-sunken bg-white border-2 flex-1 relative min-h-[220px]">
        <canvas
          ref={canvasRef}
          width={450}
          height={260}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair bg-white"
        />
      </div>

      {/* Color Palette Panel */}
      <div className="win95-raised border p-1.5 flex items-center gap-2">
        {/* Selected Color preview */}
        <div className="win95-sunken w-8 h-8 p-[2px] bg-[#c0c0c0] flex items-center justify-center border-2">
          <div 
            className="w-full h-full border border-[#808080]" 
            style={{ backgroundColor: tool === 'eraser' ? '#ffffff' : color }}
          />
        </div>

        {/* Color Palette Grid */}
        <div className="grid grid-cols-8 gap-[2px]">
          {COLORS.map((c) => (
            <div
              key={c}
              onClick={() => {
                setColor(c);
                setTool('pencil');
              }}
              className="w-5 h-5 cursor-pointer win95-sunken p-[1px] border bg-white"
            >
              <div className="w-full h-full" style={{ backgroundColor: c }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Paint;
