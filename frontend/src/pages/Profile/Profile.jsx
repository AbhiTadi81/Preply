import { Briefcase, LogOut, CheckCircle2, Shield } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Container } from "../../components/common/Container";
import { Button } from "../../components/common/Button";
export const Profile = () => {
  const { user, logout } = useAuth();
  const displayName = user?.name && user.name !== "Candidate Demo" ? user.name : user?.email ? user.email.split("@")[0] : "Candidate";
  return <div className="py-10 bg-[#fbfdfc] min-h-[90vh]">
      <Container size="sm">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 card-subtle-shadow">
          <div className="flex items-center gap-4 pb-6 mb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-3xl bg-[#e8faf1] text-[#008f4c] font-bold text-2xl flex items-center justify-center border border-[#b7eed4]">
              {displayName[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{displayName}</h1>
              <p className="text-xs text-slate-500">{user?.email || "candidate@example.com"}</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase">Target Job Role</p>
                  <p className="text-sm font-bold text-slate-900">{user?.targetRole || "Frontend Developer"}</p>
                </div>
              </div>
              <span className="text-xs text-[#00ba66] font-semibold bg-[#e8faf1] px-2.5 py-0.5 rounded-full border border-[#b7eed4]">
                Active
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase">AI Analysis Status</p>
                  <p className="text-sm font-bold text-slate-900">Voice Evaluation Enabled</p>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-[#00ba66]" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
    variant="secondary"
    size="md"
    onClick={logout}
    icon={<LogOut className="w-4 h-4 text-slate-500" />}
  >
              Sign Out
            </Button>
          </div>
        </div>
      </Container>
    </div>;
};
