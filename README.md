# 🏨 The Hugo Hotel Dashboard

This is a full-stack application for managing rooms at The Hugo Hotel. It includes a React + TypeScript frontend and a FastAPI backend.

---

## 🚀 Tech Stack

- **Frontend:** React, TypeScript, HTML2Canvas, jsPDF
- **Backend:** FastAPI, SQLAlchemy, SQLite
- **Testing:** Pytest (for backend)

---

## 🛠 Setup Instructions

### 🔧 Install Backend Dependencies

If you're not using a virtualenv:

```bash
pip install fastapi uvicorn sqlalchemy
```

---

### ▶️ Run the App

**Start the backend:**

```bash
npm run backend
```

**Start the frontend:**

```bash
npm run frontend
```

---

## 🌐 Access the App

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8001](http://localhost:8001)

---

## 🧪 Run Backend Tests

From the `server/` folder:

```bash
pytest
```

If you get an import error, run:

```bash
PYTHONPATH=. pytest
```

---

## 📄 PDF Export Feature

The Room Form page includes a printable layout styled like a designed PDF.  
When you click **Download PDF**, a custom template is rendered and exported using `html2canvas` and `jsPDF`.

---

## ✨ Features

- Create / update / delete rooms
- Add facilities and images
- Clean, responsive admin UI
- PDF generation from custom layout
- Sidebar navigation
- Full backend test coverage
- Image upload preview

---

## 🧼 Todo / Improvements

- Authentication for admin users

---
