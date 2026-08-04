import Link from "next/link";

export default function TrackerPromptCard() {
  return (
    <div className="bg-surface-raised border border-[rgba(28,27,25,.1)] rounded-[6px] p-5">
      <div className="font-sans font-semibold text-[10px] tracking-[.09em] uppercase text-faint mb-1.5">
        Optional
      </div>
      <div className="font-serif text-[19px] font-medium tracking-[-0.01em] mb-1.5">
        Your tracker
      </div>
      <p className="text-[12.5px] leading-[1.5] text-muted mb-4">
        Every offer you&apos;ve checked, side by side.
      </p>
      <Link
        href="/tracker"
        className="!border-0 block w-full text-left px-3.5 py-3 rounded-[4px] bg-ink text-[#fbfaf8] text-[13.5px] font-medium hover:bg-[#332f2a]"
      >
        Open the tracker →
      </Link>
    </div>
  );
}
