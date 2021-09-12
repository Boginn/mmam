class Person {
  type = {
    grappler: 50,
    striker: 50,
  };
  legs = [
    {
      power: null,
      reach: null,
      durability: null,
    },
    {
      power: null,
      reach: null,
      durability: null,
    },
  ];
  arms = [
    {
      power: null,
      reach: null,
      durability: null,
    },
    {
      power: null,
      reach: null,
      durability: null,
    },
  ];
  body = [
    {
      durability: null,
    },
  ];
  head = [
    {
      durability: null,
      chin: null,
    },
  ];
  judging = {
    concentration: null,
    judgement: null,
    retention: null,
  };
  coaching = {
    striking: null,
    grappling: null,
    throwing: null,
    judgingAbility: null,
    judgingPotential: null,
    motivating: null,
    managing: null,
    youngsters: null,
    discipline: null,
  };
  mental = {
    adaptability: null,
    determination: null,
    ambition: null,
    loyalty: null,
    pressure: null,
    professionalism: null,
    sportsmanship: null,
    temperement: null,
    dirtiness: undefined,
  };
  physical = {
    flair: null,
    agility: null,
    strength: null,
    stamina: null,
    workRate: null,
    pace: null,
    acceleration: null,
    explosiveness: null,
  };
  skill = {
    anticipation: null,
    positioning: null,
    decisions: null,
    vision: null,
    versatility: null,
    finishing: null,
    footwork: null,
    fluidity: null,
    sharpness: null,
  };
  weight = {
    bodyType: null,
  };
}

export default {
  Fighter: class extends Person {
    id;
    nickname;
    personal = {
      name: null,
      age: null,
      nationality: null,
      height: null,
    };
    contract = false;
    fieldable = true;
    fitness = 100;

    match = {
      momentum: undefined,
      condition: undefined,
      exposed: undefined,
      learned: undefined,
      finished: undefined,
      substituted: undefined,
    };

    tactic = {
      closeDistance: true,
      instructions: {},
    };

    constructor(nickname, name, age, nationality, height) {
      super();
      this.nickname = nickname;
      this.personal.name = name;
      this.personal.age = age;
      this.personal.nationality = nationality;
      this.personal.height = height;
    }
  },
  Coach: class extends Person {
    id;
    personal = {
      name: null,
      age: null,
      nationality: null,
    };
    contract = false;

    constructor(name, age, nationality) {
      super();
      this.personal.name = name;
      this.personal.age = age;
      this.personal.nationality = nationality;
    }
  },
  Judge: class extends Person {
    id;
    personal = {
      name: null,
    };

    constructor(id, name) {
      super();
      this.id = id;
      this.personal.name = name;
    }
  },
  Club: class {
    npc = true;
    id;
    name;
    nickname;
    nationality;
    reputation;
    squad = [];
    tactic;
    competitions = {
      league: {
        matches: 0,
        pointsNet: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        form: [],
        finishes: 0,
      },
      cup: {},
    };

    constructor(name, nationality) {
      this.name = name;
      this.nationality = nationality;
    }
  },
  Match: class {
    npc = true;
    id;
    date;
    clubs = [];

    homeTactics;
    awayTactics;

    constructor(clubs, date) {
      this.clubs = clubs;
      this.date = date;
    }
  },
  Tactic: class {
    clubId;
    instructions = {
      mentality: 0,
      risk: 0,
      gamesmanship: 0,
    };
    selection = {
      left: 0,
      center: 0,
      right: 0,
    };

    constructor(clubId) {
      this.clubId = clubId;
    }
  },
};
