import { useEffect, useState } from "react";
import materialPostRepository from "../repository/materialPostRepository.js";

const useMaterialPosts = (subject = null) => {
    const [materialPosts, setMaterialPosts] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [postsResponse, subjectsResponse] = await Promise.all([
                    materialPostRepository.findAll(subject),
                    materialPostRepository.getAllSubjects()
                ]);
                setMaterialPosts(postsResponse.data);
                setSubjects(subjectsResponse.data);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching material posts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [subject]);

    return { materialPosts, subjects, loading, error };
};

export default useMaterialPosts;
