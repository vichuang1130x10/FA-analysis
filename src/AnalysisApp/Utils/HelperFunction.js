export function outputDate(date) {
  return date.toLocaleString().split(",")[0] || "";
}

export function separateString(str) {
  return str.split("(");
}

export function getWeek(d) {
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const jan4 = new Date(target.getFullYear(), 0, 4);
  const dayDiff = (target - jan4) / 86400000;
  const weekNr = 1 + Math.ceil(dayDiff / 7);
  return weekNr;
}

export function getDateOfISOWeek(w, y) {
  var simple = new Date(y, 0, 1 + (w - 1) * 7);
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

export function getSevenDayBoundary(d) {
  return new Date(new Date(d).valueOf() + -90 * 24 * 3600 * 1000);
}

export function milToMiliMeter(mil) {
  return parseFloat((mil * 0.0254).toFixed(2));
}
