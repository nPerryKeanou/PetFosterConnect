type BadgeProps = {
  label: string;
  variant?: "default" | "success" | "neutral";
  className?: string;
};

export default function Badge({ label, variant = "neutral", className = "" }: BadgeProps) {
  const styles = {
    default: "bg-gray-200 text-gray-800",
    success: "bg-success text-white font-bold px-4 py-1",
    neutral: "bg-transparent text-black p-0 font-normal",
  };

  return <span className={`rounded-full text-sm ${styles[variant]} ${className}`}>{label}</span>;
}
