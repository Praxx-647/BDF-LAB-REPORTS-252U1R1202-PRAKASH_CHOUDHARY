# Backend Development Fundamentals – Lab Repository

**Course**: Backend Development Fundamentals (Year II Term II)  
**Student Name**: Prakash Choudhary  
**Registration Number**: 252U1R1202  
**Section**: CSE-2D / 214  
**Faculty**: Sai Siva Teja Chintakrindi  
**Repository**: [Praxx-647/BDF-LAB-REPORTS-252U1R1202-PRAKASH_CHOUDHARY](https://github.com/Praxx-647/BDF-LAB-REPORTS-252U1R1202-PRAKASH_CHOUDHARY)

---

## Course Lab Index

This repository houses all laboratory assignments and project deliverables for Backend Development Fundamentals, organized with one folder per lab (`lab-01` through `lab-10`):

| Lab Number | Lab Title | Status | Documentation & Code |
| :--- | :--- | :--- | :--- |
| **Lab 01** | Node.js and Express Server | ✅ Completed | [Browse lab-01/](./lab-01) • [🌐 Live Server](https://bdf-labreport01-252u1r1202-prakashc.vercel.app/) |
| **Lab 02** | SQLite Database and CRUD Routes | ✅ Completed | [Browse lab-02/](./lab-02) • [🌐 Live Server](https://bdf-labreport02-252u1r1202-prakash.vercel.app/) |
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

## Lab 2 Overview

- **Folder**: [`lab-02/`](./lab-02)
- **Deliverables**:
  - **SQLite Database** (`database.db`) seeded with 50 book records ([`seed.js`](./lab-02/seed.js))
  - **Express.js application** with complete CRUD operations using parameterized queries ([`server.js`](./lab-02/server.js))
  - **Automated CRUD route tester** validating endpoints and DB mutations ([`test-endpoints.js`](./lab-02/test-endpoints.js))
  - **Output proof screenshots** for all 5 CRUD operations and DB inspection ([`screenshots/`](./lab-02/screenshots))
  - **Full lab report and viva Q&A** ([`lab-02/README.md`](./lab-02/README.md))

---

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/Praxx-647/BDF-LAB-REPORTS-252U1R1202-PRAKASH_CHOUDHARY.git
cd BDF-LAB-REPORTS-252U1R1202-PRAKASH_CHOUDHARY/lab-01
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

The production deployment for **Lab 01** is hosted live on [Vercel](https://vercel.com/):

- **Platform**: Vercel Serverless Functions
- **Root Directory**: `lab-01`
- **Configuration**: [`lab-01/vercel.json`](./lab-01/vercel.json)
- **Live URL**: [https://bdf-labreport01-252u1r1202-prakashc.vercel.app/](https://bdf-labreport01-252u1r1202-prakashc.vercel.app/)

