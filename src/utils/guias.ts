import type { DisposalGuide } from './tipos-guia';

const guias: Record<string, DisposalGuide> = {
  'baterias-pilhas': {
    slug: 'baterias-pilhas',
    tituloH1:
      'Guia Completo de Descarte de Baterias e Pilhas de Lítio em Manhuaçu',
    palavraDestaque: 'Manhuaçu',
    subtitulo:
      'Instruções técnicas certificadas para desativar, isolar e entregar pilhas recarregáveis, alcalinas e células de íon-lítio nos 9 postos credenciados sem custo para moradores e empresas da região do Caparaó.',
    pillsHero: [
      {
        texto: 'Atualizado em Outubro 2025',
        icone: 'Clock',
        variante: 'emerald',
      },
      {
        texto: 'Tempo de leitura: 4 min',
        icone: 'BookOpen',
        variante: 'sky',
      },
      {
        texto: 'Diretrizes CONAMA 401 & ABNT 14001',
        icone: 'ShieldCheck',
        variante: 'slate',
      },
      {
        texto: 'Logística Reversa Gratuita',
        icone: 'Leaf',
        variante: 'emerald',
      },
    ],
    ctaResumo: {
      texto: 'Ver 3 Postos Próximos',
      anchor: '#locais-coleta',
    },
    passos: [
      {
        numero: 1,
        titulo: 'Inspeção Visual',
        icone: 'Search',
        descricao:
          'Verifique se a pilha ou bateria apresenta estufamento, oxidação branca/azulada, perfurações ou resíduo viscoso nas laterais.',
        badge: {
          texto: 'Se estiver quente, isole ao ar livre.',
          icone: 'TriangleAlert',
          variante: 'danger',
        },
      },
      {
        numero: 2,
        titulo: 'Isolamento dos Polos',
        icone: 'Wrench',
        descricao:
          'Aplique fita isolante comum ou fita adesiva transparente sobre os terminais (+) e (-), prevenindo curto-circuito por atrito com outras pilhas.',
        badge: {
          texto: 'Especialmente vital em baterias 9V e lítio.',
          icone: 'CircleCheck',
          variante: 'success',
        },
      },
      {
        numero: 3,
        titulo: 'Recipiente Seco',
        icone: 'Archive',
        descricao:
          'Guarde os itens reunidos em pote plástico com tampa (tipo sorvete ou mantimento) ou saco zip hermético. Nunca use recipientes de metal.',
        badge: {
          texto: 'Manter longe do sol e calor direto.',
          icone: 'ThermometerSun',
          variante: 'neutral',
        },
      },
      {
        numero: 4,
        titulo: 'Entrega no EcoPonto',
        icone: 'MapPinned',
        descricao:
          'Leve até a urna de baterias em um dos pontos credenciados em Manhuaçu. O descarte é 100% gratuito e acompanhado de triagem local.',
        badge: {
          texto: 'Aberto em horário comercial ou 24h.',
          icone: 'Clock',
          variante: 'forest',
        },
      },
    ],
    triagem: {
      overline: 'CRITÉRIOS DE TRIAGEM',
      titulo: 'O que é Aceito vs. O que Não é Aceito nas Urnas',
      subtitulo:
        'Confira a lista para garantir a segurança dos operadores de triagem em Manhuaçu.',
      aceitos: {
        titulo: 'Itens Aceitos nas Urnas EcoPonto',
        descricao:
          'Descarte autorizado e gratuito para pessoas físicas e comércio',
        iconePrincipal: 'CheckCircle2',
        cor: 'emerald',
        itens: [
          {
            icone: 'Battery',
            titulo: 'Pilhas alcalinas e Zinco (AA, AAA, C, D)',
            descricao:
              'Pilhas comuns cilíndricas usadas em controles, brinquedos, lanternas e mouses.',
          },
          {
            icone: 'BatteryCharging',
            titulo: 'Baterias Recarregáveis de Lítio (Smartphones e Notebooks)',
            descricao:
              'Células íon-lítio (Li-ion) ou polímero de lítio removidas de aparelhos portáteis.',
          },
          {
            icone: 'Battery',
            titulo: 'Baterias Retangulares 9V e NiMH/NiCd',
            descricao:
              'Baterias de ferramentas sem fio leves, instrumentos musicais e detectores residenciais.',
          },
          {
            icone: 'CircleDot',
            titulo: 'Baterias Tipo Botão (CR2032, LR44)',
            descricao:
              'Microbaterias de relógio de pulso, placas-mãe, calculadoras e chaves de carro.',
          },
        ],
      },
      naoAceitos: {
        titulo: 'Não Aceitos nas Urnas Comuns',
        descricao:
          'Exigem canal de logística reversa automotiva ou industrial especializada',
        iconePrincipal: 'XCircle',
        cor: 'red',
        itens: [
          {
            icone: 'Car',
            titulo: 'Baterias Automotivas de Chumbo-Ácido (Carros/Motos)',
            descricao:
              'Contêm ácido sulfúrico líquido e chumbo metálico denso. Devem ser desenvolvidas em auto-eléticas credenciadas ou lojas de baterias de Manhuaçu.',
          },
          {
            icone: 'Droplet',
            titulo: 'Baterias Industriais com Vazamento Químico Ativo',
            descricao:
              'Resíduos industriais com corrosão aberta ou fumaça. Solicite agendamento com nossa equipe técnica pelo canal institucional.',
          },
          {
            icone: 'FlameKindling',
            titulo: 'Bancos Estacionários de Energia Solar / No-breaks Pesados',
            descricao:
              'Módulos acima de 15 kg demandam coleta direta com veículo adaptado para evitar tombamento e vazamento ácido.',
          },
        ],
      },
    },
    impacto: {
      pillTopo: 'Impacto no Rio Manhuaçu e Lençol Freático',
      pillIcone: 'Zap',
      titulo:
        'Por que 1 única pilha alcalina descartada no lixo comum pode contaminar 20 mil litros de água?',
      descricao:
        'Metais pesados como cádmio, chumbo e mercúrio não se degradam na natureza. Quando comprimidos em caminhões de lixo ou aterros sanitários convencionais, as películas metálicas se rompem e liberam chorume tóxico que atinge os aquíferos da Zona da Mata mineira. Além disso, baterias de lítio expostas à umidade geram risco iminente de ignição e incêndios espontâneos.',
      estatisticas: [
        {
          valor: '98%',
          label: 'Dos metais recuperáveis em reciclagem certificada',
        },
        {
          valor: '0 kg',
          label: 'De resíduo tóxico no solo com descarte no EcoPonto',
        },
        {
          valor: '100%',
          label: 'Gratuito para cidadãos de Manhuaçu e região',
        },
      ],
      painelLogistica: {
        titulo: 'Logística Reversa Certificada',
        descricao:
          'Todo o lote recolhido em Manhuaçu é auditado e enviado para fornos de recuperação metalúrgica com certificação ambiental ISO 14001.',
      },
    },
    locais: {
      overline: 'LOCAIS CREDENCIADOS',
      titulo: 'Pontos de Coleta Gratuitos para Baterias em Manhuaçu',
      subtitulo:
        'Urnas seladas específicas para coleta de pilhas e baterias de lítio com atendimento imediato.',
      linkTodosPostos: '/map',
      mapa: {
        titulo: 'Mapa da Região Central',
        pillRegiao: 'Manhuaçu Centro',
        descricao:
          'Os pontos estão distribuídos em rotas de fácil acesso a pé ou de veículo na bacia comercial da cidade.',
        labelPin: 'Você está aqui',
        raioAtendimento: 'Raio de atendimento: 5,5 km',
        acessoPublico: 'Acesso público sem agendamento',
      },
      postos: [
        {
          nome: 'EcoPonto Central Manhuaçu',
          badge: { texto: 'Posto Matriz', variante: 'emerald' },
          endereco: 'Rua Amaral Franco, 142 • Centro, Manhuaçu - MG',
          icone: 'Recycle',
          corIcone: 'emerald',
          statusOpen: 'Aberto hoje até 18:00',
          tipoAceito: 'Aceita todos os tipos de pilhas',
        },
        {
          nome: 'Ponto Parceiro Casas Bahia',
          badge: { texto: 'Urna na Entrada', variante: 'sky' },
          endereco: 'Praça Cordovil Pinto Coelho, 88 • Centro, Manhuaçu - MG',
          icone: 'Smartphone',
          corIcone: 'sky',
          statusOpen: 'Aberto hoje até 19:00',
          tipoAceito: 'Celulares e Pilhas AA/AAA',
        },
        {
          nome: 'Coleta Farmácia Pacheco Centro',
          badge: { texto: '24 Horas', variante: 'emerald' },
          endereco: 'Av. Getúlio Vargas, 310 • Centro, Manhuaçu - MG',
          icone: 'Clock',
          corIcone: 'emerald',
          statusOpen: 'Sempre Aberto',
          tipoAceito: 'Descarte rápido de pilhas e botões',
        },
      ],
    },
    faq: [
      {
        pergunta:
          'Por que não posso jogar baterias ou pilhas no lixo doméstico comum?',
        resposta:
          'Pilhas e baterias contêm metais pesados (chumbo, cádmio, mercúrio, lítio) que contaminam solo e água quando dispostas em aterros comuns. Além disso, células de lítio podem entrar em ignição espontânea durante a compactação em caminhões de lixo, oferecendo risco a coletores e à população.',
      },
      {
        pergunta:
          'Como isolar os polos da bateria com segurança antes do descarte?',
        resposta:
          'Cubra os terminais positivo (+) e negativo (-) com fita adesiva transparente ou fita isolante. Isso evita curto-circuito por contato entre pilhas durante o transporte e impede faíscas em baterias danificadas.',
      },
      {
        pergunta:
          'Onde encontrar postos credenciados de coleta gratuita em Manhuaçu?',
        resposta:
          'O EcoPonto mantém 9 postos credenciados na região central de Manhuaçu, incluindo o EcoPonto Central na Rua Amaral Franco e parceiros como Casas Bahia e Farmácia Pacheco. Consulte a seção de locais credenciados acima para endereços e horários.',
      },
      {
        pergunta: 'O EcoPonto cobra alguma taxa pelo recolhimento ou triagem?',
        resposta:
          'Não. Todo o recolhimento, triagem e destinação final são 100% gratuitos para pessoas físicas e comércio local de Manhuaçu, financiados pelo programa de logística reversa do EcoPonto.',
      },
    ],
    ctaEsg: {
      overline: 'CIDADANIA & RESPONSABILIDADE ESG',
      titulo: 'Quer registrar seus descartes e gerar certificados ambientais?',
      descricao:
        'Crie uma conta gratuita em menos de 1 minuto para emitir comprovantes de destinação de resíduos válidos para auditorias, empresas e projetos escolares de Manhuaçu.',
      botaoPrincipal: { texto: 'Criar Conta Gratuita', href: '/login' },
      botaoSecundario: { texto: 'Localizar no Mapa', href: '/map' },
    },
    categorias: [
      {
        slug: 'baterias-pilhas',
        rotulo: 'Baterias & Pilhas',
        icone: 'BatteryPlus',
        postos: '9 postos',
      },
      {
        slug: 'smartphones-tablets',
        rotulo: 'Smartphones & Tablets',
        icone: 'Smartphone',
        postos: '14 postos',
      },
      {
        slug: 'computadores-perifericos',
        rotulo: 'Computadores & Periféricos',
        icone: 'Laptop',
        postos: '8 postos',
      },
      {
        slug: 'monitores-telas-tvs',
        rotulo: 'Monitores, Telas & TVs',
        icone: 'Monitor',
        postos: '5 postos',
      },
    ],
  },
};

export async function findGuideBySlug(
  slug: string
): Promise<DisposalGuide | null> {
  return guias[slug] ?? null;
}

export async function getAllGuideSlugs(): Promise<string[]> {
  return Object.keys(guias);
}
