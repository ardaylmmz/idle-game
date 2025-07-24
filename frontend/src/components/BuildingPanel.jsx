import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowUp, ShoppingCart, Zap, Pickaxe, Gem, Home, FlaskConical } from "lucide-react";

const buildingIcons = {
  solarPanel: Zap,
  miningRig: Pickaxe,
  crystalExtractor: Gem,
  habitat: Home,
  researchLab: FlaskConical
};

const buildingColors = {
  solarPanel: "from-yellow-400 to-orange-500",
  miningRig: "from-gray-400 to-gray-600",
  crystalExtractor: "from-purple-400 to-pink-500",
  habitat: "from-green-400 to-blue-500",
  researchLab: "from-cyan-400 to-blue-500"
};

const BuildingPanel = ({ buildings, resources, onPurchase, onUpgrade }) => {
  const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return Math.floor(num).toLocaleString();
  };

  const calculateCost = (building) => {
    return Math.floor(building.baseCost * Math.pow(building.costMultiplier, building.owned));
  };

  const calculateUpgradeCost = (building) => {
    return Math.floor(building.upgradeCost * Math.pow(1.5, building.level));
  };

  const calculateProduction = (building) => {
    return building.baseProduction * Math.pow(building.efficiency, building.level);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Buildings & Infrastructure
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(buildings).map(([buildingKey, building]) => {
          const IconComponent = buildingIcons[buildingKey];
          const colorGradient = buildingColors[buildingKey];
          const cost = calculateCost(building);
          const upgradeCost = calculateUpgradeCost(building);
          const production = calculateProduction(building);
          const canAfford = resources[building.costResource] >= cost;
          const canUpgrade = resources.crystals >= upgradeCost;
          
          return (
            <Card key={buildingKey} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-6 h-6 bg-gradient-to-r ${colorGradient} bg-clip-text text-transparent`} />
                    <div>
                      <div className="text-lg font-bold">{building.name}</div>
                      <div className="text-sm text-gray-400">{building.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">
                      Owned: {building.owned}
                    </Badge>
                    {building.level > 0 && (
                      <Badge variant="outline" className="block">
                        Level {building.level}
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Production</div>
                    <div className="font-bold text-green-400">
                      +{formatNumber(production)}/s {building.produces}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Total Output</div>
                    <div className="font-bold text-blue-400">
                      {formatNumber(production * building.owned)}/s
                    </div>
                  </div>
                </div>

                {/* Efficiency Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Efficiency</span>
                    <span>{(building.efficiency * 100).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={Math.min(building.efficiency * 100, 100)} 
                    className="h-2"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => onPurchase(buildingKey)}
                    disabled={!canAfford}
                    className={`flex-1 ${canAfford ? `bg-gradient-to-r ${colorGradient}` : 'bg-gray-600'} hover:opacity-90 transition-all duration-200`}
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy - {formatNumber(cost)} {building.costResource}
                  </Button>
                  
                  {building.owned > 0 && (
                    <Button
                      onClick={() => onUpgrade(buildingKey)}
                      disabled={!canUpgrade}
                      className={`${canUpgrade ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-600'} hover:opacity-90 transition-all duration-200`}
                      size="sm"
                    >
                      <ArrowUp className="w-4 h-4" />
                      {formatNumber(upgradeCost)} crystals
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BuildingPanel;