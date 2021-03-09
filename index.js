const express = require('express');
const conectarDB = require('./config/db');
const auth = require('./middleware/auth');
const cors = require('cors');

const app = express();

//Habilitar cors
const opcionesCors = {
    origin:process.env.FRONTEND_URL
};
app.use(cors(opcionesCors));


app.use(auth);

//Habilitar carpeta publica
app.use(express.static('uploads'));

//Conexion BD
conectarDB();

const port = process.env.PORT || 4000;

//Habilitar leer valores de un body (BodyParser)
app.use(express.json());

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));




app.listen(port, '0.0.0.0', ()=>{
    console.log(`Servidor trabajando en el puerto ${port}`);
})