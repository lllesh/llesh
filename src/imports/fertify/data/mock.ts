export type Doctor = {
  id: string; nome: string; especialidade: string; crm: string;
  cidade: string; uf: string; pacientes: number; ciclosAtivos: number;
  status: "ativo" | "treinamento" | "supervisao";
};

export type Cycle = {
  tipo: string; diaCiclo: number; status: string;
  protocolo: string; proximoPasso: string; objetivo: string;
};

export type Medicacao = {
  nome: string; dose: string; via: string; frequencia: string;
  inicio: string; fim?: string; confirmada: boolean;
};
export type Exame = { nome: string; categoria: string; agendado?: string; realizado?: string; resultado?: string; status: string };
export type Ultrassom = { data: string; diaCiclo: number; endometrio: string; folOD: string; folOE: string; maior: string; interpretacao: string };
export type Procedimento = { nome: string; data: string; status: string };
export type EventoTimeline = { data: string; tipo: string; titulo: string; descricao?: string };
export type Tarefa = { titulo: string; prazo: string; prioridade: "alta"|"media"|"baixa" };

export type Patient = {
  id: string; nome: string; nascimento: string; idade: number;
  cpf: string; telefone: string; email: string; cidade: string; uf: string;
  parceiro?: string;
  modeloCuidado: "direto" | "medico";
  medicoId: string; medicoNome: string;
  objetivo: string; diagnosticos: string[];
  ciclo: Cycle;
  medicacoes: Medicacao[]; exames: Exame[]; ultrassons: Ultrassom[];
  procedimentos: Procedimento[]; timeline: EventoTimeline[]; tarefas: Tarefa[];
  proximoEvento: { data: string; titulo: string };
  alertas: string[];
};

export const doctors: Doctor[] = [
  { id: "d1", nome: "Dra. Mariana Salles", especialidade: "Reprodução Humana", crm: "CRM-SP 145.230", cidade: "São Paulo", uf: "SP", pacientes: 24, ciclosAtivos: 9, status: "ativo" },
  { id: "d2", nome: "Dr. Rafael Tavares", especialidade: "Ginecologia / Endocrinologia", crm: "CRM-RJ 78.412", cidade: "Rio de Janeiro", uf: "RJ", pacientes: 18, ciclosAtivos: 6, status: "supervisao" },
  { id: "d3", nome: "Dra. Beatriz Nóbrega", especialidade: "Reprodução Humana", crm: "CRM-MG 56.901", cidade: "Belo Horizonte", uf: "MG", pacientes: 12, ciclosAtivos: 4, status: "treinamento" },
  { id: "d4", nome: "Dr. Felipe Andrade", especialidade: "Urologia / Andrologia", crm: "CRM-RS 33.781", cidade: "Porto Alegre", uf: "RS", pacientes: 9, ciclosAtivos: 3, status: "ativo" },
  { id: "founder", nome: "Você (Fundadora)", especialidade: "Reprodução Humana — Fundadora", crm: "—", cidade: "São Paulo", uf: "SP", pacientes: 14, ciclosAtivos: 7, status: "ativo" },
];

