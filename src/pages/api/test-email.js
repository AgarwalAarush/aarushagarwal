import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check environment variables
    const envCheck = {
      EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'MISSING',
      EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'MISSING'
    };

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(200).json({
        status: 'error',
        message: 'Environment variables missing',
        env: envCheck,
        instructions: 'Create .env.local file with EMAIL_USER and EMAIL_PASS'
      });
    }

    // Test nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify configuration without sending email
    await transporter.verify();

    res.status(200).json({
      status: 'success',
      message: 'Email configuration is valid',
      env: envCheck,
      emailUser: process.env.EMAIL_USER.replace(/(.{3}).*(@.*)/, '$1***$2') // Partially hide email
    });

  } catch (error) {
    console.error('Email test error:', error);
    
    res.status(200).json({
      status: 'error',
      message: 'Email configuration failed',
      error: error.message,
      code: error.code,
      env: {
        EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'MISSING',
        EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'MISSING'
      }
    });
  }
} 