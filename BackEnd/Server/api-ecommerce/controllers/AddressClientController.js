import models from "../models";

export default{
    register:async(req,res)=>{
        try {
            const address_client = await models.AddressClient.create(req.body);
            res.status(200).json({
                message: "LA DIRECCIÓN DEL CLIENTE SE HA REGISTRADO CORRECTAMENTE",
                address_client: AddressClient,
            });
        } catch (error) {
            res.status(500).send({
                message:"OCURRIÓ UN ERROR",
            });
        }
    },
    update:async(req,res)=>{
        try {
            let AddressClient = await models.AddressClient.findOne({_id: req.body._id});

            res.status(200).json({
                message: "LA DIRECCIÓN DEL CLIENTE SE HA MODIFICADO CORRECTAMENTE",
                address_client: AddressClient,
            });
        } catch (error) {
            res.status(500).send({
                message:"OCURRIÓ UN ERROR",
            });
        }
    },
    list:async(req,res)=>{
        try {
            let ADDRESS_CLIENT = await models.AddressClient.find({user: req.query.user_id}).sort({'createdAt':-1});

            res.status(200).json({
                address_client: ADDRESS_CLIENT
            });
        } catch (error) {
            res.status(500).send({
                message:"OCURRIÓ UN ERROR",
            });
        }
    },
    remove:async(req,res)=>{
        try {
            await models.AddressClient.findByIdAndDelete({_id:req.query._id})
            res.status(200).json({
                message: "LA DIRECCIÓN DEL CLIENTE SE ELIMINÓ CORRECTAMENTE"
            });
        } catch (error) {
            res.status(500).send({
                message:"OCURRIÓ UN ERROR",
            });
        }
    },
}