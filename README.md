#### 🛒 TechPad – Full-Stack E-Commerce Platform

TechPad is a full-stack e-commerce web application for PC accessories, built from design to deployment using the **MERN + TypeScript** stack.  
It features secure authentication, dynamic product management, order tracking, and an admin dashboard — all deployed on **AWS EC2** with **NGINX** and **Docker**.

![TechPad Preview](./preview.gif)


#### 🏗️ Folder Structure
```
TechPad/
│
├── client/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ └── utils/
│ ├── public/
│ ├── package.json
│ └── tsconfig.json
│
├── server/
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── middleware/
│ │ └── config/
│ ├── package.json
│ └── tsconfig.json
│
├── docker-compose.yml 
```

#### ⚙️ Environment Variables:
```env
Client .env:
VITE_BASE_URL=http://localhost:5000/api

Server .env:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET_NAME=your_bucket_name
CLIENT_URL=http://localhost:5173
```


#### 🧠 Core Features:
  - 🔐 Authentication: JWT-based signup/login with secure token storage.
  - 🛍️ Product System: Full CRUD for products, categories, and users.
  - 💳 Cart & Orders: Persistent cart, checkout flow, and order tracking.
  - 📊 Admin Dashboard: Manage users, orders, analytics, and product inventory.
  - ☁️ AWS Integration: Image upload via S3 and scalable deployment on EC2.
  - 🎨 UI/UX: Responsive, fast, and modern interface built with Tailwind CSS + TypeScript.


#### 🛠️ Getting Started (Development)
### 1. Clone the repository
```
git clone https://github.com/ahmedG3far44/e-commerce-store.git
cd e-commerce-store
```

```
# install client dependencies
cd client && npm install

# install server dependencies
cd ../server && npm install

```
### 3. Run the app

In two separate terminals:
```
# Start backend
cd server
npm run dev

# Start client
cd client
npm run dev

```

1- Frontend runs on http://localhost:5173
2- Backend runs on http://localhost:5000


#### 📦 Deployment

- Backend: AWS EC2 instance with NGINX reverse proxy.
- Frontend: Served via NGINX static hosting.
- SSL: Managed automatically with Certbot.
- CI/CD: Configured through GitHub Actions and Docker for continuous deployment.

---

📸 Preview

![App UI Preview](./preview.gif)


#### 🚀 Live Demo
🔗 **[https://techpad.shop](https://techpad.shop)**  
---


🧑‍💻 Author
@ahmedG3far44
📧 ahmedjaafarbadri@gmail.com
