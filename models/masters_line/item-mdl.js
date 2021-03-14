const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const metalColourDetail = new mongoose.Schema({
  metal_id: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  colour_type_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  nickel_content_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  }
});

const finishTypeDetail = new mongoose.Schema({
  finish_id: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  finish_type_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  }
});

const chainTypeDetail = new mongoose.Schema({
  chain_id: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  chain_type_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  chain_length: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  chain_weight: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  chain_extra_detail: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 100
  },
  chain_gauge: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  chain_width: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  }
});

const findingDetail = new mongoose.Schema({
  finding_id: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  specify_finding_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  }
});

const stoneDetail = new mongoose.Schema({
  stone_id: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  stone_category_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  stone_type_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  stone_colour_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  stone_certificate: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 100
  },
  cut_stone_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  stone_shape_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  stone_size: {
    type: String,
    uppercase: true,
    required: true
  },
  stone_grade_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  stone_origin_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  stone_calculation: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  stone_carat_weight: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  stone_price: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  stone_qty: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  treatment_stone: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  stone_carat_subtotal: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  stone_price_subtotal: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  }
});

const platingDetail = new mongoose.Schema({
  plating_id: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  plating_metal_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  plating_colour_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  micron: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  }
});

const sizeDetail = new mongoose.Schema({
  size_id: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  size: {
    type: Number,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  nett_weight: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  gross_weight: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const materialDetail = new mongoose.Schema({
  material_id: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  metal_title_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  loss: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 1024
  },
  metal_loss: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 1024
  },
  measure_name: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 1024
  },
  type_kadar: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  kadar: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  price: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  size: [
    sizeDetail
  ],
  total_nett_weight: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  total_gross_weight: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const gambarDetail = new mongoose.Schema({
  gambar_id: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  kode_gambar: {
    type: String,
    required: true, 
    uppercase: true
  },
  lokasi_gambar: {
    type: String,
    uppercase: true,
    required: true
  }
});

const gambar360Detail = new mongoose.Schema({
  gambar_id: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  kode_gambar: {
    type: String,
    required: true, 
    uppercase: true
  },
  lokasi_gambar: {
    type: String,
    uppercase: true,
    required: true
  }
});

const minOrderQtyDetail = new mongoose.Schema({
  min_order_qty_id: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  units_quote_data: {
    type: Number,
    required: true, 
    minlength: 1, 
    maxlength: 60
  },
  grams_quote_data: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1, 
    maxlength: 60
  },
  total_po_value:{
    type: Number,
    required: true,
    minlength: 1, 
    maxlength: 60
  }
});

const hashtagDetail = new mongoose.Schema({
  hashtag: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 250
  }
});

const itemSchema = new mongoose.Schema({
  code_item: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 200
  },
  item_name: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 1024
  },
  gambar: [
    gambarDetail
  ],
  gambar360: [
    gambar360Detail
  ],
  material_type_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  sell_method_name: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 100
  },
  sell_currency_name : {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  metalcolour: [
    metalColourDetail
  ],
  sample_type_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  category_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  qty_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 30
  },
  keywords: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 1024
  },
  width_item: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  height_item: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  depth_item: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  gauge_item: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  material: [
    materialDetail
  ],
  finishtype :[
    finishTypeDetail
  ],
  stone: [
    stoneDetail
  ],
  plating_method_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  guaranteed: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  plating: [
    platingDetail
  ],
  finding: [
    findingDetail
  ],
  chaintype: [
    chainTypeDetail
  ],
  quote_price: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  weight_tolerance: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  sample_lead_time: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  product_lead_time: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  min_order_qty: [
    minOrderQtyDetail
  ],
  hashtag:[],
  privacy: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
	jenis_privacy: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
	selected_customer: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  selected_market:[],
  deskripsi_banner:[],
  status_show: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  tgl_show: {
    type: Date
  },
  status_active: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  active_date: {
    type: Date
  },
  input_by: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  input_date: {
    type: Date, default: Date.now()
  },
  edit_by: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60 
  },
  edit_date: {
    type: Date, default: Date.now()
  },
});

const hashtagSchema = new mongoose.Schema({
  hashtag: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 1024
  }
});

const Item = mongoose.model('tm_item', itemSchema, 'tm_item');
const Hashtag = mongoose.model('tm_hashtag', hashtagSchema, 'tm_hashtag');

