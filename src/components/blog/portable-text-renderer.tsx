"use client";

import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import { Info, Lightbulb, AlertTriangle, StickyNote, Copy, Check } from "lucide-react";
import { useState } from "react";

function CodeBlock({
  code,
  language,
  filename,
}: {
  code: string;
  language: string;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="my-9 -mx-5 md:mx-0 rounded-[14px] border border-border bg-[#1a1a1a] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#0f0f0f]">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
          </div>
          {filename && (
            <span className="text-[11px] font-mono text-white/60 ml-2">
              {filename}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40 font-mono">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-white/60 hover:text-white transition-colors"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <Check size={11} />
                Copied
              </>
            ) : (
              <>
                <Copy size={11} />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code */}
      <pre className="p-4 overflow-x-auto text-[13px] leading-[1.7] text-white/90 font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function VideoEmbed({ url, caption }: { url: string; caption?: string }) {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/
  );
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);

  let embedUrl = "";
  if (ytMatch) {
    embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
  } else if (vimeoMatch) {
    embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return (
    <div className="my-9 -mx-5 md:mx-0">
      <div className="rounded-[14px] border border-border overflow-hidden bg-bg-subtle">
        {embedUrl ? (
          <div className="relative aspect-video">
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={caption || "Video"}
            />
          </div>
        ) : (
          <video controls className="w-full">
            <source src={url} />
          </video>
        )}
        {caption && (
          <div className="px-5 py-2.5 bg-bg-subtle border-t border-border text-center text-[12px] text-text-muted font-inter">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}

function Callout({
  type,
  title,
  children,
}: {
  type: string;
  title?: string;
  children: React.ReactNode;
}) {
  const meta: Record<
    string,
    { Icon: typeof Info; color: string; bg: string; border: string; label: string }
  > = {
    info: {
      Icon: Info,
      color: "#0A66C2",
      bg: "rgba(10, 102, 194, 0.08)",
      border: "rgba(10, 102, 194, 0.3)",
      label: "Info",
    },
    warning: {
      Icon: AlertTriangle,
      color: "#C48A1A",
      bg: "rgba(232, 168, 50, 0.1)",
      border: "rgba(232, 168, 50, 0.3)",
      label: "Warning",
    },
    tip: {
      Icon: Lightbulb,
      color: "#2E7D32",
      bg: "rgba(46, 125, 50, 0.08)",
      border: "rgba(46, 125, 50, 0.3)",
      label: "Tip",
    },
    note: {
      Icon: StickyNote,
      color: "#6B5D4F",
      bg: "rgba(107, 93, 79, 0.08)",
      border: "rgba(107, 93, 79, 0.25)",
      label: "Note",
    },
  };

  const { Icon, color, bg, border, label } = meta[type] || meta.note;

  return (
    <div
      className="my-8 rounded-[14px] border p-5 flex gap-3.5"
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <Icon size={18} style={{ color }} className="shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p
          className="text-[11px] font-bold uppercase tracking-[0.1em] mb-1.5 font-inter"
          style={{ color }}
        >
          {title || label}
        </p>
        <div className="text-[15px] leading-[1.7] text-text-primary font-inter [&>p]:mb-2 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}

function DividerBlock({ style }: { style: string }) {
  if (style === "decorative") {
    return (
      <div className="my-11 flex items-center justify-center gap-6">
        <div className="flex-1 max-w-[80px] h-px bg-border" />
        <span className="text-amber text-[14px] tracking-[8px]">✻ ✻ ✻</span>
        <div className="flex-1 max-w-[80px] h-px bg-border" />
      </div>
    );
  }
  if (style === "dots") {
    return (
      <div className="my-11 flex items-center justify-center gap-2">
        <div className="w-1 h-1 rounded-full bg-amber" />
        <div className="w-1 h-1 rounded-full bg-amber/60" />
        <div className="w-1 h-1 rounded-full bg-amber" />
      </div>
    );
  }
  return <hr className="my-11 border-t border-border" />;
}

// Slugify headings for anchor IDs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0980-\u09ff\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

function extractText(children: unknown): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (children && typeof children === "object" && "props" in children) {
    const obj = children as { props?: { children?: unknown } };
    return extractText(obj.props?.children);
  }
  return "";
}

export const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => {
      const text = extractText(children);
      return (
        <h2
          id={slugify(text)}
          className="relative text-[32px] font-bold text-text-primary leading-[1.2] mt-14 mb-5 scroll-mt-[150px] pl-5 font-inter"
        >
          <span className="absolute left-0 top-[10px] w-1 h-7 rounded-full bg-amber" />
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = extractText(children);
      return (
        <h3
          id={slugify(text)}
          className="relative text-[27px] font-bold text-text-primary leading-[1.35] mt-13 mb-5 scroll-mt-[150px] pl-5 font-inter"
        >
          <span className="absolute left-0 top-[7px] w-1 h-[26px] rounded-full bg-amber" />
          {children}
        </h3>
      );
    },
    h4: ({ children }) => (
      <h4 className="text-[20px] font-bold text-text-primary leading-[1.4] mt-8 mb-3 font-inter">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="relative my-11 -mx-5 md:mx-0 px-9 py-8 bg-pull-quote-bg border border-border rounded-[14px]">
        <span
          className="absolute left-7 -top-2 text-amber/30 font-serif leading-none"
          style={{ fontSize: "72px" }}
        >
          &ldquo;
        </span>
        <div className="relative text-[19px] font-semibold leading-[1.7] text-text-primary font-inter">
          {children}
        </div>
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mb-6 text-text-primary leading-[inherit]">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-text-primary marker:text-amber">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-6 space-y-2 text-text-primary marker:text-amber marker:font-semibold">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-text-primary">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <u className="underline decoration-amber/50 underline-offset-4">{children}</u>,
    "strike-through": ({ children }) => <s className="opacity-70">{children}</s>,
    highlight: ({ children }) => (
      <span className="bg-highlight-bg px-1 rounded">{children}</span>
    ),
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 rounded bg-bg-subtle border border-border font-mono text-[0.9em] text-amber-dark">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const target = value?.blank ? "_blank" : undefined;
      const rel = value?.blank ? "noopener noreferrer" : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-amber hover:text-amber-dark underline decoration-amber/40 hover:decoration-amber underline-offset-3 transition-colors"
        >
          {children}
        </a>
      );
    },
    footnote: ({ value, children }) => (
      <sup className="text-amber hover:text-amber-dark cursor-pointer">
        <a href={`#ref-${value?.number}`}>
          {children}
          <span className="text-[10px]">[{value?.number}]</span>
        </a>
      </sup>
    ),
  },
  types: {
    image: ({ value }) => {
      const imageUrl = urlForImage(value).width(1400).quality(90).url();
      return (
        <figure
          className={`my-9 ${value.fullWidth ? "-mx-12" : "-mx-5 md:mx-0"} rounded-[14px] border border-border overflow-hidden bg-img-bg`}
        >
          <div className="relative aspect-[16/10]">
            <Image
              src={imageUrl}
              alt={value.alt || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 820px"
            />
          </div>
          {value.caption && (
            <figcaption className="px-5 py-2.5 text-center text-[12px] text-text-muted bg-bg-subtle border-t border-border font-inter">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    pullQuote: ({ value }) => (
      <blockquote className="relative my-11 -mx-5 md:mx-0 px-9 py-8 bg-pull-quote-bg border border-border rounded-[14px]">
        <span
          className="absolute left-7 -top-2 text-amber/30 font-serif leading-none"
          style={{ fontSize: "72px" }}
        >
          &ldquo;
        </span>
        <p className="relative text-[19px] font-semibold leading-[1.7] text-text-primary font-inter mb-0">
          {value.quote}
        </p>
        {value.citation && (
          <cite className="block mt-3 text-[13px] text-text-muted not-italic font-inter">
            {value.citation}
          </cite>
        )}
      </blockquote>
    ),
    codeBlock: ({ value }) => (
      <CodeBlock
        code={value.code}
        language={value.language}
        filename={value.filename}
      />
    ),
    videoEmbed: ({ value }) => (
      <VideoEmbed url={value.url} caption={value.caption} />
    ),
    callout: ({ value }) => (
      <Callout type={value.type} title={value.title}>
        <PortableText
          value={value.body}
          components={{
            block: {
              normal: ({ children }) => <p>{children}</p>,
            },
          }}
        />
      </Callout>
    ),
    divider: ({ value }) => <DividerBlock style={value.style} />,
  },
};

interface PortableTextRendererProps {
  value: unknown[];
}

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return (
    <PortableText
      value={value as Parameters<typeof PortableText>[0]["value"]}
      components={portableTextComponents}
    />
  );
}
