import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Seedling, Wheat, DollarSign, FlaskConical, Star, Plus } from "lucide-react";
import ResourceParticles from "./ResourceParticles";

const resourceIcons = {
  seeds: Seedling,
  crops: Wheat,
  money: DollarSign,
  research: FlaskConical,
  reputation: Star
};

const resourceColors = {
  seeds: "from-green-400 to-emerald-500",
  crops: "from-yellow-400 to-orange-500",
  money: "from-green-500 to-emerald-600",
  research: "from-blue-400 to-cyan-500",
  reputation: "from-purple-400 to-pink-500"
};

const resourceGlows = {
  seeds: "shadow-green-500/50",
  crops: "shadow-yellow-500/50",
  money: "shadow-green-500/50",
  research: "shadow-blue-500/50",
  reputation: "shadow-purple-500/50"
};

const ResourcePanel = ({ resources, clickPower, storageCapacity, onManualClick, currentPlanet }) => {
  const [clickAnimations, setClickAnimations] = useState({});
  const [previousResources, setPreviousResources] = useState(resources);

  useEffect(() => {
    setPreviousResources(resources);
  }, [resources]);

  const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return Math.floor(num).toLocaleString();
  };

  const handleClick = (resourceType) => {
    if (resources[resourceType] < storageCapacity[resourceType]) {
      onManualClick(resourceType);
      
      setClickAnimations(prev => ({
        ...prev,
        [resourceType]: Date.now()
      }));

      setTimeout(() => {
        setClickAnimations(prev => {
          const newAnimations = { ...prev };
          delete newAnimations[resourceType];
          return newAnimations;
        });
      }, 1000);
    }
  };

  const getResourceIncrement = (resourceType) => {
    return Math.max(0, resources[resourceType] - previousResources[resourceType]);
  };

  const getStoragePercentage = (resourceType) => {
    return (resources[resourceType] / storageCapacity[resourceType]) * 100;
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
          Resources
        </h2>
        <div className="mt-2">
          <Badge variant="outline" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400">
            🪐 {currentPlanet.name}
          </Badge>
        </div>
      </div>
      
      {Object.entries(resources).map(([resourceType, amount]) => {
        const IconComponent = resourceIcons[resourceType];
        const colorGradient = resourceColors[resourceType];
        const glowClass = resourceGlows[resourceType];
        const isClicked = clickAnimations[resourceType];
        const increment = getResourceIncrement(resourceType);
        const storagePercent = getStoragePercentage(resourceType);
        const isNearCapacity = storagePercent > 90;
        
        return (
          <div key={resourceType} className="relative">
            <Card className={`bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${glowClass} ${isNearCapacity ? 'border-red-500/50' : ''}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <IconComponent className={`w-6 h-6 bg-gradient-to-r ${colorGradient} bg-clip-text text-transparent ${isClicked ? 'animate-spin' : 'animate-pulse'}`} />
                      <div className={`absolute inset-0 w-6 h-6 rounded-full bg-gradient-to-r ${colorGradient} opacity-20 animate-ping`}></div>
                    </div>
                    <span className="capitalize animate-fade-in text-white font-bold">{resourceType}</span>
                  </div>
                  <Badge variant="outline" className="text-xs animate-pulse bg-gray-700 text-yellow-400">
                    +{clickPower[resourceType]}/click
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className={`text-4xl font-bold bg-gradient-to-r ${colorGradient} bg-clip-text text-transparent drop-shadow-lg`}>
                    {formatNumber(amount)}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {formatNumber(amount)} / {formatNumber(storageCapacity[resourceType])}
                  </div>
                </div>
                
                <Button
                  onClick={() => handleClick(resourceType)}
                  disabled={resources[resourceType] >= storageCapacity[resourceType]}
                  className={`w-full bg-gradient-to-r ${colorGradient} hover:opacity-90 transition-all duration-200 transform active:scale-95 hover:shadow-lg relative overflow-hidden group text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed`}
                  size="sm"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <Plus className={`w-4 h-4 mr-1 ${isClicked ? 'animate-spin' : ''}`} />
                  {resources[resourceType] >= storageCapacity[resourceType] ? 'Storage Full' : `Generate +${clickPower[resourceType]}`}
                </Button>
                
                <div className="space-y-1">
                  <div className="text-xs text-gray-400 flex justify-between">
                    <span>Storage Capacity</span>
                    {increment > 0 && (
                      <span className={`text-green-400 animate-bounce text-xs font-bold`}>
                        +{formatNumber(increment)}/s
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Progress 
                      value={storagePercent} 
                      className={`h-3 ${isNearCapacity ? 'bg-red-900' : ''}`}
                    />
                    <div className={`absolute inset-0 h-3 bg-gradient-to-r ${colorGradient} opacity-30 rounded-full animate-pulse`}></div>
                  </div>
                  {isNearCapacity && (
                    <div className="text-xs text-red-400 animate-pulse">
                      ⚠️ Storage nearly full! Build warehouses to increase capacity.
                    </div>
                  )}
                </div>

                {increment > 0 && (
                  <div className="absolute top-2 right-2 animate-float-up pointer-events-none">
                    <div className={`text-sm font-bold bg-gradient-to-r ${colorGradient} bg-clip-text text-transparent drop-shadow-lg`}>
                      +{formatNumber(increment)}
                    </div>
                  </div>
                )}
              </CardContent>

              {isClicked && (
                <ResourceParticles 
                  resourceType={resourceType}
                  color={colorGradient}
                />
              )}
            </Card>

            <div className="absolute -inset-2 pointer-events-none overflow-hidden rounded-lg">
              <div className={`absolute top-0 left-0 w-4 h-4 bg-gradient-to-r ${colorGradient} rounded-full opacity-20 animate-float-slow`}></div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 bg-gradient-to-r ${colorGradient} rounded-full opacity-30 animate-float-slow-reverse`}></div>
            </div>
          </div>
        );
      })}

      <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 animate-gradient-shift"></div>
        <CardContent className="p-4 relative z-10">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Empire Net Worth</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              ${formatNumber(resources.money + (resources.crops * 5) + (resources.seeds * 2) + (resources.research * 10))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcePanel;