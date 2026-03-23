import '../styles/globals.css';
import Layout from '../components/Layout';
import { ThemeProvider } from 'next-themes';
import { Inter, DM_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-inter',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-mono',
});

function MyApp({ Component, pageProps }) {
  // forcedTheme locks light until dark mode redesign; ThemeToggle commented out in Layout/Navbar
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-dm-mono: ${dmMono.style.fontFamily};
        }
      `}</style>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;