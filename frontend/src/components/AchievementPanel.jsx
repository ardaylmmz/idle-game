import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Trophy, Star, Lock, CheckCircle } from "lucide-react";

const AchievementPanel = ({ achievements, gameState }) => {
  const checkAchievementProgress = (achievement) => {
    switch (achievement.requirement) {
      case "manual_click":
        return { current: 1, progress: 100 }; // Mock progress
      case "energy":
        return { 
          current: gameState.resources.energy, 
          progress: Math.min((gameState.resources.energy / achievement.threshold) * 100, 100) 
        };
      case "metal":
        return { 
          current: gameState.resources.metal, 
          progress: Math.min((gameState.resources.metal / achievement.threshold) * 100, 100) 
        };
      case "crystals":
        return { 
          current: gameState.resources.crystals, 
          progress: Math.min((gameState.resources.crystals / achievement.threshold) * 100, 100) 
        };
      case "population":
        return { 
          current: gameState.resources.population, 
          progress: Math.min((gameState.resources.population / achievement.threshold) * 100, 100) 
        };
      case "buildings_owned":
        const totalBuildings = Object.values(gameState.buildings).reduce((sum, building) => sum + building.owned, 0);
        return { 
          current: totalBuildings, 
          progress: Math.min((totalBuildings / achievement.threshold) * 100, 100) 
        };
      case "building_upgrades":
        const totalUpgrades = Object.values(gameState.buildings).reduce((sum, building) => sum + building.level, 0);
        return { 
          current: totalUpgrades, 
          progress: Math.min((totalUpgrades / achievement.threshold) * 100, 100) 
        };
      case "production_rate":
        return { current: 500, progress: 50 }; // Mock for now
      default:
        return { current: 0, progress: 0 };
    }
  };

  const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return Math.floor(num).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
        Achievements
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const { current, progress } = checkAchievementProgress(achievement);
          const isCompleted = progress >= 100;
          
          return (
            <Card 
              key={achievement.id} 
              className={`${
                isCompleted 
                  ? 'bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/50' 
                  : 'bg-gray-800/50 border-gray-700'
              } hover:bg-gray-800/70 transition-all duration-300`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-yellow-400" />
                    ) : progress > 0 ? (
                      <Star className="w-6 h-6 text-gray-400" />
                    ) : (
                      <Lock className="w-6 h-6 text-gray-600" />
                    )}
                    <span className={isCompleted ? 'text-yellow-400' : 'text-white'}>
                      {achievement.name}
                    </span>
                  </div>
                  {isCompleted && (
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-400">
                  {achievement.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Progress</span>
                    <span className={isCompleted ? 'text-yellow-400' : 'text-white'}>
                      {formatNumber(current)} / {formatNumber(achievement.threshold)}
                    </span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
                </div>
                
                <Badge 
                  variant={isCompleted ? "default" : "outline"} 
                  className={`w-full justify-center ${
                    isCompleted 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                      : 'border-gray-600 text-gray-400'
                  }`}
                >
                  {isCompleted ? '🎉 Completed!' : `Reward: ${achievement.reward}`}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center">
        <Card className="bg-gray-800/30 border-gray-700 inline-block">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-lg font-bold text-yellow-400">
                  {achievements.filter(a => checkAchievementProgress(a).progress >= 100).length} / {achievements.length}
                </div>
                <div className="text-sm text-gray-400">Achievements Unlocked</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AchievementPanel;