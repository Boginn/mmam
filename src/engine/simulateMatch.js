import matchEngine from './matchEngine';
import decisionEngine from './decisionEngine';
import matchBrain from './matchBrain';

export default {
  //data

  simulateMatch(match, clubs, fighters, judges) {
    // returned at the end, gotten from archiveMatch()
    let result;

    //bools
    let isFullTime = false;
    let isHomeAttack = true;
    let pendingSub = false;

    let rounds = [1, 2, 3];
    let round = 0;
    let second = 0;
    let minute = 0;

    let happenChance = 11;

    //match data
    let homeTactic = { ...clubs[0].tactic };
    let awayTactic = { ...clubs[1].tactic };
    let homeSubs = [];
    let awaySubs = [];
    let fighterForms = [];
    let score = {
      home: 0,
      away: 0,
    };
    let finishes = { home: 0, away: 0 };
    let cards = {};

    let ringActivity = [
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
    ];
    let ringFinishedLeft = false;
    let ringFinishedCenter = false;
    let ringFinishedRight = false;

    let decisions = {
      ringDecisionLeft: undefined,
      ringDecisionCenter: undefined,
      ringDecisionRight: undefined,
    };

    let ringJudges = {
      ringJudgesLeft: [],
      ringJudgesCenter: [],
      ringJudgesRight: [],
    };
    let ringTruePoints = {
      ringTruePointsLeft: [],
      ringTruePointsCenter: [],
      ringTruePointsRight: [],
    };

    // let judgesCards = [];

    // isDecision;

    let attackTactic = isHomeAttack ? homeTactic : awayTactic;
    let defendTactic = isHomeAttack ? awayTactic : awayTactic;

    //run
    ringTruePoints = matchBrain.seedRoundsToPointCounters(rounds);
    resetFighterMatchStats();
    startRound();
    // getOn();

    function resetFighterMatchStats() {
      // function reset(item) {
      //   item.match.save = false;
      //   item.match.dc = null;
      //   item.match.exposed = 0;
      //   item.match.condition =
      //     item.fitness > item.condition ? item.fitness : item.condition;
      //   item.match.learned = 0;
      //   item.match.momentum = false;
      //   item.match.finished = false;
      //   item.match.substituted = false;
      // }

      matchBrain.reset(fighters.left.home);
      matchBrain.reset(fighters.left.away);
      matchBrain.reset(fighters.center.home);
      matchBrain.reset(fighters.center.away);
      matchBrain.reset(fighters.right.home);
      matchBrain.reset(fighters.right.away);
    }

    function archiveMatch() {
      if (score.home > 3) {
        score.home = 3;
      }
      if (score.away > 3) {
        score.away = 3;
      }

      const matchToArchive = {
        id: undefined,
        date: match.date,
        clubs: match.clubs,
        judges: judges,
        decisions: decisions,
        cards: cards,
        score: score,
        ringActivity: ringActivity,
        left: {
          home: fighters.left.home,
          away: fighters.left.away,
          finish: ringFinishedLeft,
        },
        center: {
          home: fighters.center.home,
          away: fighters.center.away,
          finish: ringFinishedCenter,
        },
        right: {
          home: fighters.right.home,
          away: fighters.right.away,
          finish: ringFinishedRight,
        },
      };

      let clubForm = matchEngine.getClubForm(score);

      const homeClubData = {
        id: matchToArchive.clubs[0],
        competitions: {
          league: {
            points: score.home,
            pointsAgainst: score.away,
            form: clubForm.home,
            finishes: finishes.home,
          },
        },
      };
      const awayClubData = {
        id: matchToArchive.clubs[1],
        competitions: {
          league: {
            points: score.away,
            pointsAgainst: score.home,
            form: clubForm.away,
            finishes: finishes.away,
          },
        },
      };

      const fighterData = [
        {
          league: 1,
          cup: 0,
          international: 0,
          finishes: fighters.left.home.match.finishes,
          id: fighters.left.home.id,
          condition: fighters.left.home.match.condition,
        },
        {
          league: 1,
          cup: 0,
          international: 0,
          finishes: fighters.center.home.match.finishes,
          id: fighters.center.home.id,
          condition: fighters.center.home.match.condition,
        },
        {
          league: 1,
          cup: 0,
          international: 0,
          finishes: fighters.right.home.match.finishes,
          id: fighters.left.home.id,
          condition: fighters.right.home.match.condition,
        },
        {
          league: 1,
          cup: 0,
          international: 0,
          finishes: fighters.left.away.match.finishes,
          id: fighters.left.away.id,
          condition: fighters.left.away.match.condition,
        },
        {
          league: 1,
          cup: 0,
          international: 0,
          finishes: fighters.center.away.match.finishes,
          id: fighters.center.away.id,
          condition: fighters.center.away.match.condition,
        },
        {
          league: 1,
          cup: 0,
          international: 0,
          finishes: fighters.right.away.match.finishes,
          id: fighters.right.away.id,
          condition: fighters.right.away.match.condition,
        },
      ];

      return {
        matchToArchive,
        homeClubData,
        awayClubData,
        fighterData,
        fighterForms,
      };
    }

    function startRound() {
      round++;
      if (!isFullTime) {
        getOn();
      } else {
        result = archiveMatch();
      }
    }

    function endRound() {
      if (round == rounds.length) {
        //decision
        isFullTime = true;
        decision();
      } else {
        startRound();
      }
    }

    function getOn() {
      if (pendingSub) {
        makeSubstitution();
      }
      second = matchEngine.rollEvent(second, happenChance);
      if (second >= 59) {
        minute++;
        second = 0;

        if (minute == 5) {
          minute = 0;

          endRound();
        } else {
          if (!isFullTime) {
            console.log('geton');

            getOn();
          } else {
            result = archiveMatch();
          }
        }
      } else if (!isFullTime) {
        //action happens
        let ring;
        // fighter variables
        let home, away, attacker, defender;

        //pick ring
        ring = matchBrain.pickRing(ringFinishedLeft, ringFinishedRight);
        console.log(ring + 'ring picked');
        console.log(ringFinishedLeft);
        console.log(ringFinishedCenter);
        console.log(ringFinishedRight);

        // select fighters in ring
        if (ring == 1) {
          home = fighters.left.home;
          away = fighters.left.away;
        } else if (ring == 2) {
          home = fighters.center.home;
          away = fighters.center.away;
        } else if (ring == 3) {
          home = fighters.right.home;
          away = fighters.right.away;
        }

        //pick fighter initiative
        let homeInitiative = matchEngine.checkInitiative(home);
        let awayInitiative = matchEngine.checkInitiative(away);

        if (homeInitiative >= awayInitiative) {
          //tiniest home advantage
          isHomeAttack = true;
          attacker = home;
          defender = away;
        } else {
          isHomeAttack = false;
          attacker = away;
          defender = home;
        }

        // attach tactics
        //already has tactics, not same? hm
        // match.vue does something else here
        // to attach tactics on the fly probably
        //if so no need
        attacker.tactic.instructions = {
          ...attacker.tactic.instructions,
          ...attackTactic.instructions,
        };
        defender.tactic.instructions = {
          ...defender.tactic.instructions,
          ...defendTactic.instructions,
        };

        //pick method of attack
        let attackMethod = matchEngine.pickMethodAttack(attacker);
        let outcome = matchEngine.engage(attackMethod, attacker, defender);
        console.log(outcome);
        //count activity
        matchBrain.countActivity(ring, outcome, isHomeAttack, ringActivity);

        //OUTCOME
        //sort out the outcome,

        //updates momentum, condition, exposed and learned
        matchBrain.updateFighterMatchStats(attacker, defender, outcome);

        // checks condition to see if there was a finish
        checkForFinish(defender, ring, isHomeAttack, attacker);

        checkForFinish(attacker, ring, !isHomeAttack, defender);

        if (outcome.point) {
          // TODO
          ringTruePoints = matchBrain.tallyPoints(
            ring,
            outcome,
            isHomeAttack,
            ringTruePoints,
            round
          );
        }

        console.log('tally done');

        let substitutionAvailable =
          homeSubs.length || awaySubs.length ? true : false;

        //SUBSTITUTION
        if (ringFinishedCenter && substitutionAvailable && !isFullTime) {
          pendingSub = true; //triggers makeSubstitution at the beginning of getOn()
        }

        // loop
        if (!isFullTime) {
          getOn();
        } else {
          result = archiveMatch();
        }
      }
    }

    function makeSubstitution() {
      console.log('making a sub');
      if (isHomeAttack) {
        if (awaySubs[0] == awayTactic.selection.left) {
          awayTactic.selection.left = awayTactic.selection.center;
        } else if (awaySubs[0] == awayTactic.selection.right) {
          awayTactic.selection.right = awayTactic.selection.center;
        }

        awayTactic.selection.center = awaySubs[0];
        awaySubs.splice(0, 1);
      } else {
        if (homeSubs[0] == homeTactic.selection.left) {
          homeTactic.selection.left = homeTactic.selection.center;
        } else if (homeSubs[0] == homeTactic.selection.right) {
          homeTactic.selection.right = homeTactic.selection.center;
        }

        homeTactic.selection.center = homeSubs[0];
        homeSubs.splice(0, 1);
      }

      ringFinishedCenter = false;
      pendingSub = false;
    }

    function checkForFinish(fighter, ring, isHomeAttacking, winner) {
      let fighterResult = matchEngine.checkCondition(fighter);
      console.log(fighter);
      console.log(fighterResult);

      if (fighterResult.finished) {
        fighter.match.finished = true;

        if (ring == 1) {
          ringFinishedLeft = true;
          fighterForms.push({ id: winner.id, item: 'F' });
          fighterForms.push({ id: fighter.id, item: 'L' });
          //do depending on which side
          if (isHomeAttacking) {
            score.home += 1;
            homeSubs.push(winner.id);
            finishes.home++;
            console.log(finishes.home + 'home finishes');
            console.log(ringFinishedLeft);
          } else {
            score.away += 1;
            awaySubs.push(winner.id);
            finishes.away++;
            console.log(finishes.away + 'away finishes');
            console.log(ringFinishedLeft);
          }
        } else if (ring == 2) {
          ringFinishedCenter = true;
          fighterForms.push({ id: winner.id, item: 'F' });
          fighterForms.push({ id: fighter.id, item: 'L' });
          //do depending on which side
          if (isHomeAttacking) {
            finishes.home++;
            console.log(finishes.home + 'home finishes');
            console.log(ringFinishedCenter);
            if (awaySubs.length == 0) {
              score.home += 3;
              isFullTime = true;

              // sets this.decisions
              // matchBrain.scoreRounds(ringTruePoints, ringJudges, decisions);

              console.log('isFullTime = true');
            } else {
              console.log(awaySubs);
            }
          } else {
            finishes.away++;
            console.log(finishes.away + 'away finishes');
            console.log(ringFinishedCenter);
            if (homeSubs.length == 0) {
              score.away += 3;
              isFullTime = true;

              // sets this.decisions
              // matchBrain.scoreRounds(ringTruePoints, ringJudges, decisions);

              console.log('isFullTime = true');
            } else {
              console.log(homeSubs);
            }
          }
        } else if (ring == 3) {
          ringFinishedRight = true;
          fighterForms.push({ id: winner.id, item: 'F' });
          fighterForms.push({ id: fighter.id, item: 'L' });
          //do depending on which side
          if (isHomeAttacking) {
            score.home += 1;
            homeSubs.push(winner.id);
            finishes.home++;
            console.log(finishes.home + 'home finishes');
            console.log(ringFinishedRight);
          } else {
            score.away += 1;
            awaySubs.push(winner.id);
            finishes.away++;
            console.log(finishes.away + 'away finishes');
            console.log(ringFinishedRight);
          }
        }
      }
    }

    function decision() {
      decisions = matchBrain.scoreRounds(ringTruePoints, ringJudges);
      // for center ring, the club with more fighters standing takes it
      if (homeStillStanding > awayStillStanding) {
        console.log('home?');
        score.home += 2;
      } else if (homeStillStanding < awayStillStanding) {
        console.log('away?');
        score.away += 2;
      } else {
        // we go to a decision
        console.log('tis decisish');

        cards = { ...cards, ...decisionEngine.getJudgesCards() };

        let scoreResults = decisionEngine.countScore(
          cards,
          ringFinishedLeft,
          ringFinishedRight
        );
        score.home = scoreResults[1].home;
        score.away = scoreResults[1].away;

        console.log(cards);
      }
      result = archiveMatch();
    }

    function homeStillStanding() {
      let count = 0;

      fighters.left.home.match.finished ? count : (count += 1);
      fighters.center.home.match.finished ? count : (count += 1);
      fighters.right.home.match.finished ? count : (count += 1);

      return count;
    }
    function awayStillStanding() {
      let count = 0;
      fighters.left.away.match.finished ? count : (count += 1);
      fighters.center.away.match.finished ? count : (count += 1);
      fighters.right.away.match.finished ? count : (count += 1);
      return count;
    }

    // function pickRing() {
    //   if (ringFinishedLeft && ringFinishedRight) {
    //     return 2;
    //   } else if (ringFinishedLeft) {
    //     return matchEngine.roll(2) + 1;
    //   } else if (ringFinishedRight) {
    //     return matchEngine.roll(2);
    //   } else {
    //     return matchEngine.roll(3);
    //   }
    // }

    // function countActivity(ring, outcome) {
    //   if (isHomeAttack) {
    //     ringActivity[ring - 1].home += 1;
    //     if (outcome.significant) {
    //       ringActivity[ring - 1].homeSignificant += 1;
    //     }
    //   } else {
    //     ringActivity[ring - 1].away += 1;
    //     if (outcome.significant) {
    //       ringActivity[ring - 1].awaySignificant += 1;
    //     }
    //   }
    // }
    //same exact
    // function updateFighterMatchStats(attacker, defender, outcome) {
    //   const { att, def } = outcome;

    //   attacker.match.condition -= att.damage;
    //   attacker.match.exposed += att.exposed;
    //   attacker.match.learned += att.learned;
    //   attacker.match.momentum = att.momentum;
    //   attacker.match.save = att.save;
    //   attacker.match.dc = att.dc;

    //   attacker.match.exposed = matchEngine.stayPercentage(
    //     attacker.match.exposed
    //   );
    //   attacker.match.learned = matchEngine.stayPercentage(
    //     attacker.match.learned
    //   );
    //   attacker.match.condition = matchEngine.stayPercentage(
    //     attacker.match.condition
    //   );

    //   defender.match.condition -= def.damage;
    //   defender.match.exposed += def.exposed;
    //   defender.match.learned += def.learned;
    //   defender.match.momentum = def.momentum;
    //   defender.match.save = def.save;
    //   defender.match.dc = def.dc;

    //   defender.match.exposed = matchEngine.stayPercentage(
    //     defender.match.exposed
    //   );
    //   defender.match.learned = matchEngine.stayPercentage(
    //     defender.match.learned
    //   );
    //   defender.match.condition = matchEngine.stayPercentage(
    //     defender.match.condition
    //   );
    // }
    // function tallyPoints(ring, outcome) {
    //   const {
    //     ringTruePointsLeft,
    //     ringTruePointsCenter,
    //     ringTruePointsRight,
    //   } = ringTruePoints;
    //   // console.log(ringTruePointsLeft)
    //   // console.log(ringTruePointsCenter)
    //   // console.log(ringTruePointsRight)
    //   // console.log(ringTruePoints)
    //   if (ring == 1) {
    //     // LEFT
    //     if (isHomeAttack) {
    //       ringTruePointsLeft[round - 1].home += 1;
    //       if (outcome.significant) {
    //         ringTruePointsLeft[round - 1].homeSignificant += 1;
    //       }
    //     } else {
    //       ringTruePointsLeft[round - 1].away += 1;
    //       if (outcome.significant) {
    //         ringTruePointsLeft[round - 1].awaySignificant += 1;
    //       }
    //     }
    //   } else if (ring == 2) {
    //     // CENTER
    //     if (isHomeAttack) {
    //       ringTruePointsCenter[round - 1].home += 1;
    //       if (outcome.significant) {
    //         ringTruePointsCenter[round - 1].homeSignificant += 1;
    //       }
    //     } else {
    //       ringTruePointsCenter[round - 1].away += 1;
    //       if (outcome.significant) {
    //         ringTruePointsCenter[round - 1].awaySignificant += 1;
    //       }
    //     }
    //   } else if (ring == 3) {
    //     // RIGHT
    //     if (isHomeAttack) {
    //       ringTruePointsRight[round - 1].home += 1;
    //       if (outcome.significant) {
    //         ringTruePointsRight[round - 1].homeSignificant += 1;
    //       }
    //     } else {
    //       ringTruePointsRight[round - 1].away += 1;
    //       if (outcome.significant) {
    //         ringTruePointsRight[round - 1].awaySignificant += 1;
    //       }
    //     }
    //   }
    // }

    // function scoreRounds() {
    //   const {
    //     ringTruePointsLeft,
    //     ringTruePointsCenter,
    //     ringTruePointsRight,
    //   } = ringTruePoints;
    //   const { ringJudgesLeft, ringJudgesCenter, ringJudgesRight } = ringJudges;

    //   // sets this.decisions
    //   decisions.ringDecisionLeft = decisionEngine.scoreRounds(
    //     ringJudgesLeft,
    //     ringTruePointsLeft
    //   );
    //   decisions.ringDecisionCenter = decisionEngine.scoreRounds(
    //     ringJudgesCenter,
    //     ringTruePointsCenter
    //   );
    //   decisions.ringDecisionRight = decisionEngine.scoreRounds(
    //     ringJudgesRight,
    //     ringTruePointsRight
    //   );
    // }

    //same most as in decisionEngine
    // function countScore() {
    //   let homeCount = 0;
    //   let awayCount = 0;

    //   if (!ringFinishedLeft) {
    //     cards.left.forEach((score) => {
    //       if (score.home == true && score.away == false) {
    //         homeCount += 1;
    //       } else if (score.home == false && score.away == true) {
    //         awayCount += 1;
    //       }
    //     });

    //     if (homeCount != awayCount) {
    //       if (homeCount > awayCount) {
    //         matchEngine.score.home += 1;
    //       } else {
    //         matchEngine.score.away += 1;
    //       }
    //     }

    //     homeCount = 0;
    //     awayCount = 0;
    //   }

    //   if (!ringFinishedRight) {
    //     cards.right.forEach((score) => {
    //       if (score.home == true && score.away == false) {
    //         homeCount += 1;
    //       } else if (score.home == false && score.away == true) {
    //         awayCount += 1;
    //       }
    //     });

    //     if (homeCount != awayCount) {
    //       if (homeCount > awayCount) {
    //         matchEngine.score.home += 1;
    //       } else {
    //         matchEngine.score.away += 1;
    //       }
    //     }

    //     homeCount = 0;
    //     awayCount = 0;
    //   }

    //   cards.center.forEach((score) => {
    //     if (score.home == true && score.away == false) {
    //       homeCount += 1;
    //     } else if (score.home == false && score.away == true) {
    //       awayCount += 1;
    //     }
    //   });

    //   console.log(homeCount);
    //   console.log(awayCount);

    //   if (homeCount == awayCount) {
    //     score.home += 1;
    //     score.away += 1;
    //   } else {
    //     if (homeCount > awayCount) {
    //       score.home += 2;
    //     } else {
    //       score.away += 2;
    //     }
    //   }
    // }

    // from judgescard.js probably
    // function getJudgesCards() {
    //   for (let i = 0; i < decisions.length; i++) {
    //     const decision = decisions[i];

    //     for (let j = 0; j < this.judges[i].length; j++) {
    //       const judge = this.judges[i][j];
    //       judge;

    //       if (finalPoints(decision[j]).home == finalPoints(decision[j]).away) {
    //         judgesCards.push({ home: true, away: true });
    //       } else {
    //         finalPoints(decision[j]).home > finalPoints(decision[j]).away
    //           ? judgesCards.push({ home: true, away: false })
    //           : judgesCards.push({ home: false, away: true });
    //       }
    //     }
    //   }

    //   let result = {
    //     left: [],
    //     center: [],
    //     right: [],
    //     leftMsg: '',
    //     centerMsg: '',
    //     rightMsg: '',
    //   };

    //   sortCards(result.left);
    //   sortCards(result.center);
    //   sortCards(result.right);

    //   console.log(result);

    //   return result;
    // }

    // function sortCards(card) {
    //   for (let i = 0; i < rounds.length; i++) {
    //     card.push(judgesCards[i]);
    //   }
    //   judgesCards.splice(0, rounds.length);
    // }

    // function finalPoints(rounds) {
    //   var result = { home: 0, away: 0 };
    //   rounds.forEach((round) => {
    //     result.home = result.home + round.home;
    //     result.away += round.away;
    //   });
    //   return result;
    // }

    // returns result {homedata, awaydata, result, fighterdata, fighterforms}
    return result;
  },
};
