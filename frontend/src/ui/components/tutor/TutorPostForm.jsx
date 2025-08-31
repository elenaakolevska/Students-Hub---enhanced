import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import tutorPostRepository from '../../../repository/tutorPostRepository';
import { toast } from 'react-toastify';

const TutorPostForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tutorName: '',
        subject: '',
        rating: '3', // Default to middle rating
        tagsString: ''
    });
    
    useEffect(() => {
        if (isEdit) {
            const fetchPost = async () => {
                try {
                    setLoading(true);
                    const response = await tutorPostRepository.findById(id);
                    const post = response.data;
                    
                    // Ensure the rating is a string and not a number
                    const ratingAsString = post.rating ? post.rating.toString() : '3';
                    
                    const updatedFormData = {
                        title: post.title || '',
                        description: post.description || '',
                        tutorName: post.tutorName || '',
                        subject: post.subject || '',
                        rating: ratingAsString,
                        tagsString: post.tags ? post.tags.join(', ') : ''
                    };
                    setFormData(updatedFormData);
                    setError(null);
                } catch (err) {
                    setError(err.response?.data?.message || err.message);
                    console.error('Error fetching tutor post:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchPost();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = {
            ...formData,
            [name]: value
        };
        setFormData(updatedFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if title is empty
        if (!formData.title.trim()) {
            setError("Насловот е задолжително поле");
            return;
        }
        
        // Check if rating is selected
        if (!formData.rating) {
            setError("Оцената е задолжително поле");
            return;
        }
        
        setLoading(true);
        setError(null);

        try {
            const dataToSend = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                tutorName: formData.tutorName.trim(),
                subject: formData.subject.trim(),
                rating: formData.rating,
                tags: formData.tagsString.split(',').map(t => t.trim()).filter(Boolean)
            };

            if (isEdit) {
                await tutorPostRepository.update(id, dataToSend);
                
                // Show success message
                toast.success("Тутор постот беше успешно ажуриран!");
                
                // Navigate to the details page of the updated post
                navigate(`/tutor-posts/${id}`);
            } else {
                const response = await tutorPostRepository.save(dataToSend);
                
                // Show success message
                toast.success("Тутор постот беше успешно креиран!");
                
                // Navigate to the details page of the newly created post
                const newId = response.data.id;
                navigate(`/tutor-posts/${newId}`);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Грешка при зачувување на постот';
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="mb-0">{isEdit ? 'Уреди тутор пост' : 'Создади тутор пост'}</h2>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Наслов:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="Внесете наслов на постот"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="tutorName" className="form-label">Име на тутор:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tutorName"
                                        name="tutorName"
                                        value={formData.tutorName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Пр. Иван Петровски"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="subject" className="form-label">Предмет:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="Пр. Математика, Програмирање, Физика"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="rating" className="form-label">Оцена (1-5):</label>
                                    <select
                                        className="form-select"
                                        id="rating"
                                        name="rating"
                                        value={formData.rating || '3'} /* Default to 3 if empty */
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="1">1 - Слаба</option>
                                        <option value="2">2 - Добра</option>
                                        <option value="3">3 - Многу добра</option>
                                        <option value="4">4 - Одлична</option>
                                        <option value="5">5 - Совршена</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Опис:</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        required
                                        placeholder="Опишете го искуството со тутор..."
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="tagsString" className="form-label">Тагови (одделени со запирка):</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tagsString"
                                        name="tagsString"
                                        value={formData.tagsString}
                                        onChange={handleChange}
                                        placeholder="пр. математика, калкулус, напреден"
                                    />
                                    <small className="form-text text-muted">
                                        Одделете ги таговите со запирка
                                    </small>
                                </div>

                                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                    <button
                                        type="button"
                                        className="btn btn-secondary me-md-2"
                                        onClick={() => navigate('/tutor-posts')}
                                    >
                                        Откажи
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Се зачувува...' : (isEdit ? 'Ажурирај' : 'Создади')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorPostForm;
