# 🚚 Shipment Event Tracker – Post App

A scalable and serverless backend service for tracking shipment events, built with **TypeScript**, **AWS CDK**, **Lambda**, **API Gateway**, and **DynamoDB**.

---

## 📘 Overview

This service provides a RESTful API to:

- 📦 Record new shipment events
- 📍 Retrieve the **latest** event for a shipment
- 🔓 View the **full event history** for a shipment

---

### 🖼️ Demo Preview

![Demo](./demo.gif)

## 🏗️ Architecture

Built with modern AWS serverless components and developer-friendly tools:

- **TypeScript** – for static typing and maintainability
- **AWS Lambda** – event-driven, scalable compute
- **Amazon API Gateway** – for secure, RESTful APIs
- **Amazon DynamoDB** – fast, serverless NoSQL database
- **AWS CDK (Cloud Development Kit)** – for infrastructure-as-code (IaC)

### 🗃 Why DynamoDB?

- Ideal for event tracking & time-series data
- Fully managed with automatic scaling
- Pay-per-request pricing
- Tight integration with Lambda

---

## ⚙️ Prerequisites

- **Node.js** v22+ (use [nvm](https://github.com/nvm-sh/nvm) to manage)
- **AWS CLI** – configured with credentials
- **AWS CDK CLI** – install globally:

  ```bash
  npm install -g aws-cdk
  ```

---

## 🔐 Environment Configuration

Copy the provided `.env.example` file to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Example keys include:

```
AWS_REGION=
API_BASE_URL=
```

These values configure the AWS region and base API URL for local development.

---

## 🚀 Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Build Lambda layers**

   ```bash
   npm run layer:build-all
   ```

3. **Build the project**

   ```bash
   npm run build
   ```

4. **Deploy to AWS**

   ```bash
   npm run deploy
   ```

---

## 🔄 Development Workflow

1. Make code or infrastructure changes
2. Build Lambda layers:

   ```bash
   npm run layer:build-all
   ```

3. Build the project:

   ```bash
   npm run build
   ```

4. Deploy changes:

   ```bash
   npm run deploy
   ```

---

## 🧪 Testing

Run all unit tests:

```bash
npm test
```

Run end-to-end tests:

```bash
npm run test:e2e
```

---

## 📡 API Endpoints (OpenAPI 3.0)

This service exposes the following RESTful API endpoints:

### 📥 Create Shipment Event

**POST** `/shipments/{shipmentId}/events`
Records a new event for a specific shipment.

**Request Body:**

```json
{
  "timestamp": "2025-05-20T10:30:00Z",
  "status": "in_transit",
  "location": "Stockholm Hub",
  "details": "Package arrived at sorting facility"
}
```

**Responses:**

- `201 Created` – Event recorded successfully
- `400 Bad Request` – Invalid input

---

### 📜 Get Shipment Event History

**GET** `/shipments/{shipmentId}/events`
Returns all recorded events for a specific shipment.

**Responses:**

- `200 OK` – List of shipment events
- `404 Not Found` – Shipment not found

---

### 🔍 Get Latest Shipment Event

**GET** `/shipments/{shipmentId}/events/latest`
Returns the most recent event for the specified shipment.

**Responses:**

- `200 OK` – Latest shipment event
- `404 Not Found` – Shipment not found or has no events

---

### 🧾 Shipment Event Schema

```json
{
  "timestamp": "2025-05-22T17:45:00Z",
  "status": "delivered",
  "location": "Berlin",
  "details": "Delivered to recipient"
}
```

---

## 🌱 Seeding Example Data

You can seed the `SHIPMENT_EVENT_TABLE` with sample events for local development or testing:

```bash
npm run seed:shipments
```

> The seeder script is located at `src/dynamodb/tables/shipment/seederShipment.ts`.

---

## 🗂️ Important Project Structure (Simplified)

```
src/
├── api/
│   └── lambda/
│       └── shipments/        # Lambda handlers for shipment event APIs
│           ├── createEvent.ts
│           ├── getLatest.ts
│           └── getHistory.ts
├── dynamodb/
│   └── tables/
│       └── shipment/         # DynamoDB table and service definitions
│           ├── createShipment.ts
│           └── service.ts
├── lambda-layers/            # Shared Lambda layer code (e.g. validation)
│   └── validation.ts
├── scripts/
│   └── build-lambdas.js      # Script to build Lambda functions
├── shared/
│   └── types.ts              # Shared TypeScript types
lib/
└── post-app-stack.ts         # CDK stack defining infrastructure

bin/
└── post-app.ts               # CDK app entry point
```

---

## 🧠 Key Packages

- **`aws-cdk-lib`** – Defines and deploys AWS infrastructure (Lambda, API Gateway, DynamoDB).
- **`@aws-sdk/client-dynamodb`** – Connects to DynamoDB from Lambda functions to manage shipment events.
- **`typescript`** – Adds type safety and modern JavaScript features for better development experience.
- **`jest`** – Provides a testing framework to ensure code correctness through unit tests.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.
See the [LICENSE](./LICENSE) file for more details.
