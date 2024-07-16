export default{
    cart_list: (cart) =>{
        return {
            user: cart.user,
            product:{
                _id: cart.product._id,
                title: cart.product.title,
                sku: cart.product.sku,
                imagen: 'http://localhost:3000' + '/api/products/uploads/product/' + cart.product.portada,//*
                slug:cart.product.slug,
                category:cart.product.category,
                price_soles:cart.product.price_soles,
                price_usd:cart.product.price_usd,
            },
            type_discount:cart.type_discount,
            discound:cart.discound,
            cantidad:cart.cantidad,
            variedad:cart.variedad,
            code_cupon:cart.code_cupon,
            code_discount:cart.code_discount,
            subtotal:cart.subtotal,
            total:cart.total,
        }
    }
}