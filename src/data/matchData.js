export default {
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

  disengage: { text: 'Disengage', value: 'disengage' },

  compose: { text: 'Compose', value: 'compose' },

  hold: { text: 'Hold', value: 'hold' },

  defend: { text: 'Defend', value: 'defend' },

  submission: { text: 'Submission', value: 'submission' },

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
    // submissions: [
    //   { text: '', value: '' },
    //   { text: '', value: '' },
    // ],
  },

  strike: {
    combo: [
      { text: 'One Two', value: 'oneTwo' },
      { text: 'One Two Three', value: 'oneTwoThree' },
      { text: 'Various Combo', value: 'variousCombo' },
    ],
    single: [
      { text: 'Haymaker', value: 'haymakerStrike' },
      { text: 'Precision', value: 'precisionStrike' },
      { text: 'Timed', value: 'timedStrike' },
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
