import classes from '@/data/classes.js';
import eng from '@/engine/matchEngine.js';

const skillDCMod = (attacker, defender, skillDC) => {
  let attRoll, defRoll;

  attRoll = eng.getAverage([
    eng.getRollWithMod(attacker.mental.ambition),
    eng.getRollWithMod(attacker.mental.pressure),
    eng.getRollWithMod(attacker.mental.adaptability),
    eng.getRollWithMod(attacker.physical.flair),
    eng.getRollWithMod(attacker.skill.vision),
    eng.getRollWithMod(attacker.skill.decisions),
  ]);
  defRoll = eng.getAverage([
    eng.getRollWithMod(attacker.mental.determination),
    eng.getRollWithMod(attacker.mental.pressure),
    eng.getRollWithMod(attacker.mental.adaptability),
    eng.getRollWithMod(defender.physical.workRate),
    eng.getRollWithMod(defender.skill.anticipation),
    eng.getRollWithMod(defender.skill.positioning),
  ]);

  if (attRoll >= defRoll) {
    skillDC -= 3;
  }

  attRoll = eng.getAverage([
    eng.getRollWithMod(attacker.skill.footwork),
    eng.getRollWithMod(attacker.skill.sharpness),
  ]);
  defRoll = eng.getAverage([
    eng.getRollWithMod(defender.skill.footwork),
    eng.getRollWithMod(defender.skill.sharpness),
  ]);

  if (attRoll >= defRoll) {
    skillDC -= 2;
  } else {
    skillDC += 2;
  }

  attRoll = eng.getRollWithMod(attacker.mental.determination);
  defRoll = eng.getRollWithMod(defender.mental.pressure);

  if (attRoll >= defRoll) {
    skillDC -= 1;
  } else {
    skillDC += 1;
  }

  return skillDC;
};

const skillCheckAttack = (fighter) => {
  let array = [];
  array.push(eng.getRollWithMod(fighter.skill.positioning));
  array.push(eng.getRollWithMod(fighter.skill.decisions));
  array.push(eng.getRollWithMod(fighter.skill.footwork));
  array.push(eng.getRollWithMod(fighter.skill.sharpness));
  array.push(eng.getRollWithMod(fighter.skill.vision));
  array.push(eng.getRollWithMod(fighter.physical.workRate));

  return eng.processCheck(array, fighter);
};

const skillCheckDefend = (fighter) => {
  let array = [];
  array.push(eng.getRollWithMod(fighter.skill.positioning));
  array.push(eng.getRollWithMod(fighter.skill.decisions));
  array.push(eng.getRollWithMod(fighter.skill.footwork));
  array.push(eng.getRollWithMod(fighter.skill.anticipation));
  array.push(eng.getRollWithMod(fighter.skill.versatility));
  array.push(eng.getRollWithMod(fighter.physical.workRate));

  return eng.processCheck(array, fighter);
};

export const variousCombo = (action, attacker, defender) => {
  let outcome = new classes.Outcome();
  let { att, def } = outcome;

  let physDC = eng.rollTwenty();
  let skillDC = eng.rollTwenty();

  // Physical checks
  let attackPhysMod = eng.normalActionPhysicalCheck(attacker);
  let defendPhysMod = eng.normalActionPhysicalCheck(defender);

  const normalActionOutcome = eng.normalAction(
    attackPhysMod,
    defendPhysMod,
    physDC
  );
  def.exposed += normalActionOutcome.def.exposed;
  def.learned += normalActionOutcome.att.learned;
  att.exposed += normalActionOutcome.def.exposed;
  att.learned += normalActionOutcome.att.learned;

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
    if (eng.getDifference(finalAttack, finalDefend) >= 15) {
      //complete , point, significant, big
      def.exposed += physDC + 5;
      att.learned += skillDC + 5;
      def.damage += eng.getAverage([physDC, skillDC]) + 5;

      outcome.significant = true;
      outcome.point = true;
      outcome.msg = `${attacker.nickname} lands a devistating ${action.text} on ${defender.nickname}`;
    } else if (eng.getDifference(finalAttack, finalDefend) >= 10) {
      //complete, point, significant
      def.exposed += physDC;
      att.learned += skillDC;
      def.damage += eng.getAverage([physDC, skillDC]);

      if (eng.getAverage([physDC, skillDC]) >= 10) {
        outcome.significant = true;
      }
      outcome.point = true;
      outcome.msg = `${attacker.nickname} completes a significant ${action.text} on ${defender.nickname}`;
    } else {
      //complete, point
      att.learned += 2;
      def.damage += 2;

      if (eng.getAverage([physDC, skillDC]) >= 10) {
        outcome.point = true;
      }
      outcome.msg = `${attacker.nickname} barely lands a ${action.text} on ${defender.nickname}`;
    }
  } else {
    if (eng.getDifference(finalAttack, finalDefend) >= 15) {
      //not complete, attacker exposed defender learns
      att.exposed += physDC + 5;
      def.learned += skillDC + 5;

      outcome.msg = `${attacker.nickname} completely fumbles a ${action.text} attempt on ${defender.nickname}`;
    } else if (eng.getDifference(finalAttack, finalDefend) >= 10) {
      //not complete, attacker exposed
      att.exposed += physDC;

      outcome.msg = `${attacker.nickname} fails to complete a ${action.text} on ${defender.nickname}`;
    } else {
      //not complete, attacker learns
      att.learned += skillDC;

      outcome.msg = `${attacker.nickname} almost gets the ${action.text} on ${defender.nickname}`;
    }
  }

  //striking:
  if (def.damage > 0) {
    def.damage += eng.addPowerVsChin(attacker.body.power, defender.head.chin);
  }

  // attach
  action = {
    ...action,
    ...outcome,
  };

  return action;
};
