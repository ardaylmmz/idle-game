import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowUp, ShoppingCart, Home, Store, FlaskConical, Warehouse } from "lucide-react";

const facilityIcons = {
  greenhouse: Home,
  market: Store,
  laboratory: FlaskConical,
  seedbank: Warehouse,
  warehouse: Warehouse
};

const facilityColors = {
  greenhouse: "from-green-400 to-emerald-500",
  market: "from-blue-400 to-cyan-500",
  laboratory: "from-purple-400 to-pink-500",
  seedbank: "from-yellow-400 to-orange-500",
  warehouse: "from-gray-400 to-gray-600"
};

const FacilityPanel = ({ facilities, resources, onPurchase, onUpgrade, currentPlanet }) => {
  const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return Math.floor(num).toLocaleString();
  };

  const calculateCost = (facility) => {
    return Math.floor(facility.baseCost * Math.pow(facility.costMultiplier, facility.owned) * currentPlanet.difficultyMultiplier);
  };

  const calculateUpgradeCost = (facility) => {
    return Math.floor(facility.upgradeCost * Math.pow(1.5, facility.level) * currentPlanet.difficultyMultiplier);
  };

  const calculateProduction = (facility) => {
    const baseProduction = facility.baseProduction * Math.pow(facility.efficiency, facility.level);
    return baseProduction / currentPlanet.difficultyMultiplier;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Agricultural Facilities
        </h2>
        <p className="text-gray-400 mt-2">Difficulty: ×{currentPlanet.difficultyMultiplier} | Planet: {currentPlanet.name}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(facilities).map(([facilityKey, facility]) => {
          const IconComponent = facilityIcons[facilityKey];
          const colorGradient = facilityColors[facilityKey];
          const cost = calculateCost(facility);
          const upgradeCost = calculateUpgradeCost(facility);
          const production = calculateProduction(facility);
          const canAfford = resources[facility.costResource] >= cost;
          const canUpgrade = resources.research >= upgradeCost;
          
          return (
            <Card key={facilityKey} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-6 h-6 bg-gradient-to-r ${colorGradient} bg-clip-text text-transparent`} />
                    <div>
                      <div className="text-lg font-bold">{facility.name}</div>
                      <div className="text-sm text-gray-400">{facility.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">
                      Owned: {facility.owned}
                    </Badge>
                    {facility.level > 0 && (
                      <Badge variant="outline" className="block">
                        Level {facility.level}
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
                      +{formatNumber(production)}/s {facility.produces}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Consumes</div>
                    <div className="font-bold text-red-400">
                      -{formatNumber(facility.consumeRate || 0)}/s {facility.consumes || 'None'}
                    </div>
                  </div>
                </div>

                <div className="text-center p-2 bg-gray-900/50 rounded-lg">
                  <div className="text-xs text-gray-400">Total Facility Output</div>
                  <div className="font-bold text-yellow-400">
                    {formatNumber(production * facility.owned)}/s
                  </div>
                </div>

                {/* Efficiency Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Efficiency</span>
                    <span>{(facility.efficiency * 100).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={Math.min(facility.efficiency * 100, 100)} 
                    className="h-2"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => onPurchase(facilityKey)}
                    disabled={!canAfford}
                    className={`flex-1 ${canAfford ? `bg-gradient-to-r ${colorGradient}` : 'bg-gray-600'} hover:opacity-90 transition-all duration-200`}
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy - {formatNumber(cost)} {facility.costResource}
                  </Button>
                  
                  {facility.owned > 0 && (
                    <Button
                      onClick={() => onUpgrade(facilityKey)}
                      disabled={!canUpgrade}
                      className={`${canUpgrade ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-600'} hover:opacity-90 transition-all duration-200`}
                      size="sm"
                    >
                      <ArrowUp className="w-4 h-4" />
                      {formatNumber(upgradeCost)} research
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

export default FacilityPanel;