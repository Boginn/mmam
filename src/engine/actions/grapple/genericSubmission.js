import classes from '@/data/classes.js';
import eng from '@/engine/matchEngine.js';

const skillCheckAttack = (fighter) => {
  let array = [];
  array.push(eng.getRollWithMod(fighter.skill.decisions));
  array.push(eng.getRollWithMod(fighter.skill.vision));
  array.push(eng.getRollWithMod(fighter.skill.fluidity));
  array.push(eng.getRollWithMod(fighter.skill.versatility));

  return eng.processCheck(array, fighter);
};

const skillCheckDefend = (fighter) => {
  let array = [];
  array.push(eng.getRollWithMod(fighter.skill.positioning));
  array.push(eng.getRollWithMod(fighter.skill.anticipation));
  array.push(eng.getRollWithMod(fighter.skill.fluidity));
  array.push(eng.getRollWithMod(fighter.skill.versatility));

  return eng.processCheck(array, fighter);
};

export const genericSubmission = (action, attacker, defender) => {
  let outcome = new classes.Outcome();
  let { att, def } = outcome;

  // Physical checks
  let attackPhysMod = eng.groundedActionPhysicalCheck(attacker);
  let defendPhysMod = eng.groundedActionPhysicalCheck(defender);
  console.log(attackPhysMod, 'attack physical mod');
  console.log(defendPhysMod, 'defend physical mod');

  // Skill checks
  let attackSkillMod = skillCheckAttack(attacker);
  let defendSkillMod = skillCheckDefend(defender);
  console.log(attackSkillMod, 'attack skill mod');
  console.log(defendSkillMod, 'defend skill mod');

  // Exposed/Learned checks
  let attackLearned = eng.getRollWithMod(attacker.match.learned / 5);
  let defendExposed = eng.getRollWithMod(defender.match.exposed / 5);

  // Final outcome
  const finalAttack = attackSkillMod + attackPhysMod + attackLearned;
  const finalDefend = defendSkillMod + defendPhysMod - defendExposed;

  console.log(finalAttack, 'attack final mod');
  console.log(finalDefend, 'defend final mod');

  if (finalAttack >= finalDefend) {
    //success

    // //grappling:
    // def.save = true;

    // degree of success
    if (eng.getDifference(finalAttack, finalDefend) >= 15) {
      //completes submission
      def.saves = 3;

      outcome.significant = true;
      outcome.point = true;
      outcome.msg = `${attacker.nickname} has locked in a ${action.text} on ${defender.nickname}`;
    } else if (eng.getDifference(finalAttack, finalDefend) >= 10) {
      def.exposed += 5;
      att.learned += 5;

      def.saves = 2;

      outcome.point = true;
      outcome.msg = `${attacker.nickname} is having success with a ${action.text} attempt on ${defender.nickname}`;
    } else if (eng.getDifference(finalAttack, finalDefend) >= 5) {
      def.saves = 1;

      outcome.msg = `${attacker.nickname} is attempting a ${action.text} on ${defender.nickname}`;
    } else {
      //barely,
      def.exposed += 5;
      att.learned += 5;

      outcome.msg = `${attacker.nickname} tries to set up a ${action.text} on ${defender.nickname}`;
    }
  } else {
    if (eng.getDifference(finalAttack, finalDefend) >= 15) {
      //not complete, attacker exposed, defender learns
      att.exposed += 10;
      def.learned += 5;
      def.controlled = false;
      outcome.msg = `${attacker.nickname} gets out of the ${action.text} attempt on ${defender.nickname}`;
    } else if (eng.getDifference(finalAttack, finalDefend) >= 10) {
      //not complete, attacker learns
      att.learned += 5;
      def.controlled = false;
      def.grappled = true;
      outcome.msg = `${attacker.nickname} fails to find a ${action.text} on ${defender.nickname}`;
    }
  }

  // attach
  action = {
    ...action,
    ...outcome,
  };

  return action;
};
