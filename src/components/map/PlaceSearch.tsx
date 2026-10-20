'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Loader2, MapPin, Recycle, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPoints } from '@/services/api';
import { useGeocoder } from './useGeocoder';
import type { CollectionPoint, LatLng, MapBounds } from '@/types/api';

export type PlaceResult = {
  location: LatLng;
  viewport?: MapBounds;
  label: string;
};

type Option =
  | {
      kind: 'point';
      id: string;
      label: string;
      detail: string;
      point: CollectionPoint;
    }
  | {
      kind: 'place';
      id: string;
      label: string;
      detail: string;
      prediction: google.maps.places.PlacePrediction;
    };

type PlaceSearchProps = {
  biasCenter?: LatLng;
  onPlaceSelect: (place: PlaceResult) => void;
  onPointSelect: (point: CollectionPoint) => void;
};

const MIN_CHARS = 3;
const DEBOUNCE_MS = 250;

export function PlaceSearch({
  biasCenter,
  onPlaceSelect,
  onPointSelect,
}: PlaceSearchProps) {
  const places = useMapsLibrary('places');
  const { geocode } = useGeocoder();
  const listId = useId();

  const [input, setInput] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const requestRef = useRef(0);
  const sessionRef =
    useRef<google.maps.places.AutocompleteSessionToken>(undefined);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  async function fetchOptions(text: string) {
    const requestId = ++requestRef.current;

    const [matches, suggestions] = await Promise.all([
      getPoints({ query: text }).catch((): CollectionPoint[] => []),
      places
        ? places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: text,
            sessionToken: (sessionRef.current ??=
              new places.AutocompleteSessionToken()),
            includedRegionCodes: ['br'],
            language: 'pt-BR',
            locationBias: biasCenter,
          })
            .then((res) => res.suggestions)
            .catch((): google.maps.places.AutocompleteSuggestion[] => [])
        : Promise.resolve<google.maps.places.AutocompleteSuggestion[]>([]),
    ]);

    if (requestId !== requestRef.current) return;

    setOptions([
      ...matches.slice(0, 3).map((point): Option => ({
        kind: 'point',
        id: `point-${point.id}`,
        label: point.name,
        detail: `${point.address} - ${point.neighborhood}`,
        point,
      })),
      ...suggestions.flatMap((s): Option[] =>
        s.placePrediction
          ? [
              {
                kind: 'place',
                id: `place-${s.placePrediction.placeId}`,
                label:
                  s.placePrediction.mainText?.text ??
                  s.placePrediction.text.text,
                detail: s.placePrediction.secondaryText?.text ?? '',
                prediction: s.placePrediction,
              },
            ]
          : []
      ),
    ]);
    setActiveIndex(-1);
    setIsOpen(true);
  }

  function handleChange(text: string) {
    setInput(text);
    setNotFound(false);
    clearTimeout(debounceRef.current);

    if (text.trim().length < MIN_CHARS) {
      requestRef.current++;
      setOptions([]);
      setIsOpen(false);
      return;
    }
    debounceRef.current = setTimeout(
      () => fetchOptions(text.trim()),
      DEBOUNCE_MS
    );
  }

  async function selectOption(option: Option) {
    setIsOpen(false);
    setInput(option.label);

    if (option.kind === 'point') {
      onPointSelect(option.point);
      return;
    }

    setIsLoading(true);
    try {
      const place = option.prediction.toPlace();
      await place.fetchFields({
        fields: ['location', 'viewport', 'formattedAddress'],
      });
      if (!place.location) {
        setNotFound(true);
        return;
      }
      onPlaceSelect({
        location: place.location.toJSON(),
        viewport: place.viewport?.toJSON(),
        label: place.formattedAddress ?? option.label,
      });
    } catch {
      setNotFound(true);
    } finally {
      sessionRef.current = undefined;
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearTimeout(debounceRef.current);

    const activeOption = options[activeIndex];
    if (isOpen && activeOption) {
      void selectOption(activeOption);
      return;
    }
    if (!input.trim()) return;

    setIsOpen(false);
    setIsLoading(true);
    const result = await geocode(input);
    setIsLoading(false);

    if (result) {
      onPlaceSelect({ ...result, label: result.formattedAddress });
    } else {
      setNotFound(true);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || options.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % options.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? options.length - 1 : i - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  function clear() {
    handleChange('');
  }

  const activeOption = options[activeIndex];

  return (
    <form onSubmit={handleSubmit} role="search" className="relative w-full">
      <label htmlFor={`${listId}-input`} className="sr-only">
        Buscar endereço, CEP, bairro ou ponto de coleta
      </label>
      <div className="relative flex items-center">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 h-4 w-4 text-slate-400"
        />
        <input
          id={`${listId}-input`}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={`${listId}-list`}
          aria-autocomplete="list"
          aria-activedescendant={
            activeOption ? `${listId}-${activeOption.id}` : undefined
          }
          autoComplete="off"
          placeholder="Endereço, CEP, bairro ou nome do ponto"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => options.length > 0 && setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          className="w-full rounded-full border border-slate-200 bg-white py-3 pr-28 pl-11 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-brand focus:outline-none"
        />
        {input && (
          <button
            type="button"
            onClick={clear}
            aria-label="Limpar busca"
            className="absolute right-24 rounded-full p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-1.5 inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Buscar
        </button>
      </div>

      {notFound && (
        <p role="status" className="mt-2 pl-4 text-xs text-red-600">
          Não encontramos esse endereço. Tente incluir a cidade.
        </p>
      )}

      {isOpen && options.length > 0 && (
        <ul
          id={`${listId}-list`}
          role="listbox"
          className="absolute z-20 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-slate-100 bg-white py-2 shadow-lg"
        >
          {options.map((option, index) => {
            const Icon = option.kind === 'point' ? Recycle : MapPin;
            return (
              <li
                key={option.id}
                id={`${listId}-${option.id}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  void selectOption(option);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  'flex cursor-pointer items-start gap-3 px-4 py-2.5',
                  index === activeIndex && 'bg-surface-alt'
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 rounded-full p-1.5',
                    option.kind === 'point'
                      ? 'bg-brand-light text-brand-muted'
                      : 'bg-slate-100 text-slate-500'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-900">
                    {option.label}
                  </span>
                  {option.detail && (
                    <span className="block truncate text-xs text-slate-500">
                      {option.detail}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </form>
  );
}
