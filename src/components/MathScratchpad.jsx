/**
 * src/components/MathScratchpad.jsx
 * 
 * Interactive drawing canvas for scratch work during math quizzes.
 * Enables kids with ADHD / dyscalculia or visual learners to write carrying digits,
 * draw tally marks, or sketch groupings directly on screen.
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';

export default function MathScratchpad({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#2563eb'); // default royal blue pencil
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState('pen'); // 'pen' | 'highlighter' | 'eraser'
  const lastPointRef = useRef(null);

  // Initialize and resize canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Support Retina/HiDPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Small timeout to allow DOM to render before measuring dimensions
      const timer = setTimeout(initCanvas, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initCanvas]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    lastPointRef.current = coords;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const coords = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(coords.x, coords.y);

    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 18;
      ctx.globalAlpha = 1.0;
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 14;
      ctx.globalAlpha = 0.5;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.globalAlpha = 1.0;
    }

    ctx.stroke();
    lastPointRef.current = coords;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  };

  if (!isOpen) return null;

  return (
    <div className="math-scratchpad-panel" role="region" aria-label="Math scratchpad">
      <div className="scratchpad-header">
        <div className="scratchpad-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span>Math Scratchpad</span>
        </div>

        <div className="scratchpad-tools">
          <button
            type="button"
            className={`scratchpad-tool-btn ${tool === 'pen' ? 'active' : ''}`}
            onClick={() => setTool('pen')}
            title="Pencil"
            aria-label="Pencil tool"
          >
            ✏️
          </button>
          <button
            type="button"
            className={`scratchpad-tool-btn ${tool === 'highlighter' ? 'active' : ''}`}
            onClick={() => setTool('highlighter')}
            title="Highlighter"
            aria-label="Highlighter tool"
          >
            🖍️
          </button>
          <button
            type="button"
            className={`scratchpad-tool-btn ${tool === 'eraser' ? 'active' : ''}`}
            onClick={() => setTool('eraser')}
            title="Eraser"
            aria-label="Eraser tool"
          >
            🧽
          </button>
          <button
            type="button"
            className="scratchpad-tool-btn danger"
            onClick={clearCanvas}
            title="Clear all work"
            aria-label="Clear canvas"
          >
            Clear
          </button>
          <button
            type="button"
            className="scratchpad-tool-btn close-btn"
            onClick={onClose}
            title="Close scratchpad"
            aria-label="Close scratchpad"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="scratchpad-canvas-container">
        <canvas
          ref={canvasRef}
          className="scratchpad-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="scratchpad-watermark" aria-hidden="true">
          Draw tally marks, carrying digits, or count here!
        </div>
      </div>
    </div>
  );
}
