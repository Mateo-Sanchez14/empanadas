// OrderEmpanadas.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Container, Typography, MenuItem, Select, InputLabel, FormControl, List, ListItem, ListItemText } from '@mui/material';

const empanadaTypes = ['Carne', 'Pollo', 'Queso', 'Jamón y Queso'];

const OrderEmpanadas = () => {
    const [orderId, setOrderId] = useState(null);
    const [empanadaType, setEmpanadaType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [empanadasList, setEmpanadasList] = useState({});

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const orderIdFromURL = query.get('orderId');
        if (orderIdFromURL) {
            setOrderId(orderIdFromURL);
            getOrder(orderIdFromURL);
        }
    }, []);

    const createOrder = async () => {
        const response = await axios.post('http://localhost:8000/create-order');
        const newOrderId = response.data.orderId;
        setOrderId(newOrderId);
        const shareableLink = `${window.location.origin}?orderId=${newOrderId}`;
        navigator.clipboard.writeText(shareableLink);
        alert(`Link para compartir copiado: ${shareableLink}`);
    };

    const addEmpanada = async () => {
        if (empanadaType && quantity) {
            await axios.post('http://localhost:8000/add-empanada', {
                orderId,
                empanadaType,
                quantity: parseInt(quantity)
            });
            setEmpanadaType('');
            setQuantity('');
            getOrder(orderId);
        }
    };

    const getOrder = async (orderId) => {
        const response = await axios.get(`http://localhost:8000/get-order/${orderId}`);
        setEmpanadasList(response.data.empanadas);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Pedido de Empanadas
            </Typography>
            {!orderId ? (
                <Button variant="contained" color="primary" onClick={createOrder}>
                    Crear Pedido
                </Button>
            ) : (
                <>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Tipo de Empanada</InputLabel>
                        <Select
                            value={empanadaType}
                            onChange={(e) => setEmpanadaType(e.target.value)}
                        >
                            {empanadaTypes.map((type, index) => (
                                <MenuItem key={index} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Cantidad"
                        variant="outlined"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={addEmpanada}>
                        Guardar Pedido
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => getOrder(orderId)} style={{ marginTop: 20 }}>
                        Ver Pedido
                    </Button>

                    <List>
                        {Object.keys(empanadasList).map((type, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={`${type}: ${empanadasList[type]}`} />
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
        </Container>
    );
};

export default OrderEmpanadas;
