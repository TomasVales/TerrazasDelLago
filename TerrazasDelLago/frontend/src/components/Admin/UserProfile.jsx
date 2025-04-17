import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import profile from '../../assets/profile.png';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const BACKEND_URL = 'http://localhost:3000';
const MySwal = withReactContent(Swal);

const UserProfile = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/users/me`, {
                    headers: { Authorization: `Bearer ${user?.token}` },
                });
                const data = await res.json();
                setProfileData(data);
            } catch (error) {
                console.error('Error al obtener perfil:', error);
            }
        };

        if (user?.token) fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${BACKEND_URL}/api/users/me`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: profileData.name }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            MySwal.fire('Actualizado', 'Perfil actualizado correctamente', 'success');
        } catch (error) {
            MySwal.fire('Error', error.message || 'No se pudo actualizar el perfil', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
            <div className="flex items-center space-x-4 mb-6">
                <img src={profile} alt="Perfil" className="w-16 h-16 rounded-full object-cover" />
                <div>
                    <h2 className="text-xl font-semibold">{profileData.name}</h2>
                    <p className="text-gray-500">{profileData.email}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#208850] text-white py-2 px-4 rounded hover:bg-[#1b7744] transition"
                >
                    {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </form>
        </div>
    );
};

export default UserProfile;
