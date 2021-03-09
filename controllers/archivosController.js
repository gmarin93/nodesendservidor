//Subida de archivos
const multer = require('multer'); //.single permite subir solo un archivo
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlace');


exports.subirArchivo = async (req, res, next) => {

    const configuracionMulter = {      //    1MB+           1MB
        limits:{fileSize:req.usuario ? 1024*1024*10 : 1024*1024}, //esta cantidad es apenas 1MB
        storage:FileStorage = multer.diskStorage({
            destination:(req,file,cb) =>{
                cb(null,__dirname+'/../uploads');
            },
            filename:(req,file,cb) =>{
                const  extension =file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                // const  extension =file.mimetype.split('/')[1]; //mimetype es el tipo de archivo
                cb(null, `${shortid.generate()}${extension}`);
            }
            //En este caso, un filtro para no permtir la subida de archivos PDF
            // fileFilter:(req,file,cd)=>{
            //     if(file.mimetype === "application/pdf"){
            //         return cb(null,true);
            //     }
            // }
        })
    };
    
    //archivo es el nombre del key para cargar y obtener el archivo
    const upload = multer(configuracionMulter).single('archivo');
    

    upload(req,res,async(error)=>{
        console.log(req.file);

        if(!error){
            res.json({archivo: req.file.filename});
        }
        else{
            console.log(error);
            return next();
        }
    });
};

exports.eliminarArchivo = async (req, res) => {


    try {

        fs.unlinkSync(__dirname+`/../uploads/${req.archivo}`);
        console.log('Archivo eliminado')
        
    } catch (error) {
        console.log(error);
    }

};

exports.descargar = async (req,res,next)=>{

    //obtiene el enlace
    const {archivo} = req.params;
    const enlace = await Enlaces.findOne({nombre:archivo});

    const archivoDescarga = __dirname + '/../uploads/'+archivo;
    res.download(archivoDescarga);

        //Si las descargas son iguales a 1
        const {descargas,nombre} = enlace;

        if(descargas ===1){
            
            //eliminar archivo
            req.archivo = nombre;
            await Enlaces.findOneAndRemove(enlace.id); //enlace._id no funciona, tiene que ser enlace.id
            next(); //Se llama de inmediato el metodo que existe en el otro controlador, es decir archivosController, revisar endpoint(ruta)
            //eliminar registro
        }
        else{
            enlace.descargas--; //Se resta por cada descarga de archivo
            await enlace.save();
        }
    
    
        //Si las descargas son mayores a 1
    
}
