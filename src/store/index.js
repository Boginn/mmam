import Vue from 'vue';
import Vuex from 'vuex';
import engine from '../engine/engine.js';
import data from '@/data/data.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isDeveloper: false,

    //ui
    day: 1,
    displayDate: new Date(data.date),
    toggleNextUnread: false,
    lastSelectedNewsItem: null,
    isAdvancingDate: false,
    isPostMatch: false,

    //resources
    league: [],
    roster: [],
    commission: [],
    staff: [],
    news: [],
    schedule: [],
    matches: [],

    //match
    isMatchday: false,
    isLive: false,
    timeoutInterval: data.timeoutInterval,

    //matchData
    currentMatch: undefined,
    matchMessages: [],
    matchMessagesForRings: [[], [], []],

    matchData: data.matchData,

    //user
    selectedClubId: null,
    managerName: null,
    //id
    newsId: data.idCodes.news,
    fighterId: null,
    commissionId: null,
    staffId: null,
    clubId: null,
    matchId: null,

    archivedMatchId: data.idCodes.archivedMatch,
  },
  getters: {
    //ui
    toggleNextUnread(state) {
      return state.toggleNextUnread;
    },
    displayDate(state) {
      return state.displayDate;
    },

    isDeveloper(state) {
      return state.isDeveloper;
    },
    isAdvancingDate(state) {
      return state.isAdvancingDate;
    },
    isPostMatch(state) {
      return state.isPostMatch;
    },
    //matchData

    matchData(state) {
      return state.matchData;
    },

    matchMessages(state) {
      return state.matchMessages;
    },
    matchMessagesForRings(state) {
      return state.matchMessagesForRings;
    },

    currentMatch(state) {
      return state.currentMatch;
    },

    isMatchday(state) {
      return state.isMatchday;
    },

    isLive(state) {
      return state.isLive;
    },
    minute(state) {
      return state.minute;
    },
    timeoutInterval(state) {
      return state.timeoutInterval;
    },

    day(state) {
      return state.day;
    },
    league(state) {
      let sortedLeague = state.league.sort((a, b) =>
        a.competitions.league.points < b.competitions.league.points
          ? 1
          : b.competitions.league.points < a.competitions.league.points
          ? -1
          : 0
      );

      //TODO
      //if points even then go to aggregate
      //otherswise use number of finishes

      return sortedLeague;
    },
    roster(state) {
      return state.roster;
    },
    commission(state) {
      return state.commission;
    },
    staff(state) {
      return state.staff;
    },
    schedule(state) {
      return state.schedule.filter((match) => match.date >= state.day);
    },
    playerClub(state) {
      return engine.returnPlayerClub(state.league, state.selectedClubId);
    },

    //archive
    matches(state) {
      return state.matches;
    },
    news(state) {
      return state.news;
    },
    lastSelectedNewsItem(state) {
      return state.lastSelectedNewsItem;
    },

    //user
    managerName(state) {
      return state.managerName;
    },
    selectedClubId(state) {
      return state.selectedClubId;
    },

    //id
    getFighterById: (state) => (id) => {
      return engine.findFighterById(state.roster, id);
    },
    getJudgeById: (state) => (id) => {
      return engine.findJudgeById(state.commission, id);
    },
    getCoachById: (state) => (id) => {
      return engine.findCoachById(state.staff, id);
    },
    getClubById: (state) => (id) => {
      return engine.findClubById(state.league, id);
    },
    getMatchById: (state) => (id) => {
      return engine.findMatchById(state.schedule, id);
    },

    nextFighterId(state) {
      state.fighterId++;
      return state.fighterId;
    },
    nextClubId(state) {
      state.clubId++;
      return state.clubId;
    },
    nextMatchId(state) {
      state.matchId++;
      return state.matchId;
    },
  },

  actions: {
    toggleNextUnread(context, payload) {
      context.commit('TOGGLE_NEXT_UNREAD', payload);
    },
    // game
    setIsAdvancingDate(context, payload) {
      context.commit('SET_IS_ADVANCING_DATE', payload);
    },

    //init
    selectClub(context, payload) {
      context.commit('SEL_CLUB', payload);
    },
    setLeague(context, payload) {
      context.commit('SET_LEAGUE', payload);
    },
    setRoster(context, payload) {
      context.commit('SET_ROSTER', payload);
    },
    setCommission(context, payload) {
      context.commit('SET_COMMISSION', payload);
    },
    setStaff(context, payload) {
      context.commit('SET_STAFF', payload);
    },
    setSchedule(context, payload) {
      context.commit('SET_SCHEDULE', payload);
    },
    setTactics(context, payload) {
      context.commit('SET_TACTICS', payload);
    },
    setTrainingSchedules(context, payload) {
      context.commit('SET_TRAINING_SCHEDULES', payload);
    },
    setLive(context, payload) {
      context.commit('SET_LIVE', payload);
    },

    //match
    setIsLive(context, payload) {
      context.commit('SET_IS_LIVE', payload);
    },
    addMatchMessage(context, payload) {
      context.commit('ADD_MATCH_MESSAGE', payload);
    },
    addMatchMessageToRing(context, payload) {
      console.log(payload);
      context.commit('ADD_MATCH_MESSAGE_TO_RING', payload);
    },

    addToSquad(context, payload) {
      context.commit('ADD_SQUAD', payload);
    },

    setIsMatchday(context, payload) {
      context.commit('SET_IS_MATCHDAY', payload);
    },
    setIsPostMatch(context, payload) {
      context.commit('SET_IS_POST_MATCH', payload);
    },

    continue(context, payload) {
      payload;
      context.commit('PASS_DAY');
    },

    setCurrentMatch(context, payload) {
      context.commit('SET_CURRENTMATCH', payload);
    },
    setSelectedTactic(context, payload) {
      context.commit('SET_SELECTED_TACTIC', payload);
    },
    setTimeoutInterval(context, payload) {
      context.commit('SET_TIMEOUT_INTERVAL', payload);
    },

    //matchData
    setScore(context, payload) {
      context.commit('SET_SCORE', payload);
    },
    setNames(context, payload) {
      context.commit('SET_NAMES', payload);
    },

    //archive
    addMatch(context, payload) {
      context.commit('ADD_MATCH', payload);
    },
    markAsRead(context, payload) {
      context.commit('MARK_AS_READ', payload);
    },
    addClubData(context, payload) {
      context.commit('ADD_CLUB_DATA', payload);
    },
    addFighterData(context, payload) {
      context.commit('ADD_FIGHTER_DATA', payload);
    },
    addNews(context, payload) {
      context.commit('ADD_NEWS', payload);
    },
    setLastSelectedNewsItem(context, payload) {
      context.commit('SET_LAST_SELECTED_NEWS_ITEM', payload);
    },

    //id
    setManagerName(context, payload) {
      context.commit('SET_MANAGER_NAME', payload);
    },
    setFighterId(context, payload) {
      context.commit('SET_FIGHTER_ID', payload);
    },
    setCommissionId(context, payload) {
      context.commit('SET_COMMISSION_ID', payload);
    },
    setStaffId(context, payload) {
      context.commit('SET_STAFF_ID', payload);
    },
    setClubId(context, payload) {
      context.commit('SET_CLUB_ID', payload);
    },
    setMatchId(context, payload) {
      context.commit('SET_MATCH_ID', payload);
    },
  },

  mutations: {
    //ui
    TOGGLE_NEXT_UNREAD(state) {
      state.toggleNextUnread = !state.toggleNextUnread;
    },
    //game
    SET_IS_ADVANCING_DATE(state, payload) {
      state.isAdvancingDate = payload;
    },
    //init
    SEL_CLUB(state, payload) {
      state.league.forEach((club) => {
        if (club.id == payload) {
          club.npc = false;
        }
      });
      state.selectedClubId = payload;
    },
    SET_LEAGUE(state, payload) {
      state.league = payload;
    },
    SET_ROSTER(state, payload) {
      state.roster = payload;
    },
    SET_COMMISSION(state, payload) {
      state.commission = payload;
    },
    SET_STAFF(state, payload) {
      state.staff = payload;
    },
    SET_SCHEDULE(state, payload) {
      payload.forEach((match) => {
        match.clubs.forEach((id) => {
          if (id == state.selectedClubId) {
            match.npc = false;
          }
        });
      });
      state.schedule = payload;
    },
    SET_TACTICS(state, payload) {
      state.league.forEach((club) => {
        if (club.id == payload.clubId) {
          club.tactic = payload;
        }
      });
    },
    SET_TRAINING_SCHEDULES(state, payload) {
      state.league.forEach((club) => {
        club.training.schedule = payload;
      });
    },
    SET_LIVE(state, payload) {
      state.live = payload;
    },

    //match
    SET_IS_LIVE(state, payload) {
      state.isLive = payload;
    },
    ADD_MATCH_MESSAGE(state, payload) {
      // if (state.matchMessages.length > 3) {
      //   state.matchMessages.splice(0, 1);
      // }
      state.matchMessages.push(payload);
    },
    ADD_MATCH_MESSAGE_TO_RING(state, payload) {
      // if (state.matchMessages.length > 3) {
      //   state.matchMessages.splice(0, 1);
      // }
      state.matchMessagesForRings[payload.ring - 1].push(payload.msg);
      console.log(state.matchMessagesForRings);
    },

    ADD_SQUAD(state, payload) {
      state.squad.push(payload);
    },

    SET_IS_MATCHDAY(state, payload) {
      state.isMatchday = payload;
    },

    SET_IS_POST_MATCH(state, payload) {
      state.isPostMatch = payload;
    },

    PASS_DAY(state, payload) {
      state.day++;
      console.log('passing');
      state.displayDate.setDate(state.displayDate.getDate() + 1);
      payload;
    },

    SET_CURRENTMATCH(state, payload) {
      state.currentMatch = payload;
    },
    SET_SELECTED_TACTIC(state, payload) {
      state.league.forEach((club) => {
        if (club.id == payload.clubId) {
          club.tactic = payload;
        }
      });
    },
    SET_TIMEOUT_INTERVAL(state, payload) {
      console.log(payload);
      state.timeoutInterval = payload;
    },

    //matchData
    SET_SCORE(state, payload) {
      state.matchData.score = payload;
    },
    SET_NAMES(state, payload) {
      state.matchData.names = payload;
    },

    //archive
    ADD_NEWS(state, payload) {
      state.newsId++;
      payload = { ...payload, id: state.newsId };
      if (!state.news.length) {
        payload = { ...payload, read: true };
      }
      state.news.push(payload);
    },
    SET_LAST_SELECTED_NEWS_ITEM(state, payload) {
      state.lastSelectedNewsItem = payload;
    },
    MARK_AS_READ(state, payload) {
      state.news.forEach((element) => {
        if (element.id == payload.id) {
          element.read = true;
        }
      });
    },
    ADD_MATCH(state, payload) {
      console.log('added match');
      console.log(payload);

      state.archivedMatchId = state.archivedMatchId + 1;
      const id = state.archivedMatchId;
      payload = { ...payload, id: id };
      state.matches.push(payload);
    },
    ADD_FIGHTER_DATA(state, payload) {
      state.roster.forEach((element) => {
        payload.forEach((fighter) => {
          if (element.id == fighter.id) {
            element.condition = fighter.condition;
            element.appearances.overall.league += fighter.league;
            element.appearances.overall.cup += fighter.cup;
            element.appearances.overall.international += fighter.international;
            element.appearances.overall.finishes += fighter.finishes;
            element.appearances.season.league += fighter.league;
            element.appearances.season.cup += fighter.cup;
            element.appearances.season.international += fighter.international;
            element.appearances.season.finishes += fighter.finishes;
          }
        });
      });
    },
    ADD_CLUB_DATA(state, payload) {
      const { id, competitions } = payload;
      const { league } = competitions;
      const getClub = state.league.filter((club) => club.id == id);
      const club = getClub[0];

      // Array.prototype.unfilter = function(cb) {
      //   return this.filter(function(a, b, c) {
      //     return !cb(a, b, c);
      //   });
      // };

      //remove the club from the league before addign it again
      state.league = state.league.filter((club) => club.id != id);

      let matches = club.competitions.league.matches + 1;
      const points = club.competitions.league.points + league.points;
      const pointsAgainst =
        club.competitions.league.pointsAgainst + league.pointsAgainst;
      let form = club.competitions.league.form;
      form.push(league.form);
      const finishes = club.competitions.league.finishes + league.finishes;

      console.log(points);
      console.log(pointsAgainst);
      console.log(form);
      console.log(finishes);

      const result = {
        ...club,
        competitions: {
          league: {
            matches,
            points,
            pointsAgainst,
            form,
            finishes,
          },
        },
      };
      console.log(result);

      state.league.push(result);
    },

    //id
    SET_MANAGER_NAME(state, payload) {
      state.managerName = payload;
    },
    SET_FIGHTER_ID(state, payload) {
      state.fighterId = payload;
    },
    SET_COMMISSION_ID(state, payload) {
      state.commissionId = payload;
    },
    SET_STAFF_ID(state, payload) {
      state.staffId = payload;
    },
    SET_CLUB_ID(state, payload) {
      state.clubId = payload;
    },
    SET_MATCH_ID(state, payload) {
      state.matchId = payload;
    },
  },

  modules: {},

  // methods: {
  //   findPlayerClub(array) {

  //     var playerClub;
  //     array.forEach((club) => {
  //       if (club.npc == false) {
  //         playerClub = club;
  //       }
  //     });

  //     return playerClub;
  //   },
  // },
});
