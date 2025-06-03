
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DesignElement {
  id: string;
  type: 'image' | 'text' | 'clipart';
  content: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  placement: 'front' | 'back' | 'left-chest' | 'right-chest' | 'sleeve';
}

interface Garment {
  brand: string;
  style: string;
  color: string;
}

interface DesignContextType {
  elements: DesignElement[];
  addElement: (element: Omit<DesignElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  deleteElement: (id: string) => void;
  selectedGarment: Garment;
  updateGarment: (updates: Partial<Garment>) => void;
  currentView: 'front' | 'back' | 'sleeve';
  setCurrentView: (view: 'front' | 'back' | 'sleeve') => void;
  zoom: number;
  setZoom: (zoom: number) => void;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

export const DesignProvider = ({ children }: { children: ReactNode }) => {
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedGarment, setSelectedGarment] = useState<Garment>({
    brand: 'Gildan',
    style: 'Softstyle Jersey T-shirt',
    color: 'White'
  });
  const [currentView, setCurrentView] = useState<'front' | 'back' | 'sleeve'>('front');
  const [zoom, setZoom] = useState(100);

  const addElement = (element: Omit<DesignElement, 'id'>) => {
    const newElement = {
      ...element,
      id: Date.now().toString()
    };
    setElements(prev => [...prev, newElement]);
  };

  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
  };

  const updateGarment = (updates: Partial<Garment>) => {
    setSelectedGarment(prev => ({ ...prev, ...updates }));
  };

  return (
    <DesignContext.Provider value={{
      elements,
      addElement,
      updateElement,
      deleteElement,
      selectedGarment,
      updateGarment,
      currentView,
      setCurrentView,
      zoom,
      setZoom
    }}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
};
