import mongoose,{Schema} from "mongoose";

const ProductSchema = new Schema({
    title:{type:String,required:true,maxlenght:250},
    slug:{type:String,required:true,maxlenght:1000},
    sku:{type:String,required:true},
    category:{type:Schema.ObjectId,ref:'category',required:true},
    price_soles:{type:Number,required:true},
    price_usd:{type:Number,required:true},
    portada:{type:String,required:true},
    galerias:[{type:Object,required:false}],
    state:{type:Number,default:1},//1 es en prueba o desarrollo y 2 es que es público y 3 es que está anulado (cuando no está en stock)
    stock:{type:Number,default:0},
    description:{type:String,required:true},
    resumen:{type:String,required:true},
    tags:{type:String,required:true},
    type_inventario:{type:Number,default:1},
},{
    timestamps:true,
});

const Product = mongoose.model('product',ProductSchema);
export default Product;