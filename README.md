# HR Mailer 📧

A streamlined tool designed to help job applicants manage their profiles and efficiently send tailored emails to HR departments. Built with Node.js, Express, and Nodemailer.

## ✨ Features
- **Profile Management**: Create and manage multiple applicant profiles.
- **HR Contact Lists**: Group and manage HR contacts efficiently.
- **Direct Resume Uploads**: Support for `.pdf`, `.doc`, `.docx`, `.txt`, and `.rtf` files (up to 10MB).
- **Email Automation**: Send personalized emails via Gmail with automatic resume attachments.
- **Modern UI**: A clean, single-page interface to interact with your data.

## 🛠️ Built With
- **Backend**: Node.js, Express
- **Email Services**: Nodemailer (configured for Gmail)
- **File System**: Multer for handling file uploads
- **Frontend**: HTML5, Vanilla JavaScript, CSS3

## 🚀 Getting Started

### 1. Prerequisites
- Node.js installed on your machine.
- A Gmail account (you may need to use an "App Password" if 2FA is enabled).

### 2. Installation
Clone this repository and install dependencies:
```bash
git clone https://github.com/imrankhan2424/hr-mailer.git
cd hr-mailer
npm install
```

### 3. Run the App
Start the backend server:
```bash
node server.js
```
The server will run on `http://localhost:3000`.

### 4. Configuration
Once the server is running, open `index.html` in your browser and use the **Setup** tab to configure your Gmail credentials and sender name.

## 📁 Repository Structure
- `server.js`: The central Express server handling all API requests.
- `index.html`: The interactive frontend.
- `uploads/`: Local storage for uploaded resumes.
- `hrlist.json`: Database for HR contact lists.
- `profiles.json`: Database for applicant profiles.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the ISC License.
