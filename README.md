# ✈️ FlightBuddyPro

**FlightBuddyPro** is a modern, high-performance flight booking and management system designed to provide a seamless travel experience. Whether you're a traveler booking your next trip or an administrator managing flight records, FlightBuddyPro offers a robust and intuitive platform.

---

### 👋 Assalam-o-Alaikum! (Introduction in Urdu)

**FlightBuddyPro** aik mukammal aur modern flight booking system hai jo aapki travel planning ko asaan aur tez-raftaar banane ke liye design kiya gaya hai. Is application ke zariye aap:
- 🎫 Flights ki bookings asani se kar sakte hain.
- 📂 Apne booking records ko mahfooz rakh sakte hain.
- 📄 PDF documents generate kar sakte hain.
- 📱 Mobile aur Desktop dono par behtareen experience hasil kar sakte hain.

---

## ✨ Key Features

- **🚀 Modern UI/UX**: Built with React and Tailwind CSS for a sleek, responsive, and dynamic interface.
- **📅 Flight Booking**: Easy-to-use forms for capturing passenger and flight segment details.
- **📄 PDF Generation**: Generate professional booking summaries and tickets using `jsPDF`.
- **🛡️ Robust Validation**: Form data integrity ensured with `Zod` and `React Hook Form`.
- **📊 Real-time Updates**: Powered by `@tanstack/react-query` for efficient data fetching and synchronization.
- **🎨 Visual Excellence**: Interactive elements and smooth animations using `Framer Motion`.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) (with [Vite](https://vitejs.dev/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Routing**: [Wouter](https://github.com/molecula-db/wouter)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Validation**: [Zod](https://zod.dev/)

### Database
- **Type**: [PostgreSQL](https://www.postgresql.org/) (Serverless via Neon)

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

### 1️⃣ Prerequisites
- **Node.js**: Ensure you have Node.js installed (v18+ recommended).
- **PostgreSQL**: A running PostgreSQL instance or a Neon database URL.

### 2️⃣ Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3️⃣ Environment Variables
Create a `.env` file in the root directory and add your database connection string:
```env
DATABASE_URL=postgresql://user:password@host/dbname
```

### 4️⃣ Database Setup
Push the schema to your database:
```bash
npm run db:push
```

### 5️⃣ Run Locally
Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5001` (or the port specified in the console).

---

## ☁️ Vercel Deployment

This project is configured for seamless deployment on [Vercel](https://vercel.com).

### Deployment Steps
1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Configure the following Environment Variables in Vercel:
   - `DATABASE_URL`: Your production PostgreSQL connection string.
4. Vercel will automatically detect the `vercel.json` configuration and deploy the app.

---

## 📁 Project Structure

- `/client`: Frontend source code (React, Components, Pages).
- `/server`: Backend source code (Express, Routes, Storage).
- `/shared`: Shared types and schemas (Drizzle schema, Zod shapes).
- `/attached_assets`: Static assets and design files.

---

## 📜 Available Scripts

- `npm run dev`: Starts the development server for both frontend and backend.
- `npm run build`: Builds the production-ready application.
- `npm run start`: Runs the built application in production mode.
- `npm run db:push`: Pushes schema changes to the database.
- `npm run check`: Runs TypeScript type checks.

---

Built with ❤️ for a better travel experience.
