// The 38 PlantVillage classes the Vertex AI endpoint was trained on.
// Vertex AI strips punctuation from label names, so "Corn_(maize)___Common_rust_"
// becomes "Corn_maize_Common_rust" — sanitizeLabel() re-derives that same string
// from the original folder name, so lookups don't rely on hand-typed sanitized keys.
const RAW_CLASSES = [
  ['Apple___Apple_scab', 'Apple', 'Apple scab'],
  ['Apple___Black_rot', 'Apple', 'Black rot'],
  ['Apple___Cedar_apple_rust', 'Apple', 'Cedar apple rust'],
  ['Apple___healthy', 'Apple', 'healthy'],
  ['Blueberry___healthy', 'Blueberry', 'healthy'],
  ['Cherry_(including_sour)___Powdery_mildew', 'Cherry (including sour)', 'Powdery mildew'],
  ['Cherry_(including_sour)___healthy', 'Cherry (including sour)', 'healthy'],
  ['Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn (maize)', 'Cercospora leaf spot / Gray leaf spot'],
  ['Corn_(maize)___Common_rust_', 'Corn (maize)', 'Common rust'],
  ['Corn_(maize)___Northern_Leaf_Blight', 'Corn (maize)', 'Northern Leaf Blight'],
  ['Corn_(maize)___healthy', 'Corn (maize)', 'healthy'],
  ['Grape___Black_rot', 'Grape', 'Black rot'],
  ['Grape___Esca_(Black_Measles)', 'Grape', 'Esca (Black Measles)'],
  ['Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape', 'Leaf blight (Isariopsis Leaf Spot)'],
  ['Grape___healthy', 'Grape', 'healthy'],
  ['Orange___Haunglongbing_(Citrus_greening)', 'Orange', 'Huanglongbing (Citrus greening)'],
  ['Peach___Bacterial_spot', 'Peach', 'Bacterial spot'],
  ['Peach___healthy', 'Peach', 'healthy'],
  ['Pepper,_bell___Bacterial_spot', 'Pepper (bell)', 'Bacterial spot'],
  ['Pepper,_bell___healthy', 'Pepper (bell)', 'healthy'],
  ['Potato___Early_blight', 'Potato', 'Early blight'],
  ['Potato___Late_blight', 'Potato', 'Late blight'],
  ['Potato___healthy', 'Potato', 'healthy'],
  ['Raspberry___healthy', 'Raspberry', 'healthy'],
  ['Soybean___healthy', 'Soybean', 'healthy'],
  ['Squash___Powdery_mildew', 'Squash', 'Powdery mildew'],
  ['Strawberry___Leaf_scorch', 'Strawberry', 'Leaf scorch'],
  ['Strawberry___healthy', 'Strawberry', 'healthy'],
  ['Tomato___Bacterial_spot', 'Tomato', 'Bacterial spot'],
  ['Tomato___Early_blight', 'Tomato', 'Early blight'],
  ['Tomato___Late_blight', 'Tomato', 'Late blight'],
  ['Tomato___Leaf_Mold', 'Tomato', 'Leaf Mold'],
  ['Tomato___Septoria_leaf_spot', 'Tomato', 'Septoria leaf spot'],
  ['Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato', 'Spider mites (Two-spotted spider mite)'],
  ['Tomato___Target_Spot', 'Tomato', 'Target Spot'],
  ['Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato', 'Tomato Yellow Leaf Curl Virus'],
  ['Tomato___Tomato_mosaic_virus', 'Tomato', 'Tomato mosaic virus'],
  ['Tomato___healthy', 'Tomato', 'healthy'],
]

function sanitizeLabel(raw) {
  return raw
    .replace(/[(),]/g, '')
    .replace(/___/g, '_')
    .replace(/[\s-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

const LABEL_MAP = new Map(
  RAW_CLASSES.map(([raw, crop, disease]) => [
    sanitizeLabel(raw),
    { crop, disease, isHealthy: disease === 'healthy' },
  ]),
)

// Falls back to a best-effort split if the endpoint ever returns a label
// outside this known set (e.g. the model gets retrained with new classes).
export function resolveClassLabel(vertexLabel) {
  const known = LABEL_MAP.get(vertexLabel)
  if (known) return known

  const [crop, ...rest] = vertexLabel.split('_')
  const disease = rest.join(' ') || 'unknown'
  return { crop, disease, isHealthy: /healthy/i.test(disease) }
}
