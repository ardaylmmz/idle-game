import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Sparkles, RotateCcw, Star, Crown, Zap } from "lucide-react";

const PrestigePanel = ({ gameState, onPrestige }) => {
  const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return Math.floor(num).toLocaleString();
  };

  const calculatePrestigeBonus = () => {
    return Math.floor(gameState.resources.population / 1000);
  };

  const prestigeBonus = calculatePrestigeBonus();
  const canPrestige = gameState.resources.population >= 1000;
  const nextPrestigeAt = (Math.floor(gameState.resources.population / 1000) + 1) * 1000;

  const prestigeBenefits = [
    "Reset all progress but keep prestige bonuses",
    `Gain +${prestigeBonus} prestige points`,
    "Increase base click power permanently",
    "Unlock exclusive prestige upgrades",
    "Faster early game progression"
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        Prestige System
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Status */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-purple-400" />
              <span>Current Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {gameState.prestigeLevel}
                </div>
                <div className="text-sm text-gray-400">Prestige Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">
                  {gameState.prestigeBonus}
                </div>
                <div className="text-sm text-gray-400">Prestige Points</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Population Progress</span>
                <span className="text-white">
                  {formatNumber(gameState.resources.population)} / {formatNumber(nextPrestigeAt)}
                </span>
              </div>
              <Progress 
                value={Math.min((gameState.resources.population % 1000) / 10, 100)} 
                className="h-3"
              />
            </div>

            <div className="bg-gray-900/50 p-3 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">Current Bonuses</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Click Power Bonus:</span>
                  <span className="text-green-400">+{gameState.prestigeBonus}</span>
                </div>
                <div className="flex justify-between">
                  <span>Experience Multiplier:</span>
                  <span className="text-blue-400">×{(1 + gameState.prestigeLevel * 0.1).toFixed(1)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prestige Action */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span>Prestige Reset</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg border border-purple-500/30">
              <div className="text-lg font-bold text-purple-400 mb-2">
                Next Prestige Reward
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                +{prestigeBonus} Points
              </div>
              <div className="text-sm text-gray-400">
                {canPrestige ? "Ready to prestige!" : `Need ${formatNumber(nextPrestigeAt - gameState.resources.population)} more population`}
              </div>
            </div>

            <Button
              onClick={onPrestige}
              disabled={!canPrestige}
              className={`w-full ${
                canPrestige 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                  : 'bg-gray-600'
              } transition-all duration-300 transform ${canPrestige ? 'hover:scale-105' : ''}`}
              size="lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              {canPrestige ? 'Prestige Now!' : 'Not Ready Yet'}
            </Button>

            {canPrestige && (
              <div className="text-xs text-center text-yellow-400 animate-pulse">
                ⚠️ This will reset all your progress!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Prestige Benefits */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-400" />
            <span>Prestige Benefits</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {prestigeBenefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700"
              >
                <Zap className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prestige Leaderboard (Mock) */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-gold-400" />
            <span>Prestige Milestones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { level: 1, title: "Space Cadet", reward: "Unlock automation", achieved: gameState.prestigeLevel >= 1 },
              { level: 5, title: "Colony Commander", reward: "2x resource generation", achieved: gameState.prestigeLevel >= 5 },
              { level: 10, title: "Galactic Admiral", reward: "Unlock mega structures", achieved: gameState.prestigeLevel >= 10 },
              { level: 25, title: "Cosmic Emperor", reward: "Universal bonuses", achieved: gameState.prestigeLevel >= 25 },
              { level: 50, title: "Dimensional Overlord", reward: "Transcend reality", achieved: gameState.prestigeLevel >= 50 }
            ].map((milestone) => (
              <div 
                key={milestone.level}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  milestone.achieved 
                    ? 'bg-yellow-900/30 border-yellow-500/50' 
                    : 'bg-gray-900/50 border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={milestone.achieved ? "default" : "outline"}
                    className={milestone.achieved ? 'bg-yellow-500 text-black' : ''}
                  >
                    Level {milestone.level}
                  </Badge>
                  <div>
                    <div className={`font-bold ${milestone.achieved ? 'text-yellow-400' : 'text-white'}`}>
                      {milestone.title}
                    </div>
                    <div className="text-sm text-gray-400">{milestone.reward}</div>
                  </div>
                </div>
                {milestone.achieved && (
                  <Crown className="w-5 h-5 text-yellow-400" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrestigePanel;