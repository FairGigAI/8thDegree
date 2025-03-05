'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Point {
  id: number;
  x: number;
  y: number;
}

interface Connection {
  id: number;
  start: Point;
  end: Point;
}

export function HeroBackground() {
  const [connections, setConnections] = useState<Connection[]>([]);
  
  // Predefined points on the map (normalized coordinates)
  const mapPoints: Point[] = [
    { id: 1, x: 20, y: 30 }, // North America
    { id: 2, x: 45, y: 25 }, // Europe
    { id: 3, x: 75, y: 35 }, // Asia
    { id: 4, x: 35, y: 60 }, // South America
    { id: 5, x: 70, y: 65 }, // Australia
    { id: 6, x: 50, y: 45 }, // Africa
  ];

  // Create new random connection
  const createConnection = () => {
    const startPoint = mapPoints[Math.floor(Math.random() * mapPoints.length)];
    let endPoint = mapPoints[Math.floor(Math.random() * mapPoints.length)];
    while (endPoint.id === startPoint.id) {
      endPoint = mapPoints[Math.floor(Math.random() * mapPoints.length)];
    }
    
    return {
      id: Date.now(),
      start: startPoint,
      end: endPoint,
    };
  };

  useEffect(() => {
    // Initialize with 2 connections
    setConnections([createConnection(), createConnection()]);

    // Add new connection every 3 seconds
    const interval = setInterval(() => {
      setConnections(prev => {
        const newConnections = [...prev, createConnection()];
        // Keep only last 3 connections
        if (newConnections.length > 3) {
          newConnections.shift();
        }
        return newConnections;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ filter: 'blur(1px)' }}
      >
        {/* World Map Outline - Simplified */}
        <path
          d="M10,30 Q30,20 50,25 T90,30 M15,45 Q35,35 55,40 T85,45 M20,60 Q40,50 60,55 T80,60"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-gray-400"
        />

        {/* Connection Points */}
        {mapPoints.map((point) => (
          <circle
            key={point.id}
            cx={point.x}
            cy={point.y}
            r="1"
            className="fill-blue-600"
          />
        ))}

        {/* Animated Connections */}
        {connections.map((connection) => (
          <g key={connection.id}>
            <motion.line
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              x1={connection.start.x}
              y1={connection.start.y}
              x2={connection.end.x}
              y2={connection.end.y}
              stroke="currentColor"
              strokeWidth="0.3"
              className="text-blue-600"
            />
            <motion.circle
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 0] }}
              transition={{ duration: 2 }}
              cx={connection.end.x}
              cy={connection.end.y}
              r="0.5"
              className="fill-blue-600"
            />
          </g>
        ))}

        {/* AI Analysis Visual */}
        <g transform="translate(75, 15) scale(0.1)">
          <motion.path
            d="M50,0 L100,25 L100,75 L50,100 L0,75 L0,25 Z"
            className="fill-blue-600/20 stroke-blue-600"
            strokeWidth="3"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M50,0 L100,25 L100,75 L50,100 L0,75 L0,25 Z"
            className="fill-none stroke-blue-600"
            strokeWidth="3"
            initial={{ rotate: 0, scale: 0.8 }}
            animate={{ rotate: -360, scale: 1.2 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </g>
      </svg>
    </div>
  );
} 