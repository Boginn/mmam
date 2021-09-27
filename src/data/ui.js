const tabs = {
  match: [
    { name: 'overview', value: true },
    { name: 'bench', value: false },
    { name: 'tactics', value: false },
  ],
  schedule: [
    { name: 'club', value: true },
    { name: 'league', value: false },
    { name: 'archive', value: false },
  ],
  tactics: [
    { name: 'general', value: true },
    { name: 'left', value: false },
    { name: 'center', value: false },
    { name: 'right', value: false },
  ],
  matchTactics: [
    { name: 'general', value: false },
    { name: 'individual', value: true },
  ],
};

const headers = {
  squad: [
    { text: 'Name', value: 'personal.name' },
    { text: '', value: 'fieldable' },
    { text: 'Age', value: 'personal.age' },
    { text: 'Nationality', value: 'personal.nationality' },
    { text: 'Height', value: 'personal.height' },
    { text: 'Type', value: 'type', sortable: false },
    { text: 'Appearances', value: 'appearances.season.league' },
    { text: 'Finishes', value: 'appearances.season.finishes' },
    { text: 'Condition', value: 'condition' },
    { text: 'Fitness', value: 'fitness' },
  ],
  tactics: [
    { text: 'Name', value: 'personal.name' },
    {
      text: 'Selection',
      value: 'selection',
      width: '30%',
      align: 'center',
      sortable: false,
    },
  ],
  league: [
    { sortable: false, text: '', value: 'name' },
    { sortable: false, text: 'For', value: 'competitions.league.points' },
    {
      sortable: false,
      text: 'Against',
      value: 'competitions.league.pointsAgainst',
    },
    {
      sortable: false,
      text: 'Matches',
      value: 'competitions.league.matches',
    },
    { sortable: false, text: 'Form', value: 'competitions.league.form' },
    {
      sortable: false,
      text: 'Finishes',
      value: 'competitions.league.finishes',
    },
  ],
  schedule: [
    { text: 'Home', value: 'clubs[0]' },
    { text: 'Away', value: 'clubs[1]' },

    { text: 'Date', value: 'date' },
  ],
  staff: [
    { text: 'Name', value: 'personal.name' },
    { text: 'Striking', value: 'coaching.striking' },
    { text: 'Grappling', value: 'coaching.grappling' },
    { text: 'Throwing', value: 'coaching.throwing' },
    { text: 'Judging Ability', value: 'coaching.judgingAbility' },
    { text: 'Judging Potential', value: 'coaching.judgingPotential' },
    { text: 'Motivating', value: 'coaching.motivating' },
    { text: 'Managing', value: 'coaching.managing' },
    { text: 'Youngsters', value: 'coaching.youngsters' },
    { text: 'Discipline', value: 'coaching.discipline' },
  ],
};

const routes = {
  league: [
    {
      name: 'History',
      path: 'history',
      icon: 'mdi-file-multiple',
      color: 'primary',
      public: true,
    },
    {
      name: 'Fixtures',
      path: 'fixtures',
      icon: 'mdi-file-multiple',
      color: 'primary',
      public: true,
    },
  ],

  squad: [
    {
      name: 'Tactics',
      path: 'tactics',
      icon: 'mdi-file-multiple',
      color: 'primary',
      public: true,
    },
    {
      name: 'League',
      path: 'league',
      icon: 'mdi-file-multiple',
      color: 'primary',
      public: true,
    },
  ],

  home: [
    {
      name: 'Staff',
      path: 'staff',
      icon: 'mdi-file-multiple',
      color: 'primary',
      public: true,
    },
    {
      name: 'Squad',
      path: 'squad',
      icon: 'mdi-account-cowboy-hat',
      color: 'primary',
      public: true,
    },

    {
      name: 'Training',
      path: 'training',
      icon: 'mdi-file-document-edit',
      color: 'primary',
      public: true,
    },

    {
      name: 'News',
      path: 'news',
      icon: 'mdi-file-upload',
      color: 'secondary',
      public: true,
    },
    {
      name: 'Schedule',
      path: 'schedule',
      icon: 'mdi-folder-table',
      color: 'seventh',
      public: true,
    },
  ],

  appbar: [
    {
      name: 'News',
      path: 'news',
      icon: 'mdi-file-upload',
      color: 'secondary',
      public: true,
    },
    {
      name: 'Squad',
      path: 'squad',
      icon: 'mdi-account-cowboy-hat',
      color: 'primary',
      public: true,
    },
    {
      name: 'Schedule',
      path: 'schedule',
      icon: 'mdi-folder-table',
      color: 'seventh',
      public: true,
    },
    // {
    //   name: 'League',
    //   path: 'league',
    //   icon: 'mdi-folder',
    //   color: 'seventh',
    //   public: true,
    // },
  ],

  staff: [
    {
      name: 'Squad',
      path: 'squad',
      icon: 'mdi-account-cowboy-hat',
      color: 'primary',
      public: true,
    },

    {
      name: 'Training',
      path: 'training',
      icon: 'mdi-file-document-edit',
      color: 'primary',
      public: true,
    },
  ],
};

export default {
  tabs,
  headers,
  routes,
};
