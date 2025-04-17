import React, { useState, useEffect, useRef } from 'react';
import { CirclePlus, Ellipsis } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ProductForm from './ProductForm';
import EditProduct from './EditProduct';

const BACKEND_URL = 'http://localhost:3000';
const MySwal = withReactContent(Swal);

const ProdAdmin = () => {
    const { user } = useAuth();
    const [ActivateP, setActivateP] = useState('');
    const [showMenu, setShowMenu] = useState(null);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/products`, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setProducts(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddProduct = async (formData) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/products`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${user?.token}` },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            fetchProducts();
            setShowAddForm(false);
            MySwal.fire('¡Éxito!', 'Producto agregado correctamente', 'success');
        } catch (error) {
            MySwal.fire('Error', error.message || 'No se pudo agregar el producto', 'error');
        }
    };

    const handleUpdateProduct = async (id, formData) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${user?.token}` },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            fetchProducts();
            setEditingProduct(null);
            MySwal.fire('¡Actualizado!', 'Producto editado correctamente', 'success');
        } catch (error) {
            MySwal.fire('Error', error.message || 'No se pudo editar el producto', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            if (!res.ok) throw new Error('Error al eliminar producto');
            fetchProducts();
            MySwal.fire('Eliminado', 'El producto fue eliminado correctamente.', 'success');
        } catch (err) {
            setError(err.message);
            MySwal.fire('Error', 'No se pudo eliminar el producto.', 'error');
        }
    };

    const confirmarEliminacion = (product) => {
        const inputBusqueda = document.querySelector('.input-busqueda');
        if (inputBusqueda) inputBusqueda.blur();
        setShowMenu(null);

        MySwal.fire({
            title: '¿Eliminar producto?',
            text: `Estás por eliminar "${product.name}". Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(product.id);
            }
        });
    };

    const getMainCategory = (type) => {
        if (['Burguers', 'Carnes', 'Pastas', 'Minutas'].includes(type)) return 'Comidas';
        if (['Vinos', 'Bebidas'].includes(type)) return 'Bebidas';
        if (type === 'Postres') return 'Postres';
        return type;
    };

    const filteredProducts = ActivateP
        ? products.filter((product) => getMainCategory(product.type) === ActivateP)
        : products;

    return (
        <>
            <div className='bg-gray-50 p-4 xs:px-0.5'>
                {/*Filtro y añadir producto*/}
                <div className='
                lg:px-4 pb-2 lg:flex-row
                lg:justify-between lg:items-center lg:gap-0
                xs:flex-col xs:gap-3 xs:items-start
                flex'>
                    <div className='inline-flex h-10 rounded-md p-1 bg-gray-100'>
                        {['', 'Comidas', 'Bebidas', 'Postres'].map((tipo) => (
                            <button
                                key={tipo}
                                onClick={() => setActivateP(tipo)}
                                className={`whitespace-nowrap cursor-pointer px-3 py-1.5 text-sm font-medium transition-all
                                    ${ActivateP === tipo ? 'rounded-sm bg-white shadow-2xl' : 'text-gray-500 font-medium'}`}
                            >
                                {tipo === '' ? 'Todos' : tipo}
                            </button>
                        ))}
                    </div>
                    <div className='
                    xs:ml-0 lg:ml-90
                    ml-auto flex flex-inline items-center'>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className='cursor-pointer hover:bg-[#208850]/80 flex gap-1 items-center bg-[#208850] px-3 h-8 rounded text-sm font-medium text-white'>
                            <CirclePlus size={14} />
                            Añadir Producto
                        </button>
                    </div>
                </div>
                {/*Lista*/}        
                <div className='mt-3'>
                    <div className='rounded-lg border border-gray-400 shadow-sm bg-white'>
                        <div className='
                        xs:p-5
                        flex flex-col space-y-1.5 lg:p-6'>
                            <h3 className='
                            xs:text-[22px]
                            lg:text-2xl pb-1 font-semibold leading-none tracking-tight'>Productos</h3>
                            <p className='
                            xs:text-[13px]
                            lg:text-sm text-gray-500'>Maneja y ve las estadísticas de tus productos.</p>
                        </div>
                        <div className='p-6 pt-0'>
                            <div className='relative w-full overflow-x-auto'>
                                <table className='
                                
                                w-full  text-sm'>
                                    <thead className='
                                    
                                    border-b'>
                                        <tr className='

                                        border-b border-gray-200 transition-colors hover:bg-gray-50 bg-white'>
                                            <th className='
                                            
                                            h-15 px-4 text-left align-middle font-medium text-gray-500 w-[100px] '>
                                                <span className='sr-only'>imagen</span>
                                            </th>
                                            <th className='
                                            
                                            h-15 px-4 text-left align-middle font-medium text-gray-500'>Nombre</th>
                                            <th className='
                                            
                                            h-15 px-4 text-left align-middle font-medium text-gray-500'>Stock</th>
                                            <th className='
                                            
                                            h-15 px-4 text-left align-middle font-medium text-gray-500 '>Precio</th>
                                            <th className='
                                            
                                            h-15 px-4 text-left align-middle font-medium text-gray-500 '>Ventas Totales</th>
                                            <th className='
                                            
                                            h-15 px-4 text-left align-middle font-medium text-gray-500 '>Creación</th>
                                            <th className='
                                            
                                            h-15 px-4 text-left align-middle font-medium text-gray-500'>
                                                <span className='sr-only'>Acciones</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((product, index) => (
                                            <tr key={product.id} className='border-b border-gray-100 hover:bg-gray-50 bg-white'>
                                                <td className='p-4 align-middle hidden xs:table-cell'>
                                                    <img
                                                        src={`${BACKEND_URL}${product.image}?ts=${Date.now()}`}
                                                        alt={product.name}
                                                        className='w-[70px] h-[64px] min-w-[70px] min-h-[64px] rounded-md object-cover'
                                                    />
                                                </td>
                                                <td className='xs:px-2 align-middle font-medium'>{product.name}</td>
                                                <td className='p-4 align-middle'>
                                                    <div className='inline-flex items-center rounded-full border px-2.5 py-0.5 border-gray-200 text-xs font-semibold capitalize'>
                                                        disponible
                                                    </div>
                                                </td>
                                                <td className='p-4 align-middle'>${parseFloat(product.price).toFixed(2)}</td>
                                                <td className='p-4 align-middle'>-</td>
                                                <td className='p-4 align-middle'>
                                                    {new Date(product.createdAt).toLocaleDateString('es-AR')}
                                                </td>
                                                <td className='p-4 align-middle relative'>
                                                    <button
                                                        onClick={() => setShowMenu(showMenu === index ? null : index)}
                                                        className='align-middle cursor-pointer'
                                                    >
                                                        <Ellipsis size={20} />
                                                    </button>
                                                    {showMenu === index && (
                                                        <div className='absolute p-1 right-19 bottom-9 transition duration-300 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-9999'>
                                                            <div className='px-4 py-2 text-sm font-semibold text-gray-500'>Acciones</div>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingProduct(product);
                                                                    setShowMenu(null);
                                                                }}
                                                                className='cursor-pointer rounded-sm w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-black'
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => confirmarEliminacion(product)}
                                                                className="cursor-pointer rounded-sm w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showAddForm && (
                <ProductForm
                    onAddProduct={handleAddProduct}
                    onCancel={() => setShowAddForm(false)}
                />
            )}

            {editingProduct && (
                <EditProduct
                    product={editingProduct}
                    onUpdate={handleUpdateProduct}
                    onCancel={() => setEditingProduct(null)}
                />
            )}
        </>
    );
};

export default ProdAdmin;