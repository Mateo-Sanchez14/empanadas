// OrderEmpanadas.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Container, Typography, MenuItem, Select, InputLabel, FormControl, List, ListItem, ListItemText, Link, Chip } from '@mui/material';

import './Empanadas.css';

const empanadaTypes = ['Carne', 'Pollo', 'Queso', 'Jamón y Queso', 'Humita', 'Caprese', 'Verdura', 'Ternera', 'Cebolla y Queso', 'Cantimpalo'];

axios.defaults.baseURL = 'http://empanadas.msanchez.tech/api/';

const OrderEmpanadas = () => {
    const [orderId, setOrderId] = useState(null);
    const [empanadaType, setEmpanadaType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [empanadasList, setEmpanadasList] = useState({});
    const [shareableLink, setShareableLink] = useState('');

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const orderIdFromURL = query.get('orderId');
        if (orderIdFromURL) {
            setOrderId(orderIdFromURL);
            getOrder(orderIdFromURL);
        }
    }, []);

    const createOrder = async () => {
        const response = await axios.post('create-order/');
        const newOrderId = response.data.orderId;
        setOrderId(newOrderId);
        const shareableLink = `${window.location.origin}?orderId=${newOrderId}`;
        setShareableLink(shareableLink);
        navigator.clipboard.writeText(shareableLink);
        alert(`Link para compartir copiado: ${shareableLink}`);
    };

    const addEmpanada = async () => {
        if (empanadaType && quantity) {
            await axios.post('add-empanada/', {
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
        const response = await axios.get(`get-order/${orderId}/`);
        setEmpanadasList(response.data.empanadas);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareableLink);
    }

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
                    <Typography variant="h6" gutterBottom>
                        Pedido link: {' '}
                        <Chip variant="outlined" color="info" size="small" label={shareableLink} onClick={copyToClipboard} />
                    </Typography>
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
                    <div className='Button-container'>
                      <Button variant="contained" color="primary" onClick={addEmpanada}>
                          Cargar al Pedido
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => getOrder(orderId)}>
                          Recargar Pedido
                      </Button>
                    </div>

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
