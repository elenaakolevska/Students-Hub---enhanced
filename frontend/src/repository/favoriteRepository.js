// Simple localStorage implementation for favorites
const favoriteRepository = {
    // Get favorites from localStorage
    getMyFavorites: (username) => {
        if (!username) {
            return { data: [] };
        }
        
        try {
            const key = `favorites_${username}`;
            console.log('Getting favorites for username:', username);
            console.log('Looking for localStorage key:', key);
            
            const storedFavorites = localStorage.getItem(key);
            console.log('Raw localStorage value:', storedFavorites);
            
            const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
            console.log('Parsed favorites:', favorites);
            
            return { data: favorites };
        } catch (error) {
            console.error("Error getting favorites from localStorage:", error);
            return { data: [] };
        }
    },
    
    // Add favorite to localStorage
    addFavorite: (username, postId) => {
        if (!username || !postId) {
            return Promise.reject(new Error("Username and Post ID are required"));
        }
        
        try {
            const key = `favorites_${username}`;
            console.log('Adding favorite for username:', username);
            console.log('Adding favorite for postId:', postId);
            console.log('localStorage key:', key);
            
            const storedFavorites = localStorage.getItem(key);
            console.log('Existing favorites in localStorage:', storedFavorites);
            
            const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
            
            // Check if already favorited
            const existingIndex = favorites.findIndex(f => f.postId === postId);
            if (existingIndex !== -1) {
                console.log('Post already in favorites');
                return Promise.resolve({ data: favorites[existingIndex] });
            }
            
            // Add new favorite
            const newFavorite = {
                id: Date.now(), // Use timestamp as ID
                postId: postId,
                userId: username,
                createdAt: new Date().toISOString()
            };
            
            favorites.push(newFavorite);
            localStorage.setItem(key, JSON.stringify(favorites));
            
            console.log('Updated favorites stored:', favorites);
            console.log('localStorage now contains:', localStorage.getItem(key));
            
            return Promise.resolve({ data: newFavorite });
        } catch (error) {
            console.error('Error adding favorite:', error);
            return Promise.reject(error);
        }
    },
    
    // Remove favorite from localStorage
    removeFavorite: (username, favoriteId) => {
        try {
            const storedFavorites = localStorage.getItem(`favorites_${username}`);
            if (!storedFavorites) {
                return Promise.resolve();
            }
            
            const favorites = JSON.parse(storedFavorites);
            const updatedFavorites = favorites.filter(f => f.id !== favoriteId);
            
            localStorage.setItem(`favorites_${username}`, JSON.stringify(updatedFavorites));
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }
};

export default favoriteRepository;
