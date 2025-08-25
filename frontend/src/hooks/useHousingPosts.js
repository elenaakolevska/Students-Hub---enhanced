import { useEffect, useState } from "react";
import housingPostRepository from "../repository/housingPostRepository.js";

const useHousingPosts = (municipality = null) => {
    const [housingPosts, setHousingPosts] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [postsResponse, municipalitiesResponse] = await Promise.all([
                    housingPostRepository.findAll(municipality),
                    housingPostRepository.getAllMunicipalities()
                ]);
                setHousingPosts(postsResponse.data);
                setMunicipalities(municipalitiesResponse.data);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching housing data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [municipality]);

    return { housingPosts, municipalities, loading, error };
};

export default useHousingPosts;