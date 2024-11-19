import { Loader } from "lucide-react";

const DashboardLoadingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader className="siz-6 animate-spin text-muted-foreground" />
    </div>
  );
};

export default DashboardLoadingPage;
