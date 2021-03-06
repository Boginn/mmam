import fighters from './roster';
import clubs from './clubs';
import commission from './judges';
import staff from './coaches';
import ui from './ui.js';
import news from './news.js';
import countryCodes from './countryCodes.js';

export default {
  fighters,
  clubs,
  commission,
  staff,
  countryCodes,
  tabs: ui.tabs,
  headers: ui.headers,
  routes: ui.routes,
  news,

  date: '2001-09-03',
  timeoutInterval: 750,

  idCodes: {
    fighter: 9000,
    commission: 2000,
    staff: 6000,
    club: 1000,
    match: 41000,
    archivedMatch: 78000,
    news: 900000,
  },
};
