interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}

/**
 * Premium dark form field with tracked uppercase label.
 */
export function Field({ label, value, onChange, type = "text" }: FieldProps) {
  return (
    <div>
      <label
        className="block text-[10px] uppercase text-white/40 mb-2 font-sans-tight"
        style={{ letterSpacing: "0.25em" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border rounded-lg px-3.5 py-3 text-white text-[14px] outline-none focus:border-white/20 transition-colors font-sans-tight"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      />
    </div>
  );
}

interface ContactRowProps {
  label: string;
  value: string;
}

/**
 * Label + email row used in the contact section.
 */
export function ContactRow({ label, value }: ContactRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span
        className="text-[10px] uppercase text-white/40 font-sans-tight"
        style={{ letterSpacing: "0.28em" }}
      >
        {label}
      </span>
      <a
        href={`mailto:${value}`}
        className="text-white/85 text-[15px] hover:text-white transition-colors font-display"
        style={{ letterSpacing: "-0.005em" }}
      >
        {value}
      </a>
    </div>
  );
}
