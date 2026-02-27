# Personal Website - Aarush Agarwal

A modern, responsive personal website built with Next.js, showcasing projects, research, and blog content with a focus on AI and software development.

## 🚀 Current Features

### Core Pages & Components
- **Homepage** (`/`) - Hero section with introduction, featured projects, and blog preview
- **About** (`/about`) - Detailed personal and professional background
- **Research** (`/research`) - Academic and research work showcase
- **Projects** (`/projects`) - Portfolio of software and AI projects with detailed pages
- **Contact** (`/contact`) - Functional contact form with email integration
- **Blog** (`/blog`) - Blog structure with placeholder content (see [Future Expansions](#future-expansions))

### Technical Implementation
- **Framework**: Next.js 15.2.2 with React 19
- **Styling**: Tailwind CSS with custom dark theme (`#1D1E21` background)
- **Animations**: Framer Motion for smooth page transitions and interactions
- **Content Management**: Markdown files with Gray Matter for frontmatter parsing
- **Email Service**: Nodemailer integration for contact form functionality
- **Typography**: Tailwind Typography plugin for rich text content

### Key Components
- **Responsive Navbar** - Desktop sidebar and mobile header with smooth transitions
- **Layout System** - Consistent page structure with header, main content, and footer
- **Project Cards** - Reusable components for project showcases
- **Client-Only Rendering** - Hydration-safe components for client-side features

### Contact Form Features
- **Robust Validation**: Client and server-side input validation
- **Rate Limiting**: Built-in protection against spam (3 requests per minute per IP)
- **Email Integration**: Gmail SMTP with app password authentication
- **Error Handling**: Comprehensive error messages and status feedback
- **Sanitization**: Input sanitization to prevent XSS attacks

### Development Setup
- **Environment Configuration**: Secure email credentials via environment variables
- **Build Process**: Optimized production builds with static generation
- **Code Quality**: ESLint configuration for code consistency
- **Dependencies**: Modern package management with npm

## 🛠️ Tech Stack

### Core Technologies
```json
{
  "framework": "Next.js 15.2.2",
  "react": "19.0.0",
  "styling": "Tailwind CSS 3.3.5",
  "animations": "Framer Motion 12.5.0",
  "email": "Nodemailer 7.0.3"
}
```

### Content & Markdown
- **gray-matter** - YAML frontmatter parsing
- **react-markdown** - Markdown rendering
- **rehype-highlight** - Syntax highlighting for code blocks
- **rehype-slug** - Automatic heading IDs

### Development Tools
- **autoprefixer** - CSS vendor prefixing
- **postcss** - CSS processing
- **eslint** - Code linting and formatting

## 📁 Project Structure

```
personal-website/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Layout.js       # Main page layout with navbar
│   │   ├── Navbar.js       # Responsive navigation
│   │   ├── ProjectCard.js  # Project showcase cards
│   │   └── ClientOnly.js   # Client-side rendering wrapper
│   ├── pages/              # Next.js page routes
│   │   ├── api/           # API endpoints
│   │   │   ├── contact.js # Contact form handler
│   │   │   └── test-email.js # Email testing endpoint
│   │   ├── blog/          # Blog pages
│   │   ├── projects/      # Project pages
│   │   ├── about.js       # About page
│   │   ├── contact.js     # Contact page
│   │   ├── index.js       # Homepage
│   │   └── research.js    # Research page
│   ├── content/           # Markdown content files
│   │   └── projects/      # Project markdown files
│   └── styles/            # Global styles
├── public/                # Static assets
│   ├── images/           # Image assets
│   ├── documents/        # Downloadable files
│   └── fonts/           # Custom fonts
└── configuration files   # Next.js, Tailwind, etc.
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Gmail account (for contact form functionality)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure email service**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your email credentials:
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-password
   ```

   **Gmail Setup:**
   - Enable 2-factor authentication on your Gmail account
   - Generate an app password at [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Use the app password (not your regular Gmail password) in `EMAIL_PASS`

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build & Deploy
```bash
# Create production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🔮 Future Expansions

### 1. Add an Actual Blog System

**Current State**: Basic blog structure with placeholder content and hardcoded posts in `getStaticProps`.

**Planned Implementation**:
- **Markdown-based Blog Posts**: Create `/src/content/blog/` directory for markdown blog posts
- **Dynamic Blog Generation**: Replace hardcoded posts with file-system based content loading
- **Blog Post Pages**: Implement individual blog post pages with proper routing (`/blog/[slug]`)
- **Rich Content Support**: Add support for:
  - Code syntax highlighting
  - Image optimization
  - Interactive components via MDX
  - Table of contents generation
- **Blog Features**:
  - Tag-based categorization
  - Search functionality
  - RSS feed generation
  - Reading time estimation
  - Related posts suggestions
- **Content Management**:
  - Frontmatter-based metadata (title, date, tags, excerpt)
  - Draft post support
  - Publication date scheduling

**Technical Requirements**:
- Enhance existing markdown processing pipeline
- Add blog-specific components and layouts
- Implement blog pagination for large post volumes
- SEO optimization for blog posts

### 2. Fix the Contact Page

**Current Issues to Address**:
- **UI/UX Improvements**:
  - Form validation feedback styling
  - Loading states and animations
  - Success/error message positioning
  - Mobile responsiveness optimization
- **Functionality Enhancements**:
  - Email delivery confirmation
  - Retry mechanism for failed sends
  - Better error handling and user feedback
  - Form field autofocus and accessibility
- **Backend Improvements**:
  - Email template customization
  - Auto-reply functionality
  - Enhanced spam protection
  - Email delivery tracking

**Planned Fixes**:
- Redesign form layout for better user experience
- Add proper form validation animations
- Implement better error handling with retry options
- Add confirmation emails to form submitters
- Improve mobile touch interactions
- Add accessibility features (ARIA labels, keyboard navigation)

### Additional Expansion Ideas
- **Portfolio Enhancements**: Interactive project demonstrations
- **Research Section**: Publication management and citation tracking
- **Performance**: Image optimization and lazy loading
- **Analytics**: Privacy-focused visitor analytics
- **CMS Integration**: Headless CMS for content management
- **Internationalization**: Multi-language support

## 📄 License

[MIT License](LICENSE) - feel free to use this project as inspiration for your own personal website.
