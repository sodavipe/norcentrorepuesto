import mongoose,{Schema} from "mongoose";

const SliderSchema = new Schema({
    title:{type:String,maxlenght: 250, required:true},
    link:{type:String,maxlenght: 250, required:true},
    imagen:{type:String,maxlenght: 250, required:true},
    state:{type:Number,maxlenght:2,default:1},
},{
    timestamps:true
});

const Slider = mongoose.model("sliders",SliderSchema);

export default Slider;