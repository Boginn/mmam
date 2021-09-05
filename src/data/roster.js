import classes from "./classes";
var roster = [];

var fighter01 = new classes.Fighter(
  0, //id
  "Thresh", //nickname
  "Darragh Gallagher", //name
  28, //age
  "Ireland", //nationality
  178 //height
);
fighter01.tactic.closeDistance = true;

fighter01.type.grappler = 30;
fighter01.type.striker = 70;

fighter01.legs[0].power = 68;
fighter01.legs[0].reach = 129;
fighter01.legs[0].durability = 89;
fighter01.legs[1].power = 39;
fighter01.legs[1].reach = 128;
fighter01.legs[1].durability = 97;

fighter01.arms[0].power = 53;
fighter01.arms[0].reach = 127;
fighter01.arms[0].durability = 75;
fighter01.arms[1].power = 41;
fighter01.arms[1].reach = 127;
fighter01.arms[1].durability = 81;

fighter01.body.durability = 69;

fighter01.head.durability = 76;
fighter01.head.chin = 98;

fighter01.mental.adaptability = 10;
fighter01.mental.determination = 10;
fighter01.mental.ambition = 10;
fighter01.mental.loyalty = 10;
fighter01.mental.pressure = 10;
fighter01.mental.professionalism = 10;
fighter01.mental.sportsmanship = 10;
fighter01.mental.temperement = 10;

fighter01.physical.flair = 10;
fighter01.physical.agility = 10;
fighter01.physical.strength = 10;
fighter01.physical.stamina = 10;
fighter01.physical.pace = 10;
fighter01.physical.acceleration = 10;

fighter01.skill.anticipation = 10;
fighter01.skill.leadership = 10;
fighter01.skill.positioning = 10;
fighter01.skill.decisions = 10;
fighter01.skill.vision = 10;
fighter01.skill.versatility = 10;
fighter01.skill.finishing = 10;
fighter01.skill.footwork = 10;
fighter01.skill.fluidity = 10;
fighter01.skill.sharpness = 10;

roster.push(fighter01);
/*-----------------------------------------------------------------------------------------*/

var fighter02 = new classes.Fighter(
  1,
  "Mosquito",
  "Aaron Beckintosh",
  38,
  "England",
  176
);
fighter02.tactic.closeDistance = false;

fighter02.type.grappler = 10;
fighter02.type.striker = 90;

fighter02.legs[0].power = 15;
fighter02.legs[0].reach = 135;
fighter02.legs[0].durability = 40;
fighter02.legs[1].power = 24;
fighter02.legs[1].reach = 136;
fighter02.legs[1].durability = 24;

fighter02.arms[0].power = 31;
fighter02.arms[0].reach = 147;
fighter02.arms[0].durability = 14;
fighter02.arms[1].power = 41;
fighter02.arms[1].reach = 148;
fighter02.arms[1].durability = 17;

fighter02.body.durability = 21;

fighter02.head.durability = 24;
fighter02.head.chin = 20;

fighter02.mental.adaptability = 10;
fighter02.mental.determination = 10;
fighter02.mental.ambition = 10;
fighter02.mental.loyalty = 10;
fighter02.mental.pressure = 10;
fighter02.mental.professionalism = 10;
fighter02.mental.sportsmanship = 10;
fighter02.mental.temperement = 10;

fighter02.physical.flair = 10;
fighter02.physical.agility = 10;
fighter02.physical.strength = 10;
fighter02.physical.stamina = 10;
fighter02.physical.pace = 10;
fighter02.physical.acceleration = 10;

fighter02.skill.anticipation = 10;
fighter02.skill.leadership = 10;
fighter02.skill.positioning = 10;
fighter02.skill.decisions = 10;
fighter02.skill.vision = 10;
fighter02.skill.versatility = 10;
fighter02.skill.footwork = 10;
fighter02.skill.fluidity = 10;
fighter02.skill.sharpness = 10;

roster.push(fighter02);
/*-----------------------------------------------------------------------------------------*/

var fighter03 = new classes.Fighter(
  2,
  "Fish",
  "Kim Tinglestahp",
  21,
  "United States",
  162
);
fighter03.tactic.closeDistance = true;

