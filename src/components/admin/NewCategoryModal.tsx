'use client';

import { X, Recycle } from 'lucide-react';

type NewCategoryModalProps = {
  onClose: () => void;
};

export default function NewCategoryModal({ onClose }: NewCategoryModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-800">
              <Recycle size={25} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Nova Categoria de Resíduo
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Preencha as informações da nova categoria.
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
          id="form-categoria"
          className="min-h-0 flex-1 overflow-y-auto p-5"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="nome"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Nome da categoria *
              </label>

              <input
                id="nome"
                type="text"
                placeholder="Ex.: Impressoras e equipamentos"
                className="w-full rounded-xl border border-gray-200 bg-[#EEF3FF] px-4 py-3 outline-none focus:border-green-700"
              />
            </div>

            <div>
              <label
                htmlFor="codigo"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Código IBAMA *
              </label>

              <input
                id="codigo"
                type="text"
                placeholder="Código do resíduo"
                className="w-full rounded-xl border border-gray-200 bg-[#EEF3FF] px-4 py-3 outline-none focus:border-green-700"
              />
            </div>

            <div>
              <label
                htmlFor="classe"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Classe de periculosidade *
              </label>

              <select
                id="classe"
                defaultValue=""
                className="w-full rounded-xl border border-gray-200 bg-[#EEF3FF] px-4 py-3 outline-none focus:border-green-700"
              >
                <option value="" disabled>
                  Selecione a classe
                </option>

                <option value="I">Classe I</option>
                <option value="IIA">Classe II A</option>
                <option value="IIB">Classe II B</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="periculosidade"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Descrição da periculosidade
              </label>

              <input
                id="periculosidade"
                type="text"
                placeholder="Ex.: Tóxico / Corrosivo"
                className="w-full rounded-xl border border-gray-200 bg-[#EEF3FF] px-4 py-3 outline-none focus:border-green-700"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="destinador"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Destinador homologado *
              </label>

              <input
                id="destinador"
                type="text"
                placeholder="Nome da empresa ou cooperativa"
                className="w-full rounded-xl border border-gray-200 bg-[#EEF3FF] px-4 py-3 outline-none focus:border-green-700"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="licenca"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Número da licença ambiental
              </label>

              <input
                id="licenca"
                type="text"
                placeholder="Ex.: Licença FEAM nº 2048/2022"
                className="w-full rounded-xl border border-gray-200 bg-[#EEF3FF] px-4 py-3 outline-none focus:border-green-700"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="processo"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Processo de valorização *
              </label>

              <textarea
                id="processo"
                rows={3}
                placeholder="Descreva o processo de tratamento ou reciclagem"
                className="w-full resize-none rounded-xl border border-gray-200 bg-[#EEF3FF] px-4 py-3 outline-none focus:border-green-700"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="visibilidade"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Visibilidade no mapa
              </label>

              <select
                id="visibilidade"
                defaultValue="ativo"
                className="w-full rounded-xl border border-gray-200 bg-[#EEF3FF] px-4 py-3 outline-none focus:border-green-700"
              >
                <option value="ativo">Ativa</option>
                <option value="inativo">Inativa</option>
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
            type="button"
            className="rounded-xl bg-green-800 px-5 py-3 text-sm font-medium text-white hover:bg-green-900"
          >
            Cadastrar categoria
          </button>
        </div>
      </div>
    </div>
  );
}
