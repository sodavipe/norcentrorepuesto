import mongoose,{Schema} from "mongoose";

const CategorySchema = new Schema({
    title:{type:String,maxlenght: 250, required:true},
    imagen:{type:String,maxlenght: 250, required:true},
    state:{type:Number,maxlenght:2,default:1},
},{
    timestamps:true
});

const Category = mongoose.model("category",CategorySchema);

export default Category;