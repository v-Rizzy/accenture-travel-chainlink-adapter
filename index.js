const { Requester, Validator } = require('@chainlink/external-adapter')

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  filter: ['filter', 'asset', 'query'],
  endpoint: true
}

const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(callback, input, customParams)
  const jobRunID = validator.validated.id
  const endpoint = validator.validated.data.endpoint
  const url = `https://accenture-ms.dev.netobjex.com/api/${endpoint}`

  let asset = validator.validated.data.filter
  asset = asset.replace(/'/g,'"')
  const filter = JSON.parse(asset)

  let params = {
    filter
  }

  let access_token = process.env.NETOBJEX_API_KEY

  let authKey = {
    "X-Auth-Key": access_token
  }

  let options = {
    url: url,
    headers: authKey,
    params: params,
    json: true
  }

  // The Requester allows API calls be retry in case of timeout
  // or connection failure

  Requester.request(options, customError)
    .then(response => {
      // It's common practice to store the desired value at the top-level
      // result key. This allows different adapters to be compatible with
      // one another.

      let res = Requester.getResult(response.data, ['items'])
      let energy = res[0].total_energy
      let water = res[0].totalwater
      energy = energy?energy:0
      water = water?water:0

      const result = "water:" + water.toString() + "," + "energy:" + energy.toString()
      response.data.result = result
      
      callback(response.status, Requester.success(jobRunID, response))
    })
    .catch(error => {
      callback(500, Requester.errored(jobRunID, error))
    })

}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
