export default {
  ArchivedMatch: class {
    id = null;
    date = null;
    clubs = [];
    homeScore = 0;
    awayScore = 0;
    left = {
      finish: undefined,
      judges: [
        {
          homeRound1: undefined,
          homeRound2: undefined,
          homeRound3: undefined,
          awayRound1: undefined,
          awayRound2: undefined,
          awayRound3: undefined,
        },
        {
          homeRound1: undefined,
          homeRound2: undefined,
          homeRound3: undefined,
          awayRound1: undefined,
          awayRound2: undefined,
          awayRound3: undefined,
        },
        {
          homeRound1: undefined,
          homeRound2: undefined,
          homeRound3: undefined,
          awayRound1: undefined,
          awayRound2: undefined,
          awayRound3: undefined,
        },
      ],
    };
    center = {
      finish: undefined,
      judges: [
        {
          homeRound1: undefined,
          homeRound2: undefined,
          homeRound3: undefined,
          awayRound1: undefined,
          awayRound2: undefined,
          awayRound3: undefined,
        },
        {
          homeRound1: undefined,
          homeRound2: undefined,
          homeRound3: undefined,
          awayRound1: undefined,
          awayRound2: undefined,
          awayRound3: undefined,
        },
        {
          homeRound1: undefined,
          homeRound2: undefined,
          homeRound3: undefined,
          awayRound1: undefined,
          awayRound2: undefined,
          awayRound3: undefined,
        },
      ],
    };
    right = {
      finish: undefined,
      judges: [
        {
          homeRound1: undefined,
          homeRound2: undefined,
          homeRound3: undefined,
          awayRound1: undefined,
          awayRound2: undefined,
          awayRound3: undefined,
        },
        {
          homeRound1: undefined,
          homeRound2: undefined,
          homeRound3: undefined,
          awayRound1: undefined,
          awayRound2: undefined,
          awayRound3: undefined,
        },
        {
          homeRound1: undefined,
          homeRound2: undefined,
          homeRound3: undefined,
          awayRound1: undefined,
          awayRound2: undefined,
          awayRound3: undefined,
        },
      ],
    };

    constructor(id) {
      this.id = id;
    }
  },

  //engagements and actions
  engage: {
    closeDistance: [
      { text: 'Grapple', value: 'grapple', range: 'inside' },
      { text: 'Strike', value: 'strike', range: 'inside' },
    ],
    stayOutside: [
      { text: 'Grapple', value: 'grapple', range: 'outside' },
      { text: 'Strike', value: 'strike', range: 'outside' },
    ],
  },

  disengage: [{ text: 'Disengage', value: 'disengage' }],

  grapple: {
    takedown: [
      { text: 'Single Leg', value: 'singleLeg' },
      { text: 'Double Leg', value: 'doubleLeg' },
      { text: 'Hip Toss', value: 'hipToss' },
      { text: 'Trip', value: 'trip' },
      { text: 'Throw', value: 'throw' },
    ],

    clinch: [
      { text: 'Dirty boxing', value: 'dirtyBoxing' },
      { text: 'Knee', value: 'knee' },
      { text: 'Elbow', value: 'elbow' },
    ],
  },

  strike: {
    combo: [
      { text: 'One Two', value: 'oneTwo' },
      { text: 'One Two Three', value: 'oneTwoThree' },
      { text: 'Various Combo', value: 'various' },
    ],
    single: [
      { text: 'Haymaker', value: 'haymaker' },
      { text: 'Precision', value: 'precision' },
      { text: 'Timing', value: 'timing' },
      { text: 'Snipe', value: 'snipe' },
    ],

    feel: [
      { text: 'Poke', value: 'poke' },
      { text: 'Counter', value: 'counter' },
    ],
    stall: [
      { text: 'Poke', value: 'poke' },
      { text: 'Counter', value: 'counter' },
    ],
    bait: [{ text: 'Counter', value: 'counter' }],
  },
};