fighter03.type.grappler = 80;
fighter03.type.striker = 20;

fighter03.legs[0].power = 52;
fighter03.legs[0].reach = 110;
fighter03.legs[0].durability = 100;
fighter03.legs[1].power = 82;
fighter03.legs[1].reach = 111;
fighter03.legs[1].durability = 100;

fighter03.arms[0].power = 65;
fighter03.arms[0].reach = 134;
fighter03.arms[0].durability = 100;
fighter03.arms[1].power = 78;
fighter03.arms[1].reach = 134;
fighter03.arms[1].durability = 100;

fighter03.body.durability = 100;

fighter03.head.durability = 100;
fighter03.head.chin = 100;

fighter03.mental.adaptability = 10;
fighter03.mental.determination = 10;
fighter03.mental.ambition = 10;
fighter03.mental.loyalty = 10;
fighter03.mental.pressure = 10;
fighter03.mental.professionalism = 10;
fighter03.mental.sportsmanship = 10;
fighter03.mental.temperement = 10;

fighter03.physical.flair = 10;
fighter03.physical.agility = 10;
fighter03.physical.strength = 10;
fighter03.physical.stamina = 10;
fighter03.physical.pace = 10;
fighter03.physical.acceleration = 10;

fighter03.skill.anticipation = 10;
fighter03.skill.leadership = 10;
fighter03.skill.positioning = 10;
fighter03.skill.decisions = 10;
fighter03.skill.vision = 10;
fighter03.skill.versatility = 10;
fighter03.skill.finishing = 10;
fighter03.skill.footwork = 10;
fighter03.skill.fluidity = 10;
fighter03.skill.sharpness = 10;

roster.push(fighter03);
/*-----------------------------------------------------------------------------------------*/

var fighter04 = new classes.Fighter(
  3,
  "Bushido",
  "Gerard Anand",
  26,
  "France",
  186
);
fighter04.tactic.closeDistance = true;

fighter04.type.grappler = 50;
fighter04.type.striker = 50;

fighter04.legs[0].power = 68;
fighter04.legs[0].reach = 129;
fighter04.legs[0].durability = 89;
fighter04.legs[1].power = 39;
fighter04.legs[1].reach = 128;
fighter04.legs[1].durability = 97;

fighter04.arms[0].power = 53;
fighter04.arms[0].reach = 127;
fighter04.arms[0].durability = 75;
fighter04.arms[1].power = 41;
fighter04.arms[1].reach = 127;
fighter04.arms[1].durability = 81;

fighter04.body.durability = 69;

fighter04.head.durability = 76;
fighter04.head.chin = 98;

fighter04.mental.adaptability = 10;
fighter04.mental.determination = 10;
fighter04.mental.ambition = 10;
fighter04.mental.loyalty = 10;
fighter04.mental.pressure = 10;
fighter04.mental.professionalism = 10;
fighter04.mental.sportsmanship = 10;
fighter04.mental.temperement = 10;

fighter04.physical.flair = 10;
fighter04.physical.agility = 10;
fighter04.physical.strength = 10;
fighter04.physical.stamina = 10;
fighter04.physical.pace = 10;
fighter04.physical.acceleration = 10;

fighter04.skill.anticipation = 10;
fighter04.skill.leadership = 10;
fighter04.skill.positioning = 10;
fighter04.skill.decisions = 10;
fighter04.skill.vision = 10;
fighter04.skill.versatility = 10;
fighter04.skill.finishing = 10;
fighter04.skill.footwork = 10;
fighter04.skill.fluidity = 10;
fighter04.skill.sharpness = 10;

roster.push(fighter04);
/*-----------------------------------------------------------------------------------------*/

var fighter05 = new classes.Fighter(
  4,
  "Shingle",
  "Elon Koontz",
  28,
  "Egypt",
  184
);
fighter05.tactic.closeDistance = false;

fighter05.type.grappler = 35;
fighter05.type.striker = 65;

fighter05.legs[0].power = 68;
fighter05.legs[0].reach = 129;
fighter05.legs[0].durability = 89;
fighter05.legs[1].power = 39;
fighter05.legs[1].reach = 128;
fighter05.legs[1].durability = 97;

