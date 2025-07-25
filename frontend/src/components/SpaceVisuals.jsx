import React, { useState, useEffect } from "react";
import { Rocket, Satellite, Zap, Pickaxe, Gem, Home } from "lucide-react";

const SpaceVisuals = ({ gameState }) => {
  const [stars, setStars] = useState([]);
  const [floatingObjects, setFloatingObjects] = useState([]);

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

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
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
              className="absolute animate-space-float opacity-60 hover:opacity-100 transition-opacity duration-300"
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

      {/* Resource Collection Drones */}
      <div className="absolute inset-0">
        {Object.entries(gameState.buildings).map(([buildingKey, building]) => {
          if (building.owned === 0) return null;
          
          return Array.from({ length: Math.min(building.owned, 5) }, (_, i) => (
            <div
              key={`${buildingKey}-${i}`}
              className="absolute animate-drone-collect opacity-50"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i * 10)}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: '8s'
              }}
            >
              <div className="relative">
                {buildingKey === 'solarPanel' && (
                  <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                )}
                {buildingKey === 'miningRig' && (
                  <Pickaxe className="w-6 h-6 text-gray-400 animate-bounce" />
                )}
                {buildingKey === 'crystalExtractor' && (
                  <Gem className="w-6 h-6 text-purple-400 animate-ping" />
                )}
                {buildingKey === 'habitat' && (
                  <Home className="w-6 h-6 text-green-400 animate-pulse" />
                )}
                
                {/* Collection trail */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-full animate-pulse"></div>
              </div>
            </div>
          ));
        })}
      </div>

      {/* Colony Growth Indicators */}
      <div className="absolute top-1/4 right-1/4">
        {gameState.resources.population > 100 && (
          <div className="animate-colony-grow">
            <div className="relative">
              {/* Main colony structure */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-lg border border-blue-400/50 animate-pulse">
                <div className="absolute inset-2 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded"></div>
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

      {/* Energy Network Visualization */}
      {gameState.buildings.solarPanel.owned > 0 && (
        <div className="absolute bottom-1/4 left-1/4">
          <div className="relative animate-energy-flow">
            {Array.from({ length: gameState.buildings.solarPanel.owned }, (_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-yellow-400/60 rounded-full animate-ping"
                style={{
                  left: `${i * 20}px`,
                  top: `${Math.sin(i) * 20}px`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            ))}
            
            {/* Energy collection beam */}
            <div className="absolute top-0 left-0 w-1 h-32 bg-gradient-to-t from-yellow-400/0 to-yellow-400/60 animate-pulse transform rotate-12"></div>
          </div>
        </div>
      )}

      {/* Mining Operations */}
      {gameState.buildings.miningRig.owned > 0 && (
        <div className="absolute bottom-1/3 right-1/3">
          <div className="animate-mining-operation">
            {Array.from({ length: Math.min(gameState.buildings.miningRig.owned, 3) }, (_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${i * 25}px`,
                  top: `${i * 15}px`
                }}
              >
                <Pickaxe className="w-8 h-8 text-gray-400 animate-bounce" />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full animate-ping"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nebula Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
};

export default SpaceVisuals;