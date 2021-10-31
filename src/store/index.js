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
    control: {
      startRound: false,
      getOn: false,
      endMatch: false,
      togglePause: false,
    },

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

    matchData: {
      score: { home: 0, away: 0 },
      names: { home: '', away: '' },
      colors: { primary: '', secondary: '' },
      //bools
      isCommentary: true,
      isFullTime: false,
      isBetweenRounds: true,
      isHomeAttack: true,
      isDisabled: false,
      isPaused: false,
      isDecision: false,
      isBusy: false,
      isScored: false,

      //x, y minute rounds
      rounds: [1, 2, 3],
      minutes: 5,
      //current round, minute, second
      minute: 0,
      second: 0,
      round: 0,

      happenChance: 11,

      //ui
      tabs: data.tabs.match,

      //match data
      homeTactic: {},
      awayTactic: {},
      homeSubs: [],
      awaySubs: [],

      // score: {
      //   home: 0,
      //   away: 0,
      // },

      // substitutionMade: false,
      pendingSub: false,
      ringActivity: [
        {
          home: 0,
          away: 0,
          homeSignificant: 0,
          awaySignificant: 0,
        },
        {
          home: 0,
          away: 0,
          homeSignificant: 0,
          awaySignificant: 0,
        },
        {
          home: 0,
          away: 0,
          homeSignificant: 0,
          awaySignificant: 0,
        },
      ],

      ringFinishedLeft: false,
      ringFinishedCenter: false,
      ringFinishedRight: false,

      ringDecisions: {
        ringDecisionLeft: undefined,
        ringDecisionCenter: undefined,
        ringDecisionRight: undefined,
      },

      ringJudges: {
        ringJudgesLeft: [],
        ringJudgesCenter: [],
        ringJudgesRight: [],
      },
      ringTruePoints: {
        ringTruePointsLeft: [],
        ringTruePointsCenter: [],
        ringTruePointsRight: [],
      },

      cards: {},
      finishes: { home: 0, away: 0 },
    },

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
    control(state) {
      return state.control;
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
    //ui
    toggleNextUnread(context, payload) {
      context.commit('TOGGLE_NEXT_UNREAD', payload);
    },

    toggleControlStartRound(context) {
      context.commit('TOGGLE_CONTROL_START_ROUND');
    },
    toggleControlGetOn(context) {
      context.commit('TOGGLE_CONTROL_GET_ON');
    },
    toggleControlEndMatch(context) {
      context.commit('TOGGLE_CONTROL_END_MATCH');
    },
    toggleControlTogglePause(context) {
      context.commit('TOGGLE_CONTROL_TOGGLE_PAUSE');
    },

    // game
    setIsAdvancingDate(context, payload) {
      context.commit('SET_IS_ADVANCING_DATE', payload);
    },

    //init
    selectClub(context, payload) {
      context.commit('SEL_CLUB', payload);
    },
    seedLeague(context, payload) {
      context.commit('SEED_LEAGUE', payload);
    },
    seedRoster(context, payload) {
      context.commit('SEED_ROSTER', payload);
    },
    seedCommission(context, payload) {
      context.commit('SEED_COMMISSION', payload);
    },
    seedStaff(context, payload) {
      context.commit('SEED_STAFF', payload);
    },
    seedSchedule(context, payload) {
      context.commit('SEED_SCHEDULE', payload);
    },
    seedTactics(context, payload) {
      context.commit('SEED_TACTICS', payload);
    },
    seedTrainingSchedules(context, payload) {
      context.commit('SEED_TRAINING_SCHEDULES', payload);
    },
    // setLive(context, payload) {
    //   context.commit('SET_LIVE', payload);
    // },

    //match
    setIsLive(context, payload) {
      context.commit('SET_IS_LIVE', payload);
    },
    setMatchMessages(context, payload) {
      context.commit('SET_MATCH_MESSAGES', payload);
    },
    setMatchMessagesForRings(context, payload) {
      context.commit('SET_MATCH_MESSAGES_FOR_RINGS', payload);
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
    setColors(context, payload) {
      context.commit('SET_COLORS', payload);
    },

    //bools
    setIsCommentary(context) {
      context.commit('SET_IS_COMMENTARY');
    },
    setIsFullTime(context, payload) {
      context.commit('SET_IS_FULL_TIME', payload);
    },
    setIsBetweenRounds(context, payload) {
      context.commit('SET_IS_BETWEEN_ROUNDS', payload);
    },
    setIsHomeAttack(context, payload) {
      context.commit('SET_IS_HOME_ATTACK', payload);
    },
    setIsDisabled(context, payload) {
      context.commit('SET_IS_DISABLED', payload);
    },
    setIsPaused(context, payload) {
      context.commit('SET_IS_PAUSED', payload);
    },
    setIsDecision(context, payload) {
      context.commit('SET_IS_DECISION', payload);
    },
    setIsBusy(context, payload) {
      context.commit('SET_IS_BUSY', payload);
    },
    setIsScored(context, payload) {
      context.commit('SET_IS_SCORED', payload);
    },

    // rounds, minutes
    setRounds(context, payload) {
      context.commit('SET_ROUNDS', payload);
    },
    setMinutes(context, payload) {
      context.commit('SET_MINUTES', payload);
    },
    // current round, minute, second
    setRound(context, payload) {
      context.commit('SET_ROUND', payload);
    },
    setMinute(context, payload) {
      context.commit('SET_MINUTE', payload);
    },
    setSecond(context, payload) {
      context.commit('SET_SECOND', payload);
    },

    setHappenChance(context, payload) {
      context.commit('SET_HAPPEN_CHANCE', payload);
    },

    setTactics(context, payload) {
      context.commit('SET_TACTICS', payload);
    },
    setHomeTactic(context, payload) {
      context.commit('SET_HOME_TACTIC', payload);
    },
    setAwayTactic(context, payload) {
      context.commit('SET_AWAY_TACTIC', payload);
    },

    setHomeSubs(context, payload) {
      context.commit('SET_HOME_SUBS', payload);
    },
    setAwaySubs(context, payload) {
      context.commit('SET_AWAY_SUBS', payload);
    },
    addHomeSub(context, payload) {
      context.commit('ADD_HOME_SUB', payload);
    },
    removeHomeSub(context) {
      context.commit('REMOVE_HOME_SUB');
    },
    addAwaySub(context, payload) {
      context.commit('ADD_AWAY_SUB', payload);
    },
    removeAwaySub(context) {
      context.commit('REMOVE_AWAY_SUB');
    },

    // setSubstitutionMade(context, payload) {
    //   context.commit('SET_SUBSTITUTION_MADE', payload);
    // },
    setPendingSub(context, payload) {
      context.commit('SET_PENDING_SUB', payload);
    },
    setRingActivity(context, payload) {
      context.commit('SET_RING_ACTIVITY', payload);
    },
    setRingFinishedLeft(context, payload) {
      context.commit('SET_RING_FINISHED_LEFT', payload);
    },
    setRingFinishedCenter(context, payload) {
      context.commit('SET_RING_FINISHED_CENTER', payload);
    },
    setRingFinishedRight(context, payload) {
      context.commit('SET_RING_FINISHED_RIGHT', payload);
    },
    setRingDecisions(context, payload) {
      context.commit('SET_RING_DECISIONS', payload);
    },
    setRingJudges(context, payload) {
      context.commit('SET_RING_JUDGES', payload);
    },
    setRingTruePoints(context, payload) {
      context.commit('SET_RING_TRUE_POINTS', payload);
    },

    setCards(context, payload) {
      context.commit('SET_CARDS', payload);
    },
    setFinishes(context, payload) {
      context.commit('SET_FINISHES', payload);
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
    addFighterForm(context, payload) {
      context.commit('ADD_FIGHTER_FORM', payload);
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
    TOGGLE_CONTROL_START_ROUND(state) {
      state.control.startRound = !state.control.startRound;
    },
    TOGGLE_CONTROL_GET_ON(state) {
      state.control.getOn = !state.control.getOn;
    },
    TOGGLE_CONTROL_END_MATCH(state) {
      state.control.endMatch = !state.control.endMatch;
    },
    TOGGLE_CONTROL_TOGGLE_PAUSE(state) {
      state.control.togglePause = !state.control.togglePause;
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
    SEED_LEAGUE(state, payload) {
      state.league = payload;
    },
    SEED_ROSTER(state, payload) {
      state.roster = payload;
    },
    SEED_COMMISSION(state, payload) {
      state.commission = payload;
    },
    SEED_STAFF(state, payload) {
      console.log(payload);
      state.staff = payload;
    },
    SEED_SCHEDULE(state, payload) {
      payload.forEach((match) => {
        match.clubs.forEach((id) => {
          if (id == state.selectedClubId) {
            match.npc = false;
          }
        });
      });
      state.schedule = payload;
    },
    SEED_TACTICS(state, payload) {
      state.league.forEach((club) => {
        if (club.id == payload.clubId) {
          club.tactic = payload;
        }
      });
    },
    SEED_TRAINING_SCHEDULES(state, payload) {
      state.league.forEach((club) => {
        club.training.schedule = payload;
      });
    },
    // SET_LIVE(state, payload) {
    //   state.live = payload;
    // },

    //match
    SET_IS_LIVE(state, payload) {
      state.isLive = payload;
    },
    SET_MATCH_MESSAGES(state, payload) {
      state.matchMessages = payload;
    },
    SET_MATCH_MESSAGES_FOR_RINGS(state, payload) {
      state.matchMessagesForRings = payload;
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
      console.log(payload.home + 'home');
      console.log(payload.away + 'away');
      let { home, away } = payload;
      if (home > 3) {
        home = 3;
      }
      if (away > 3) {
        away = 3;
      }

      state.matchData.score = { home: home, away: away };
    },
    SET_NAMES(state, payload) {
      state.matchData.names = payload;
    },
    SET_COLORS(state, payload) {
      state.matchData.colors = payload;
    },

    SET_IS_COMMENTARY(state) {
      state.matchData.isCommentary = !state.matchData.isCommentary;
    },
    SET_IS_FULL_TIME(state, payload) {
      state.matchData.isFullTime = payload;
    },
    SET_IS_BETWEEN_ROUNDS(state, payload) {
      state.matchData.isBetweenRounds = payload;
    },
    SET_IS_HOME_ATTACK(state, payload) {
      state.matchData.isHomeAttack = payload;
    },
    SET_IS_DISABLED(state, payload) {
      state.matchData.isDisabled = payload;
    },
    SET_IS_PAUSED(state, payload) {
      state.matchData.isPaused = payload;
    },
    SET_IS_DECISION(state, payload) {
      state.matchData.isDecision = payload;
    },
    SET_IS_BUSY(state, payload) {
      state.matchData.isBusy = payload;
    },
    SET_IS_SCORED(state, payload) {
      state.matchData.isScored = payload;
    },

    // rounds, minutes
    SET_ROUNDS(state, payload) {
      state.matchData.rounds = payload;
    },
    SET_MINUTES(state, payload) {
      state.matchData.minutes = payload;
    },
    // current round, minute, second
    SET_ROUND(state, payload) {
      state.matchData.round = payload;
    },
    SET_MINUTE(state, payload) {
      state.matchData.minute = payload;
    },
    SET_SECOND(state, payload) {
      state.matchData.second = payload;
    },

    SET_HAPPEN_CHANCE(state, payload) {
      state.matchData.happenChance = payload;
    },

    SET_TACTICS(state, payload) {
      state.matchData.homeTactic = payload.home;
      state.matchData.awayTactic = payload.away;
    },

    SET_HOME_TACTIC(state, payload) {
      state.matchData.homeTactic = payload;
    },
    SET_AWAY_TACTIC(state, payload) {
      state.matchData.awayTactic = payload;
    },

    SET_HOME_SUBS(state, payload) {
      state.matchData.homeSubs = payload;
    },
    SET_AWAY_SUBS(state, payload) {
      state.matchData.awaySubs = payload;
    },
    ADD_HOME_SUB(state, payload) {
      state.matchData.homeSubs.push(payload);
    },
    REMOVE_HOME_SUB(state) {
      state.matchData.homeSubs.splice(0, 1);
    },
    ADD_AWAY_SUB(state, payload) {
      state.matchData.awaySubs.push(payload);
    },
    REMOVE_AWAY_SUB(state) {
      state.matchData.awaySubs.splice(0, 1);
    },

    // SET_SUBSTITUTION_MADE(state, payload) {
    //   state.matchData.substitutionMade = payload;
    // },
    SET_PENDING_SUB(state, payload) {
      state.matchData.pendingSub = payload;
    },
    SET_RING_ACTIVITY(state, payload) {
      state.matchData.ringActivity = payload;
    },
    SET_RING_FINISHED_LEFT(state, payload) {
      state.matchData.ringFinishedLeft = payload;
    },
    SET_RING_FINISHED_CENTER(state, payload) {
      state.matchData.ringFinishedCenter = payload;
    },
    SET_RING_FINISHED_RIGHT(state, payload) {
      state.matchData.ringFinishedRight = payload;
    },
    SET_RING_DECISIONS(state, payload) {
      state.matchData.ringDecisions = payload;
    },
    SET_RING_JUDGES(state, payload) {
      console.log(payload);
      state.matchData.ringJudges = payload;
    },
    SET_RING_TRUE_POINTS(state, payload) {
      console.log(payload);
      state.matchData.ringTruePoints = payload;
    },

    SET_CARDS(state, payload) {
      state.matchData.cards = payload;
    },
    SET_FINISHES(state, payload) {
      state.matchData.finishes = payload;
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

      state.archivedMatchId += 1;
      const id = state.archivedMatchId;
      payload = { ...payload, id: id };
      state.matches.push(payload);
    },
    ADD_FIGHTER_FORM(state, payload) {
      state.roster.forEach((element) => {
        if (element.id == payload.id) {
          element.form.push(payload.item);
        }
      });
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