fighter05.arms[0].power = 53;
fighter05.arms[0].reach = 127;
fighter05.arms[0].durability = 75;
fighter05.arms[1].power = 41;
fighter05.arms[1].reach = 127;
fighter05.arms[1].durability = 81;

fighter05.body.durability = 69;

fighter05.head.durability = 76;
fighter05.head.chin = 98;

fighter05.mental.adaptability = 10;
fighter05.mental.determination = 10;
fighter05.mental.ambition = 10;
fighter05.mental.loyalty = 10;
fighter05.mental.pressure = 10;
fighter05.mental.professionalism = 10;
fighter05.mental.sportsmanship = 10;
fighter05.mental.temperement = 10;

fighter05.physical.flair = 10;
fighter05.physical.agility = 10;
fighter05.physical.strength = 10;
fighter05.physical.stamina = 10;
fighter05.physical.pace = 10;
fighter05.physical.acceleration = 10;

fighter05.skill.anticipation = 10;
fighter05.skill.leadership = 10;
fighter05.skill.positioning = 10;
fighter05.skill.decisions = 10;
fighter05.skill.vision = 10;
fighter05.skill.versatility = 10;
fighter05.skill.finishing = 10;
fighter05.skill.footwork = 10;
fighter05.skill.fluidity = 10;
fighter05.skill.sharpness = 10;

roster.push(fighter05);
/*-----------------------------------------------------------------------------------------*/

var fighter06 = new classes.Fighter(
  5,
  "Not",
  "Will Fester",
  19,
  "Faroe Islands",
  174
);
fighter06.tactic.closeDistance = true;

fighter06.type.grappler = 73;
fighter06.type.striker = 27;

fighter06.legs[0].power = 78;
fighter06.legs[0].reach = 140;
fighter06.legs[0].durability = 100;
fighter06.legs[1].power = 89;
fighter06.legs[1].reach = 140;
fighter06.legs[1].durability = 100;

fighter06.arms[0].power = 75;
fighter06.arms[0].reach = 135;
fighter06.arms[0].durability = 100;
fighter06.arms[1].power = 85;
fighter06.arms[1].reach = 135;
fighter06.arms[1].durability = 100;

fighter06.body.durability = 100;

fighter06.head.durability = 92;
fighter06.head.chin = 76;

fighter06.mental.adaptability = 10;
fighter06.mental.determination = 10;
fighter06.mental.ambition = 10;
fighter06.mental.loyalty = 10;
fighter06.mental.pressure = 10;
fighter06.mental.professionalism = 10;
fighter06.mental.sportsmanship = 10;
fighter06.mental.temperement = 10;

fighter06.physical.flair = 10;
fighter06.physical.agility = 10;
fighter06.physical.strength = 10;
fighter06.physical.stamina = 10;
fighter06.physical.pace = 10;
fighter06.physical.acceleration = 10;

fighter06.skill.anticipation = 10;
fighter06.skill.leadership = 10;
fighter06.skill.positioning = 10;
fighter06.skill.decisions = 10;
fighter06.skill.vision = 10;
fighter06.skill.versatility = 10;
fighter06.skill.finishing = 10;
fighter06.skill.footwork = 10;
fighter06.skill.fluidity = 10;
fighter06.skill.sharpness = 10;

roster.push(fighter06);
/*-----------------------------------------------------------------------------------------*/

var fighter07 = new classes.Fighter(
  6,
  "Django",
  "Gordon Freeman",
  39,
  "United States",
  176
);
fighter07.tactic.closeDistance = false;

fighter07.type.grappler = 30;
fighter07.type.striker = 70;

fighter07.legs[0].power = 78;
fighter07.legs[0].reach = 140;
fighter07.legs[0].durability = 100;
fighter07.legs[1].power = 89;
fighter07.legs[1].reach = 140;
fighter07.legs[1].durability = 100;

fighter07.arms[0].power = 75;
fighter07.arms[0].reach = 135;
fighter07.arms[0].durability = 100;
fighter07.arms[1].power = 85;
fighter07.arms[1].reach = 135;
fighter07.arms[1].durability = 100;

