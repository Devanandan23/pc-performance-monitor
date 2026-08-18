# 🖥️ PC Performance Monitor

A full-stack **PC Performance Monitoring Dashboard** built with **React, Django, and Python**.

The application collects real-time system information and displays CPU, memory, storage, network, and running-process information through a modern dashboard.

## ✨ Features

* 🧠 **CPU Monitoring**

  * Real-time CPU usage
  * Logical core information
  * CPU usage history
  * Individual CPU core monitoring

* 💾 **Memory Monitoring**

  * RAM usage percentage
  * Used and total memory
  * Memory usage history

* 💿 **Storage Monitoring**

  * Disk usage
  * Free storage information
  * Storage progress indicator

* 🌐 **Network Monitoring**

  * Download speed
  * Upload speed
  * Real-time network information

* ⚙️ **Process Monitoring**

  * View running processes
  * Process CPU usage
  * Process memory usage
  * Search processes

* 📊 **Performance Dashboard**

  * Live performance metrics
  * CPU and memory charts
  * System status
  * Performance history

* 🚨 **Alerts**

  * System health status
  * Warning and critical states
  * Performance alerts

* 🖥️ **System Information**

  * Computer name
  * Operating system
  * System uptime

* ⚙️ **Settings**

  * Dashboard configuration
  * Monitoring preferences

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* Axios
* Chart.js

### Backend

* Python
* Django
* Django REST API
* psutil

### Development Tools

* VS Code
* Git
* GitHub

## 📁 Project Structure

```text
pc-performance-monitor/
│
├── backend/
│   ├── monitoring/
│   ├── main.py
│   └── manage.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── vite.config.js
│
├── monitoring-agent/
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Devanandan23/pc-performance-monitor.git
```

```bash
cd pc-performance-monitor
```

### 2. Backend Setup

Open a terminal and navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

Install the required packages:

```bash
pip install -r requirements.txt
```

Run the Django server:

```bash
python manage.py runserver
```

The backend will run at:

```text
http://127.0.0.1:8000/
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL shown by Vite in your browser.

## 🔄 How It Works

```text
Your PC
   │
   ▼
Python + psutil
   │
   ▼
Django Backend / API
   │
   ▼
Axios
   │
   ▼
React Frontend
   │
   ▼
Performance Dashboard
```

The Python/Django backend collects system information using `psutil` and provides the data through API endpoints.

The React frontend retrieves the information using Axios and displays it through dashboard cards, charts, tables, and system information panels.

## 📊 Monitoring

The dashboard monitors:

| Component | Information                          |
| --------- | ------------------------------------ |
| CPU       | Usage, logical cores, core usage     |
| Memory    | Used, total, percentage              |
| Disk      | Usage, free storage                  |
| Network   | Download and upload speed            |
| Processes | Running processes and resource usage |
| System    | OS, computer name, uptime            |

## 📸 Screenshots

Add screenshots of the application here.

Example:

```text
screenshots/
├── dashboard.png
├── cpu.png
├── memory.png
├── processes.png
└── settings.png
```

You can add the screenshots to this repository and display them in this section later.

## 🎯 Purpose

This project was created to learn and demonstrate:

* React component development
* React state management
* API integration
* Django REST API development
* Python system monitoring
* Real-time data handling
* Dashboard UI development
* Data visualization
* Git and GitHub workflow

## 🔮 Future Improvements

* User authentication
* Historical performance database
* Performance reports
* Export monitoring data
* More detailed network statistics
* GPU monitoring
* Temperature monitoring
* Background monitoring agent
* Cloud-based monitoring

## 👨‍💻 Author

**Devanandan V**

GitHub: [@Devanandan23](https://github.com/Devanandan23)

---

⭐ If you find this project useful, feel free to explore the source code and give the repository a star.
