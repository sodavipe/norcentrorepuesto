import bcript from 'bcryptjs'
import models from '../models';
import token from '../service/token';

export default{
    register: async(req, res)=>{
        try {
            req.body.password = await bcript.hash(req.body.password,10);
            const user = await models.User.create(req.body);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
            console.log(error)
        }
    },
    login: async(req, res)=>{
        try {
            const user = await models.User.findOne({email: req.body.email, state:1})
            if(user){
                let compare = await bcript.compare(req.body.password, user.password);
                if(compare){
                    let tokenT = await token.encode(user._id,user.rol,user.email)

                    const USER_FRONTEND = {
                        token:tokenT,
                        user:{
                            name: user.name,
                            email: user.email,
                            surname: user.surname,
                            avatar: user.avatar,
                        },
                    }
                    res.status(200).json({
                        USER_FRONTEND:USER_FRONTEND,
                    })
                }else{
                    res.status(500).send({
                        message: "EL USUARIO NO EXISTE"
                    });
                }
            }else{
                res.status(500).send({
                    message: "EL USUARIO NO EXISTE"
                });
            }
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
            console.log(error)
        }
    },
    update: async(req, res)=>{
        try {
            if(req.files){
                var img_path = req.files.avatar.path;
                var name = img_path.split('\\');
                var avatar_name = name[2];
                console.log(avatar_name)
            }
            const UserT = await models.User.findByIdAndUpdate({_id: req.body._id}, req.body);
            res.status(200).json({
                message: "EL USUARIO SE HA MODIFICADO CORRECTAMENTE",
                user:UserT,
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
            var search = req.body.search;
            const Users = await models.User.find(
                {
                    $or:[
                        {"name":new RegExp(search, "i")},
                        {"surname":new RegExp(search, "i")},
                        {"email":new RegExp(search, "i")},
                    ]
                }
            ).sort({'createdAt':-1});

            res.status(200).json({
                users: Users
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
            console.log(error)
        }
    },
    remove: async(req,res) => {
        try {
            const User = await models.User.findByIdAndDelete({_id:req.body._id})
            res.status(200).json({
                message: "EL USUARIO SE ELIMINÓ CORRECTAMENTE"
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
            console.log(error)
        }
    }
}