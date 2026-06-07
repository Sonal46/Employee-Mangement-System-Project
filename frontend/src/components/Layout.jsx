import {
  BarChart3,
  Bell,
  CalendarDays,
  BadgeCheck,
  Building2,
  CreditCard,
  FileBarChart,
  LogOut,
  Moon,
  Settings,
  Sun,
  X,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ChatBot from "./ChatBot";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: BarChart3 },
  { to: "/admin/employees", label: "Employees", icon: Users },
  { to: "/admin/attendance", label: "Attendance", icon: CalendarDays },
  { to: "/admin/payroll", label: "Payroll", icon: CreditCard },
  { to: "/admin/leaves", label: "Leaves", icon: CalendarDays },
  { to: "/admin/reports", label: "Reports", icon: FileBarChart },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const employeeLinks = [
  { to: "/employee", label: "Dashboard", icon: BarChart3 },
  { to: "/employee/profile", label: "Profile", icon: UserRound },
  { to: "/employee/payslips", label: "Payslips", icon: CreditCard },
  { to: "/employee/leaves", label: "Leaves", icon: CalendarDays },
];

const BrandMark = () => (
  <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-slate-950 via-slate-800 to-mint text-white shadow-lg ring-1 ring-white/10 dark:ring-slate-700/80">
    <Building2 size={20} strokeWidth={2.2} />
    <div className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full border border-white/80 bg-emerald-300 text-slate-950 shadow-sm">
      <BadgeCheck size={10} strokeWidth={2.8} />
    </div>
  </div>
);

const Layout = () => {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(() => {
    const saved = window.localStorage.getItem("payflow-theme");
    if (saved) return saved === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const links = user?.role === "admin" ? adminLinks : employeeLinks;

  useEffect(() => {
    api.get("/notifications").then(({ data }) => setNotifications(data)).catch(() => setNotifications([]));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("payflow-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (!user) {
      setShowWelcome(false);
      return;
    }

    if (sessionStorage.getItem("payflow-welcome-pending") !== "1") {
      return;
    }

    sessionStorage.removeItem("payflow-welcome-pending");
    setShowWelcome(true);

    const timer = window.setTimeout(() => setShowWelcome(false), 3200);
    return () => window.clearTimeout(timer);
  }, [user]);

  const unread = notifications.filter((item) => !item.isRead).length;
  const welcomeTitle = user?.role === "admin" ? "Welcome to Admin Panel" : "Welcome to Employee Portal";
  const welcomeSubtitle =
    user?.role === "admin"
      ? "You are now inside the admin workspace. Review payroll, attendance, and reports from one place."
      : "Your dashboard, payslips, leave requests, and profile tools are ready.";

  const dismissNotification = (notificationId) => {
    setNotifications((current) => current.filter((item) => (item._id ?? item.id) !== notificationId));
  };

  return (
    <div className={dark ? "dark min-h-screen bg-slate-950 text-slate-100" : "min-h-screen bg-[linear-gradient(180deg,#f6f8f3_0%,#eef3ec_42%,#e7efe8_100%)] text-ink"}>
      <aside className={dark ? "fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-800 bg-slate-950/95 backdrop-blur lg:flex lg:flex-col" : "fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col"}>
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6 dark:border-slate-800">
          <BrandMark />
          <div className="min-w-0">
            <h2 className="truncate font-semibold tracking-wide">PayFlow HRMS</h2>
            <h1 className="truncate text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Human resources suite</h1>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin" || to === "/employee"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-teal-50 text-mint" : dark ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-slate-200 px-4 py-4 dark:border-slate-800">
          <div
            className={
              dark
                ? "ml-1 mr-[-0.25rem] translate-x-1 rounded-[1.35rem] border border-slate-800 bg-slate-950 px-3 py-3 shadow-none"
                : "ml-1 mr-[-0.25rem] translate-x-1 rounded-[1.35rem] border border-slate-200 bg-white px-3 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur"
            }
          >
            <div className="flex items-center gap-3">
              <div className={dark ? "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-800 text-white" : "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-950 text-white"}>
                <UserRound size={18} />
              </div>
              <div className="min-w-0">
                <p className={dark ? "text-[11px] uppercase tracking-[0.22em] text-slate-200" : "text-[11px] uppercase tracking-[0.22em] text-slate-500"}>
                  SIGNED IN AS
                </p>
                <p className={dark ? "mt-1 whitespace-normal break-words text-sm font-semibold leading-5 text-white" : "mt-1 whitespace-normal break-words text-sm font-semibold leading-5 text-slate-900"}>
                  Sonal
                </p>
              </div>
            </div>
          </div>
          <div className="ml-1 mr-[-0.25rem] mt-3 flex translate-x-1 justify-end">
            <button
              type="button"
              onClick={() => setDark((value) => !value)}
              className="group flex shrink-0 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-mint hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-mint/60 dark:hover:bg-slate-900"
              aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
              title={dark ? "Switch to light theme" : "Switch to dark theme"}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-950 text-white transition-transform group-hover:scale-105 dark:bg-mint">
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </span>
              <span className="hidden sm:inline">{dark ? "Light mode" : "Dark mode"}</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className={dark ? "sticky top-0 z-10 flex h-16 items-center justify-end border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur lg:px-8" : "sticky top-0 z-10 flex h-16 items-center justify-end border-b border-slate-200 bg-white px-4 lg:px-8"}>
          <div className="flex items-center gap-3" />
          <div className="relative flex items-center gap-2">
            <button onClick={() => setShowNotifications((value) => !value)} className="relative rounded-md border border-slate-200 bg-white p-2 text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800" title="Notifications">
              <Bell size={18} />
              {unread > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1 text-xs text-white">{unread}</span>}
            </button>
            {showNotifications && (
              <div className="absolute right-20 top-11 z-20 w-80 rounded-xl border border-slate-200 bg-white p-3 text-ink shadow-xl dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-semibold">Notifications</h3>
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
                    aria-label="Close notifications"
                    title="Close notifications"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="max-h-80 space-y-2 overflow-auto">
                  {notifications.length === 0 ? (
                    <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800">No notifications yet.</p>
                  ) : (
                    notifications.map((item) => (
                      <div key={item._id ?? item.id} className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 text-sm dark:border-slate-800">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-slate-500">{item.message}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => dismissNotification(item._id ?? item.id)}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
                          aria-label={`Dismiss notification ${item.title}`}
                          title="Dismiss notification"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            <button onClick={logout} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>
        <main className="p-4 lg:p-8"><Outlet /></main>
        <ChatBot />
      </div>

      {showWelcome && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
          <div className="welcome-pop w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="h-2 bg-gradient-to-r from-mint via-sky-400 to-coral" />
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-mint">
                    <BadgeCheck size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Session active</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{welcomeTitle}</h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWelcome(false)}
                  className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:border-mint hover:text-mint dark:border-slate-700 dark:hover:text-white"
                  aria-label="Dismiss welcome popup"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{welcomeSubtitle}</p>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Signed in as</p>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                </div>
                <div className="rounded-full bg-mint/10 px-3 py-1 text-xs font-semibold text-mint dark:bg-white/10 dark:text-white">
                  Ready
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;

