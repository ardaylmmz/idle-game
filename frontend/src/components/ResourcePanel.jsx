import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Zap, Pickaxe, Gem, Users, Plus } from "lucide-react";
import ResourceParticles from "./ResourceParticles";

const resourceIcons = {
  energy: Zap,
  metal: Pickaxe,
  crystals: Gem,
  population: Users
};

const resourceColors = {
  energy: "from-yellow-400 to-orange-500",
  metal: "from-gray-400 to-gray-600",
  crystals: "from-purple-400 to-pink-500",
  population: "from-green-400 to-blue-500"
};

const resourceGlows = {
  energy: "shadow-yellow-500/50",
  metal: "shadow-gray-500/50",
  crystals: "shadow-purple-500/50",
  population: "shadow-green-500/50"
};

const ResourcePanel = ({ resources, clickPower, onManualClick }) => {
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
    onManualClick(resourceType);
    
    // Trigger click animation
    setClickAnimations(prev => ({
      ...prev,
      [resourceType]: Date.now()
    }));

    // Clear animation after duration
    setTimeout(() => {
      setClickAnimations(prev => {
        const newAnimations = { ...prev };
        delete newAnimations[resourceType];
        return newAnimations;
      });
    }, 1000);
  };

  const getResourceIncrement = (resourceType) => {
    return Math.max(0, resources[resourceType] - previousResources[resourceType]);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
        Resources
      </h2>
      
      {Object.entries(resources).map(([resourceType, amount]) => {
        const IconComponent = resourceIcons[resourceType];
        const colorGradient = resourceColors[resourceType];
        const glowClass = resourceGlows[resourceType];
        const isClicked = clickAnimations[resourceType];
        const increment = getResourceIncrement(resourceType);
        
        return (
          <div key={resourceType} className="relative">
            <Card className={`bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${glowClass} ${isClicked ? 'animate-bounce shadow-2xl' : ''}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <IconComponent className={`w-6 h-6 bg-gradient-to-r ${colorGradient} bg-clip-text text-transparent ${isClicked ? 'animate-spin' : 'animate-pulse'}`} />
                      {/* Pulsing ring around icon */}
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
                {/* Large, visible resource count */}
                <div className="text-center">
                  <div className={`text-4xl font-bold bg-gradient-to-r ${colorGradient} bg-clip-text text-transparent drop-shadow-lg`}>
                    {formatNumber(amount)}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Current {resourceType}
                  </div>
                </div>
                
                <Button
                  onClick={() => handleClick(resourceType)}
                  className={`w-full bg-gradient-to-r ${colorGradient} hover:opacity-90 transition-all duration-200 transform active:scale-95 hover:shadow-lg relative overflow-hidden group text-white font-bold`}
                  size="sm"
                >
                  {/* Button shimmer effect */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <Plus className={`w-4 h-4 mr-1 ${isClicked ? 'animate-spin' : ''}`} />
                  Generate +{clickPower[resourceType]}
                </Button>
                
                {/* Resource progress bar with animated fill */}
                <div className="space-y-1">
                  <div className="text-xs text-gray-400 flex justify-between">
                    <span>Auto Production</span>
                    {increment > 0 && (
                      <span className={`text-green-400 animate-bounce text-xs font-bold`}>
                        +{formatNumber(increment)}/s
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Progress 
                      value={Math.min((amount % 1000) / 10, 100)} 
                      className="h-3"
                    />
                    {/* Animated progress glow */}
                    <div className={`absolute inset-0 h-3 bg-gradient-to-r ${colorGradient} opacity-30 rounded-full animate-pulse`}></div>
                  </div>
                </div>

                {/* Floating resource indicator */}
                {increment > 0 && (
                  <div className="absolute top-2 right-2 animate-float-up pointer-events-none">
                    <div className={`text-sm font-bold bg-gradient-to-r ${colorGradient} bg-clip-text text-transparent drop-shadow-lg`}>
                      +{formatNumber(increment)}
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Resource particles */}
              {isClicked && (
                <ResourceParticles 
                  resourceType={resourceType}
                  color={colorGradient}
                />
              )}
            </Card>

            {/* Background animated orbs */}
            <div className="absolute -inset-2 pointer-events-none overflow-hidden rounded-lg">
              <div className={`absolute top-0 left-0 w-4 h-4 bg-gradient-to-r ${colorGradient} rounded-full opacity-20 animate-float-slow`}></div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 bg-gradient-to-r ${colorGradient} rounded-full opacity-30 animate-float-slow-reverse`}></div>
            </div>
          </div>
        );
      })}

      {/* Resource Summary with animated background */}
      <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-shift"></div>
        <CardContent className="p-4 relative z-10">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Total Empire Value</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {formatNumber(Object.values(resources).reduce((sum, val) => sum + val, 0))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcePanel;