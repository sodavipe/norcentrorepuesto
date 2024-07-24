import models from "../models";
import resource from "../resource";

export default {
    list:async(req,res) => {
        try {
            let user_id = req.query.user_id;
            let CARTS = await models.Cart.find({
                user:user_id,
            }).populate("variedad").populate({
                path:"product",
                populate:{
                    path:"category"
                },
            });

            CARTS = CARTS.map((cart)=>{
                return resource.Cart.cart_list(cart);
            });

            res.status(200).json({
                carts: CARTS,
            })
        } catch (error) {
            res.status(500).send({
                message:"OCURRIÓ UN ERROR",
            });
            console.log(error);
        }
    },
    register:async(req,res) => {
        try {
            let data = req.body;
            //VALIDAMOS SI EL PRODUCTO EXISTE EN EL CARRITO DE COMPRA
            if(data.variedad){
                let valid_cart = await models.Cart.findOne({
                    user: data.user,
                    variedad: data.variedad,
                    product: data.product,
                })
                if(valid_cart){
                    res.status(200).json({
                        message:403,
                        message_text: "EL PRODUCTO CON LA VARIEDAD YA EXISTE EN EL CARRITO DE COMPRA"
                    });
                    return;
                }
            }else{
                let valid_cart = await models.Cart.findOne({
                    user: data.user,
                    product: data.product,
                });
                if(valid_cart){
                    res.status(200).json({
                        message:403,
                        message_text: "EL PRODUCTO YA EXISTE EN EL CARRITO DE COMPRA"
                    });
                    return;
                }
            }
            //VALIDAMOS SI EL STOCK ESTÁ DISPONIBLE

            if(data.variedad){
                let valid_variedad = await models.Variedad.findOne({
                    id_: data.variedad,
                });
                if(valid_variedad.stock < data.cantidad){
                    res.status(200).json({
                        message:403,
                        message_text: "EL STOCK NO ESTÁ DISPONIBLE"
                    });
                    return;
                }
                }else{
                let valid_product = await models.Product.findOne({
                    _id: data.product,
                });
                if(valid_product.stock < data.cantidad){
                    res.status(200).json({
                        message:403,
                        message_text: "EL STOCK NO ESTÁ DISPONIBLE"
                    });
                    return;
                }
            }

            let CART = await models.Cart.create(data);

            let NEW_CART = await models.Cart.findById({_id:CART._id}).populate("variedad").populate({
                path:"product",
                populate:{
                    path:"category"
                },
            })
            res.status(200).json({
                cart:resource.Cart.cart_list(NEW_CART),
                message_text: "EL CARRITO SE REGISTRÓ CON ÉXITO!"
            })
        } catch (error) {
            res.status(500).send({
                message:"OCURRIÓ UN ERROR",
            });
            console.log(error);
        }
    },
    update:async(req,res) => {
        try {
            let data = req.body;
           
            //VALIDAMOS SI EL STOCK ESTÁ DISPONIBLE

            if(data.variedad){
                let valid_variedad = await models.Variedad.findOne({
                    id_: data.variedad,
                });
                if(valid_variedad.stock < data.cantidad){
                    res.status(200).json({
                        message:403,
                        message_text: "EL STOCK NO ESTÁ DISPONIBLE"
                    });
                    return;
                }
                }else{
                let valid_product = await models.Product.findOne({
                    _id: data.product,
                });
                if(valid_product.stock < data.cantidad){
                    res.status(200).json({
                        message:403,
                        message_text: "EL STOCK NO ESTÁ DISPONIBLE"
                    });
                    return;
                }
            }

            let CART = await models.Cart.findByIdAndUpdate({_id:data._id},data);
            let NEW_CART = await models.Cart.findById({_id:CART._id}).populate("variedad").populate({
                path:"product",
                populate:{
                    path:"category"
                },
            })
            res.status(200).json({
                cart:resource.Cart.cart_list(NEW_CART),
                message_text: "EL CARRITO SE ACTUALIZÓ CON ÉXITO!"
            })
        } catch (error) {
            res.status(500).send({
                message:"OCURRIÓ UN ERROR",
            });
            console.log(error);
        }
    },
    delete:async(req,res) => {
        try {
            let _id = req.params.id;
            let CART = await models.Cart.findByIdAndDelete({_id:_id});

            res.status(200).json({
                cart:resource.Cart.cart_list(CART),
                message_text: "EL CARRITO SE ELIMINÓ CORRECTAMENTE!"
            })
        } catch (error) {
            res.status(500).send({
                message:"OCURRIÓ UN ERROR",
            });
            console.log(error);
        }
    },
}