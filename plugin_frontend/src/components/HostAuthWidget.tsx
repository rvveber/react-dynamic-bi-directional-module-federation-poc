import React from "react";
import { useRemoteModule } from "../hooks/useRemoteModule";
import { PluginWidgetWrapper, LoadingState, ErrorState } from './SharedComponents';
import '../styles/components.css';

const HostAuthWidget: React.FC = () => {
  const { remoteModule: HostAuth, isLoading, error } = useRemoteModule({
    remote: "host_frontend",
    component: "AuthContext",
  });

  if (isLoading) {
    return <LoadingState message="Loading auth functionality..." />;
  }

  if (error || !HostAuth || !HostAuth.useAuth || !HostAuth.useAuthQuery) {
    return <ErrorState message="Auth functionality is not available." />;
  }

  const { isAuthenticated } = HostAuth.useAuth();
  const { getCurrentUser, isUserAdmin, getUserPermissions } = HostAuth.useAuthQuery();

  const currentUser = getCurrentUser();
  const isAdmin = isUserAdmin();
  const permissions = getUserPermissions();

  return (
    <PluginWidgetWrapper
      title="Host Auth Widget"
      description="This component accesses the host's authentication state."
    >
      <div style={{ marginTop: "12px", color: "#ff9800" }}>
        <strong>Status:</strong> {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
        <br />
        <strong>Permissions:</strong> {permissions.join(', ') || 'None'}
        <br />
        <strong>User Query Result:</strong> {JSON.stringify(currentUser)}
      </div>
    </PluginWidgetWrapper>
  );
};

export default HostAuthWidget;
