import classes from "../data/classes.js";
import data from "../data/data.js";

export default {



 

  returnPlayerClub: (league, selectedClubId) => {
    var playerClub;
    league.forEach((club) => {
      if (club.id == selectedClubId) {
        playerClub = club;
      }
    });
    return playerClub;
  },

  //seeds
  initialize: (idCodeFighter, idCodeClub) => {
    var FIGHTER_ID = idCodeFighter;
    data.fighters.roster.forEach((element) => {
      element.id = FIGHTER_ID;
      FIGHTER_ID++;
    });

    var CLUB_ID = idCodeClub;
    data.clubs.england.forEach((element) => {
      element.id = CLUB_ID;
      CLUB_ID++;
    });
  },

  seedRosterToTeams: (teams, roster) => {
    teams.forEach((team) => {
      let counter = Math.floor(roster.length / teams.length);

      for (let i = 0; i < counter; i++) {
        if (roster[i].contract) {
          counter = counter + 1;
        } else {
          team.squad.push(roster[i].id);
          roster[i].contract = true;
        }
      }
    });
    console.log("engine.seedRosterToTeams");
    console.log(roster);
  },

  seedSchedule: (league, idCodeMatch) => {
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

    console.log("engine.seedSchedule");
    console.log(schedule);

    var MATCH_ID = idCodeMatch;
    schedule.forEach((element) => {
      element.id = MATCH_ID;
      MATCH_ID++;
    });

    return schedule;
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
      fighter = new classes.Fighter(0, "", "Select", "", "", "");
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
      coach = new classes.Coach(0, "", "Select", "", "", "");
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
      judge = new classes.Judge(0, "", "Select", "", "", "");
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
