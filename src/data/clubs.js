import classes from './classes';

const england = [
  new classes.Club(
    'Kimborough',
    'England',
    { primary: '#496F5D', secondary: '#394034' },
    [9001, 9003, 9012, 9008, 9005]
  ), // 0
  new classes.Club(
    'Fetterton',
    'England',
    { primary: '#712F79', secondary: '#BBBE64' },

    [9007, 9006, 9004, 9015, 9010]
  ), // 1
  new classes.Club(
    'Pussex',
    'England',
    { primary: '#bb9f06', secondary: '#4C4C9D' },
    [9016, 9017, 9032, 9018, 9020]
  ), // 2
  new classes.Club(
    'Scough',
    'England',
    { primary: '#093824', secondary: '#BF4E30' },
    [9011, 9009, 9027, 9019, 9002]
  ), // 3
  new classes.Club(
    'Kennick',
    'England',
    { primary: '#095256', secondary: '#392F5A' },
    [9025, 9022, 9023, 9024, 9021]
  ), // 4
  new classes.Club(
    'Groicester',
    'England',
    { primary: '#E71D36', secondary: '#121259' },
    [9013, 9026, 9028, 9029, 9030]
  ), // 5
  new classes.Club(
    'Limmage',
    'England',
    { primary: '#A98743', secondary: '#F7C548' },
    [9034, 9033, 9014, 9031, 9035]
  ), // 6
  new classes.Club(
    'Tarkney',
    'England',
    { primary: '#50723C', secondary: '#423E28' },
    [9037, 9036, 9043, 9039, 9040]
  ), // 7
  new classes.Club(
    'West Keynes',
    'England',
    { primary: '#A44200', secondary: '#2E294E' },
    [9044, 9038, 9045, 9041, 9042]
  ), // 8
  new classes.Club(
    'Mannshire',
    'England',
    { primary: '#FF7F11', secondary: '#FF1B1C' },
    [9047, 9048, 9046, 9049, 9050]
  ), // 9
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
