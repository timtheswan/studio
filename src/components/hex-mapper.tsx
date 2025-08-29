"use client";

import React, { useState, useCallback } from 'react';
import { HexMap } from './hex-map';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

export type HoverData = {
  coords: string;
  x: number;
  y: number;
} | null;

export function HexMapper() {
  const [enabledTiles, setEnabledTiles] = useState<Set<string>>(new Set());
  const [hoveredTile, setHoveredTile] = useState<HoverData>(null);
  const { toast } = useToast()

  const handleTileClick = useCallback((key: string) => {
    setEnabledTiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, []);

  const handleExport = () => {
    try {
      const dataToExport = Array.from(enabledTiles).map(coordStr => {
        return coordStr.split(',').map(Number);
      });
      
      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = "hexamapper_config.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Your map configuration has been downloaded.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Something went wrong while exporting the configuration.",
      })
    }
  };

  return (
    <div className="relative w-screen h-screen bg-background overflow-hidden select-none">
      <HexMap
        enabledTiles={enabledTiles}
        onTileClick={handleTileClick}
        setHoveredTile={setHoveredTile}
      />
      
      {hoveredTile && (
        <div 
          className="absolute pointer-events-none p-2 bg-popover text-popover-foreground rounded-md shadow-lg text-sm transition-opacity duration-200 animate-in fade-in"
          style={{ left: hoveredTile.x + 15, top: hoveredTile.y + 15 }}
        >
          {`{ x: ${hoveredTile.coords.split(',')[0]}, y: ${hoveredTile.coords.split(',')[1]} }`}
        </div>
      )}

      <div className="absolute top-4 right-4">
        <Button onClick={handleExport} variant="secondary" className="shadow-lg">
          <Download className="mr-2 h-4 w-4 text-accent" />
          Export Config
        </Button>
      </div>
       <div className="absolute bottom-4 left-4 p-3 bg-card/80 rounded-lg shadow-lg backdrop-blur-sm text-sm text-card-foreground">
        <h3 className="font-bold mb-2">Controls</h3>
        <p><kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Click</kbd> to toggle a tile</p>
        <p className="mt-1"><kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Scroll</kbd> to zoom</p>
        <p className="mt-1"><kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Click & Drag</kbd> to pan</p>
      </div>
    </div>
  );
}
