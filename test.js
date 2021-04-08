// you can write to stdout for debugging purposes, e.g.
// console.log('this is a debug message');

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

function solution(Y, A, B, W) {
  // write your code in JavaScript (Node.js 8.9.4)

  const start = new Date(Y, months.indexOf(A), 1);
  console.log(start);
  const end = new Date(Y, months.indexOf(B) + 1, 0);
  console.log(end);

  const startH = findFirstDay(start, 1, 1);
  console.log(startH);
  const endH = findFirstDay(end, 0, -1);
  console.log(endH);

  const difference = endH.getTime() - startH.getTime();

  const weeks = difference / (1000 * 60 * 60 * 24 * 7);

  return Math.ceil(weeks);
}

function findFirstDay(date, day, direction) {
  if (date.getDay() === day) {
    return date;
  }
  const next = new Date(date);
  next.setDate(next.getDate() + direction);
  return findFirstDay(next, day, direction);
}

console.log(solution(2014, 'April', 'May', 'Wednesday'));
