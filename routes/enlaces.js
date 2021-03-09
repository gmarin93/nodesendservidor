const express = require('express');
const router = express.Router();
const enlaceController = require('../controllers/enlaceController');
const archivosController = require('../controllers/archivosController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const { Router } = require('express');


router.post('/',[
    check('nombre','Sube un archivo').not().isEmpty(),
    check('nombre_original','Sube un archivo').not().isEmpty()
],
    auth,
    enlaceController.nuevoEnlace
);

//Por cada enlace y archivo que se suba, se crean los archivos estaticos que son enviados desde el servidor.
router.get('/',
    enlaceController.todosEnlaces
)

router.get('/:url',
    enlaceController.tienePassword,
    enlaceController.obtenerEnlace);

router.post('/:url',
    enlaceController.verificarPassword,
    enlaceController.obtenerEnlace
)



module.exports=router;

