const express = require(`express`);
const router = express.Router();

const { Auth } = require('../../middleware/auth');

const sliderCon = require('../../controlers/masters/slider-con');

router.post('/', Auth, async(req, res) => {
  const resPost = await sliderCon.addSlide(req.body);
  if(resPost[0] !== 200) return res.status(resPost[0]).send({
    "status": "error",
    "pesan": resPost[1],
    "data": []
  });  

  return res.send({
    "status": "berhasil",
    "pesan": resPost[1],
    "data": []
  });
});

router.get('/all', async(req, res) => {
  const resGet = await sliderCon.getSlide();
  if(resGet[0] !== 200) return res.status(resGet[0]).send({
    "status": "error",
    "pesan": resGet[1],
    "data": []
  });  

  return res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGet[1]
  });
});

router.put('/id/:_id', Auth, async(req, res) => {
  const resPut = await sliderCon.editSlide(req.params, req.body);
  if(resPut[0] !== 200) return res.status(resPut[0]).send({
    "status": "error",
    "pesan": resPut[1],
    "data": []
  });  

  return res.send({
    "status": "berhasil",
    "pesan": resPut[1],
    "data": []
  });
});

router.delete('/id/:_id', Auth, async(req,res) => {
  const resDel = await sliderCon.deleteSlide(req.params);
  if(resDel[0] !== 200) return res.status(resDel[0]).send({
    "status": "error",
    "pesan": resDel[1],
    "data": []
  });  

  return res.send({
    "status": "berhasil",
    "pesan": resDel[1],
    "data": []
  });
});

module.exports = router;