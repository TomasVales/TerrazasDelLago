// src/components/Admin/UserAdmin.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const BACKEND_URL = 'http://localhost:3000';

const UserAdmin = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/users`, {
                    headers: { Authorization: `Bearer ${user?.token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setUsers(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="h-full 
        xs:p-1
        lg:p-6">
            <div className="rounded-lg border border-gray-400 shadow-sm bg-white">
                <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="xs:text-[22px] lg:text-2xl pb-1 font-semibold">Usuarios</h3>
                    <p className="xs:text-[13px]  lg:text-sm text-gray-500">Lista de usuarios registrados.</p>
                </div>
                <div className="
                xs:p-3
                lg:p-6 pt-0 relative w-full overflow-x-auto">
                    <table className="w-full table-auto text-sm">
                        <thead className="border-b border-gray-200 hover:bg-gray-100">
                            <tr>
                                <th className="p-4 text-left text-gray-500">ID</th>
                                <th className="p-4 text-left text-gray-500">Nombre</th>
                                <th className="p-4 text-left text-gray-500">Email</th>
                                <th className="p-4 text-left text-gray-500">Rol</th>
                                <th className="p-4 text-left text-gray-500">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-4">{u.id}</td>
                                    <td className="p-4 capitalize">{u.name}</td>
                                    <td className="p-4">{u.email}</td>
                                    <td className="p-4">{u.role}</td>
                                    <td className="p-4">{new Date(u.createdAt).toLocaleDateString('es-AR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && <p className="text-center text-gray-500 mt-4">No hay usuarios registrados.</p>}
                    {error && <p className="text-center text-red-500 mt-4">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default UserAdmin;
