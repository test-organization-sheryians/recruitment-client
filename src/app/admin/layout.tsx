import Sidebar from "@/features/admin/static_pages/Sidebar";
import Navbar from "@/components/Navbar";
import Providers from "../providers";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main content */}
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="p-4 overflow-auto">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
