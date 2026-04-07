import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const EditarRecurso = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '', category: 'Árboles y Grafos', difficulty: 'Básico', type: 'Algoritmo', description: '', code_content: ''
    });

    // Cargar los datos actuales del recurso
    useEffect(() => {
        fetch(`http://localhost:8080/api/recursos/${id}`)
            .then(res => res.json())
            .then(data => setFormData(data))
            .catch(err => console.error("Error al cargar datos:", err));
    }, [id]);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Enviar los datos actualizados (PUT)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`http://localhost:8080/api/recursos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) navigate('/admin'); // Volvemos al panel de control
        } catch (error) {
            console.error("Fallo al actualizar:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in pb-12">
            <Link to="/admin" className="text-gray-400 hover:text-cyan-400 mb-6 inline-block">← Volver al Panel</Link>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold text-yellow-500 mb-6">Actualizar Recurso #{id}</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-gray-300">Título</label>
                            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white" />
                        </div>
                        <div>
                            <label className="text-gray-300">Categoría</label>
                            <select required name="category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white">
                                <option value="Árboles y Grafos">Árboles y Grafos</option>
                                <option value="Ordenamiento Externo">Ordenamiento Externo</option>
                                <option value="POO y Polimorfismo">POO y Polimorfismo</option>
                                <option value="Manejo de Excepciones">Manejo de Excepciones</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Para eficientar la doble busqueda de recursos*/}
                        <div>
                            <label className="text-gray-300">Dificultad</label>
                            <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white">
                                <option value="Básico">Básico</option>
                                <option value="Intermedio">Intermedio</option>
                                <option value="Experto">Experto</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-gray-300">Tipo</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white">
                                <option value="Algoritmo">Algoritmo</option>
                                <option value="Fragmento">Fragmento</option>
                                <option value="Patrón">Patrón de Diseño</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-300">Descripción</label>
                        <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-white"></textarea>
                    </div>

                    <div>
                        <label className="text-cyan-400">Código Fuente</label>
                        <textarea required name="code_content" value={formData.code_content} onChange={handleChange} rows={8} className="w-full p-4 bg-[#0d1117] border border-gray-700 rounded text-green-400 font-mono text-sm"></textarea>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg">
                        {isLoading ? "Sobreescribiendo datos..." : "Actualizar en Base de Datos"}
                    </button>
                </form>
            </div>
        </div>
    );
};