import matchEngine from './matchEngine';

export default {
  //data

  simulateMatch(match, clubs, fighters, judges) {
    console.log(match);
    console.log(clubs);
    console.log(fighters);
    console.log(judges);

    // returned at the end, gotten from archiveMatch()
    let result;

    //bools
    let isFullTime = false;
    let isHomeAttack = true;
    let isDecision = false;

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

    let score = {
      home: 0,
      away: 0,
    };
    let substitutionMade = false;
    let pendingSub = false;
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

    let ringDecisionLeft = undefined;
    let ringDecisionCenter = undefined;
    let ringDecisionRight = undefined;
    let ringFinishedLeft = false;
    let ringFinishedCenter = false;
    let ringFinishedRight = false;
    let ringJudgesLeft = [];
    let ringJudgesCenter = [];
    let ringJudgesRight = [];
    let truePointsLeft = [];
    let truePointsCenter = [];
    let truePointsRight = [];
    let cards = {};
    let finishes = { home: 0, away: 0 };

    let judgesCards = [];

    isDecision;

    substitutionMade;
    ringDecisionLeft;
    ringDecisionCenter;
    ringDecisionRight;
    ringFinishedCenter;
    ringJudgesLeft;
    ringJudgesCenter;
    ringJudgesRight;
    cards;

    let attackTactic = isHomeAttack ? homeTactic : awayTactic;
    let defendTactic = isHomeAttack ? awayTactic : awayTactic;

    //init
    function seedRoundsToPointCounters() {
      rounds.forEach((element) => {
        truePointsLeft.push({
          round: element,
          home: 0,
          away: 0,
          homeSignificant: 0,
          awaySignificant: 0,
        });
        truePointsCenter.push({
          round: element,
          home: 0,
          away: 0,
          homeSignificant: 0,
          awaySignificant: 0,
        });
        truePointsRight.push({
          round: element,
          home: 0,
          away: 0,
          homeSignificant: 0,
          awaySignificant: 0,
        });
      });
    }

    function resetFighterMatchStats() {
      function reset(item) {
        item.match.exposed = 0;
        item.match.condition = item.fitness;
        item.match.learned = 0;
        item.match.momentum = false;
        item.match.finished = false;
        item.match.substituted = false;
      }

      reset(fighters.left.home);
      reset(fighters.left.away);
      reset(fighters.center.home);
      reset(fighters.center.away);
      reset(fighters.right.home);
      reset(fighters.right.away);
    }

    //run
    seedRoundsToPointCounters();
    resetFighterMatchStats();
    startRound();
    getOn();

    //
    function archiveMatch() {
      let decisions = [];
      decisions.push(ringDecisionLeft);
      decisions.push(ringDecisionCenter);
      decisions.push(ringDecisionRight);
      const result = {
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

      console.log(result);

      let form = matchEngine.getForm(score);

      const homeClubData = {
        id: result.clubs[0],
        competitions: {
          league: {
            points: score.home,
            pointsAgainst: score.away,
            form: form.home,
            finishes: finishes.home,
          },
        },
      };
      const awayClubData = {
        id: result.clubs[1],
        competitions: {
          league: {
            points: score.away,
            pointsAgainst: score.home,
            form: form.away,
            finishes: finishes.away,
          },
        },
      };

      return {
        result,
        homeClubData,
        awayClubData,
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
      console.log('hm');

      if (round == rounds.length) {
        //decision
        isFullTime = true;
        console.log('isFullTime = true - decision');
        console.log(isFullTime);
        decision();
        console.log(isFullTime);
      } else {
        console.log('starting round');
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
        ring = pickRing();
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
        countActivity(ring, outcome);

        //OUTCOME
        //sort out the outcome,

        //check for disengage // could be part of updateFighterMatchStats?
        // all it's doing is giving exposed back.. could be called sth else
        if (outcome.disengage) {
          defender.match.exposed -= matchEngine.disengage(defender);
          if (defender.match.exposed < 0) {
            defender.match.exposed = 0;
          }
        }
        //updates momentum, condition, exposed and learned
        updateFighterMatchStats(attacker, defender, outcome);

        // checks condition to see if there was a finish
        checkForFinish(defender, ring, isHomeAttack, attacker);

        checkForFinish(attacker, ring, !isHomeAttack, defender);

        if (outcome.point) {
          // TODO
          tallyPoints(ring, outcome);
        }

        console.log('tally done');

        let substitutionAvailable =
          homeSubs.length || awaySubs.length ? true : false;

        //Find:SUBSTITUTION
        if (ringFinishedCenter && substitutionAvailable && !isFullTime) {
          substitutionMade = true;
          pendingSub = true; //triggers makeSubstitution at the beginning of getOn()
        }
        console.log('ending');
        console.log(isFullTime);
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

    function pickRing() {
      if (ringFinishedLeft && ringFinishedRight) {
        return 2;
      } else if (ringFinishedLeft) {
        return matchEngine.roll(2) + 1;
      } else if (ringFinishedRight) {
        return matchEngine.roll(2);
      } else {
        return matchEngine.roll(3);
      }
    }

    function countActivity(ring, outcome) {
      if (isHomeAttack) {
        ringActivity[ring - 1].home += 1;
        if (outcome.significant) {
          ringActivity[ring - 1].homeSignificant += 1;
        }
      } else {
        ringActivity[ring - 1].away += 1;
        if (outcome.significant) {
          ringActivity[ring - 1].awaySignificant += 1;
        }
      }
    }

    function updateFighterMatchStats(attacker, defender, outcome) {
      attacker.match.condition -= outcome.attackerDamage;
      attacker.match.exposed + outcome.attackerExposed;
      attacker.match.learned += outcome.attackerLearned;
      attacker.match.momentum = outcome.attackerMomentum;

      attacker.match.exposed = matchEngine.getFlooredToHundred(
        attacker.match.exposed
      );
      attacker.match.learned = matchEngine.getFlooredToHundred(
        attacker.match.learned
      );

      defender.match.condition -= outcome.defenderDamage;
      defender.match.exposed += outcome.defenderExposed;
      defender.match.learned += outcome.defenderLearned;
      attacker.match.momentum = outcome.defenderMomentum;

      defender.match.exposed = matchEngine.getFlooredToHundred(
        defender.match.exposed
      );
      defender.match.learned = matchEngine.getFlooredToHundred(
        defender.match.learned
      );
    }

    function checkCondition(fighter) {
      let result = { finished: false };
      if (fighter.match.condition <= 0) {
        result.finished = true;
      }
      return result;
    }

    function checkForFinish(fighter, ring, isHomeAttacking, winner) {
      let fighterResult = checkCondition(fighter);
      console.log(fighter);
      console.log(fighterResult);

      if (fighterResult.finished) {
        fighter.match.finished = true;

        if (ring == 1) {
          ringFinishedLeft = true;
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
          //do depending on which side
          if (isHomeAttacking) {
            finishes.home++;
            console.log(finishes.home + 'home finishes');
            console.log(ringFinishedCenter);
            if (awaySubs.length == 0) {
              score.home += 3;
              isFullTime = true;
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
              console.log('isFullTime = true');
            } else {
              console.log(homeSubs);
            }
          }
        } else if (ring == 3) {
          ringFinishedRight = true;
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

    function tallyPoints(ring, outcome) {
      if (ring == 1) {
        // LEFT
        if (isHomeAttack) {
          truePointsLeft[round - 1].home += 1;
          if (outcome.significant) {
            truePointsLeft[round - 1].homeSignificant += 1;
          }
        } else {
          truePointsLeft[round - 1].away += 1;
          if (outcome.significant) {
            truePointsLeft[round - 1].awaySignificant += 1;
          }
        }
      } else if (ring == 2) {
        // CENTER
        if (isHomeAttack) {
          truePointsCenter[round - 1].home += 1;
          if (outcome.significant) {
            truePointsCenter[round - 1].homeSignificant += 1;
          }
        } else {
          truePointsCenter[round - 1].away += 1;
          if (outcome.significant) {
            truePointsCenter[round - 1].awaySignificant += 1;
          }
        }
      } else if (ring == 3) {
        // RIGHT
        if (isHomeAttack) {
          truePointsRight[round - 1].home += 1;
          if (outcome.significant) {
            truePointsLeft[round - 1].homeSignificant += 1;
          }
        } else {
          truePointsRight[round - 1].away += 1;
          if (outcome.significant) {
            truePointsRight[round - 1].awaySignificant += 1;
          }
        }
      }
    }

    function decision() {
      // for center ring, the club with more fighters standing takes it
      if (homeStillStanding > awayStillStanding) {
        console.log('home?');
        score.home += 2;
      } else if (homeStillStanding < awayStillStanding) {
        console.log('away?');
        score.away += 2;
      } else {
        console.log('no tis decisish');

        // we go to a decision
        ringDecisionLeft = matchEngine.scoreRounds(
          ringJudgesLeft,
          truePointsLeft
        );
        ringDecisionCenter = matchEngine.scoreRounds(
          ringJudgesCenter,
          truePointsCenter
        );
        ringDecisionRight = matchEngine.scoreRounds(
          ringJudgesRight,
          truePointsRight
        );

        cards = { ...cards, ...getJudgesCards() };

        countScore();
        console.log(cards);
      }
      result = archiveMatch();
    }

    function countScore() {
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
            matchEngine.score.home += 1;
          } else {
            matchEngine.score.away += 1;
          }
        }

        homeCount = 0;
        awayCount = 0;
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
            matchEngine.score.home += 1;
          } else {
            matchEngine.score.away += 1;
          }
        }

        homeCount = 0;
        awayCount = 0;
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
        score.home += 1;
        score.away += 1;
      } else {
        if (homeCount > awayCount) {
          score.home += 2;
        } else {
          score.away += 2;
        }
      }
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

    function getJudgesCards() {
      let decisions = [];
      decisions.push(ringDecisionLeft);
      decisions.push(ringDecisionCenter);
      decisions.push(ringDecisionRight);
      for (let i = 0; i < decisions.length; i++) {
        const decision = decisions[i];

        for (let j = 0; j < this.judges[i].length; j++) {
          const judge = this.judges[i][j];
          judge;

          if (finalPoints(decision[j]).home == finalPoints(decision[j]).away) {
            judgesCards.push({ home: true, away: true });
          } else {
            finalPoints(decision[j]).home > finalPoints(decision[j]).away
              ? judgesCards.push({ home: true, away: false })
              : judgesCards.push({ home: false, away: true });
          }
        }
      }

      let result = {
        left: [],
        center: [],
        right: [],
        leftMsg: '',
        centerMsg: '',
        rightMsg: '',
      };

      sortCards(result.left);
      sortCards(result.center);
      sortCards(result.right);

      console.log(result);

      return result;
    }

    function sortCards(card) {
      for (let i = 0; i < rounds.length; i++) {
        card.push(judgesCards[i]);
      }
      judgesCards.splice(0, rounds.length);
    }

    function finalPoints(rounds) {
      var result = { home: 0, away: 0 };
      rounds.forEach((round) => {
        result.home = result.home + round.home;
        result.away += round.away;
      });
      return result;
    }

    // returns result {homedata, awaydata, result}
    return result;
  },
};
