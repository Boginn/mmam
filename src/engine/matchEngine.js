import matchData from "@/data/matchData.js";

class Outcome {
  msg = undefined;
  attackerExposed = 0;
  defenderExposed = 0;
  attackerDamage = 0;
  defenderDamage = 0;
  attackerLearned = 0;
  defenderLearned = 0;
  attackerMomentum = false;
  defenderMomentum = false;
  disengage = false;
  point = false;
  significant = false;
}

export default {
  //services
  getArchivedMatchBlueprint(id) {
    return new matchData.ArchivedMatch(parseInt(id) + 100000);
  },
  rollEvent(currentSecond, happenChance) {
    var chance;

    for (let i = currentSecond; i < 59; i = i + 2) {
      // console.log(i + " i");
      currentSecond = currentSecond + 2;

      chance = this.roll(happenChance);

      if (chance == happenChance) {
        console.log("action:");
        return currentSecond;
      }
    }

    return currentSecond;
  },
  roll(number) {
    return Math.floor(Math.random() * number) + 1;
  },
  rollTwenty() {
    var result = Math.floor(Math.random() * 20) + 1;
    return result;
  },
  rollHundred() {
    var result = Math.floor(Math.random() * 100) + 1;
    return result;
  },
  getDifficultyCheck(modifier) {
    return 10 + modifier;
  },
  getModifier(attr) {
    return Math.floor((attr - 10) / 2);
  },
  getRollWithMod(attr) {
    return this.rollTwenty() + this.getModifier(attr);
  },
  getFlooredToHundred(number) {
    return number > 100 ? 100 : number;
  },
  getAverage(array) {
    var result = 0;
    array.forEach((element) => {
      result += element;
    });
    return Math.floor(result / array.length);
  },
  getDifference(a, b) {
    return Math.abs(a - b);
  },


  //judging
  scoreRounds(judges, rounds) {
    var judgesTally = [];
    var judgesCard = [];
    judges.forEach((judge) => {
      // importance of match judge.mental.pressure

      var concentration = this.getRollWithMod(judge.judging.concentration);
      var judgement = this.getRollWithMod(judge.judging.judgement);
      var retention = this.getRollWithMod(judge.judging.retention);
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
          if (this.getRollWithMod(judge.judging.concentration) >= 6) {
            result.home += 1;
          }
        }
        for (let j = 0; j < rounds[i].homeSignificant; j++) {
          if (this.getRollWithMod(judge.judging.concentration) >= 6) {
            if (this.getRollWithMod(judge.judging.judgement) >= 10) {
              result.homeSignificant += 1;
            } else {
              result.home += 1;
            }
          }
        }
        for (let j = 0; j < rounds[i].away; j++) {
          if (this.getRollWithMod(judge.judging.concentration) >= 6) {
            result.away += 1;
          }
        }
        for (let j = 0; j < rounds[i].awaySignificant; j++) {
          if (this.getRollWithMod(judge.judging.concentration) >= 6) {
            if (this.getRollWithMod(judge.judging.judgement) >= 10) {
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
    console.log(judgesTally);
    console.log(judgesCard);

    console.log(rounds);
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

    if (this.getDifference(round.home, round.away) > 50) {
      console.log(round.home);
      console.log(round.away);
      console.log("true");
      if (isHomeWin) {
        round.home = 10;
        round.away = 7;
      } else {
        round.home = 7;
        round.away = 10;
      }
    } else if (this.getDifference(round.home, round.away) > 25) {
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

  //exposed/learned
  getExposedModifier(fighter) {
    return -Math.floor(fighter.match.exposed / 10);
  },
  getLearnedModifier(fighter) {
    return Math.floor(fighter.match.learned / 10);
  },
  processCheck(array, fighter) {
    console.log(`Processing check:`);
    console.log(
      this.getAverage(array) +
        this.getExposedModifier(fighter) +
        this.getLearnedModifier(fighter)
    );
    return (
      this.getAverage(array) +
      this.getExposedModifier(fighter) +
      this.getLearnedModifier(fighter)
    );
  },
  //mechanics from fighter attributes
  computedMomentum(fighter) {
    //hm!}
    var momentum = 0;

    //tactics
    if (fighter.tactic.instructions.gamesmanship == 1) {
      // if CLEAN
      if (
        this.rollTwenty() + this.getModifier(fighter.mental.sportsmanship) >=
        10
      ) {
        momentum = momentum + 10;
      } else {
        momentum = momentum - 10;
      }
    } else if (fighter.tactic.instructions.gamesmanship == 3) {
      // if DIRTY
      if (
        this.rollTwenty() + this.getModifier(fighter.mental.dirtiness) >=
        10
      ) {
        momentum = momentum + 10;
      } else {
        momentum = momentum - 10;
      }
    } else {
      // if NEUTRAL
      momentum = momentum + 5;
    }

    //attributes
    if (
      this.rollTwenty() + this.getModifier(fighter.mental.adaptability) >=
      15
    ) {
      momentum = momentum + 5;
    }

    if (this.rollTwenty() + this.getModifier(fighter.mental.ambition) >= 15) {
      momentum = momentum + 5;
    }

    if (this.rollTwenty() + this.getModifier(fighter.physical.flair) >= 15) {
      momentum = momentum + 5;
    }

    if (
      this.rollTwenty() + this.getModifier(fighter.mental.determination) >=
      15
    ) {
      momentum = momentum + 5;
    }

    if (this.rollTwenty() + this.getModifier(fighter.skill.sharpness) >= 15) {
      momentum = momentum + 5;
    }

    return momentum < 0 ? 1 : momentum * 0.01 + 1;
  },
  getExposedFactor(fighter) {
    let exposedFactor;
    if (fighter.tactic.instructions.risk == 1) {
      // if SAFE
      exposedFactor = 40;
    } else if (fighter.tactic.instructions.risk == 3) {
      // if RECKLESS
      exposedFactor = 80;
    } else {
      // if NORMAL
      exposedFactor = 60;
    }
    return exposedFactor;
  },

  //checks (physical)
  normalMovePhysicalCheck(fighter) {
    var array = [];
    array.push(this.getRollWithMod(fighter.physical.pace));
    array.push(this.getRollWithMod(fighter.physical.acceleration));
    array.push(this.getRollWithMod(fighter.physical.agility));
    return this.processCheck(array, fighter);
  },
  bigActionPhysicalCheck(fighter) {
    var array = [];
    array.push(this.getRollWithMod(fighter.physical.strength));
    array.push(this.getRollWithMod(fighter.physical.strength));
    array.push(this.getRollWithMod(fighter.physical.acceleration));
    array.push(this.getRollWithMod(fighter.physical.agility));
    return this.processCheck(array, fighter);
  },

  //specific checks (skill)
  singleLegSkillCheckAttack(fighter) {
    var array = [];
    array.push(this.getRollWithMod(fighter.skill.positioning));
    array.push(this.getRollWithMod(fighter.skill.decisions));
    array.push(this.getRollWithMod(fighter.skill.fluidity));
    array.push(this.getRollWithMod(fighter.skill.sharpness));

    return this.getAverage(array);
  },
  singleLegSkillCheckDefend(fighter) {
    var array = [];
    array.push(this.getRollWithMod(fighter.skill.positioning));
    array.push(this.getRollWithMod(fighter.skill.decisions));
    array.push(this.getRollWithMod(fighter.skill.versatility));
    array.push(this.getRollWithMod(fighter.skill.anticipation));

    return this.getAverage(array);
  },
  oneTwoSkillCheckAttack(fighter) {
    var array = [];
    array.push(this.getRollWithMod(fighter.skill.positioning));
    array.push(this.getRollWithMod(fighter.skill.versatility));
    array.push(this.getRollWithMod(fighter.skill.footwork));
    array.push(this.getRollWithMod(fighter.skill.sharpness));

    return this.getAverage(array);
  },
  oneTwoSkillCheckDefend(fighter) {
    var array = [];
    array.push(this.getRollWithMod(fighter.skill.positioning));
    array.push(this.getRollWithMod(fighter.skill.decisions));
    array.push(this.getRollWithMod(fighter.skill.footwork));
    array.push(this.getRollWithMod(fighter.skill.anticipation));

    return this.getAverage(array);
  },

  //match

  checkInitiative(fighter) {
    //later will make importance of match affect fighter.mental.pressure

    //these mods
    var stamMod = 0;
    var positionMod = 0;
    var workRateMod = 0;

    //stamina mod
    if (fighter.condition < 60) {
      stamMod = this.rollTwenty() + this.getModifier(fighter.physical.stamina);
      console.log(`${stamMod} stam mod`);
    }
    //vision check for position mod
    var visionCheck =
      this.rollTwenty() + this.getModifier(fighter.skill.vision);
    if (visionCheck > 10) {
      var positioningCheck =
        this.rollTwenty() + this.getModifier(fighter.skill.positioning);
      var accelerationCheck =
        this.rollTwenty() + this.getModifier(fighter.physical.acceleration);
      var average = Math.floor((positioningCheck * 2 + accelerationCheck) / 3);
      positionMod = this.rollTwenty() + this.getModifier(average);
      console.log(`${positionMod} pos mod`);
    }
    // work rate mod
    workRateMod =
      this.rollTwenty() + this.getModifier(fighter.physical.workRate);
    console.log(`${workRateMod} workrate mod`);

    var initiative =
      fighter.match.condition + stamMod + positionMod + workRateMod;
    console.log(initiative);

    return fighter.match.momentum
      ? this.computedMomentum(fighter) * initiative
      : initiative;
  },

  pickMethodAttack(fighter) {

    let method;
    //check gameplan of fighter! later -- could be lists that check against

    //if fighter is exposed he might want to disengage
    let exposedFactor = this.getExposedFactor(fighter);

    let isExposed = this.determineExposedByFactor(exposedFactor);
    if (isExposed) {
      // then DISENGAGE
      matchData.disengage.forEach((element) => {
        if (element.value == "disengage") {
          method = element;
        }
      });
    }

    //for now base the element picking on type of fighter
    let isStriking = this.determineEngagementByType(fighter);
    isStriking ? console.log(`Striking`) : console.log(`Grappling`);

    if (isStriking) {
      // then PICK TYPE

      // needs to refine
      if (fighter.tactic.closeDistance) {
        //CLOSE DISTANCE
        matchData.engage.closeDistance.forEach((element) => {
          if (element.value == "strike") {
            console.log(element);
            method = element;
          }
        });
      } else {
        //STAYOUTSIDE
        matchData.engage.stayOutside.forEach((element) => {
          if (element.value == "strike") {
            console.log(element);

            method = element;
          }
        });
      }
    } else {
      // not striking => grapple
      matchData.engage.closeDistance.forEach((element) => {
        if (element.value == "grapple") {
          console.log(element);

          method = element;
        }
      });
    }

    //
    return method;
  },

  engage(method, attacker, defender) {
    let action;

    // eval(method.value(attacker, defender)) // like dis

    if (method.value == "grapple") {
      action = this.grapple(attacker, defender);
    } else if (method.value == "strike") {
      action = this.strike(attacker, defender);
      // action = this.strike(attacker, defender);
    } else if (method.value == "disengage") {
      action = this.grapple(attacker, defender);
      // action = this.disengage(attacker, defender);
    }

    return action;
  },

  /*AFTER .engage*/
  grapple(attacker, defender) {
    var action;

    //maybe check fighter pref, gameplan
    var chance = this.roll(2);

    if (chance == 1) {
      action = this.takedown(matchData.grapple.takedown, attacker, defender);
    } else {
      action = this.takedown(matchData.grapple.takedown, attacker, defender);
      // action = matchData.grapple.clinch;
    }

    return action;
  },
  strike(attacker, defender) {
    var action;
    //maybe check fighter pref, gameplan
    var chance = this.roll(2);

    if (chance == 1) {
      action = this.combo(matchData.strike.combo, attacker, defender);
    } else {
      action = this.combo(matchData.strike.combo, attacker, defender);
      // action = matchData.strike.single;
      // action = matchData.strike.feel;
      // action = matchData.strike.stall;
      // action = matchData.strike.bait;
    }

    return action;
  },
  disengage(fighter) {
    //award less exposed for disengaging
    var exposedDiscount = 0;
    if (this.getRollWithMod(fighter.mental.adaptability) >= 10) {
      exposedDiscount += this.roll(10);
    }
    if (this.getRollWithMod(fighter.physical.stamina) >= 10) {
      exposedDiscount += this.roll(5);
    }
    if (this.getRollWithMod(fighter.physical.workRate) >= 10) {
      exposedDiscount += this.roll(5);
    }
    if (this.getRollWithMod(fighter.skill.versatility) >= 10) {
      exposedDiscount += this.roll(10);
    }
    exposedDiscount += Math.floor(fighter.match.condition / 10);
    return exposedDiscount;
  },

  /*AFTER .engage.grapple*/
  takedown(takedowns, attacker, defender) {
    var action;
    var takedown = takedowns[this.roll(takedowns.length) - 1];

    if (takedown.value == "singleLeg") {
      action = this.singleLeg(takedown, attacker, defender);
    } else if (takedown.value == "doubleLeg") {
      ///TODO
      action = this.singleLeg(takedown, attacker, defender);
    } else if (takedown.value == "hipToss") {
      ///TODO
      action = this.singleLeg(takedown, attacker, defender);
    } else if (takedown.value == "trip") {
      ///TODO
      action = this.singleLeg(takedown, attacker, defender);
    } else if (takedown.value == "throw") {
      ///TODO
      action = this.singleLeg(takedown, attacker, defender);
    } else {
      action = this.singleLeg(takedown, attacker, defender);
    }

    return action;
  },
  clinch(clinches, attacker, defender) {
    var action;
    // var takedown = takedowns[this.roll(takedowns.length)-1];

    // if (takedown.value == "singleLeg") {
    //   action = this.singleLeg(takedown, attacker, defender);
    // } else if (takedown.value == "doubleLeg") {
    //   ///TODO
    //   action = this.singleLeg(takedown, attacker, defender);
    // } else if (takedown.value == "hipToss") {
    //   ///TODO
    //   action = this.singleLeg(takedown, attacker, defender);
    // } else if (takedown.value == "trip") {
    //   ///TODO
    //   action = this.singleLeg(takedown, attacker, defender);
    // } else if (takedown.value == "throw") {
    //   ///TODO
    //   action = this.singleLeg(takedown, attacker, defender);
    // } else {

    //   action = this.singleLeg(takedown, attacker, defender);
    // }
    clinches, attacker, defender;
    return action;
  },

  /*AFTER .engage.strike*/

  combo(combos, attacker, defender) {
    var action;
    var combo = combos[this.roll(combos.length) - 1];

    if (combo.value == "oneTwo") {
      action = this.oneTwo(combo, attacker, defender);
    } else if (combo.value == "oneTwoThree") {
      ///TODO
      action = this.oneTwo(combo, attacker, defender);
    } else if (combo.value == "various") {
      ///TODO
      action = this.oneTwo(combo, attacker, defender);
    } else {
      action = this.oneTwo(combo, attacker, defender);
    }

    return action;
  },
  single(singles, attacker, defender) {
    var action;
    singles, attacker, defender;
    return action;
  },

  /*AFTER .engage.grapple.takedown*/
  singleLeg(action, attacker, defender) {
    var outcome = new Outcome();
    var finalAttack, finalDefend;

    // Physical checks
    var attackPhysMod = this.bigActionPhysicalCheck(attacker);
    var defendPhysMod = this.bigActionPhysicalCheck(defender);

    if (this.getDifference(attackPhysMod, defendPhysMod) >= 10) {
      if (attackPhysMod > defendPhysMod) {
        //complete + defender damaged and very exposed
        outcome.defenderDamage = outcome.defenderDamage + 25;
        outcome.defenderExposed = outcome.defenderExposed + 20;
        outcome.attackerLearned = outcome.attackerLearned + 10;
        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} lands a devistating ${action.text} on ${defender.nickname}`;
      } else {
        //no complete + attacker exposed + disengage
        outcome.disengage = true;
        outcome.attackerExposed = outcome.attackerExposed + 5;
        outcome.msg = `${attacker.nickname} completely fumbles a ${action.text} attempt on ${defender.nickname}`;
      }
    } else if (this.getDifference(attackPhysMod, defendPhysMod) >= 5) {
      if (attackPhysMod > defendPhysMod) {
        //gets good modifier for continuation
        attackPhysMod = attackPhysMod + 10;
      } else {
        // same
        defendPhysMod = defendPhysMod + 10;
      }
    } else {
      if (attackPhysMod > defendPhysMod) {
        //gets difference as modifier for continuation
        attackPhysMod =
          attackPhysMod + this.getDifference(attackPhysMod, defendPhysMod);
      } else {
        // same
        defendPhysMod =
          defendPhysMod + this.getDifference(attackPhysMod, defendPhysMod);
      }
    }

    // Skill checks
    var attackSkillMod = this.singleLegSkillCheckAttack(attacker);
    var defendSkillMod = this.singleLegSkillCheckDefend(defender);

    if (
      this.getRollWithMod(attacker.physical.pace) >=
      this.getRollWithMod(defender.skill.anticipation)
    ) {
      attackSkillMod = attackSkillMod + 5;
    } else if (
      this.getRollWithMod(attacker.skill.fluidity) >=
      this.getRollWithMod(defender.skill.versatility)
    ) {
      attackSkillMod = attackSkillMod + 10;
    } else if (
      this.getRollWithMod(attacker.mental.determination) >=
      this.getRollWithMod(defender.mental.pressure)
    ) {
      attackSkillMod = attackSkillMod + 10;
    } else {
      defendSkillMod = defendSkillMod + 15;
    }

    finalAttack = attackSkillMod + attackPhysMod;
    finalDefend = defendSkillMod + defendPhysMod;

    console.log(finalAttack);
    console.log(finalDefend);

    if (finalAttack >= finalDefend) {
      if (this.getDifference(finalAttack, finalDefend) >= 8) {
        //complete + defender exposed
        outcome.defenderExposed = outcome.defenderExposed + 15;
        outcome.attackerLearned = outcome.attackerLearned + 5;
        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} completes a significant ${action.text} on ${defender.nickname}`;
      } else {
        //complete
        outcome.attackerLearned = outcome.attackerLearned + 5;

        outcome.point = true;
        outcome.msg = `${attacker.nickname} completes a ${action.text} on ${defender.nickname}`;
      }
    } else {
      if (this.getDifference(finalAttack, finalDefend) >= 8) {
        //not complete + disengage
        outcome.defenderLearned = outcome.defenderLearned + 5;
        outcome.msg = `${attacker.nickname} fails to complete a ${action.text} on ${defender.nickname}`;
      } else {
        //not complete + defender exposed
        outcome.defenderExposed = outcome.defenderExposed + 5;
        outcome.msg = `${attacker.nickname} almost gets the ${action.text} on ${defender.nickname}`;
      }
    }

    // attach msg

    action = {
      ...action,
      ...outcome,
    };

    return action;
  },

  /*AFTER .engage.strike.combo*/
  oneTwo(action, attacker, defender) {
    var outcome = new Outcome();
    var finalAttack, finalDefend;

    // Physical checks
    var attackPhysMod = this.normalMovePhysicalCheck(attacker);
    var defendPhysMod = this.normalMovePhysicalCheck(defender);

    if (this.getDifference(attackPhysMod, defendPhysMod) >= 10) {
      if (attackPhysMod > defendPhysMod) {
        //complete + defender damaged and very exposed
        outcome.defenderDamage = outcome.defenderDamage + 1;
        outcome.defenderExposed = outcome.defenderExposed + 25;
        outcome.attackerLearned = outcome.attackerLearned + 10;
        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} lands a devistating ${action.text} on ${defender.nickname}`;
      } else {
        //no complete + attacker exposed + disengage
        outcome.disengage = true;
        outcome.attackerExposed = outcome.attackerExposed + 10;
        outcome.msg = `${attacker.nickname} completely fumbles a ${action.text} attempt on ${defender.nickname}`;
      }
    } else if (this.getDifference(attackPhysMod, defendPhysMod) >= 5) {
      if (attackPhysMod > defendPhysMod) {
        //gets good modifier for continuation
        attackPhysMod = attackPhysMod + 10;
      } else {
        // same
        defendPhysMod = defendPhysMod + 10;
      }
    } else {
      if (attackPhysMod > defendPhysMod) {
        //gets difference as modifier for continuation
        attackPhysMod =
          attackPhysMod + this.getDifference(attackPhysMod, defendPhysMod);
      } else {
        // same
        defendPhysMod =
          defendPhysMod + this.getDifference(attackPhysMod, defendPhysMod);
      }
    }

    // Skill checks
    var attackSkillMod = this.oneTwoSkillCheckAttack(attacker);
    var defendSkillMod = this.oneTwoSkillCheckDefend(defender);

    finalAttack = attackSkillMod + attackPhysMod;
    finalDefend = defendSkillMod + defendPhysMod;

    console.log(finalAttack);
    console.log(finalDefend);

    if (finalAttack >= finalDefend) {
      if (this.getDifference(finalAttack, finalDefend) >= 8) {
        //complete + defender exposed
        outcome.defenderExposed = outcome.defenderExposed + 10;
        outcome.attackerLearned = outcome.attackerLearned + 10;
        outcome.defenderDamage = outcome.defenderDamage + 100;
        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} completes a significant ${action.text} on ${defender.nickname}`;
      } else {
        //complete
        outcome.defenderExposed = outcome.defenderExposed + 5;
        outcome.defenderDamage = outcome.defenderDamage + 50;

        outcome.point = true;
        outcome.msg = `${attacker.nickname} completes a ${action.text} on ${defender.nickname}`;
      }
    } else {
      if (this.getDifference(finalAttack, finalDefend) >= 8) {
        //not complete + disengage
        outcome.defenderLearned = outcome.defenderLearned + 15;
        outcome.attackerExposed = outcome.attackerExposed + 5;
        outcome.defenderDamage = outcome.defenderDamage + 4;
        outcome.disengage = true;
        outcome.msg = `${attacker.nickname} fails to complete a ${action.text} on ${defender.nickname}`;
      } else {
        //not complete + defender exposed
        outcome.defenderExposed = outcome.defenderExposed + 5;
        outcome.attackerDamage = outcome.attackerDamage + 2;
        outcome.msg = `${attacker.nickname} almost gets the ${action.text} on ${defender.nickname}`;
      }
    }

    // attach msg

    action = {
      ...action,
      ...outcome,
    };

    return action;
  },
  //fighter things]

  determineEngagementByType(fighter) {
    //true is striker, false is grappler
    if (fighter.type.grappler >= 70) {
      return false;
    } else if (fighter.type.striker >= 70) {
      return true;
    } else {
      return this.roll(fighter.type.grappler) > this.roll(fighter.type.striker)
        ? false //grappler
        : true; //striker
    }
  },
  determineExposedByFactor(fighter, factor) {
    return fighter.exposed > factor ? true : false;
  },
};
