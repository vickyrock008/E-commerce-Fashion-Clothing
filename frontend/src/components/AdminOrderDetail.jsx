import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig'; // ✨ 1. Import the configured api instance

// A re-usable component for displaying order details
const OrderDetailsCard = ({ order }) => {
    if (!order) {
        return <p>Order not found.</p>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Details</h2>
            <div className="space-y-3">
                <p><strong>Order ID:</strong> #{order.order_uid}</p>
                <p><strong>Customer:</strong> {order.customer_name}</p>
                <p><strong>Contact:</strong> {order.customer_phone}</p>
                <p><strong>Shipping Address:</strong> {order.customer_address}</p>
                <p><strong>Total Amount:</strong> ₹{order.total.toFixed(2)}</p>
                <p><strong>Status:</strong> <span className={`px-2 py-1 text-sm rounded-full ${order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>{order.status}</span></p>
            </div>
        </div>
    );
};


// The main component for the page
const AdminOrderDetailComponent = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { orderId } = useParams(); // Gets the order ID from the URL

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // ✨ 2. Replace fetch with the api instance
                const response = await api.get(`/api/orders/${orderId}`);
                setOrder(response.data);
            } catch (err) {
                // Better error handling for API responses
                if (err.response && err.response.status === 404) {
                    setError('Order not found.');
                } else {
                    setError('Failed to fetch order details.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) return <p className="text-center mt-8">Loading order details...</p>;
    if (error) return <p className="text-center mt-8 text-red-600">Error: {error}</p>;

    return (
        <div className="container mx-auto p-4">
            <OrderDetailsCard order={order} />
        </div>
    );
};

export default AdminOrderDetailComponent;