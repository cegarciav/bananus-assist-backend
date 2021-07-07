async function Interval() {
  const today = new Date();
  const first_day = new Date(today.getFullYear(), today.getMonth(), 1);
  return [today, first_day];
}

module.exports = {
  Interval,
};
