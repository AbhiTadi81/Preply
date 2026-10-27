import { useState } from "react";
import { Copy, Lock, UserRound } from "lucide-react";
import { Container } from "../../components/common/Container";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";

export const Settings = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [theme, setTheme] = useState(user?.preferences?.theme || "light");
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const save = async (changes) => {
    setError(""); setMessage("");
    try {
      const response = await authService.updateProfile(changes);
      updateUser(response.user);
      setMessage("Settings saved.");
    } catch (err) { setError(err.message); }
  };
  const changePassword = async (event) => {
    event.preventDefault(); setError(""); setMessage("");
    try {
      const response = await authService.changePassword(passwords);
      updateUser(response.user, response.token);
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Password changed. Other sessions have been signed out.");
    } catch (err) { setError(err.message); }
  };
  return <div className="py-10 bg-[#fbfdfc] min-h-[90vh]">
    <Container size="sm">
      <div className="mb-8"><span className="text-xs font-bold uppercase tracking-wider text-[#008f4c]">Account settings</span><h1 className="text-3xl font-bold text-slate-900 mt-1">Settings</h1></div>
      {(message || error) && <div className={`mb-5 p-3 rounded-xl text-sm ${error ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-[#e8faf1] text-[#008f4c] border border-[#b7eed4]"}`}>{error || message}</div>}
      <div className="space-y-5">
        <section className="bg-white rounded-3xl border border-slate-200 p-6 card-subtle-shadow">
          <h2 className="font-bold text-slate-900 flex items-center gap-2"><UserRound className="w-4 h-4 text-[#00ba66]" />Account & profile</h2>
          <div className="grid gap-3 mt-4 text-sm">
            <label className="text-slate-500">Display name<input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-slate-900" /></label>
            <div className="text-slate-500">Email<p className="mt-1 p-3 rounded-xl bg-slate-50 text-slate-800">{user?.email}</p></div>
            <div className="text-slate-500">User ID<div className="mt-1 flex gap-2"><p className="flex-1 truncate p-3 rounded-xl bg-slate-50 text-slate-800">{user?.id}</p><Button variant="outline" size="sm" onClick={() => navigator.clipboard?.writeText(user?.id || "")} icon={<Copy className="w-3.5 h-3.5" />}>Copy</Button></div></div>
            <p className="text-xs text-slate-400">Account created {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "not available"}</p>
            <Button size="sm" className="w-fit" onClick={() => save({ name })}>Save profile</Button>
          </div>
        </section>
        <section className="bg-white rounded-3xl border border-slate-200 p-6 card-subtle-shadow">
          <h2 className="font-bold text-slate-900 flex items-center gap-2"><Lock className="w-4 h-4 text-[#00ba66]" />Security</h2>
          <form onSubmit={changePassword} className="grid gap-3 mt-4">
            {["currentPassword", "newPassword", "confirmPassword"].map((field) => <input key={field} required type="password" placeholder={field.replace(/([A-Z])/g, " $1")} value={passwords[field]} onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm" />)}
            <Button type="submit" size="sm" className="w-fit">Change password</Button>
          </form>
        </section>
        <section className="bg-white rounded-3xl border border-slate-200 p-6 card-subtle-shadow">
          <h2 className="font-bold text-slate-900">Appearance</h2>
          <div className="flex flex-wrap gap-2 mt-4">{["light", "dark", "system"].map((option) => <button key={option} type="button" onClick={() => { setTheme(option); localStorage.setItem("preply_theme", option); document.documentElement.classList.toggle("dark", option === "dark" || (option === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)); save({ preferences: { theme: option } }); }} className={`px-4 py-2 rounded-xl border text-sm capitalize ${theme === option ? "bg-[#e8faf1] border-[#b7eed4] text-[#008f4c] font-bold" : "border-slate-200 text-slate-600"}`}>{option}</button>)}</div>
        </section>
      </div>
    </Container>
  </div>;
};