fighter07.body.durability = 100;

fighter07.head.durability = 92;
fighter07.head.chin = 76;

fighter07.mental.adaptability = 10;
fighter07.mental.determination = 10;
fighter07.mental.ambition = 10;
fighter07.mental.loyalty = 10;
fighter07.mental.pressure = 10;
fighter07.mental.professionalism = 10;
fighter07.mental.sportsmanship = 10;
fighter07.mental.temperement = 10;

fighter07.physical.flair = 10;
fighter07.physical.agility = 10;
fighter07.physical.strength = 10;
fighter07.physical.stamina = 10;
fighter07.physical.pace = 10;
fighter07.physical.acceleration = 10;

fighter07.skill.anticipation = 10;
fighter07.skill.leadership = 10;
fighter07.skill.positioning = 10;
fighter07.skill.decisions = 10;
fighter07.skill.vision = 10;
fighter07.skill.versatility = 10;
fighter07.skill.finishing = 10;

roster.push(fighter07);
/*-----------------------------------------------------------------------------------------*/
var fighter08 = new classes.Fighter(
  7,
  "King",
  "Goodjohnson Kong",
  22,
  "South Africa",
  182
);
fighter08.tactic.closeDistance = true;

fighter08.type.grappler = 85;
fighter08.type.striker = 15;

fighter08.legs[0].power = 78;
fighter08.legs[0].reach = 140;
fighter08.legs[0].durability = 100;
fighter08.legs[1].power = 89;
fighter08.legs[1].reach = 140;
fighter08.legs[1].durability = 100;

fighter08.arms[0].power = 75;
fighter08.arms[0].reach = 135;
fighter08.arms[0].durability = 100;
fighter08.arms[1].power = 85;
fighter08.arms[1].reach = 135;
fighter08.arms[1].durability = 100;

fighter08.body.durability = 100;

fighter08.head.durability = 92;
fighter08.head.chin = 76;

fighter08.mental.adaptability = 10;
fighter08.mental.determination = 10;
fighter08.mental.ambition = 10;
fighter08.mental.loyalty = 10;
fighter08.mental.pressure = 10;
fighter08.mental.professionalism = 10;
fighter08.mental.sportsmanship = 10;
fighter08.mental.temperement = 10;

fighter08.physical.flair = 10;
fighter08.physical.agility = 10;
fighter08.physical.strength = 10;
fighter08.physical.stamina = 10;
fighter08.physical.pace = 10;
fighter08.physical.acceleration = 10;

fighter08.skill.anticipation = 10;
fighter08.skill.leadership = 10;
fighter08.skill.positioning = 10;
fighter08.skill.decisions = 10;
fighter08.skill.vision = 10;
fighter08.skill.versatility = 10;
fighter08.skill.finishing = 10;

roster.push(fighter08);
/*-----------------------------------------------------------------------------------------*/
var fighter09 = new classes.Fighter(
  8,
  "Cleaver",
  "Gísli Súrsson",
  25,
  "Iceland",
  165
);
fighter09.tactic.closeDistance = true;

fighter09.type.grappler = 45;
fighter09.type.striker = 55;

fighter09.legs[0].power = 78;
fighter09.legs[0].reach = 140;
fighter09.legs[0].durability = 100;
fighter09.legs[1].power = 89;
fighter09.legs[1].reach = 140;
fighter09.legs[1].durability = 100;

fighter09.arms[0].power = 75;
fighter09.arms[0].reach = 135;
fighter09.arms[0].durability = 100;
fighter09.arms[1].power = 85;
fighter09.arms[1].reach = 135;
fighter09.arms[1].durability = 100;

fighter09.body.durability = 100;

fighter09.head.durability = 92;
fighter09.head.chin = 76;

fighter09.mental.adaptability = 10;
fighter09.mental.determination = 10;
fighter09.mental.ambition = 10;
fighter09.mental.loyalty = 10;
fighter09.mental.pressure = 10;
fighter09.mental.professionalism = 10;
fighter09.mental.sportsmanship = 10;
fighter09.mental.temperement = 10;

fighter09.physical.flair = 10;
fighter09.physical.agility = 10;
fighter09.physical.strength = 10;
fighter09.physical.stamina = 10;
fighter09.physical.pace = 10;
fighter09.physical.acceleration = 10;

