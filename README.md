# 🎓 AI Course Generator - Text-to-Course SaaS

![AI Course Generator](https://firebasestorage.googleapis.com/v0/b/aicourse-81b42.appspot.com/o/aicouse.png?alt=media&token=7175cdbe-64b4-4fe4-bb6d-b519347ad8af)

A powerful, production-ready SaaS platform that generates comprehensive online courses from simple text prompts. Leveraging the latest **Gemini 1.5 Flash AI**, this tool automates content creation, including theory, images, and video integration.

## 🚀 Key Features

- **AI Course Generation**: Create full courses with chapters, theory, and quizzes from a single prompt.
- **Multimodal Content**: Automatic image generation via Unsplash and video integration via YouTube.
- **Full-Stack SaaS**: Includes user authentication, profile management, and a complete admin dashboard.
- **Global Payments**: Integrated with Stripe, PayPal, Flutterwave, Paystack, and Razorpay.
- **Blog System**: Built-in blogging platform for content marketing.
- **SEO Optimized**: Server-side routing and semantic HTML for better search engine visibility.
- **Production Ready**: Fully dockerized and optimized for platforms like Coolify.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Radix UI, Framer Motion.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (Mongoose).
- **AI**: Google Gemini 1.5 Flash.
- **Mailing**: Nodemailer (SMTP).
- **Styling**: Vanilla CSS & Tailwind.

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aiappsy/coursegen.git
   cd coursegen
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (see `.env.example` for details).

4. **Run in development**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Start production server**:
   ```bash
   npm run start:prod
   ```

## 🐳 Docker Deployment

The project is optimized for Docker and Coolify.

```bash
# Build the image
docker build -t aicourse-gen .

# Run the container
docker run -p 3000:3000 --env-file .env aicourse-gen
```

### Coolify Settings:
- **Port**: 3000
- **Build Command**: `npm run build`
- **Start Command**: `npm run start:prod`
- **Base Image**: `node:20-slim`

## 🔑 Required Environment Variables

Refer to `.env.example` for the full list, including:
- `MONGODB_URI`: Your MongoDB connection string.
- `API_KEY`: Google Gemini AI API Key.
- `EMAIL`/`PASSWORD`: Gmail SMTP credentials.
- `WEBSITE_URL`: The production URL of your app.

## 📄 License

This project is licensed under standard commercial terms. Refer to your original purchase for details.

---
Built with ❤️ by [Spacester](https://www.youtube.com/@spacester-codecanyon)
