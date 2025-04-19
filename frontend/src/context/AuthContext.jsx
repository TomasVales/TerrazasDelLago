import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ CORRECTO


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { id, role, token }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            const stored = localStorage.getItem('auth');
            if (!stored) {
                setLoading(false);
                return;
            }

            const parsed = JSON.parse(stored);

            try {
                const decoded = jwtDecode(parsed.token);

                // ⏰ Expiración
                if (decoded.exp * 1000 < Date.now()) {
                    console.warn('⚠️ Token expirado automáticamente');
                    localStorage.removeItem('auth');
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${parsed.token}`,
                    },
                });

                if (!res.ok) throw new Error('Token inválido');

                const userData = await res.json();
                setUser({ ...parsed, ...userData });
            } catch (err) {
                console.warn('🔐 Token inválido o error:', err.message);
                localStorage.removeItem('auth');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, []);
    const login = (data) => {
        setUser(data);
        localStorage.setItem('auth', JSON.stringify(data));

        // ✅ Extraer el token desde data
        const decoded = jwtDecode(data.token);
        const expirationMs = decoded.exp * 1000 - Date.now();

        if (!data?.token) {
            console.warn('🚨 No se recibió token en login');
            return;
        }

        setTimeout(() => {
            logout();
        }, expirationMs);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
