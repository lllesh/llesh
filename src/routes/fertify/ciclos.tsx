import { createFileRoute } from "@tanstack/react-router";
import { Layout, Card } from "@/imports/fertify/components/fc/Layout";

export const Route = createFileRoute("/fertify/ciclos")({
  head: () => ({ meta: [{ title: "Ciclos — FERTIFY Care" }] }),
  component: () => (
    <Layout title="Ciclos" subtitle="Em breve nesta entrega">
      <Card>
        <div className="py-12 text-center">
          <div className="text-[18px] font-bold mb-1">Módulo Ciclos</div>
          <p className="text-[13px] text-t-secondary max-w-md mx-auto">
            Esta seção será construída na próxima entrega. Por ora, foque no Dashboard,
            Pacientes e no detalhe da paciente.
          </p>
        </div>
      </Card>
    </Layout>
  ),
});
