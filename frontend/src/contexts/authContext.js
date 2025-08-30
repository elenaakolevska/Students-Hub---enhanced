import React from "react";

const authContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
	// You can add real auth logic here
	const [user, setUser] = React.useState(null);
	const logout = () => setUser(null);
	const value = { user, setUser, logout };
	return (
		<authContext.Provider value={value}>
			{children}
		</authContext.Provider>
	);
};

export default authContext;