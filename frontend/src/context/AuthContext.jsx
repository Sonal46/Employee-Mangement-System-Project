import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("payroll_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);


  // Check logged in user
  useEffect(() => {
    const token = localStorage.getItem("payroll_token");

    if (!token) return;

    setLoading(true);

    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user);

        localStorage.setItem(
          "payroll_user",
          JSON.stringify(res.data.user)
        );
      })

      .catch((error) => {
        console.log("Auth Error:", error);

        localStorage.removeItem("payroll_token");
        localStorage.removeItem("payroll_user");

        setUser(null);
      })

      .finally(() => {
        setLoading(false);
      });

  }, []);



  // Login
  const login = async (email, password) => {

    try {

      const res = await api.post(
        "/auth/login",
        {
          email: email.trim().toLowerCase(),
          password,
        }
      );


      localStorage.setItem(
        "payroll_token",
        res.data.token
      );

      localStorage.setItem(
        "payroll_user",
        JSON.stringify(res.data.user)
      );


      setUser(res.data.user);

      return res.data.user;

    } catch (error) {

      console.log(
        "Login Error:",
        error.response?.data || error.message
      );

      throw error;
    }
  };



  // Logout
  const logout = () => {

    localStorage.removeItem(
      "payroll_token"
    );

    localStorage.removeItem(
      "payroll_user"
    );

    sessionStorage.removeItem(
      "payflow-welcome-pending"
    );

    setUser(null);
  };



  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
    }),
    [user, loading]
  );


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

};



export const useAuth = () => {
  return useContext(AuthContext);
};
