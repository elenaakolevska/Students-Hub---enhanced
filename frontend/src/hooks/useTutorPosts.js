import { useEffect, useState, useCallback } from "react";
import tutorPostRepository from "../repository/tutorPostRepository.js";

const useTutorPosts = (tutorName = null, subject = null) => {
    const [tutorPosts, setTutorPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTutorPosts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await tutorPostRepository.findAll(tutorName, subject);
            setTutorPosts(response.data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching tutor posts:", err);
        } finally {
            setLoading(false);
        }
    }, [tutorName, subject]);

    useEffect(() => {
        fetchTutorPosts();
    }, [fetchTutorPosts]);

    return { tutorPosts, loading, error, refetch: fetchTutorPosts };
};

export default useTutorPosts;