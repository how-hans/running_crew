import aiplatform from '@google-cloud/aiplatform'

const { PredictionServiceClient } = aiplatform.v1
const { helpers } = aiplatform
const { instance, params } = aiplatform.protos.google.cloud.aiplatform.v1.schema.predict

const PROJECT = process.env.VERTEX_PROJECT || '804581610406'
const LOCATION = process.env.VERTEX_LOCATION || 'us-central1'
const ENDPOINT_ID = process.env.VERTEX_ENDPOINT_ID || '3043580676835115008'

function clientOptions() {
  const apiEndpoint = `${LOCATION}-aiplatform.googleapis.com`
  // Render: paste the service account key JSON into this env var.
  // Local: GOOGLE_APPLICATION_CREDENTIALS (a file path) works via the default ADC lookup instead.
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    return {
      apiEndpoint,
      credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
    }
  }
  return { apiEndpoint }
}

const client = new PredictionServiceClient(clientOptions())

// Model classes follow the PlantVillage naming convention: "Crop___Disease" (or "Crop___healthy").
function parseClassLabel(label) {
  const [cropRaw, ...diseaseParts] = label.split('___')
  const diseaseRaw = diseaseParts.join('___') || 'healthy'
  return {
    crop: cropRaw.replace(/_/g, ' '),
    disease: diseaseRaw.replace(/_/g, ' '),
    isHealthy: /healthy/i.test(diseaseRaw),
  }
}

// FR-1: send the uploaded leaf photo to the trained Vertex AI endpoint
// and return the top prediction as { crop, disease, isHealthy, confidence }.
export async function classifyLeafImage(imageBuffer) {
  const instanceObj = new instance.ImageClassificationPredictionInstance({
    content: imageBuffer.toString('base64'),
  })
  const parametersObj = new params.ImageClassificationPredictionParams({
    confidenceThreshold: 0.5,
    maxPredictions: 5,
  })

  const endpoint = client.endpointPath(PROJECT, LOCATION, ENDPOINT_ID)
  const [response] = await client.predict({
    endpoint,
    instances: [helpers.toValue(instanceObj.toJSON())],
    parameters: helpers.toValue(parametersObj.toJSON()),
  })

  const [predictionValue] = response.predictions
  if (!predictionValue) {
    throw new Error('Vertex AI endpoint returned no predictions')
  }

  const result = helpers.fromValue(predictionValue)
  const topLabel = result.displayNames?.[0]
  const topConfidence = result.confidences?.[0]

  if (!topLabel || topConfidence === undefined) {
    throw new Error('Vertex AI response was missing displayNames/confidences')
  }

  return {
    ...parseClassLabel(topLabel),
    confidence: topConfidence,
  }
}
