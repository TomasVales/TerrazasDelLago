import { useState } from 'react';

function Register({ goBack }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Error en el registro');

            setMessage('✅ Usuario creado. Ahora podés iniciar sesión.');
            setForm({ name: '', email: '', password: '' });
        } catch (err) {
            setMessage('❌ ' + err.message);
        }
    };

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Registrarse</h2>
            {message && <p>{message}</p>}
            <form
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    maxWidth: '300px',
                    margin: 'auto',
                }}
            >
                <input
                    type="text"
                    placeholder="Nombre"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Correo"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />
                <button type="submit">Crear cuenta</button>
            </form>

            <button onClick={goBack} style={{ marginTop: '1rem' }}>
                Volver al Login
            </button>
        </div>
    );
}

export default Register;
