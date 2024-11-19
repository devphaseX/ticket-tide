import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col w-full h-full">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full flex-1 flex flex-col">
          <div className="mx-auto max-w-screen-2xl h-full flex-1 flex flex-col w-full">
            <Navbar />
            <main className="h-full py-8 px-6 flex flex-col flex-1">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
