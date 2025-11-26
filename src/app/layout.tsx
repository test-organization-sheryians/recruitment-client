import { ReactNode } from "react";
import ReduxProvider from "./redux-provider";
import Providers from "./providers";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <Providers>
            {children}
          </Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
