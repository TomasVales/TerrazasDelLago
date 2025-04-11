// src/pages/Auth.jsx
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

function Auth() {
    const [view, setView] = useState('login');

    return (
        <>
            {view === 'login' ? (
                <Login onSwitch={() => setView('register')} />
            ) : (
                <Register onSwitch={() => setView('login')} />
            )}
        </>
    );
}

export default Auth;
