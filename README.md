# Retail CRM System API

Retail CRM System API is an API developed to support customer relationship management and backend operations for a retail management platform.

The API provides functionality for customer registration, product management, retail transactions, membership information, and loyalty tracking, enabling client applications to access and manage retail data through structured application endpoints.

## 🏪 About the Project

Retail CRM System API was developed as the data communication layer between client applications and the retail platform's data management system.

The API connects customer records, products, transactions, customer activities, and loyalty accounts to support retail operations and customer relationship management within a centralized backend.

Its implementation uses Next.js and Prisma, with separate authentication flows for internal users and customers. Dashboard endpoints provide operational summaries and customer information for use in frontend applications.

## ✨ Features

Key features and implementations include:

- Customer registration and authentication
- Internal user authentication
- Access token and refresh token handling
- Role-based permissions for selected operations
- Customer profile retrieval and updates
- Customer account deactivation
- Product creation, retrieval, updates, and deactivation
- Product search, filtering, sorting, and pagination
- Retail transaction creation and retrieval
- Transaction and payment status management
- Customer transaction history
- Customer activity recording
- Membership information and loyalty point tracking
- Internal user and customer dashboard data
- Structured JSON responses
- Request validation
- Frontend and backend data communication

## 🔐 Authentication and Access

The API provides separate login endpoints for internal users and customers, along with customer registration, token refresh, and logout operations.

Authentication uses access tokens and refresh tokens. Customer registration creates an initial BRONZE membership and a loyalty account with a zero-point balance.

Selected internal operations use role-based permissions to distinguish access for administrators, managers, sales staff, and customer service staff. Customer dashboard endpoints use the authenticated customer's identity to retrieve the corresponding account information.

## 👥 Customer Data Management

Customer information can be retrieved and updated through the API, including contact details, profile information, membership level, and account status.

The API also supports customer account deactivation, transaction history retrieval, loyalty balance access, and customer activity recording. These capabilities provide a centralized foundation for maintaining customer records and related retail interactions.

## 📦 Product Management

The API supports product creation, detail retrieval, updates, and deactivation.

Product listings include search, category and status filters, stock filtering, sorting, and pagination. These operations allow client applications to organize product information and retrieve records relevant to retail workflows.

Product deletion is handled through deactivation, preserving the underlying product record.

## 🧾 Retail Transactions

The API supports retail transaction creation and retrieval, connecting customer records, internal users, and purchased product items.

Transaction operations include payment information, transaction status updates, and customer purchase history. Transaction status and payment status are maintained separately.

Cancellation handling includes stock restoration, inventory movement records, loyalty point rollback, and adjustments to the customer's recorded spending. Updating a transaction to a cancelled status does not automatically change its payment status to a refund.

## 🎁 Membership and Loyalty

The system includes BRONZE, SILVER, GOLD, and PLATINUM membership levels, together with customer loyalty accounts and loyalty history records.

Customer-facing endpoints provide access to loyalty balances, membership information, and account summaries. Loyalty records are linked to customer accounts and can be associated with retail transactions.

These capabilities allow client applications to present membership details and loyalty information alongside customer purchase records.

## 📊 Dashboard Data

Retail CRM System API provides two groups of dashboard endpoints: User Dashboard and Customer Dashboard. Each group supplies structured data for a different audience, separating internal retail reporting from individual customer account information.

### User Dashboard

The User Dashboard supports internal monitoring of retail operations, customer growth, product performance, sales, and loyalty activity. Its endpoints use internal user authentication and role-based access requirements.

Available dashboard areas include:

