import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Image from '../../src/assets/nuevoquilmes.webp';
import Logo from '../../src/assets/logo3.webp';
import Register from './Register';

function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const [showRegister, setShowRegister] = useState(false);

    if (showRegister)
    {
        return <Register />
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error de login');

            if (!data.user) throw new Error('Falta info del usuario en la respuesta');

            login({
                token: data.token,
                id: data.user.id,
                role: data.user.role,
                email: data.user.email,
            });

            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
        } catch (err) {
            console.error(err);
            setMessage('Login fallido: ' + err.message);
        }
    };

    return (
        <div className="bg-gray-100 flex justify-center items-center h-screen">
            <div className="w-1/2 h-screen hidden lg:block">
                <img src={Image} alt="Image" className="object-cover w-full h-full"/>
            </div>

            <div className="p-6 sm:p-2 md:p-2 lg:p-36 w-full sm:w-1/2">
                <img src={Logo} alt="Logo" className='w-36 h-auto rounded-[50%] mx-auto pb-1 shadow-2xl' />
                <h1 className="text-5xl pt-5 text-center font-semibold mb-5">Iniciar Sesión</h1>
                
                {message && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-center">
                        {message}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-600">Correo electrónico</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={(e) => e.target.checkValidity()} 
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 peer focus:shadow-md transition duration-200" 
                            autoComplete="off"
                            required
                        />
                        <p className='text-red-500 text-[12px] hidden peer-invalid:peer-focus:block'>
                            El correo es incorrecto.
                        </p>
                    </div>

                    {/* Contraseña */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-600">Contraseña</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 focus:shadow-md transition duration-200" 
                            autoComplete="off"
                            required
                        />
                    </div>

                    {/* Remember Me */}
                    <div className="mb-4 flex items-center">
                        <input 
                            type="checkbox" 
                            id="remember" 
                            name="remember" 
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="text-blue-500" 
                        />
                        <label htmlFor="remember" className="text-gray-600 ml-2">Recordarme</label>
                    </div>

                    {/* Olvidaste la contraseña? */}
                    <div className="mb-6 text-emerald-600">
                        <a href="#" className="hover:underline">Olvidaste la contraseña?</a>
                    </div>

                    {/* Submit */}
                    <button 
                        type="submit" 
                        className="bg-emerald-600 hover:bg-emerald-700 hover:border-green-950 cursor-pointer text-white font-semibold rounded-md py-2 px-4 w-full"
                    >
                        Iniciar sesión
                    </button>
                </form>
                
                <div className="mt-6 text-gray-600 text-center">
                    No tienes cuenta aquí?{' '}
                    <button 
                        onClick={() => setShowRegister(true)}
                        className="text-emerald-600 hover:underline bg-transparent border-none cursor-pointer">
                        Registrate
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;