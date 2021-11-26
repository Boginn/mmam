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

export const maintainSubmission = (action, attacker, defender) => {
  let outcome = new classes.Outcome();
  let { att, def } = outcome;

  /*
pretty much same as genericSubmission except for msg
  */

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

  // condition checks
  let defendCondition = eng.getRollWithMod(defender.match.condition / 5);

  // Final outcome
  const finalAttack =
    attackSkillMod + attackPhysMod + eng.getModifier(attackLearned);
  const finalDefend =
    defendSkillMod +
    defendPhysMod -
    eng.getModifier(defendExposed) +
    eng.getModifier(defendCondition);

  console.log(finalAttack, 'attack final mod');
  console.log(finalDefend, 'defend final mod');

  if (finalAttack >= finalDefend) {
    //success

    // Exposed/Learned checks
    let attackLearned = eng.getRollWithMod(attacker.match.learned / 5);
    let defendExposed = eng.getRollWithMod(defender.match.exposed / 5);
    let average = eng.getAverage([attackLearned, defendExposed]);
    console.log(average + 'average');

    // degree of success
    if (eng.getDifference(finalAttack, finalDefend) >= 18) {
      //completes submission
      if (average >= 20) {
        def.saves = 3;
      } else {
        def.saves = 2;
      }

      outcome.significant = true;
      outcome.point = true;
      outcome.msg = `${attacker.nickname} looks like he's finishing a ${action.text} on ${defender.nickname}!`;
    } else if (eng.getDifference(finalAttack, finalDefend) >= 12) {
      def.exposed += 5;
      att.learned += 5;

      if (average >= 15) {
        def.saves = 2;
      } else {
        def.saves = 1;
      }

      outcome.point = true;
      outcome.msg = `${attacker.nickname} is close to finishing a ${action.text} attempt on ${defender.nickname}`;
    } else if (eng.getDifference(finalAttack, finalDefend) >= 7) {
      def.saves = 1;

      // outcome.msg = `${attacker.nickname} is attempting a ${action.text} on ${defender.nickname}`;
    } else {
      //barely,
      def.exposed += 5;
      att.learned += 5;

      // outcome.msg = `${attacker.nickname} tries to set up a ${action.text} on ${defender.nickname}`;
    }
  } else {
    if (eng.getDifference(finalAttack, finalDefend) >= 15) {
      //defender gets out and resets
      att.exposed += 5;
      def.learned += 5;
      def.controlled = false;
      def.grappled = false;

      outcome.msg = `${defender.nickname} gets out of the ${action.text} attempt and resets!`;
    } else if (eng.getDifference(finalAttack, finalDefend) >= 10) {
      //defender gets out
      def.learned += 5;
      def.controlled = false;
      def.grappled = true;
      outcome.msg = `${defender.nickname} defends the ${action.text}`;
    }
  }

  // attach
  action = {
    ...action,
    ...outcome,
  };

  console.log(def.saves + 'saves');

  return action;
};
