export default{
    product_list: (product) =>{
        return {
            _id: product._id,
            title: product.title,
            imagen: 'http://localhost:3000' + '/uploads/product/' + product.portada,//*
            slug:product.slug,
            category:product.category,
            price_soles:product.price_soles,
            price_usd:product.price_usd,
            stock:product.stock,
            description:product.description,
            resumen:product.resumen,
            tags:product.tags ? JSON.parse(product.tags) : [],
            type_inventario:product.type_inventario,
            state: product.state,
        }
    }
}