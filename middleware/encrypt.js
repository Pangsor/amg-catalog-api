const moment = require('moment');
const crypto = require(`crypto`);
const config = require(`config`);

function encryptText(text){
  const key = config.get(`encKey`);
  const cipher = crypto.createCipheriv(`rc4`,key,``);
  const cipherText = cipher.update(text, `utf8`,`hex`);
  return cipherText.toUpperCase();
}

function decryptText(text){
  const key = config.get(`encKey`);
  const decipher = crypto.createDecipheriv(`rc4`,key,``);
  const decipherText = decipher.update(text,`hex`, `utf8`);
  return decipherText;
}

function unMaskedNumber(number) {
  if (number.toString().length === 0) return 0;

  let posNum = 0;
  if(Number(number) >= 0){
    posNum = 1;
  }else{
    posNum = -1;
  }
  const numNumber = number * posNum;

  const lengthMask = numNumber.toString().slice(-1);
  const lengthMaskedNum = numNumber.toString().length - 1; 
  const maskedNum = Number(numNumber.toString().slice(0, lengthMaskedNum));
  
  let maskNum = [];
  for (i = 0; i < lengthMask; i++){
    maskNum.push(i + 1);
  }
  const realNum = Number(((maskedNum/2) - maskNum.join('')).toFixed(4)); 
  return Number(realNum) * posNum;
}

function maskedNumber(number) {
  let posNum = 0;
  
  if(Number(number) >= 0){
    posNum = 1;
  }else{
    posNum = -1;
  }
  const numNumber = number * posNum;

  const arrNum = numNumber.toString().split(".");
  let lengthNum = arrNum[0].length;
  if (lengthNum >= 9){
    lengthNum = 9
  }

  let maskNum = [];
  for (i = 0; i < lengthNum; i++){
    maskNum.push(i + 1);
  }
  let sumNum = Number(arrNum[0]) + Number(maskNum.join(''));
  let maskedNum = 0; 
  if(arrNum.length === 2){
    maskedNum = (Number(sumNum.toString() + "." + arrNum[1].toString()) * 2).toString() + lengthNum.toString();
  }else{
    maskedNum = (sumNum * 2).toString() + lengthNum.toString();
  }
  return Number(maskedNum) * posNum;
}

