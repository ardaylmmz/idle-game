import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Zap, Pickaxe, Gem, Users, Plus } from "lucide-react";

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

const ResourcePanel = ({ resources, clickPower, onManualClick }) => {
  const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return Math.floor(num).toLocaleString();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Resources
      </h2>
      
      {Object.entries(resources).map(([resourceType, amount]) => {
        const IconComponent = resourceIcons[resourceType];
        const colorGradient = resourceColors[resourceType];
        
        return (
          <Card key={resourceType} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <IconComponent className={`w-5 h-5 bg-gradient-to-r ${colorGradient} bg-clip-text text-transparent`} />
                  <span className="capitalize">{resourceType}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  +{clickPower[resourceType]}/click
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {formatNumber(amount)}
              </div>
              
              <Button
                onClick={() => onManualClick(resourceType)}
                className={`w-full bg-gradient-to-r ${colorGradient} hover:opacity-90 transition-all duration-200 transform active:scale-95`}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Generate
              </Button>
              
              {/* Resource progress bar for visual appeal */}
              <div className="space-y-1">
                <div className="text-xs text-gray-400">Production Rate</div>
                <Progress 
                  value={Math.min((amount % 1000) / 10, 100)} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ResourcePanel;