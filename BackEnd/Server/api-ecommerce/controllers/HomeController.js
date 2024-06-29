import models from "../models";
import resource from "../resource";

export default {
 list:async(req,res) => {
    try {
        let Sliders = await models.Slider.find({state:1});

        Sliders = Sliders.map((slider)=>{
            return resource.Slider.slider_list(slider);
        })

        let Categories = await models.Category.find({state:1});
        Categories = Categories.map((category)=>{
            return resource.Category.category_list(category);
        })

        let BestProducts = await models.Product.find({state:2}).sort({"createdAt": -1});
        BestProducts = BestProducts.map((product)=>{
            return resource.Product.product_list(product);
        })

        let OurProducts = await models.Product.find({state:2}).sort({"createdAt": 1});
        OurProducts = OurProducts.map((product)=>{
            return resource.Product.product_list(product);
        })

        res.status(200).json({
            sliders: Sliders,
            categories:Categories,
            best_products:BestProducts,
            our_products:OurProducts,
        });

    } catch (error) {
        res.status(500).send({
            message: "OCURRIÓ UN ERROR"
        });
        console.log(error);
    }
 }
}