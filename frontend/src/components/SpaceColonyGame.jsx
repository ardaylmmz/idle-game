import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ResourcePanel from "./ResourcePanel";
import FacilityPanel from "./FacilityPanel";
import ContractPanel from "./ContractPanel";
import PlanetPanel from "./PlanetPanel";
import SpaceVisuals from "./SpaceVisuals";
import { mockData } from "../utils/mockData";
import { Sparkles, Factory, FileText, Globe, TrendingUp } from "lucide-react";

const SpaceFarmingGame = () => {
  const [gameState, setGameState] = useState(mockData.initialGameState);
  const [currentPlanet, setCurrentPlanet] = useState(mockData.planets[0]);
  const [activeContracts, setActiveContracts] = useState([]);
  const [availableContracts, setAvailableContracts] = useState([]);
  const [showPlanetTransition, setShowPlanetTransition] = useState(false);

  // Generate new contracts periodically
  useEffect(() => {
    const generateContract = () => {
      const template = mockData.contractTemplates[Math.floor(Math.random() * mockData.contractTemplates.length)];
      const resourceType = template.types[Math.floor(Math.random() * template.types.length)];
      const difficulties = ['easy', 'medium', 'hard'];
      const difficulty = difficulties[Math.min(currentPlanet.level - 1, 2)];
      const range = template.difficultyRanges[difficulty];
      
      const amount = Math.floor(Math.random() * (range.amount[1] - range.amount[0] + 1)) + range.amount[0];
      const payment = Math.floor(Math.random() * (range.payment[1] - range.payment[0] + 1)) + range.payment[0];
      const timeLimit = Math.floor(Math.random() * (range.time[1] - range.time[0] + 1)) + range.time[0];
      
      return {
        id: Date.now() + Math.random(),
        client: template.client,
        demand: resourceType,
        amount: Math.floor(amount * currentPlanet.difficultyMultiplier),
        payment: Math.floor(payment * currentPlanet.difficultyMultiplier),
        reputation: Math.floor(amount * 0.1),
        timeLimit,
        difficulty,
        timeRemaining: timeLimit,
        active: false
      };
    };

    // Generate initial contracts
    if (availableContracts.length < 3) {
      const newContracts = [];
      for (let i = 0; i < 3 - availableContracts.length; i++) {
        newContracts.push(generateContract());
      }
      setAvailableContracts(prev => [...prev, ...newContracts]);
    }

    // Generate new contract every 30 seconds
    const contractInterval = setInterval(() => {
      if (availableContracts.length < 5) {
        setAvailableContracts(prev => [...prev, generateContract()]);
      }
    }, 30000);

    return () => clearInterval(contractInterval);
  }, [currentPlanet, availableContracts.length]);

  // Handle active contracts countdown
  useEffect(() => {
    const contractTimer = setInterval(() => {
      setActiveContracts(prev => prev.map(contract => ({
        ...contract,
        timeRemaining: Math.max(0, contract.timeRemaining - 1)
      })).filter(contract => contract.timeRemaining > 0));
    }, 1000);

    return () => clearInterval(contractTimer);
  }, []);

  // Check planet progression
  useEffect(() => {
    if (gameState.resources.money >= currentPlanet.progressThreshold && currentPlanet.level < mockData.planets.length) {
      const nextPlanet = mockData.planets[currentPlanet.level];
      if (nextPlanet) {
        setShowPlanetTransition(true);
        setTimeout(() => {
          setCurrentPlanet(nextPlanet);
          // Reset resources with planet bonuses
          setGameState(prevState => ({
            ...prevState,
            resources: { ...nextPlanet.startingResources },
            planetLevel: nextPlanet.level,
            facilities: Object.keys(prevState.facilities).reduce((acc, key) => {
              acc[key] = { ...prevState.facilities[key], owned: 0, level: 0 };
              return acc;
            }, {})
          }));
          setActiveContracts([]);
          setAvailableContracts([]);
          setShowPlanetTransition(false);
        }, 3000);
      }
    }
  }, [gameState.resources.money, currentPlanet]);

  // Auto-production effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prevState => {
        const newState = { ...prevState };
        
        // Process facility production
        Object.keys(newState.facilities).forEach(facilityKey => {
          const facility = newState.facilities[facilityKey];
          if (facility.owned > 0) {
            const baseProduction = facility.baseProduction * facility.owned * Math.pow(facility.efficiency, facility.level);
            const production = baseProduction / currentPlanet.difficultyMultiplier; // Harder planets = slower production
            
            // Check if we have enough consuming resources
            if (facility.consumes && facility.consumeRate) {
              const consumeAmount = facility.consumeRate * facility.owned;
              if (newState.resources[facility.consumes] >= consumeAmount) {
                newState.resources[facility.consumes] -= consumeAmount;
                newState.resources[facility.produces] = Math.min(
                  newState.resources[facility.produces] + production,
                  newState.storageCapacity[facility.produces]
                );
              }
            } else {
              newState.resources[facility.produces] = Math.min(
                newState.resources[facility.produces] + production,
                newState.storageCapacity[facility.produces]
              );
            }
          }
        });

        // Check contract completion
        activeContracts.forEach(contract => {
          if (newState.resources[contract.demand] >= contract.amount) {
            newState.resources[contract.demand] -= contract.amount;
            newState.resources.money += contract.payment;
            newState.resources.reputation += contract.reputation;
            
            setActiveContracts(prev => prev.filter(c => c.id !== contract.id));
          }
        });

        return newState;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlanet.difficultyMultiplier, activeContracts]);

  const handleManualClick = (resourceType) => {
    setGameState(prevState => ({
      ...prevState,
      resources: {
        ...prevState.resources,
        [resourceType]: Math.min(
          prevState.resources[resourceType] + prevState.clickPower[resourceType],
          prevState.storageCapacity[resourceType]
        )
      }
    }));
  };

  const handleFacilityPurchase = (facilityKey) => {
    const facility = gameState.facilities[facilityKey];
    const cost = Math.floor(facility.baseCost * Math.pow(facility.costMultiplier, facility.owned) * currentPlanet.difficultyMultiplier);
    
    if (gameState.resources[facility.costResource] >= cost) {
      setGameState(prevState => ({
        ...prevState,
        resources: {
          ...prevState.resources,
          [facility.costResource]: prevState.resources[facility.costResource] - cost
        },
        facilities: {
          ...prevState.facilities,
          [facilityKey]: {
            ...facility,
            owned: facility.owned + 1
          }
        }
      }));
    }
  };

  const handleFacilityUpgrade = (facilityKey) => {
    const facility = gameState.facilities[facilityKey];
    const upgradeCost = Math.floor(facility.upgradeCost * Math.pow(1.5, facility.level) * currentPlanet.difficultyMultiplier);
    
    if (gameState.resources.research >= upgradeCost) {
      setGameState(prevState => ({
        ...prevState,
        resources: {
          ...prevState.resources,
          research: prevState.resources.research - upgradeCost
        },
        facilities: {
          ...prevState.facilities,
          [facilityKey]: {
            ...facility,
            level: facility.level + 1
          }
        }
      }));
    }
  };

  const handleContractAccept = (contract) => {
    setActiveContracts(prev => [...prev, { ...contract, active: true }]);
    setAvailableContracts(prev => prev.filter(c => c.id !== contract.id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Background Space Visuals */}
      <SpaceVisuals gameState={gameState} currentPlanet={currentPlanet} />
      
      {/* Planet Transition Overlay */}
      {showPlanetTransition && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="text-center animate-bounce-in">
            <div className="text-8xl mb-4">{mockData.planets[currentPlanet.level]?.emoji}</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
              🚀 Advancing to {mockData.planets[currentPlanet.level]?.name}!
            </div>
            <div className="text-xl text-gray-300 mb-4">
              {mockData.planets[currentPlanet.level]?.description}
            </div>
            <div className="text-lg text-orange-400">
              Difficulty increased: ×{mockData.planets[currentPlanet.level]?.difficultyMultiplier}
            </div>
            <div className="text-sm text-green-400 mt-2">
              Unlock: {mockData.planets[currentPlanet.level]?.unlockBonus}
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto p-6 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
            🌱 Space Agriculture Tycoon
          </h1>
          <p className="text-xl text-gray-300">Build the ultimate interplanetary farming empire</p>
          
          <div className="flex justify-center gap-4 mt-4">
            <Badge className={`bg-gradient-to-r ${currentPlanet.color} text-white border-none`}>
              {currentPlanet.emoji} {currentPlanet.name}
            </Badge>
            
            <Badge variant="outline" className="text-orange-400 border-orange-400">
              Level {currentPlanet.level} | Difficulty ×{currentPlanet.difficultyMultiplier}
            </Badge>
            
            <Badge variant="outline" className="text-green-400 border-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              {gameState.resources.reputation} Reputation
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Resources Panel */}
          <div className="lg:col-span-1">
            <ResourcePanel 
              resources={gameState.resources}
              clickPower={gameState.clickPower}
              storageCapacity={gameState.storageCapacity}
              onManualClick={handleManualClick}
              currentPlanet={currentPlanet}
            />
          </div>

          {/* Main Game Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="facilities" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
                <TabsTrigger value="facilities" className="flex items-center gap-2">
                  <Factory className="w-4 h-4" />
                  Facilities
                </TabsTrigger>
                <TabsTrigger value="contracts" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Contracts ({activeContracts.length})
                </TabsTrigger>
                <TabsTrigger value="planet" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Planet Progress
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Achievements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="facilities" className="space-y-6">
                <FacilityPanel
                  facilities={gameState.facilities}
                  resources={gameState.resources}
                  onPurchase={handleFacilityPurchase}
                  onUpgrade={handleFacilityUpgrade}
                  currentPlanet={currentPlanet}
                />
              </TabsContent>

              <TabsContent value="contracts" className="space-y-6">
                <ContractPanel
                  activeContracts={activeContracts}
                  availableContracts={availableContracts}
                  resources={gameState.resources}
                  onAcceptContract={handleContractAccept}
                />
              </TabsContent>

              <TabsContent value="planet" className="space-y-6">
                <PlanetPanel
                  currentPlanet={currentPlanet}
                  gameState={gameState}
                  planets={mockData.planets}
                />
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <div className="text-center text-gray-400 py-20">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold mb-2">Achievements Coming Soon</h3>
                  <p>Unlock rewards for your farming achievements!</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceFarmingGame;