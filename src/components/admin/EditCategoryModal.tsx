'use client';

import { useState } from 'react';
import { X, Pencil } from 'lucide-react';

type Categoria = {
  id: number;
  nome: string;
  codigoIbama: string;
  informacoes: string[];
  icone: 'battery' | 'laptop' | 'smartphone' | 'cable' | 'monitor';
  corIcone: 'red' | 'green';
  classe: 'Classe I' | 'Classe II A' | 'Classe II B';
  descricaoClasse: string;
  descricaoPericulosidade: string[];
  destinador: string;
  licenca: string[];
  processo: string[];
  visibilidade: 'ativo' | 'bloqueio';
  descricaoVisibilidade?: string[];
};

type EditCategoryModalProps = {
  categoria: Categoria;
  onClose: () => void;
  onSave: (categoriaAtualizada: Categoria) => void;
};

export default function EditCategoryModal({
  categoria,
  onClose,
  onSave,
}: EditCategoryModalProps) {
  const [nome, setNome] = useState(categoria.nome);
  const [codigoIbama, setCodigoIbama] = useState(categoria.codigoIbama);
  const [classe, setClasse] = useState(categoria.classe);
  const [descricaoPericulosidade, setDescricaoPericulosidade] = useState(
    categoria.descricaoPericulosidade.join(' ')
  );
  const [destinador, setDestinador] = useState(categoria.destinador);
  const [licenca, setLicenca] = useState(categoria.licenca.join(' '));
  const [processo, setProcesso] = useState(categoria.processo.join(' '));
  const [visibilidade, setVisibilidade] = useState(categoria.visibilidade);

  function salvarAlteracoes(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const categoriaAtualizada: Categoria = {
      ...categoria,
      nome,
      codigoIbama,
      classe,
      descricaoClasse:
        classe === 'Classe I'
          ? 'Perigoso'
          : classe === 'Classe II A'
            ? 'Não Inerte'
            : 'Inerte',
      descricaoPericulosidade: descricaoPericulosidade
        .split('\n')
        .map((texto) => texto.trim())
        .filter(Boolean),
      destinador,
      licenca: licenca
        .split('\n')
        .map((texto) => texto.trim())
        .filter(Boolean),
      processo: processo
        .split('\n')
        .map((texto) => texto.trim())
        .filter(Boolean),
      visibilidade,
      descricaoVisibilidade:
        visibilidade === 'bloqueio' ? ['Inativo no', 'Mapa Geral'] : undefined,
    };

    onSave(categoriaAtualizada);
  }

  const estiloCampo =
    'w-full rounded-xl border border-gray-200 bg-[#EEF3FF] px-4 py-3 outline-none focus:border-green-700';

  const estiloLabel = 'mb-2 block text-sm font-medium text-gray-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-800">
              <Pencil size={23} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Editar categoria de resíduos
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Altere as informações da categoria selecionada.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Fechar formulário"
          >
            <X size={22} />
          </button>
        </div>

        <form
          id="form-editar-categoria"
          onSubmit={salvarAlteracoes}
          className="min-h-0 flex-1 overflow-y-auto p-5"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="editar-nome" className={estiloLabel}>
                Nome da categoria *
              </label>

              <input
                id="editar-nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={estiloCampo}
              />
            </div>

            <div>
              <label htmlFor="editar-codigo" className={estiloLabel}>
                Código IBAMA *
              </label>

              <input
                id="editar-codigo"
                type="text"
                required
                value={codigoIbama}
                onChange={(e) => setCodigoIbama(e.target.value)}
                className={estiloCampo}
              />
            </div>

            <div>
              <label htmlFor="editar-classe" className={estiloLabel}>
                Classe de periculosidade *
              </label>

              <select
                id="editar-classe"
                value={classe}
                onChange={(e) =>
                  setClasse(e.target.value as Categoria['classe'])
                }
                className={estiloCampo}
              >
                <option value="Classe I">Classe I</option>
                <option value="Classe II A">Classe II A</option>
                <option value="Classe II B">Classe II B</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="editar-periculosidade" className={estiloLabel}>
                Descrição da periculosidade
              </label>

              <textarea
                id="editar-periculosidade"
                rows={2}
                value={descricaoPericulosidade}
                onChange={(e) => setDescricaoPericulosidade(e.target.value)}
                className={`${estiloCampo} resize-none`}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="editar-destinador" className={estiloLabel}>
                Destinador homologado *
              </label>

              <input
                id="editar-destinador"
                type="text"
                required
                value={destinador}
                onChange={(e) => setDestinador(e.target.value)}
                className={estiloCampo}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="editar-licenca" className={estiloLabel}>
                Licença ambiental
              </label>

              <textarea
                id="editar-licenca"
                rows={2}
                value={licenca}
                onChange={(e) => setLicenca(e.target.value)}
                className={`${estiloCampo} resize-none`}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="editar-processo" className={estiloLabel}>
                Processo de valorização *
              </label>

              <textarea
                id="editar-processo"
                rows={3}
                required
                value={processo}
                onChange={(e) => setProcesso(e.target.value)}
                className={`${estiloCampo} resize-none`}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="editar-visibilidade" className={estiloLabel}>
                Visibilidade no mapa
              </label>

              <select
                id="editar-visibilidade"
                value={visibilidade}
                onChange={(e) =>
                  setVisibilidade(e.target.value as Categoria['visibilidade'])
                }
                className={estiloCampo}
              >
                <option value="ativo">Ativa</option>
                <option value="bloqueio">Inativa</option>
              </select>
            </div>
          </div>
        </form>

        <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-gray-100 bg-white p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="form-editar-categoria"
            className="rounded-xl bg-green-800 px-5 py-3 text-sm font-medium text-white hover:bg-green-900"
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}
