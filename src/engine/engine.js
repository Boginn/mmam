import classes from '../data/classes.js';
import data from '../data/data.js';
import matchEngine from './matchEngine.js';

export default {
  returnPlayerClub: (league, selectedClubId) => {
    var playerClub;
    league.forEach((club) => {
      if (club.id == selectedClubId) {
        playerClub = club;
      }
    });
    return playerClub;
  }, // not used i think

  //formatting

  firstName(fighter) {
    return fighter.personal.name.split(' ')[0];
  },
  lastName(fighter) {
    return fighter.personal.name.split(' ')[1];
  },
  arrangeDate(dateArray) {
    return `${dateArray[0]} ${dateArray[2]} ${dateArray[1]} ${dateArray[3]}`;
  },

  countryCode(country) {
    const c = data.countryCodes.filter(
      (element) => element.country == country
    )[0];
    return `https://flagcdn.com/16x12/${c.code}.png`;
  },
  typeOfFighter(fighter) {
    const { type } = fighter;

    let result;
    if (Math.abs(type.grappler - type.striker) > 30) {
      if (type.grappler > type.striker) {
        result = 'Grappler';
      } else if (type.grappler < type.striker) {
        result = 'Striker';
      }
    } else {
      result = 'Grappler/Striker';
    }
    return result;
  },

  //news
  formatNewsManager(item, manager) {
    item = item.split('$M').join(manager);
    return item;
  },
  formatNewsClub(item, club) {
    item = item.split('$C').join(club);
    return item;
  },
  formatNewsDate(item, date) {
    item = item.split('$D').join(date);
    return item;
  },
  formatNewsFinishes(item, finishes) {
    item = item.split('$F').join(finishes);
    return item;
  },
  formatNewsPoints(item, points) {
    item = item.split('$P').join(points);
    return item;
  },
  formatNewsScore(item, score) {
    item = item.split('$S').join(score);
    return item;
  },

  //date
  dateByDay(day) {
    let res = new Date(data.date);
    res.setDate(res.getDate() + day - 1);
    return res;
  },

  //ui
  newMessages(array) {
    return array.filter((item) => !item.read).length;
  },

  //game
  recoverFighters(roster) {
    const newRoster = [];
    for (let i = 0; i < roster.length; i++) {
      const element = roster[i];

      const bonus = matchEngine.getRollWithMod(element.fitness / 5) / 2;

      if (element.condition == 0 && element.fitness == 0) {
        element.condition = element.condition + 10 + bonus;
        element.fitness = element.fitness + 10 + bonus;
      } else if (element.condition < 100 && element.fitness > 0) {
        element.condition = element.condition + 10 + bonus;
        element.fitness = element.fitness - 5;
      } else {
        element.fitness = element.fitness + 10 + bonus;
      }

      if (element.condition > 100) {
        element.condition = 100;
      } else if (element.condition < 0) {
        element.condition = 0;
      }
      if (element.fitness > 100) {
        element.fitness = 100;
      } else if (element.fitness < 0) {
        element.fitness = 0;
      }
      newRoster.push(element);
    }
    return newRoster;
  },

  //seeds
  initialize: (idCodeFighter, idCodeClub, idCodeStaff) => {
    var FIGHTER_ID = idCodeFighter;
    data.fighters.roster.forEach((element) => {
      FIGHTER_ID++;
      element.id = FIGHTER_ID;
    });

    var CLUB_ID = idCodeClub;
    data.clubs.england.forEach((element) => {
      CLUB_ID++;
      element.id = CLUB_ID;
    });

    var STAFF_ID = idCodeStaff;
    data.staff.coaches.forEach((element) => {
      STAFF_ID++;
      element.id = STAFF_ID;
    });
  },

  checkContract: (clubs, roster) => {
    let arr = [];

    clubs.forEach((team) => {
      team.squad.forEach((fighter) => {
        arr.push(fighter);
      });
    });
    arr.forEach((item) => {
      roster.forEach((fighter) => {
        if (fighter.id == item) {
          fighter.contract = true;
        }
      });
    });
  },

  seedStaffToClubs: (clubs, staff) => {
    clubs.forEach((team) => {
      let counter = Math.floor(staff.length / clubs.length);
      console.log(counter);

      for (let i = 0; i < counter; i++) {
        if (staff[i].contract) {
          counter = counter + 1;
        } else {
          team.staff.push(staff[i].id);
          staff[i].contract = true;
        }
      }
    });
    console.log('engine.seedStaffToClubs');
    console.log(staff);
  },

  seedSchedule: (league, idCodeMatch) => {
    let schedule = [];
    let date = 0;
    // week 1
    date += 6;
    schedule.push(new classes.Match([league[0].id, league[5].id], date));
    schedule.push(new classes.Match([league[1].id, league[6].id], date));
    schedule.push(new classes.Match([league[7].id, league[8].id], date));
    date += 1;
    schedule.push(new classes.Match([league[2].id, league[9].id], date));
    schedule.push(new classes.Match([league[3].id, league[4].id], date));
    // week 2
    date += 6;
    schedule.push(new classes.Match([league[6].id, league[0].id], date));
    schedule.push(new classes.Match([league[1].id, league[7].id], date));
    date += 1;
    schedule.push(new classes.Match([league[2].id, league[3].id], date));
    schedule.push(new classes.Match([league[4].id, league[5].id], date));
    schedule.push(new classes.Match([league[8].id, league[9].id], date));
    // week 3
    date += 6;
    schedule.push(new classes.Match([league[1].id, league[8].id], date));
    schedule.push(new classes.Match([league[2].id, league[4].id], date));
    date += 1;
    schedule.push(new classes.Match([league[0].id, league[7].id], date));
    schedule.push(new classes.Match([league[3].id, league[6].id], date));
    schedule.push(new classes.Match([league[5].id, league[9].id], date));
    // week 4
    date += 6;
    schedule.push(new classes.Match([league[8].id, league[0].id], date));

    schedule.push(new classes.Match([league[1].id, league[9].id], date));
    date += 1;
    schedule.push(new classes.Match([league[2].id, league[5].id], date));
    schedule.push(new classes.Match([league[3].id, league[7].id], date));
    schedule.push(new classes.Match([league[4].id, league[6].id], date));
    // week 5
    date += 6;
    schedule.push(new classes.Match([league[0].id, league[9].id], date));
    schedule.push(new classes.Match([league[1].id, league[2].id], date));
    date += 1;
    schedule.push(new classes.Match([league[3].id, league[8].id], date));
    schedule.push(new classes.Match([league[5].id, league[7].id], date));
    // week 6
    date += 6;
    schedule.push(new classes.Match([league[7].id, league[9].id], date));
    date += 1;
    schedule.push(new classes.Match([league[6].id, league[8].id], date));
    schedule.push(new classes.Match([league[2].id, league[0].id], date));

    // week 7
    date += 6;
    schedule.push(new classes.Match([league[4].id, league[8].id], date));
    schedule.push(new classes.Match([league[3].id, league[9].id], date));
    date += 1;
    schedule.push(new classes.Match([league[2].id, league[7].id], date));
    schedule.push(new classes.Match([league[0].id, league[1].id], date));
    schedule.push(new classes.Match([league[5].id, league[6].id], date));
    // week 8
    date += 6;
    schedule.push(new classes.Match([league[1].id, league[4].id], date));
    schedule.push(new classes.Match([league[2].id, league[8].id], date));
    date += 1;
    schedule.push(new classes.Match([league[3].id, league[5].id], date));
    schedule.push(new classes.Match([league[6].id, league[7].id], date));
    // week 9
    date += 6;
    schedule.push(new classes.Match([league[3].id, league[0].id], date));
    schedule.push(new classes.Match([league[1].id, league[5].id], date));
    date += 1;
    schedule.push(new classes.Match([league[4].id, league[9].id], date));
    schedule.push(new classes.Match([league[2].id, league[6].id], date));
    // week 10
    date += 6;
    schedule.push(new classes.Match([league[0].id, league[4].id], date));
    schedule.push(new classes.Match([league[1].id, league[3].id], date));
    date += 1;
    schedule.push(new classes.Match([league[4].id, league[7].id], date));
    schedule.push(new classes.Match([league[5].id, league[8].id], date));
    schedule.push(new classes.Match([league[6].id, league[9].id], date));
    // MIDSEASON
    // week 11
    date += 6;
    schedule.push(new classes.Match([league[5].id, league[0].id], date));
    schedule.push(new classes.Match([league[8].id, league[6].id], date));
    date += 1;
    schedule.push(new classes.Match([league[9].id, league[7].id], date));
    schedule.push(new classes.Match([league[4].id, league[3].id], date));
    // week 12
    date += 6;
    schedule.push(new classes.Match([league[0].id, league[6].id], date));
    schedule.push(new classes.Match([league[7].id, league[1].id], date));
    date += 1;
    schedule.push(new classes.Match([league[3].id, league[2].id], date));
    schedule.push(new classes.Match([league[5].id, league[4].id], date));
    schedule.push(new classes.Match([league[9].id, league[8].id], date));
    // week 13
    date += 6;
    schedule.push(new classes.Match([league[7].id, league[0].id], date));
    schedule.push(new classes.Match([league[8].id, league[1].id], date));
    date += 1;
    schedule.push(new classes.Match([league[4].id, league[2].id], date));
    schedule.push(new classes.Match([league[6].id, league[3].id], date));
    schedule.push(new classes.Match([league[9].id, league[5].id], date));
    // week 14
    date += 6;
    schedule.push(new classes.Match([league[0].id, league[8].id], date));
    schedule.push(new classes.Match([league[9].id, league[1].id], date));
    date += 1;
    schedule.push(new classes.Match([league[5].id, league[2].id], date));
    schedule.push(new classes.Match([league[7].id, league[3].id], date));
    schedule.push(new classes.Match([league[6].id, league[4].id], date));
    // week 15
    date += 6;
    schedule.push(new classes.Match([league[9].id, league[0].id], date));
    schedule.push(new classes.Match([league[2].id, league[1].id], date));
    date += 1;
    schedule.push(new classes.Match([league[8].id, league[3].id], date));
    schedule.push(new classes.Match([league[7].id, league[5].id], date));
    // week 16
    date += 6;
    schedule.push(new classes.Match([league[6].id, league[1].id], date));
    schedule.push(new classes.Match([league[0].id, league[2].id], date));
    date += 1;
    schedule.push(new classes.Match([league[8].id, league[2].id], date));
    // week 17
    date += 6;
    schedule.push(new classes.Match([league[1].id, league[0].id], date));
    schedule.push(new classes.Match([league[7].id, league[2].id], date));
    date += 1;
    schedule.push(new classes.Match([league[9].id, league[3].id], date));
    schedule.push(new classes.Match([league[8].id, league[4].id], date));
    schedule.push(new classes.Match([league[6].id, league[5].id], date));
    // week 18
    date += 6;
    schedule.push(new classes.Match([league[4].id, league[1].id], date));
    schedule.push(new classes.Match([league[9].id, league[2].id], date));
    date += 1;
    schedule.push(new classes.Match([league[5].id, league[3].id], date));
    schedule.push(new classes.Match([league[7].id, league[6].id], date));
    // week 19
    date += 6;
    schedule.push(new classes.Match([league[0].id, league[3].id], date));
    schedule.push(new classes.Match([league[5].id, league[1].id], date));
    date += 1;
    schedule.push(new classes.Match([league[6].id, league[2].id], date));
    schedule.push(new classes.Match([league[9].id, league[4].id], date));
    schedule.push(new classes.Match([league[8].id, league[7].id], date));
    // week 20
    date += 6;
    schedule.push(new classes.Match([league[4].id, league[0].id], date));
    schedule.push(new classes.Match([league[3].id, league[1].id], date));
    date += 1;
    schedule.push(new classes.Match([league[7].id, league[4].id], date));
    schedule.push(new classes.Match([league[8].id, league[5].id], date));
    schedule.push(new classes.Match([league[9].id, league[6].id], date));

    let MATCH_ID = idCodeMatch;
    schedule.forEach((element) => {
      MATCH_ID++;
      element.id = MATCH_ID;
    });

    return schedule;
  },

  oldSeedSchedule: (league) => {
    // To get proper schedling it only works with 4 teams using a // fix below
    // It's still deeply flawed though, some teams get more away and less home games

    var schedule = [];

    //  league.forEach((homeClub) => {
    //    var date = 3;
    //    league.forEach((awayClub) => {

    //      if (homeClub.id != awayClub.id) {
    //        schedule.push(new classes.Match([homeClub.id, awayClub.id], date));
    //        date = date + 3;

    //      }
    //    });
    //  });

    //first half-season
    league.forEach((homeClub) => {
      var date = 3;
      // console.log(homeClub);

      league.forEach((awayClub) => {
        var okay = true;

        if (homeClub.id != awayClub.id) {
          for (let i = 0; i < schedule.length; i++) {
            const element = schedule[i];
            if (
              awayClub.id == element.clubs[0] &&
              homeClub.id == element.clubs[1]
            ) {
              okay = false;
            }
          }
          if (okay) {
            date = date + 3;
            schedule.push(new classes.Match([homeClub.id, awayClub.id], date));
          }
        }
      });
    });

    // fix
    var matches = league.length * (league.length - 1);
    // console.log(schedule);
    schedule[3].date += matches / 2;

    //second half-season
    league.forEach((homeClub) => {
      var date = matches + 6;
      // console.log(homeClub);

      league.forEach((awayClub) => {
        var okay = true;

        if (homeClub.id != awayClub.id) {
          for (let i = 0; i < schedule.length; i++) {
            const element = schedule[i];
            if (
              awayClub.id == element.clubs[0] &&
              homeClub.id == element.clubs[1]
            ) {
              okay = false;
            }
          }
          if (okay) {
            date = date + 3;
            schedule.push(new classes.Match([homeClub.id, awayClub.id], date));
          }
        }
      });
    });
    // fix
    schedule[3 + matches / 2].date += matches / 2;

    console.log(league);

    console.log('engine.seedSchedule');
    console.log(schedule);
  },

  //indeces
  findPlayerClub: (array) => {
    var playerClub;
    array.forEach((club) => {
      if (club.npc == false) {
        playerClub = club;
      }
    });
    console.log(playerClub);
    return playerClub;
  },

  //these are all the same, consider getting rid of
  //!id part and not returning an empty object
  //findPerson getPerson
  findFighterById: (roster, id) => {
    var fighter;
    if (!id) {
      fighter = {};
    }
    roster.forEach((element) => {
      if (element.id == id) {
        fighter = element;
      }
    });

    return fighter;
  },
  findCoachById: (staff, id) => {
    var coach;
    if (!id) {
      coach = {};
    }
    staff.forEach((element) => {
      if (element.id == id) {
        coach = element;
      }
    });

    return coach;
  },
  findJudgeById: (commission, id) => {
    var judge;
    if (!id) {
      judge = {};
    }
    commission.forEach((element) => {
      if (element.id == id) {
        judge = element;
      }
    });

    return judge;
  },
  findClubById: (league, id) => {
    var club;
    league.forEach((element) => {
      if (element.id == id) {
        club = element;
      }
    });
    return club;
  },
  findMatchById: (schedule, id) => {
    var match;
    schedule.forEach((element) => {
      if (element.id == id) {
        match = element;
      }
    });
    return match;
  },
};
