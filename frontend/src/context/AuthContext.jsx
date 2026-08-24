import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    // ==========================================
    // GET STORED USER
    // ==========================================

    const [user, setUser] = useState(() => {

        try {

            const storedUser = localStorage.getItem("user");

            return storedUser
                ? JSON.parse(storedUser)
                : null;

        } catch (error) {

            console.error(
                "Invalid stored user:",
                error
            );

            localStorage.removeItem("user");
            localStorage.removeItem("token");

            return null;
        }
    });


    // ==========================================
    // LOGIN
    // ==========================================

    const login = (userData, token) => {

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        localStorage.setItem(
            "token",
            token
        );

        setUser(userData);
    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


// ==========================================
// USE AUTH
// ==========================================

export const useAuth = () => {
    return useContext(AuthContext);
};


export default AuthProvider;