const fieldsItem = {
  "code_item":"$code_item",
  "item_name":"$item_name",
  "gambar":"$gambar",
  "gambar360":"$gambar360",
  "material_type_code":"$material_type_code",
  "sell_method_name":"$sell_method_name",
  "sell_currency_name":"$sell_currency_name",
  "metalcolour":"$metalcolour",
  "sample_type_code":"$sample_type_code",
  "sample_type_name":"$item.sample_type_name",
  "category_code":"$category_code",
  "qty_code":"$qty_code",
  "keywords":"$keywords",
  "width_item":"$width_item",
  "height_item":"$height_item",
  "depth_item":"$depth_item",
  "gauge_item":"$gauge_item",
  "material":"$material",
  "total_nett_weight":"$total_nett_weight",
  "total_gross_weight":"$total_gross_weight",
  "finishtype":"$finishtype",
  "stone":"$stone",
  "plating_method_code":"$plating_method_code",
  "guaranteed":"$guaranteed",
  "plating":"$plating",
  "finding":"$finding",
  "chaintype":"$chaintype",
  "quote_price":"$quote_price",
  "weight_tolerance":"$weight_tolerance",
  "sample_lead_time":"$sample_lead_time",
  "product_lead_time":"$product_lead_time",
  "min_order_qty":"$min_order_qty",
  "hashtag":["$hashtag"],
  "type_kadar":"$type_kadar",
  "kadar":"$kadar",
  "price":"$price",
  "privacy":"$privacy",
  "jenis_privacy":"$jenis_privacy",
  "selected_customer":"$selected_customer",
  "selected_market":["$selected_market"],
  "deskripsi_banner":["$deskripsi_banner"],
  "status_show":"$status_show",
  "tgl_show":"$tgl_show",
  "status_active":"$status_active",
  "active_date":"$active_date",
  "input_by":"$input_by",
  "input_date":"$input_date",
  "edit_by":"$edit_by",
  "edit_date":"$edit_date"
}

const fieldsItemGambar ={
  "code_item":"$code_item",
  "gambar360":"$gambar360",
}

const fieldsHashtag ={
  "hashtag":"$hashtag"
}

const fieldsItem2 = {
  "code_item":"$code_item"
}

