import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axiosConfig'; 
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

// Helper function to format date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Modal Component for Order Details
const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Order #{order.order_uid} Details</h2>
        
        <div className="mb-6">
            <h3 className="text-lg font-semibold border-b pb-2 mb-2">Billing Information</h3>
            <p><strong>Name:</strong> {order.customer_name}</p>
            <p><strong>Email:</strong> {order.customer ? order.customer.email : 'N/A'}</p>
            <p><strong>Phone:</strong> {order.customer_phone}</p>
            <p><strong>Address:</strong> {order.customer_address}</p>
        </div>

        <div>
            <h3 className="text-lg font-semibold border-b pb-2 mb-2">Order Items</h3>
            <ul className="space-y-2">
                {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                        <span>{item.qty} x {item.product_name}</span>
                        <span>₹{item.subtotal.toFixed(2)}</span>
                    </li>
                ))}
            </ul>
            <div className="text-right font-bold text-xl mt-4 pt-4 border-t">
                Total: ₹{order.total.toFixed(2)}
            </div>
        </div>
      </div>
    </div>
  );
};


// Main Component
export default function AdminOrders() {
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [singleOrder, setSingleOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        
        try {
            let response;
            if (orderId) {
                response = await api.get(`/api/orders/${orderId}`);
                setSingleOrder(response.data);
            } else {
                response = await api.get(`/api/orders/?show_archived=${showArchived}`);
                setOrders(response.data);
            }
        } catch (err) {
            setError(err.message);
            toast.error("Could not fetch orders.");
        } finally {
            setLoading(false);
        }
    };
    fetchOrders();
  }, [orderId, showArchived]);

  const handleStatusChange = (orderId, newStatus) => {
    const promise = api.put(`/api/orders/${orderId}`, { status: newStatus });

    toast.promise(promise, {
        loading: 'Updating status...',
        success: (response) => {
          const updatedOrder = response.data;
          setOrders(prevOrders => 
              prevOrders.map(o => o.id === orderId ? updatedOrder : o)
          );
          return 'Order status updated!';
        },
        error: 'Failed to update status.',
    });
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;

  // --- RENDER SINGLE ORDER DETAILED VIEW ---
  if (orderId && singleOrder) {
      return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto">
                     <Link to="/admin/orders" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to All Orders</Link>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
                        <h1 className="text-2xl font-bold mb-4 text-gray-800">Order Details</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                            <div><strong>Order ID:</strong> {singleOrder.order_uid}</div>
                            <div><strong>Date:</strong> {formatDate(singleOrder.created_at)}</div>
                            <div><strong>Customer:</strong> {singleOrder.customer_name}</div>
                            <div><strong>Contact:</strong> {singleOrder.customer_phone}</div>
                            <div className="md:col-span-2"><strong>Address:</strong> {singleOrder.customer_address}</div>
                            <div><strong>Total:</strong> <span className="font-semibold">₹{singleOrder.total.toFixed(2)}</span></div>
                             <div><strong>Status:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${singleOrder.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>{singleOrder.status}</span></div>
                        </div>
                        <div className="mt-6 border-t pt-4">
                            <h2 className="text-xl font-bold mb-2">Items</h2>
                            <ul>
                                {singleOrder.items.map(item => (
                                    <li key={item.product_name} className="flex justify-between items-center py-2 border-b">
                                        <span>{item.product_name} (x{item.qty})</span>
                                        <span>₹{item.subtotal.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
  }

  // --- RENDER ALL ORDERS LIST VIEW (with modal functionality) ---
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Orders</h1>
        <label className="flex items-center cursor-pointer">
          <span className="mr-3 text-sm font-medium text-gray-900">Show Archived Orders</span>
          <div className="relative">
            <input type="checkbox" checked={showArchived} onChange={() => setShowArchived(!showArchived)} className="sr-only"/>
            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${showArchived ? 'transform translate-x-6' : ''}`}></div>
          </div>
        </label>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer Name</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
                <tr><td colSpan="6" className="text-center p-8 text-gray-500">{showArchived ? 'No archived orders found.' : 'No active orders found.'}</td></tr>
            ) : orders.map(order => (
              <tr key={order.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <Link to={`/admin/orders/${order.order_uid}`} className="text-blue-600 hover:underline">#{order.order_uid}</Link>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.customer_name}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">₹{order.total.toFixed(2)}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="p-1 border rounded-md"
                    disabled={order.is_archived}
                  >
                    <option value="pending">Pending</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button onClick={() => setSelectedOrderForModal(order)} className="text-blue-600 hover:underline">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderDetailsModal order={selectedOrderForModal} onClose={() => setSelectedOrderForModal(null)} />
    </div>
  );
}