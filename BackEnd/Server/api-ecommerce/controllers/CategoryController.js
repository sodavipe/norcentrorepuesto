import models from "../models";
import resource from "../resource";
import fs from 'fs';
import path from "path";
export default{
    register: async(req, res)=>{
        try {
            if(req.files){
                var img_path = req.files.portada.path;
                var name = img_path.split('\\');
                var portada_name = name[2];
                /* console.log(portada_name) */
                req.body.imagen = portada_name;
            }
            const category = await models.Category.create(req.body);
            res.status(200).json(category);
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
            console.log(error);
        }
    },
    update: async(req, res)=>{
        try {
            if(req.files && req.files.portada){
                var img_path = req.files.portada.path;
                var name = img_path.split('\\');
                var portada_name = name[2];
                /* console.log(portada_name) */
                req.body.imagen = portada_name;
            }
            
            await models.Category.findByIdAndUpdate({_id: req.body._id}, req.body);
            
            let CategoriaT = await models.Category.findOne({_id: req.body._id});

            res.status(200).json({
                message: "LA CATEGORIA SE HA MODIFICADO CORRECTAMENTE",
                category: resource.Category.category_list(CategoriaT),
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
            console.log(error)
        }
    },
    list: async(req, res)=>{
        try {
            var search = req.query.search;
            let Category = await models.Category.find(
                {
                    $or:[
                        {"title":new RegExp(search, "i")},
                    ]
                }
            ).sort({'createdAt':-1});

            Category = Category.map((user)=>{
                return resource.Category.category_list(user);
            })

            res.status(200).json({
                category: Category
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
            console.log(error)
        }
    },
    obtener_imagen: async(req,res)=>{
        try {
            var img = req.params['img'];


        fs.stat('./uploads/category/'+img, function(err){
            if(!err){
                let path_img = './uploads/category/'+img;
                res.status(200).sendFile(path.resolve(path_img));
            }else{
                let path_img = './uploads/default.jpg';
                res.status(200).sendFile(path.resolve(path_img));
            }
    })

        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
            console.log(error)
        }
    },
    remove: async(req,res) => {
        try {
            await models.Category.findByIdAndDelete({_id:req.query._id})
            res.status(200).json({
                message: "LA CATEGORÍA SE ELIMINÓ CORRECTAMENTE"
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
            console.log(error)
        }
    }
}