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
                setError(err.response?.data?.message || err.message || "Грешка при вчитување на настаните");
                console.error("Error fetching event posts:", err);
                
                // Reset category if it causes an error (invalid enum value)
                if (category && err.response?.status === 400) {
                    console.warn("Invalid category value. Consider updating your filters.");
                }
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