const express = require(`express`);
const error = require(`../middleware/error`);

// Parameter
const systemPerusahaan = require('../routes/params/system');

// Master
const user = require('../routes/masters/user');
const customer = require('../routes/masters/customer');
const materialType = require('../routes/masters/material-type');
const sellMethod = require('../routes/masters/sell-method');
const metalColour = require('../routes/masters/metal-colour');
const nickelContent = require('../routes/masters/nickel-content');
const sampleType = require('../routes/masters/sample-type');
const sampleCategory = require('../routes/masters/sample-category');
const sampleQuantityType = require('../routes/masters/sample-quantity-type');
const finishType = require('../routes/masters/finish-type');
const chainType = require('../routes/masters/chain-type');
const finding = require('../routes/masters/finding');
const stoneCategory = require('../routes/masters/stone-category');
const stoneType = require('../routes/masters/stone-type');
const stoneColour = require('../routes/masters/stone-colour');
const stoneCut = require('../routes/masters/stone-cut');
const stoneShape = require('../routes/masters/stone-shape');
const stoneGrade = require('../routes/masters/stone-grade');
const stoneOrigin = require('../routes/masters/stone-origin');
const platingMethod = require('../routes/masters/plating-method');
const platingMetal = require('../routes/masters/plating-metal');
const platingColour = require('../routes/masters/plating-colour');
const materialMetalTitle = require('../routes/masters/material-metal-title');
const negara = require('../routes/masters/region/negara');
const provinsi = require('../routes/masters/region/provinsi');
const kota = require('../routes/masters/region/kota');
const area = require('../routes/masters/region/area');
const item = require('../routes/masters_line/item');
const itemCode = require('../routes/masters_line/item-code');
const slider = require('../routes/masters/slider');
const banner = require('../routes/masters/banner');

// Transaksi
const customerPo = require('../routes/transactions/customer-po');

// Patch
const patchData = require('../routes/params/patch-data');

module.exports = function(app) {
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ limit: '30mb', extended: true }))

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
    next();
  });
  
  // Parameter
  app.use('/api/system-perusahaan', systemPerusahaan);

  // Master
  app.use('/api/user', user);
  app.use('/api/customer', customer);
  app.use('/api/material', materialType);
  app.use('/api/sell-method', sellMethod);
  app.use('/api/metal-colour', metalColour);
  app.use('/api/nickel-content', nickelContent);
  app.use('/api/sample-type', sampleType);
  app.use('/api/sample-category', sampleCategory);
  app.use('/api/sample-quantity-type', sampleQuantityType);
  app.use('/api/finish-type', finishType);
  app.use('/api/chain-type', chainType);
  app.use('/api/finding', finding);
  app.use('/api/stone-category', stoneCategory);
  app.use('/api/stone-type', stoneType);
  app.use('/api/stone-colour', stoneColour);
  app.use('/api/stone-cut', stoneCut);
  app.use('/api/stone-shape', stoneShape);
  app.use('/api/stone-grade', stoneGrade);
  app.use('/api/stone-origin', stoneOrigin);
  app.use('/api/plating-method', platingMethod);
  app.use('/api/plating-metal', platingMetal);
  app.use('/api/plating-colour', platingColour);
  app.use('/api/material-metal-title', materialMetalTitle);
  app.use('/api/negara', negara);
  app.use('/api/provinsi', provinsi);
  app.use('/api/kota', kota);
  app.use('/api/area', area);
  app.use('/api/item', item);
  app.use('/api/item-code', itemCode);
  app.use('/api/slider', slider);
  app.use('/api/banner', banner);

  // Transaksi
  app.use('/api/customer-po', customerPo);

  // Patch
  app.use('/api/patch-data', patchData);

  app.use(error);
}