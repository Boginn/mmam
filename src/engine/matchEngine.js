import matchData from '@/data/matchData.js';
import classes from '@/data/classes.js';
import { singleLeg } from '@/engine/actions/grapple/';

export default {
  //services
  // getArchivedMatchBlueprint(id) {
  //   return new matchData.ArchivedMatch(parseInt(id) + 100000);
  // },
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
    let roll = this.rollTwenty() + this.getModifier(attr);
    return roll <= 0 ? 1 : roll;
  },
  stayPercentage(number) {
    if (number > 100) {
      return 100;
    }
    if (number < 0) {
      return 0;
    }
    return number;
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
    if (fighter.tactic.instructions.risk == 1) {
      // if SAFE
      return 35;
    } else if (fighter.tactic.instructions.risk == 2) {
      // if NORMAL
      return 70;
    } else {
      // if RECKLESS
      return 100;
    }
  },
  getHurtFactor(fighter) {
    if (fighter.tactic.instructions.mentality == 1) {
      // if CONTAIN
      return 60;
    } else if (fighter.tactic.instructions.mentality == 2) {
      // if DEFEND
      return 40;
    } else {
      // if ATTACK
      return 1;
    }
  },
  checkCondition(fighter) {
    let result = { finished: false, msg: undefined };
    if (fighter.match.condition <= 0) {
      result.finished = true;
      result.msg = `That's enough for ${fighter.nickname}. He's finished!`;
    }
    return result;
  },

  //checks (physical)
  normalActionPhysicalCheck(fighter) {
    let array = [];
    array.push(this.getRollWithMod(fighter.physical.pace));
    array.push(this.getRollWithMod(fighter.physical.acceleration));
    array.push(this.getRollWithMod(fighter.physical.agility));
    return this.processCheck(array, fighter);
  },
  bigActionPhysicalCheck(fighter) {
    let array = [];
    array.push(this.getRollWithMod(fighter.physical.strength));
    array.push(this.getRollWithMod(fighter.physical.explosiveness));
    array.push(this.getRollWithMod(fighter.physical.acceleration));
    array.push(this.getRollWithMod(fighter.physical.agility));
    return this.processCheck(array, fighter);
  },
  flashyActionPhysicalCheck(fighter) {
    let array = [];
    array.push(this.getRollWithMod(fighter.physical.flair));
    array.push(this.getRollWithMod(fighter.physical.explosiveness));
    array.push(this.getRollWithMod(fighter.physical.acceleration));
    array.push(this.getRollWithMod(fighter.physical.agility));
    array.push(this.getRollWithMod(fighter.mental.ambition));
    return this.processCheck(array, fighter);
  },

  //checks (mental)
  hurtMentalCheck(fighter) {
    let array = [];
    array.push(this.getRollWithMod(fighter.mental.pressure));
    array.push(this.getRollWithMod(fighter.mental.temperement));
    array.push(this.getRollWithMod(fighter.mental.professionalism));
    array.push(this.getRollWithMod(fighter.mental.determination));
    return this.processCheck(array, fighter);
  },
  exposedMentalCheck(fighter) {
    let array = [];
    array.push(this.getRollWithMod(fighter.mental.adaptability));
    array.push(this.getRollWithMod(fighter.mental.professionalism));
    array.push(this.getRollWithMod(fighter.mental.sportsmanship));
    return this.processCheck(array, fighter);
  },

  //disengage check
  disengageCheck(fighter) {
    let array = [];
    let prefStat = [];

    prefStat.push(this.getRollWithMod(fighter.physical.explosiveness));
    prefStat.push(this.getRollWithMod(fighter.physical.strength));
    prefStat.push(this.getRollWithMod(fighter.skill.positioning));
    prefStat.push(this.getRollWithMod(fighter.skill.decisions));
    console.log(prefStat);
    array.push(Math.max(...prefStat));
    console.log(array);

    array.push(this.getRollWithMod(fighter.mental.adaptability));

    return this.processCheck(array, fighter);
  },

  //specific checks (skill)

  //combo
  oneTwoSkillCheckAttack(fighter) {
    let array = [];
    array.push(this.getRollWithMod(fighter.skill.positioning));
    array.push(this.getRollWithMod(fighter.skill.decisions));
    array.push(this.getRollWithMod(fighter.skill.footwork));
    array.push(this.getRollWithMod(fighter.skill.sharpness));

    return this.processCheck(array, fighter);
  },
  oneTwoSkillCheckDefend(fighter) {
    let array = [];
    array.push(this.getRollWithMod(fighter.skill.positioning));
    array.push(this.getRollWithMod(fighter.skill.decisions));
    array.push(this.getRollWithMod(fighter.skill.footwork));
    array.push(this.getRollWithMod(fighter.skill.anticipation));

    return this.processCheck(array, fighter);
  },
  oneTwoThreeSkillCheckAttack(fighter) {
    let array = [];
    array.push(this.getRollWithMod(fighter.skill.decisions));
    array.push(this.getRollWithMod(fighter.skill.footwork));
    array.push(this.getRollWithMod(fighter.skill.sharpness));
    array.push(this.getRollWithMod(fighter.physical.workRate));
    return this.processCheck(array, fighter);
  },
  oneTwoThreeSkillCheckDefend(fighter) {
    let array = [];
    array.push(this.getRollWithMod(fighter.skill.positioning));
    array.push(this.getRollWithMod(fighter.skill.footwork));
    array.push(this.getRollWithMod(fighter.skill.anticipation));
    array.push(this.getRollWithMod(fighter.skill.fluidity));

    return this.processCheck(array, fighter);
  },
  variousComboSkillCheckAttack(fighter) {
    let array = [];
    array.push(this.getRollWithMod(fighter.skill.positioning));
    array.push(this.getRollWithMod(fighter.skill.decisions));
    array.push(this.getRollWithMod(fighter.skill.footwork));
    array.push(this.getRollWithMod(fighter.skill.sharpness));
    array.push(this.getRollWithMod(fighter.physical.workRate));
    array.push(this.getRollWithMod(fighter.skill.vision));

    return this.processCheck(array, fighter);
  },
  variousComboSkillCheckDefend(fighter) {
    let array = [];
    array.push(this.getRollWithMod(fighter.skill.positioning));
    array.push(this.getRollWithMod(fighter.skill.decisions));
    array.push(this.getRollWithMod(fighter.skill.footwork));
    array.push(this.getRollWithMod(fighter.skill.anticipation));
    array.push(this.getRollWithMod(fighter.skill.fluidity));
    array.push(this.getRollWithMod(fighter.physical.workRate));

    return this.processCheck(array, fighter);
  },

  //actions
  bigAction(attackPhysMod, defendPhysMod, physDC) {
    const physDCHalved = Math.floor(physDC);
    let outcome = {
      def: { exposed: 0, learned: 0, damage: 0 },
      att: { exposed: 0, learned: 0, damage: 0 },
    };
    let { att, def } = outcome;
    if (this.getDifference(attackPhysMod, defendPhysMod) >= physDC) {
      if (attackPhysMod > defendPhysMod) {
        def.exposed += physDC;
        def.damage += physDCHalved;
      } else {
        att.exposed += physDCHalved;
      }
    } else if (
      this.getDifference(attackPhysMod, defendPhysMod) >= physDCHalved
    ) {
      if (attackPhysMod > defendPhysMod) {
        def.exposed += physDCHalved;
      } else {
        def.learned += physDCHalved;
      }
    } else {
      def.learned += defendPhysMod;
      att.learned += attackPhysMod;
    }
    return outcome;
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
    if (fighter.match.condition < 60) {
      stamMod = this.getModifier(fighter.physical.stamina);
      // console.log(`${stamMod} stam mod`);
    }
    //vision check for position mod
    let visionCheck = this.getRollWithMod(fighter.skill.vision);
    if (visionCheck >= 7) {
      positionMod = this.getAverage([
        this.getModifier(fighter.skill.positioning),
        this.getModifier(fighter.physical.acceleration),
      ]);
    }
    // work rate mod
    workRateMod = this.getModifier(fighter.physical.workRate);
    // console.log(`${workRateMod} workrate mod`);
    console.log(`${stamMod} stam, ${positionMod} pos, ${workRateMod}work`);
    const initiative = stamMod + positionMod + workRateMod + 20;
    // console.log(initiative);

    if (fighter.match.momentum) {
      return initiative * this.computedMomentum(fighter);
    } else {
      return initiative;
    }
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

    // if save is true then he needs to disengage
    if (fighter.match.save) {
      return matchData.disengage.value; // 'disengage';
    }

    //if fighter is exposed or hurt he will do so according to instructions
    //then pass a check to follow the instructions
    let isExposed = fighter.match.exposed > this.getExposedFactor(fighter);
    isExposed = this.exposedMentalCheck(fighter) >= 5 ? isExposed : !isExposed;
    let isHurt = fighter.match.condition < this.getHurtFactor(fighter);
    isHurt = this.hurtMentalCheck(fighter) >= 10 ? isHurt : !isHurt;

    console.log(isExposed || isHurt);
    if (isExposed || isHurt) {
      return matchData.compose.value; // 'compose';
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
            method = element.value;
          }
        });
      } else {
        //STAYOUTSIDE
        matchData.engage.stayOutside.forEach((element) => {
          if (element.value == 'strike') {
            // console.log(element);

            method = element.value;
          }
        });
      }
      // not striking => grapple
    } else {
      if (fighter.tactic.closeDistance) {
        matchData.engage.closeDistance.forEach((element) => {
          if (element.value == 'grapple') {
            // console.log(element);

            method = element.value;
          }
        });
      } else {
        matchData.engage.stayOutside.forEach((element) => {
          if (element.value == 'grapple') {
            // console.log(element);

            method = element.value;
          }
        });
      }
    }

    //
    return method;
  },

  engage(method, attacker, defender) {
    if (defender.match.save) {
      /*
      attacker has defender controlled
      from here the outcome is that he holds and scores a point
      then we can add submissions later
      they will have to depend on where the position was
      */
      return this.hold(attacker, defender);
    }

    if (method == 'grapple') {
      return this.grapple(attacker, defender);
    } else if (method == 'strike') {
      return this.strike(attacker, defender);
    } else if (method == 'disengage') {
      return this.disengage(attacker, defender);
    } else if (method == 'compose') {
      return this.compose(attacker, defender);
    }
  },

  /*AFTER .engage*/
  hold(attacker, defender) {
    let outcome = new classes.Outcome();
    let { def, att } = outcome;
    const dc = defender.match.dc;

    // can do a skill check here depending on type of position
    // fluid and versa chosen because  grappling
    const attackMod = Math.max(
      ...[
        this.getRollWithMod(attacker.skill.fluidity),
        this.getRollWithMod(attacker.skill.versatility),
      ]
    );
    const defendMod = Math.max(
      ...[
        this.getRollWithMod(defender.skill.fluidity),
        this.getRollWithMod(defender.skill.versatility),
      ]
    );
    if (this.getDifference(attackMod, defendMod) >= 10) {
      if (attackMod >= defendMod) {
        outcome.dc = dc - 4;
      } else {
        outcome.dc = dc + 4;
      }
    } else if (this.getDifference(attackMod, defendMod) >= 5) {
      if (attackMod >= defendMod) {
        outcome.dc = dc - 2;
      } else {
        outcome.dc = dc + 2;
      }
    } else {
      if (attackMod >= defendMod) {
        outcome.dc = dc - 1;
      } else {
        outcome.dc = dc + 1;
      }
    }

    outcome.point = true;
    outcome.msg = `${attacker.nickname} is controlling ${defender.nickname}`;
    def.exposed += 5;
    def.learned += 5;
    att.exposed += 5;
    att.learned += 5;
    return outcome;
  },
  grapple(attacker, defender) {
    let action;

    //maybe check fighter pref, gameplan
    const chance = this.roll(2);

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
  disengage(attacker, defender) {
    let outcome = new classes.Outcome();
    let { att } = outcome;
    let result = this.roll(20);
    const dc = attacker.match.dc;

    // Physical checks
    let attackMod = this.disengageCheck(attacker);
    let defendMod = this.disengageCheck(defender);

    console.log(attackMod, 'attack physical mod');
    console.log(defendMod, 'defend physical mod');

    console.log(attacker.match.dc, 'dc');
    console.log(result, 'roll');

    if (attackMod >= defendMod) {
      outcome.dc = dc - 2;
    } else {
      outcome.dc = dc + 2;
    }

    if (result >= dc) {
      att.save = false;
      outcome.msg = `${attacker.nickname} successfully disengages.`;
    } else {
      att.save = true;
      outcome.msg = `${attacker.nickname} tries to escape but fails.`;
    }

    // exposedDiscount += Math.floor(attacker.match.condition / 10);
    console.log(
      'A disengage() happened (instead of compose, strike or grapple) '
    );

    return outcome;
  },
  compose(attacker, defender) {
    let outcome = new classes.Outcome();
    let { att, def } = outcome;
    //award less exposed and less learned from opponent for composing
    // and some condition back
    if (this.getRollWithMod(attacker.mental.adaptability) >= 10) {
      att.exposed -= this.roll(10) + 5;
      att.damage -= 5;
      if (this.getRollWithMod(defender.mental.adaptability) <= 10) {
        def.learned -= this.roll(10) + 5;
      }
    } else {
      att.exposed -= 5;
    }
    if (this.getRollWithMod(attacker.physical.stamina) >= 10) {
      att.exposed -= this.roll(10) + 5;
      att.damage -= 5;
      if (this.getRollWithMod(defender.physical.stamina) <= 10) {
        def.learned -= this.roll(10) + 5;
      }
    } else {
      att.exposed -= 5;
    }
    if (this.getRollWithMod(attacker.physical.workRate) >= 10) {
      att.exposed -= this.roll(10) + 5;
      att.damage -= 5;
      if (this.getRollWithMod(defender.physical.workRate) <= 10) {
        def.learned -= this.roll(10) + 5;
      }
    } else {
      att.exposed -= 5;
    }

    console.log(att.exposed);
    console.log(def.learned);

    outcome.msg = `${attacker.nickname} composes himself and resets.`;

    // exposedDiscount += Math.floor(attacker.match.condition / 10);
    console.log(
      'A compose() happened (instead of disengage, strike or grapple), fighter gained some condition. '
    );

    return outcome;
  },

  /*AFTER .engage.grapple*/
  takedown(takedowns, attacker, defender) {
    let action;
    let takedown = takedowns[this.roll(takedowns.length) - 1];

    if (takedown.value == 'singleLeg') {
      action = singleLeg(takedown, attacker, defender);
    } else if (takedown.value == 'doubleLeg') {
      ///TODO
      action = singleLeg(takedown, attacker, defender);
    } else if (takedown.value == 'hipToss') {
      ///TODO
      action = singleLeg(takedown, attacker, defender);
    } else if (takedown.value == 'trip') {
      ///TODO
      action = singleLeg(takedown, attacker, defender);
    } else if (takedown.value == 'throw') {
      ///TODO
      action = singleLeg(takedown, attacker, defender);
    } else {
      action = singleLeg(takedown, attacker, defender);
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

  /*AFTER .engage.strike.combo*/
  oneTwo(action, attacker, defender) {
    let outcome = new classes.Outcome();
    let { att, def } = outcome;
    let finalAttack, finalDefend;
    let physDC = 5;
    let skillDC = 12;

    // Physical checks
    let attackPhysMod = this.normalActionPhysicalCheck(attacker);
    let defendPhysMod = this.normalActionPhysicalCheck(defender);

    if (this.getDifference(attackPhysMod, defendPhysMod) >= physDC) {
      if (attackPhysMod > defendPhysMod) {
        def.exposed = def.exposed + physDC;
        att.learned = att.learned + physDC;
      } else {
        def.learned = def.learned + physDC;
        att.exposed = att.exposed + physDC;
      }
    } else if (this.getDifference(attackPhysMod, defendPhysMod) >= physDC / 2) {
      if (attackPhysMod > defendPhysMod) {
        def.exposed = def.exposed + physDC / 2;
        att.learned = att.learned + physDC / 2;
      } else {
        def.learned = def.learned + physDC / 2;
        att.exposed = att.exposed + physDC / 2;
      }
    } else {
      def.learned = def.learned + defendPhysMod;
      att.learned = att.learned + attackPhysMod;
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
        def.exposed = def.exposed + 10;
        att.learned = att.learned + 5;
        def.damage = def.damage + 10 + Math.floor(attacker.body.power / 10);

        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} lands a devistating ${action.text} on ${defender.nickname}`;
      } else if (this.getDifference(finalAttack, finalDefend) >= 10) {
        //complete, point, significant
        def.exposed = def.exposed + 5;
        def.damage = def.damage + 5 + Math.floor(attacker.body.power / 10);

        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} completes a significant ${action.text} on ${defender.nickname}`;
      } else {
        //complete, point
        att.learned = att.learned + 5;
        def.damage = def.damage + Math.floor(attacker.body.power / 10);

        outcome.point = true;
        outcome.msg = `${attacker.nickname} barely lands a ${action.text} on ${defender.nickname}`;
      }
    } else {
      if (this.getDifference(finalAttack, finalDefend) >= 15) {
        //not complete, disengage
        att.exposed = att.exposed + 10;
        def.learned = def.learned + 10;
        outcome.msg = `${attacker.nickname} completely fumbles a ${action.text} attempt on ${defender.nickname}`;
      } else if (this.getDifference(finalAttack, finalDefend) >= 10) {
        //not complete, attacker learns
        att.learned = att.learned + 5;
        outcome.msg = `${attacker.nickname} fails to complete a ${action.text} on ${defender.nickname}`;
      } else {
        //not complete, defender exposed
        def.exposed = def.exposed + 5;
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
    let outcome = new classes.Outcome();
    let { att, def } = outcome;
    let finalAttack, finalDefend;
    let physDC = 12;
    let skillDC = 16;

    // Physical checks
    let attackPhysMod = this.normalActionPhysicalCheck(attacker);
    let defendPhysMod = this.normalActionPhysicalCheck(defender);

    if (this.getDifference(attackPhysMod, defendPhysMod) >= physDC) {
      if (attackPhysMod > defendPhysMod) {
        def.exposed = def.exposed + physDC;
        att.learned = att.learned + physDC;
      } else {
        def.learned = def.learned + physDC;
        att.exposed = att.exposed + physDC;
      }
    } else if (this.getDifference(attackPhysMod, defendPhysMod) >= physDC / 2) {
      if (attackPhysMod > defendPhysMod) {
        def.exposed = def.exposed + physDC / 2;
        att.learned = att.learned + physDC / 2;
      } else {
        def.learned = def.learned + physDC / 2;
        att.exposed = att.exposed + physDC / 2;
      }
    } else {
      def.learned = def.learned + defendPhysMod;
      att.learned = att.learned + attackPhysMod;
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

    console.log(`${finalAttack} final Attack`);
    console.log(`${finalDefend} final Defend`);

    if (finalAttack >= finalDefend) {
      if (this.getDifference(finalAttack, finalDefend) >= 17) {
        //complete , point, significant, big
        def.exposed = def.exposed + 12;
        att.learned = att.learned + 7;
        def.damage = def.damage + 12 + Math.floor(attacker.body.power / 10);

        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} lands a devistating ${action.text} on ${defender.nickname}`;
      } else if (this.getDifference(finalAttack, finalDefend) >= 14) {
        //complete, point, significant
        def.exposed = def.exposed + 7;
        def.damage = def.damage + 7 + Math.floor(attacker.body.power / 10);

        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} completes a significant ${action.text} on ${defender.nickname}`;
      } else {
        //complete, point
        att.learned = att.learned + 5;
        def.damage = def.damage + 2 + Math.floor(attacker.body.power / 10);

        outcome.point = true;
        outcome.msg = `${attacker.nickname} barely lands a ${action.text} on ${defender.nickname}`;
      }
    } else {
      if (this.getDifference(finalAttack, finalDefend) >= 17) {
        //not complete, disengage
        att.exposed = att.exposed + 12;
        def.learned = def.learned + 12;
        outcome.msg = `${attacker.nickname} completely fumbles a ${action.text} attempt on ${defender.nickname}`;
      } else if (this.getDifference(finalAttack, finalDefend) >= 14) {
        //not complete, attacker learns
        att.learned = att.learned + 5;
        outcome.msg = `${attacker.nickname} fails to complete a ${action.text} on ${defender.nickname}`;
      } else {
        //not complete, defender exposed
        def.exposed = def.exposed + 5;
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
    let outcome = new classes.Outcome();
    let { att, def } = outcome;
    let finalAttack, finalDefend;
    let physDC = this.rollTwenty();
    let skillDC = this.rollTwenty();
    console.log(physDC);
    console.log(skillDC);

    // Physical checks
    let attackPhysMod = this.normalActionPhysicalCheck(attacker);
    let defendPhysMod = this.normalActionPhysicalCheck(defender);

    if (this.getDifference(attackPhysMod, defendPhysMod) >= physDC) {
      if (attackPhysMod > defendPhysMod) {
        def.exposed = def.exposed + physDC;
        att.learned = att.learned + physDC;
      } else {
        def.learned = def.learned + physDC;
        att.exposed = att.exposed + physDC;
      }
    } else if (this.getDifference(attackPhysMod, defendPhysMod) >= physDC / 2) {
      if (attackPhysMod > defendPhysMod) {
        def.exposed = def.exposed + physDC / 2;
        att.learned = att.learned + physDC / 2;
      } else {
        def.learned = def.learned + physDC / 2;
        att.exposed = att.exposed + physDC / 2;
      }
    } else {
      def.learned = def.learned + defendPhysMod;
      att.learned = att.learned + attackPhysMod;
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
        def.exposed = def.exposed + 12;
        att.learned = att.learned + 7;

        def.damage =
          def.damage +
          Math.floor((this.roll(physDC) + this.roll(skillDC)) / 2) +
          Math.floor(attacker.body.power / 10);

        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} lands a devistating ${action.text} on ${defender.nickname}`;
      } else if (this.getDifference(finalAttack, finalDefend) >= 14) {
        //complete, point, significant
        def.exposed = def.exposed + 7;
        def.damage =
          def.damage +
          Math.floor((this.roll(physDC) + this.roll(skillDC)) / 4) +
          Math.floor(attacker.body.power / 10);

        outcome.significant = true;
        outcome.point = true;
        outcome.msg = `${attacker.nickname} completes a significant ${action.text} on ${defender.nickname}`;
      } else {
        //complete, point
        att.learned = att.learned + 5;
        def.damage = def.damage + Math.floor(attacker.body.power / 10);

        outcome.point = true;
        outcome.msg = `${attacker.nickname} barely lands a ${action.text} on ${defender.nickname}`;
      }
    } else {
      if (this.getDifference(finalAttack, finalDefend) >= 17) {
        //not complete, disengage
        att.exposed = att.exposed + 12;
        def.learned = def.learned + 12;
        outcome.msg = `${attacker.nickname} completely fumbles a ${action.text} attempt on ${defender.nickname}`;
      } else if (this.getDifference(finalAttack, finalDefend) >= 14) {
        //not complete, attacker learns
        att.learned = att.learned + 5;
        outcome.msg = `${attacker.nickname} fails to complete a ${action.text} on ${defender.nickname}`;
      } else {
        //not complete, defender exposed
        def.exposed = def.exposed + 5;
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

  //simulate
};
