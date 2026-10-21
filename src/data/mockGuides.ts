import {
  Archive,
  Battery,
  BatteryCharging,
  BatteryPlus,
  Car,
  CircleCheck,
  CircleDot,
  Clock,
  Droplet,
  FlameKindling,
  Leaf,
  MapPinned,
  Search,
  ShieldCheck,
  ThermometerSun,
  TriangleAlert,
  Wrench,
} from 'lucide-react';
import type { DisposalGuide } from '@/types/education';

export const mockGuides: DisposalGuide[] = [
  {
    slug: 'baterias-pilhas',
    material: 'pilhas',
    label: 'Baterias & Pilhas',
    icon: BatteryPlus,
    title: 'Guia de descarte de pilhas e baterias em Manhuaçu',
    highlight: 'Manhuaçu',
    description:
      'Como preparar, armazenar e entregar pilhas comuns, recarregáveis e baterias de lítio com segurança nos pontos de coleta da cidade, sem custo para moradores e comércio local.',
    updatedAt: '2026-10-21',
    readingMinutes: 4,
    tags: [
      {
        label: 'Resolução CONAMA 401/2008',
        icon: ShieldCheck,
        tone: 'neutral',
      },
      { label: 'Logística reversa gratuita', icon: Leaf, tone: 'brand' },
    ],
    summary: {
      title: 'Como descartar pilhas e baterias em 30 segundos',
      steps: [
        {
          title: 'Isole os dois polos',
          text: 'com fita adesiva ou fita isolante.',
        },
        {
          title: 'Separe as estufadas',
          text: 'e não as misture com pilhas em bom estado.',
        },
        {
          title: 'Entregue',
          text: 'em um dos pontos de coleta de Manhuaçu listados abaixo.',
        },
      ],
    },
    steps: {
      eyebrow: 'Protocolo recomendado',
      title: 'Passo a passo de preparação segura',
      description:
        'Evite curto-circuito, aquecimento e vazamentos entre a sua casa e o ponto de coleta.',
      reference: 'ABNT NBR 10004: resíduo perigoso (Classe I)',
      items: [
        {
          title: 'Inspeção visual',
          icon: Search,
          description:
            'Verifique se a pilha ou bateria está estufada, oxidada (pó branco ou azulado), perfurada ou com resíduo viscoso nas laterais.',
          note: {
            text: 'Se estiver quente, deixe-a em local arejado e longe de materiais inflamáveis.',
            icon: TriangleAlert,
            tone: 'warning',
          },
        },
        {
          title: 'Isolamento dos polos',
          icon: Wrench,
          description:
            'Cubra os terminais (+) e (-) com fita isolante ou fita adesiva transparente para evitar curto-circuito por contato com outras pilhas.',
          note: {
            text: 'Essencial em baterias de 9 V e de lítio.',
            icon: CircleCheck,
            tone: 'success',
          },
        },
        {
          title: 'Recipiente seco',
          icon: Archive,
          description:
            'Guarde tudo em um pote plástico com tampa ou em um saco com fecho hermético. Nunca use recipientes de metal.',
          note: {
            text: 'Mantenha longe do sol e de fontes de calor.',
            icon: ThermometerSun,
            tone: 'neutral',
          },
        },
        {
          title: 'Entrega no ponto',
          icon: MapPinned,
          description:
            'Leve até um ponto de coleta que aceite pilhas e baterias. A entrega é gratuita.',
          note: {
            text: 'Confira o horário do ponto antes de sair.',
            icon: Clock,
            tone: 'success',
          },
        },
      ],
    },
    sorting: {
      eyebrow: 'Critérios de triagem',
      title: 'O que é aceito e o que não é aceito',
      description:
        'Confira a lista antes de sair de casa: ela protege quem faz a triagem nos pontos de coleta.',
      accepted: {
        title: 'Aceitos nos pontos de coleta',
        description: 'Entrega gratuita para moradores e comércio local.',
        items: [
          {
            icon: Battery,
            title: 'Pilhas alcalinas e de zinco (AA, AAA, C, D)',
            description:
              'Pilhas cilíndricas comuns de controles, brinquedos, lanternas e mouses.',
          },
          {
            icon: BatteryCharging,
            title: 'Baterias recarregáveis de lítio',
            description:
              'Células de íon-lítio ou polímero de lítio retiradas de celulares, notebooks e outros aparelhos portáteis.',
          },
          {
            icon: Battery,
            title: 'Baterias de 9 V, NiMH e NiCd',
            description:
              'Baterias de ferramentas sem fio leves, instrumentos musicais e detectores de fumaça.',
          },
          {
            icon: CircleDot,
            title: 'Baterias tipo botão (CR2032, LR44)',
            description:
              'Baterias pequenas de relógios, placas-mãe, calculadoras e chaves de carro.',
          },
        ],
      },
      rejected: {
        title: 'Não aceitos nos pontos comuns',
        description: 'Precisam de um canal de coleta especializado.',
        items: [
          {
            icon: Car,
            title: 'Baterias automotivas de chumbo-ácido',
            description:
              'Contêm ácido sulfúrico e chumbo. Devolva em lojas de baterias ou autoelétricas, que são obrigadas a recebê-las na troca.',
          },
          {
            icon: Droplet,
            title: 'Baterias com vazamento químico',
            description:
              'Com corrosão aberta, líquido ou fumaça. Não transporte: procure uma empresa licenciada para resíduos perigosos.',
          },
          {
            icon: FlameKindling,
            title: 'Baterias estacionárias e de nobreaks grandes',
            description:
              'Módulos pesados de energia solar ou nobreaks exigem coleta especializada para evitar tombamento e vazamento.',
          },
        ],
      },
    },
    impact: {
      tag: 'Impacto no solo e na água',
      title: 'Por que pilhas e baterias não podem ir para o lixo comum?',
      description:
        'Pilhas e baterias podem conter metais como chumbo, cádmio, mercúrio e níquel, que não se degradam e contaminam o solo e a água quando a carcaça se rompe em aterros. As baterias de lítio ainda podem pegar fogo ao serem amassadas no caminhão de coleta.',
      stats: [
        {
          value: 'Classe I',
          label: 'Resíduo perigoso pela norma ABNT NBR 10004',
        },
        {
          value: 'Art. 33',
          label: 'A PNRS obriga a logística reversa de pilhas e baterias',
        },
        {
          value: 'Grátis',
          label: 'Entrega sem custo nos pontos de coleta de Manhuaçu',
        },
      ],
      panel: {
        title: 'Logística reversa',
        description:
          'O material entregue nos pontos volta para fabricantes e importadores, que são responsáveis pela destinação correta, como prevê a Política Nacional de Resíduos Sólidos (Lei 12.305/2010).',
      },
    },
    locations: {
      eyebrow: 'Onde entregar',
      title: 'Pontos de coleta de pilhas e baterias em Manhuaçu',
      description:
        'Pontos aprovados pela equipe do EcoPonto que recebem pilhas e baterias.',
    },
    faq: {
      eyebrow: 'Tira-dúvidas',
      title: 'Perguntas frequentes sobre pilhas e baterias',
      description:
        'Respostas com base na Política Nacional de Resíduos Sólidos (PNRS) e na Resolução CONAMA 401/2008.',
      items: [
        {
          question:
            'Por que não posso jogar pilhas e baterias no lixo doméstico?',
          answer:
            'Elas podem conter metais pesados que contaminam o solo e a água quando vão para aterros comuns. Além disso, baterias de lítio podem pegar fogo durante a compactação no caminhão de lixo, colocando em risco os coletores e a população.',
        },
        {
          question: 'Como isolar os polos da bateria com segurança?',
          answer:
            'Cubra os terminais positivo (+) e negativo (-) com fita adesiva transparente ou fita isolante. Isso evita curto-circuito por contato entre pilhas durante o transporte e reduz o risco de faíscas em baterias danificadas.',
        },
        {
          question: 'Onde entregar pilhas e baterias em Manhuaçu?',
          answer:
            'Nos pontos de coleta listados nesta página, que aceitam pilhas e baterias. No mapa interativo você vê todos os pontos aprovados, com endereço, horário e rota.',
        },
        {
          question: 'É cobrada alguma taxa pela entrega?',
          answer:
            'Não. A entrega de pilhas e baterias nos pontos de coleta é gratuita para moradores e para o comércio local.',
        },
      ],
    },
  },
];
