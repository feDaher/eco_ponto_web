export interface Evaluation {
  id: string;
  author: string;
  badge: string;
  stats: string;
  location: string;
  date: string;
  stars: number;
  tag?: string;
  comment: string;
  status: 'visible' | 'hidden' | 'removed';
  code: string;
}

export const INITIAL_MOCK: Evaluation[] = [
  {
    id: '1',
    author: 'Marcos Ribeiro',
    badge: 'Munícipe Verificado',
    stats: '3 descartes',
    location: 'EcoPonto Central – Praça Cordovil Pinto Coelho',
    date: 'Hoje, às 14:15',
    stars: 1.0,
    tag: 'Relato Sinalizado por Cidadãos',
    comment:
      'Não aceitaram minha bateria velha, atendimento ruim. Vou jogar no rio se não resolverem!',
    status: 'visible',
    code: '#MOD-2024-8891',
  },
  {
    id: '2',
    author: 'Carla Mendes',
    badge: 'Guardiã Nível 3',
    stats: '18 descartes válidos',
    location: 'Drogaria Pacheco – Centro Comercial',
    date: 'Hoje, às 11:20',
    stars: 2.0,
    comment:
      'A farmácia fecha para almoço às 17h, diferente do app. Favor atualizar.',
    status: 'visible',
    code: '#MOD-2024-8889',
  },
  {
    id: '3',
    author: 'Sucatas & Vendas ZAP',
    badge: 'Conta Não Verificada',
    stats: '',
    location: 'Caparaó Tech Informática',
    date: 'Ontem, às 18:40',
    stars: 2.0,
    comment:
      'Compro placas velhas e cobres no pix: 99887-XXXX. Melhor preço da região.',
    status: 'hidden',
    code: '#MOD-2024-8874',
  },
  {
    id: '4',
    author: 'Ana Paula Souza',
    badge: 'Munícipe Verificado',
    stats: '5 descartes',
    location: 'EcoPonto Central – Praça Cordovil Pinto Coelho',
    date: 'Ontem, às 16:10',
    stars: 5.0,
    comment:
      'Ótimo atendimento, descartes de lâmpadas funcionaram perfeitamente.',
    status: 'visible',
    code: '#MOD-2024-8865',
  },
  {
    id: '5',
    author: 'Lucas Freitas',
    badge: 'Colaborador',
    stats: '12 descartes',
    location: 'EcoPonto Bairro Alfa',
    date: '05/11, às 09:30',
    stars: 4.0,
    comment: 'Local limpo e bem sinalizado. Voltarei mais vezes.',
    status: 'visible',
    code: '#MOD-2024-8850',
  },
  {
    id: '6',
    author: 'Mariana Lima',
    badge: 'Munícipe Verificado',
    stats: '2 descartes',
    location: 'Drogaria Pacheco – Centro Comercial',
    date: '04/11, às 15:45',
    stars: 1.0,
    comment: 'Descarte de pilhas estava lotado e entornando fora da caixa.',
    status: 'visible',
    code: '#MOD-2024-8842',
  },
  {
    id: '7',
    author: 'Roberto Carlos',
    badge: 'Conta Não Verificada',
    stats: '',
    location: 'EcoPonto Central – Praça Cordovil Pinto Coelho',
    date: '03/11, às 11:15',
    stars: 3.0,
    comment: 'Demorou um pouco para atenderem na recepção.',
    status: 'visible',
    code: '#MOD-2024-8830',
  },
  {
    id: '8',
    author: 'Fernanda Oliveira',
    badge: 'Guardiã Nível 1',
    stats: '7 descartes válidos',
    location: 'Caparaó Tech Informática',
    date: '02/11, às 14:00',
    stars: 5.0,
    comment: 'Excelente iniciativa da prefeitura e parceiros!',
    status: 'visible',
    code: '#MOD-2024-8821',
  },
  {
    id: '9',
    author: 'Gabriel Santos',
    badge: 'Munícipe Verificado',
    stats: '1 descarte',
    location: 'EcoPonto Bairro Alfa',
    date: '01/11, às 10:20',
    stars: 2.0,
    comment: 'Horário de funcionamento incorreto no mapa.',
    status: 'hidden',
    code: '#MOD-2024-8810',
  },
  {
    id: '10',
    author: 'Beatriz Costa',
    badge: 'Guardiã Nível 2',
    stats: '14 descartes válidos',
    location: 'Drogaria Pacheco – Centro Comercial',
    date: '31/10, às 17:05',
    stars: 4.0,
    comment: 'Tudo certo com o descarte de remédios vencidos.',
    status: 'visible',
    code: '#MOD-2024-8801',
  },
];
