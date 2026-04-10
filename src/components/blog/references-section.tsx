import { ExternalLink } from "lucide-react";

interface Reference {
  title: string;
  author?: string;
  url?: string;
  publication?: string;
  year?: string;
}

interface ReferencesSectionProps {
  references: Reference[];
}

export function ReferencesSection({ references }: ReferencesSectionProps) {
  if (!references || references.length === 0) return null;

  return (
    <div className="max-w-[680px] mx-auto mt-14 pt-9 border-t-2 border-border">
      {/* Heading */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-3.5 h-0.5 bg-amber rounded-full" />
        <h4 className="text-[14px] font-bold uppercase tracking-[1.5px] text-text-muted font-inter">
          তথ্যসূত্র <span className="text-text-muted/60">· References</span>
        </h4>
      </div>

      {/* List */}
      <ol className="list-none space-y-0">
        {references.map((ref, idx) => (
          <li
            key={idx}
            className="relative py-3 pl-10 text-[13px] leading-[1.7] text-text-secondary border-b border-border last:border-b-0 font-inter"
          >
            {/* Number badge */}
            <span className="absolute left-0 top-3 w-[26px] h-[26px] rounded-md bg-bg-subtle text-[11px] font-bold text-text-muted flex items-center justify-center">
              {idx + 1}
            </span>

            <div>
              {ref.url ? (
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-1.5 text-text-secondary hover:text-amber transition-colors"
                >
                  <span className="font-medium">
                    {ref.author && <em className="not-italic text-brown">{ref.author}</em>}
                    {ref.author && " — "}
                    <span className="group-hover:underline decoration-amber decoration-1 underline-offset-2">
                      {ref.title}
                    </span>
                  </span>
                  <ExternalLink
                    size={11}
                    className="shrink-0 mt-1 opacity-40 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              ) : (
                <span>
                  {ref.author && <em className="not-italic text-brown">{ref.author}</em>}
                  {ref.author && " — "}
                  <span>{ref.title}</span>
                </span>
              )}
              {(ref.publication || ref.year) && (
                <span className="block text-[12px] text-text-muted mt-0.5">
                  {ref.publication}
                  {ref.publication && ref.year && ", "}
                  {ref.year}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
