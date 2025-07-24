export const mockData = {
  initialGameState: {
    resources: {
      energy: 50,
      metal: 25,
      crystals: 5,
      population: 10
    },
    clickPower: {
      energy: 1,
      metal: 1,
      crystals: 1,
      population: 1
    },
    buildings: {
      solarPanel: {
        name: "Solar Panel",
        description: "Harnesses solar energy from nearby stars",
        owned: 0,
        level: 0,
        baseCost: 10,
        costMultiplier: 1.15,
        costResource: "metal",
        baseProduction: 2,
        produces: "energy",
        efficiency: 1.2,
        upgradeCost: 50
      },
      miningRig: {
        name: "Mining Rig",
        description: "Extracts valuable metals from asteroids",
        owned: 0,
        level: 0,
        baseCost: 25,
        costMultiplier: 1.2,
        costResource: "energy",
        baseProduction: 1.5,
        produces: "metal",
        efficiency: 1.15,
        upgradeCost: 75
      },
      crystalExtractor: {
        name: "Crystal Extractor",
        description: "Mines rare crystals from deep space",
        owned: 0,
        level: 0,
        baseCost: 100,
        costMultiplier: 1.25,
        costResource: "metal",
        baseProduction: 0.5,
        produces: "crystals",
        efficiency: 1.3,
        upgradeCost: 100
      },
      habitat: {
        name: "Habitat Module",
        description: "Houses colonists and grows population",
        owned: 0,
        level: 0,
        baseCost: 50,
        costMultiplier: 1.18,
        costResource: "energy",
        baseProduction: 0.8,
        produces: "population",
        efficiency: 1.25,
        upgradeCost: 125
      },
      researchLab: {
        name: "Research Lab",
        description: "Advances technology and improves efficiency",
        owned: 0,
        level: 0,
        baseCost: 200,
        costMultiplier: 1.3,
        costResource: "crystals",
        baseProduction: 0.2,
        produces: "energy",
        efficiency: 1.5,
        upgradeCost: 300
      }
    },
    prestigeLevel: 0,
    prestigeBonus: 0
  },
  
  achievements: [
    {
      id: "first_click",
      name: "First Steps",
      description: "Click to generate your first resource",
      requirement: "manual_click",
      threshold: 1,
      unlocked: false,
      reward: "Click power +1"
    },
    {
      id: "hundred_energy",
      name: "Power Plant",
      description: "Accumulate 100 energy",
      requirement: "energy",
      threshold: 100,
      unlocked: false,
      reward: "Energy generation +10%"
    },
    {
      id: "first_building",
      name: "Construction Begins",
      description: "Purchase your first building",
      requirement: "buildings_owned",
      threshold: 1,
      unlocked: false,
      reward: "All building costs -5%"
    },
    {
      id: "ten_buildings",
      name: "Industrial Complex",
      description: "Own 10 buildings total",
      requirement: "buildings_owned",
      threshold: 10,
      unlocked: false,
      reward: "Production efficiency +15%"
    },
    {
      id: "thousand_population",
      name: "Thriving Colony",
      description: "Reach 1000 population",
      requirement: "population",
      threshold: 1000,
      unlocked: false,
      reward: "Population growth +25%"
    },
    {
      id: "first_upgrade",
      name: "Technological Advance",
      description: "Upgrade your first building",
      requirement: "building_upgrades",
      threshold: 1,
      unlocked: false,
      reward: "Upgrade costs -10%"
    },
    {
      id: "crystal_collector",
      name: "Crystal Collector",
      description: "Accumulate 100 crystals",
      requirement: "crystals",
      threshold: 100,
      unlocked: false,
      reward: "Crystal production +20%"
    },
    {
      id: "automated_empire",
      name: "Automated Empire",
      description: "Generate 1000 resources per second",
      requirement: "production_rate",
      threshold: 1000,
      unlocked: false,
      reward: "All production +30%"
    }
  ]
};