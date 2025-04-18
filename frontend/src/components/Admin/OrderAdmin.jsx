import React, { useState, useEffect } from 'react';
import { Ellipsis } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const BACKEND_URL = 'http://localhost:3000';
const MySwal = withReactContent(Swal);

const OrderAdmin = ({ searchQuery }) => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [showMenu, setShowMenu] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/orders`, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const q = searchQuery.toLowerCase();
        return (
            order.id.toString().includes(q) ||
            order.status.toLowerCase().includes(q) ||
            (order.address?.toLowerCase() || '').includes(q) ||
            (order.User?.name?.toLowerCase() || '').includes(q) ||
            order.total.toString().includes(q) ||
            new Date(order.createdAt).toLocaleDateString('es-AR').includes(q) ||
            order.OrderItems?.some(item =>
                item.Product?.name?.toLowerCase().includes(q)
            )
        );
    });

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/orders/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            if (!res.ok) throw new Error('No se pudo eliminar el pedido');
            await fetchOrders();
            MySwal.fire('Eliminado', 'Pedido eliminado correctamente', 'success');
        } catch (err) {
            MySwal.fire('Error', err.message, 'error');
        }
    };

    const handleChangeStatus = async (order) => {
        const { value: status } = await MySwal.fire({
            title: 'Cambiar estado',
            input: 'select',
            inputOptions: {
                pending: 'Pendiente',
                completed: 'Completado',
                cancelled: 'Cancelado', // ✔️ corregido aquí
            },
            inputValue: order.status,
            showCancelButton: true,
        });

        if (status) {
            try {
                const res = await fetch(`${BACKEND_URL}/api/orders/${order.id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status }),
                });
                if (!res.ok) throw new Error('No se pudo actualizar el estado');
                await fetchOrders();
                MySwal.fire('Actualizado', 'Estado cambiado correctamente', 'success');
            } catch (err) {
                MySwal.fire('Error', err.message, 'error');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="rounded-lg border border-gray-400 shadow-sm bg-white">
                <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="lg:text-2xl xs:text-xl
                     pb-1 font-semibold">Pedidos</h3>
                    <p className="lg:text-sm  xs:text-[14px] text-gray-500">Lista de pedidos del sistema.</p>
                </div>
                <div className="p-6 pt-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full table-auto text-sm">
                            <thead className="border-b ">
                                <tr className="border-b border-gray-200 bg-gray-100">
                                    <th className="p-4 text-left text-gray-500">ID</th>
                                    <th className="p-4 text-left text-gray-500">Cliente</th>
                                    <th className="p-4 text-left text-gray-500">Total</th>
                                    <th className="p-4 text-left text-gray-500">Estado</th>
                                    <th className="p-4 text-left text-gray-500">Fecha</th>
                                    <th className="p-4 text-left text-gray-500">Dirección</th>
                                    <th className="p-4 text-left text-gray-500">Productos</th>
                                    <th className="p-4 text-left text-gray-500">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-4">{order.id}</td>
                                        <td className="p-4">{order.User?.name || 'Anónimo'}</td>
                                        <td className="p-4 text-blue-600 font-semibold">${order.total}</td>
                                        <td className={`p-4 capitalize ${order.status === 'completed'
                                            ? 'text-green-500'
                                            : order.status === 'cancelled'
                                                ? 'text-red-500'
                                                : 'text-yellow-500'
                                            }`}>
                                            {order.status}
                                        </td>
                                        <td className="p-4">{new Date(order.createdAt).toLocaleDateString('es-AR')}</td>
                                        <td className="p-4">{order.address || '-'}</td>
                                        <td className="p-4">
                                            {order.OrderItems?.map((item) => (
                                                <p key={item.id}>{item.quantity} × {item.Product?.name}</p>
                                            ))}
                                        </td>
                                        <td className="p-4 relative">
                                            <button onClick={() => setShowMenu(showMenu === order.id ? null : order.id)}>
                                                <Ellipsis size={20} />
                                            </button>
                                            {showMenu === order.id && (
                                                <div className="
                                                lg:right-35 lg:bottom-7
                                                xs:right-19 xs:bottom-10
                                                absolute  mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                                    <button
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                                        onClick={() => handleChangeStatus(order)}
                                                    >
                                                        Cambiar estado
                                                    </button>
                                                    <button
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                                                        onClick={() => handleDelete(order.id)}
                                                    >
                                                        Eliminar pedido
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {orders.length === 0 && (
                            <p className="text-center text-gray-500 mt-4">No hay pedidos aún.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderAdmin;
