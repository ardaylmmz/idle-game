import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Clock, DollarSign, Star, CheckCircle, AlertCircle, FileText } from "lucide-react";

const ContractPanel = ({ activeContracts, availableContracts, resources, onAcceptContract }) => {
  const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return Math.floor(num).toLocaleString();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'from-green-400 to-emerald-500';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'hard': return 'from-red-400 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const canCompleteContract = (contract) => {
    return resources[contract.demand] >= contract.amount;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Trading Contracts
        </h2>
        <p className="text-gray-400 mt-2">Fulfill contracts to earn money and reputation</p>
      </div>

      {/* Active Contracts */}
      {activeContracts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-green-400 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Active Contracts ({activeContracts.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeContracts.map((contract) => {
              const isCompleted = canCompleteContract(contract);
              const progressPercent = Math.min((resources[contract.demand] / contract.amount) * 100, 100);
              const timePercent = (contract.timeRemaining / contract.timeLimit) * 100;
              
              return (
                <Card key={contract.id} className={`bg-gray-800/50 border-gray-700 ${isCompleted ? 'border-green-500/50 bg-green-900/20' : ''}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <div>
                          <div className="text-lg font-bold">{contract.client}</div>
                          <div className="text-sm text-gray-400">Needs {contract.amount} {contract.demand}</div>
                        </div>
                      </div>
                      <Badge className={`bg-gradient-to-r ${getDifficultyColor(contract.difficulty)} text-white`}>
                        {contract.difficulty}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span>Reward: ${formatNumber(contract.payment)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-purple-400" />
                        <span>Rep: +{contract.reputation}</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Progress</span>
                        <span>{formatNumber(resources[contract.demand])} / {formatNumber(contract.amount)}</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>

                    {/* Time Remaining */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Time Left
                        </span>
                        <span className={timePercent < 25 ? 'text-red-400 animate-pulse' : 'text-white'}>
                          {formatTime(contract.timeRemaining)}
                        </span>
                      </div>
                      <Progress 
                        value={timePercent} 
                        className={`h-2 ${timePercent < 25 ? 'bg-red-900' : ''}`}
                      />
                    </div>

                    {isCompleted && (
                      <div className="text-center p-2 bg-green-900/50 rounded-lg border border-green-500/50">
                        <div className="text-green-400 font-bold animate-pulse">
                          ✅ Ready for delivery! Resources will be auto-collected.
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Contracts */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Available Contracts ({availableContracts.length})
        </h3>
        
        {availableContracts.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-8 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No Contracts Available</h3>
              <p className="text-gray-500">New contracts will appear periodically. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableContracts.map((contract) => (
              <Card key={contract.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-base font-bold">{contract.client}</div>
                        <div className="text-xs text-gray-400">Wants {contract.amount} {contract.demand}</div>
                      </div>
                    </div>
                    <Badge className={`bg-gradient-to-r ${getDifficultyColor(contract.difficulty)} text-white text-xs`}>
                      {contract.difficulty}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-green-400" />
                        <span>Payment:</span>
                      </div>
                      <span className="font-bold text-green-400">${formatNumber(contract.payment)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-purple-400" />
                        <span>Reputation:</span>
                      </div>
                      <span className="font-bold text-purple-400">+{contract.reputation}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-yellow-400" />
                        <span>Time Limit:</span>
                      </div>
                      <span className="font-bold text-yellow-400">{formatTime(contract.timeLimit)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => onAcceptContract(contract)}
                    disabled={activeContracts.length >= 3} // Max 3 active contracts
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-all duration-200"
                    size="sm"
                  >
                    {activeContracts.length >= 3 ? 'Contract Limit Reached' : 'Accept Contract'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractPanel;