import DiagnosisUpload from './components/DiagnosisUpload'

function App() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <div>
            <h1 className="text-xl font-semibold leading-tight">AgriSage</h1>
            <p className="text-xs text-stone-500">
              사진 한 장으로 병충해를 진단하고, 다음 할 일까지 알려드려요
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <DiagnosisUpload />
      </main>

      <footer className="text-center text-xs text-stone-400 py-6">
        AgriSage · Team C
      </footer>
    </div>
  )
}

export default App
