import mongoose,{Schema} from "mongoose";

const ReviewSchema = new Schema({
    product:{type:Schema.ObjectId, ref: 'product', required:true},
    sale_detail:{type:Schema.ObjectId, ref: 'sale_detail', required:true},
    user:{type:Schema.ObjectId, ref: 'user', required:true},
    cantidad:{type:Number,maxlenght:2,default:0},
    description:{type:String,required:true},
},{
    timestamps:true
});

const Review = mongoose.model("review",ReviewSchema);

export default Review;