export const patients: Patient[] = [
  {
    id: "p1", nome: "Ana Beatriz Camargo", nascimento: "1989-04-12", idade: 36,
    cpf: "123.456.789-00", telefone: "(11) 98765-1122", email: "ana.camargo@email.com",
    cidade: "São Paulo", uf: "SP", parceiro: "Lucas Camargo",
    modeloCuidado: "direto", medicoId: "founder", medicoNome: "Você (Fundadora)",
    objetivo: "Gestação por FIV após 2 tentativas de IIU sem sucesso",
    diagnosticos: ["Endometriose grau II", "Reserva ovariana reduzida"],
    ciclo: { tipo: "FIV — Estimulação ovariana", diaCiclo: 6, status: "Em andamento", protocolo: "Antagonista GnRH", proximoPasso: "Ultrassom de monitoramento (D8)", objetivo: "Coleta de óvulos com 8–12 folículos" },
    medicacoes: [
      { nome: "Gonal-F", dose: "225 UI", via: "Subcutânea", frequencia: "1x/dia (20h)", inicio: "2026-05-01", confirmada: true },
      { nome: "Menopur", dose: "75 UI", via: "Subcutânea", frequencia: "1x/dia (20h)", inicio: "2026-05-01", confirmada: true },
      { nome: "Cetrotide", dose: "0,25 mg", via: "Subcutânea", frequencia: "1x/dia (8h)", inicio: "2026-05-05", confirmada: false },
      { nome: "Ácido fólico", dose: "5 mg", via: "Oral", frequencia: "1x/dia", inicio: "2026-04-01", confirmada: true },
    ],
    exames: [
      { nome: "AMH", categoria: "Hormonal", realizado: "2026-04-10", resultado: "1,2 ng/mL", status: "Concluído" },
      { nome: "Estradiol", categoria: "Hormonal", agendado: "2026-05-08", status: "Agendado" },
      { nome: "Beta-hCG", categoria: "Gestação", agendado: "2026-05-30", status: "Agendado" },
    ],
    ultrassons: [
      { data: "2026-05-04", diaCiclo: 4, endometrio: "5,2 mm trilaminar", folOD: "5 folículos (≤8 mm)", folOE: "4 folículos (≤7 mm)", maior: "8 mm", interpretacao: "Resposta inicial adequada" },
    ],
    procedimentos: [
      { nome: "Punção folicular", data: "2026-05-14", status: "Programada" },
      { nome: "Transferência embrionária", data: "2026-05-19", status: "A confirmar" },
    ],
    timeline: [
      { data: "2026-04-28", tipo: "Menstruação", titulo: "D1 do ciclo" },
      { data: "2026-05-01", tipo: "Medicação", titulo: "Início Gonal-F + Menopur" },
      { data: "2026-05-04", tipo: "Ultrassom", titulo: "USG D4 — resposta inicial" },
      { data: "2026-05-05", tipo: "Medicação", titulo: "Início Cetrotide" },
    ],
    tarefas: [
      { titulo: "Confirmar adesão ao Cetrotide", prazo: "Hoje", prioridade: "alta" },
      { titulo: "Revisar USG de D8", prazo: "08/05", prioridade: "alta" },
    ],
    proximoEvento: { data: "08/05", titulo: "USG monitoramento" },
    alertas: ["Cetrotide ainda não confirmado pelo paciente"],
  },
  {
    id: "p2", nome: "Carolina Meireles Souza", nascimento: "1992-08-22", idade: 33,
    cpf: "234.567.890-11", telefone: "(21) 99880-3344", email: "carolina.m@email.com",
    cidade: "Rio de Janeiro", uf: "RJ", parceiro: "—",
    modeloCuidado: "medico", medicoId: "d2", medicoNome: "Dr. Rafael Tavares",
    objetivo: "Congelamento de óvulos (preservação)",
    diagnosticos: ["SOP leve"],
    ciclo: { tipo: "Congelamento de óvulos", diaCiclo: 9, status: "Em andamento", protocolo: "Antagonista", proximoPasso: "Trigger (ovitrelle)", objetivo: "≥10 óvulos vitrificados" },
    medicacoes: [
      { nome: "Gonal-F", dose: "200 UI", via: "Subcutânea", frequencia: "1x/dia", inicio: "2026-04-30", confirmada: true },
      { nome: "Cetrotide", dose: "0,25 mg", via: "Subcutânea", frequencia: "1x/dia", inicio: "2026-05-04", confirmada: true },
    ],
    exames: [{ nome: "Estradiol", categoria: "Hormonal", agendado: "2026-05-07", status: "Agendado" }],
    ultrassons: [{ data: "2026-05-06", diaCiclo: 8, endometrio: "7 mm", folOD: "8 folículos", folOE: "7 folículos", maior: "16 mm", interpretacao: "Pronta para trigger em 24–36h" }],
    procedimentos: [{ nome: "Punção folicular", data: "2026-05-09", status: "Programada" }],
    timeline: [
      { data: "2026-04-26", tipo: "Menstruação", titulo: "D1" },
      { data: "2026-04-30", tipo: "Medicação", titulo: "Início Gonal-F" },
      { data: "2026-05-06", tipo: "Ultrassom", titulo: "USG D8" },
    ],
    tarefas: [{ titulo: "Programar trigger", prazo: "07/05", prioridade: "alta" }],
    proximoEvento: { data: "07/05", titulo: "Trigger Ovitrelle" },
    alertas: [],
  },
  {
    id: "p3", nome: "Juliana Prado Lima", nascimento: "1985-11-03", idade: 39,
    cpf: "345.678.901-22", telefone: "(31) 99100-5566", email: "ju.prado@email.com",
    cidade: "Belo Horizonte", uf: "MG", parceiro: "Marcos Lima",
    modeloCuidado: "medico", medicoId: "d3", medicoNome: "Dra. Beatriz Nóbrega",
    objetivo: "FIV com PGT-A",
    diagnosticos: ["Idade materna avançada"],
    ciclo: { tipo: "Transferência de embrião congelado", diaCiclo: 14, status: "Preparo endometrial", protocolo: "Estradiol + progesterona", proximoPasso: "USG endometrial", objetivo: "Endométrio ≥7 mm trilaminar" },
    medicacoes: [
      { nome: "Estradiol", dose: "6 mg", via: "Oral", frequencia: "3x/dia", inicio: "2026-04-25", confirmada: true },
      { nome: "Utrogestan", dose: "200 mg", via: "Vaginal", frequencia: "3x/dia", inicio: "2026-05-09", confirmada: false },
    ],
    exames: [{ nome: "Progesterona", categoria: "Hormonal", agendado: "2026-05-09", status: "Agendado" }],
    ultrassons: [{ data: "2026-05-06", diaCiclo: 12, endometrio: "6,4 mm", folOD: "—", folOE: "—", maior: "—", interpretacao: "Reavaliar em 48h" }],
    procedimentos: [{ nome: "Transferência embrionária", data: "2026-05-14", status: "Programada" }],
    timeline: [
      { data: "2026-04-23", tipo: "Menstruação", titulo: "D1" },
      { data: "2026-04-25", tipo: "Medicação", titulo: "Início estradiol" },
      { data: "2026-05-06", tipo: "Ultrassom", titulo: "USG endometrial" },
    ],
    tarefas: [{ titulo: "Cobrar resultado de progesterona", prazo: "09/05", prioridade: "media" }],
    proximoEvento: { data: "09/05", titulo: "USG + progesterona" },
    alertas: ["Endométrio abaixo do ideal"],
  },
  {
    id: "p4", nome: "Renata Albuquerque", nascimento: "1990-02-17", idade: 35,
    cpf: "456.789.012-33", telefone: "(11) 98222-7788", email: "renata.alb@email.com",
    cidade: "São Paulo", uf: "SP", parceiro: "Tiago Albuquerque",
    modeloCuidado: "direto", medicoId: "founder", medicoNome: "Você (Fundadora)",
    objetivo: "Coito programado com indução",
    diagnosticos: ["Anovulação"],
    ciclo: { tipo: "Indução de ovulação", diaCiclo: 10, status: "Em andamento", protocolo: "Letrozol 5 mg", proximoPasso: "USG folicular", objetivo: "Ovulação em D14–16" },
    medicacoes: [{ nome: "Letrozol", dose: "5 mg", via: "Oral", frequencia: "1x/dia D3–D7", inicio: "2026-04-30", fim: "2026-05-04", confirmada: true }],
    exames: [],
    ultrassons: [{ data: "2026-05-07", diaCiclo: 10, endometrio: "8 mm", folOD: "1 folículo 17 mm", folOE: "—", maior: "17 mm", interpretacao: "Programar relação D11–D13" }],
    procedimentos: [],
    timeline: [
      { data: "2026-04-28", tipo: "Menstruação", titulo: "D1" },
      { data: "2026-04-30", tipo: "Medicação", titulo: "Início Letrozol" },
      { data: "2026-05-07", tipo: "Ultrassom", titulo: "USG D10" },
    ],
    tarefas: [{ titulo: "Enviar instruções de coito programado", prazo: "Hoje", prioridade: "alta" }],
    proximoEvento: { data: "Hoje", titulo: "Janela fértil — relação" },
    alertas: [],
  },
  {
    id: "p5", nome: "Patricia Hayashi", nascimento: "1988-06-09", idade: 36,
    cpf: "567.890.123-44", telefone: "(11) 97777-1010", email: "pati.h@email.com",
    cidade: "Campinas", uf: "SP", parceiro: "—",
    modeloCuidado: "medico", medicoId: "d1", medicoNome: "Dra. Mariana Salles",
    objetivo: "Investigação de infertilidade",
    diagnosticos: ["A esclarecer"],
    ciclo: { tipo: "Ciclo natural — investigação", diaCiclo: 5, status: "Investigação", protocolo: "—", proximoPasso: "Histerossonografia", objetivo: "Mapeamento basal" },
    medicacoes: [{ nome: "Ácido fólico", dose: "5 mg", via: "Oral", frequencia: "1x/dia", inicio: "2026-04-01", confirmada: true }],
    exames: [
      { nome: "AMH", categoria: "Hormonal", agendado: "2026-05-12", status: "Agendado" },
      { nome: "TSH", categoria: "Hormonal", agendado: "2026-05-12", status: "Agendado" },
    ],
    ultrassons: [],
    procedimentos: [{ nome: "Histerossonografia", data: "2026-05-15", status: "Agendada" }],
    timeline: [{ data: "2026-05-03", tipo: "Menstruação", titulo: "D1" }],
    tarefas: [{ titulo: "Solicitar exames basais", prazo: "10/05", prioridade: "media" }],
    proximoEvento: { data: "12/05", titulo: "Coleta de hormônios" },
    alertas: ["Dados clínicos incompletos"],
  },
];

export const proximosEventos = patients
  .map(p => ({ id: p.id, paciente: p.nome, medico: p.medicoNome, data: p.proximoEvento.data, titulo: p.proximoEvento.titulo }))
  .slice(0, 6);
