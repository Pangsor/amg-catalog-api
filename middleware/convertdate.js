const moment = require(`moment`);

function convertDate(date){
  const dtDate = new Date(date);
  const stringDate = moment(dtDate).format('YYYY-MM-DD') + `T00:00:00.000+00:00`;
  return stringDate;
}

function convertDateTime(date){
  const current_date = new Date(date);

  const formated_date = moment(current_date).format(`YYYY-MM-DD`);
  const formated_time = moment(current_date).format(`HH:mm:ss`);

  // var stringDate = current_date;
  const stringDate = formated_date.toString() + `T` + formated_time.toString() + `.000+00:00`;
  return stringDate;
}

function convertDateMonthly(date){
  const dateMonthly = new Date(date); 
  const strDate = dateMonthly.toISOString();
  const stringDate = strDate.slice(0,4) + strDate.slice(5,7)
  return stringDate;
}

function dateNow(){
  const formated_date = moment().utc().local().format(`YYYY-MM-DD`);
  const formated_time = moment().utc().local().format(`HH:mm:ss`);

  // var stringDate = current_date;
  const stringDate = formated_date.toString() + `T` + formated_time.toString() + `.000+00:00`;
  return stringDate;
}

exports.convertDate = convertDate;
exports.dateNow = dateNow;
exports.convertDateMonthly = convertDateMonthly;
exports.convertDateTime = convertDateTime;