fighter09.skill.anticipation = 10;
fighter09.skill.leadership = 10;
fighter09.skill.positioning = 10;
fighter09.skill.decisions = 10;
fighter09.skill.vision = 10;
fighter09.skill.versatility = 10;
fighter09.skill.finishing = 10;
fighter09.skill.footwork = 10;
fighter09.skill.fluidity = 10;
fighter09.skill.sharpness = 10;

roster.push(fighter09);
/*-----------------------------------------------------------------------------------------*/
var fighter10 = new classes.Fighter(9, "Fluke", "Aymno Lucas", 23, "Spain", 172);
fighter10.tactic.closeDistance = true;

fighter10.type.grappler = 50;
fighter10.type.striker = 50;

fighter10.legs[0].power = 78;
fighter10.legs[0].reach = 140;
fighter10.legs[0].durability = 100;
fighter10.legs[1].power = 89;
fighter10.legs[1].reach = 140;
fighter10.legs[1].durability = 100;

fighter10.arms[0].power = 75;
fighter10.arms[0].reach = 135;
fighter10.arms[0].durability = 100;
fighter10.arms[1].power = 85;
fighter10.arms[1].reach = 135;
fighter10.arms[1].durability = 100;

fighter10.body.durability = 100;

fighter10.head.durability = 92;
fighter10.head.chin = 76;

fighter10.mental.adaptability = 10;
fighter10.mental.determination = 10;
fighter10.mental.ambition = 10;
fighter10.mental.loyalty = 10;
fighter10.mental.pressure = 10;
fighter10.mental.professionalism = 10;
fighter10.mental.sportsmanship = 10;
fighter10.mental.temperement = 10;

fighter10.physical.flair = 10;
fighter10.physical.agility = 10;
fighter10.physical.strength = 10;
fighter10.physical.stamina = 10;
fighter10.physical.pace = 10;
fighter10.physical.acceleration = 10;

fighter10.skill.anticipation = 10;
fighter10.skill.leadership = 10;
fighter10.skill.positioning = 10;
fighter10.skill.decisions = 10;
fighter10.skill.vision = 10;
fighter10.skill.versatility = 10;
fighter10.skill.finishing = 10;
fighter10.skill.footwork = 10;
fighter10.skill.fluidity = 10;
fighter10.skill.sharpness = 10;

roster.push(fighter10);
/*-----------------------------------------------------------------------------------------*/
var fighter11 = new classes.Fighter(
  10,
  "Daddy",
  "Ron Stampler",
  35,
  "United States",
  169
);
fighter11.tactic.closeDistance = true;

fighter11.type.grappler = 60;
fighter11.type.striker = 40;

fighter11.legs[0].power = 78;
fighter11.legs[0].reach = 140;
fighter11.legs[0].durability = 100;
fighter11.legs[1].power = 89;
fighter11.legs[1].reach = 140;
fighter11.legs[1].durability = 100;

fighter11.arms[0].power = 75;
fighter11.arms[0].reach = 135;
fighter11.arms[0].durability = 100;
fighter11.arms[1].power = 85;
fighter11.arms[1].reach = 135;
fighter11.arms[1].durability = 100;

fighter11.body.durability = 100;

fighter11.head.durability = 92;
fighter11.head.chin = 76;

fighter11.mental.adaptability = 10;
fighter11.mental.determination = 10;
fighter11.mental.ambition = 10;
fighter11.mental.loyalty = 10;
fighter11.mental.pressure = 10;
fighter11.mental.professionalism = 10;
fighter11.mental.sportsmanship = 10;
fighter11.mental.temperement = 10;

fighter11.physical.flair = 10;
fighter11.physical.agility = 10;
fighter11.physical.strength = 10;
fighter11.physical.stamina = 10;
fighter11.physical.pace = 10;
fighter11.physical.acceleration = 10;

fighter11.skill.anticipation = 10;
fighter11.skill.leadership = 10;
fighter11.skill.positioning = 10;
fighter11.skill.decisions = 10;
fighter11.skill.vision = 10;
fighter11.skill.versatility = 10;
fighter11.skill.finishing = 10;
fighter11.skill.footwork = 10;
fighter11.skill.fluidity = 10;
fighter11.skill.sharpness = 10;

