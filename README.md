# 🍔 FoodieExpress

**FoodieExpress** is a comprehensive full-stack food delivery web application that combines **restaurant browsing, dynamic shopping carts, and real-time order tracking** into a single seamless experience.

The project is built using a **modernized JavaScript/TypeScript ecosystem with a monorepo architecture**, focusing on secure data handling, real-time bidirectional communication, and a highly responsive UI.

---

## 🚀 Features

### 🔐 Authentication & Roles
* Secure JWT (JSON Web Token) authentication
* Password encryption using bcrypt
* Role-Based Access Control (RBAC)
* Distinct dashboards for Customers, Restaurant Owners, and Admins

### 🛒 Stateful Cart System
* Dynamic cart calculations managed by Redux Toolkit
* Instant item quantity updates without page reloads
* Secure checkout flow

### 📡 Real-Time Order Tracking
* Live WebSocket connection powered by Socket.io
* Instant order status updates sent from the kitchen to the customer
* Persistent bidirectional communication

### 🍔 Restaurant Management
* Browse multiple restaurants and menus
* Relational database querying via Prisma ORM
* Efficient data storage using SQLite

---

## 🧠 Tech Stack

* **Frontend:** React.js, Next.js (App Router), Redux Toolkit, Tailwind CSS
* **Backend:** Node.js, Express.js, Socket.io
* **Database:** Prisma ORM, SQLite
* **Tooling:** TypeScript, `concurrently` (Monorepo management)

---

## 📂 Project Structure
```
food-delivery-webapp
│
├── client
│   ├── src
│   │   ├── app
│   │   ├── components
│   │   ├── lib
│   │   └── redux
│   └── package.json
│
├── server
│   ├── prisma
│   │   ├── dev.db
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   └── sockets
│   └── package.json
│
├── package.json (Workspace Root)
└── .gitignore

```

UI Highlights:-
* Highly responsive frontend built with Tailwind CSS
* Dynamic state updates for instant UI feedback
* Clean, modular React components
* Mobile-first design approach

⚡ How to Run
Clone the repository:

Bash
git clone [https://github.com/your-username/food-delivery-webapp.git](https://github.com/your-username/food-delivery-webapp.git)
Open the project folder and install the workspace dependencies:

Bash
cd food-delivery-webapp
npm install
npm run install:all
Set up your .env variables in the /server folder, then initialize the database:

Bash
npm run db:setup
Start both the frontend and backend servers simultaneously:

Bash
npm run dev

The application will be running at http://localhost:3000

🌐 Live Demo
(Add your hosted Vercel/Render link here later!)

📸 Preview
![FoodieExpress Dashboard](https://github.com/user-attachments/assets/16cb7bdf-7c5d-41f7-9ddb-ffa24116e00f)
![FoodieExpress Dashboard](https://github.com/user-attachments/assets/833cba92-f059-4553-9509-ffe5d696c7f7)
![FoodieExpress Dashboard](https://github.com/user-attachments/assets/1f77c0cc-9318-42ec-be72-9462ac3c5d0b)



👨‍💻 Author
Abhay Pratap Singh Chauhan

Full-Stack Developer
Passionate about building scalable backends, clean UIs, and robust JavaScript applications.

📜 License
This project is open source and available under the MIT License.
