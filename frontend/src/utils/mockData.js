export const mockData = {
  initialGameState: {
    resources: {
      seeds: 10,
      crops: 0,
      money: 100,
      research: 0,
      reputation: 50
    },
    clickPower: {
      seeds: 1,
      crops: 1,
      money: 1,
      research: 1,
      reputation: 1
    },
    facilities: {
      greenhouse: {
        name: "Greenhouse",
        description: "Grows crops from seeds using controlled environment",
        owned: 0,
        level: 0,
        baseCost: 50,
        costMultiplier: 1.3,
        costResource: "money",
        baseProduction: 1,
        produces: "crops",
        consumes: "seeds",
        consumeRate: 0.5,
        efficiency: 1.1,
        upgradeCost: 25
      },
      market: {
        name: "Trading Post",
        description: "Sells crops to space traders for profit",
        owned: 0,
        level: 0,
        baseCost: 100,
        costMultiplier: 1.4,
        costResource: "money",
        baseProduction: 3,
        produces: "money",
        consumes: "crops",
        consumeRate: 1,
        efficiency: 1.2,
        upgradeCost: 50
      },
      laboratory: {
        name: "Research Lab",
        description: "Develops better farming techniques and crop varieties",
        owned: 0,
        level: 0,
        baseCost: 200,
        costMultiplier: 1.5,
        costResource: "money",
        baseProduction: 0.3,
        produces: "research",
        consumes: "money",
        consumeRate: 2,
        efficiency: 1.3,
        upgradeCost: 100
      },
      seedbank: {
        name: "Seed Bank",
        description: "Produces high-quality seeds for cultivation",
        owned: 0,
        level: 0,
        baseCost: 75,
        costMultiplier: 1.25,
        costResource: "money",
        baseProduction: 2,
        produces: "seeds",
        consumes: "research",
        consumeRate: 0.1,
        efficiency: 1.15,
        upgradeCost: 35
      },
      warehouse: {
        name: "Storage Facility",
        description: "Increases storage capacity and preserves resources",
        owned: 0,
        level: 0,
        baseCost: 150,
        costMultiplier: 1.35,
        costResource: "money",
        baseProduction: 0.2,
        produces: "reputation",
        consumes: "money",
        consumeRate: 1,
        efficiency: 1.25,
        upgradeCost: 75
      }
    },
    contracts: [
      {
        id: 1,
        client: "Mars Colony Alpha",
        demand: "crops",
        amount: 100,
        payment: 500,
        reputation: 10,
        timeLimit: 120, // seconds
        difficulty: "easy",
        active: false
      },
      {
        id: 2,
        client: "Jupiter Mining Corp",
        demand: "seeds",
        amount: 50,
        payment: 300,
        reputation: 5,
        timeLimit: 90,
        difficulty: "easy",
        active: false
      }
    ],
    achievements: [],
    planetLevel: 1,
    planetProgress: 0,
    gameTime: 0,
    storageCapacity: {
      seeds: 1000,
      crops: 500,
      money: 50000,
      research: 200,
      reputation: 1000
    }
  },
  
  planets: [
    {
      level: 1,
      name: "Earth Orbital Station",
      emoji: "🌍",
      color: "from-blue-400 to-green-400",
      description: "Your first farming station in Earth's orbit",
      progressThreshold: 1000, // money needed to advance
      difficultyMultiplier: 1,
      startingResources: {
        seeds: 10,
        crops: 0,
        money: 100,
        research: 0,
        reputation: 50
      },
      unlockBonus: "Basic farming techniques",
      challenges: ["Learn basic crop production", "Establish trade routes"]
    },
    {
      level: 2,
      name: "Mars Agricultural Dome",
      emoji: "🔴",
      color: "from-red-400 to-orange-400",
      description: "Harsh environment requires advanced farming",
      progressThreshold: 5000,
      difficultyMultiplier: 1.5,
      startingResources: {
        seeds: 5,
        crops: 0,
        money: 50,
        research: 10,
        reputation: 100
      },
      unlockBonus: "Drought-resistant crops (+20% efficiency)",
      challenges: ["Survive water scarcity", "Build reputation with colonies"]
    },
    {
      level: 3,
      name: "Europa Ice Farms",
      emoji: "🧊",
      color: "from-cyan-400 to-blue-400",
      description: "Underwater farming in Europa's frozen oceans",
      progressThreshold: 25000,
      difficultyMultiplier: 2.0,
      startingResources: {
        seeds: 3,
        crops: 0,
        money: 25,
        research: 25,
        reputation: 200
      },
      unlockBonus: "Hydroponic mastery (+30% production)",
      challenges: ["Master underwater agriculture", "Handle extreme cold conditions"]
    },
    {
      level: 4,
      name: "Titan Methane Gardens",
      emoji: "🟡",
      color: "from-yellow-400 to-orange-400",
      description: "Exotic farming using Titan's methane atmosphere",
      progressThreshold: 100000,
      difficultyMultiplier: 3.0,
      startingResources: {
        seeds: 2,
        crops: 0,
        money: 15,
        research: 50,
        reputation: 300
      },
      unlockBonus: "Methane-powered growth (+50% speed)",
      challenges: ["Adapt to methane environment", "Create new crop varieties"]
    },
    {
      level: 5,
      name: "Proxima Centauri Station",
      emoji: "🪐",
      color: "from-purple-400 to-pink-400",
      description: "Interstellar farming at the edge of known space",
      progressThreshold: 500000,
      difficultyMultiplier: 5.0,
      startingResources: {
        seeds: 1,
        crops: 0,
        money: 10,
        research: 100,
        reputation: 500
      },
      unlockBonus: "Quantum agriculture (+100% all production)",
      challenges: ["Pioneer interstellar agriculture", "Handle cosmic radiation"]
    }
  ],

  contractTemplates: [
    {
      client: "Mars Colony Alpha",
      types: ["crops", "seeds"],
      difficultyRanges: {
        easy: { amount: [50, 150], payment: [200, 600], time: [60, 120] },
        medium: { amount: [100, 300], payment: [400, 1200], time: [45, 90] },
        hard: { amount: [200, 500], payment: [800, 2000], time: [30, 60] }
      }
    },
    {
      client: "Jupiter Mining Corp",
      types: ["seeds", "research"],
      difficultyRanges: {
        easy: { amount: [25, 75], payment: [150, 450], time: [90, 150] },
        medium: { amount: [50, 150], payment: [300, 900], time: [60, 120] },
        hard: { amount: [100, 250], payment: [600, 1500], time: [45, 90] }
      }
    },
    {
      client: "Europa Research Station",
      types: ["research", "crops"],
      difficultyRanges: {
        easy: { amount: [10, 30], payment: [300, 800], time: [120, 180] },
        medium: { amount: [20, 60], payment: [600, 1600], time: [90, 150] },
        hard: { amount: [40, 100], payment: [1200, 3000], time: [60, 120] }
      }
    },
    {
      client: "Titan Atmospheric Labs",
      types: ["research", "seeds"],
      difficultyRanges: {
        easy: { amount: [5, 20], payment: [500, 1200], time: [150, 200] },
        medium: { amount: [15, 40], payment: [1000, 2400], time: [100, 150] },
        hard: { amount: [30, 80], payment: [2000, 4800], time: [80, 120] }
      }
    }
  ]
};