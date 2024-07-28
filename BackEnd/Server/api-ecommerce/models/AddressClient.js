import mongoose,{Schema} from "mongoose";

const AddressClientSchema = new Schema({
    user:{type:Schema.ObjectId,ref:'user',required:true},
    namet:{type:String,maxlenght: 250, required:true},
    surname:{type:String,maxlenght: 250, required:true},
    pais:{type:String,maxlenght: 250, required:true},
    address:{type:String,maxlenght: 250, required:true},
    ref:{type:String,maxlenght: 250, required:false},
    ciudad:{type:String,maxlenght: 250, required:true},
    region:{type:String,maxlenght: 250, required:true},
    telefono:{type:String,maxlenght: 250, required:true},
    email:{type:String,maxlenght: 250, required:true},
    nota:{type:String, required:false},
},{
    timestamps:true
});

const AddressClient = mongoose.model("address_client",AddressClientSchema);

export default AddressClient;