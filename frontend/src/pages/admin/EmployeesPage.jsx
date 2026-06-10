import { Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { resolveBackendUrl } from "../../config/urls";
import { currency } from "../../utils/formatters";

const emptyForm = { name: "", email: "", phone: "", department: "", designation: "", salary: "", address: "", password: "" };

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);

  const load = () => api.get("/employees").then(({ data }) => setEmployees(data));
  useEffect(() => void load(), []);

  const filtered = useMemo(
    () => employees.filter((employee) => `${employee.name} ${employee.email} ${employee.department}`.toLowerCase().includes(search.toLowerCase())),
    [employees, search]
  );

  const submit = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    Object.entries({ ...form, salary: Number(form.salary) }).forEach(([key, value]) => payload.append(key, value ?? ""));
    if (photo) payload.append("profileImage", photo);
    if (editingId) await api.put(`/employees/${editingId}`, payload);
    else await api.post("/employees", payload);
    toast.success(editingId ? "Employee updated" : "Employee created");
    setForm(emptyForm);
    setPhoto(null);
    setPreview("");
    setEditingId(null);
    load();
  };

  const edit = (employee) => {
    setEditingId(employee._id);
    setForm({ ...emptyForm, ...employee, password: "" });
    setPreview(employee.profileImage ? resolveBackendUrl(employee.profileImage) : "");
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    await api.delete(`/employees/${id}`);
    toast.success("Employee deleted");
    load();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Plus className="text-mint" />
          <h2 className="text-xl font-semibold">{editingId ? "Update Employee" : "Add Employee"}</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["name", "Name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["department", "Department"],
            ["designation", "Designation"],
            ["salary", "Salary"],
            ["password", "Login Password"],
          ].map(([key, label]) => (
            <label key={key} className="block">
              <span className="mb-1 block text-sm font-medium text-slate-600">{label}</span>
              <input
                required={!["phone", "password"].includes(key)}
                type={key === "email" ? "email" : key === "salary" ? "number" : key === "password" ? "password" : "text"}
                className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-mint"
                value={form[key] || ""}
                onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))}
              />
            </label>
          ))}
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-600">Upload Photo</span>
            <input type="file" accept="image/*" className="w-full rounded-md border border-slate-200 px-3 py-2" onChange={(event) => {
              const file = event.target.files?.[0];
              setPhoto(file || null);
              if (file) setPreview(URL.createObjectURL(file));
            }} />
          </label>
          {preview && <img src={preview} alt="Employee preview" className="h-24 w-24 rounded-md border border-slate-200 object-cover sm:col-span-2" />}
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-600">Address</span>
            <textarea
              className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-mint"
              rows="3"
              value={form.address || ""}
              onChange={(e) => setForm((current) => ({ ...current, address: e.target.value }))}
            />
          </label>
        </div>
        <button className="mt-4 rounded-md bg-mint px-4 py-2 font-semibold text-white">{editingId ? "Save Changes" : "Create Employee"}</button>
      </form>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="text-xl font-semibold">Employees</h2>
          <div className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2">
            <Search size={18} className="text-slate-400" />
            <input className="outline-none" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">Designation</th>
                <th className="p-3">Salary</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((employee) => (
                <tr key={employee._id} className="border-t border-slate-100">
                  <td className="p-3">
                    <button onClick={() => edit(employee)} className="font-semibold text-mint">{employee.name}</button>
                    <p className="text-xs text-slate-500">{employee.email}</p>
                  </td>
                  <td className="p-3">{employee.department}</td>
                  <td className="p-3">{employee.designation}</td>
                  <td className="p-3">{currency(employee.salary)}</td>
                  <td className="p-3">
                    <button onClick={() => remove(employee._id)} className="rounded-md p-2 text-red-600 hover:bg-red-50" title="Delete employee">
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default EmployeesPage;
