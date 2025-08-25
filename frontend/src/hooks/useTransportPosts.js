import { useEffect, useState } from "react";
import transportPostRepository from "../../repository/transportPostRepository.js";

const useTransportPosts = (locationFrom = null, locationTo = null) => {
    const [transportPosts, setTransportPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransportPosts = async () => {
            try {
                setLoading(true);
                const response = await transportPostRepository.findAll(locationFrom, locationTo);
                setTransportPosts(response.data);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching transport posts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransportPosts();
    }, [locationFrom, locationTo]);

    return { transportPosts, loading, error };
};

export default useTransportPosts;