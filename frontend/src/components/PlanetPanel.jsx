import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Rocket, Star, TrendingUp, Lock, CheckCircle } from "lucide-react";

const PlanetPanel = ({ currentPlanet, gameState, planets }) => {
  const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return Math.floor(num).toLocaleString();
  };

  const getProgressToNext = () => {
    const progress = (gameState.resources.money / currentPlanet.progressThreshold) * 100;
    return Math.min(progress, 100);
  };

  const getNextPlanet = () => {
    return planets.find(planet => planet.level === currentPlanet.level + 1);
  };

  const nextPlanet = getNextPlanet();
  const progressPercent = getProgressToNext();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Galactic Expansion
        </h2>
        <p className="text-gray-400 mt-2">Expand your farming empire across the galaxy</p>
      </div>

      {/* Current Planet Status */}
      <Card className={`bg-gradient-to-br ${currentPlanet.color}/20 border-gray-700 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{currentPlanet.emoji}</div>
              <div>
                <div className="text-2xl font-bold">{currentPlanet.name}</div>
                <div className="text-gray-400">{currentPlanet.description}</div>
              </div>
            </div>
            <Badge className={`bg-gradient-to-r ${currentPlanet.color} text-white border-none`}>
              Level {currentPlanet.level}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 relative z-10">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-900/50 rounded-lg">
              <div className="text-gray-400">Difficulty Multiplier</div>
              <div className="text-2xl font-bold text-orange-400">×{currentPlanet.difficultyMultiplier}</div>
            </div>
            <div className="text-center p-3 bg-gray-900/50 rounded-lg">
              <div className="text-gray-400">Unlock Bonus</div>
              <div className="text-sm font-bold text-green-400">{currentPlanet.unlockBonus}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-400">Planet Mastery Challenges:</div>
            <div className="space-y-1">
              {currentPlanet.challenges.map((challenge, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-gray-300">{challenge}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress to Next Planet */}
      {nextPlanet && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Rocket className="w-6 h-6 text-blue-400" />
              <span>Next Destination: {nextPlanet.name}</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{nextPlanet.emoji}</div>
              <div className="flex-1">
                <div className="text-lg font-bold">{nextPlanet.name}</div>
                <div className="text-sm text-gray-400">{nextPlanet.description}</div>
              </div>
              <Badge variant="outline" className="text-orange-400 border-orange-400">
                Difficulty ×{nextPlanet.difficultyMultiplier}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress to Launch</span>
                <span className="text-white">
                  ${formatNumber(gameState.resources.money)} / ${formatNumber(currentPlanet.progressThreshold)}
                </span>
              </div>
              <Progress value={progressPercent} className="h-3" />
              <div className="text-center">
                {progressPercent >= 100 ? (
                  <div className="text-green-400 font-bold animate-pulse">
                    🚀 Ready for Launch! Expansion will begin automatically.
                  </div>
                ) : (
                  <div className="text-gray-400">
                    ${formatNumber(currentPlanet.progressThreshold - gameState.resources.money)} more needed
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-green-900/30 rounded-lg border border-green-500/30">
              <div className="text-sm text-green-400 font-bold mb-1">Unlock Bonus:</div>
              <div className="text-sm text-gray-300">{nextPlanet.unlockBonus}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Planet Timeline */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-400" />
            <span>Galactic Expansion Timeline</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {planets.map((planet) => {
              const isUnlocked = planet.level <= currentPlanet.level;
              const isCurrent = planet.level === currentPlanet.level;
              const canUnlock = planet.level === currentPlanet.level + 1 && progressPercent >= 100;
              
              return (
                <div 
                  key={planet.level}
                  className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-300 ${
                    isCurrent 
                      ? 'border-purple-500/50 bg-purple-900/20 scale-105' 
                      : isUnlocked 
                        ? 'border-green-500/50 bg-green-900/20' 
                        : canUnlock
                          ? 'border-yellow-500/50 bg-yellow-900/20 animate-pulse'
                          : 'border-gray-700 bg-gray-900/20'
                  }`}
                >
                  <div className="text-2xl">{planet.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{planet.name}</span>
                      {isUnlocked && <CheckCircle className="w-4 h-4 text-green-400" />}
                      {!isUnlocked && !canUnlock && <Lock className="w-4 h-4 text-gray-500" />}
                      {canUnlock && <Rocket className="w-4 h-4 text-yellow-400 animate-bounce" />}
                    </div>
                    <div className="text-xs text-gray-400">{planet.description}</div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline" 
                      className={`${
                        isUnlocked ? 'text-green-400 border-green-400' : 'text-gray-500 border-gray-500'
                      }`}
                    >
                      ×{planet.difficultyMultiplier}
                    </Badge>
                    <div className="text-xs text-gray-400 mt-1">
                      ${formatNumber(planet.progressThreshold)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Empire Statistics */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <span>Empire Statistics</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-900/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">{currentPlanet.level}</div>
              <div className="text-xs text-gray-400">Current Planet</div>
            </div>
            <div className="text-center p-3 bg-gray-900/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{gameState.resources.reputation}</div>
              <div className="text-xs text-gray-400">Reputation</div>
            </div>
            <div className="text-center p-3 bg-gray-900/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">
                {Object.values(gameState.facilities).reduce((sum, facility) => sum + facility.owned, 0)}
              </div>
              <div className="text-xs text-gray-400">Total Facilities</div>
            </div>
            <div className="text-center p-3 bg-gray-900/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">
                ${formatNumber(gameState.resources.money + (gameState.resources.crops * 5))}
              </div>
              <div className="text-xs text-gray-400">Net Worth</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanetPanel;