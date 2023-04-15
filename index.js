const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { Usuario, Vehiculo } = require('./app');

const app = express();
const port = process.env.PORT || 4250;
const url = 'mongodb://127.0.0.1/parqueadero';

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('CONECTADO A LA BASE DE DATOS DEL PARQUEADERO'))
  .catch((e) => console.log('El error de conexión es:' + e));

app.use(cors());
app.use(bodyParser.json());

app.get('/usuarios', async (req, res) => {
  const personas = await Usuario.find();
  res.send(personas);
});

app.post('/usuarios', async (req, res) => {
  const { nombre_completo, correo_electronico, contrasena, numero_telefono, direccion, tipo_cliente, fecha_registro, estado_cuenta } = req.body;
  const personas = new Usuario({
    nombre_completo,
    correo_electronico,
    contrasena,
    numero_telefono,
    direccion,
    tipo_cliente,
    fecha_registro: fecha_registro ? new Date(fecha_registro) : new Date(),
    estado_cuenta,
  });
  const resultados = await personas.save();
  res.send(resultados);
});

app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_completo, correo_electronico, contrasena, numero_telefono, direccion, tipo_cliente, fecha_registro, estado_cuenta } = req.body;
  const personas = await Usuario.updateOne({ _id: id }, {
    $set: {
      nombre_completo,
      correo_electronico,
      contrasena,
      numero_telefono,
      direccion,
      tipo_cliente,
      fecha_registro: fecha_registro ? new Date(fecha_registro) : new Date(),
      estado_cuenta,
    }
  });
  res.send(personas);
});

app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const personas = await Usuario.deleteOne({ _id: id });
  res.send(personas);
});

app.get('/vehiculos', async (req, res) => {
  const vehiculos = await Vehiculo.find().populate('id_usuario');
  res.send(vehiculos);
});

app.post('/vehiculos', async (req, res) => {
  const { placa, marca, modelo, color, id_usuario } = req.body;
  const vehiculo = new Vehiculo({
    placa,
    marca,
    modelo,
    color,
    id_usuario,
  });
  const resultado = await vehiculo.save();
  res.send(resultado);
});

app.put('/vehiculos/:id', async (req, res) => {
  const { id } = req.params;
  const { placa, marca, modelo, color } = req.body;
  const vehiculo = await Vehiculo.updateOne({ _id: id }, {
    $set: {
      placa,
      marca,
      modelo,
      color,
    }
  });
  res.send(vehiculo);
});

app.delete('/vehiculos/:id', async (req, res) => {
  const { id } = req.params;
  const vehiculo = await Vehiculo.deleteOne({ _id: id });
  res.send(vehiculo);
});

app.listen(port, () => {
console.log(Servidor corriendo en el puerto ${port});
});