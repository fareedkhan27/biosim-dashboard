import { AlertTriangle } from "lucide-react";

export function NoiseAlert({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <div className="w-full bg-[#92400e]/20 border-l-4 border-[#fbbf24] py-3 px-4 animate-fade-in-up">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#fbbf24]" />
          <span className="text-sm text-[#fbbf24] font-medium">
            Noise Alert: {count} unverified noise signals pending review.
          </span>
        </div>
        <button className="text-sm text-[#fbbf24] font-medium hover:text-[#fde68a] transition-colors">
          Review →
        </button>
      </div>
    </div>
  );
}
