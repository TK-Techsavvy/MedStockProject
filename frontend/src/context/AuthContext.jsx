import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";


// ============================================================
// AUTH CONTEXT
// ============================================================

const AuthContext = createContext(null);


// ============================================================
// AUTH PROVIDER
// ============================================================

const AuthProvider = ({ children }) => {

    // ========================================================
    // USER
    // ========================================================

    const [user, setUser] = useState(() => {

        try {

            const savedUser =
                localStorage.getItem("user");

            return savedUser
                ? JSON.parse(savedUser)
                : null;

        } catch (error) {

            console.error(
                "Unable to load saved user:",
                error
            );

            return null;
        }
    });


    // ========================================================
    // TOKEN
    // ========================================================

    const [token, setToken] = useState(() => {

        return localStorage.getItem("token");
    });


    // ========================================================
    // THEME
    // ========================================================

    const [theme, setTheme] = useState(() => {

        return (
            localStorage.getItem("theme") ||
            "Light"
        );
    });


    // ========================================================
    // APPLY THEME GLOBALLY
    // ========================================================

    useEffect(() => {

        const root =
            document.documentElement;


        if (theme === "Dark") {

            root.classList.add("dark");

        } else {

            root.classList.remove("dark");
        }

    }, [theme]);


    // ========================================================
    // LOAD SETTINGS FROM DATABASE
    // ========================================================

    useEffect(() => {

        if (!user?.userId) {
            return;
        }


        const loadUserSettings = async () => {

            try {

                const response = await fetch(
                    `http://localhost:5000/api/settings/${user.userId}`
                );


                if (!response.ok) {

                    console.warn(
                        "Unable to load user settings."
                    );

                    return;
                }


                const data =
                    await response.json();


                if (
                    data.success &&
                    data.settings
                ) {

                    const savedTheme =
                        data.settings.theme ||
                        "Light";


                    setTheme(savedTheme);


                    localStorage.setItem(
                        "theme",
                        savedTheme
                    );
                }

            } catch (error) {

                console.error(
                    "Load user settings error:",
                    error
                );
            }
        };


        loadUserSettings();

    }, [user]);


    // ========================================================
    // CHANGE THEME
    // ========================================================

    const changeTheme = (newTheme) => {

        setTheme(newTheme);

        localStorage.setItem(
            "theme",
            newTheme
        );
    };


    // ========================================================
    // LOGIN
    // ========================================================

    const login = (
        userData,
        authToken
    ) => {

        setUser(userData);

        setToken(authToken);


        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );


        localStorage.setItem(
            "token",
            authToken
        );
    };


    // ========================================================
    // LOGOUT
    // ========================================================

    const logout = () => {

        setUser(null);

        setToken(null);


        localStorage.removeItem("user");

        localStorage.removeItem("token");

        localStorage.removeItem("theme");


        document.documentElement.classList.remove(
            "dark"
        );


        setTheme("Light");
    };


    // ========================================================
    // CONTEXT VALUE
    // ========================================================

    const value = {

        user,

        token,

        login,

        logout,

        theme,

        changeTheme
    };


    return (

        <AuthContext.Provider value={value}>

            {children}

        </AuthContext.Provider>
    );
};


// ============================================================
// USE AUTH
// ============================================================

export const useAuth = () => {

    return useContext(AuthContext);
};


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default AuthProvider;