import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, ChevronDown, Pencil } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const EditProduct = ({ product, onUpdate, onCancel }) => {
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

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                price: product.price,
                description: product.description,
                type: product.type,
                imageFile: null,
                imagePreview: product.image ? `http://localhost:3000${product.image}?ts=${Date.now()}` : null
            });
        }
    }, [product]);

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
            await onUpdate(product.id, dataToSend);
            MySwal.fire('Actualizado', 'Producto actualizado correctamente', 'success');
        } catch (error) {
            MySwal.fire('Error', error.message || 'No se pudo actualizar el producto', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = [
        { value: 'Burguers', label: 'Hamburguesas' },
        { value: 'Carnes', label: 'Carnes' },
        { value: 'Pastas', label: 'Pastas' },
        { value: 'Minutas', label: 'Minutas' },
        { value: 'Vinos', label: 'Vinos' },
        { value: 'Bebidas', label: 'Bebidas' },
        { value: 'Postres', label: 'Postres' }
    ];

    return (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[999]">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in">
                <div className="border-b border-gray-100 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-900">Editar Producto</h2>
                    <button onClick={onCancel} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Nombre del Producto</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Precio</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Categoría</label>
                            <div className="relative">
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg pr-10"
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
                            <label className="text-sm font-medium text-gray-700">Imagen del Producto</label>
                            {formData.imagePreview ? (
                                <div className="relative group">
                                    <img src={formData.imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-gray-200" />
                                    <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-white transition-all">
                                        <X size={16} className="text-gray-700" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload size={24} className="text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500">Sube una imagen</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG (max. 5MB)</p>
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Descripción</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg"
                                placeholder="Describe el producto en detalle..."
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70"
                        >
                            <Pencil size={16} className="inline mr-2" />
                            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
