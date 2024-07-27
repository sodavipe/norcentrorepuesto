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
    applyCupon:async(req,res) =>{
        try {
            let data = req.body;
            //VALIDACIÓN: ¿EL CUPON EXISTE?
            let CUPON = await models.Cupone.findOne({
                code: data.code,
            })
            if(!CUPON){
                res.status(200).json({
                    message: 403,
                    message_text: "EL CUPÓN INGRESADO NO EXISTE, DIGITE OTRO NUEVAMENTE"
                });
                return;
            }
            //TIENE CON EL USO DEL CUPON -- / EN ESPERA ESPERA - ESTO ES PARA EL CHECKOUT
        
        
            //PARTE OPERATIVA

            let carts = await models.Cart.find({user:data.user_id}).populate("product");


            let products = [];
            let categories = [];

            CUPON.products.forEach((product)=>{
                products.push(product._id);
            });
            //[ID DEL PRODUCTO]
            CUPON.categories.forEach((categorie)=>{
                categories.push(categorie._id);
            });
            //[ID DE LA CATEGORIA]
            for (const cart of carts) {
                if(products.length > 0){
                    if(products.includes(cart.product._id)){
                        let subtotal = 0;
                        let total = 0;
                        if(CUPON.type_discount == 1){ //PORCENTAJE
                            subtotal = cart.price_unitario - cart.price_unitario *(CUPON.discount*0.01);
                        }else{ //MONEDA
                            subtotal = cart.price_unitario - CUPON.discount;
                    }
                    total = subtotal * cart.cantidad;

                    await models.Cart.findByIdAndUpdate({_id:cart._id},{
                        subtotal: subtotal,
                        total: total,
                        type_discount: CUPON.type_discount,
                        discount: CUPON.discount,
                        code_cupon: CUPON.code,
                    });
                }
            }
            if(categories.length > 0){
                if(categories.includes(cart.product.category)){
                    let subtotal = 0;
                    let total = 0;
                    if(CUPON.type_discount == 1){ //PORCENTAJE
                        subtotal = cart.price_unitario - cart.price_unitario *(CUPON.discount*0.01);
                    }else{ //MONEDA
                        subtotal = cart.price_unitario - CUPON.discount;
                }
                total = subtotal * cart.cantidad;

                await models.Cart.findByIdAndUpdate({_id:cart._id},{
                    subtotal: subtotal,
                    total: total,
                    type_discount: CUPON.type_discount,
                    discount: CUPON.discount,
                    code_cupon: CUPON.code,
                });
            }
                }
            }
            res.status(200).json({
                message:200,
                message_text: "EL CUPÓN SE HA APLICADO CORRECTAMENTE",
            });
        } catch (error) {
            res.status(500).send({
                message:"OCURRIÓ UN ERROR",
            });
            console.log(error);
        }
    },
}