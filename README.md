The Outfit Oracle - Full-Stack E-commerce Platform
Welcome to The Outfit Oracle, a complete e-commerce solution built with a modern tech stack. This platform provides a seamless shopping experience for users and a powerful administrative dashboard for managing the store.

✨ Key Features
Customer-Facing (Frontend):
Responsive Design: A beautiful and intuitive interface that works on all devices.

Product Browsing & Search: Users can easily browse through categories or search for specific products.

User Authentication: Secure registration and login for users, including Google OAuth.

Password Reset: A secure "Forgot Password" flow with email-based token reset.

Shopping Cart: A persistent and easy-to-use shopping cart.

Secure Checkout: A straightforward checkout process.

Order History: Authenticated users can view their past orders in their dashboard.

Administrative (Backend & Admin Panel):
Admin Dashboard: A separate, secure area for store management.

Product Management: Full CRUD (Create, Read, Update, Delete) functionality for products, including image uploads.

Category Management: Admins can create, update, and delete product categories.

Order Management: View all customer orders, update their status (e.g., pending, delivered, cancelled), and view details.

Customer Management: View a list of all registered customers.

Contact Form Submissions: Review messages sent through the contact form.

🛠️ Tech Stack
Backend: FastAPI (Python)

Frontend: React (with Vite)

Database: PostgreSQL (managed with SQLAlchemy)

Authentication: JWT (JSON Web Tokens) & Google OAuth

Styling: Tailwind CSS

Containerization: Docker & Docker Compose

🚀 Getting Started
Prerequisites
Docker and Docker Compose installed on your machine.

A code editor like VS Code.

Git (optional, for version control).

Installation & Setup
Clone the Repository (or download the files):

git clone <your-repository-url>
cd <your-repository-folder>

Create Environment Files:

For the Backend (/app/.env):
Create a file named .env inside the app directory and add the following variables. Replace the placeholder values with your actual configuration.

# Database Connection
DATABASE_URL="postgresql://user:password@db:5432/fashiondb"

# Security
SECRET_KEY="a_very_secret_key_for_your_butcher_shop"

# Application URLs
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:8000"

# Mail Settings (Example using Mailtrap)
MAIL_USERNAME="your_mailtrap_username"
MAIL_PASSWORD="your_mailtrap_password"
MAIL_FROM="noreply@outfitoracle.com"
MAIL_PORT=587
MAIL_SERVER="sandbox.smtp.mailtrap.io"
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
ADMIN_EMAIL="admin@example.com"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

For the Frontend (/src/.env.local):
Create a file named .env.local inside the src directory.

VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

Build and Run with Docker Compose:
From the root directory of the project, run the following command:

docker-compose up --build

This command will build the Docker images for both the frontend and backend services and start the containers.

Access the Application:

Frontend: Open your browser and navigate to http://localhost:3000

Backend API Docs: Navigate to http://localhost:8000/docs to see the FastAPI Swagger UI.

Seeding the Database
To populate the database with initial product and category data, you can run the seed_products.py script.

# First, find the container ID for your backend service
docker-compose ps

# Execute the seed script inside the running backend container
docker exec -it <backend_container_id> python app/seed_products.py

This will clear the database and populate it with the products found in your scraping directory.