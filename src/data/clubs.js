import classes from './classes';

const england = [
  new classes.Club('Kimborough', 'England', [9001, 9003, 9012, 9008, 9005]), // 0
  new classes.Club('Fetterton', 'England', [9007, 9006, 9004, 9015, 9010]), // 1
  new classes.Club('Pussex', 'England', [9016, 9017, 9032, 9018, 9020]), // 2
  new classes.Club('Scough', 'England', [9011, 9009, 9027, 9019, 9002]), // 3
  new classes.Club('Kennick', 'England', [9025, 9022, 9023, 9024, 9021]), // 4
  new classes.Club('Groicester', 'England', [9013, 9026, 9028, 9029, 9030]), // 5
  new classes.Club('Limmage', 'England', [9034, 9033, 9014, 9031, 9035]), // 6
  new classes.Club('Tarkney', 'England', [9037, 9036, 9043, 9039, 9040]), // 7
  new classes.Club('West Keynes', 'England', [9044, 9038, 9045, 9041, 9042]), // 8
  new classes.Club('Mannshire', 'England', [9047, 9048, 9046, 9049, 9050]), // 9
];

export default {
  england,
};

/*
  Scough, Limmage, Kimborough
  Groicester, Tarkney, Kennick
  Fetterton, Pussex
  West Keynes, Mannshire

*/
