const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { encryptJSON, encryptText, decryptText, decryptJSON } = require('../../middleware/encrypt');
const { dateNow, convertDate } = require('../../middleware/convertdate');

const { 
  User, 
  validateUserLogin, 
  validateUserAdd, 
  validateUserEdit,
  validateChangePassword, 
  fieldsUser
} = require('../../models/masters/user-mdl');

async function createSuperUser(session, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let user = await User.findOne({ user_id: encBody.user_id });
  if (user) return [400, `User id already registered.`];

  user = new User({
    user_id: encBody.user_id,
    nama_lkp: encBody.nama_lkp,
    type: encryptText('OWN'),
    pass_key: encBody.password,
    input_by: encBody.input_by,
    input_date: dateNow(),
    edit_by: encryptText('-'),
    edit_date: dateNow()
  });
  const salt = await bcrypt.genSalt(10);
  user.pass_key = await bcrypt.hash(user.pass_key, salt);

  await user.save({ session: session });

  return [200, 'success.'];
};

async function loginUser(dataBody) {
  const { error } = validateUserLogin(dataBody);
  if (error) return [400, error.details[0].message];
  
  let user = await User.findOne({ user_id: encryptText(dataBody.user_id) });
  if (!user){
    return [400, `User id atau password salah!`];
  }
  
  const validPassword = await bcrypt.compare(encryptText(dataBody.password), user.pass_key);
  if (!validPassword){
    return [400, `User id atau password salah!`];
  }
  
  const token = user.generateAuthToken();
  
  return [200,{
    "token" : token,
    "user_id" : decryptText(user.user_id),
    "nama_user" : decryptText(user.nama_lkp),
    "level" : decryptText(user.type)
  }];
};

async function addUser(session, dataUser, dataBody) {
  const { error } = validateUserAdd(dataBody);
  if(error) return [400, error.details[0].message];

  if (dataBody.password !== dataBody.retype_password) return [400, 'Password and retype password not match !'];

  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let user = await User.findOne({ user_id: encBody.user_id });
  if (user) return [400,`User id sudah terdaftar!`];

  user = new User({
    user_id: encBody.user_id,
    nama_lkp: encBody.nama_lkp,
    type: encBody.type,
    pass_key: encBody.password,
    input_by: dataUser.user_id,
    input_date: dateNow(),
    edit_by: encryptText('-'),
    edit_date: dateNow()
  });
  const salt = await bcrypt.genSalt(10);
  user.pass_key = await bcrypt.hash(user.pass_key, salt);

  await user.save({ session: session });

  return [200, "Data user berhasil di simpan!"];
}

async function editUser(session, dataUser, dataParams, dataBody) {
  const { error } = validateUserEdit(dataBody);
  if ( error ) return [400, error.details[0].message];

  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let user = await User.findOneAndUpdate({ user_id: encryptText(dataParams.user_id) },
    {
      nama_lkp: encBody.nama_lkp,
      type: encBody.type,
      edit_by: dataUser.user_id,
      edit_date: dateNow()
  },{ session: session });
  if (!user) return [404, `Data user tidak di temukan!`];

  return [200, "Edit data user berhasil!"];
}

async function changePassword(session, dataUser, dataBody) {
  const { error } = validateChangePassword(dataBody);
  if (error) return [400, error.details[0].message];

  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  if (encBody.password === encBody.new_password) return [400,`Password baru tidak boleh sama dengan password lama!`];
  if (encBody.new_password !== encBody.retype_password) return [400,`Password baru dengan retype-password tidak sama!`];

  let user = await User.findOne({ user_id: dataUser.user_id });
  if (!user) return [404, `Data user tidak di temukan!`];

  const validPassword = await bcrypt.compare(encBody.password, user.pass_key);
  if (!validPassword) return [400, `Password lama salah!`];

  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(encBody.new_password, salt);

  user = await User.findOneAndUpdate({ user_id: dataUser.user_id }, {
    pass_key: newPassword
  }, { session: session });
  
  if (!user) return [404, `Data user tidak di temukan!`];

  return [200, "Ganti password berhasil!"];
}

async function getUser() {
  let user = await User.aggregate([
    { '$project': fieldsUser }
  ]);

  let resDec = decryptJSON(user);
  return resDec;
}

async function deleteUser(session, dataUser, dataParams) {
  const user = await User.findOneAndRemove({
    user_id: encryptText(dataParams.user_id)
  }, { session: session });
  if (!user) return [404, `Data user tidak di temukan!`];
  
  return [200, "Delete data user berhasil!"];
}

exports.createSuperUser = createSuperUser;
exports.loginUser = loginUser;
exports.addUser = addUser;
exports.editUser = editUser;
exports.changePassword = changePassword;
exports.getUser = getUser;
exports.deleteUser = deleteUser;