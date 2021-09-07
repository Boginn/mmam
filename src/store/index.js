import Vue from "vue";
import Vuex from "vuex";
import engine from "../engine/engine.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isDeveloper: true,
    day: 1,

    league: [],
    roster: [],
    commission: [],
    staff: [],

    schedule: [],

    matches: [],

    //match
    matchday: false,
    isLive: false,

    currentMatch: undefined,
    matchMessages: [],
    matchMessagesForRings: [[], [], []],

    //matchData
    timeoutInterval: 1000,
    score: { home: 0, away: 0 },
    names: { home: "", away: "" },
    minute: null,

    //id
    selectedClubId: null,

    fighterId: null,
    commissionId: null,
    staffId: null,
    clubId: null,
    matchId: null,
  },
  getters: {
    isDeveloper(state) {
      return state.isDeveloper;
    },
    //matchData

    score(state) {
      return state.score;
    },
    names(state) {
      return state.names;
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

    matchday(state) {
      return state.matchday;
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
      return state.league;
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
      state.schedule.forEach((match) => {
        match.clubs.forEach((id) => {
          if (id == state.selectedClubId) {
            match.npc = false;
          }
        });
      });
      return state.schedule;
    },
    playerClub(state) {
      return engine.returnPlayerClub(state.league, state.selectedClubId);
    },
    // squad: (state) => (id) => {
    //   return engine.returnSquad(
    //     engine.findClubById(state.league, id),
    //     state.roster
    //   );
    // },

    //archive
    matches(state) {
      return state.matches;
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

    selectedClubId(state) {
      return state.selectedClubId;
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
    //init
    selectClub(context, payload) {
      context.commit("SEL_CLUB", payload);
    },
    setLeague(context, payload) {
      context.commit("SET_LEAGUE", payload);
    },
    setRoster(context, payload) {
      context.commit("SET_ROSTER", payload);
    },
    setCommission(context, payload) {
      context.commit("SET_COMMISSION", payload);
    },
    setStaff(context, payload) {
      context.commit("SET_STAFF", payload);
    },
    setSchedule(context, payload) {
      context.commit("SET_SCHEDULE", payload);
    },
    setTactics(context, payload) {
      context.commit("SET_TACTICS", payload);
    },
    setLive(context, payload) {
      context.commit("SET_LIVE", payload);
    },

    //match
    setIsLive(context, payload) {
      context.commit("SET_IS_LIVE", payload);
    },
    addMatchMessage(context, payload) {
      context.commit("ADD_MATCH_MESSAGE", payload);
    },
    addMatchMessageToRing(context, payload) {
      console.log(payload);
      context.commit("ADD_MATCH_MESSAGE_TO_RING", payload);
    },

    addToSquad(context, payload) {
      context.commit("ADD_SQUAD", payload);
    },

    setMatchday(context, payload) {
      context.commit("SET_MATCHDAY", payload);
    },

    continue(context, payload) {
      payload;
      context.commit("PASS_DAY");
    },
    setCurrentMatch(context, payload) {
      context.commit("SET_CURRENTMATCH", payload);
    },
    setSelectedTactic(context, payload) {
      context.commit("SET_SELECTED_TACTIC", payload);
    },
    setTimeoutInterval(context, payload) {
      context.commit("SET_TIMEOUT_INTERVAL", payload);
    },

    //matchData
    setScore(context, payload) {
      context.commit("SET_SCORE", payload);
    },
    setNames(context, payload) {
      context.commit("SET_NAMES", payload);
    },

    //archive
    addMatch(context, payload) {
      context.commit("ADD_MATCH", payload);
    },

    //id
    setFighterId(context, payload) {
      context.commit("SET_FIGHTER_ID", payload);
    },
    setCommissionId(context, payload) {
      context.commit("SET_COMMISSION_ID", payload);
    },
    setStaffId(context, payload) {
      context.commit("SET_STAFF_ID", payload);
    },
    setClubId(context, payload) {
      context.commit("SET_CLUB_ID", payload);
    },
    setMatchId(context, payload) {
      context.commit("SET_MATCH_ID", payload);
    },
  },

  mutations: {
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
      state.schedule = payload;
    },
    SET_TACTICS(state, payload) {
      state.league.forEach((club) => {
        if (club.id == payload.clubId) {
          club.tactic = payload;
        }
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

    SET_MATCHDAY(state, payload) {
      state.matchday = payload;
    },

    PASS_DAY(state, payload) {
      state.day++;
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
      state.timeoutInterval = payload;
    },

    //matchData
    SET_SCORE(state, payload) {
      state.score = payload;
    },
    SET_NAMES(state, payload) {
      state.names = payload;
    },

    //archive
    ADD_MATCH(state, payload) {
      state.matches.push(payload);
    },


    //id
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
