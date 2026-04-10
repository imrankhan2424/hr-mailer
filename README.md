# HR Mailer 📧

A high-performance, persistent tool for managing job applications and sending personalized emails to HR departments. Built with a focus on data stability and a premium user experience.

## ✨ Latest Enhancements
- **Dynamic Data Persistence**: Automatically saves every input and modification to `localStorage` and syncs with the local JSON backend. No work is lost on page refreshes or session restarts.
- **Rich Text Template Editor**: Compose beautiful, formatted emails with a Gmail-like editor and instant variable substitution.
- **Template Management**: Save, delete, and reset templates. Independant template storage from app profiles.
- **Improved Navigation**: Navigation buttons are now at the top of each step for faster workflow.
- **UI Consistency**: Premium dark/light themes with centered, bounded layouts and a complete icon set.
- **Master Contact List**: Deduplicated contact management across all your saved HR lists.

## 🛠️ Tech Stack
- **Backend**: Node.js, Express
- **Email**: Nodemailer (optimized for Gmail App Passwords)
- **Data**: Multer (file handling), localized JSON storage
- **Frontend**: Vanilla JS, CSS3, Syne Typography

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (Latest LTS recommended)
- Gmail account with an **App Password** (Required for secure sending)

### 2. Setup
```bash
git clone https://github.com/imrankhan2424/hr-mailer.git
cd hr-mailer
npm install
```

### 3. Execution
Start the persistent backend server:
```bash
node server.js
```
Then open `index.html` in your browser.

### 4. Configuration
Use the **Setup** step to enter your Gmail address and App Password. These settings are persisted locally for your convenience but remain secure within your environment.

## 📁 Project Structure
- `server.js`: Persistent API layer.
- `index.html`: Modern, single-page application frontend.
- `hrlist.json`: Contact database.
- `profiles.json`: Saved applicant profiles.
- `templates.json`: Custom email templates.
- `uploads/`: Repository for uploaded resumes.

## 📝 License
This project is licensed under the ISC License.
