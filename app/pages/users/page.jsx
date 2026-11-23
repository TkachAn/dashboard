import { Dashboard_Layout } from "@/app/layouts/layout";
import UserManagement from "./UserManagement";
import Link from "next/link";
import { Article, Card, Section } from "@/app/ui/structure/struct";

export default function UsersPage() {
  return (
    <Dashboard_Layout>
      <UserManagement />
      <br />
      <Section id='2' title='CHAOS AGENTS'>
        <Article id='smart home system' title='smart home system'>
          <br />
          <Card>

            <Link href="/pages/agents" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              Agents
            </Link>
          </Card>
        </Article>

      </Section>
    </Dashboard_Layout>
  );
}
