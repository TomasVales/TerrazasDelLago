import React, { useState, useRef } from 'react';
import { CirclePlus, X, Upload, ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const ProductForm = ({ onAddProduct, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        type: '',
        imageFile: null,
        imagePreview: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const categories = [
        { value: 'Burguers', label: 'Hamburguesas' },
        { value: 'Carnes', label: 'Carnes' },
        { value: 'Pastas', label: 'Pastas' },
        { value: 'Minutas', label: 'Minutas' },
        { value: 'Vinos', label: 'Vinos' },
        { value: 'Bebidas', label: 'Bebidas' },
        { value: 'Postres', label: 'Postres' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            const previewUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, imageFile: file, imagePreview: previewUrl }));
        }
    };

    const removeImage = () => {
        if (formData.imagePreview) URL.revokeObjectURL(formData.imagePreview);
        setFormData(prev => ({ ...prev, imageFile: null, imagePreview: null }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const dataToSend = new FormData();
        dataToSend.append('name', formData.name);
        dataToSend.append('price', formData.price);
        dataToSend.append('description', formData.description);
        dataToSend.append('type', formData.type);
        if (formData.imageFile) dataToSend.append('image', formData.imageFile);

        try {
            await onAddProduct(dataToSend);
            MySwal.fire({
                title: '¡Éxito!',
                text: 'Producto agregado correctamente',
                icon: 'success',
                confirmButtonColor: '#208850',
            });
        } catch (error) {
            MySwal.fire({
                title: 'Error',
                text: error.message || 'No se pudo agregar el producto',
                icon: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in ">
                <div className="border-b border-gray-100 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-900">Agregar Nuevo Producto</h2>
                    <button
                        onClick={onCancel}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Cerrar"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#208850] focus:border-transparent transition-all"
                                placeholder="Ej: Hamburguesa Clásica"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Precio</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#208850] focus:border-transparent transition-all"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Categoría</label>
                            <div className="relative">
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full appearance-none px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#208850] focus:border-transparent transition-all pr-10"
                                    required
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
                            {formData.imagePreview ? (
                                <div className="relative group">
                                    <img
                                        src={formData.imagePreview}
                                        alt="Preview"
                                        className="w-full h-40 object-cover rounded-lg border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={16} className="text-gray-700" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload size={24} className="text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500">Sube una imagen</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG (max. 5MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        required
                                    />
                                </label>
                            )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#208850] focus:border-transparent transition-all"
                                placeholder="Describe el producto en detalle..."
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-[#208850] rounded-lg font-medium text-white hover:bg-[#208850]/90 transition-colors flex items-center disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <CirclePlus size={18} className="mr-2" />
                                    Agregar Producto
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;