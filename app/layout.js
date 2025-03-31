import { Inter, Montserrat, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers";

// Importación de componentes de layout
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Definición de fuentes
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Metadatos de la aplicación
export const metadata = {
  title: "The Showroom App | Conectando Marcas y Showrooms",
  description: "Conectamos marcas de moda con los mejores espacios para exhibir. Encuentra showrooms o marcas que potencien tu negocio.",
  keywords: ["moda", "showrooms", "marcas", "exhibición", "ropa", "networking"],
  authors: [{ name: "The Showroom App" }],
  creator: "The Showroom App",
  metadataBase: new URL("https://theshowroomapp.com"),
  openGraph: {
    title: "The Showroom App | Conectando Marcas y Showrooms",
    description: "Conectamos marcas de moda con los mejores espacios para exhibir. Encuentra showrooms o marcas que potencien tu negocio.",
    url: "https://theshowroomapp.com",
    siteName: "The Showroom App",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Showroom App",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="es" 
      className={`${inter.variable} ${montserrat.variable} ${ibmPlexMono.variable}`}
    >
      <body className="flex flex-col min-h-screen antialiased bg-brand-neutral-50">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}