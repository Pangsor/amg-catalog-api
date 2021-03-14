const { encryptJSON, decryptJSON, encryptText } = require('../../middleware/encrypt');

const {   
  SystemPerusahaan,
  validateSystemAdd, 
  fieldsPerusahaan } = require('../../models/params/system-mdl');
const { dateNow } = require('../../middleware/convertdate');

async function createSystemPerusahaan(session, dataUser, dataBody) {
  const {error} = validateSystemAdd(dataBody);
  if (error) return [400, error.details[0].message];

  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let systemPerusahaan = await SystemPerusahaan.deleteMany().session(session);
  systemPerusahaan = new SystemPerusahaan({
    kode_perusahaan: encBody.kode_perusahaan,
    nama_perusahaan: encBody.nama_perusahaan,
    email: encBody.email,
    no_hp: encBody.no_hp,
    logo: encBody.logo,
    alamat: encBody.alamat,
    lokasi: encBody.lokasi,
    input_by: encBody.input_by,
    input_date: dateNow(),
    edit_by: encryptText("-"),
    edit_date: dateNow()
  });

  await systemPerusahaan.save({ session: session });

  return [200,{"status": "success."}];
}

async function getSystemPerusahaan() {
  let systemPerusahaan = await SystemPerusahaan.aggregate([
    { "$project": fieldsPerusahaan }
  ]);

  const resDec = decryptJSON(systemPerusahaan);
  if (resDec[0] !== 200) return resDec;

  return [200,resDec[1]];
}

exports.createSystemPerusahaan = createSystemPerusahaan;
exports.getSystemPerusahaan = getSystemPerusahaan;