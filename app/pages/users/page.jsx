import { Dashboard_Layout } from "@/app/layouts/layout";
import UserManagement from "./UserManagement";
import { AgentsManager } from "../agents/agents";

export default function UsersPage() {
  return (
    <Dashboard_Layout>
      <UserManagement />
      <AgentsManager />
    </Dashboard_Layout>
  );
}
