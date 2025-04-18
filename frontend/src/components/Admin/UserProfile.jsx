import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import profilePlaceholder from '../../assets/profile.png';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const BACKEND_URL = 'http://localhost:3000';
const MySwal = withReactContent(Swal);

const UserProfile = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState({ name: '', email: '', image: '' });
    const [loading, setLoading] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/users/me`, {
                    headers: { Authorization: `Bearer ${user?.token}` },
                });
                const data = await res.json();
                setProfileData(data);
                if (data.image) {
                    setPreview(null); // asegurate que preview no anule la imagen actual
                }
            } catch (error) {
                console.error('Error al obtener perfil:', error);
            }
        };

        if (user?.token) fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', profileData.name);
            if (newImage) formData.append('image', newImage);

            const res = await fetch(`${BACKEND_URL}/api/users/me`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            MySwal.fire('Actualizado', 'Perfil actualizado correctamente', 'success');
            setProfileData(data.user); // actualiza datos luego del guardado
            setNewImage(null);
            setPreview(null);
        } catch (error) {
            MySwal.fire('Error', error.message || 'No se pudo actualizar el perfil', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 mt-10">
            <div className="w-full max-w-full sm:max-w-xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-xl border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-center sm:text-left">
                    <label className="relative cursor-pointer group mx-auto sm:mx-0 w-28 h-28">
                        <img
                            src={
                                preview
                                    ? preview
                                    : profileData.image
                                        ? `${BACKEND_URL}${profileData.image}`
                                        : profilePlaceholder
                            }
                            alt="Avatar"
                            className="w-28 h-28 rounded-full object-cover border-4 border-[#208850]/30 shadow-md group-hover:opacity-80 transition"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-white bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition">
                            Cambiar imagen
                        </div>
                    </label>

                    <div className="mt-4 sm:mt-0 sm:flex-1 overflow-hidden">
                        <h2 className="text-xl font-semibold text-gray-800 break-words">{profileData.name || 'Usuario'}</h2>
                        <p className="text-sm text-gray-500 break-words">{profileData.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {profileData.role === 'admin' ? 'Administrador' : 'Usuario'}
                        </span>

                        {preview && (
                            <button
                                onClick={() => {
                                    setNewImage(null);
                                    setPreview(null);
                                }}
                                className="mt-2 text-sm text-red-600 hover:underline block"
                            >
                                Cancelar imagen seleccionada
                            </button>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
        </div>
    );
};

export default UserProfile;
