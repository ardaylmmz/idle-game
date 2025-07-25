import React, { useEffect, useState } from "react";
import { Zap, Pickaxe, Gem, Users } from "lucide-react";

const resourceIcons = {
  energy: Zap,
  metal: Pickaxe,
  crystals: Gem,
  population: Users
};

const ResourceParticles = ({ resourceType, color }) => {
  const [particles, setParticles] = useState([]);
  const IconComponent = resourceIcons[resourceType];

  useEffect(() => {
    // Generate particles
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 100,
      size: Math.random() * 8 + 4
    }));
    
    setParticles(newParticles);

    // Clean up particles after animation
    const timeout = setTimeout(() => {
      setParticles([]);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-particle-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}ms`,
            animationDuration: '1000ms'
          }}
        >
          <div 
            className={`bg-gradient-to-r ${color} rounded-full opacity-80 flex items-center justify-center animate-spin`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
          >
            <IconComponent 
              className="w-2 h-2 text-white" 
              style={{ fontSize: `${particle.size * 0.4}px` }}
            />
          </div>
        </div>
      ))}
      
      {/* Central burst effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-full opacity-30 animate-ping`}></div>
        <div className={`absolute w-8 h-8 bg-gradient-to-r ${color} rounded-full opacity-60 animate-pulse`}></div>
      </div>
    </div>
  );
};

export default ResourceParticles;