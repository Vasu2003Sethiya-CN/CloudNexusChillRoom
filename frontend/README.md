# CloudNexus Chill Room Booking System

A full‑stack booking application with real‑time updates, email notifications, and an admin panel. Built with Spring Boot (backend) and React (frontend), deployed on AWS.

---

## ✨ Features

- **Service listing** – Browse available chill‑room services (bunk beds, PS5, projector, etc.).
- **1‑hour slot booking** – Select a date and time; real‑time conflict prevention.
- **WebSocket updates** – When a slot is booked, all connected clients see it instantly.
- **Email confirmations** – Users receive booking confirmation via email (Gmail SMTP).
- **Admin notifications** – Admin gets a detailed copy of every booking.
- **My Bookings** – View, cancel, or reschedule your bookings using your email.
- **Admin panel** – Admin can see all bookings, cancel any booking, and view feedback (protected by API key).
- **Feedback system** – After a booking ends, users can leave a rating and comment.

---

## 🛠️ Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Frontend    | React, React Router, Tailwind CSS, STOMP/WebSocket |
| Backend     | Java 21, Spring Boot, Spring Data JPA, WebSocket |
| Database    | MySQL (local or AWS RDS)                        |
| Email       | Gmail SMTP (or any SMTP provider)                |
| Real‑time   | WebSocket (STOMP over SockJS)                    |
| Deployment  | AWS EC2 (backend), S3 + CloudFront (frontend), RDS (database) |

---

## 📋 Prerequisites

- **Java 21** (backend)
- **Node.js 18+** and **npm** (frontend)
- **MySQL** (local development) or an AWS RDS instance
- **Git**
- (Optional) **AWS account** for deployment

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cloudnexus-chillroom.git
cd cloudnexus-chillroom

# Database (local MySQL)
spring.datasource.url=jdbc:mysql://localhost:3306/chillroom?useSSL=false&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Gmail SMTP (replace with your app password)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=youremail@gmail.com
spring.mail.password=your-16-digit-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Admin API key (choose a strong random string)
admin.api-key=your-secure-admin-key-here

# AWS SES (optional – if you switch from SMTP)
aws.accessKeyId=
aws.secretKey=
aws.region=eu-north-1
aws.ses.from=youremail@gmail.com

cd backend
./mvnw spring-boot:run

REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_WS_URL=http://localhost:8080/ws

cd frontend
npm install
npm start

📧 Email Configuration (Gmail SMTP)
Enable 2‑Factor Authentication on your Google account.

Generate an App Password:

Go to Google App Passwords

Select Mail and Other (custom name) – e.g., “Spring Boot”.

Copy the 16‑character password.

Paste it as spring.mail.password in your properties file.