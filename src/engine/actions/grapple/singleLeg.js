import classes from '@/data/classes.js';
import eng from '@/engine/matchEngine.js';

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
  let finalAttack, finalDefend;
  let physDC = 10;
  let skillDC = 10;

  // Physical checks
  let attackPhysMod = eng.bigActionPhysicalCheck(attacker);
  let defendPhysMod = eng.bigActionPhysicalCheck(defender);

  if (eng.getDifference(attackPhysMod, defendPhysMod) >= physDC) {
    if (attackPhysMod > defendPhysMod) {
      def.exposed += physDC;
      att.learned += physDC;
    } else {
      att.exposed += physDC;
      def.learned += physDC;
    }
  } else if (eng.getDifference(attackPhysMod, defendPhysMod) >= physDC / 2) {
    if (attackPhysMod > defendPhysMod) {
      def.exposed += physDC / 2;
      att.learned += physDC / 2;
    } else {
      def.learned += physDC / 2;
      att.exposed += physDC / 2;
    }
  } else {
    def.learned += defendPhysMod;
    att.learned += attackPhysMod;
  }

  // Skill checks
  let attackSkillMod = skillCheckAttack(attacker);
  let defendSkillMod = skillCheckDefend(defender);

  if (
    eng.getRollWithMod(attacker.physical.pace) >=
    eng.getRollWithMod(defender.skill.anticipation)
  ) {
    attackSkillMod = attackSkillMod + skillDC;
  } else if (
    eng.getRollWithMod(attacker.skill.fluidity) >=
    eng.getRollWithMod(defender.skill.versatility)
  ) {
    attackSkillMod = attackSkillMod + skillDC;
  } else {
    defendSkillMod = defendSkillMod + skillDC;
  }

  if (
    eng.getRollWithMod(attacker.mental.determination) >=
    eng.getRollWithMod(defender.mental.pressure)
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
    // in any case
    def.save = true;
    // degree of success
    if (eng.getDifference(finalAttack, finalDefend) >= 15) {
      //complete , point, significant, big dc,
      def.exposed = def.exposed + 15;
      att.learned = att.learned + 10;
      def.damage = def.damage + 10;

      def.dc = 11 + eng.getModifier(attacker.skill.versatility);

      outcome.significant = true;
      outcome.point = true;
      outcome.msg = `${attacker.nickname} lands a devastating ${action.text} on ${defender.nickname}`;
    } else if (eng.getDifference(finalAttack, finalDefend) >= 10) {
      //complete, point, significant,
      def.exposed += 10;
      att.learned += 5;
      def.damage = def.damage + 5;

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

      outcome.point = true;
      outcome.msg = `${attacker.nickname} completes a ${action.text} on ${defender.nickname}`;
    } else {
      //barely,
      def.exposed += 3;
      att.learned += 1;

      def.dc = 1 + eng.getModifier(attacker.skill.versatility);

      outcome.msg = `${attacker.nickname} barely completes a ${action.text} on ${defender.nickname}`;
    }
  } else {
    if (eng.getDifference(finalAttack, finalDefend) >= 15) {
      //not complete, attacker exposed, defender learns
      att.exposed += 10;
      def.learned += 5;
      outcome.msg = `${attacker.nickname} fumbles a ${action.text} attempt on ${defender.nickname}`;
    } else if (eng.getDifference(finalAttack, finalDefend) >= 10) {
      //not complete, attacker learns
      att.learned += 5;
      outcome.msg = `${attacker.nickname} fails to complete a ${action.text} on ${defender.nickname}`;
    } else {
      //not complete, defender exposed
      def.exposed += 5;
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