function validateItemAdd(data) {
  const gambar = Joi.object({
    gambar_id: Joi.string().min(1).max(60).required(),
    kode_gambar: Joi.string().required(),
    lokasi_gambar: Joi.string().required()
  }).required();

  const gambar360 = Joi.object({
    gambar_id: Joi.string().min(1).max(60).required(),
    kode_gambar: Joi.string().required(),
    lokasi_gambar: Joi.string().required()
  }).required();

  const metalcolour = Joi.object({
    metal_id: Joi.string().min(1).max(60).required(),
    colour_type_code: Joi.string().min(1).max(100).required(),
    nickel_content_code: Joi.string().min(1).max(100).required()
  }).required();

  const size = Joi.object({
    size_id: Joi.string().min(1).max(60).required(),
    size: Joi.number().required(),
    nett_weight: Joi.number().required(),
    gross_weight: Joi.number().required()
  }).required();

  const material = Joi.object({
    material_id: Joi.string().min(1).max(60).required(),
    metal_title_code: Joi.string().min(1).max(100).required(),
    loss: Joi.number().required(),
    metal_loss: Joi.string().min(1).max(1024).required(),
    measure_name: Joi.string().min(1).max(1024).required(),
    type_kadar: Joi.string().min(1).max(60).required(),
    kadar: Joi.number().required(),
    price: Joi.number().required(),
    size: Joi.array().items(size).required(),
    total_nett_weight: Joi.number().required(),
    total_gross_weight: Joi.number().required(),
  }).required();

  const finishtype = Joi.object({
    finish_id: Joi.string().min(1).max(60).required(),
    finish_type_code: Joi.string().min(1).max(100).required()
  }).required();

  const stone = Joi.object({
    stone_id: Joi.string().min(1).max(60).required(),
    stone_category_code: Joi.string().min(1).max(100).required(),
    stone_type_code: Joi.string().min(1).max(100).required(),
    stone_colour_code: Joi.string().min(1).max(100).required(),
    stone_certificate: Joi.string().min(1).max(100).required(),
    cut_stone_code: Joi.string().min(1).max(100).required(),
    stone_shape_code: Joi.string().min(1).max(100).required(),
    stone_size: Joi.string().required(),
    stone_grade_code: Joi.string().min(1).max(100).required(),
    stone_origin_code: Joi.string().min(1).max(100).required(),
    stone_calculation: Joi.string().min(1).max(60).required(),
    stone_carat_weight:Joi.number().required(),
    stone_price: Joi.number().required(),
    stone_qty: Joi.number().required(),
    treatment_stone: Joi.string().min(1).max(60).required(),
    stone_carat_subtotal: Joi.number().required(),
    stone_price_subtotal: Joi.number().required()
  }).required();

  const plating = Joi.object({
    plating_id: Joi.string().min(1).max(60).required(),
    plating_metal_code: Joi.string().min(1).max(100).required(),
    plating_colour_code: Joi.string().min(1).max(100).required(),
    micron: Joi.number().required()
  }).required();

  const finding = Joi.object({
    finding_id: Joi.string().min(1).max(60).required(),
    specify_finding_code: Joi.string().min(1).max(100).required()
  }).required();

  const chaintype = Joi.object({
    chain_id: Joi.string().min(1).max(60).required(),
    chain_type_code: Joi.string().min(1).max(100).required(),
    chain_length: Joi.number().required(),
    chain_weight: Joi.number().required(),
    chain_extra_detail: Joi.number().required(),
    chain_gauge: Joi.number().required(),
    chain_width: Joi.number().required()
  }).required();

  const min_order_qty = Joi.object({
    min_order_qty_id: Joi.string().min(1).max(60).required(),
    units_quote_data: Joi.number().required(),
    grams_quote_data: Joi.number().required(),
    total_po_value: Joi.number().required()
  }).required();

  const schema = Joi.object({
    code_item: Joi.string().min(1).max(100).required(),
    item_name: Joi.string().min(1).max(100).required(),
    gambar: Joi.array().items(gambar).required(),
    gambar360: Joi.array().items(gambar360).required(),
    material_type_code: Joi.string().min(1).max(100).required(),
    sell_method_name: Joi.string().min(1).max(100).required(),
    sell_currency_name: Joi.string().min(1).max(60).required(),
    metalcolour: Joi.array().items(metalcolour).required(),
    sample_type_code: Joi.string().min(1).max(100).required(),
    category_code: Joi.string().min(1).max(100).required(),
    qty_code: Joi.string().min(1).max(30).required(),
    keywords: Joi.string().min(1).max(1024).required(),
    width_item: Joi.number().required(),
    height_item: Joi.number().required(),
    depth_item: Joi.number().required(),
    gauge_item: Joi.number().required(),
    material: Joi.array().items(material).required(),
    finishtype: Joi.array().items(finishtype).required(),
    stone: Joi.array().items(stone).required(),
    plating_method_code: Joi.string().min(1).max(100).required(),
    guaranteed: Joi.string().min(1).max(60).required(),
    plating: Joi.array().items(plating).required(),
    finding: Joi.array().items(finding).required(),
    chaintype: Joi.array().items(chaintype).required(),
    quote_price: Joi.number().required(),
    weight_tolerance: Joi.number().required(),
    sample_lead_time: Joi.number().required(),
    product_lead_time: Joi.number().required(),
    min_order_qty: Joi.array().items(min_order_qty).required(),
    hashtag: Joi.array().required(),
    privacy: Joi.string().min(1).max(60).required(),
    jenis_privacy: Joi.string().min(1).max(60).required(),
    selected_customer: Joi.string().min(1).max(60).required(),
    selected_market: Joi.array().required()
  }).required();

  return schema.validate(data); 
}

