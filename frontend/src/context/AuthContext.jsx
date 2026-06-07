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
    const stored = localStorage.getItem("payroll_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("payroll_token");

    if (!token) {
      return;
    }

    setLoading(true);
    api.get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem(
          "payroll_user",
          JSON.stringify(data.user)
        );
      })
      .catch(() => {
        localStorage.removeItem("payroll_token");
        localStorage.removeItem("payroll_user");
        setUser(null);
      })
      .finally(() => {

        setLoading(false);
      });

  }, []);

  const login = async (email, password) => {
    const { data } = await api.post(
      "/auth/login",
      {
        email: email.trim().toLowerCase(),
        password,
      }
    );

    localStorage.setItem(
      "payroll_token",
      data.token
    );
    localStorage.setItem(
      "payroll_user",
      JSON.stringify(data.user)
    );
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("payroll_token");
    localStorage.removeItem("payroll_user");
    sessionStorage.removeItem("payflow-welcome-pending");
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
  return useContext(AuthContext)
};
