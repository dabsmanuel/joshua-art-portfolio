'use client'
'use client'
import React, { useEffect, useState, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import Image from 'next/image';

interface ImageZoomModalProps {
  imageUrl: string;
  imageAlt: string;
  onClose: () => void;
}


const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ imageUrl, imageAlt, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale(prevScale => Math.min(Math.max(0.1, prevScale + delta), 5));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case '+':
        case '=':
          setScale(prevScale => Math.min(prevScale + 0.1, 5));
          break;
        case '-':
          setScale(prevScale => Math.max(prevScale - 0.1, 0.1));
          break;
        case '0':
          resetZoom();
          break;
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [onClose]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.3, 5));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.3, 0.1));
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const fitToScreen = () => {
    if (imageRef.current && containerRef.current) {
      const img = imageRef.current;
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      const scaleX = (containerRect.width - 40) / img.naturalWidth;
      const scaleY = (containerRect.height - 40) / img.naturalHeight;
      const newScale = Math.min(scaleX, scaleY, 1);
      
      setScale(newScale);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    fitToScreen();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm">
      {/* Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="flex items-center space-x-2">
          <button
            onClick={zoomOut}
            className="p-3 bg-gray-800/80 hover:bg-gray-700/80 rounded-full text-white transition-colors"
            title="Zoom Out (-)"
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={zoomIn}
            className="p-3 bg-gray-800/80 hover:bg-gray-700/80 rounded-full text-white transition-colors"
            title="Zoom In (+)"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={resetZoom}
            className="p-3 bg-gray-800/80 hover:bg-gray-700/80 rounded-full text-white transition-colors"
            title="Reset Zoom (0)"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={fitToScreen}
            className="p-3 bg-gray-800/80 hover:bg-gray-700/80 rounded-full text-white transition-colors"
            title="Fit to Screen"
          >
            <Maximize2 size={20} />
          </button>
        </div>
        
        {/* Zoom indicator */}
        <div className="px-4 py-2 bg-gray-800/80 rounded-full text-white text-sm font-medium">
          {Math.round(scale * 100)}%
        </div>
        
        <button
          onClick={onClose}
          className="p-3 bg-gray-800/80 hover:bg-red-600/80 rounded-full text-white transition-colors"
          title="Close (Esc)"
        >
          <X size={20} />
        </button>
      </div>

      {/* Image Container */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={(e) => {
          if (!isDragging) {
            const rect = e.currentTarget.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            
            if (e.clientX < centerX) {
              zoomOut();
            } else {
              zoomIn();
            }
          }
        }}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <Image
          ref={imageRef}
          src={imageUrl}
          alt={imageAlt}
          height={500}
          width={500}
          className="max-w-none transition-transform duration-200 ease-out select-none"
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
          }}
          onLoad={handleImageLoad}
          onError={() => {
            console.error('Image failed to load:', imageUrl);
          }}
          draggable={false}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-gray-800/80 rounded-full px-6 py-2">
        <span className="opacity-80">
          Click to zoom • Scroll to zoom • Drag to pan • ESC to close
        </span>
      </div>
    </div>
  );
};

export default ImageZoomModal;