function validateItemEdit(data) {
  const gambar = Joi.object({
    gambar_id: Joi.string().min(1).max(60).required(),
    kode_gambar: Joi.string().required(),
    lokasi_gambar: Joi.string().required()
  }).required();

  const gambar360 = Joi.object({
    gambar_id: Joi.string().min(1).max(60).required(),
    kode_gambar: Joi.string().required(),
    lokasi_gambar: Joi.string().required()
  }).required();

  const metalcolour = Joi.object({
    metal_id: Joi.string().min(1).max(60).required(),
    colour_type_code: Joi.string().min(1).max(100).required(),
    nickel_content_code: Joi.string().min(1).max(100).required()
  }).required();

  const size = Joi.object({
    size_id: Joi.string().min(1).max(60).required(),
    size: Joi.number().required(),
    nett_weight: Joi.number().required(),
    gross_weight: Joi.number().required()
  }).required();

  const material = Joi.object({
    material_id: Joi.string().min(1).max(60).required(),
    metal_title_code: Joi.string().min(1).max(100).required(),
    loss: Joi.number().required(),
    metal_loss: Joi.string().min(1).max(1024).required(),
    measure_name: Joi.string().min(1).max(1024).required(),
    type_kadar: Joi.string().min(1).max(60).required(),
    kadar: Joi.number().required(),
    price: Joi.number().required(),
    size: Joi.array().items(size).required(),
    total_nett_weight: Joi.number().required(),
    total_gross_weight: Joi.number().required(),
  }).required();

  const finishtype = Joi.object({
    finish_id: Joi.string().min(1).max(60).required(),
    finish_type_code: Joi.string().min(1).max(100).required()
  }).required();

  const stone = Joi.object({
    stone_id: Joi.string().min(1).max(60).required(),
    stone_category_code: Joi.string().min(1).max(100).required(),
    stone_type_code: Joi.string().min(1).max(100).required(),
    stone_colour_code: Joi.string().min(1).max(100).required(),
    stone_certificate: Joi.string().min(1).max(60).required(),
    cut_stone_code: Joi.string().min(1).max(100).required(),
    stone_shape_code: Joi.string().min(1).max(100).required(),
    stone_size: Joi.string().required(),
    stone_grade_code: Joi.string().min(1).max(100).required(),
    stone_origin_code: Joi.string().min(1).max(100).required(),
    stone_calculation: Joi.string().min(1).max(60).required(),
    stone_carat_weight: Joi.number().required(),
    stone_price: Joi.number().required(),
    stone_qty: Joi.number().required(),
    treatment_stone: Joi.string().min(1).max(60).required(),
    stone_carat_subtotal: Joi.number().required(),
    stone_price_subtotal: Joi.number().required()
  }).required();

  const plating = Joi.object({
    plating_id: Joi.string().min(1).max(60).required(),
    plating_metal_code: Joi.string().min(1).max(100).required(),
    plating_colour_code: Joi.string().min(1).max(100).required(),
    micron: Joi.number().required()
  }).required();

  const finding = Joi.object({
    finding_id: Joi.string().min(1).max(60).required(),
    specify_finding_code: Joi.string().min(1).max(100).required()
  }).required();

  const chaintype = Joi.object({
    chain_id: Joi.string().min(1).max(60).required(),
    chain_type_code: Joi.string().min(1).max(100).required(),
    chain_length: Joi.number().required(),
    chain_weight: Joi.number().required(),
    chain_extra_detail: Joi.number().required(),
    chain_gauge: Joi.number().required(),
    chain_width: Joi.number().required()
  }).required();
  
  const min_order_qty = Joi.object({
    min_order_qty_id: Joi.string().min(1).max(60).required(),
    units_quote_data: Joi.number().required(),
    grams_quote_data: Joi.number().required(),
    total_po_value: Joi.number().required()
  }).required();

  const schema = Joi.object({
    code_item: Joi.string().min(1).max(40).required(),
    item_name: Joi.string().min(1).max(100).required(),
    gambar: Joi.array().items(gambar).required(),
    gambar360: Joi.array().items(gambar360).required(),
    material_type_code: Joi.string().min(1).max(60).required(),
    sell_method_name: Joi.string().min(1).max(60).required(),
    sell_currency_name: Joi.string().min(1).max(60).required(),
    metalcolour: Joi.array().items(metalcolour).required(),
    sample_type_code: Joi.string().min(1).max(100).required(),
    category_code: Joi.string().min(1).max(100).required(),
    qty_code: Joi.string().min(1).max(50).required(),
    keywords: Joi.string().min(1).max(1024).required(),
    width_item: Joi.number().required(),
    height_item: Joi.number().required(),
    depth_item: Joi.number().required(),
    gauge_item: Joi.number().required(),
    material: Joi.array().items(material).required(),
    finishtype: Joi.array().items(finishtype).required(),
    stone: Joi.array().items(stone).required(),
    plating_method_code: Joi.string().min(1).max(100).required(),
    guaranteed: Joi.string().min(1).max(60).required(),
    plating: Joi.array().items(plating).required(),
    finding: Joi.array().items(finding).required(),
    chaintype: Joi.array().items(chaintype).required(),
    quote_price: Joi.number().required(),
    weight_tolerance: Joi.number().required(),
    sample_lead_time: Joi.number().required(),
    product_lead_time: Joi.number().required(),
    min_order_qty: Joi.array().items(min_order_qty).required(),
    hashtag: Joi.array().required(),
    privacy: Joi.string().min(1).max(60).required(),
    jenis_privacy: Joi.string().min(1).max(60).required(),
    selected_customer: Joi.string().min(1).max(60).required(),
    selected_market: Joi.array().required()
  }).required();

  return schema.validate(data); 
}

