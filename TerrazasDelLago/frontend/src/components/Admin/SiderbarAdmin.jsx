import React, { useContext, useEffect, useState, createContext } from 'react';
import { ChevronFirst, ChevronLast, EllipsisVertical } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import profile from '../../assets/profile.png';

const SidebarContext = createContext();
const BACKEND_URL = 'http://localhost:3000';

export default function Sidebar({ children, setActiveItem }) {
    const [expanded, setExpanded] = useState(true);
    const { user } = useAuth();
    const [profileData, setProfileData] = useState({ name: '', email: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/users/me`, {
                    headers: { Authorization: `Bearer ${user?.token}` },
                });
                const data = await res.json();
                if (res.ok) setProfileData(data);
            } catch (error) {
                console.error('Error al obtener perfil:', error);
            }
        };
        if (user?.token) fetchProfile();
    }, [user]);

    const handleProfileClick = () => {
        setActiveItem('Perfil');
    };

    return (
        <aside className={`min-h-screen transition-all duration-300 
            ${expanded ? 'w-64' : 'w-17'} hidden md:block`}>
            <nav className='h-full flex flex-col bg-white border-r border-gray-400 shadow-2xl'>
                <div className='p-4 pb-2 flex justify-between items-center'>
                    <p className={`overflow-hidden transition-all duration-300
                        ${expanded ? "text-[21px] text-[#208850] font-semibold font-sans" : "text-[0px]"}`}>
                        Terrazas del Lago
                    </p>
                    <button onClick={() => setExpanded(curr => !curr)}
                        className='p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100'>
                        {expanded ? <ChevronFirst /> : <ChevronLast />}
                    </button>
                </div>
    
                <SidebarContext.Provider value={{ expanded }}>
                    <ul className='flex-1 px-3'>{children}</ul>
                </SidebarContext.Provider>
    
                <div onClick={handleProfileClick} className='border-t border-gray-400 flex p-3 cursor-pointer hover:bg-gray-100'>
                    <img src={profile} alt='Perfil' className='w-10 h-10 rounded-md object-cover' />
                    <div className={`flex justify-between items-center overflow-hidden transition-all 
                        ${expanded ? "w-52 ml-3" : "w-0"}`}>
                        <div className='leading-4'>
                            <h4 className='font-semibold truncate pb-1'>{profileData.name || 'Usuario'}</h4>
                            <span className='text-xs text-gray-600 truncate'>{profileData.email || ''}</span>
                        </div>
                    </div>
                </div>
            </nav>
        </aside>
    );
}

export function SidebarItem({ icon, text, active, onClick }) {
    const { expanded } = useContext(SidebarContext);
    return (
        <li
            onClick={onClick}
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer	
            transition-colors group 
            ${active ? "bg-gradient-to-tr from-[#208850]/20 to-[#208850]/20 text-[#208850]" : "hover:bg-[#208850]/50 text-gray-600"}`}>
            {icon}
            <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
            {!expanded && (
                <div className={`z-99 absolute left-full rounded-md px-2 py-1 ml-6 
                    bg-white/90 text-[#208850] text-sm invisible opacity-20
                    -translate-x-3 transition-all group-hover:translate-x-0
                    group-hover:opacity-100 group-hover:visible`}>
                    {text}
                </div>
            )}
        </li>
    );
}

export function SidebarItemLogout({ icon, text, active, onClick }) {
    const { expanded } = useContext(SidebarContext);
    return (
        <li
            onClick={onClick}
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer	
            transition-colors group 
            ${active ? "" : "hover:bg-[#c51111]/30 text-[#fd1313]"}`}>
            {icon}
            <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
            {!expanded && (
                <div className={`absolute left-full rounded-md z-99 px-3 py-1 ml-6 
                    bg-white/90 text-[#fd1313] text-sm  invisible opacity-20
                    -translate-x-3 transition-all group-hover:translate-x-0
                    group-hover:opacity-100 group-hover:visible`}>
                    {text}
                </div>
            )}
        </li>
    );
}