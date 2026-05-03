# PrepTrack

> A focused interview preparation tracker built for developers who want to stay organized without the noise.

**[Live Demo](https://preptracker-hazel.vercel.app/)**

---

## Key Features

### **Item Management**
- Add preparation items across three categories: **Problems**, **Concepts**, and **Questions**
- Full CRUD support — create, view, update, and delete items
- Individual item detail page for focused review and editing

### **Status Tracking**
- Three status states: **Pending**, **Completed**, and **Revision**
- One-click status toggling directly from the items list
- Revision items are automatically surfaced on a dedicated Revision page

### **Filtering System**
- Filter items by **category** (Problem / Concept / Question)
- Filter items by **status** (Pending / Completed / Revision)
- Combine filters to quickly find what you need

### **Dashboard**
- At-a-glance counts for All, Completed, Revision, and Pending items
- 5 most recently added items shown on load

### **Auth System**
- Custom Sign Up and Log In with secure JWT authentication
- Passwords hashed with bcrypt
- Protected routes — unauthenticated users are redirected to login

---

## Tech Stack

### **Frontend**
- **React** (with Vite) — fast development build and SPA routing
- **Tailwind CSS** — utility-first styling
- **Axios** — HTTP client for API calls
- **React Router** — client-side navigation

### **Backend**
- **Node.js** — runtime
- **Express.js** — REST API framework
- **MongoDB** — NoSQL database
- **Mongoose** — ODM for MongoDB

### **Auth**
- **JWT (jsonwebtoken)** — token-based authentication
- **bcrypt** — password hashing

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/ridowansarder/preptrack.git
cd preptrack
```

**2. Set up the backend**

```bash
cd backend
npm install
```

Create a `.env` file in `/server`:

```env
CLIENT_URL=http://localhost:5173
PORT=3009
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev
```

**3. Set up the frontend**

```bash
cd ../frontend
npm install
```

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## Project Structure

```
preptrack/
├── frontend/               # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
├── server/               # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   └── routes/
```

---

## What I Learned

### **Technical Skills**
- Building a full authentication flow from scratch with JWT and bcrypt
- Structuring a REST API with Express and Mongoose
- Protected route patterns in React using Context API
- Axios instance configuration with auth headers
- Managing async state and error handling in React

### **Product Thinking**
- Designing around a real use case (interview prep tracking)
- Keeping the UI minimal and purposeful
- Thinking through status flows and what "revision" means as a distinct state

### **Engineering Practices**
- Monorepo structure with separate client and server
- Environment variable management for both ends
- Meaningful API error responses for frontend feedback

---

## Future Enhancements

### **High Priority**
- [ ] Search items by title or keyword
- [ ] Sort items by date added or status
- [ ] Notes field per item for personal observations

### **Data & Analytics**
- [ ] Progress chart (items completed over time)
- [ ] Export data as CSV or JSON

### **UX Improvements**
- [ ] Dark mode
- [ ] Keyboard shortcuts for status toggling
- [ ] Pagination or infinite scroll on items page

---

## Author

**Ridwan** — [github.com/ridowansarder](https://github.com/ridowansarder)
