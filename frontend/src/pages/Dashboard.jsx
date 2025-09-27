import React, { useContext, useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

// Import your background image
import dashboardBg from '@/assets/images/bg_images/dashboard.png';

// ✨ 1. New, professional modal for confirming cancellation
const ConfirmCancelModal = ({ order, onClose, onConfirm }) => {
    if (!order) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
                  <X size={24} />
                </button>
                <h2 className="text-xl font-bold mb-2">Confirm Cancellation</h2>
                <p className="text-gray-600">Are you sure you want to cancel Order  This action cannot be undone.</p>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                        Nevermind
                    </button>
                    <button type="button" onClick={() => onConfirm(order.id)} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                        Yes, Cancel Order
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function Dashboard() {
  const { user, loading, token } = useContext(UserContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  // ✨ 2. Add state to manage the new modal
  const [cancelModalOrder, setCancelModalOrder] = useState(null);

  const fetchOrders = () => {
    if (token) {
        setOrdersLoading(true);
        api.get(`/api/users/me/orders`)
            .then(response => { setOrders(response.data); })
            .catch(error => { console.error("Failed to fetch orders:", error); })
            .finally(() => { setOrdersLoading(false); });
    } else {
        setOrdersLoading(false);
    }
  }

  useEffect(() => {
    if (!loading) {
      if (!token) {
        navigate('/login');
      } else if (user) {
        fetchOrders();
      }
    }
  }, [user, token, loading, navigate]);

  // ✨ 3. This function is now called when the user confirms in the modal
  const handleConfirmCancel = (orderId) => {
    toast.promise(
      api.put(`/api/users/me/orders/${orderId}/cancel`),
      {
        loading: 'Cancelling order...',
        success: () => {
          fetchOrders(); // Refresh the order list
          setCancelModalOrder(null); // Close the modal
          return 'Order cancelled successfully.';
        },
        error: 'Failed to cancel order. It may have already been shipped.',
      }
    );
  };

  if (loading || !user) {
    return <div className="text-center p-12">Loading...</div>;
  }

  // Style object for the background container
  const backgroundStyle = {
    backgroundImage: `url(${dashboardBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    width: '100%',
  };

  return (
    <div style={backgroundStyle} className="pt-6">
      <div className="container mx-auto p-6">
        {/* Added a backdrop for better text visibility */}
        <div className=" bg-white bg-opacity-30 p-6 rounded-lg shadow-md mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Welcome, {user.name}!</h1>
          <p className="text-black">Here you can view your past orders.</p>
        </div>

        <div className="bg-white bg-opacity-50 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-4">Your Order History</h2>
          {ordersLoading ? ( <p>Loading your orders...</p> ) : 
          orders.length === 0 ? ( <p>You haven't placed any orders yet.</p> ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="font-bold text-lg">Order #{order.order_uid}</p>
                      <p className="text-sm text-gray-500">
                        Placed on: {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">Total: ₹{order.total.toFixed(2)}</p>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold mb-2">Items:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {order.items.map((item, index) => (
                            <li key={index}>
                              {item.qty} x {item.product_name} - ₹{item.subtotal.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {order.status === 'pending' && (
                        // ✨ 4. This button now opens the modal instead of the old popup
                        <button
                          onClick={() => setCancelModalOrder(order)}
                          className="bg-black text-white px-4 py-2 rounded"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✨ 5. Render the modal when an order is selected for cancellation */}
        <ConfirmCancelModal
          order={cancelModalOrder}
          onClose={() => setCancelModalOrder(null)}
          onConfirm={handleConfirmCancel}
        />
      </div>
    </div>
  );
}