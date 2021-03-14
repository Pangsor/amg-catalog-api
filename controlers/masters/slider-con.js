const { encryptText, decryptJSON } = require('../../middleware/encrypt');

const { Slider, validAddSlider, fieldsSlider } = require('../../models/masters/slider-mdl');

async function addSlide(dataBody){
  const { error } = validAddSlider(dataBody);
  if (error) return [400, error.details[0].message];

  let slider = await Slider.findOne({ lokasi_gambar: encryptText(dataBody.lokasi_gambar)});
  if (slider) return [400, 'Lokasi gambar sudah ada di slide!'];

  slider = new Slider({
    lokasi_gambar: encryptText(dataBody.lokasi_gambar)
  });
  await slider.save();

  return [200, 'Tambah slide berhasil.'];
};

async function getSlide() {
  let slider = await Slider.aggregate([
    { "$project": fieldsSlider }
  ]);
  
  let resDec = decryptJSON(slider);
  return resDec;
};

async function editSlide(dataParams, dataBody) {
  const { error } = validAddSlider(dataBody);
  if (error) return [400, error.details[0].message];

  let slider = await Slider.findByIdAndUpdate({ _id: dataParams._id },{
    lokasi_gambar: encryptText(dataBody.lokasi_gambar)
  });
  if(!slider) return [404, `Id slide tidak di temukan !`];

  return [200, 'Update slide berhasil.'];
};

async function deleteSlide(dataParams) {
  let slider = await Slider.findByIdAndDelete({ _id: dataParams._id });
  if(!slider) return [404, `Data slide tidak di temukan!`];

  return [200, `Slide berhasil di hapus.`];
}

exports.addSlide = addSlide;
exports.getSlide = getSlide;
exports.editSlide = editSlide;
exports.deleteSlide = deleteSlide;