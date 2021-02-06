module.exports = date;

function date () {
  let today = new Date();

  let options = {
    day: "numeric",
    month: "long",
    weekday: "long",
  };
  var day = today.toLocaleDateString("en-US", options);
  return day;
}
