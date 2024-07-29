import models from "../models";

export default {
    register:async(req,res)=>{
        try {
            let sale_data = req.body.sale;
            let sale_address_data = req.body.sale_address;

            let SALE = await models.Sale.create(sale_data);

            sale_address_data.sale =  SALE._id;

            let SALE_ADDRESS = await models.SaleAddress.create(sale_address_data);

            let CARTS = await models.Cart.find({user:SALE.user});

            for (const CART of CARTS) {
                CART.sale = SALE._id;
                //EL DESCUENTO DEL INVENTARIO
                if(CART.variedad){//INVENTARIO MULTIPLE
                    let VARIEDAD = await models.Variedad.findById({_id:CART.variedad});
                    let new_stock = VARIEDAD.stock = VARIEDAD.stock - CART.cantidad;
                    
                    await models.Variedad.findByIdAndUpdate({_id:CART.variedad},{
                        stock: new_stock,
                    })
                }else{//INVENTARIO UNITARIO
                    let PRODUCT = await models.Product.findById({_id:CART.product});
                    let new_stock = PRODUCT.stock - CART.cantidad;

                    await models.Product.findByIdAndUpdate({_id:CART.product},{
                        stock: new_stock
                    });  
                }
                //
                await models.SaleDetail.create(CART);
                
            }

            res.status(200).json({
                message:"LA ORDEN SE GENERÓ CORRECTAMENTE",
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "HUBO UN ERROR"
            });
        }
    }
}