import fighters from './roster';
import clubs from './clubs';
import commission from './judges';
import staff from './coaches';

export default {
  fighters,
  clubs,
  commission,
  staff,

  idCodes: {
    fighter: 9000,
    commission: 2000,
    staff: 6000,
    club: 1000,
    match: 41000,
  },

  positions: {},

  tabs: {
    match: [
      { name: 'overview', value: true },
      { name: 'bench', value: false },
    ],
    schedule: [
      { name: 'club', value: true },
      { name: 'league', value: false },
      { name: 'archive', value: false },
    ],
  },

  headers: {
    squad: [
      { text: 'Name', value: 'personal.name' },
      { text: 'Age', value: 'personal.age' },
      { text: 'Nationality', value: 'personal.nationality' },
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
      { sortable: false, text: 'Name', value: 'name' },
      { sortable: false, text: '', value: 'competitions.league.pointsNet' },
      { sortable: false, text: 'For', value: 'competitions.league.pointsFor' },
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
  },

  routes: {
    league: [
      {
        name: 'History',
        path: 'history',
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
        color: 'secondary',
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
        color: 'secondary',
        public: true,
      },
      {
        name: 'League',
        path: 'league',
        icon: 'mdi-folder',
        color: 'seventh',
        public: true,
      },
    ],
  },
};
