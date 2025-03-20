import nodemailer from "nodemailer"

interface EmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

// Configure email transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@tradestockinvest.com",
      ...options,
    })
  } catch (error) {
    console.error("Failed to send email:", error)
    throw error
  }
}

