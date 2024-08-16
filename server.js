// server.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let orders = {};

app.post('/api/create-order', (req, res) => {
    const orderId = uuidv4();
    orders[orderId] = {};
    res.json({ orderId });
});

app.post('/api/add-empanada', (req, res) => {
    const { orderId, empanadaType, quantity } = req.body;
    if (orders[orderId]) {
        if (!orders[orderId][empanadaType]) {
            orders[orderId][empanadaType] = 0;
        }
        orders[orderId][empanadaType] += quantity;
        res.json({ message: 'Empanada agregada con éxito!' });
    } else {
        res.status(404).json({ message: 'Pedido no encontrado' });
    }
});

app.get('/api/get-order/:id', (req, res) => {
    const { id } = req.params;
    if (orders[id]) {
        res.json({ empanadas: orders[id] });
    } else {
        res.status(404).json({ message: 'Pedido no encontrado' });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
