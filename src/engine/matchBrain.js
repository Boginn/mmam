import matchEngine from '@/engine/matchEngine.js';
import decisionEngine from '@/engine/decisionEngine.js';

export default {
  reset(item) {
    item.match.save = false;
    item.match.dc = null;
    item.match.exposed = 0;
    item.match.condition =
      item.fitness > item.condition ? item.fitness : item.condition;
    item.match.learned = 0;
    item.match.momentum = false;
    item.match.finished = false;
    item.match.substituted = false;
  },
  seedRoundsToPointCounters(rounds) {
    const ringTruePoints = {
      ringTruePointsLeft: [],
      ringTruePointsCenter: [],
      ringTruePointsRight: [],
    };
    rounds.forEach((element) => {
      ringTruePoints.ringTruePointsLeft.push({
        round: element,
        home: 0,
        away: 0,
        homeSignificant: 0,
        awaySignificant: 0,
      });
      ringTruePoints.ringTruePointsCenter.push({
        round: element,
        home: 0,
        away: 0,
        homeSignificant: 0,
        awaySignificant: 0,
      });
      ringTruePoints.ringTruePointsRight.push({
        round: element,
        home: 0,
        away: 0,
        homeSignificant: 0,
        awaySignificant: 0,
      });
    });
    return ringTruePoints;
  },
  scoreRounds(ringTruePoints, ringJudges) {
    const {
      ringTruePointsLeft,
      ringTruePointsCenter,
      ringTruePointsRight,
    } = ringTruePoints;
    const { ringJudgesLeft, ringJudgesCenter, ringJudgesRight } = ringJudges;
    return {
      ringDecisionLeft: decisionEngine.scoreRounds(
        ringJudgesLeft,
        ringTruePointsLeft
      ),
      ringDecisionCenter: decisionEngine.scoreRounds(
        ringJudgesCenter,
        ringTruePointsCenter
      ),
      ringDecisionRight: decisionEngine.scoreRounds(
        ringJudgesRight,
        ringTruePointsRight
      ),
    };
  },
  tallyPoints(ring, outcome, isHomeAttack, ringTruePoints, round) {
    const truePoints = ringTruePoints;
    const {
      ringTruePointsLeft,
      ringTruePointsCenter,
      ringTruePointsRight,
    } = truePoints;
    if (ring == 1) {
      // LEFT
      if (isHomeAttack) {
        ringTruePointsLeft[round - 1].home += 1;
        if (outcome.significant) {
          ringTruePointsLeft[round - 1].homeSignificant += 1;
        }
      } else {
        ringTruePointsLeft[round - 1].away += 1;
        if (outcome.significant) {
          ringTruePointsLeft[round - 1].awaySignificant += 1;
        }
      }
    } else if (ring == 2) {
      // CENTER
      if (isHomeAttack) {
        ringTruePointsCenter[round - 1].home += 1;
        if (outcome.significant) {
          ringTruePointsCenter[round - 1].homeSignificant += 1;
        }
      } else {
        ringTruePointsCenter[round - 1].away += 1;
        if (outcome.significant) {
          ringTruePointsCenter[round - 1].awaySignificant += 1;
        }
      }
    } else if (ring == 3) {
      // RIGHT
      if (isHomeAttack) {
        ringTruePointsRight[round - 1].home += 1;
        if (outcome.significant) {
          ringTruePointsRight[round - 1].homeSignificant += 1;
        }
      } else {
        ringTruePointsRight[round - 1].away += 1;
        if (outcome.significant) {
          ringTruePointsRight[round - 1].awaySignificant += 1;
        }
      }
    }
    return truePoints;
  },
  countActivity(ring, outcome, isHomeAttack, ringActivity) {
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
  },
  pickRing(ringFinishedLeft, ringFinishedRight) {
    // implement something to make less random and more based on:
    // exposed, learned, pace, tactics
    if (ringFinishedLeft && ringFinishedRight) {
      return 2;
    } else if (ringFinishedLeft) {
      return matchEngine.roll(2) + 1;
    } else if (ringFinishedRight) {
      return matchEngine.roll(2);
    } else {
      return matchEngine.roll(3);
    }
  },
  updateFighterMatchStats(attacker, defender, outcome) {
    const { att, def } = outcome;
    attacker.match.condition -= att.damage;
    attacker.match.exposed += att.exposed;
    attacker.match.learned += att.learned;
    attacker.match.momentum = att.momentum;
    attacker.match.save = att.save;
    attacker.match.dc = att.dc;

    attacker.match.exposed = matchEngine.stayPercentage(attacker.match.exposed);
    attacker.match.learned = matchEngine.stayPercentage(attacker.match.learned);
    attacker.match.condition = matchEngine.stayPercentage(
      attacker.match.condition
    );

    defender.match.condition -= def.damage;
    defender.match.exposed += def.exposed;
    defender.match.learned += def.learned;
    defender.match.momentum = def.momentum;
    defender.match.save = def.save;
    defender.match.dc = def.dc;

    defender.match.exposed = matchEngine.stayPercentage(defender.match.exposed);
    defender.match.learned = matchEngine.stayPercentage(defender.match.learned);
    defender.match.condition = matchEngine.stayPercentage(
      defender.match.condition
    );
  },
};
