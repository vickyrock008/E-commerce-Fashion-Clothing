# Classic Meat & Products - Full-Stack E-Commerce Platform

This is a complete, full-stack e-commerce website built for a premium online butcher shop. It provides a seamless shopping experience for customers and a comprehensive admin panel for store owners to manage all aspects of the business.

## ✨ Features

### Customer-Facing Website
- **Modern UI**: Built with React and Tailwind CSS for a responsive experience on any device.
- **Product Catalog**: View products grouped by categories.
- **3D Product Viewer**: Interactive 3D model display on product detail pages.
- **Full Shopping Cart**: Add, remove, and update item quantities.
- **Secure Authentication**: User registration, login, and long-lasting sessions (7 days).
- **Password Reset**: Secure, token-based "Forgot Password" flow via email.
- **Professional Order IDs**: Unique, non-sequential IDs like `ORD-20250917-A8C5E2`.
- **Customer Dashboard**: View order history and cancel pending orders.
- **Transactional Emails**: Automated, professional HTML emails for:
  - Order Confirmation
  - Order Delivered
  - Order Cancelled (by user or admin)
  - Password Reset

### Administrative Panel
- **Role-Based Access**: The admin panel is protected and accessible only to 'admin' users.
- **Product Management (CRUD)**: Create, read, update, and delete products.
- **Stock Management**: Easily update inventory levels with a professional modal.
- **Category Management**: Add or remove product categories.
- **Order Management**: View all orders, filter by active/archived, update status, and view billing details in a modal.
- **Customer Management**: View a list of all registered customers.
- **Contact Submissions**: Read messages sent via the contact form.
- **Admin Email Notifications**: Receive email alerts for new orders and cancellations.

---

## 🛠️ Technology Stack

- **Frontend**: React (with Vite), Tailwind CSS, React Router, Axios, React Three Fiber
- **Backend**: FastAPI (Python), PostgreSQL, SQLAlchemy, Pydantic, JWT Authentication
- **Email Service**: FastAPI-Mail with SendGrid for production.
- **Deployment**: Docker & Docker Compose

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js & npm
- Python 3.10+
- PostgreSQL
- An email service account (like SendGrid) for production emails.

### 1. Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate  # On Windows

# Install all dependencies from the new requirements file
pip install -r requirements.txt

# Create a .env file in the 'backend' folder and add your credentials
# (See .env.example for the required variables)

# Start the backend server
uvicorn app.main:app --reload

# From the backend folder with venv activated
python -m app.seed_products