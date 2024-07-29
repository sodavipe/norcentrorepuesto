import mongoose,{Schema} from "mongoose";

const SalesAddressSchema = new Schema({
    sale:{type:Schema.ObjectId,ref:'sale',required:true},
    name:{type:String,maxlenght: 250, required:true},
    surname:{type:String,maxlenght: 250, required:true},
    pais:{type:String,maxlenght: 250, required:true},
    address:{type:String,maxlenght: 250, required:true},
    referencia:{type:String,maxlenght: 250, required:false},
    ciudad:{type:String,maxlenght: 250, required:true},
    region:{type:String,maxlenght: 250, required:true},
    telefono:{type:String,maxlenght: 250, required:true},
    email:{type:String,maxlenght: 250, required:true},
    nota:{type:String, required:false},
},{
    timestamps:true
});

const SaleAddress = mongoose.model("sale_address",SalesAddressSchema);

export default SaleAddress;