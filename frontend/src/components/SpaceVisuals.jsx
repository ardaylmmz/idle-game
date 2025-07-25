import React, { useState, useEffect } from "react";
import { Rocket, Satellite, Zap, Pickaxe, Gem, Home, User } from "lucide-react";

const SpaceVisuals = ({ gameState, currentPlanet }) => {
  const [stars, setStars] = useState([]);
  const [floatingObjects, setFloatingObjects] = useState([]);
  const [astronauts, setAstronauts] = useState([]);

  useEffect(() => {
    // Generate random stars
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      animationDelay: Math.random() * 3
    }));
    setStars(newStars);

    // Generate floating space objects
    const newObjects = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      type: ['asteroid', 'satellite', 'ship', 'station'][Math.floor(Math.random() * 4)],
      size: Math.random() * 30 + 20,
      rotation: Math.random() * 360,
      speed: Math.random() * 20 + 10
    }));
    setFloatingObjects(newObjects);
  }, []);

  // Generate astronauts based on buildings
  useEffect(() => {
    const newAstronauts = [];
    
    Object.entries(gameState.buildings).forEach(([buildingKey, building]) => {
      if (building.owned > 0) {
        const astronautCount = Math.min(building.owned, 8); // Max 8 astronauts per building type
        
        for (let i = 0; i < astronautCount; i++) {
          newAstronauts.push({
            id: `${buildingKey}-${i}`,
            type: buildingKey,
            x: Math.random() * 80 + 10, // Keep within screen bounds
            y: Math.random() * 80 + 10,
            targetX: Math.random() * 80 + 10,
            targetY: Math.random() * 80 + 10,
            speed: Math.random() * 2 + 1,
            size: Math.random() * 8 + 12,
            animationDelay: i * 0.5
          });
        }
      }
    });
    
    setAstronauts(newAstronauts);
  }, [gameState.buildings]);

  const getObjectIcon = (type) => {
    switch (type) {
      case 'satellite': return Satellite;
      case 'ship': return Rocket;
      case 'station': return Home;
      default: return Gem; // asteroid
    }
  };

  const getObjectColor = (type) => {
    switch (type) {
      case 'satellite': return 'text-blue-400';
      case 'ship': return 'text-green-400';
      case 'station': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getAstronautColor = (type) => {
    switch (type) {
      case 'solarPanel': return 'text-yellow-400';
      case 'miningRig': return 'text-gray-400';
      case 'crystalExtractor': return 'text-purple-400';
      case 'habitat': return 'text-green-400';
      case 'researchLab': return 'text-cyan-400';
      default: return 'text-white';
    }
  };

  const getAstronautIcon = (type) => {
    switch (type) {
      case 'solarPanel': return Zap;
      case 'miningRig': return Pickaxe;
      case 'crystalExtractor': return Gem;
      case 'habitat': return Home;
      case 'researchLab': return Satellite;
      default: return User;
    }
  };

  const getPlanetBackground = () => {
    switch (currentPlanet.name) {
      case 'Mars':
        return 'bg-gradient-to-br from-red-900/20 to-orange-900/20';
      case 'Europa':
        return 'bg-gradient-to-br from-cyan-900/20 to-blue-900/20';
      case 'Titan':
        return 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20';
      case 'Proxima B':
        return 'bg-gradient-to-br from-purple-900/20 to-pink-900/20';
      case 'Kepler-442b':
        return 'bg-gradient-to-br from-green-900/20 to-emerald-900/20';
      case 'Alpha Centauri':
        return 'bg-gradient-to-br from-yellow-900/20 to-gold-900/20';
      default:
        return 'bg-gradient-to-br from-blue-900/20 to-green-900/20';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Planet-specific background */}
      <div className={`absolute inset-0 ${getPlanetBackground()}`} />
      
      {/* Animated Stars Background */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.animationDelay}s`
            }}
          />
        ))}
      </div>

      {/* Floating Space Objects */}
      <div className="absolute inset-0">
        {floatingObjects.map((obj) => {
          const IconComponent = getObjectIcon(obj.type);
          return (
            <div
              key={obj.id}
              className="absolute animate-space-float opacity-40 hover:opacity-80 transition-opacity duration-300"
              style={{
                left: `${obj.x}%`,
                top: `${obj.y}%`,
                animationDuration: `${obj.speed}s`,
                animationDelay: `${obj.id * 0.5}s`
              }}
            >
              <IconComponent
                className={`${getObjectColor(obj.type)} animate-spin-slow drop-shadow-lg`}
                style={{
                  width: `${obj.size}px`,
                  height: `${obj.size}px`,
                  transform: `rotate(${obj.rotation}deg)`
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Moving Astronauts */}
      <div className="absolute inset-0">
        {astronauts.map((astronaut) => {
          const IconComponent = getAstronautIcon(astronaut.type);
          const WorkIcon = getAstronautIcon(astronaut.type);
          
          return (
            <div
              key={astronaut.id}
              className="absolute animate-astronaut-work opacity-80 hover:opacity-100 transition-all duration-300"
              style={{
                left: `${astronaut.x}%`,
                top: `${astronaut.y}%`,
                animationDuration: `${astronaut.speed * 4}s`,
                animationDelay: `${astronaut.animationDelay}s`
              }}
            >
              {/* Astronaut body */}
              <div className="relative">
                <div 
                  className={`${getAstronautColor(astronaut.type)} drop-shadow-lg`}
                  style={{ fontSize: `${astronaut.size}px` }}
                >
                  👨‍🚀
                </div>
                
                {/* Work tool/icon floating nearby */}
                <div 
                  className="absolute -top-2 -right-2 animate-bounce"
                  style={{ animationDelay: `${astronaut.animationDelay + 1}s` }}
                >
                  <WorkIcon 
                    className={`${getAstronautColor(astronaut.type)} opacity-60`}
                    style={{ width: `${astronaut.size * 0.4}px`, height: `${astronaut.size * 0.4}px` }}
                  />
                </div>
                
                {/* Work particles */}
                <div className="absolute inset-0 animate-work-particles pointer-events-none">
                  <div className={`w-1 h-1 bg-current ${getAstronautColor(astronaut.type)} rounded-full opacity-60 animate-ping`}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Planet Surface Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30">
        <div className={`h-full bg-gradient-to-t ${currentPlanet.color}/20 to-transparent`}>
          {/* Surface details based on current planet */}
          {currentPlanet.name === 'Mars' && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-red-800/40 to-orange-800/40"></div>
          )}
          {currentPlanet.name === 'Europa' && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-cyan-800/40 to-blue-800/40"></div>
          )}
        </div>
      </div>

      {/* Colony Growth Indicators */}
      <div className="absolute top-1/4 right-1/4">
        {gameState.resources.population > 100 && (
          <div className="animate-colony-grow">
            <div className="relative">
              {/* Main colony structure with planet-specific colors */}
              <div className={`w-16 h-16 bg-gradient-to-br ${currentPlanet.color}/30 rounded-lg border border-current/50 animate-pulse`}>
                <div className={`absolute inset-2 bg-gradient-to-br ${currentPlanet.color}/20 rounded`}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
                  {currentPlanet.emoji}
                </div>
              </div>
              
              {/* Colony expansion modules */}
              {gameState.resources.population > 500 && (
                <>
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded border border-green-400/50 animate-pulse"></div>
                  <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded border border-purple-400/50 animate-pulse"></div>
                </>
              )}
              
              {gameState.resources.population > 1000 && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-full border border-yellow-400/50 animate-spin-slow">
                  <Satellite className="w-6 h-6 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Nebula Effects for different planets */}
      <div className="absolute inset-0 opacity-20">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br ${currentPlanet.color}/20 to-transparent rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br ${currentPlanet.color}/15 to-transparent rounded-full blur-2xl animate-pulse`} style={{ animationDelay: '2s' }}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br ${currentPlanet.color}/10 to-transparent rounded-full blur-xl animate-pulse`} style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
};

export default SpaceVisuals;