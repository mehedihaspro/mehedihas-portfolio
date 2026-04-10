import { ShieldCheck, AlertCircle, Info, XCircle } from "lucide-react";

interface FactCheck {
  claim: string;
  status: "verified" | "partial" | "context" | "disputed";
  source?: string;
  note?: string;
}

interface FactCheckSectionProps {
  factChecks: FactCheck[];
}

const STATUS_META = {
  verified: {
    label: "Verified",
    color: "#2E7D32",
    darkColor: "#66BB6A",
    Icon: ShieldCheck,
  },
  partial: {
    label: "Partially True",
    color: "#C48A1A",
    darkColor: "#F2C65A",
    Icon: Info,
  },
  context: {
    label: "Needs Context",
    color: "#E8A832",
    darkColor: "#F2C65A",
    Icon: AlertCircle,
  },
  disputed: {
    label: "Disputed",
    color: "#C0392B",
    darkColor: "#E74C3C",
    Icon: XCircle,
  },
};

export function FactCheckSection({ factChecks }: FactCheckSectionProps) {
  if (!factChecks || factChecks.length === 0) return null;

  return (
    <div className="max-w-[680px] mx-auto mt-11">
      {/* Heading */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3.5 h-0.5 bg-amber rounded-full" />
        <h4 className="text-[14px] font-bold uppercase tracking-[1.5px] text-text-muted font-inter">
          Fact Check Report
        </h4>
      </div>

      {/* Table */}
      <div className="rounded-[12px] border border-border overflow-hidden">
        <table className="w-full border-collapse text-[13px] font-inter">
          <thead>
            <tr className="bg-table-head">
              <th className="text-left py-3 px-3.5 text-[11px] font-bold uppercase tracking-[0.5px] text-text-secondary">
                Claim
              </th>
              <th className="text-left py-3 px-3.5 text-[11px] font-bold uppercase tracking-[0.5px] text-text-secondary w-[140px]">
                Status
              </th>
              <th className="text-left py-3 px-3.5 text-[11px] font-bold uppercase tracking-[0.5px] text-text-secondary hidden md:table-cell">
                Source
              </th>
            </tr>
          </thead>
          <tbody>
            {factChecks.map((fc, idx) => {
              const meta = STATUS_META[fc.status];
              const StatusIcon = meta.Icon;
              return (
                <tr
                  key={idx}
                  className="border-t border-border hover:bg-highlight-bg/40 transition-colors"
                >
                  <td className="py-2.5 px-3.5 text-text-secondary align-top leading-relaxed">
                    {fc.claim}
                    {fc.note && (
                      <p className="text-[11px] text-text-muted mt-1 italic">
                        {fc.note}
                      </p>
                    )}
                  </td>
                  <td className="py-2.5 px-3.5 align-top">
                    <span
                      className="inline-flex items-center gap-1 text-[12px] font-semibold"
                      style={{ color: meta.color }}
                    >
                      <StatusIcon size={13} />
                      {meta.label}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 align-top text-text-muted hidden md:table-cell">
                    {fc.source || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
