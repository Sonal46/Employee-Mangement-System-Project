import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState({ name: "", email: "", password: "" });
  const [company, setCompany] = useState({ companyName: "PayrollPro", currency: "INR", workingDays: 26, logo: "" });
  const [logoPreview, setLogoPreview] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    api.get("/settings").then(({ data }) => {
      setAdmin({ name: data.admin.name, email: data.admin.email, password: "" });
      setCompany(data.settings);
      setLogoPreview(data.settings.logo || "");
      setLoading(false);
    });
  }, []);

  const saveAdmin = async (event) => {
    event.preventDefault();
    await api.put("/settings/admin-profile", admin);
    toast.success("Admin profile saved");
    setAdmin((current) => ({ ...current, password: "" }));
  };

  const saveCompany = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("companyName", company.companyName);
    formData.append("currency", company.currency);
    formData.append("workingDays", company.workingDays);
    if (logoFile) formData.append("logo", logoFile);
    const { data } = await api.put("/settings/company", formData);
    setCompany(data);
    toast.success("Company settings saved");
  };

  if (loading) return <LoadingSpinner label="Loading settings..." />;

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <form onSubmit={saveAdmin} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Admin Profile</h2>
        <div className="mt-4 grid gap-3">
          <Field label="Name" value={admin.name} onChange={(value) => setAdmin({ ...admin, name: value })} />
          <Field label="Email" type="email" value={admin.email} onChange={(value) => setAdmin({ ...admin, email: value })} />
          <Field label="Change Password" type="password" value={admin.password} onChange={(value) => setAdmin({ ...admin, password: value })} required={false} />
        </div>
        <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-mint px-4 py-2 font-semibold text-white"><Save size={16} />Save Profile</button>
      </form>

      <form onSubmit={saveCompany} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Company Settings</h2>
        <div className="mt-4 grid gap-3">
          <Field label="Company Name" value={company.companyName} onChange={(value) => setCompany({ ...company, companyName: value })} />
          <Field label="Currency" value={company.currency} onChange={(value) => setCompany({ ...company, currency: value })} />
          <Field label="Working Days" type="number" value={company.workingDays} onChange={(value) => setCompany({ ...company, workingDays: value })} />
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-600">Logo Upload</span>
            <input type="file" accept="image/*" className="w-full rounded-md border border-slate-200 px-3 py-2" onChange={(event) => {
              const file = event.target.files?.[0];
              setLogoFile(file || null);
              if (file) setLogoPreview(URL.createObjectURL(file));
            }} />
          </label>
          {logoPreview && <img src={logoPreview.startsWith("/uploads") ? `http://127.0.0.1:5000${logoPreview}` : logoPreview} alt="Company logo preview" className="h-20 w-20 rounded-md border border-slate-200 object-cover" />}
        </div>
        <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-mint px-4 py-2 font-semibold text-white"><Save size={16} />Save Company</button>
      </form>
    </div>
  );
};

const Field = ({ label, value, onChange, type = "text", required = true }) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-slate-600">{label}</span>
    <input required={required} type={type} className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-mint" value={value || ""} onChange={(event) => onChange(event.target.value)} />
  </label>
);

export default SettingsPage;
