import classes from '@/data/classes.js';
import eng from '@/engine/matchEngine.js';

const skillCheckAttack = (fighter) => {
  let array = [];
  array.push(eng.getRollWithMod(fighter.skill.finishing));
  array.push(eng.getRollWithMod(fighter.skill.finishing));
  array.push(eng.getRollWithMod(fighter.skill.fluidity));
  array.push(eng.getRollWithMod(fighter.skill.versatility));
  return eng.processCheck(array, fighter);
};

const skillCheckDefend = (fighter) => {
  let array = [];
  array.push(eng.getRollWithMod(fighter.skill.positioning));
  array.push(eng.getRollWithMod(fighter.skill.decisions));
  array.push(eng.getRollWithMod(fighter.skill.fluidity));
  array.push(eng.getRollWithMod(fighter.skill.versatility));
  return eng.processCheck(array, fighter);
};

export const standardHold = (attacker, defender) => {
  let outcome = new classes.Outcome();
  let { att, def } = outcome;
  const dc = defender.match.dc;
  console.log(dc + 'dc');

  att.stamina -= 10;
  def.stamina -= 10;

  // can do a skill check here depending on type of position
  // fluid and versa chosen because  grappling
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
  if (eng.getDifference(attackMod, defendMod) >= 10) {
    if (attackMod >= defendMod) {
      def.dc = dc + 4;
    } else {
      def.dc = dc - 4;
    }
  } else if (eng.getDifference(attackMod, defendMod) >= 5) {
    if (attackMod >= defendMod) {
      def.dc = dc + 2;
    } else {
      def.dc = dc - 2;
    }
  } else {
    if (attackMod >= defendMod) {
      def.dc = dc + 1;
    } else {
      def.dc = dc - 1;
    }
  }
  console.log(def.dc);
  console.log(dc + 'dc');

  // attempt to control
  attackMod = Math.max(
    ...[
      eng.getRollWithMod(attacker.skill.fluidity),
      eng.getRollWithMod(attacker.skill.versatility),
    ]
  );
  defendMod = Math.max(
    ...[
      eng.getRollWithMod(defender.skill.fluidity),
      eng.getRollWithMod(defender.skill.versatility),
    ]
  );
  console.log(attackMod + 'attackMod');
  console.log(defendMod + 'defendMod');

  attackMod += eng.getRollWithMod(attacker.match.learned / 5);
  defendMod -= eng.getRollWithMod(defender.match.exposed / 5);
  console.log(attackMod + 'attackMod');
  console.log(defendMod + 'defendMod');

  attackMod += skillCheckAttack(attacker);
  defendMod -= skillCheckDefend(defender);
  console.log(attackMod + 'attackMod');
  console.log(defendMod + 'defendMod');

  if (attackMod >= defendMod) {
    //TODO degree of success

    if (eng.getDifference(attackMod, defendMod) >= 10) {
      def.controlled = true;

      def.stamina -= 7;

      outcome.point = true;
      outcome.msg = `${attacker.nickname} is controlling ${defender.nickname}`;
    } else if (eng.getDifference(attackMod, defendMod) >= 5) {
      def.exposed += 5;
      att.learned += 5;

      def.stamina -= 4;
      outcome.msg = `${attacker.nickname} is holding ${defender.nickname}`;
    } else {
      outcome.msg = `${attacker.nickname} is holding ${defender.nickname}`;
    }
  } else {
    // outcome.msg = `${attacker.nickname} is holding ${defender.nickname}`;

    if (eng.getDifference(attackMod, defendMod) >= 10) {
      def.grappled = false;
      att.exposed += 5;
      def.learned += 5;
      outcome.msg = `${defender.nickname} escapes`;
    } else if (eng.getDifference(attackMod, defendMod) >= 5) {
      def.grappled = false;

      outcome.msg = `${attacker.nickname} escapes`;
    }
  }

  return outcome;
};
