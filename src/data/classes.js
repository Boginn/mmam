class Person {
  type = {
    grappler: 50,
    striker: 50,
  }
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
    leadership: null,
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

    constructor(id, nickname, name, age, nationality, height) {
      super();
      this.id = id;
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

    constructor(id, name, age, nationality) {
      super();
      this.id = id;
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

    constructor(id, name, nationality) {
      this.id = id;
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
      mentality: null,
      risk: null,
      gamesmanship: null,
    };
    selection = {

      left: null,
      center: null,
      right: null,
    };

    constructor(clubId) {
      this.clubId = clubId;
    }
  },

  // Task: class Task {
  //   id;
  //   name = "";
  //   assigned = "";
  //   status = false;
  //   date = undefined;

  //   constructor(id, date) {
  //     this.id = id;
  //     this.date = date;
  //   }
  // },
};
