import React, { useEffect, useState } from 'react';
import { Users, MoveUp, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BACKEND_URL = 'http://localhost:3000';

const LayoutAdmin = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ users: 0, orders: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/stats`, {
                    headers: { Authorization: `Bearer ${user?.token}` },
                });
                const data = await res.json();
                if (res.ok) setStats(data);
                else throw new Error(data.message);
            } catch (error) {
                console.error('Error al obtener estadísticas:', error);
            }
        };

        fetchStats();
    }, [user]);

    return (
        <>
            <div className='h-full p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6'>
                <div className='grid grid-cols-12 gap-4 md:gap-6'>
                    <div className='col-span-12 space-y-6 xl:col-span-7'>
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 mb-5'>

                            {/* Usuarios */}
                            <div className='rounded-2xl border border-gray-200 bg-white p-5 dark:bg-white/[0.03] md:p-6'>
                                <div className='flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-200'>
                                    <Users size={20} />
                                </div>
                                <div className='flex items-end justify-between mt-5'>
                                    <div>
                                        <span className='text-sm text-gray-500 dark:text-gray-400'>
                                            Clientes
                                        </span>
                                        <h4 className='mt-2 font-bold text-gray-800 text-2xl'>
                                            {stats.users}
                                        </h4>
                                    </div>
                                    <span className='inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-sm bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500'>
                                        <MoveUp size={14} />
                                        +0%
                                    </span>
                                </div>
                            </div>

                            {/* Pedidos */}
                            <div className='rounded-2xl border border-gray-200 bg-white p-5 dark:bg-white/[0.03] md:p-6'>
                                <div className='flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-200'>
                                    <ShoppingCart size={20} />
                                </div>
                                <div className='flex items-end justify-between mt-5'>
                                    <div>
                                        <span className='text-sm text-gray-500 dark:text-gray-400'>
                                            Pedidos
                                        </span>
                                        <h4 className='mt-2 font-bold text-gray-800 text-2xl'>
                                            {stats.orders}
                                        </h4>
                                    </div>
                                    <span className='inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-sm bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500'>
                                        <MoveUp size={14} />
                                        +0%
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LayoutAdmin;
