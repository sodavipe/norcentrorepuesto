import models from "../models"

export default {
    register: async(req,res) => {
        try {
            let data = req.body;
            var filter_a = [];
            var filter_b = [];
            //product_s = ["id","id"]
            //category_s = ["id","id"]
            if(data.type_segment == 1){
                filter_a.push({
                 "products": {$elemMatch: {_id: {$in: data.product_s}}}
                });
                filter_b.push({
                    "products": {$elemMatch: {_id: {$in: data.product_s}}}
                   });
            }else{
                filter_a.push({
                    "categories": {$elemMatch: {_id: {$in: data.category_s}}}
                });
                filter_b.push({
                    "categories": {$elemMatch: {_id: {$in: data.category_s}}}
                });
            }
            filter_a.push({
                start_date_num: {$gte: data.start_date_num,$lte: data.end_date_num}
            })
            filter_b.push({
                end_date_num: {$gte: data.start_date_num,$lte: data.end_date_num}
            })
            let exists_start_date = await models.Discount.find({$and: filter_a});

            let exists_end_date = await models.Discount.find({$and: filter_b});
            if(exists_start_date.length > 0 || exists_end_date.length  > 0){
                res.status(200).json({
                    message:403,
                    message_text: "EL DESCUENTO NO SE PUEDE PROGRAMAR, ELIMINAR ALGUNAS OPCIONES"
                });
                return;
            }
            let discount = await models.Discount.create(data);

            res.status(200).json({
                message:200,
                message_text: "EL DESCUENTO SE HA REGISTRADO CORRECTAMENTE",
                discount:discount,
            })
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    update: async(req,res) => {
        try {
            let data = req.body;
            var filter_a = [];
            var filter_b = [];
            //product_s = ["id","id"]
            //category_s = ["id","id"]
            if(data.type_segment == 1){
                filter_a.push({
                    _id:  {$ne: data._id},
                    "products": {$elemMatch: {_id: {$in: data.product_s}}}
                });
                filter_b.push({
                    _id:  {$ne: data._id},
                    "products": {$elemMatch: {_id: {$in: data.product_s}}}
                   });
            }else{
                filter_a.push({
                    "categories": {$elemMatch: {_id: {$in: data.category_s}}}
                });
                filter_b.push({
                    "categories": {$elemMatch: {_id: {$in: data.category_s}}}
                });
            }
            filter_a.push({
                start_date_num: {$gte: data.start_date_num,$lte: data.end_date_num}
            })
            filter_b.push({
                end_date_num: {$gte: data.start_date_num,$lte: data.end_date_num}
            })
            let exists_start_date = await models.Discount.find({$and: filter_a});

            let exists_end_date = await models.Discount.find({$and: filter_b});
            if(exists_start_date.length > 0 || exists_end_date.length  > 0){
                res.status(200).json({
                    message:403,
                    message_text: "EL DESCUENTO NO SE PUEDE PROGRAMAR, ELIMINAR ALGUNAS OPCIONES"
                });
                return;
            }
            let discount = await models.Discount.findByIdAndUpdate({_id:data._id},data);

            res.status(200).json({
                message:200,
                message_text: "EL DESCUENTO SE HA REGISTRADO CORRECTAMENTE",
                discount:discount,
            })
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    delete: async(req,res) => {
        try {
            let _id = req.query._id;

            await models.Discount.findByIdAndDelete({_id: _id});

            res.status(200).json({
                message:200,
                message_text: "EL DESCUENTO SE ELIMINÓ CORRECTAMENTE",
            })
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    list: async(req,res) => {
        try {
            //let search = req.query.search;

            let discounts = await models.Discount.find().sort({'createdAt':-1});;

            res.status(200).json({
                message:200,
                discounts: discounts,
            })
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    show: async(req,res) => {
        try {
            let discount_id = req.query.discount_id;

            let discount = await models.Discount.findOne({_id: discount_id});

            res.status(200).json({
                message:200,
                discount: discount,
            })
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    config: async(req,res) => {
        try {
            let Products = await models.Product.find({state:2});
            let Categories = await models.Category.find({state:1});
            res.status(200).json({
                message:200,
                products: Products,
                categories: Categories,
            })
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
}