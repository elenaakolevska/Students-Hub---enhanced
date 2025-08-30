import { useEffect, useState } from "react";
import eventPostRepository from "../repository/eventPostRepository.js";

const useEventPosts = (category = null) => {
    const [eventPosts, setEventPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventPosts = async () => {
            try {
                setLoading(true);
                const response = await eventPostRepository.findAll(category);
                setEventPosts(response.data);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching event posts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEventPosts();
    }, [category]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return { eventPosts, loading, error };
};

export default useEventPosts;