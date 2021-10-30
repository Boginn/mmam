import matchData from '@/data/matchData.js';
import classes from '@/data/classes.js';
import { singleLeg } from '@/engine/actions/grapple/';
import { oneTwo, oneTwoThree, variousCombo } from '@/engine/actions/strike/';

export default {
  //services
  // getArchivedMatchBlueprint(id) {
  //   return new matchData.ArchivedMatch(parseInt(id) + 100000);
  // },
  rollEvent(currentSecond, happenChance) {
    let chance;
    let cSec = currentSecond;

    for (let i = cSec; i < 59; i = i + 2) {
      // // console.log(i + " i");
      cSec = cSec + 2;

      chance = this.roll(happenChance);

      if (chance == happenChance) {
        // console.log('action:');
        return cSec;
      }
    }

    return cSec;
  },
  roll(number) {
    return Math.floor(Math.random() * number) + 1;
  },
  rollTwenty() {
    let result = Math.floor(Math.random() * 20) + 1;
    return result;
  },
  rollHundred() {
    let result = Math.floor(Math.random() * 100) + 1;
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
    if (fighter.match.saves <= 0) {
      result.finished = true;
      result.msg = `That's all over.${fighter.nickname} has been submitted!`;
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
  groundedActionPhysicalCheck(fighter) {
    let array = [];
    array.push(this.getRollWithMod(fighter.physical.strength));
    array.push(this.getRollWithMod(fighter.physical.stamina));
    array.push(this.getRollWithMod(fighter.physical.workRate));
    array.push(this.getRollWithMod(fighter.physical.explosiveness));
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
  normalAction(attackPhysMod, defendPhysMod, physDC) {
    const physDCHalved = Math.floor(physDC);
    let outcome = {
      def: { exposed: 0, learned: 0, damage: 0 },
      att: { exposed: 0, learned: 0, damage: 0 },
    };
    let { att, def } = outcome;
    if (this.getDifference(attackPhysMod, defendPhysMod) >= physDC) {
      if (attackPhysMod > defendPhysMod) {
        def.exposed += physDC;
      } else {
        att.exposed += physDCHalved;
      }
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

  /*
  Action chain:
  */

  pickMethodAttack(fighter, opponent) {
    let method; // returned

    // if save is true then he needs to disengage
    if (fighter.match.grappled) {
      return matchData.disengage.value; // 'disengage';
    }

    // if opponent is controlloed, attempt to submit
    if (opponent.match.controlled) {
      return matchData.submission.value; // 'submission';
    }

    if (opponent.match.grappled) {
      return matchData.hold.value; // 'hold';
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
    if (method == 'grapple') {
      return this.grapple(attacker, defender);
    } else if (method == 'strike') {
      return this.strike(attacker, defender);
    } else if (method == 'disengage') {
      return this.disengage(attacker, defender);
    } else if (method == 'compose') {
      return this.compose(attacker, defender);
    } else if (method == 'submission') {
      return this.submission(attacker, defender);
    } else if (method == 'hold') {
      return this.hold(attacker, defender);
    }
  },

  /*AFTER .engage*/

  submission(attacker, defender) {
    let outcome = new classes.Outcome();
    let { def, att } = outcome;

    // outcome.point = true;
    outcome.msg = `${attacker.nickname} attempts a submission on ${defender.nickname}`;
    def.exposed += 5;
    def.learned += 5;
    att.exposed += 5;
    att.learned += 5;
    return outcome;
  },
  hold(attacker, defender) {
    let outcome = new classes.Outcome();
    let { def, att } = outcome;
    const dc = defender.match.dc;

    // can do a skill check here depending on type of position
    // fluid and versa chosen because  grappling
    let attackMod = Math.max(
      ...[
        this.getRollWithMod(attacker.skill.fluidity),
        this.getRollWithMod(attacker.skill.versatility),
      ]
    );
    let defendMod = Math.max(
      ...[
        this.getRollWithMod(defender.skill.fluidity),
        this.getRollWithMod(defender.skill.versatility),
      ]
    );
    if (this.getDifference(attackMod, defendMod) >= 10) {
      if (attackMod >= defendMod) {
        def.dc = dc - 4;
      } else {
        def.dc = dc + 4;
      }
    } else if (this.getDifference(attackMod, defendMod) >= 5) {
      if (attackMod >= defendMod) {
        def.dc = dc - 2;
      } else {
        def.dc = dc + 2;
      }
    } else {
      if (attackMod >= defendMod) {
        def.dc = dc - 1;
      } else {
        def.dc = dc + 1;
      }
    }

    // attempt to control
    attackMod = Math.max(
      ...[
        this.getRollWithMod(attacker.skill.fluidity),
        this.getRollWithMod(attacker.skill.versatility),
      ]
    );
    defendMod = Math.max(
      ...[
        this.getRollWithMod(defender.skill.fluidity),
        this.getRollWithMod(defender.skill.versatility),
      ]
    );
    attackMod += this.getRollWithMod(attacker.match.learned / 5);
    defendMod -= this.getRollWithMod(defender.match.exposed / 5);
    defendMod += this.getRollWithMod(def.dc);

    if (attackMod >= defendMod) {
      outcome.point = true;
      def.controlled = true;
      outcome.msg = `${attacker.nickname} is controlling ${defender.nickname}`;
    } else {
      outcome.msg = `${attacker.nickname} is holding ${defender.nickname}`;
    }
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
      att.grappled = false;
      outcome.msg = `${attacker.nickname} successfully disengages.`;
    } else {
      att.grappled = true;
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
      if (attacker.match.condition <= 20) {
        att.damage -= 5;
      }
      if (this.getRollWithMod(defender.mental.adaptability) <= 10) {
        def.learned -= this.roll(10) + 5;
      }
    } else {
      att.exposed -= 5;
    }
    if (this.getRollWithMod(attacker.physical.stamina) >= 10) {
      att.exposed -= this.roll(10) + 5;
      if (attacker.match.condition <= 20) {
        att.damage -= 5;
      }
      if (this.getRollWithMod(defender.physical.stamina) <= 10) {
        def.learned -= this.roll(10) + 5;
      }
    } else {
      att.exposed -= 5;
    }
    if (this.getRollWithMod(attacker.physical.workRate) >= 10) {
      att.exposed -= this.roll(10) + 5;
      if (attacker.match.condition <= 20) {
        att.damage -= 5;
      }
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
      action = oneTwo(combo, attacker, defender);
    } else if (combo.value == 'oneTwoThree') {
      action = oneTwoThree(combo, attacker, defender);
    } else if (combo.value == 'variousCombo') {
      // action = oneTwoThree(combo, attacker, defender);
      action = variousCombo(combo, attacker, defender);
    }

    return action;
  },
  single(singles, attacker, defender) {
    var action;
    singles, attacker, defender;
    return action;
  },

  /******************************************* */
  /*FINAL ACTION IN THE CHAIN*/
  /******************************************* */

  /*
  AFTER .engage.grapple.takedown
singleLeg

  AFTER .engage.strike.combo
oneTwo
oneTwoThree
variousCombo
*/

  //fighter things

  addPowerVsChin(power, chin) {
    let result = Math.floor(power / 10) - Math.floor(chin / 15);
    return result < 0 ? 0 : result;
  },
  determineEngagementByType(fighter) {
    //just rolls against stat (0-100)
    return this.roll(fighter.type.grappler) > this.roll(fighter.type.striker)
      ? false //grappler
      : true; //striker
  },

  //simulate
};
