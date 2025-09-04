export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
        <svg width="28" height="28" viewBox="0 0 24 24" className="text-blue-600">
          <path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-xl font-semibold">단어학습</span>
      </div>
    </header>
  )
}
