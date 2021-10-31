import classes from '@/data/classes.js';
import eng from '@/engine/matchEngine.js';

// const skillCheckAttack = (fighter) => {
//   let array = [];
//   array.push(eng.getRollWithMod(fighter.skill.finishing));
//   array.push(eng.getRollWithMod(fighter.skill.finishing));
//   array.push(eng.getRollWithMod(fighter.skill.fluidity));
//   array.push(eng.getRollWithMod(fighter.skill.versatility));
//   return eng.processCheck(array, fighter);
// };

const skillCheck = (fighter) => {
  let array = [];
  array.push(eng.getRollWithMod(fighter.skill.positioning));
  array.push(eng.getRollWithMod(fighter.skill.decisions));
  array.push(eng.getRollWithMod(fighter.skill.fluidity));
  array.push(eng.getRollWithMod(fighter.skill.versatility));
  return eng.processCheck(array, fighter);
};

export const standardDefend = (attacker, defender) => {
  let outcome = new classes.Outcome();
  let { att, def } = outcome;
  const dc = defender.match.dc;
  console.log(dc + 'dc');

  // // can do a skill check here depending on type of position
  // // fluid and versa chosen because  grappling
  // let attackMod = Math.max(
  //   ...[
  //     eng.getRollWithMod(attacker.skill.fluidity),
  //     eng.getRollWithMod(attacker.skill.versatility),
  //   ]
  // );
  // let defendMod = Math.max(
  //   ...[
  //     eng.getRollWithMod(defender.skill.fluidity),
  //     eng.getRollWithMod(defender.skill.versatility),
  //   ]
  // );
  // if (eng.getDifference(attackMod, defendMod) >= 10) {
  //   if (attackMod >= defendMod) {
  //     def.dc = dc - 4;
  //   } else {
  //     def.dc = dc + 4;
  //   }
  // } else if (eng.getDifference(attackMod, defendMod) >= 5) {
  //   if (attackMod >= defendMod) {
  //     def.dc = dc - 2;
  //   } else {
  //     def.dc = dc + 2;
  //   }
  // } else {
  //   if (attackMod >= defendMod) {
  //     def.dc = dc - 1;
  //   } else {
  //     def.dc = dc + 1;
  //   }
  // }
  // console.log(dc + 'dc');

  // attempt to control
  let attackMod = Math.max(
    ...[
      eng.getRollWithMod(attacker.skill.fluidity),
      eng.getRollWithMod(attacker.skill.versatility),
    ]
  );
  let defendMod = Math.max(
    ...[
      eng.getRollWithMod(defender.skill.fluidity),
      eng.getRollWithMod(defender.skill.versatility),
    ]
  );
  console.log(attackMod + 'attackMod');
  console.log(defendMod + 'defendMod');

  let attackSkillCheck = skillCheck(attacker);

  attackMod += eng.getRollWithMod(attacker.match.learned / 5);
  defendMod -= eng.getRollWithMod(defender.match.exposed / 5);

  if (attackSkillCheck >= att.dc) {
    attackMod += eng.getModifier(attackSkillCheck);
  }

  console.log(attackMod + 'attackMod');
  console.log(defendMod + 'defendMod');

  if (attackMod >= defendMod) {
    //TODO degree of success

    if (eng.getDifference(attackMod, defendMod) >= 10) {
      att.controlled = false;
      att.grappled = false;

      def.exposed += 5;
      att.learned += 5;

      outcome.msg = `${attacker.nickname} escapes and resets!`;
    } else if (eng.getDifference(attackMod, defendMod) >= 5) {
      att.saves = -1;

      outcome.msg = `${attacker.nickname} is defending`;
    }
  } else {
    // outcome.msg = `${attacker.nickname} is holding ${defender.nickname}`;

    if (eng.getDifference(attackMod, defendMod) >= 10) {
      att.exposed += 5;
      def.learned += 5;
    }

    outcome.msg = `${attacker.nickname} fails to escape`;
  }

  return outcome;
};
