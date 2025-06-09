import nodemailer from 'nodemailer';

// Rate limiting - simple implementation
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 emails per minute per IP

function isRateLimited(ip) {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];
  
  // Filter out old requests
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  
  return false;
}

function validateInput(data) {
  const { name, email, subject, message } = data;
  
  // Basic validation
  if (!name || name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { isValid: false, error: 'Please provide a valid email address' };
  }
  
  if (!subject || subject.trim().length < 3) {
    return { isValid: false, error: 'Subject must be at least 3 characters long' };
  }
  
  if (!message || message.trim().length < 10) {
    return { isValid: false, error: 'Message must be at least 10 characters long' };
  }
  
  // Length limits
  if (name.length > 100) {
    return { isValid: false, error: 'Name is too long' };
  }
  
  if (subject.length > 200) {
    return { isValid: false, error: 'Subject is too long' };
  }
  
  if (message.length > 5000) {
    return { isValid: false, error: 'Message is too long' };
  }
  
  return { isValid: true };
}

function sanitizeInput(str) {
  return str.trim().replace(/[<>]/g, '');
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    
    // Check rate limiting
    if (isRateLimited(clientIP)) {
      return res.status(429).json({ 
        error: 'Too many requests. Please wait a minute before sending another message.' 
      });
    }

    // Validate input
    const validation = validateInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    // Sanitize input
    const name = sanitizeInput(req.body.name);
    const email = sanitizeInput(req.body.email);
    const subject = sanitizeInput(req.body.subject);
    const message = sanitizeInput(req.body.message);

    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing email environment variables:', {
        EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'MISSING',
        EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'MISSING'
      });
      return res.status(500).json({ 
        error: 'Email service not configured. Please contact the administrator.' 
      });
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail app password
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message:</h3>
            <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #007bff; border-radius: 3px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px;">
            <p>This email was sent from your contact form on aarush.dev</p>
            <p>You can reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
      text: `
Contact Form Submission

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This email was sent from your contact form on aarush.dev
You can reply directly to this email to respond to ${name}.
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully!' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Don't expose internal errors to client
    if (error.code === 'EAUTH') {
      return res.status(500).json({ 
        error: 'Email service configuration error. Please try again later.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to send email. Please try again later.' 
    });
  }
} 