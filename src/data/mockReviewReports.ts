import type { Review } from '@/types/api';

export const mockReviewReports: Record<string, Review[]> = {
  '1': [
    {
      id: 'mod-8891',
      author: 'Marcos Ribeiro',
      rating: 1,
      comment:
        'Não aceitaram minha bateria velha, atendimento ruim. Vou jogar no rio se não resolverem!',
      date: '2026-11-18',
      neighborhood: 'Centro',
    },
    {
      id: 'mod-8865',
      author: 'Ana Paula Souza',
      rating: 5,
      comment:
        'Ótimo atendimento, o descarte de lâmpadas funcionou perfeitamente.',
      date: '2026-11-17',
      neighborhood: 'Centro',
    },
    {
      id: 'mod-8830',
      author: 'Roberto Carlos',
      rating: 3,
      comment: 'Demorou um pouco para atenderem na recepção.',
      date: '2026-11-03',
    },
  ],
  '2': [
    {
      id: 'mod-8842',
      author: 'Mariana Lima',
      rating: 1,
      comment: 'O coletor de pilhas estava lotado e entornando fora da caixa.',
      date: '2026-11-04',
      neighborhood: 'Centro',
    },
  ],
  '3': [
    {
      id: 'mod-8850',
      author: 'Lucas Freitas',
      rating: 4,
      comment: 'Local limpo e bem sinalizado. Voltarei mais vezes.',
      date: '2026-11-05',
      neighborhood: 'Bom Jardim',
    },
  ],
  '4': [
    {
      id: 'mod-8889',
      author: 'Carla Mendes',
      rating: 2,
      comment:
        'O ponto fecha para almoço, diferente do horário do app. Favor atualizar.',
      date: '2026-11-18',
      neighborhood: 'Coqueiro',
    },
    {
      id: 'mod-8801',
      author: 'Beatriz Costa',
      rating: 4,
      comment: 'Tudo certo com o descarte do óleo de cozinha usado.',
      date: '2026-10-31',
    },
  ],
  '5': [
    {
      id: 'mod-8821',
      author: 'Fernanda Oliveira',
      rating: 5,
      comment: 'Excelente iniciativa da prefeitura e dos parceiros!',
      date: '2026-11-02',
      neighborhood: 'Santa Terezinha',
    },
  ],
  '6': [
    {
      id: 'mod-8874',
      author: 'Sucatas & Vendas ZAP',
      rating: 2,
      comment:
        'Compro placas velhas e cobre no pix: 99887-XXXX. Melhor preço da região.',
      date: '2026-11-17',
      hidden: true,
    },
  ],
  '7': [
    {
      id: 'mod-8810',
      author: 'Gabriel Santos',
      rating: 2,
      comment: 'Horário de funcionamento incorreto no mapa.',
      date: '2026-11-01',
      neighborhood: 'Engenho da Serra',
      hidden: true,
    },
  ],
};
