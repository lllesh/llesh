export type Topic = {
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  suggestions: { title: string; prompt: string }[];
  group?: "fases" | "umbigo" | "eixos";
  groupTag?: string;

};

export const topics: Topic[] = [
  // Fases
  {
    slug: "pre-concep",
    group: "fases",
    groupTag: "0",
    label: "PRÉ-CONCEP",
    eyebrow: "Fase 0 — Pré-concep",
    title: "Pré-concepção",
    description:
      "Preparo do casal antes da tentativa: exames basais, hábitos, suplementação e ajustes clínicos.",
    suggestions: [
      { title: "Checklist inicial", prompt: "Quais exames basais pedir na pré-concepção?" },
      { title: "Suplementação", prompt: "Quais suplementos indicar e em que doses?" },
      { title: "Hábitos", prompt: "Que ajustes de hábito têm maior impacto na fertilidade?" },
      { title: "Tempo de preparo", prompt: "Quanto tempo de preparo é recomendado antes de tentar?" },
    ],
  },
  {
    slug: "ao",
    group: "fases",
    groupTag: "1",
    label: "Aquecimento Ovariano",
    eyebrow: "Fase 1",
    title: "Aquecimento Ovariano",

    description: "Estratégias da fase de aquecimento ovariano para otimizar resposta e qualidade folicular.",
    suggestions: [
      { title: "Quando iniciar", prompt: "Quando indicar aquecimento ovariano?" },
      { title: "Protocolo", prompt: "Como estruturar um protocolo de aquecimento ovariano?" },
      { title: "Avaliação de resposta", prompt: "Como avaliar resposta ao aquecimento ovariano?" },
      { title: "Reserva baixa", prompt: "Como adaptar o aquecimento em reserva ovariana diminuída?" },
    ],
  },
  {
    slug: "ae",
    group: "fases",
    groupTag: "2",
    label: "Amor Empoderado",
    eyebrow: "Fase 2",
    title: "Amor Empoderado",

    description: "Conduta da fase de tentativas dirigidas, com timing, monitorização e suporte de fase lútea.",
    suggestions: [
      { title: "Janela fértil", prompt: "Como definir e comunicar a janela fértil ao casal?" },
      { title: "Monitorização", prompt: "Qual monitorização folicular adotar nessa fase?" },
      { title: "Suporte lúteo", prompt: "Quando indicar suporte de fase lútea?" },
      { title: "Quando escalar", prompt: "Quando passar da fase AE para a próxima etapa?" },
    ],
  },

  {
    slug: "pc",
    group: "fases",
    groupTag: "3",
    label: "Laparoscopia?",
    eyebrow: "Fase 3",
    title: "Laparoscopia?",


    description: "Indicações, benefícios e limites da laparoscopia diagnóstica e terapêutica na infertilidade.",
    suggestions: [
      { title: "Indicações", prompt: "Quais as principais indicações de laparoscopia na infertilidade?" },
      { title: "Endometriose", prompt: "Quando indicar laparoscopia em suspeita de endometriose?" },
      { title: "Risco-benefício", prompt: "Como pesar risco e benefício antes da laparoscopia?" },
      { title: "Pós-operatório", prompt: "Qual a janela ideal para tentar após laparoscopia?" },
    ],
  },
  {
    slug: "fiv",
    group: "fases",
    groupTag: "4",
    label: "In Vitro?",
    eyebrow: "Fase 4",
    title: "In Vitro?",

    description: "Fertilização in vitro: indicação, protocolos de estímulo, laboratório e transferência.",
    suggestions: [
      { title: "Indicações", prompt: "Quais as principais indicações de FIV?" },
      { title: "Escolha de protocolo", prompt: "Como escolher o protocolo de estímulo na FIV?" },
      { title: "Transferência", prompt: "Transferência a fresco ou congelada: como decidir?" },
      { title: "Falha de implantação", prompt: "Como investigar falha de implantação na FIV?" },
    ],
  },

  // Umbigo (eixos clínicos)
  {
    slug: "ultras",
    group: "umbigo",
    label: "ULTRAs",
    eyebrow: "Ultras",
    title: "Ultrassons",
    description: "Interpretação de ultrassons transvaginais e pélvicos em medicina reprodutiva.",
    suggestions: [
      { title: "CFA", prompt: "Como interpretar a contagem de folículos antrais (CFA)?" },
      { title: "Endométrio", prompt: "Valores de espessura endometrial considerados adequados em cada fase do ciclo." },
      { title: "Cistos ovarianos", prompt: "Como diferenciar cistos funcionais de patológicos no ultrassom?" },
      { title: "Monitorização", prompt: "Como conduzir a monitorização folicular em estímulo ovariano?" },
    ],
  },

  {
    slug: "hsg",
    group: "umbigo",
    label: "HSG",

    eyebrow: "HSG",
    title: "Histerossalpingografia",
    description: "Indicações, técnica, interpretação e conduta após HSG.",
    suggestions: [
      { title: "Indicações", prompt: "Quais as principais indicações da HSG?" },
      { title: "Achados tubários", prompt: "Como interpretar obstrução tubária proximal e distal na HSG?" },
      { title: "Cavidade uterina", prompt: "Quais alterações uterinas a HSG pode identificar?" },
      { title: "Próximo passo", prompt: "Qual a conduta após HSG com hidrossalpinge?" },
    ],
  },
  {
    slug: "amh",
    group: "umbigo",
    label: "AMH",

    eyebrow: "AMH",
    title: "Hormônio Antimülleriano",
    description: "Interpretação do AMH na avaliação da reserva ovariana e implicações clínicas.",
    suggestions: [
      { title: "Referência", prompt: "Valores de referência de AMH por faixa etária." },
      { title: "AMH baixo", prompt: "Como conduzir paciente com AMH muito baixo?" },
      { title: "AMH e SOP", prompt: "Papel do AMH no diagnóstico de SOP." },
      { title: "AMH x CFA", prompt: "Como integrar AMH e CFA na decisão clínica?" },
    ],
  },
  {
    slug: "ovulo",
    group: "umbigo",
    label: "ÓVULO",

    eyebrow: "Óvulo",
    title: "Óvulo",
    description: "Qualidade ovocitária, maturação, fatores que influenciam e estratégias clínicas.",
    suggestions: [
      { title: "Qualidade", prompt: "O que define qualidade ovocitária?" },
      { title: "Idade e óvulo", prompt: "Como a idade impacta a qualidade do óvulo?" },
      { title: "Maturação", prompt: "Como ocorre a maturação ovocitária?" },
      { title: "Como melhorar", prompt: "Estratégias para otimizar qualidade ovocitária." },
    ],
  },
  {
    slug: "ovulacao",
    group: "umbigo",
    label: "OVULAÇÃO",

    eyebrow: "Ovulação",
    title: "Ovulação",
    description: "Fisiologia da ovulação, sinais clínicos, detecção e disfunções ovulatórias.",
    suggestions: [
      { title: "Sinais", prompt: "Quais sinais clínicos indicam ovulação?" },
      { title: "Detecção", prompt: "Como detectar ovulação na prática?" },
      { title: "Anovulação", prompt: "Como abordar quadros de anovulação?" },
      { title: "Indução", prompt: "Quando e como indicar indução da ovulação?" },
    ],
  },
  {
    slug: "trompa",
    group: "umbigo",
    label: "TROMPA",

    eyebrow: "Trompa",
    title: "Trompa",
    description: "Anatomia, função tubária, fatores tubários de infertilidade e conduta.",
    suggestions: [
      { title: "Função", prompt: "Resumo da função tubária na reprodução." },
      { title: "Fator tubário", prompt: "Como investigar fator tubário de infertilidade?" },
      { title: "Hidrossalpinge", prompt: "Conduta diante de hidrossalpinge antes de FIV." },
      { title: "Reanastomose", prompt: "Quando considerar reanastomose tubária?" },
    ],
  },
  {
    slug: "ovario",
    group: "umbigo",
    label: "OVÁRIO",

    eyebrow: "Ovário",
    title: "Ovário",
    description: "Fisiologia ovariana, reserva, patologias e estratégias terapêuticas.",
    suggestions: [
      { title: "Reserva", prompt: "Como avaliar a reserva ovariana de forma integrada?" },
      { title: "SOP", prompt: "Critérios diagnósticos e conduta na SOP." },
      { title: "Insuficiência", prompt: "Conduta diante de insuficiência ovariana precoce." },
      { title: "Cirurgia", prompt: "Quando indicar cirurgia em patologia ovariana?" },
    ],
  },
  {
    slug: "fod",
    label: "FOD",
    eyebrow: "FOD",
    title: "FOD",
    description: "Conteúdo reunido sob a categoria FOD dentro da obra FÈMEA.",
    suggestions: [
      { title: "O que é", prompt: "O que é FOD no contexto da obra?" },
      { title: "Quando aplicar", prompt: "Em que situações considerar FOD?" },
      { title: "Pontos-chave", prompt: "Liste os pontos-chave de FOD." },
      { title: "Referências", prompt: "Onde a obra discute FOD?" },
    ],
  },
  {
    slug: "rehab",
    label: "REHAB",
    eyebrow: "Rehab",
    title: "Rehab",
    description: "Estratégias de reabilitação reprodutiva e recuperação ao longo das fases.",
    suggestions: [
      { title: "Quando indicar", prompt: "Quando indicar uma fase de Rehab?" },
      { title: "Estrutura", prompt: "Como estruturar um plano de Rehab?" },
      { title: "Após FIV", prompt: "Rehab após ciclo de FIV sem sucesso." },
      { title: "Sinais de pronto", prompt: "Sinais de que a paciente está pronta para nova tentativa." },
    ],
  },
  {
    slug: "re-fem",
    label: "RE.FEM",
    eyebrow: "Re.Fem",
    title: "Re.Fem",
    description: "Eixo Re.Fem dentro do método FÈMEA — releitura, retomada e reorganização.",
    suggestions: [
      { title: "Conceito", prompt: "Explique o conceito de Re.Fem." },
      { title: "Aplicação", prompt: "Como aplicar Re.Fem na prática?" },
      { title: "Integração", prompt: "Como Re.Fem integra com as fases 0 a 4?" },
      { title: "Sinais", prompt: "Quando é hora de entrar em Re.Fem?" },
    ],
  },
];

export const topicsBySlug = new Map(topics.map((t) => [t.slug, t]));
