# Backend Development Fundamentals – Lab Repository

**Course**: Backend Development Fundamentals (Year II Term II)  
**Student Name**: Prakash Choudhary  
**Registration Number**: 252U1R1202  
**Section**: CSE-2D / 214  
**Faculty**: Shiva Sai Teja  
**Repository**: [Praxx-647/BDF-LAB-REPORTS-252U1R1202](https://github.com/Praxx-647/BDF-LAB-REPORTS-252U1R1202)

---

## Course Lab Index

This repository houses all laboratory assignments and project deliverables for Backend Development Fundamentals, organized with one folder per lab (`lab-01` through `lab-10`):

| Lab Number | Lab Title | Status | Documentation & Code |
| :--- | :--- | :--- | :--- |
| **Lab 01** | Node.js and Express Server | ✅ Completed | [Browse lab-01/](./lab-01) • [🌐 Live Server](https://bdf-lab-01-express.onrender.com/) *(Pending Deployment)* |
| **Lab 02** | Upcoming Lab | ⏳ Pending | `lab-02/` |
| **Lab 03** | Upcoming Lab | ⏳ Pending | `lab-03/` |
| **Lab 04** | Upcoming Lab | ⏳ Pending | `lab-04/` |
| **Lab 05** | Upcoming Lab | ⏳ Pending | `lab-05/` |
| **Lab 06** | Upcoming Lab | ⏳ Pending | `lab-06/` |
| **Lab 07** | Upcoming Lab | ⏳ Pending | `lab-07/` |
| **Lab 08** | Upcoming Lab | ⏳ Pending | `lab-08/` |
| **Lab 09** | Upcoming Lab | ⏳ Pending | `lab-09/` |
| **Lab 10** | Upcoming Lab | ⏳ Pending | `lab-10/` |

---

## Lab 1 Overview

- **Folder**: [`lab-01/`](./lab-01)
- **Deliverables**:
  - **Plain Node.js HTTP server** (`http.createServer`) on port 3000 replying `"Hello"` ([`server-http.js`](./lab-01/server-http.js))
  - **Express.js application** with routing & 404 middleware ([`server.js`](./lab-01/server.js))
  - **Automated route tester** and status code logger ([`test-endpoints.js`](./lab-01/test-endpoints.js))
  - **Output proof screenshots** ([`screenshots/`](./lab-01/screenshots))
  - **Full lab report and viva Q&A** ([`lab-01/README.md`](./lab-01/README.md))

---

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/Praxx-647/BDF-LAB-REPORTS-252U1R1202.git
cd BDF-LAB-REPORTS-252U1R1202/lab-01
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Express Server
```bash
npm start
```

### 4. Run the Baseline HTTP Server
```bash
npm run start:http
```

### 5. Run Automated Endpoint Tester
```bash
npm test
```

---

## Deployment & Hosting

The production deployment for **Lab 01** is configured for cloud hosting on [Render](https://render.com/).

- **Root Directory**: `lab-01`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Live URL**: [https://bdf-lab-01-express.onrender.com/](https://bdf-lab-01-express.onrender.com/) *(Will update upon Render activation)*

