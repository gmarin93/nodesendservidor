const Enlace = require('../models/Enlace');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');


exports.nuevoEnlace = async (req,res,next)=>{

      //Mensajes de validacion express validator
      const errores =  validationResult(req);

      if(!errores.isEmpty()){
          return res.status(400).json({errores:errores.array()})
      }

    const {nombre_original,password,nombre} = req.body;
    const enlace = new Enlace();

    enlace.url=shortid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;
    enlace.password = password;

    //si hay autentificacion 
    if(req.usuario){
        const {password,descargas} = req.body;

        //asignar numero de descargas
        if(descargas){
            enlace.descargas = descargas;
        }

        if(password){
            //Hasheo del password
            const salt= await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password,salt);
        }

        enlace.autor = req.usuario.id;
    };

    try {

        await enlace.save();

        return res.json({msg: `${enlace.url}`});
        // next();
        
    } catch (error) {
        console.log(error);
    }
};

//Obtiene un listado de todos los enlaces
exports.todosEnlaces = async(req,res)=>{
    try {
        const enlaces = await Enlace.find({}).select('url -_id'); //-_id elimina los id de la consulta
        res.json({enlaces});
    } catch (error) {
        
    }
}

exports.obtenerEnlace = async (req,res,next)=>{

    const {url} =req.params;
    const enlace = await Enlace.findOne({url:url});

    if(!enlace){
        res.status(404).json({msg:'Ese enlace no existe'});
        return next();
    }

    //Si existe
    res.json({archivo: enlace.nombre, password:false});

    next();
};


exports.tienePassword = async(req,res,next) =>{

    const {url} =req.params;
    const enlace = await Enlace.findOne({url:url});

    if(!enlace){
        res.status(404).json({msg:'Ese enlace no existe'});
        return next();
    }

    if(enlace.password){
        return res.json({password:true,enlace:enlace.url})
    }

    next();

}

exports.verificarPassword = async (req,res,next)=>{

    const {url} = req.params;
    const {password} = req.body;

    const enlace = await Enlace.findOne({url});

    if(bcrypt.compareSync(password,enlace.password)){
        next();
    }
    else{
        return res.status(401).json({msg: 'Password Incorrecto'});
    }

}