function validateSearchByItemname(data) {
  const schema = Joi.object({
    item_name: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validateSearchByItemname2(data) {
  const schema = Joi.object({
    item_name: Joi.string().min(1).max(60).required(),
    limit_from: Joi.number().required(),
    limit_item: Joi.number().required(),
    kode_customer: Joi.string().min(1).max(60).required(),
    negara: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validateSearchByHashtag(data) {
  const schema = Joi.object({
    hashtag: Joi.string().min(1).max(60).required(),
    limit_from: Joi.number().required(),
    limit_item: Joi.number().required(),
    kode_customer: Joi.string().min(1).max(60).required(),
    negara: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validateSearchByTagName(data) {
  const schema = Joi.object({
    contents: Joi.string().min(1).max(60).required(),
    limit_from: Joi.number().required(),
    limit_item: Joi.number().required(),
    kode_customer: Joi.string().min(1).max(60).required(),
    negara: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validateSearchListHashtag(data) {
  const schema = Joi.object({
    hashtag: Joi.string().min(1).max(60).required(),
    limit_from: Joi.number().required(),
    limit_item: Joi.number().required()
  }).required();

  return schema.validate(data); 
}

function validateListCategory(data) {
  const schema = Joi.object({
    limit_from: Joi.number().required(),
    limit_item: Joi.number().required(),
    kode_customer: Joi.string().min(1).max(60).required(),
    negara: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validateSearchByCategory(data) {
  const schema = Joi.object({
    category_code: Joi.string().min(1).max(60).required(),
    limit_from: Joi.number().required(),
    limit_item: Joi.number().required(),
    kode_customer: Joi.string().min(1).max(60).required(),
    negara: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validateSearchByPrice(data) {
  const schema = Joi.object({
    limit_start: Joi.number().required(),
    limit_finish: Joi.number().required(),
    limit_from: Joi.number().required(),
    limit_item: Joi.number().required(),
    kode_customer: Joi.string().min(1).max(60).required(),
    negara: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validateSearchByPriceWeight(data) {
  const schema = Joi.object({
    limit_start_weight: Joi.number().required(),
    limit_finish_weight: Joi.number().required(),
    limit_start_price: Joi.number().required(),
    limit_finish_price: Joi.number().required(),
    limit_from: Joi.number().required(),
    limit_item: Joi.number().required(),
    kode_customer: Joi.string().min(1).max(60).required(),
    negara: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validateSearchLine(data) {
  const schema = Joi.object({
    category: Joi.string().min(1).max(60).required(),
    limit_start_weight: Joi.number().required(),
    limit_finish_weight: Joi.number().required(),
    limit_from: Joi.number().required(),
    limit_item: Joi.number().required()
  }).required();

  return schema.validate(data); 
}

// Register Ke showroom
function validateRegisterSR(data) {
  const code = Joi.object({
    code_item: Joi.string().min(1).max(60).required()
  }).required();

  const schema = Joi.object({
    code: Joi.array().items(code).required()
  }).required();

  return schema.validate(data); 
}

exports.Item = Item; 
exports.Hashtag = Hashtag;

exports.fieldsItem = fieldsItem;
exports.fieldsHashtag = fieldsHashtag;
exports.fieldsItemGambar = fieldsItemGambar;
exports.fieldsItem2 = fieldsItem2;
exports.validateItemAdd = validateItemAdd;
exports.validateItemEdit = validateItemEdit;
exports.validateSearchByItemname = validateSearchByItemname;
exports.validateSearchByItemname2 = validateSearchByItemname2;
exports.validateSearchByHashtag = validateSearchByHashtag;
exports.validateSearchListHashtag = validateSearchListHashtag;
exports.validateListCategory = validateListCategory;
exports.validateSearchByCategory = validateSearchByCategory;
exports.validateSearchByPrice = validateSearchByPrice;
exports.validateSearchByTagName = validateSearchByTagName;
exports.validateSearchByPriceWeight = validateSearchByPriceWeight;
exports.validateSearchLine = validateSearchLine;
exports.validateRegisterSR = validateRegisterSR;