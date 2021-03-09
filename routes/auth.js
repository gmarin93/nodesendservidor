const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');


router.post('/',
    [
        check('email', 'El Email no es valido').isEmail(),
        check('password', 'El Password no puede ser vacio').not().isEmpty(),

    ],
    authController.autenticarUsuario
);

router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router;