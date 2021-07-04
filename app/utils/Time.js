async function Interval(){
    let today = new Date();
    let first_day = new Date(today.getFullYear(), today.getMonth(), 1)
    return [today, first_day]
  }

module.exports = {
    Interval: Interval
}