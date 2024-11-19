interface WorkspaceLayoutProps {
  children: React.ReactNode;
  modals: React.ReactNode;
}

const WorkspaceLayout = ({ modals, children }: WorkspaceLayoutProps) => {
  return (
    <>
      {modals}
      {children}
    </>
  );
};

export default WorkspaceLayout;
