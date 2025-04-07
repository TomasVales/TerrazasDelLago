import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Login({ onRegisterClick }) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

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
        } catch (err) {
            console.error(err);
            setMessage('Login fallido: ' + err.message);
        }
    };

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Iniciar sesión</h2>
            {message && <p style={{ color: 'crimson' }}>{message}</p>}
            <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: 'auto' }}
            >
                <input
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Entrar</button>
            </form>

            <p style={{ marginTop: '1rem' }}>
                ¿No tenés cuenta?{' '}
                <button
                    onClick={onRegisterClick}
                    style={{
                        background: 'none',
                        color: 'blue',
                        textDecoration: 'underline',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    Registrarse
                </button>
            </p>
        </div>
    );
}

export default Login;
