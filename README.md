# PulseSocial 🌐

PulseSocial is a premium, minimalist social media platform designed to look and feel like a high-end funded startup MVP. Inspired by modern SaaS layouts (like Threads, Linear, and Notion), it delivers a sleek dark aesthetic, fluid spring-based animations, client-side media compression, and lightning-fast optimistic user actions.

---

## 🚀 Key Features

* **Instant Optimistic Likes**: Liking posts toggles the UI state instantly, handling backend replication asynchronously with automatic error rollback support.
* **Canvas-Compressed Image Uploads**: Supports drag-and-drop file uploads. Images are resized and compressed to WebP on the frontend to minimize database weight and boost load times.
* **Dynamic Initial Avatars**: Beautiful Slack/Linear-style gradient avatars are generated on-the-fly from usernames.
* **Infinite Scroll Feed**: Seamless pagination fetches the public feed dynamically as the user scrolls.
* **Interactive Activity Dashboards**: The profile page computes community statistics (total pulses, total likes, and comments received) and renders a visual weekly activity timeline.
* **Expandable Comment Drawers**: Fluid opening/closing comment panels featuring micro-interactions.
* **JWT Guarded Session Controls**: Secure password hashing via bcrypt and sessions using JSON Web Tokens.

---

## 🛠️ Tech Stack

### Frontend
* **React.js & React Router** (Single Page App Routing)
* **Material UI (MUI)** (Design system with customized component styles)
* **Framer Motion** (Page transitions & expandable drawer animations)
* **Native Canvas API** (Image compression & dynamic avatar rendering)

### Backend
* **Node.js & Express.js** (Server API engine)
* **MongoDB Atlas & Mongoose** (Database storage & object mapping)
* **JSON Web Tokens (JWT)** (Secure authentication tokens)
* **Bcrypt.js** (Secure salt password hashing)

---

## 📂 Architecture & Folder Structure

PulseSocial uses a clean, feature-based folder structure designed to facilitate scalability:

```text
frontend/
├── src/
│   ├── assets/       # Static assets & icons
│   ├── components/   # Reusable components (PostCard, CreatePostCard)
│   ├── context/      # React contexts (AuthContext)
│   ├── layouts/      # Dashboard and grid layout systems
│   ├── pages/        # Core page views (HomeFeed, ProfilePage, LandingPage)
│   ├── services/     # API request layer (api.js mapping)
│   ├── utils/        # General utilities (avatar generation, image compression)
│   ├── index.css     # Global styles & theme overrides
│   ├── theme.js      # Customized Material UI palette configuration
│   └── App.jsx       # Routing & provider structure
backend/
├── config/           # Database configuration
├── controllers/      # Route handler controllers (Auth, Posts)
├── middleware/       # Authentication guards
├── models/           # Mongoose schemas (User, Post)
├── routes/           # Router endpoints
└── server.js         # Entry point script
```

---

## 💾 Installation & Local Setup

### Prerequisites
* **Node.js** (v18.x or higher)
* **npm** or **yarn**
* A **MongoDB Atlas** database URI or local MongoDB installation.

### Step 1: Clone and Set Up Backend
1. Open your terminal in the `backend/` directory.
2. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
3. Set your environment variables in `.env`:
   * `PORT`: `5000` (default)
   * `MONGO_URI`: Your MongoDB connection URL
   * `JWT_SECRET`: A secure key of your choice
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run the dev server:
   ```bash
   npm run dev
   ```
   *The dev server uses Node.js's native `--watch` flag for auto-restarts on change.*

### Step 2: Set Up Frontend
1. Open your terminal in the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Deployment Configurations

### Backend (Render / Heroku)
1. Log in to Render and create a new **Web Service**.
2. Connect your Git repository.
3. Set the build command to `npm install` and start command to `node backend/server.js` (or configure the root folder option if in a monorepo).
4. Add environment variables:
   * `PORT` = `5000`
   * `MONGO_URI` = `your_mongodb_atlas_uri`
   * `JWT_SECRET` = `your_jwt_secret_key`
   * `NODE_ENV` = `production`

### Frontend (Vercel)
1. Create a project on Vercel and connect your Git repository.
2. Select the `frontend` subdirectory as the root directory.
3. Ensure the Build Command is `npm run build` and Output Directory is `dist`.
4. Set the Environment Variable:
   * `VITE_API_URL` = `https://your-backend-render-app.onrender.com/api`
5. Click **Deploy**.

---

## 🔮 Future Enhancements

* **Direct Messages**: Real-time messaging between users via Socket.io.
* **Replies & Nesting**: Deep threading for comment replies.
* **Search & Discovery**: Dedicated search page for tags, usernames, and post contents.
* **User Bios & Profile Customization**: Adding bio text, custom banners, and layout color options.
