const moment = require('moment');

function trimUcaseJSON(dataJSON, arrIgnor) {
  try{
    if(Array.isArray(dataJSON) === false){
      // This for non array JSON
      let encJSON = {};
      for(let i in dataJSON){
        if(typeof dataJSON[i] === "string"){
          if(moment(dataJSON[i],['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'], true).isValid() === false){
            let resCek = arrIgnor.find((element) => {
              return String(element).toUpperCase().trim() === String(i).toUpperCase().trim();
            });
            if (!resCek){
              encJSON[i] = String(dataJSON[i]).toUpperCase().trim();
            }else{
              encJSON[i] = dataJSON[i];
            }
          }else{
            encJSON[i] = dataJSON[i];
          }
        }else{
          encJSON[i] = dataJSON[i];
        }
      }
      return ([200, encJSON]);
    }else{
      // This For array JSON
      let aEncJSON = [];
      for(let b in dataJSON){
        let aDataJSON = dataJSON[b];
        let encJSON2 = {};

        for(let i in aDataJSON){
          if(typeof aDataJSON[i] === "string"){
            if(moment(aDataJSON[i],['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'], true).isValid() === false){
              let resCek = arrIgnor.find((element) => {
                return String(element).toUpperCase().trim() === String(i).toUpperCase().trim();
              });
              if (!resCek){
                encJSON2[i] = String(aDataJSON[i]).toUpperCase().trim();
              }else{
                encJSON2[i] = aDataJSON[i];
              }
            }else{
              encJSON2[i] = aDataJSON[i];
            }
          }else{
            encJSON2[i] = aDataJSON[i];
          }
        }
        aEncJSON.push(encJSON2);
      }
      return ([200, aEncJSON]);
    }
  }catch(err){
    return([500, err.message]);
  }
};

function cekNumber(namaObject, dataObject) {
  if (typeof dataObject !== "number") return [400, `${namaObject} harus di isi dengan number!`]
  return [200, 'valid.'];
}

exports.trimUcaseJSON = trimUcaseJSON;
exports.cekNumber = cekNumber;