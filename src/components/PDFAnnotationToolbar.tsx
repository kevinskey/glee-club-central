
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pen, Eraser, Save, X, Square } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

export type AnnotationTool = "pen" | "eraser" | "square" | null;

interface PDFAnnotationToolbarProps {
  isOpen: boolean;
  activeTool: AnnotationTool;
  onToolChange: (tool: AnnotationTool) => void;
  onSave: () => void;
  onClear: () => void;
  penColor: string;
  onPenColorChange: (color: string) => void;
  penSize: number;
  onPenSizeChange: (size: number) => void;
  isMobile?: boolean;
}

export const PDFAnnotationToolbar = ({
  isOpen,
  activeTool,
  onToolChange,
  onSave,
  onClear,
  penColor,
  onPenColorChange,
  penSize,
  onPenSizeChange,
  isMobile = false,
}: PDFAnnotationToolbarProps) => {
  const colors = ["#000000", "#FF0000", "#0000FF", "#00FF00", "#FFFF00", "#FF00FF"];

  if (!isOpen) return null;

  return (
    <div className="p-2 bg-background border-b shadow-sm sticky top-0 z-20">
      <div className={`flex ${isMobile ? "flex-wrap" : ""} gap-2 items-center justify-between`}>
        <TooltipProvider>
          <div className={`flex items-center gap-1 ${isMobile ? "mb-1" : "border-r pr-2"}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={activeTool === "pen"}
                  onPressedChange={(pressed) => onToolChange(pressed ? "pen" : null)}
                  variant="outline"
                  size="sm"
                  aria-label="Toggle pen tool"
                >
                  <Pen className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pen tool</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={activeTool === "eraser"}
                  onPressedChange={(pressed) => onToolChange(pressed ? "eraser" : null)}
                  variant="outline"
                  size="sm"
                  aria-label="Toggle eraser tool"
                >
                  <Eraser className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Eraser tool</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={activeTool === "square"}
                  onPressedChange={(pressed) => onToolChange(pressed ? "square" : null)}
                  variant="outline"
                  size="sm"
                  aria-label="Toggle square tool"
                >
                  <Square className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Square tool</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {activeTool === "pen" && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex gap-1 flex-wrap">
                {colors.map((color) => (
                  <Tooltip key={color}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className={`w-5 h-5 rounded-full flex-shrink-0 ${
                          penColor === color ? "ring-2 ring-primary" : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => onPenColorChange(color)}
                        aria-label={`Select ${color} color`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select color</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-xs text-muted-foreground">Size:</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={penSize}
                  onChange={(e) => onPenSizeChange(Number(e.target.value))}
                  className="w-20 flex-shrink-0"
                />
                <span className="text-xs">{penSize}px</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSave}
                  className="h-8 px-2 flex-shrink-0"
                >
                  <Save className="h-4 w-4 mr-1" />
                  <span className="text-xs truncate">Save</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save annotations</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClear}
                  className="h-8 px-2 text-destructive flex-shrink-0"
                >
                  <X className="h-4 w-4 mr-1" />
                  <span className="text-xs truncate">Clear</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear annotations</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};
