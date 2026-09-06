DealFlow360

An Intelligent, Self-Governing Sales Operations Platform

DealFlow360 is a MERN-based B2B Sales Operations platform designed to manage the complete sales lifecycle — from quotation creation and discount approval to fulfillment, billing, customer negotiation, and reporting.

The project was developed around the DealFlow360 hackathon problem statement, with a focus on real-world sales operations and business logic rather than only UI screens.

🚀 Overview

Traditional sales tools generally handle a simple flow:

Quote → Order → Invoice

Real B2B sales processes are more complex. Deals may involve:

Multi-level discount approvals

Customer-specific pricing

Products distributed across multiple warehouses

One-time products combined with recurring subscriptions

Customer negotiation and counter-offers

Margin and discount risk monitoring

Stalled deals and operational anomalies

DealFlow360 addresses these challenges through a connected, end-to-end sales workflow.

The goal is to create a self-governing deal engine that enforces pricing discipline, reacts to inventory conditions, manages hybrid billing, and enables customers to negotiate quotations through a dedicated portal.

✨ Key Features

1. 🔐 Authentication & Role-Based Access

Supports different users across the sales workflow:

Sales Representative

Sales Manager / Approver

Finance / Operations User

Customer / Portal User

Admin

Internal users can access the sales workspace and backend configuration, while customers use a separate portal experience.

2. 📋 Quotation Management

Sales representatives can:

Create quotations

Add products from different categories

Adjust quantities

Apply line-level or order-level discounts

View quotation totals

Track quotation stages

Submit quotations for approval when required

3. 🛡️ Intelligent Discount Governance

DealFlow360 evaluates discounts based on:

Customer tier

Product category

Configured discount limits

Overall quotation risk

The platform can automatically route quotations to the appropriate approval level.

Example:

Bronze → Up to 5%
Silver → Up to 10%
Gold   → Up to 15%

Category-specific limits can also apply.

For example, a Gold customer may have a 15% general limit while a service category may have a stricter 10% limit.

4. 📊 Blended Discount Risk Score

The platform evaluates discount risk across quotation lines instead of looking only at the overall order discount.

For example:

Laptop
12% discount
Allowed: 15%
→ Within limit

Setup Service
18% discount
Allowed: 10%
→ 8 points over limit

The quotation can therefore be flagged for approval even when the customer's general discount tier appears acceptable.

The blended approach also helps detect multiple smaller discount violations spread across an order.

5. 🤝 Upsell & Cross-Sell Recommendations

While building a quotation, the system can display product recommendations based on:

Co-purchase relationships

Active promotions

Minimum margin requirements

Each recommendation can show its expected margin impact before being added to the quotation.

6. 🏭 Multi-Warehouse Fulfillment

Orders can be fulfilled from multiple warehouses according to stock availability.

The fulfillment flow can:

Recommend a warehouse split

Show quantities allocated to each warehouse

Estimate shipment count and cost

Allow manual override

Handle remaining backorders

Support consolidation when stock becomes available

7. 🔄 Hybrid Billing & Subscriptions

A single order can contain:

One-time products

Recurring subscription products

The system supports recurring plans such as:

Monthly

Quarterly

Yearly

It also supports billing schedules and proration for applicable mid-cycle changes.

8. 🌐 Customer Negotiation Portal

Customers receive a dedicated quotation experience where they can:

View quotation details

See quotation status

Comment on individual lines

Request changes

Counter a discount

Confirm the quotation

If a negotiation causes the quotation to exceed configured approval thresholds, it can automatically re-enter the approval workflow.

9. ❤️ Deal Health & Anomaly Monitoring

The Deal Health dashboard highlights operational risks such as:

Stalled quotations

Unusual discounts

Delivery promise slippage

Deals requiring attention

Alerts can be connected directly to the relevant quotation for faster action.

10. 📈 Reporting & Analytics

Reporting can be filtered by:

Period

Sales representative / team

Approval status

Product / category

The platform is designed to support reporting and export capabilities for sales operations.

🔄 End-to-End Workflow

                    ┌─────────────────┐
                    │   User Login    │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Backend Setup   │
                    │ Products        │
                    │ Pricing         │
                    │ Discount Rules  │
                    │ Warehouses      │
                    │ Subscriptions   │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Create Quote    │
                    └────────┬────────┘
                             ↓
              ┌──────────────┴──────────────┐
              ↓                             ↓
       Upsell/Cross-sell              Discount Analysis
              ↓                             ↓
              └──────────────┬──────────────┘
                             ↓
                    ┌─────────────────┐
                    │ Approval Engine │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │    Approved     │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Warehouse Split │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Billing Engine  │
                    │ One-time +      │
                    │ Recurring       │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Customer Portal │
                    │ Negotiation     │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Order Confirmed │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Fulfillment &   │
                    │ Reporting      │
                    └─────────────────┘

👥 User Roles

Role

Responsibilities

Sales Representative

Create quotations, apply discounts, add upsell items, track approvals and fulfillment

Sales Manager / Approver

Review discount exceptions, configure approval chains, monitor deal health

