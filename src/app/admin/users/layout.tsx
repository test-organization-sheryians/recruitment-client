import { ReactNode } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
