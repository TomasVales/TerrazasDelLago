// frontend/src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';

function AdminDashboard() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/orders', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error('Error al obtener pedidos:', err);
        }
    };

    const cambiarEstado = async (id, nuevoEstado) => {
        try {
            await fetch(`http://localhost:3000/api/orders/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: nuevoEstado })
            });
            fetchOrders();
        } catch (err) {
            console.error('Error al actualizar estado:', err);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Lista de Pedidos (Admin)</h1>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Dirección</th>
                        <th>Notas</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((o) => (
                        <tr key={o.id} className="border-t">
                            <td>{o.id}</td>
                            <td>{o.User?.email}</td>
                            <td>${o.total.toFixed(2)}</td>
                            <td>{o.status}</td>
                            <td>{o.address}</td>
                            <td>{o.notes}</td>
                            <td>
                                {o.status !== 'completed' && (
                                    <button
                                        className="bg-green-500 text-white px-2 py-1 text-sm rounded"
                                        onClick={() => cambiarEstado(o.id, 'completed')}
                                    >
                                        Marcar como completado
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;
