import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ResourcePanel from "./ResourcePanel";
import BuildingPanel from "./BuildingPanel";
import AchievementPanel from "./AchievementPanel";
import PrestigePanel from "./PrestigePanel";
import SpaceVisuals from "./SpaceVisuals";
import { mockData } from "../utils/mockData";
import { Sparkles, Zap, Wrench, Users } from "lucide-react";

const SpaceColonyGame = () => {
  const [gameState, setGameState] = useState(mockData.initialGameState);
  const [achievements, setAchievements] = useState(mockData.achievements);

  // Auto-generation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prevState => {
        const newState = { ...prevState };
        
        // Auto-generate resources based on buildings
        Object.keys(newState.buildings).forEach(buildingKey => {
          const building = newState.buildings[buildingKey];
          if (building.owned > 0) {
            const production = building.baseProduction * building.owned * Math.pow(building.efficiency, building.level);
            newState.resources[building.produces] += production;
          }
        });

        return newState;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleManualClick = (resourceType) => {
    setGameState(prevState => ({
      ...prevState,
      resources: {
        ...prevState.resources,
        [resourceType]: prevState.resources[resourceType] + prevState.clickPower[resourceType]
      }
    }));
  };

  const handleBuildingPurchase = (buildingKey) => {
    const building = gameState.buildings[buildingKey];
    const cost = Math.floor(building.baseCost * Math.pow(building.costMultiplier, building.owned));
    
    if (gameState.resources[building.costResource] >= cost) {
      setGameState(prevState => ({
        ...prevState,
        resources: {
          ...prevState.resources,
          [building.costResource]: prevState.resources[building.costResource] - cost
        },
        buildings: {
          ...prevState.buildings,
          [buildingKey]: {
            ...building,
            owned: building.owned + 1
          }
        }
      }));
    }
  };

  const handleBuildingUpgrade = (buildingKey) => {
    const building = gameState.buildings[buildingKey];
    const upgradeCost = Math.floor(building.upgradeCost * Math.pow(1.5, building.level));
    
    if (gameState.resources.crystals >= upgradeCost) {
      setGameState(prevState => ({
        ...prevState,
        resources: {
          ...prevState.resources,
          crystals: prevState.resources.crystals - upgradeCost
        },
        buildings: {
          ...prevState.buildings,
          [buildingKey]: {
            ...building,
            level: building.level + 1
          }
        }
      }));
    }
  };

  const handlePrestige = () => {
    const prestigeBonus = Math.floor(gameState.resources.population / 1000);
    setGameState(prevState => ({
      ...mockData.initialGameState,
      prestigeLevel: prevState.prestigeLevel + 1,
      prestigeBonus: prevState.prestigeBonus + prestigeBonus,
      clickPower: {
        energy: 1 + prestigeBonus,
        metal: 1 + prestigeBonus,
        crystals: 1 + Math.floor(prestigeBonus / 2),
        population: 1 + Math.floor(prestigeBonus / 3)
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Background Space Visuals */}
      <SpaceVisuals gameState={gameState} />
      
      <div className="container mx-auto p-6 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            🚀 Stellar Colony
          </h1>
          <p className="text-xl text-gray-300">Build your space empire, one click at a time</p>
          {gameState.prestigeLevel > 0 && (
            <Badge variant="secondary" className="mt-2">
              <Sparkles className="w-4 h-4 mr-1" />
              Prestige Level {gameState.prestigeLevel}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Resources Panel */}
          <div className="lg:col-span-1">
            <ResourcePanel 
              resources={gameState.resources}
              clickPower={gameState.clickPower}
              onManualClick={handleManualClick}
            />
          </div>

          {/* Main Game Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="buildings" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
                <TabsTrigger value="buildings" className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Buildings
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Achievements
                </TabsTrigger>
                <TabsTrigger value="prestige" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Prestige
                </TabsTrigger>
              </TabsList>

              <TabsContent value="buildings" className="space-y-6">
                <BuildingPanel
                  buildings={gameState.buildings}
                  resources={gameState.resources}
                  onPurchase={handleBuildingPurchase}
                  onUpgrade={handleBuildingUpgrade}
                />
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <AchievementPanel 
                  achievements={achievements}
                  gameState={gameState}
                />
              </TabsContent>

              <TabsContent value="prestige" className="space-y-6">
                <PrestigePanel
                  gameState={gameState}
                  onPrestige={handlePrestige}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceColonyGame;