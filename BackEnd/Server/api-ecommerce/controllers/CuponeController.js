import models from "../models"

export default {
    register: async(req,res) => {
        try {
            let data = req.body;

            let exists_cupone = await models.Cupone.findOne({code: data.code});
            if(exists_cupone){
                res.status(200).json({
                    message:403,
                    message_text: "EL CÓDIGO DE CUPÓN YA EXISTE"
                });
                return;
            }
            let cupone = await models.Cupone.create(data);

            res.status(200).json({
                message:403,
                message_text: "EL CUPÓN SE HA REGISTRADO CORRECTAMENTE"
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

            let exists_cupone = await models.Cupone.findOne({code: data.code,_id: {$ne: data._id}});
            if(exists_cupone){
                res.status(200).json({
                    message:403,
                    message_text: "EL CÓDIGO DE CUPÓN YA EXISTE",
                });
                return;
            }
            let cupone = await models.Cupone.findByIdAndUpdate({_id:data._id},data);

            let cuponeT = await models.Cupone.findById({_id:data._id});

            res.status(200).json({
                message:200,
                message_text: "EL CUPÓN SE HA ACTUALIZADO CORRECTAMENTE",
                cupone: cuponeT,
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

            await models.Cupone.findByIdAndDelete({_id: _id});

            res.status(200).json({
                message:200,
                message_text: "EL CUPÓN SE ELIMINÓ CORRECTAMENTE",
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
            let search = req.query.search;

            let cupones = await models.Cupone.find(
                {
                    $or:[
                        {"code":new RegExp(search, "i")},
                    ]
                }
            ).sort({'createdAt':-1});;

            res.status(200).json({
                message:200,
                cupones: cupones,
            })
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
}