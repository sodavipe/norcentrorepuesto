import mongoose,{Schema} from "mongoose";

const CuponeSchema = new Schema({
    code:{type:String,maxlenght:50,required:true},
    type_discount:{type:Number,default:1,required:true}, //por moneda (1) o porcentaje (2)
    discount:{type:Number, required:true}, //por porcentaje o 2 moneda
    type_count:{type:Number, required:true,default:1}, // ilimitado va a ser 1 o limitado va a ser 2
    num_use:{type:Number, required:false},
    type_segment:{type:Number, required:false, default:1}, // cupon por producto va a ser 1 y cupón por categoria va a ser 2
    state:{type:Number, required:false,default:1}, // 1 es activo, 0 es desactivado
    products:[{type:Object}],
    categories:[{type:Object}],
},{
    timestamps:true
});

const Cupone = mongoose.model("cupone",CuponeSchema);

export default Cupone;