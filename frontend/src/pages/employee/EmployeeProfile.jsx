import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import { currency } from "../../utils/formatters";

const apiOrigin = "http://127.0.0.1:5000";

const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    api.get("/employees/me/profile").then(({ data }) => {
      setProfile(data);
      setForm({ name: data.name || "", phone: data.phone || "", address: data.address || "" });
      setPreview(data.profileImage ? `${apiOrigin}${data.profileImage}` : "");
    });
  }, []);

  const save = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    if (photo) formData.append("profileImage", photo);
    const { data } = await api.put("/employees/me/profile", formData);
    setProfile(data);
    toast.success("Profile updated");
  };

  if (!profile) return <LoadingSpinner label="Loading profile..." />;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={save} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Update Profile</h2>
        <div className="mt-5 grid gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-600">Upload Photo</span>
            <input type="file" accept="image/*" className="w-full rounded-md border border-slate-200 px-3 py-2" onChange={(event) => {
              const file = event.target.files?.[0];
              setPhoto(file || null);
              if (file) setPreview(URL.createObjectURL(file));
            }} />
          </label>
          {preview && <img src={preview} alt="Profile preview" className="h-28 w-28 rounded-md border border-slate-200 object-cover" />}
          <Field label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
          <Field label="Phone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} required={false} />
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-600">Address</span>
            <textarea rows="4" className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-mint" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
          </label>
        </div>
        <button className="mt-4 rounded-md bg-mint px-4 py-2 font-semibold text-white">Save Profile</button>
      </form>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">My Profile</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ["Name", profile.name],
            ["Email", profile.email],
            ["Phone", profile.phone || "-"],
            ["Department", profile.department],
            ["Designation", profile.designation],
            ["Joining Date", profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : "-"],
            ["Salary", currency(profile.salary)],
            ["Status", profile.status],
            ["Address", profile.address || "-"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-slate-100 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-1 font-semibold text-ink">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Field = ({ label, value, onChange, type = "text", required = true }) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-slate-600">{label}</span>
    <input required={required} type={type} className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-mint" value={value || ""} onChange={(event) => onChange(event.target.value)} />
  </label>
);

export default EmployeeProfile;