- **Operational Summary:** Customer totals, active customers, new registrations this month, product totals, low-stock counts, completed and paid transaction counts, and daily and monthly sales.
- **Sales Analytics:** Daily and monthly sales, average transaction value for the current month, monthly sales trends, payment method breakdowns, and top products ranked by units sold.
- **Customer Analytics:** Active and inactive customer counts, membership distribution, monthly registration growth, and top customers ranked by spending on completed and paid transactions.
- **Product Analytics:** Product status summaries, category distribution, low-stock counts, top-selling products, and active products with no units sold through completed and paid transactions.
- **Loyalty Analytics:** Loyalty account totals, current point balances, average points, active member counts, earned and rolled-back point activity, top customers by point balance, and monthly point trends.
- **Consolidated Reports:** Sales totals, transaction status distribution, customer and product summaries, total inventory units, and stock value calculated using product prices.
- **Audit Monitoring:** Total and daily audit activity, active internal account counts, activity grouped by module and action, and recent audit records.
- **Team Performance:** Transaction totals, revenue, unique customers served per staff member, and revenue rankings for active sales, manager, and administrator accounts.

A dedicated inventory dashboard endpoint is also documented, although its detailed response structure has not yet been verified. Inventory figures described above are available through the consolidated report endpoint.

Sales summaries, sales analytics, top-customer spending, and product sales use transactions marked both COMPLETED and PAID. Team performance uses COMPLETED transactions without requiring PAID status. Audit active-user counts represent active internal accounts rather than users currently online.

### Customer Dashboard

The Customer Dashboard provides account-specific information for authenticated customers. Each endpoint identifies the customer from the access token, so client applications do not need to submit a customer ID to retrieve dashboard data.

Available dashboard areas include:

- **Account Summary:** Customer name, membership level, recorded spending, completed transaction count, loyalty point balance, latest transaction, favorite product, and registration date.
- **Transaction History:** Purchase records with invoice numbers, transaction dates, payment methods, payment and transaction statuses, total amounts, and item details such as quantities, prices, and subtotals.
- **Purchase Analytics:** Completed transaction totals, total and average spending, monthly spending trends, favorite categories, and favorite products ranked by purchased units.
- **Loyalty Overview:** Current point balance, total points earned, total points rolled back, and a chronological point history displayed with the latest entries first.
- **Membership Details:** Current and next membership levels, recorded spending, the next spending target, remaining spending, progress percentage, and membership benefit descriptions.
- **Product Recommendations:** Active products from a customer's preferred category that have not been purchased in completed transactions, prioritized by available stock. Customers without completed purchases receive active products ordered by stock instead.

Customer transaction history includes all transaction statuses, including cancelled and unpaid records, while purchase analytics uses COMPLETED transactions without requiring PAID status. Account summary spending and membership progress use the spending value stored on the customer record, so totals can differ between dashboard areas.

Membership progress also has different meanings across endpoints: the loyalty dashboard returns a fixed indicator for each membership level, while the membership dashboard calculates progress using recorded spending and the next membership target. Returned benefit descriptions do not establish that transaction discounts are applied automatically.

### Dashboard Integration

Implemented dashboard endpoints use GET requests and return structured JSON data for frontend summaries, charts, lists, and reporting views. Their handlers do not currently read custom date-range or pagination query parameters; reporting periods and result limits follow each endpoint's implementation.

Frontend applications should preserve these differences when presenting metrics rather than treating every dashboard total as directly interchangeable. The customer activity dashboard route is not yet implemented and is excluded from the available dashboard areas above.

## 🔄 Data Integration

Retail CRM System API acts as the communication layer between frontend applications and the underlying retail data system.

Related records connect customers, products, transaction items, customer activities, inventory movements, and loyalty history. Structured JSON responses and request validation support data exchange between application components.

## 🛠️ Technologies

The main technologies and libraries used in this project are:

- Next.js
- Prisma
- MariaDB adapter
- Zod
- bcrypt
- jose
- jsonwebtoken
- JSON

## 🎯 Project Objectives

This project was developed to:

- Provide a centralized API for retail customer relationship management
- Support customer registration and account management
- Organize product information and retail transaction records
- Connect customer data with purchase history and recorded activities
- Provide membership and loyalty information to client applications
- Support access control for selected internal operations
- Supply dashboard data for operational and customer-facing interfaces
- Maintain structured data exchange between frontend and backend systems
- Establish a foundation for additional retail platform integrations

## 📜 License

This project is maintained for portfolio, reference, and development purposes.

---

**Retail CRM System API — Retail Operations & Customer Relationship Management**