roster.push(fighter11);
/*-----------------------------------------------------------------------------------------*/
var fighter12 = new classes.Fighter(
  11,
  "Fandango",
  "Manny Cabuallera",
  35,
  "Spain",
  176
);
fighter12.tactic.closeDistance = false;

fighter12.type.grappler = 30;
fighter12.type.striker = 70;

fighter12.legs[0].power = 78;
fighter12.legs[0].reach = 140;
fighter12.legs[0].durability = 100;
fighter12.legs[1].power = 89;
fighter12.legs[1].reach = 140;
fighter12.legs[1].durability = 100;

fighter12.arms[0].power = 75;
fighter12.arms[0].reach = 135;
fighter12.arms[0].durability = 100;
fighter12.arms[1].power = 85;
fighter12.arms[1].reach = 135;
fighter12.arms[1].durability = 100;

fighter12.body.durability = 100;

fighter12.head.durability = 92;
fighter12.head.chin = 76;

fighter12.mental.adaptability = 10;
fighter12.mental.determination = 10;
fighter12.mental.ambition = 10;
fighter12.mental.loyalty = 10;
fighter12.mental.pressure = 10;
fighter12.mental.professionalism = 10;
fighter12.mental.sportsmanship = 10;
fighter12.mental.temperement = 10;

fighter12.physical.flair = 10;
fighter12.physical.agility = 10;
fighter12.physical.strength = 10;
fighter12.physical.stamina = 10;
fighter12.physical.pace = 10;
fighter12.physical.acceleration = 10;

fighter12.skill.anticipation = 10;
fighter12.skill.leadership = 10;
fighter12.skill.positioning = 10;
fighter12.skill.decisions = 10;
fighter12.skill.vision = 10;
fighter12.skill.versatility = 10;
fighter12.skill.finishing = 10;
fighter12.skill.footwork = 10;
fighter12.skill.fluidity = 10;
fighter12.skill.sharpness = 10;

roster.push(fighter12);
/*-----------------------------------------------------------------------------------------*/
var fighter99 = new classes.Fighter('id.toInt', "nickname", "Name Last", 'age.toInt', "nation", 'height.toInt');
fighter99.tactic.closeDistance = true;

fighter99.type.grappler = 50;
fighter99.type.striker = 50;

fighter99.legs[0].power = 78;
fighter99.legs[0].reach = 140;
fighter99.legs[0].durability = 100;
fighter99.legs[1].power = 89;
fighter99.legs[1].reach = 140;
fighter99.legs[1].durability = 100;

fighter99.arms[0].power = 75;
fighter99.arms[0].reach = 135;
fighter99.arms[0].durability = 100;
fighter99.arms[1].power = 85;
fighter99.arms[1].reach = 135;
fighter99.arms[1].durability = 100;

fighter99.body.durability = 100;

fighter99.head.durability = 92;
fighter99.head.chin = 76;

fighter99.mental.adaptability = 10;
fighter99.mental.determination = 10;
fighter99.mental.ambition = 10;
fighter99.mental.loyalty = 10;
fighter99.mental.pressure = 10;
fighter99.mental.professionalism = 10;
fighter99.mental.sportsmanship = 10;
fighter99.mental.temperement = 10;

fighter99.physical.flair = 10;
fighter99.physical.agility = 10;
fighter99.physical.strength = 10;
fighter99.physical.stamina = 10;
fighter99.physical.pace = 10;
fighter99.physical.acceleration = 10;

fighter99.skill.anticipation = 10;
fighter99.skill.leadership = 10;
fighter99.skill.positioning = 10;
fighter99.skill.decisions = 10;
fighter99.skill.vision = 10;
fighter99.skill.versatility = 10;
fighter99.skill.finishing = 10;
fighter99.skill.footwork = 10;
fighter99.skill.fluidity = 10;
fighter99.skill.sharpness = 10;

//roster.push(fighter99);
/*-----------------------------------------------------------------------------------------*/

export default {
  roster,
};
