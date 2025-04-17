import { useState } from 'react';
import Logo from '../assets/logo3.webp';
import Image from '../assets/imagen.webp';

function Register({ onSwitch }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setMessage('❌ Las contraseñas no coinciden');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Error en el registro');

            setMessage('✅ Usuario creado. Ahora podés iniciar sesión.');
            setForm({ name: '', email: '', password: '', confirmPassword: '' });
        } catch (err) {
            setMessage('❌ ' + err.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">

            {/* Formulario */}
            <div className="p-6 sm:p-2 md:p-4 lg:p-10 xl:p-12 w-full sm:w-1/2 max-h-[90vh] overflow-y-auto">
                <img src={Logo} alt="Logo" className='w-36 h-auto rounded-[50%] mx-auto pb-1 shadow-2xl' />
                <h1 className="text-5xl pt-5 text-center font-semibold mb-5">Regístrate</h1>

                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-600">Nombre completo</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 focus:shadow-md transition duration-200"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-600">Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 invalid:border-red-300 peer focus:shadow-md transition duration-200"
                        />
                        <p className='text-red-500 text-[12px] hidden peer-invalid:block'>El correo es incorrecto.</p>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-600">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 focus:shadow-md transition duration-200"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-600">Confirmar contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            required
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 focus:shadow-md transition duration-200"
                        />
                    </div>

                    <div className="mb-4 flex items-center">
                        <input type="checkbox" id="terms" name="terms" required className="text-blue-500" />
                        <label htmlFor="terms" className="text-gray-600 ml-2">
                            Estoy de acuerdo con los <span className='text-emerald-600 cursor-pointer hover:underline'>Términos y Condiciones</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-800 cursor-pointer text-white font-semibold rounded-md py-2 px-4 w-full"
                    >
                        Registrarse
                    </button>

                    {message && (
                        <p className="mt-4 text-center font-medium text-sm text-gray-700">{message}</p>
                    )}
                </form>

                <div className="mt-6 text-gray-600 text-center">
                    ¿Ya tienes una cuenta?{' '}
                    <button
                        onClick={onSwitch}
                        className="text-emerald-600 hover:underline bg-transparent border-none cursor-pointer"
                    >
                        Iniciar sesión
                    </button>
                </div>
            </div>

            {/* Imagen derecha */}
            <div className="w-1/2 h-screen hidden lg:block">
                <img src={Image} alt="Image" className="object-cover w-full h-full" />
            </div>
        </div>
    );
}

export default Register;
