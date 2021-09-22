import engine from '@/engine/engine.js';
let judgesCards = [];

const sortCards = (card, rounds) => {
  for (let i = 0; i < rounds.length; i++) {
    card.push(judgesCards[i]);
  }
  judgesCards.splice(0, rounds.length);
};

export default {
  getJudgesCards(decisions, judges, rounds) {
    console.log(decisions);
    for (let i = 0; i < decisions.length; i++) {
      const decision = decisions[i];

      for (let j = 0; j < judges[i].length; j++) {
        const judge = judges[i][j];
        judge;

        if (
          this.finalPoints(decision[j]).home ==
          this.finalPoints(decision[j]).away
        ) {
          judgesCards.push({ home: true, away: true });
        } else {
          this.finalPoints(decision[j]).home >
          this.finalPoints(decision[j]).away
            ? judgesCards.push({ home: true, away: false })
            : judgesCards.push({ home: false, away: true });
        }
      }
    }

    let cards = {
      left: [],
      center: [],
      right: [],
      leftMsg: '',
      centerMsg: '',
      rightMsg: '',
    };

    sortCards(cards.left, rounds);
    sortCards(cards.center, rounds);
    sortCards(cards.right, rounds);

    console.log(cards);
    return cards;
  },

  finalPoints(rounds) {
    var result = { home: 0, away: 0 };
    rounds.forEach((round) => {
      result.home = result.home + round.home;
      result.away += round.away;
    });
    return result;
  },

  countScore(cards, ringFinishedLeft, ringFinishedRight) {
    let result = { home: 0, away: 0 };
    let messager = function(winner, loser) {
      if (loser == 0 && winner == 3) {
        return 'Unanimous Decision';
      } else if (loser == 0 || winner == 1) {
        return 'Majority Decision';
      } else {
        return 'Split Decision';
      }
    };

    let homeCount = 0;
    let awayCount = 0;

    if (!ringFinishedLeft) {
      cards.left.forEach((score) => {
        if (score.home == true && score.away == false) {
          homeCount += 1;
        } else if (score.home == false && score.away == true) {
          awayCount += 1;
        }
      });

      if (homeCount != awayCount) {
        if (homeCount > awayCount) {
          result.home += 1;
          cards.leftMsg = messager(homeCount, awayCount);
        } else {
          result.away += 1;
          cards.leftMsg = messager(awayCount, homeCount);
        }
      } else {
        cards.leftMsg = 'Draw';
      }
      console.log(homeCount);
      console.log(awayCount);

      homeCount = 0;
      awayCount = 0;
    } else {
      cards.leftMsg = 'Finish';
    }

    if (!ringFinishedRight) {
      cards.right.forEach((score) => {
        if (score.home == true && score.away == false) {
          homeCount += 1;
        } else if (score.home == false && score.away == true) {
          awayCount += 1;
        }
      });

      if (homeCount != awayCount) {
        if (homeCount > awayCount) {
          result.home += 1;
          cards.rightMsg = messager(homeCount, awayCount);
        } else {
          result.away += 1;
          cards.rightMsg = 'Finish';
        }
      } else {
        cards.rightMsg = 'Draw';
      }

      console.log(homeCount);
      console.log(awayCount);

      homeCount = 0;
      awayCount = 0;
    } else {
      cards.rightMsg = messager(awayCount, homeCount);
    }

    cards.center.forEach((score) => {
      if (score.home == true && score.away == false) {
        homeCount += 1;
      } else if (score.home == false && score.away == true) {
        awayCount += 1;
      }
    });

    console.log(homeCount);
    console.log(awayCount);

    if (homeCount == awayCount) {
      result.home += 1;
      result.away += 1;
      cards.centerMsg = 'Draw';
    } else {
      if (homeCount > awayCount) {
        result.home += 2;
        cards.centerMsg = messager(homeCount, awayCount);
      } else {
        result.away += 2;
        cards.centerMsg = messager(awayCount, homeCount);
      }
    }
    //save
    return [cards, result];
  },

  //judging
  scoreRounds(judges, rounds) {
    var judgesTally = [];
    var judgesCard = [];
    judges.forEach((judge) => {
      // importance of match judge.mental.pressure

      var concentration = engine.getRollWithMod(judge.judging.concentration);
      var judgement = engine.getRollWithMod(judge.judging.judgement);
      var retention = engine.getRollWithMod(judge.judging.retention);
      concentration;
      judgement;
      retention;

      for (let i = 0; i < rounds.length; i++) {
        var result = {
          home: 0,
          homeSignificant: 0,
          away: 0,
          awaySignificant: 0,
        };
        for (let j = 0; j < rounds[i].home; j++) {
          if (engine.getRollWithMod(judge.judging.concentration) >= 6) {
            result.home += 1;
          }
        }
        for (let j = 0; j < rounds[i].homeSignificant; j++) {
          if (engine.getRollWithMod(judge.judging.concentration) >= 6) {
            if (engine.getRollWithMod(judge.judging.judgement) >= 10) {
              result.homeSignificant += 1;
            } else {
              result.home += 1;
            }
          }
        }
        for (let j = 0; j < rounds[i].away; j++) {
          if (engine.getRollWithMod(judge.judging.concentration) >= 6) {
            result.away += 1;
          }
        }
        for (let j = 0; j < rounds[i].awaySignificant; j++) {
          if (engine.getRollWithMod(judge.judging.concentration) >= 6) {
            if (engine.getRollWithMod(judge.judging.judgement) >= 10) {
              result.awaySignificant += 1;
            } else {
              result.away += 1;
            }
          }
        }
        /**/
        // if (this.getRollWithMod(judge.judging.retention) - 5 < 0) {
        //   if (this.roll(2) == 1) {
        //     result.home -= 3;
        //     result.home = Math.abs(result.home);
        //   } else {
        //     result.away -= 3;
        //     result.away = Math.abs(result.away);
        //   }
        // }
        judgesTally.push(result);
      }

      // var roundOne = { home: undefined, away: undefined };
      // var roundTwo = { home: undefined, away: undefined };
      // var roundThree = { home: undefined, away: undefined };
      var significantModifier = 3; // 3?
      var scaleModifier = 5;

      var roundOne = this.calculateTally(
        judgesTally,
        0,
        significantModifier,
        scaleModifier
      );
      var roundTwo = this.calculateTally(
        judgesTally,
        1,
        significantModifier,
        scaleModifier
      );
      var roundThree = this.calculateTally(
        judgesTally,
        2,
        significantModifier,
        scaleModifier
      );
      roundOne = this.convertToMustScore(roundOne);
      roundTwo = this.convertToMustScore(roundTwo);
      roundThree = this.convertToMustScore(roundThree);

      judgesTally.splice(0, 3);

      judgesCard.push([roundOne, roundTwo, roundThree]);
    });
    // console.log(judgesTally);
    // console.log(judgesCard);

    // console.log(rounds);
    return judgesCard;
  },

  calculateTally(tally, index, significantModifier, scaleModifier) {
    var round = { home: 0, away: 0 };
    round.home =
      tally[index].home + tally[index].homeSignificant * significantModifier;
    round.home *= scaleModifier;
    round.away =
      tally[index].away + tally[index].awaySignificant * significantModifier;
    round.away *= scaleModifier;

    if (round.home == round.away) {
      if (tally[index].homeSignificant > tally[index].awaySignificant) {
        round.home += 1;
      } else if (tally[index].homeSignificant < tally[index].awaySignificant) {
        round.away += 1;
      }
    }

    return round;
  },

  convertToMustScore(round) {
    var isHomeWin = round.home > round.away ? true : false;

    if (round.home == round.away) {
      round.home = 10;
      round.away = 10;
    }

    if (engine.getDifference(round.home, round.away) > 50) {
      // console.log(round.home);
      // console.log(round.away);
      // console.log('true');
      if (isHomeWin) {
        round.home = 10;
        round.away = 7;
      } else {
        round.home = 7;
        round.away = 10;
      }
    } else if (engine.getDifference(round.home, round.away) > 25) {
      if (isHomeWin) {
        round.home = 10;
        round.away = 8;
      } else {
        round.home = 8;
        round.away = 10;
      }
    } else {
      if (isHomeWin) {
        round.home = 10;
        round.away = 9;
      } else {
        round.home = 9;
        round.away = 10;
      }
    }

    return round;
  },
};
