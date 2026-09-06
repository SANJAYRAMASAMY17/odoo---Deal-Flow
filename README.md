# DealFlow360 — Intelligent, Self-Governing Sales Operations Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%7C%20Local-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**DealFlow360** is an Intelligent, Self-Governing Sales Operations and CPQ Platform built to manage the complete sales lifecycle — from dynamic quote generation and multi-tier approval governance to warehouse fulfillment, GST invoicing, hybrid billing, and interactive customer negotiation.

Developed around real-world sales operations and business logic, DealFlow360 enforces pricing discipline, reacts dynamically to multi-hub inventory conditions, and powers a collaborative client negotiation workspace.

---

## 🚀 Key Highlights & Architectural Flow

Traditional sales tools often execute a simplistic linear sequence: `Quote → Order → Invoice`. 
DealFlow360 solves the complex reality of enterprise B2B sales:
* **Multi-Level Discount Approvals** with automated governance matrix ceilings.
* **Blended Risk Scoring** analyzing line-level concession variance against category thresholds.
* **Multi-Hub Fulfillment** managing inventory distribution across Bengaluru, Mumbai, and Delhi.
* **Hybrid Billing** uniting one-time asset sales with recurring SaaS subscriptions and pro-rata adjustments.
* **Customer Negotiation Portal** enabling clients to review proposals, submit line-item counter-offers, and confirm orders in real time.
* **AI Anomaly Detection** identifying margin erosion, stalled deals, and operational bottlenecks.

---

## 🌟 Key Modules

### 1. 💼 CPQ & Quotation Builder
* **Dynamic Multi-Tier Pricing**: Automated price break calculations, volume discounts, and customer-tier adjustments.
* **GST & Tax Engine**: Automated CGST, SGST, and IGST computations based on customer billing location and SAC/HSN codes.
* **Quotation Lifecycle**: Seamless progression from `Draft` → `Internal Review` → `Approved` → `Sent` → `Accepted` / `Declined`.

### 2. 🛡️ Discount Governance & Approval Chains
* **Rule-Based Routing**: Automatically routes discount requests exceeding margin thresholds to Senior Directors or Finance VPs.
* **Blended Concession Matrix**: Evaluates discount risk across quotation lines instead of looking only at overall order totals.
* **Audit Trail**: Timestamped logs tracking reviewer commentary, historical requests, and approval decisions.

### 3. 🏭 Multi-Warehouse Logistics & Fulfillment
* **Hub-Level Inventory**: Real-time stock visibility across **Bengaluru**, **Mumbai**, and **Delhi** fulfillment centers.
* **Automated Dispatch Routing**: Intelligent stock reservation and warehouse selection to minimize shipping transit times.
* **Carrier Integration**: Integrated tracking references (BlueDart, DTDC) with automated delivery state transitions (`Processing` → `Dispatched` → `In Transit` → `Delivered`).

### 4. 🔄 SaaS Subscriptions & Hybrid Billing
* **Contract Management**: Monthly, quarterly, and annual subscription billing lifecycles.
* **MRR & ARR Analytics**: Real-time recurring revenue metrics, churn tracking, and expansion indicators.
* **Automated Proration**: Pro-rata billing credit and debit adjustments for mid-cycle seat expansions and tier upgrades.

### 5. 🧾 Tax Invoicing & Compliance
* **GST-Compliant Tax Invoices**: Full GSTIN, state code, SAC/HSN classification, and digital invoice numbering.
* **E-Way Bill Binding**: Automatic synchronization between generated tax invoices, goods receipt notes (GRN), and verified e-Way bills.
* **Payment Aging Buckets**: Real-time categorization of receivables across `0–30 days`, `31–60 days`, `61–90 days`, and `90+ days overdue`.

### 6. 🧠 Deal Health & AI Anomaly Detection
* **Margin Breach Warnings**: Automated detection of anomalous discount combinations threatening contract profitability.
* **Pipeline Slippage Flags**: Identifies stuck proposals with extended inactivity or stalled executive sign-offs.
* **Discrepancy Remediation**: Integrated playbook actions to rectify pricing misalignments prior to legal closure.

### 7. 🤝 Customer Collaboration & Negotiation Portal
* **Direct Buyer Negotiation**: Clients review line items, leave feedback, and propose counter-discounts directly through a dedicated portal view.
* **Live Chat & Messaging**: Real-time communication between the sales representative and customer procurement leads.
* **Instant Digital Sign-Off**: 1-click quote acceptance and binding confirmation.

### 8. 🔒 Role-Based Dynamic Authentication
* **Single Page Portal Architecture**: Logging in automatically directs users to their tailored workspace with role-restricted permissions.
* **Enterprise Demo Credentials**: Pre-configured accounts for Instant testing.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) |
| **Routing & Navigation** | [React Router v7](https://reactrouter.com/) |
| **Styling & Design System** | [Tailwind CSS 3](https://tailwindcss.com/) + Custom Glassmorphism |
| **Typography** | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) |
| **Backend API** | [Node.js](https://nodejs.org/) REST Server |
| **Database** | [MongoDB](https://www.mongodb.com/) + [Mongoose 8](https://mongoosejs.com/) |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/SANJAYRAMASAMY17/odoo---Deal-Flow.git
cd odoo---Deal-Flow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Navigate to **`http://localhost:5173`** to access the application.

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Landing Portal |
|---|---|---|---|
| **🛡️ Enterprise Admin** | `admin@dealflow.in` | `BharatDealFlow#2026` | **System Admin Console** *(Discount Chains)* |
| **💼 Sales Deal Lead** | `user@dealflow.in` | `BharatDealFlow#2026` | **Sales Rep Workspace** *(Quotations)* |
| **👑 Founder / Director** | `founder@dealflow.in` | `BharatDealFlow#2026` | **Executive Founder Portal** *(Deal Health)* |
| **🤝 Customer (Buyer)** | `customer@acme.com` | `BharatDealFlow#2026` | **Client Negotiation Portal** |

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
