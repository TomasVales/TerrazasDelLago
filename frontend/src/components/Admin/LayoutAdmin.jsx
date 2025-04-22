import React, { useEffect, useState } from 'react';
import { Users, MoveUp, ShoppingCart, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';



const BACKEND_URL = 'http://localhost:3000';


const LayoutAdmin = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ users: 0, orders: 0 });
    const [salesByDate, setSalesByDate] = useState([]);
    const [monthlySales, setMonthlySales] = useState(0);
    const [topProducts, setTopProducts] = useState([]);
    const [todayIncome, setTodayIncome] = useState([]);

    const fetchMonthlySales = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/stats/monthly-sales`, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            const data = await res.json();
            setMonthlySales(data.total);
        } catch (err) {
            console.error('Error al cargar ventas del mes', err);
        }
    };

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

        function fillMissingDates(data, days = 30) {
            const today = new Date();
            const filled = [];

            for (let i = days - 1; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const isoDate = date.toISOString().split('T')[0];

                const existing = data.find(d => d.date === isoDate);
                filled.push({
                    date: isoDate,
                    total: existing ? parseInt(existing.total) : 0,
                });
            }

            return filled;
        }


        const fetchTopProducts = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/stats/top-products`, {
                    headers: { Authorization: `Bearer ${user?.token}` },
                });
                const data = await res.json();
                console.log("📦 Datos de topProducts:", data);
                setTopProducts(data);
            } catch (err) {
                console.error('Error al cargar productos más vendidos', err);
            }
        };

        const fetchSalesByDate = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/stats/sales-by-date`, {
                    headers: { Authorization: `Bearer ${user?.token}` },
                });
                const data = await res.json();

                // Formatear y rellenar días faltantes
                const completed = fillMissingDates(data);

                const formatted = completed.map(d => ({
                    ...d,
                    date: new Date(d.date).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    }),
                }));

                setSalesByDate(formatted);
            } catch (err) {
                console.error('Error al cargar ventas por fecha', err);
            }
        };


        const fetchTodayIncome = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/stats/today-income`, {
                    headers: { Authorization: `Bearer ${user?.token}` },
                });
                const data = await res.json();
                setTodayIncome(data);
            } catch (err) {
                console.error('Error al cargar ingresos de hoy', err);
            }
        };


        fetchMonthlySales();
        fetchSalesByDate();
        fetchStats();
        fetchTopProducts();
        fetchTodayIncome();
    }, [user]);

    return (
        <>
            <div className='h-full p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6'>
                <div className='lg:flex justify-between'>
                    {/*Grafico*/}
                    <div className='w-full px-3 pt-3 mr-4 border border-gray-200 bg-gray-100 rounded-2xl'>
                        <div className='flex items-center justify-between gap-x-2'>
                            <div className='flex items-center px-2 pt-1 gap-x-4'>
                                <dt className='font-bold text-gray-800 sm:text-sm lg:text-[20px]'>Ventas del mes</dt>
                            </div>
                        </div>
                        <div className='mt-2 flex items-baseline justify-between'>
                            <dd className='text-xl px-2 font-semibold text-gray-800'>{monthlySales}</dd>
                        </div>
                        <div className='w-full mt-2'>
                            <div className="w-full  lg:h-[290px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={salesByDate}>
                                        <XAxis dataKey="date" tick={{ fill: '#A0AEC0', fontSize: 10 }} />

                                        <YAxis hide />
                                        <Tooltip contentStyle={{ padding: '12px', backgroundColor: '#eef1ef', border: 'none', borderRadius: '9px' }} />
                                        <Line type="monotone" dataKey="total" stroke="#219c4a" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    {/*cajas users y pedidos*/}
                    <div className='lg:w-[400px]'>
                        <div className='flex xs:w-full lg:w-full lg:mt-0 xs:mt-4 mi:flex-row xs:flex-col lg:flex-col gap-4'>
                            {/* Usuarios */}
                            <div className='

                                rounded-2xl border xs:w-full border-gray-200 bg-white p-5 dark:bg-white/[0.03] md:p-6'>
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
                                </div>
                            </div>

                            {/* Pedidos */}
                            <div className='rounded-2xl xs:w-full border border-gray-200 bg-white p-5 dark:bg-white/[0.03] md:p-6'>
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
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                {/*Tablas*/}
                <div className='mt-4 col-span-full xl:col-span-6 border border-gray-200  shadow-xs rounded-xl'>
                    <header className='px-5 py-4 border-b border-gray-100'>
                        <h2 className='font-semibold text-lg text-gray-800'>Los mas pedidos</h2>
                    </header>
                    <div className='p-3'>
                        <div className='overflow-x-auto'>
                            <table className='table-auto w-full'>
                                <thead className='text-xs font-semibold uppercase bg-gray-100 text-gray-400'>
                                    <tr>
                                        <th className='p-2 whitespace-nowrap'>
                                            <div className='font-semibold text-left'>
                                                Nombre
                                            </div>
                                        </th>
                                        <th className='p-2 whitespace-nowrap'>
                                            <div className='font-semibold text-left'>
                                                Ventas
                                            </div>
                                        </th>
                                        <th className='p-2 whitespace-nowrap'>
                                            <div className='font-semibold text-left'>
                                                Ganacias
                                            </div>
                                        </th>
                                        <th className='p-2 whitespace-nowrap'>
                                            <div className='font-semibold text-center'>
                                                stock
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='text-sm divide-y divide-gray-200'>
                                    {topProducts.map((p) => (
                                        <tr key={p.productId}>
                                            <td className='p-2 whitespace-nowrap'>
                                                <div className='flex items-center'>
                                                    <div className='w-10 h-10 mr-2 sm:mr-3'>
                                                        <img
                                                            src={`${import.meta.env.VITE_BACKEND_URL}${p.Product.image}`}
                                                            alt={p.Product.name}
                                                            className='rounded object-cover w-full h-full'
                                                            onError={(e) => (e.target.src = '/default.jpg')}
                                                        />
                                                    </div>
                                                    <div className='font-medium text-gray-800'>{p.Product.name}</div>
                                                </div>
                                            </td>
                                            <td className='p-2 whitespace-nowrap'>{p.ventas}</td>
                                            <td className='p-2 whitespace-nowrap font-medium text-green-500'>
                                                ${p.ventas * p.Product.price}
                                            </td>
                                            <td className='p-2 whitespace-nowrap w-[200px]'>
                                                <div className='flex justify-center text-center'>
                                                    <div
                                                        className={`border rounded-2xl px-3 py-0.5 font-semibold text-sm
                ${p.Product.stock > 0
                                                                ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                                                : 'bg-red-100 text-red-600 border-red-300'
                                                            }`}>
                                                        {typeof p.Product.stock === 'number' && p.Product.stock > 0 ? ' Stock' : 'Sin Stock'}

                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='mt-4 col-span-full xl:col-span-6 border border-gray-200  shadow-xs rounded-xl'>
                    <header className='font-semibold text-lg text-gray-800 px-5 py-4 border-b border-gray-200'>
                        <h2>Ingresos</h2>
                    </header>
                    <div className='p-3'>
                        <header className='text-sm font-medium text-gray-400 uppercase p-2 bg-gray-200'>hoy</header>
                        <div>
                            <ul className='my-1'>
                                {todayIncome.map((item, i) => (
                                    <li key={i} className='flex px-2'>
                                        <div className='w-9 h-9 rounded-full bg-emerald-500 my-2 mr-3'>
                                            <div className='text-white flex justify-center h-full items-center'>
                                                <ArrowRight className='h-5 w-5' />
                                            </div>
                                        </div>
                                        <div className='grow flex items-center border-b border-gray-200 text-sm py-2'>
                                            <div className='grow flex justify-between'>
                                                <div className='self-center'>
                                                    <span className='font-medium text-gray-800'>{item.Product.name}</span>
                                                </div>
                                                <div className='shrink-0 self-start ml-2'>
                                                    <span className='font-medium text-green-500 text-[16px] pr-2'>
                                                        +${parseFloat(item.income).toLocaleString('es-AR')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LayoutAdmin;
