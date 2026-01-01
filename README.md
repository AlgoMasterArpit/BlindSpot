# 👁️🗨️ BlindSpot | B2B Reputation Management SaaS

> **"Turn Private Feedback into Public Trust."**
>
> A Multi-Tenant SaaS platform that allows businesses to collect anonymous, honest feedback via QR codes, analyzed instantly by AI to prevent negative public reviews.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-orange)

---

## 🚀 Overview

BlindSpot addresses a critical problem in the hospitality and service industry: **The "Silent" Unhappy Customer.** Most customers won't complain to a manager but will leave a 1-star Google Review later.

BlindSpot bridges this gap by providing:
1.  **Privacy:** A secure, anonymous channel for customers.
2.  **Intelligence:** AI-driven sentiment analysis to flag toxic feedback immediately.
3.  **Management:** A B2B Dashboard for business owners to track trends across multiple branches.

---

## ✨ Key Features

### 🏢 For Businesses (B2B Dashboard)
* **Multi-Tenancy Architecture:** Secure data isolation between different organizations.
* **Dynamic QR Generation:** Instantly generate printable QR codes linked to specific branches.
* **AI Sentiment Engine:** Uses OpenAI (`json_mode`) to analyze feedback tone (Positive, Negative, Neutral) and extract keywords.
* **Analytics Dashboard:** Visualizing NPS (Net Promoter Score) trends using **Recharts**.

### 🔒 Security & Engineering
* **Strict Typing:** End-to-end type safety using **TypeScript** and **Zod** schema validation.
* **Relational Data:** Powered by **PostgreSQL** and **Prisma** to ensure referential integrity (Company -> Branch -> Feedback).
* **Rate Limiting:** IP-based blocking to prevent spam attacks on public feedback forms.

---

## 🛠️ Tech Stack

| Domain | Technology | Why? |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14 (App Router) | Server Components for SEO & Performance |
| **Styling** | Tailwind CSS + ShadCN UI | Enterprise-grade accessible UI components |se** | PostgreSQL | Strict relational structure for B2B data |
| **ORM** | Prisma | Type-safe database queries & migrations |
| **Auth** | NextAuth v5 (Auth.js) | Secure session management & RBAC
| **Databa |
| **AI** | OpenAI API | Sentiment analysis & Keyword extraction |
| **Validation** | Zod | Runtime data validation (Schema guards) |

---

## 🏗️ Database Schema (Prisma)

Unlike simple NoSQL solutions, BlindSpot uses a strict relational model to prevent orphan data.

```prisma
model Company {
  id        String   @id @default(cuid())
  name      String
  branches  Branch[] // One-to-Many
}

model Branch {
  id        String     @id @default(cuid())
  location  String
  feedbacks Feedback[] // Cascade Delete enabled
}

model Feedback {
  id             String   @id @default(cuid())
  content        String
  sentimentScore Int      // 1-10 (Calculated by AI)
  isAnonymous    Boolean  @default(true)
}