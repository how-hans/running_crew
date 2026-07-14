import { useState } from 'react'

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  DONE: 'done',
  ERROR: 'error',
}

export default function DiagnosisUpload() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [status, setStatus] = useState(STATUS.IDLE)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  function handleFileChange(e) {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
    setStatus(STATUS.IDLE)
    setResult(null)
    setError(null)
  }

  async function handleDiagnose() {
    if (!file) return
    setStatus(STATUS.LOADING)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await fetch('/api/diagnose', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error(`서버 오류 (${res.status})`)

      const data = await res.json()
      setResult(data)
      setStatus(STATUS.DONE)
    } catch (err) {
      setError(err.message || '진단 중 문제가 발생했어요')
      setStatus(STATUS.ERROR)
    }
  }

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="font-medium text-stone-900 mb-1">작물 사진 업로드</h2>
        <p className="text-sm text-stone-500 mb-4">
          잎이 잘 보이도록 찍은 사진 한 장을 올려주세요.
        </p>

        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-stone-300 rounded-xl py-10 cursor-pointer hover:border-green-400 hover:bg-green-50/40 transition-colors">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="업로드한 작물 사진 미리보기"
              className="max-h-64 rounded-lg object-contain"
            />
          ) : (
            <>
              <span className="text-3xl">📷</span>
              <span className="text-sm text-stone-500">
                클릭해서 사진 선택
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <button
          type="button"
          onClick={handleDiagnose}
          disabled={!file || status === STATUS.LOADING}
          className="mt-4 w-full rounded-xl bg-green-600 text-white font-medium py-3 disabled:bg-stone-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
        >
          {status === STATUS.LOADING ? '진단 중...' : '진단하기'}
        </button>

        {status === STATUS.ERROR && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </section>

      {status === STATUS.DONE && result && <DiagnosisResult result={result} />}
    </div>
  )
}

function DiagnosisResult({ result }) {
  const { crop, disease, isHealthy, confidence } = result
  const confidencePct = Math.round(confidence * 100)

  return (
    <section className="bg-white rounded-2xl border border-stone-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-stone-900">진단 결과</h2>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            isHealthy
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {isHealthy ? '건강함' : '이상 감지'}
        </span>
      </div>

      <div className="space-y-1 mb-4">
        <p className="text-sm text-stone-500">작물</p>
        <p className="text-lg font-semibold">{crop}</p>
      </div>

      <div className="space-y-1 mb-4">
        <p className="text-sm text-stone-500">진단명</p>
        <p className="text-lg font-semibold">{disease}</p>
      </div>

      <div>
        <div className="flex justify-between text-sm text-stone-500 mb-1">
          <span>확신도</span>
          <span>{confidencePct}%</span>
        </div>
        <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${confidencePct}%` }}
          />
        </div>
      </div>

      <p className="mt-4 text-xs text-stone-400">
        지금은 목업 데이터예요. 실제 모델은 다음 단계에서 연결돼요.
      </p>
    </section>
  )
}
