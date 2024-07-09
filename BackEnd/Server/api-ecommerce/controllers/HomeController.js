import models from "../models";
import resource from "../resource";

export default {
 list:async(req,res) => {
    try {
        var TIME_NOW = req.query.TIME_NOW;
        let Sliders = await models.Slider.find({state:1});

        Sliders = Sliders.map((slider)=>{
            return resource.Slider.slider_list(slider);
        })

        let Categories = await models.Category.find({state:1});
        Categories = Categories.map((category)=>{
            return resource.Category.category_list(category);
        })

        let BestProducts = await models.Product.find({state:2}).sort({"createdAt": -1});
        var ObjectBestProducts = [];
        for (const Product of BestProducts) {
            let VARIEDADES = await models.Variedad.find({product:Product._id});
            ObjectBestProducts.push(resource.Product.product_list(Product,VARIEDADES));
        }

        let OurProducts = await models.Product.find({state:2}).sort({"createdAt": 1});

        var ObjectOurProducts = [];
        for (const Product of OurProducts) {
            let VARIEDADES = await models.Variedad.find({product:Product._id});
            ObjectOurProducts.push(resource.Product.product_list(Product,VARIEDADES));
        }

        // OurProducts = OurProducts.map(async (product)=>{
        //     let VARIEDADES = await models.Variedad.find({product:product._id});
        //     return resource.Product.product_list(product,VARIEDADES);
        // })

        let FlashSale = await models.Discount.findOne({
            type_campaign: 2,
            start_date_num:{$lte:TIME_NOW},
            end_date_num:{$gte:TIME_NOW},
        });

        let ProductList = [];
        if(FlashSale){
            for (const product of FlashSale.products) {
                var ObjectT = await models.Product.findById({_id:product._id});
                let VARIEDADES = await models.Variedad.find({product:product._id});
                ProductList.push(resource.Product.product_list(ObjectT,VARIEDADES));
            }
        }
        console.log(FlashSale);
        res.status(200).json({
            sliders: Sliders,
            categories:Categories,
            best_products:ObjectBestProducts,
            our_products:ObjectOurProducts,
            FlashSale:FlashSale,
            campaign_products:ProductList,
        });

    } catch (error) {
        res.status(500).send({
            message: "OCURRIÓ UN ERROR"
        });
        console.log(error);
    }
 },
 show_landing_product:async(req,res) =>{
    try {
        let SLUG = req.params.slug;

        let Product = await models.Product.findOne({slug:SLUG,state:2});

        let VARIEDADES = await models.Variedad.find({product:Product._id});

        let RelatedProducts = await models.Product.find({category: Product.category,state:2});

        var ObjectRelatedProducts = [];
        for (const Product of RelatedProducts) {
            let VARIEDADES = await models.Variedad.find({product:Product._id});
            ObjectRelatedProducts.push(resource.Product.product_list(Product,VARIEDADES));
        }

        res.status(200).json({
            product: resource.Product.product_list(Product,VARIEDADES),
            related_products: ObjectRelatedProducts,
        })
    } catch (error) {
        res.status(500).send({
            message: "OCURRIÓ UN ERROR"
        });
        console.log(error);
    }
 },
}