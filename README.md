### Official Accenture Travel Chainlink external adapter created by NetObjex

## Get your own API-KEY

Use an environment variable to store and export the NETOBJEX_API_KEY
To request for a key, enter your org-details and email ID in this [link](https://chainlink-accenture-demo.surge.sh/api)


## Install Locally

Install dependencies:

```bash
yarn
```

### Test

Run the local tests:

```bash
yarn test
```

Natively run the application (defaults to port 8080):

### Run

```bash
yarn start
```

## Docker

If you wish to use Docker to run the adapter, you can build the image by running the following command:

```bash
docker build . -t netobjex-ext-adapter-accenture
```

Then run it with:

```bash
docker run -e NETOBJEX_API_KEY=************ -p 8080:8080 netobjex-ext-adapter-accenture
```

## Sample call:
```
curl -X POST "http://52.151.17.41:8080" -H "Content-Type:application/json" --data '{ "filter": "{'where':{'id':'c7d2a56a-bd4f-4565-b16e-858c83521e16'}}","endpoint": "orders/getorders" }'
```
Sample return:
```
{
    "jobRunID": 10,
    "data": {
        "items": [
            {
                "id": "c7d2a56a-bd4f-4565-b16e-858c83521e16",
                "verstamp": "1",
                "created": "2020-08-26T11:05:38.269Z",
                "updated": "2020-08-26T11:06:12.035Z",
                "userid": "0a8ead37-a505-4172-8c0a-3c4cb0feff6e",
                "locationid": "0caccdb9-74f5-444b-a8fd-69b98fe625b4",
                "numofdays": 3,
                "totalwater": 0,
                "total_energy": null,
                "checkin_time": 1597747153,
                "checkout_time": 1598266956
            }
        ],
        "total": 1,
        "limit": 20,
        "skip": 0,
        "result": "water:0,energy:0"
    },
    "result": "water:0,energy:0",
    "statusCode": 200
}
```

## Serverless hosts

After [installing locally](#install-locally):

### Create the zip

```bash
zip -r external-adapter.zip .
```

### Install to AWS Lambda

- In Lambda Functions, create function
- On the Create function page:
  - Give the function a name
  - Use Node.js 12.x for the runtime
  - Choose an existing role or create a new one
  - Click Create Function
- Under Function code, select "Upload a .zip file" from the Code entry type drop-down
- Click Upload and select the `external-adapter.zip` file
- Handler:
    - index.handler for REST API Gateways
    - index.handlerv2 for HTTP API Gateways
- Add the environment variable (repeat for all environment variables):
  - Key: API_KEY
  - Value: Your_API_key
- Save

#### To Set Up an API Gateway (HTTP API)

If using a HTTP API Gateway, Lambda's built-in Test will fail, but you will be able to externally call the function successfully.

- Click Add Trigger
- Select API Gateway in Trigger configuration
- Under API, click Create an API
- Choose HTTP API
- Select the security for the API
- Click Add

#### To Set Up an API Gateway (REST API)

If using a REST API Gateway, you will need to disable the Lambda proxy integration for Lambda-based adapter to function.

- Click Add Trigger
- Select API Gateway in Trigger configuration
- Under API, click Create an API
- Choose REST API
- Select the security for the API
- Click Add
- Click the API Gateway trigger
- Click the name of the trigger (this is a link, a new window opens)
- Click Integration Request
- Uncheck Use Lamba Proxy integration
- Click OK on the two dialogs
- Return to your function
- Remove the API Gateway and Save
- Click Add Trigger and use the same API Gateway
- Select the deployment stage and security
- Click Add

### Install to GCP

- In Functions, create a new function, choose to ZIP upload
- Click Browse and select the `external-adapter.zip` file
- Select a Storage Bucket to keep the zip in
- Function to execute: gcpservice
- Click More, Add variable (repeat for all environment variables)
  - NAME: API_KEY
  - VALUE: Your_API_key

#
[NetObjex Inc.](https://www.netobjex.com/)
