import { useEffect, useState } from "react";
import internshipPostRepository from "../repository/internshipPostRepository.js";

const useInternshipPosts = (faculty = null) => {
    const [internshipPosts, setInternshipPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInternshipPosts = async () => {
            try {
                setLoading(true);
                const response = await internshipPostRepository.findAll(faculty);
                setInternshipPosts(response.data);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching internship posts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInternshipPosts();
    }, [faculty]);

    return { internshipPosts, loading, error };
};

export default useInternshipPosts;