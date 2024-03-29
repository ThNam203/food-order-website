import LayoutLoader from "@/components/layout_loader";
import ReduxProvider from "@/redux/provider";
import "@/styles/globals.css";
import { Lato } from "next/font/google";

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
});

// export const metadata: Metadata = {
//   title: "Fooddddddd",
//   description: "Food selling website",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.variable}>
        <ReduxProvider>
          <LayoutLoader>{children}</LayoutLoader>
        </ReduxProvider>
      </body>
    </html>
  );
}
