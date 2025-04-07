import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { id, role, token }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('auth');
        if (stored) setUser(JSON.parse(stored));
        setLoading(false);
    }, []);

    const login = (data) => {
        setUser(data);
        localStorage.setItem('auth', JSON.stringify(data));
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