Finance / Operations

Handle high-risk approvals, warehouse fulfillment decisions, recurring billing and credit notes

Customer

View quotations, negotiate terms, request changes and confirm quotations

Admin

Configure products, pricing, discount tiers, warehouses, subscriptions and analytics

🧩 Major Modules

Sales Backend

Authentication

Product & Price List Management

Discount Tier & Approval Chain Setup

Warehouse & Fulfillment Setup

Subscription / Recurring Plan Setup

Upsell / Cross-Sell Rules

Reporting & Dashboard Configuration

Sales Frontend

Sales Workspace

Quotation List / Pipeline

Quotation Builder

Discount Approval

Upsell & Cross-Sell Panel

Fulfillment & Warehouse Split

Subscription & Billing

Customer Portal Negotiation

Deal Health & Anomaly Dashboard

🛠️ Technology Stack

DealFlow360 is built using the MERN stack:

MongoDB — Database

Express.js — Backend API

React.js — Frontend

Node.js — Backend runtime

Additional libraries and tools may be present in the project for authentication, UI, charts, API communication, and other application requirements.

📁 Project Structure

A typical structure for the project is:

my-project/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── sections/
│   │   └── ...
│   ├── services/
│   ├── data/
│   └── ...
│
├── server/
├── .gitignore
├── package.json
└── README.md

The exact structure may vary depending on the current implementation.

⚙️ Getting Started

Prerequisites

Make sure you have installed:

Node.js

npm

MongoDB / MongoDB connection

Git

1. Clone the repository

git clone https://github.com/SANJAYRAMASAMY17/odoo---Deal-Flow.git
cd odoo---Deal-Flow

2. Install dependencies

If the project uses a single package configuration:

npm install

If frontend and backend have separate package.json files, install dependencies in each respective directory:

cd <frontend-directory>
npm install

cd ../<backend-directory>
npm install

3. Configure environment variables

Create the required .env file based on the variables expected by the project.

Example:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

Do not commit .env files or credentials to GitHub.

4. Start the application

Use the scripts defined in the project's package.json.

For example:

npm run dev

or start the frontend and backend separately according to the project configuration.

🧪 Recommended Demo Flow

The following flow demonstrates the core business logic:

Sign up or log in.

Configure a discount tier, warehouse and subscription plan.

Create a quotation.

Add a product with a discount above the normal allowed limit.

Verify that the quotation automatically enters manager approval.

Accept an upsell recommendation.

Verify the quotation total and margin update.

Approve the quotation.

Verify warehouse allocation and multi-warehouse splitting when required.

Add both one-time and recurring products.

Review the billing schedule.

Open the customer portal.

Submit a higher discount as the customer.

Verify that the quotation automatically returns to approval.

Confirm the order and verify the resulting fulfillment/billing status.

🎯 Why DealFlow360?

DealFlow360 focuses on the operational problems that occur in real B2B sales environments.

Instead of treating sales as:

Quote → Invoice

DealFlow360 models the broader process:

Quotation
    ↓
Discount Governance
    ↓
Approval
    ↓
Customer Negotiation
    ↓
Fulfillment
    ↓
Hybrid Billing
    ↓
Reporting & Deal Health

This makes the platform more than a quotation application — it acts as a self-governing deal engine.

🏆 Hackathon Focus

The project addresses the core requirements of the DealFlow360 problem statement:

Automated discount approval routing

Customer-tier and category-specific discount governance

Blended discount risk evaluation

Live upsell and cross-sell recommendations

Multi-warehouse fulfillment

Backorder handling

Hybrid one-time and recurring billing

Customer-facing quotation negotiation

Deal health monitoring

Anomaly detection

Role-based sales operations

End-to-end quotation-to-cash workflow

The original problem statement emphasizes that the core business rules should be implemented in application logic rather than being hardcoded or simulated for the demo.

🔮 Future Enhancements

Potential improvements with additional development time include:

Advanced machine-learning based deal risk prediction

More sophisticated sales forecasting

Historical margin analytics

Advanced customer segmentation

Multi-currency support

Multi-company support

Automated notification and escalation workflows

More detailed financial reconciliation

Enhanced audit and compliance reporting

📌 Project Status

Status: Completed Hackathon Project

Project: DealFlow360
Category: B2B Sales Operations / Deal Management
Stack: MERN
Purpose: Intelligent, self-governing sales operations platform

👨‍💻 Author

Sanjay Ramasamy

GitHub: SANJAYRAMASAMY17

📄 Problem Statement Reference

This project is based on the DealFlow360 – An Intelligent, Self Governing Sales Operations Platform hackathon problem statement.

The problem statement defines the target workflow around quotation, approval, fulfillment, billing, customer negotiation, and reporting. fileciteturn0file0L2-L21

The specified end-to-end flow includes quotation creation, automated approval routing, warehouse fulfillment, hybrid billing, customer negotiation, and deal-health monitoring. fileciteturn0file0L195-L217

⭐ If you find this project useful

Consider giving the repository a ⭐ on GitHub.
