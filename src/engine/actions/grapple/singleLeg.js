import classes from '@/data/classes.js';
import eng from '@/engine/matchEngine.js';

const skillDCMod = (attacker, defender, skillDC) => {
  let attRoll, defRoll;

  attRoll = eng.getAverage([
    eng.getRollWithMod(attacker.physical.pace),
    eng.getRollWithMod(attacker.skill.positioning),
  ]);
  defRoll = eng.getAverage([
    eng.getRollWithMod(defender.skill.anticipation),
    eng.getRollWithMod(defender.skill.footwork),
  ]);

  if (attRoll >= defRoll) {
    skillDC -= 2;
  }

  attRoll = eng.getAverage([
    eng.getRollWithMod(attacker.skill.fluidity),
    eng.getRollWithMod(attacker.skill.versatility),
  ]);
  defRoll = eng.getAverage([
    eng.getRollWithMod(defender.skill.fluidity),
    eng.getRollWithMod(defender.skill.versatility),
  ]);

  if (attRoll >= defRoll) {
    skillDC -= 2;
  } else {
    skillDC += 2;
  }

  attRoll = eng.getRollWithMod(attacker.mental.determination);
  defRoll = eng.getRollWithMod(defender.mental.pressure);

  if (attRoll >= defRoll) {
    skillDC -= 2;
  } else {
    skillDC += 2;
  }

  return skillDC;
};

const skillCheckAttack = (fighter) => {
  let array = [];
  array.push(eng.getRollWithMod(fighter.skill.positioning));
  array.push(eng.getRollWithMod(fighter.skill.decisions));
  array.push(eng.getRollWithMod(fighter.skill.fluidity));
  array.push(eng.getRollWithMod(fighter.skill.versatility));

  return eng.processCheck(array, fighter);
};

const skillCheckDefend = (fighter) => {
  let array = [];
  array.push(eng.getRollWithMod(fighter.skill.positioning));
  array.push(eng.getRollWithMod(fighter.skill.decisions));
  array.push(eng.getRollWithMod(fighter.skill.versatility));
  array.push(eng.getRollWithMod(fighter.skill.anticipation));

  return eng.processCheck(array, fighter);
};

export const singleLeg = (action, attacker, defender) => {
  let outcome = new classes.Outcome();
  let { att, def } = outcome;

  let physDC = 10;
  let skillDC = 10;

  att.stamina = -10;

  // Physical checks
  let attackPhysMod = eng.bigActionPhysicalCheck(attacker);
  let defendPhysMod = eng.bigActionPhysicalCheck(defender);
  console.log(attackPhysMod, 'attack physical mod');
  console.log(defendPhysMod, 'defend physical mod');

  const bigActionOutcome = eng.bigAction(attackPhysMod, defendPhysMod, physDC);
  def.exposed += bigActionOutcome.def.exposed;
  def.learned += bigActionOutcome.att.learned;
  att.exposed += bigActionOutcome.def.exposed;
  att.learned += bigActionOutcome.att.learned;

  // Skill checks
  let attackSkillMod = skillCheckAttack(attacker);
  let defendSkillMod = skillCheckDefend(defender);
  console.log(attackSkillMod, 'attack skill mod');
  console.log(defendSkillMod, 'defend skill mod');

  skillDC = skillDCMod(attacker, defender, skillDC);

  if (attackSkillMod >= skillDC) {
    attackSkillMod += skillDC / 2;
  }
  if (defendSkillMod >= skillDC) {
    defendSkillMod += skillDC / 2;
  }

  // Final outcome
  const finalAttack = attackSkillMod + attackPhysMod;
  const finalDefend = defendSkillMod + defendPhysMod;

  console.log(finalAttack, 'attack final mod');
  console.log(finalDefend, 'defend final mod');

  if (finalAttack >= finalDefend) {
    //success

    //grappling:

    // degree of success
    if (eng.getDifference(finalAttack, finalDefend) >= 15) {
      //complete , point, significant, big dc,
      def.exposed += 15;
      att.learned += 10;
      def.damage += 10;
      def.grappled = true;

      def.dc = 11 + eng.getModifier(attacker.skill.versatility);

      outcome.significant = true;
      outcome.point = true;
      outcome.msg = `${attacker.nickname} lands a devastating ${action.text} on ${defender.nickname}`;
    } else if (eng.getDifference(finalAttack, finalDefend) >= 10) {
      //complete, point, significant,
      def.exposed += 10;
      att.learned += 5;
      def.damage += 5;
      def.grappled = true;

      def.dc = 8 + eng.getModifier(attacker.skill.versatility);

      outcome.significant = true;
      outcome.point = true;
      outcome.msg = `${attacker.nickname} completes a significant ${action.text} on ${defender.nickname}`;
    } else if (eng.getDifference(finalAttack, finalDefend) >= 5) {
      //complete, point
      def.exposed += 5;
      att.learned += 3;
      def.damage += 2;

      def.dc = 3 + eng.getModifier(attacker.skill.versatility);

      def.stamina += 10;

      outcome.point = true;
      outcome.msg = `${attacker.nickname} completes a ${action.text} on ${defender.nickname}`;
    } else {
      //barely,
      def.exposed += 3;
      att.learned += 1;

      att.stamina -= 5;
      def.stamina += 5;

      def.dc = 1 + eng.getModifier(attacker.skill.versatility);

      outcome.msg = `${attacker.nickname} barely completes a ${action.text} on ${defender.nickname}`;
    }
  } else {
    if (eng.getDifference(finalAttack, finalDefend) >= 15) {
      //not complete, attacker exposed, defender learns
      att.exposed += 10;
      def.learned += 5;

      att.stamina -= 10;
      def.stamina += 10;
      outcome.msg = `${attacker.nickname} fumbles a ${action.text} attempt on ${defender.nickname}`;
    } else if (eng.getDifference(finalAttack, finalDefend) >= 10) {
      //not complete, attacker learns
      att.learned += 5;

      att.stamina -= 5;
      def.stamina += 5;
      outcome.msg = `${attacker.nickname} fails to complete a ${action.text} on ${defender.nickname}`;
    } else {
      //not complete, defender exposed
      def.exposed += 5;

      att.stamina -= 5;
      def.stamina += 5;
      outcome.msg = `${attacker.nickname} almost gets the ${action.text} on ${defender.nickname}`;
    }
  }

  // attach
  action = {
    ...action,
    ...outcome,
  };

  return action;
};
