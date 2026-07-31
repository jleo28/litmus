export default function Footer() {
  return (
    <footer className="border-t border-[rgba(28,27,25,.09)] bg-surface-raised mt-auto">
      <div className="max-w-[1280px] mx-auto px-14 py-[18px] flex items-center gap-5 flex-wrap">
        <span className="text-[12.5px] leading-[1.5] text-body-muted max-w-[80ch]">
          This checks your offer against your school&apos;s published CPT
          rules. It is not an eligibility decision, confirm with OIS before
          acting.
        </span>
        <span
          data-noprint="1"
          className="ml-auto font-sans font-semibold text-[10px] text-faintest"
        >
          Litmus v1
        </span>
      </div>
    </footer>
  );
}
