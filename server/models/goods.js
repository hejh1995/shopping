var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var productSchema = new Schema({
// 定义商品模型
// 可以给参数设置需要验证
// required: 数据必须填写
// default: 默认值
// validate: 自定义匹配
// min: 最小值(只适用于数字)
// max: 最大值(只适用于数字)
// match: 正则匹配(只适用于字符串)
// enum:  枚举匹配(只适用于字符串)
  "productionId": String,
  "productName":'string',
  "salePrice":Number,
  "checked":String,
  "productNum":Number,
  "productImage":String
});
// 如果需要在Schema定义后添加其他字段，可以使用add()方法
// MySchema.add({ name: 'string', color: 'string', price: 'number' });

// 模型名称为Good，则集合名称为goods。
module.exports = mongoose.model('Good', productSchema);
