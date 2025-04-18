import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Logo from '../assets/logo3.webp';
import Image from '../assets/imagen.webp';

function Register({ onSwitch }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [captchaToken, setCaptchaToken] = useState(null);
    const [message, setMessage] = useState('');
    const [errores, setErrores] = useState([]);
    const erroresTemp = [];
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setErrores([]); // ✅ si usás un array de errores múltiples


        if (!nameRegex.test(form.name)) {
            erroresTemp.push({ msg: 'El nombre solo debe contener letras y espacios' });
        }

        if (form.password !== form.confirmPassword) {
            erroresTemp.push({ msg: 'Las contraseñas no coinciden' });
        }

        if (!captchaToken) {
            erroresTemp.push({ msg: 'Por favor verifica que no sos un robot.' });
        }

        if (erroresTemp.length > 0) {
            setErrores(erroresTemp);
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    captchaToken: captchaToken,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.log('🛑 Errores del backend:', data);
                if (data.errors && Array.isArray(data.errors)) {
                    setErrores(data.errors);
                } else {
                    setMessage('❌ ' + (data.message || 'Error en el registro'));
                }
                return;
            }

            // ✅ Registro exitoso
            setMessage('✅ Usuario creado. Ahora podés iniciar sesión.');
            setForm({ name: '', email: '', password: '', confirmPassword: '' });
            setCaptchaToken(null);
            setErrores([]);
        } catch (err) {
            console.error(err);
            setMessage('❌ Error inesperado. Intentalo de nuevo más tarde.');
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
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

                    {/* CAPTCHA */}
                    <div className="mb-6 flex justify-center">
                        <ReCAPTCHA
                            sitekey="6LceNRwrAAAAAIjgmlUO-TF70hFgdODC_ey_cH3Q"
                            onChange={(token) => setCaptchaToken(token)}
                        />
                    </div>


                    <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-800 cursor-pointer text-white font-semibold rounded-md py-2 px-4 w-full"
                    >
                        Registrarse
                    </button>

                    {errores.length > 0 && (
                        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mt-4 text-sm">
                            {errores.map((err, i) => (
                                <p key={i}>• {err.msg}</p>
                            ))}
                        </div>
                    )}

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

            <div className="w-1/2 h-screen hidden lg:block">
                <img src={Image} alt="Image" className="object-cover w-full h-full" />
            </div>
        </div>
    );
}

export default Register;
