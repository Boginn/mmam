import matchData from '@/data/matchData.js';

class Outcome {
  msg = undefined;

  attackerExposed = 0;
  attackerDamage = 0;
  attackerLearned = 0;
  attackerMomentum = false;
  attackerSave = false;
  attackerDc = false;

  defenderExposed = 0;
  defenderDamage = 0;
  defenderLearned = 0;
  defenderMomentum = false;
  defenderSave = false;
  defenderDc = false;

  disengage = false; // get rid of this

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
      // // console.log(i + " i");
      currentSecond = currentSecond + 2;

      chance = this.roll(happenChance);

      if (chance == happenChance) {
        // console.log('action:');
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

  getClubForm(score) {
    let homeForm, awayForm;

    if (score.home == score.away) {
      homeForm = 'D';
      awayForm = 'D';
    } else if (score.home > score.away) {
      homeForm = 'W';
      awayForm = 'L';
    } else if (score.home < score.away) {
      homeForm = 'L';
      awayForm = 'W';
    }

    return { home: homeForm, away: awayForm };
  },

  //exposed/learned
  getExposedModifier(fighter) {
    return -Math.floor(fighter.match.exposed / 10);
  },
  getLearnedModifier(fighter) {
    return Math.floor(fighter.match.learned / 10);
  },
  processCheck(array, fighter) {
    // console.log(`Processing check:`);
    // console.log(
    //   this.getAverage(array) +
    //     this.getExposedModifier(fighter) +
    //     this.getLearnedModifier(fighter)
    // );
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
    array.push(this.getRollWithMod(fighter.physical.explosiveness));
    array.push(this.getRollWithMod(fighter.physical.acceleration));
    array.push(this.getRollWithMod(fighter.physical.agility));
    return this.processCheck(array, fighter);
  },

  //specific checks (skill)

  //takedown
  singleLegSkillCheckAttack(fighter) {
    var array = [];
    array.push(this.getRollWithMod(fighter.skill.positioning));
    array.push(this.getRollWithMod(fighter.skill.decisions));
    array.push(this.getRollWithMod(fighter.skill.fluidity));
    array.push(this.getRollWithMod(fighter.skill.versatility));

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

  //combo
  oneTwoSkillCheckAttack(fighter) {
    var array = [];
    array.push(this.getRollWithMod(fighter.skill.positioning));
    array.push(this.getRollWithMod(fighter.skill.decisions));
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
  oneTwoThreeSkillCheckAttack(fighter) {
    var array = [];
    array.push(this.getRollWithMod(fighter.skill.decisions));
    array.push(this.getRollWithMod(fighter.skill.footwork));
    array.push(this.getRollWithMod(fighter.skill.sharpness));
    array.push(this.getRollWithMod(fighter.physical.workRate));
    return this.getAverage(array);
  },
  oneTwoThreeSkillCheckDefend(fighter) {
    var array = [];
    array.push(this.getRollWithMod(fighter.skill.positioning));
    array.push(this.getRollWithMod(fighter.skill.footwork));
    array.push(this.getRollWithMod(fighter.skill.anticipation));
    array.push(this.getRollWithMod(fighter.skill.fluidity));

    return this.getAverage(array);
  },
  variousComboSkillCheckAttack(fighter) {
    var array = [];
    array.push(this.getRollWithMod(fighter.skill.positioning));
    array.push(this.getRollWithMod(fighter.skill.decisions));
    array.push(this.getRollWithMod(fighter.skill.footwork));
    array.push(this.getRollWithMod(fighter.skill.sharpness));
    array.push(this.getRollWithMod(fighter.physical.workRate));
    array.push(this.getRollWithMod(fighter.skill.vision));

    return this.getAverage(array);
  },
  variousComboSkillCheckDefend(fighter) {
    var array = [];
    array.push(this.getRollWithMod(fighter.skill.positioning));
    array.push(this.getRollWithMod(fighter.skill.decisions));
    array.push(this.getRollWithMod(fighter.skill.footwork));
    array.push(this.getRollWithMod(fighter.skill.anticipation));
    array.push(this.getRollWithMod(fighter.skill.fluidity));
    array.push(this.getRollWithMod(fighter.physical.workRate));

    return this.getAverage(array);
  },

  //match

  checkInitiative(fighter) {
    //later will make importance of match affect fighter.mental.pressure
    //these mods
    let stamMod = 0;
    let positionMod = 0;
    let workRateMod = 0;

    // console.log(fighter);

    //stamina mod
    if (fighter.condition < 60) {
      stamMod = this.rollTwenty() + this.getModifier(fighter.physical.stamina);
      // console.log(`${stamMod} stam mod`);
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
      // console.log(`${positionMod} pos mod`);
    }
    // work rate mod
    workRateMod =
      this.rollTwenty() + this.getModifier(fighter.physical.workRate);
    // console.log(`${workRateMod} workrate mod`);

    let initiative =
      fighter.match.condition + stamMod + positionMod + workRateMod;
    // console.log(initiative);

    return fighter.match.momentum
      ? this.computedMomentum(fighter) * initiative
      : initiative;
  },

  pickTactic(ring, tactic) {
    const { instructions } = tactic;
    const { left, center, right } = instructions;

    if (ring == 1 && left.mentality && left.risk && left.gamesmanship) {
      tactic = tactic.instructions.left;
    } else if (
      ring == 2 &&
      center.mentality &&
      center.risk &&
      center.gamesmanship
    ) {
      tactic = tactic.instructions.center;
    } else if (
      ring == 3 &&
      right.mentality &&
      right.risk &&
      right.gamesmanship
    ) {
      tactic = tactic.instructions.right;
    } else {
      tactic = tactic.instructions.general;
    }
    return tactic;
  },

  pickMethodAttack(fighter) {
    let method; // returned
    //check gameplan of fighter! later -- could be lists that check against

    //if fighter is exposed he might want to disengage
    const exposedFactor = this.getExposedFactor(fighter);

    const isExposed = this.determineExposedByFactor(exposedFactor);
    if (isExposed) {
      // then DISENGAGE
      matchData.disengage.forEach((element) => {
        if (element.value == 'disengage') {
          method = element;
        }
      });
    }

    //for now base the element picking on type of fighter
    const isStriking = this.determineEngagementByType(fighter);
    isStriking ? console.log(`Striking`) : console.log(`Grappling`);

    if (isStriking) {
      // then PICK TYPE

      // needs to refine
      if (fighter.tactic.closeDistance) {
        //CLOSE DISTANCE
        matchData.engage.closeDistance.forEach((element) => {
          if (element.value == 'strike') {
            // console.log(element);
            method = element;
          }
        });
      } else {
        //STAYOUTSIDE
        matchData.engage.stayOutside.forEach((element) => {
          if (element.value == 'strike') {
            // console.log(element);

            method = element;
          }
        });
      }
      // not striking => grapple
    } else {
      if (fighter.tactic.closeDistance) {
        matchData.engage.closeDistance.forEach((element) => {
          if (element.value == 'grapple') {
            // console.log(element);

            method = element;
          }
        });
      } else {
        matchData.engage.stayOutside.forEach((element) => {
          if (element.value == 'grapple') {
            // console.log(element);

            method = element;
          }
        });
      }
    }

    //
    return method;
  },

  engage(method, attacker, defender) {
    let action;

    // const functionName = `this.${method.value}`;
    // action = eval(functionName)(attacker, defender);
    // won't work, the function doesnt recognize
    // this.variables

    if (method.value == 'grapple') {
      action = this.grapple(attacker, defender);
    } else if (method.value == 'strike') {
      action = this.strike(attacker, defender);
    } else if (method.value == 'disengage') {
      action = this.disengage(attacker, defender);
    }

    return action;
  },

  /*AFTER .engage*/
  grapple(attacker, defender) {
    var action;
    console.log('he');

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
    let action;
    //maybe check fighter pref, gameplan
    let chance = this.roll(2);

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
    let exposedDiscount = 0;
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
    console.log(
      'A disengage() happened (instead of strike or grapple), fighter gained some condition. return Integer'
    );
    return exposedDiscount;
  },

  /*AFTER .engage.grapple*/
  takedown(takedowns, attacker, defender) {
    let action;
    let takedown = takedowns[this.roll(takedowns.length) - 1];

    if (takedown.value == 'singleLeg') {
      action = this.singleLeg(takedown, attacker, defender);
    } else if (takedown.value == 'doubleLeg') {
      ///TODO
      action = this.singleLeg(takedown, attacker, defender);
    } else if (takedown.value == 'hipToss') {
      ///TODO
      action = this.singleLeg(takedown, attacker, defender);
    } else if (takedown.value == 'trip') {
      ///TODO
      action = this.singleLeg(takedown, attacker, defender);
    } else if (takedown.value == 'throw') {
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
    let action;
    let combo = combos[this.roll(combos.length) - 1];

    if (combo.value == 'oneTwo') {
      action = this.oneTwo(combo, attacker, defender);
    } else if (combo.value == 'oneTwoThree') {
      action = this.oneTwoThree(combo, attacker, defender);
    } else if (combo.value == 'variousCombo') {
      action = this.variousCombo(combo, attacker, defender);
    }

    return action;
  },
  single(singles, attacker, defender) {
    var action;
    singles, attacker, defender;
    return action;
  },

  /*FINAL ACTION IN THE CHAIN*/
  /*AFTER .engage.grapple.takedown*/
  singleLeg(action, attacker, defender) {
    let outcome = new Outcome();
    let finalAttack, finalDefend;
    let physicalDC = 10;
    let skillDC = 10;

    // Physical checks
    let attackPhysMod = this.bigActionPhysicalCheck(attacker);
    let defendPhysMod = this.bigActionPhysicalCheck(defender);

    if (this.getDifference(attackPhysMod, defendPhysMod) >= physicalDC) {
      if (attackPhysMod > defendPhysMod) {
        outcome.defenderExposed = outcome.defenderExposed + physicalDC;
        outcome.attackerLearned = outcome.attackerLearned + physicalDC;
      } else {
        outcome.defenderLearned = outcome.defenderLearned + physicalDC;
        outcome.attackerExposed = outcome.attackerExposed + physicalDC;
      }
    } else if (
      this.getDifference(attackPhysMod, defendPhysMod) >=
      physicalDC / 2
    ) {
      if (attackPhysMod > defendPhysMod) {
        outcome.defenderExposed = outcome.defenderExposed + physicalDC / 2;
        outcome.attackerLearned = outcome.attackerLearned + physicalDC / 2;
      } else {
        outcome.defenderLearned = outcome.defenderLearned + physicalDC / 2;
        outcome.attackerExposed = outcome.attackerExposed + physicalDC / 2;
      }
    } else {
      outcome.defenderLearned = outcome.defenderLearned + defendPhysMod;
      outcome.attackerLearned = outcome.attackerLearned + attackPhysMod;
    }

    // Skill checks
    let attackSkillMod = this.singleLegSkillCheckAttack(attacker);
    let defendSkillMod = this.singleLegSkillCheckDefend(defender);

    if (
      this.getRollWithMod(attacker.physical.pace) >=
      this.getRollWithMod(defender.skill.anticipation)
    ) {
      attackSkillMod = attackSkillMod + skillDC;
    } else if (
      this.getRollWithMod(attacker.skill.fluidity) >=
      this.getRollWithMod(defender.skill.versatility)
    ) {
      attackSkillMod = attackSkillMod + skillDC;
    } else {
      defendSkillMod = defendSkillMod + skillDC;
    }

    if (
      this.getRollWithMod(attacker.mental.determination) >=
      this.getRollWithMod(defender.mental.pressure)
    ) {
      attackSkillMod = attackSkillMod + skillDC;
    } else {
      defendSkillMod = defendSkillMod + skillDC;
    }

    // Final outcome
    finalAttack = attackSkillMod + attackPhysMod;
    finalDefend = defendSkillMod + defendPhysMod;

    console.log(finalAttack);
    console.log(finalDefend);

    if (finalAttack >= finalDefend) {
      if (this.getDifference(finalAttack, finalDefend) >= 15) {
        //complete , point, significant, big dc, save true for defender
        outcome.defenderExposed = outcome.defenderExposed + 15;
        outcome.attackerLearned = outcome.attackerLearned + 10;
        outcome.defenderDamage = outcome.defenderDamage + 10 - 7;

        outcome.defenderSave = true;
        outcome.defenderDc = 11 + this.getModifier(attacker.skill.versatility);

        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} lands a devistating ${action.text} on ${defender.nickname}`;
      } else if (this.getDifference(finalAttack, finalDefend) >= 10) {
        //complete, point, significant, save true for defender
        outcome.attackerLearned = outcome.attackerLearned + 5;
        outcome.defenderDamage = outcome.defenderDamage + 4 - 2;

        outcome.defenderSave = true;
        outcome.defenderDc = 8 + this.getModifier(attacker.skill.versatility);

        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} completes a significant ${action.text} on ${defender.nickname}`;
      } else {
        //complete, point
        outcome.attackerLearned = outcome.attackerLearned + 5;
        outcome.defenderDamage = outcome.defenderDamage + 2 - 2;

        outcome.defenderSave = true;
        outcome.defenderDc = 3 + this.getModifier(attacker.skill.versatility);

        outcome.point = true;
        outcome.msg = `${attacker.nickname} barely lands a ${action.text} on ${defender.nickname}`;
      }
    } else {
      if (this.getDifference(finalAttack, finalDefend) >= 15) {
        //not complete, disengage
        outcome.disengage = true;
        outcome.attackerExposed = outcome.attackerExposed + 5;
        outcome.defenderLearned = outcome.defenderLearned + 5;
        outcome.msg = `${attacker.nickname} completely fumbles a ${action.text} attempt on ${defender.nickname}`;
      } else if (this.getDifference(finalAttack, finalDefend) >= 10) {
        //not complete, attacker learns
        outcome.attackerLearned = outcome.attackerLearned + 5;
        outcome.msg = `${attacker.nickname} fails to complete a ${action.text} on ${defender.nickname}`;
      } else {
        //not complete, defender exposed
        outcome.defenderExposed = outcome.defenderExposed + 5;
        outcome.msg = `${attacker.nickname} almost gets the ${action.text} on ${defender.nickname}`;
      }
    }

    // attach
    action = {
      ...action,
      ...outcome,
    };

    return action;
  },

  /*AFTER .engage.strike.combo*/
  oneTwo(action, attacker, defender) {
    let outcome = new Outcome();
    let finalAttack, finalDefend;
    let physicalDC = 5;
    let skillDC = 12;

    // Physical checks
    let attackPhysMod = this.normalMovePhysicalCheck(attacker);
    let defendPhysMod = this.normalMovePhysicalCheck(defender);

    if (this.getDifference(attackPhysMod, defendPhysMod) >= physicalDC) {
      if (attackPhysMod > defendPhysMod) {
        outcome.defenderExposed = outcome.defenderExposed + physicalDC;
        outcome.attackerLearned = outcome.attackerLearned + physicalDC;
      } else {
        outcome.defenderLearned = outcome.defenderLearned + physicalDC;
        outcome.attackerExposed = outcome.attackerExposed + physicalDC;
      }
    } else if (
      this.getDifference(attackPhysMod, defendPhysMod) >=
      physicalDC / 2
    ) {
      if (attackPhysMod > defendPhysMod) {
        outcome.defenderExposed = outcome.defenderExposed + physicalDC / 2;
        outcome.attackerLearned = outcome.attackerLearned + physicalDC / 2;
      } else {
        outcome.defenderLearned = outcome.defenderLearned + physicalDC / 2;
        outcome.attackerExposed = outcome.attackerExposed + physicalDC / 2;
      }
    } else {
      outcome.defenderLearned = outcome.defenderLearned + defendPhysMod;
      outcome.attackerLearned = outcome.attackerLearned + attackPhysMod;
    }

    // Skill checks
    let attackSkillMod = this.oneTwoSkillCheckAttack(attacker);
    let defendSkillMod = this.oneTwoSkillCheckDefend(defender);

    if (
      this.getRollWithMod(attacker.skill.footwork) >=
      this.getRollWithMod(defender.skill.anticipation)
    ) {
      attackSkillMod = attackSkillMod + skillDC;
    } else if (
      this.getRollWithMod(attacker.skill.sharpness) >=
      this.getRollWithMod(defender.skill.versatility)
    ) {
      attackSkillMod = attackSkillMod + skillDC;
    } else {
      defendSkillMod = defendSkillMod + skillDC;
    }

    if (
      this.getRollWithMod(attacker.mental.determination) >=
      this.getRollWithMod(defender.mental.pressure)
    ) {
      attackSkillMod = attackSkillMod + skillDC;
    } else {
      defendSkillMod = defendSkillMod + skillDC;
    }

    // Final outcome
    finalAttack = attackSkillMod + attackPhysMod;
    finalDefend = defendSkillMod + defendPhysMod;

    console.log(finalAttack);
    console.log(finalDefend);

    if (finalAttack >= finalDefend) {
      if (this.getDifference(finalAttack, finalDefend) >= 15) {
        //complete , point, significant, big
        outcome.defenderExposed = outcome.defenderExposed + 10;
        outcome.attackerLearned = outcome.attackerLearned + 5;
        outcome.defenderDamage =
          outcome.defenderDamage + 10 + Math.floor(attacker.body.power / 10);

        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} lands a devistating ${action.text} on ${defender.nickname}`;
      } else if (this.getDifference(finalAttack, finalDefend) >= 10) {
        //complete, point, significant
        outcome.defenderExposed = outcome.defenderExposed + 5;
        outcome.defenderDamage =
          outcome.defenderDamage + 5 + Math.floor(attacker.body.power / 10);

        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} completes a significant ${action.text} on ${defender.nickname}`;
      } else {
        //complete, point
        outcome.attackerLearned = outcome.attackerLearned + 5;
        outcome.defenderDamage =
          outcome.defenderDamage + Math.floor(attacker.body.power / 10);

        outcome.point = true;
        outcome.msg = `${attacker.nickname} barely lands a ${action.text} on ${defender.nickname}`;
      }
    } else {
      if (this.getDifference(finalAttack, finalDefend) >= 15) {
        //not complete, disengage
        outcome.disengage = true;
        outcome.attackerExposed = outcome.attackerExposed + 10;
        outcome.defenderLearned = outcome.defenderLearned + 10;
        outcome.msg = `${attacker.nickname} completely fumbles a ${action.text} attempt on ${defender.nickname}`;
      } else if (this.getDifference(finalAttack, finalDefend) >= 10) {
        //not complete, attacker learns
        outcome.attackerLearned = outcome.attackerLearned + 5;
        outcome.msg = `${attacker.nickname} fails to complete a ${action.text} on ${defender.nickname}`;
      } else {
        //not complete, defender exposed
        outcome.defenderExposed = outcome.defenderExposed + 5;
        outcome.msg = `${attacker.nickname} almost gets the ${action.text} on ${defender.nickname}`;
      }
    }

    // attach
    action = {
      ...action,
      ...outcome,
    };

    return action;
  },

  oneTwoThree(action, attacker, defender) {
    let outcome = new Outcome();
    let finalAttack, finalDefend;
    let physicalDC = 12;
    let skillDC = 16;

    // Physical checks
    let attackPhysMod = this.normalMovePhysicalCheck(attacker);
    let defendPhysMod = this.normalMovePhysicalCheck(defender);

    if (this.getDifference(attackPhysMod, defendPhysMod) >= physicalDC) {
      if (attackPhysMod > defendPhysMod) {
        outcome.defenderExposed = outcome.defenderExposed + physicalDC;
        outcome.attackerLearned = outcome.attackerLearned + physicalDC;
      } else {
        outcome.defenderLearned = outcome.defenderLearned + physicalDC;
        outcome.attackerExposed = outcome.attackerExposed + physicalDC;
      }
    } else if (
      this.getDifference(attackPhysMod, defendPhysMod) >=
      physicalDC / 2
    ) {
      if (attackPhysMod > defendPhysMod) {
        outcome.defenderExposed = outcome.defenderExposed + physicalDC / 2;
        outcome.attackerLearned = outcome.attackerLearned + physicalDC / 2;
      } else {
        outcome.defenderLearned = outcome.defenderLearned + physicalDC / 2;
        outcome.attackerExposed = outcome.attackerExposed + physicalDC / 2;
      }
    } else {
      outcome.defenderLearned = outcome.defenderLearned + defendPhysMod;
      outcome.attackerLearned = outcome.attackerLearned + attackPhysMod;
    }

    // Skill checks
    let attackSkillMod = this.oneTwoThreeSkillCheckAttack(attacker);
    let defendSkillMod = this.oneTwoThreeSkillCheckDefend(defender);

    console.log(attackSkillMod);
    console.log(defendSkillMod);

    if (
      this.getRollWithMod(attacker.skill.footwork) >=
      this.getRollWithMod(defender.skill.anticipation)
    ) {
      attackSkillMod = attackSkillMod + skillDC;
    } else if (
      this.getRollWithMod(attacker.skill.sharpness) >=
      this.getRollWithMod(defender.skill.versatility)
    ) {
      attackSkillMod = attackSkillMod + skillDC;
    } else {
      defendSkillMod = defendSkillMod + skillDC;
    }

    if (
      this.getRollWithMod(attacker.mental.determination) >=
      this.getRollWithMod(defender.mental.pressure)
    ) {
      attackSkillMod = attackSkillMod + skillDC;
    } else {
      defendSkillMod = defendSkillMod + skillDC;
    }

    // Final outcome
    finalAttack = attackSkillMod + attackPhysMod;
    finalDefend = defendSkillMod + defendPhysMod;

    console.log(finalAttack);
    console.log(finalDefend);

    if (finalAttack >= finalDefend) {
      if (this.getDifference(finalAttack, finalDefend) >= 17) {
        //complete , point, significant, big
        outcome.defenderExposed = outcome.defenderExposed + 12;
        outcome.attackerLearned = outcome.attackerLearned + 7;
        outcome.defenderDamage =
          outcome.defenderDamage + 12 + Math.floor(attacker.body.power / 10);

        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} lands a devistating ${action.text} on ${defender.nickname}`;
      } else if (this.getDifference(finalAttack, finalDefend) >= 14) {
        //complete, point, significant
        outcome.defenderExposed = outcome.defenderExposed + 7;
        outcome.defenderDamage =
          outcome.defenderDamage + 7 + Math.floor(attacker.body.power / 10);

        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} completes a significant ${action.text} on ${defender.nickname}`;
      } else {
        //complete, point
        outcome.attackerLearned = outcome.attackerLearned + 5;
        outcome.defenderDamage =
          outcome.defenderDamage + 2 + Math.floor(attacker.body.power / 10);

        outcome.point = true;
        outcome.msg = `${attacker.nickname} barely lands a ${action.text} on ${defender.nickname}`;
      }
    } else {
      if (this.getDifference(finalAttack, finalDefend) >= 17) {
        //not complete, disengage
        outcome.disengage = true;
        outcome.attackerExposed = outcome.attackerExposed + 12;
        outcome.defenderLearned = outcome.defenderLearned + 12;
        outcome.msg = `${attacker.nickname} completely fumbles a ${action.text} attempt on ${defender.nickname}`;
      } else if (this.getDifference(finalAttack, finalDefend) >= 14) {
        //not complete, attacker learns
        outcome.attackerLearned = outcome.attackerLearned + 5;
        outcome.msg = `${attacker.nickname} fails to complete a ${action.text} on ${defender.nickname}`;
      } else {
        //not complete, defender exposed
        outcome.defenderExposed = outcome.defenderExposed + 5;
        outcome.msg = `${attacker.nickname} almost gets the ${action.text} on ${defender.nickname}`;
      }
    }

    // attach
    action = {
      ...action,
      ...outcome,
    };

    return action;
  },

  variousCombo(action, attacker, defender) {
    let outcome = new Outcome();
    let finalAttack, finalDefend;
    let physicalDC = this.rollTwenty();
    let skillDC = this.rollTwenty();
    console.log(physicalDC);
    console.log(skillDC);

    // Physical checks
    let attackPhysMod = this.normalMovePhysicalCheck(attacker);
    let defendPhysMod = this.normalMovePhysicalCheck(defender);

    if (this.getDifference(attackPhysMod, defendPhysMod) >= physicalDC) {
      if (attackPhysMod > defendPhysMod) {
        outcome.defenderExposed = outcome.defenderExposed + physicalDC;
        outcome.attackerLearned = outcome.attackerLearned + physicalDC;
      } else {
        outcome.defenderLearned = outcome.defenderLearned + physicalDC;
        outcome.attackerExposed = outcome.attackerExposed + physicalDC;
      }
    } else if (
      this.getDifference(attackPhysMod, defendPhysMod) >=
      physicalDC / 2
    ) {
      if (attackPhysMod > defendPhysMod) {
        outcome.defenderExposed = outcome.defenderExposed + physicalDC / 2;
        outcome.attackerLearned = outcome.attackerLearned + physicalDC / 2;
      } else {
        outcome.defenderLearned = outcome.defenderLearned + physicalDC / 2;
        outcome.attackerExposed = outcome.attackerExposed + physicalDC / 2;
      }
    } else {
      outcome.defenderLearned = outcome.defenderLearned + defendPhysMod;
      outcome.attackerLearned = outcome.attackerLearned + attackPhysMod;
    }

    // Skill checks
    let attackSkillMod = this.variousComboSkillCheckAttack(attacker);
    let defendSkillMod = this.variousComboSkillCheckDefend(defender);

    console.log(attackSkillMod);
    console.log(defendSkillMod);

    if (
      this.getRollWithMod(attacker.skill.footwork) >=
      this.getRollWithMod(defender.skill.anticipation)
    ) {
      attackSkillMod = attackSkillMod + skillDC;
    } else if (
      this.getRollWithMod(attacker.skill.sharpness) >=
      this.getRollWithMod(defender.skill.versatility)
    ) {
      attackSkillMod = attackSkillMod + skillDC;
    } else {
      defendSkillMod = defendSkillMod + skillDC;
    }

    if (
      this.getRollWithMod(attacker.mental.determination) >=
      this.getRollWithMod(defender.mental.pressure)
    ) {
      attackSkillMod = attackSkillMod + skillDC;
    } else {
      defendSkillMod = defendSkillMod + skillDC;
    }

    // Final outcome
    finalAttack = attackSkillMod + attackPhysMod;
    finalDefend = defendSkillMod + defendPhysMod;

    console.log(finalAttack);
    console.log(finalDefend);

    if (finalAttack >= finalDefend) {
      if (this.getDifference(finalAttack, finalDefend) >= 17) {
        //complete , point, significant, big
        outcome.defenderExposed = outcome.defenderExposed + 12;
        outcome.attackerLearned = outcome.attackerLearned + 7;

        outcome.defenderDamage =
          outcome.defenderDamage +
          Math.floor((this.roll(physicalDC) + this.roll(skillDC)) / 2) +
          Math.floor(attacker.body.power / 10);

        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} lands a devistating ${action.text} on ${defender.nickname}`;
      } else if (this.getDifference(finalAttack, finalDefend) >= 14) {
        //complete, point, significant
        outcome.defenderExposed = outcome.defenderExposed + 7;
        outcome.defenderDamage =
          outcome.defenderDamage +
          Math.floor((this.roll(physicalDC) + this.roll(skillDC)) / 4) +
          Math.floor(attacker.body.power / 10);

        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} completes a significant ${action.text} on ${defender.nickname}`;
      } else {
        //complete, point
        outcome.attackerLearned = outcome.attackerLearned + 5;
        outcome.defenderDamage =
          outcome.defenderDamage + Math.floor(attacker.body.power / 10);

        outcome.point = true;
        outcome.msg = `${attacker.nickname} barely lands a ${action.text} on ${defender.nickname}`;
      }
    } else {
      if (this.getDifference(finalAttack, finalDefend) >= 17) {
        //not complete, disengage
        outcome.disengage = true;
        outcome.attackerExposed = outcome.attackerExposed + 12;
        outcome.defenderLearned = outcome.defenderLearned + 12;
        outcome.msg = `${attacker.nickname} completely fumbles a ${action.text} attempt on ${defender.nickname}`;
      } else if (this.getDifference(finalAttack, finalDefend) >= 14) {
        //not complete, attacker learns
        outcome.attackerLearned = outcome.attackerLearned + 5;
        outcome.msg = `${attacker.nickname} fails to complete a ${action.text} on ${defender.nickname}`;
      } else {
        //not complete, defender exposed
        outcome.defenderExposed = outcome.defenderExposed + 5;
        outcome.msg = `${attacker.nickname} almost gets the ${action.text} on ${defender.nickname}`;
      }
    }

    // attach
    action = {
      ...action,
      ...outcome,
    };

    return action;
  },

  //fighter things

  determineEngagementByType(fighter) {
    //true is striker, false is grappler

    // if (fighter.type.grappler >= 70) {
    //   return false;
    // } else if (fighter.type.striker >= 70) {
    //   return true;
    // } else {
    //   return this.roll(fighter.type.grappler) > this.roll(fighter.type.striker)
    //     ? false //grappler
    //     : true; //striker
    // }

    //just rolls against stat (0-100)
    return this.roll(fighter.type.grappler) > this.roll(fighter.type.striker)
      ? false //grappler
      : true; //striker
  },
  determineExposedByFactor(fighter, factor) {
    return fighter.exposed > factor ? true : false;
  },

  //simulate
};
