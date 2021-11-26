class Person {
  type = {
    grappler: 50,
    striker: 50,
  };
  body = {
    power: null,
    durability: null,
  };
  head = {
    durability: null,
    chin: null,
  };
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
    endurance: null,
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
    condition = 100;
    form = [];
    appearances = {
      overall: {
        international: 0,
        league: 0,
        cup: 0,
        finishes: 0,
      },
      season: {
        international: 0,
        league: 0,
        cup: 0,
        finishes: 0,
      },
    };

    match = {
      stamina: undefined,
      saves: undefined,
      controlled: undefined,
      grappled: undefined,
      dc: undefined,
      momentum: undefined,
      condition: undefined,
      exposed: undefined,
      learned: undefined,
      finished: undefined,
      substituted: undefined,
      finishes: undefined,
      composure: undefined,
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
    color = { primary: undefined, secondary: undefined };
    squad = [];
    staff = [];
    tactic;
    training = {
      schedule: [],
    };
    competitions = {
      league: {
        matches: 0,
        points: 0,
        pointsAgainst: 0,
        form: [],
        finishes: 0,
      },
      cup: {},
    };

    constructor(name, nationality, color, squad) {
      this.name = name;
      this.nationality = nationality;
      this.color = color;
      this.squad = squad;
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
  Outcome: class {
    msg = undefined;

    att = {
      stamina: 0,
      exposed: 0,
      damage: 0,
      learned: 0,
      dc: 0,
      saves: 0,
      momentum: undefined,
      grappled: undefined,
      controlled: undefined,
    };

    def = {
      stamina: 0,
      exposed: 0,
      damage: 0,
      learned: 0,
      dc: 0,
      saves: 0,
      momentum: undefined,
      grappled: undefined,
      controlled: undefined,
    };

    point = false;
    significant = false;
  },
  // TruePoints: class {

  //   ringTruePointsLeft [
  //     {away: 0, home: 0, awaySignificant: 0, homeSignificant: 0, round: 0},
  //     {away: 0, home: 0, awaySignificant: 0, homeSignificant: 0, round: 0},
  //     {away: 0, home: 0, awaySignificant: 0, homeSignificant: 0, round: 0},
  //   ],
  //   ringTruePointsCenter: [],
  //   ringTruePointsRight: [],
  // },
  Tactic: class {
    clubId;
    instructions = {
      general: { mentality: 0, risk: 0, gamesmanship: 0 },
      left: { mentality: 0, risk: 0, gamesmanship: 0 },
      center: { mentality: 0, risk: 0, gamesmanship: 0 },
      right: { mentality: 0, risk: 0, gamesmanship: 0 },
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
  NewsItem: class {
    date;
    title;
    content;
    id;
    read = false;

    constructor(date, title, content) {
      this.date = date;
      this.title = title;
      this.content = content;
    }
  },
  MatchDot: class {
    color;
    pos = {
      x: 75,
      y: 50,
    };
    size = 15;

    // expandState: undefined,

    constructor(color, pos) {
      this.pos = pos;
      this.color = color;
    }
  },
};
