import { Dashboard_Layout } from "@/app/layouts/layout";
import UserManagement from "./UserManagement";

export default function UsersPage() {
  return (
    <Dashboard_Layout>
      <UserManagement />
    </Dashboard_Layout>
  );
}
