// Placeholder stand-ins for the 38 PlantVillage crop-disease classes.
// Swapped for real model output once the trained classifier is wired in (Part 5).
export const MOCK_CLASSES = [
  { crop: '토마토', disease: '정상', isHealthy: true },
  { crop: '토마토', disease: '겹무늬병 (Early Blight)', isHealthy: false },
  { crop: '토마토', disease: '역병 (Late Blight)', isHealthy: false },
  { crop: '고추', disease: '정상', isHealthy: true },
  { crop: '고추', disease: '세균성 반점병', isHealthy: false },
  { crop: '감자', disease: '정상', isHealthy: true },
  { crop: '감자', disease: '역병 (Late Blight)', isHealthy: false },
  { crop: '포도', disease: '정상', isHealthy: true },
  { crop: '포도', disease: '검은무늬병 (Black Rot)', isHealthy: false },
  { crop: '사과', disease: '정상', isHealthy: true },
  { crop: '사과', disease: '검은별무늬병 (Apple Scab)', isHealthy: false },
]

export function randomMockDiagnosis() {
  const pick = MOCK_CLASSES[Math.floor(Math.random() * MOCK_CLASSES.length)]
  const confidence = Number((0.7 + Math.random() * 0.29).toFixed(2))
  return { ...pick, confidence }
}
