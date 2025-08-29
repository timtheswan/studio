"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import {
  HEX_SIZE,
  pixelToCube,
  cubeToOffset,
  hexToPixel,
  getHexCornerPoints,
  CubeCoords
} from '@/lib/hex-utils';
import type { HoverData } from './hex-mapper';
import { cn } from '@/lib/utils';

interface HexMapProps {
  enabledTiles: Set<string>;
  onTileClick: (key: string) => void;
  setHoveredTile: (data: HoverData) => void;
}

export function HexMap({ enabledTiles, onTileClick, setHoveredTile }: HexMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isMobile = useIsMobile();

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
      if (view.x === 0 && view.y === 0) {
        setView(v => ({ ...v, x: width / 2, y: height / 2 }));
      }
    });

    resizeObserver.observe(svg);
    return () => resizeObserver.unobserve(svg);
  }, [view.x, view.y]);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsPanning(true);
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
    setHoveredTile(null);
  };
  
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      setView(v => ({ ...v, x: v.x + e.movementX, y: v.y + e.movementY }));
    }
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const scaleAmount = 0.1;
    const newScale = view.scale * (1 - Math.sign(e.deltaY) * scaleAmount);
    const clampedScale = Math.min(Math.max(newScale, 0.1), 5);

    const mouseX = e.clientX - svgRef.current!.getBoundingClientRect().left;
    const mouseY = e.clientY - svgRef.current!.getBoundingClientRect().top;

    const worldX = (mouseX - view.x) / view.scale;
    const worldY = (mouseY - view.y) / view.scale;

    const newX = mouseX - worldX * clampedScale;
    const newY = mouseY - worldY * clampedScale;
    
    setView({ scale: clampedScale, x: newX, y: newY });
  };
  
  const handleTileHover = useCallback((e: React.MouseEvent, key: string) => {
    setHoveredTile({ coords: key, x: e.clientX, y: e.clientY });
  }, [setHoveredTile]);

  const visibleHexes = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return [];
    
    const hexes: CubeCoords[] = [];
    
    // Heuristic for visible area. A more precise calculation can be complex.
    const viewRadiusQ = (dimensions.width / view.scale / HEX_SIZE / 1.5) + 2;
    const viewRadiusR = (dimensions.height / view.scale / HEX_SIZE / Math.sqrt(3)) + 2;
    
    const centerHex = pixelToCube({ 
        x: (dimensions.width/2 - view.x)/view.scale, 
        y: (dimensions.height/2 - view.y)/view.scale 
    });

    const q_center = Math.round(centerHex.q);
    const r_center = Math.round(centerHex.r);

    for (let q = -Math.ceil(viewRadiusQ); q <= Math.ceil(viewRadiusQ); q++) {
      for (let r = -Math.ceil(viewRadiusR); r <= Math.ceil(viewRadiusR); r++) {
         const hex: CubeCoords = { q: q + q_center, r: r + r_center, s: -(q+q_center) - (r+r_center) };
         hexes.push(hex);
      }
    }
    return hexes;
  }, [view, dimensions]);

  return (
    <svg 
      ref={svgRef} 
      className="w-full h-full cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
    >
      <g transform={`translate(${view.x}, ${view.y}) scale(${view.scale})`}>
        {visibleHexes.map(hex => {
          const offsetCoords = cubeToOffset(hex);
          if ((offsetCoords.col + offsetCoords.row) % 2 !== 0) {
             return null;
          }

          const key = `${offsetCoords.col},${offsetCoords.row}`;
          const isEnabled = enabledTiles.has(key);
          const center = hexToPixel(hex);
          const points = getHexCornerPoints(center);
          
          return (
            <polygon 
              key={key}
              points={points}
              className={cn(
                "stroke-border stroke-[1.5px] transition-all duration-200 origin-center hover:stroke-accent",
                isEnabled ? 'fill-primary' : 'fill-card',
                {'cursor-pointer': !isPanning}
              )}
              style={{ vectorEffect: 'non-scaling-stroke' }}
              onClick={() => onTileClick(key)}
              onMouseEnter={(e) => handleTileHover(e, key)}
            />
          );
        })}
      </g>
    </svg>
  );
}