function encryptJSON(dataJSON) {
  try{
    if(Array.isArray(dataJSON) === false){
      // This for non array JSON
      let encJSON = {};
      for(let i in dataJSON){
        if(typeof dataJSON[i] === "string"){
          if(moment(dataJSON[i],['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'], true).isValid() === false){
            encJSON[i] = encryptText(dataJSON[i]);
          }else{
            encJSON[i] = dataJSON[i];
          }

        }else if(typeof dataJSON[i] === "number"){
          encJSON[i] = maskedNumber(dataJSON[i]);

        }else if(Array.isArray(dataJSON[i]) === true){
          let arrEncJSONSUB = [];
          let arrJSON = dataJSON[i];

          for(let a in arrJSON){
            let dataJSONSUB = arrJSON[a];
            let encJSONSUB = {};

            for(let j in dataJSONSUB){
              if(typeof dataJSONSUB[j] === "string"){
                if(moment(dataJSONSUB[j],['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'], true).isValid() === false){
                  encJSONSUB[j] = encryptText(dataJSONSUB[j]);
                }else{
                  encJSONSUB[j] = dataJSONSUB[j];
                }
              }else if(typeof dataJSONSUB[j] === "number"){
                encJSONSUB[j] = maskedNumber(dataJSONSUB[j]);
              }else{
                encJSONSUB[j] = dataJSONSUB[j];
              }
            }
            arrEncJSONSUB.push(encJSONSUB);

          }
          encJSON[i] = arrEncJSONSUB;
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
              encJSON2[i] = encryptText(aDataJSON[i]);
            }else{
              encJSON2[i] = aDataJSON[i];
            }
  
          }else if(typeof aDataJSON[i] === "number"){
            encJSON2[i] = maskedNumber(aDataJSON[i]);
  
          }else if(Array.isArray(aDataJSON[i]) === true){
            let arrEncJSONSUB2 = [];
            let arrJSON2 = aDataJSON[i];
  
            for(let a in arrJSON2){
              let dataJSONSUB2 = arrJSON2[a];
              let encJSONSUB2 = {};
  
              for(let j in dataJSONSUB2){
                if(typeof dataJSONSUB2[j] === "string"){
                  if(moment(dataJSONSUB2[j],['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'], true).isValid() === false){
                    encJSONSUB2[j] = encryptText(dataJSONSUB2[j]);
                  }else{
                    encJSONSUB2[j] = dataJSONSUB2[j];
                  }
                }else if(typeof dataJSONSUB2[j] === "number"){
                  encJSONSUB2[j] = maskedNumber(dataJSONSUB2[j]);
                }else{
                  encJSONSUB2[j] = dataJSONSUB2[j];
                }
              }
              arrEncJSONSUB2.push(encJSONSUB2);
  
            }
            encJSON2[i] = arrEncJSONSUB2;
  
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

function decryptJSON(dataJSON) {
  try{
    if(Array.isArray(dataJSON) === false){
      // This for non array JSON
      let decJSON = {};

      for(let i in dataJSON){
        if(typeof dataJSON[i] === "string"){
          if(moment(dataJSON[i],['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'], true).isValid() === false){
            decJSON[i] = decryptText(dataJSON[i]);
          }else{
            decJSON[i] = decJSON[i];
          }

        }else if(typeof dataJSON[i] === "number"){
          decJSON[i] = unMaskedNumber(dataJSON[i]);

        }else if(Array.isArray(dataJSON[i]) === true){
          let arrDecJSONSUB = [];
          let arrJSON = dataJSON[i];

          for(let a in arrJSON){
            let dataJSONSUB = arrJSON[a];
            let decJSONSUB = {};

            for(let j in dataJSONSUB){
              if(typeof dataJSONSUB[j] === "string"){
                if(moment(dataJSONSUB[j],['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'], true).isValid() === false){
                  decJSONSUB[j] = decryptText(dataJSONSUB[j]);
                }else{
                  decJSONSUB[j] = dataJSONSUB[j];
                }
              }else if(typeof dataJSONSUB[j] === "number"){
                decJSONSUB[j] = unMaskedNumber(dataJSONSUB[j]);
              }else{
                decJSONSUB[j] = dataJSONSUB[j];
              }
            }
            arrDecJSONSUB.push(decJSONSUB);

          }
          decJSON[i] = arrDecJSONSUB;

        }else{
          decJSON[i] = dataJSON[i];
        }
      }
      return ([200, decJSON]);
    }else{
      // This For array JSON
      let aDecJSON = [];

      for(let b in dataJSON){
        let aDataJSON = dataJSON[b];
        let decJSON2 = {};

        for(let i in aDataJSON){
          if(typeof aDataJSON[i] === "string"){
            if(moment(aDataJSON[i],['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'], true).isValid() === false){
              decJSON2[i] = decryptText(aDataJSON[i]);
            }else{
              decJSON2[i] = aDataJSON[i];
            }
  
          }else if(typeof aDataJSON[i] === "number"){
            decJSON2[i] = unMaskedNumber(aDataJSON[i]);
  
          }else if(Array.isArray(aDataJSON[i]) === true){
            let arrDecJSONSUB2 = [];
            let arrJSON2 = aDataJSON[i];
  
            for(let a in arrJSON2){
              let dataJSONSUB2 = arrJSON2[a];
              let decJSONSUB2 = {};
  
              for(let j in dataJSONSUB2){
                if(typeof dataJSONSUB2[j] === "string"){
                  if(moment(dataJSONSUB2[j],['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'], true).isValid() === false){
                    decJSONSUB2[j] = decryptText(dataJSONSUB2[j]);
                  }else{
                    decJSONSUB2[j] = dataJSONSUB2[j];
                  }
                }else if(typeof dataJSONSUB2[j] === "number"){
                  decJSONSUB2[j] = unMaskedNumber(dataJSONSUB2[j]);
                }else{
                  decJSONSUB2[j] = dataJSONSUB2[j];
                }
              }
              arrDecJSONSUB2.push(decJSONSUB2);
  
            }
            decJSON2[i] = arrDecJSONSUB2;
  
          }else{
            decJSON2[i] = aDataJSON[i];
          }
        }
        aDecJSON.push(decJSON2);
      }
      return ([200, aDecJSON]);
    }
  }catch(err){
    return([500, err.message]);
  }
};

function markUpNilai(xNumber, xMarkUp){
  const lenMarkUp = xMarkUp.toString().length;
  const yNumber = xNumber.toString().substring(Number(xNumber.toString().length) - Number(lenMarkUp));
  const diffNumb = Number(xMarkUp) - Number(yNumber);
  let resNum;
  if(Number(yNumber) === 0){
    resNum = Number(xNumber);
  }else{
    if(diffNumb >= 0){
      resNum = Number(xNumber) + Number(diffNumb);
    }else{
      let diffNumb2 = diffNumb * -1;
      if(diffNumb2 <= xMarkUp){
        diffNumb2 = diffNumb + xMarkUp;
      }else{
        let numKali = (diffNumb2 / xMarkUp).toFixed(0);
        if(diffNumb2 < (numKali * xMarkUp)){
          numKali = numKali - 1;
        }
        if ((diffNumb2 - (numKali * xMarkUp)) !== 0){
          diffNumb2 = xMarkUp - (diffNumb2 - (numKali * xMarkUp));
        }else{
          diffNumb2 = 0;
        }
      }
      resNum = Number(xNumber) + Number(diffNumb2);
    }
  }
  return Number(resNum);
}

exports.markUpNilai = markUpNilai;
exports.encryptText = encryptText;
exports.decryptText = decryptText;
exports.maskedNumber = maskedNumber;
exports.unMaskedNumber = unMaskedNumber;
exports.encryptJSON = encryptJSON;
exports.decryptJSON = decryptJSON;