'use client';

import { type FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Plus,
  Save,
  ShieldAlert,
} from 'lucide-react';
import { CollectionPointMapPreview } from '@/components/collector/CollectionPointMapPreview';
import { CollectionPointScheduleEditor } from '@/components/collector/CollectionPointScheduleEditor';
import { useAuth } from '@/context/AuthContext';
import {
  CollectionPointSettingsError,
  GetCollectionPointCategories,
  GetMyCollectionPoints,
  SaveCollectionPoint,
} from '@/services/CollectionPointSettings';
import type {
  CollectionPointCategory,
  CollectionPointConfiguration,
  CollectionPointSettingsInput,
  CollectionPointWeekday,
  CooperativeDetails,
} from '@/types/CollectionPointSettings';

type Direction = 'N' | 'S' | 'E' | 'W';
type CoordinateDraft = {
  degrees: string;
  minutes: string;
  seconds: string;
  direction: Direction;
};
type ScheduleEntry = CollectionPointSettingsInput['operatingHours'][number];
type FormDraft = {
  pointName: string;
  description: string;
  cooperativeName: string;
  cnpj: string;
  street: string;
  streetNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  email: string;
  whatsappContact: string;
  showWhatsappContact: boolean;
  latitude: CoordinateDraft;
  longitude: CoordinateDraft;
  wasteCategories: string[];
  operatingHours: ScheduleEntry[];
};

const WeekdayOrder: CollectionPointWeekday[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

const CategoryLabels: Record<string, string> = {
  PLASTIC: 'Plásticos',
  PAPER: 'Papéis e papelão',
  METALS: 'Metais',
  GLASS: 'Vidros',
  COOKING_OIL: 'Óleo de cozinha',
  ELECTRONICS: 'Eletrônicos',
  BATTERIES: 'Pilhas e baterias',
  CELL_PHONES: 'Celulares',
  COMPUTERS: 'Computadores',
  PRINTERS: 'Impressoras',
  TELEVISIONS: 'Televisores',
};

const BrazilianStates = [
  ['AC', 'Acre'],
  ['AL', 'Alagoas'],
  ['AP', 'Amapá'],
  ['AM', 'Amazonas'],
  ['BA', 'Bahia'],
  ['CE', 'Ceará'],
  ['DF', 'Distrito Federal'],
  ['ES', 'Espírito Santo'],
  ['GO', 'Goiás'],
  ['MA', 'Maranhão'],
  ['MT', 'Mato Grosso'],
  ['MS', 'Mato Grosso do Sul'],
  ['MG', 'Minas Gerais'],
  ['PA', 'Pará'],
  ['PB', 'Paraíba'],
  ['PR', 'Paraná'],
  ['PE', 'Pernambuco'],
  ['PI', 'Piauí'],
  ['RJ', 'Rio de Janeiro'],
  ['RN', 'Rio Grande do Norte'],
  ['RS', 'Rio Grande do Sul'],
  ['RO', 'Rondônia'],
  ['RR', 'Roraima'],
  ['SC', 'Santa Catarina'],
  ['SP', 'São Paulo'],
  ['SE', 'Sergipe'],
  ['TO', 'Tocantins'],
] as const;

const InputClass =
  'w-full rounded-lg border border-slate-300 bg-card px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:bg-surface disabled:text-slate-500';
const LabelClass = 'grid gap-1.5 text-sm font-medium text-slate-700';

function DecimalToCoordinate(
  value: number,
  positive: Direction,
  negative: Direction
) {
  const direction = value < 0 ? negative : positive;
  const absolute = Math.abs(value);
  let degrees = Math.floor(absolute);
  const minuteValue = (absolute - degrees) * 60;
  let minutes = Math.floor(minuteValue);
  let seconds = Number(((minuteValue - minutes) * 60).toFixed(2));
  if (seconds >= 60) {
    seconds = 0;
    minutes += 1;
  }
  if (minutes >= 60) {
    minutes = 0;
    degrees += 1;
  }
  return {
    degrees: String(degrees),
    minutes: String(minutes),
    seconds: seconds.toFixed(2),
    direction,
  };
}

function CoordinateToDecimal(
  value: CoordinateDraft,
  maximum: number
): number | null {
  const degrees = Number(value.degrees);
  const minutes = Number(value.minutes);
  const seconds = Number(value.seconds);
  if (
    value.degrees.trim() === '' ||
    value.minutes.trim() === '' ||
    value.seconds.trim() === '' ||
    !Number.isInteger(degrees) ||
    !Number.isInteger(minutes) ||
    !Number.isFinite(seconds) ||
    degrees < 0 ||
    degrees > maximum ||
    minutes < 0 ||
    minutes >= 60 ||
    seconds < 0 ||
    seconds >= 60 ||
    (degrees === maximum && (minutes > 0 || seconds > 0))
  ) {
    return null;
  }
  const absolute = degrees + minutes / 60 + seconds / 3600;
  return value.direction === 'S' || value.direction === 'W'
    ? -absolute
    : absolute;
}

function EmptyCoordinate(direction: Direction): CoordinateDraft {
  return { degrees: '', minutes: '', seconds: '', direction };
}

function GetCooperative(
  point?: CollectionPointConfiguration
): CooperativeDetails {
  return (
    point?.cooperative ?? {
      cooperativeName: '',
      cnpj: '',
      street: '',
      streetNumber: '',
      neighborhood: '',
      state: '',
      postalCode: '',
      email: '',
    }
  );
}

function CreateNewDraft(
  user: { name: string; email: string; city: string } | null,
  source?: CollectionPointConfiguration
): FormDraft {
  const cooperative = GetCooperative(source);
  return {
    pointName: '',
    description: '',
    cooperativeName: cooperative.cooperativeName || user?.name || '',
    cnpj: cooperative.cnpj,
    street: '',
    streetNumber: '',
    neighborhood: '',
    city: user?.city || '',
    state: '',
    postalCode: '',
    email: cooperative.email || user?.email || '',
    whatsappContact: source?.whatsappContact ?? '',
    showWhatsappContact: source?.showWhatsappContact ?? false,
    latitude: EmptyCoordinate('S'),
    longitude: EmptyCoordinate('W'),
    wasteCategories: [],
    operatingHours: [],
  };
}

function CreateDraftFromPoint(
  point: CollectionPointConfiguration,
  user: { name: string; email: string; city: string } | null
): FormDraft {
  const cooperative = GetCooperative(point);
  const [streetFromAddress = '', numberFromAddress = ''] = point.address
    .split(',')
    .map((part) => part.trim());
  return {
    pointName: point.name,
    description: point.description ?? '',
    cooperativeName: cooperative.cooperativeName || user?.name || '',
    cnpj: cooperative.cnpj,
    street: cooperative.street || streetFromAddress,
    streetNumber: cooperative.streetNumber || numberFromAddress,
    neighborhood: cooperative.neighborhood,
    city: point.city,
    state: cooperative.state,
    postalCode: cooperative.postalCode,
    email: cooperative.email || user?.email || '',
    whatsappContact: point.whatsappContact ?? '',
    showWhatsappContact: point.showWhatsappContact,
    latitude: DecimalToCoordinate(Number(point.latitude), 'N', 'S'),
    longitude: DecimalToCoordinate(Number(point.longitude), 'E', 'W'),
    wasteCategories: [...point.wasteCategories],
    operatingHours: point.hours
      .filter(({ isActive }) => isActive)
      .map(({ weekday, openTime, closeTime }) => ({
        weekday,
        openTime,
        closeTime,
      })),
  };
}

function FormatStatus(status: CollectionPointConfiguration['status']) {
  const labels = {
    PENDING: 'Aguardando análise da administração',
    APPROVED: 'Aprovado e publicado',
    REJECTED: 'Precisa de ajustes',
    INACTIVE: 'Inativo',
  };
  return labels[status];
}

function DaysSince(date: string) {
  const timestamp = Date.parse(date);
  if (Number.isNaN(timestamp)) return null;
  return Math.max(0, Math.floor((Date.now() - timestamp) / 86_400_000));
}

function CollectionPointSettings() {
  const { token, user } = useAuth();
  const [points, setPoints] = useState<CollectionPointConfiguration[]>([]);
  const [categories, setCategories] = useState<CollectionPointCategory[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<FormDraft>(() => CreateNewDraft(user));
  const [isEditing, setIsEditing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');

  const selectedPoint = points.find((point) => point.id === selectedId) ?? null;
  const latitude = useMemo(
    () => CoordinateToDecimal(draft.latitude, 90),
    [draft.latitude]
  );
  const longitude = useMemo(
    () => CoordinateToDecimal(draft.longitude, 180),
    [draft.longitude]
  );

  useEffect(() => {
    if (!token) return;
    let active = true;

    Promise.all([
      GetMyCollectionPoints(token),
      GetCollectionPointCategories(token),
    ])
      .then(([loadedPoints, loadedCategories]) => {
        if (!active) return;
        setPoints(loadedPoints);
        setCategories(loadedCategories);
        if (loadedPoints.length > 0) {
          setSelectedId(loadedPoints[0].id);
          setDraft(CreateDraftFromPoint(loadedPoints[0], user));
          setIsEditing(false);
        } else {
          setSelectedId(null);
          setDraft(CreateNewDraft(user));
          setIsEditing(true);
        }
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(
          error instanceof CollectionPointSettingsError
            ? error.message
            : 'Não foi possível carregar as configurações dos pontos.'
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, user]);

  function UpdateDraft<Key extends keyof FormDraft>(
    key: Key,
    value: FormDraft[Key]
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
    setFormError('');
    setNotice('');
  }

  function UpdateCoordinate(
    axis: 'latitude' | 'longitude',
    field: keyof CoordinateDraft,
    value: string
  ) {
    setDraft((current) => ({
      ...current,
      [axis]: { ...current[axis], [field]: value },
    }));
    setFormError('');
    setNotice('');
  }

  function SelectPoint(point: CollectionPointConfiguration) {
    setSelectedId(point.id);
    setDraft(CreateDraftFromPoint(point, user));
    setIsEditing(false);
    setFormError('');
    setNotice('');
  }

  function StartNewPoint() {
    setSelectedId(null);
    setDraft(CreateNewDraft(user, points[0]));
    setIsEditing(true);
    setFormError('');
    setNotice('');
  }

  function CancelChanges() {
    if (selectedPoint) {
      setDraft(CreateDraftFromPoint(selectedPoint, user));
      setIsEditing(false);
    } else {
      setDraft(CreateNewDraft(user, points[0]));
    }
    setFormError('');
    setNotice('');
  }

  function ToggleCategory(name: string, checked: boolean) {
    const updated = checked
      ? [...draft.wasteCategories, name]
      : draft.wasteCategories.filter((category) => category !== name);
    UpdateDraft('wasteCategories', updated);
  }

  async function SavePoint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setFormError('Sua sessão expirou. Entre novamente para continuar.');
      return;
    }
    if (latitude === null || longitude === null) {
      setFormError('Informe coordenadas válidas em graus, minutos e segundos.');
      return;
    }
    if (draft.wasteCategories.length === 0) {
      setFormError('Selecione pelo menos um material aceito pelo ponto.');
      return;
    }
    if (draft.operatingHours.length === 0) {
      setFormError('Informe ao menos um horário de funcionamento.');
      return;
    }
    if (
      draft.operatingHours.some(
        ({ openTime, closeTime }) =>
          !openTime || !closeTime || openTime >= closeTime
      )
    ) {
      setFormError(
        'Em cada intervalo, o horário de início deve ser anterior ao fim.'
      );
      return;
    }
    if (draft.showWhatsappContact && draft.whatsappContact.trim().length < 8) {
      setFormError('Informe um número de WhatsApp para exibi-lo publicamente.');
      return;
    }

    const input: CollectionPointSettingsInput = {
      name: draft.pointName.trim(),
      description: draft.description.trim() || undefined,
      city: draft.city.trim(),
      address: `${draft.street.trim()}, ${draft.streetNumber.trim()}`,
      latitude,
      longitude,
      whatsappContact: draft.whatsappContact.trim() || undefined,
      showWhatsappContact: draft.showWhatsappContact,
      wasteCategories: draft.wasteCategories,
      operatingHours: [...draft.operatingHours].sort(
        (left, right) =>
          WeekdayOrder.indexOf(left.weekday) -
            WeekdayOrder.indexOf(right.weekday) ||
          left.openTime.localeCompare(right.openTime)
      ),
      cooperative: {
        cooperativeName: draft.cooperativeName.trim(),
        cnpj: draft.cnpj.trim(),
        street: draft.street.trim(),
        streetNumber: draft.streetNumber.trim(),
        neighborhood: draft.neighborhood.trim(),
        state: draft.state.trim().toUpperCase(),
        postalCode: draft.postalCode.trim(),
        email: draft.email.trim(),
      },
    };

    setIsSaving(true);
    setFormError('');
    setNotice('');
    try {
      const saved = await SaveCollectionPoint(
        token,
        input,
        selectedId ?? undefined
      );
      const updatedPoints = selectedId
        ? points.map((point) =>
            point.id === saved.id
              ? saved
              : { ...point, cooperative: saved.cooperative }
          )
        : [
            saved,
            ...points.map((point) => ({
              ...point,
              cooperative: saved.cooperative,
            })),
          ];
      const savedPoint = saved;
      setPoints(updatedPoints);
      setSelectedId(savedPoint.id);
      setDraft(CreateDraftFromPoint(savedPoint, user));
      setIsEditing(false);
      setNotice(
        selectedId
          ? 'Alterações enviadas para nova análise da administração.'
          : 'Solicitação enviada. O ponto será exibido após aprovação da administração.'
      );
    } catch (error) {
      setFormError(
        error instanceof CollectionPointSettingsError
          ? error.message
          : 'Não foi possível salvar as informações. Tente novamente.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div
        role="status"
        className="flex min-h-56 items-center justify-center gap-2 text-sm text-slate-500"
      >
        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        Carregando configurações...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
        <p role="alert">{loadError}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 font-semibold underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <section className="min-w-0 space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-wider text-brand uppercase">
                Configuração geral do ponto
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Ponto de coleta e cooperativa
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Cadastre os dados reais da cooperativa, localização, horários e
                materiais aceitos. Novos pontos e alterações passam por
                aprovação da administração.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedPoint && !isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg border border-brand px-3 py-2 text-sm font-semibold text-brand hover:bg-brand-light"
                >
                  Modificar ponto
                </button>
              )}
              {isEditing && (
                <button
                  type="button"
                  onClick={StartNewPoint}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
                >
                  <Plus aria-hidden="true" className="size-4" />
                  Novo ponto
                </button>
              )}
            </div>
          </div>

          {selectedPoint && (
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-surface px-3 py-2.5 text-sm">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  selectedPoint.status === 'APPROVED'
                    ? 'bg-green-100 text-green-800'
                    : selectedPoint.status === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-900'
                }`}
              >
                {FormatStatus(selectedPoint.status)}
              </span>
              {selectedPoint.rejectionReason && (
                <span className="text-red-700">
                  {selectedPoint.rejectionReason}
                </span>
              )}
              <span className="ml-auto inline-flex items-center gap-1 text-xs text-slate-500">
                <Clock3 aria-hidden="true" className="size-3.5" />
                {(() => {
                  const days = DaysSince(selectedPoint.hoursConfirmedAt);
                  return days === null
                    ? 'Atualização sem data'
                    : `Horários confirmados há ${days} ${days === 1 ? 'dia' : 'dias'}`;
                })()}
                {selectedPoint.isOutdated && ' · precisa confirmar'}
              </span>
            </div>
          )}

          {notice && (
            <p
              role="status"
              className="mt-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800"
            >
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
              {notice}
            </p>
          )}
          {formError && (
            <p
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            >
              <ShieldAlert
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
              {formError}
            </p>
          )}

          <form onSubmit={SavePoint} className="mt-5 space-y-7">
            <fieldset disabled={!isEditing || isSaving} className="space-y-7">
              <section
                aria-labelledby="cooperative-heading"
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Building2 aria-hidden="true" className="size-4 text-brand" />
                  <h3
                    id="cooperative-heading"
                    className="font-bold text-slate-900"
                  >
                    Dados da cooperativa
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={LabelClass}>
                    Nome da cooperativa
                    <input
                      required
                      maxLength={191}
                      value={draft.cooperativeName}
                      onChange={(event) =>
                        UpdateDraft('cooperativeName', event.target.value)
                      }
                      className={InputClass}
                    />
                  </label>
                  <label className={LabelClass}>
                    CNPJ
                    <input
                      required
                      maxLength={18}
                      autoCapitalize="characters"
                      placeholder="00.000.000/0000-00"
                      value={draft.cnpj}
                      onChange={(event) =>
                        UpdateDraft('cnpj', event.target.value.toUpperCase())
                      }
                      className={InputClass}
                    />
                  </label>
                  <label className={LabelClass}>
                    E-mail da cooperativa
                    <input
                      required
                      type="email"
                      maxLength={254}
                      value={draft.email}
                      onChange={(event) =>
                        UpdateDraft('email', event.target.value)
                      }
                      className={InputClass}
                    />
                  </label>
                  <label className={LabelClass}>
                    Telefone / WhatsApp
                    <input
                      type="tel"
                      maxLength={20}
                      value={draft.whatsappContact}
                      onChange={(event) =>
                        UpdateDraft('whatsappContact', event.target.value)
                      }
                      className={InputClass}
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={draft.showWhatsappContact}
                      onChange={(event) =>
                        UpdateDraft('showWhatsappContact', event.target.checked)
                      }
                      className="size-4 accent-brand"
                    />
                    Exibir este telefone publicamente no ponto de coleta
                  </label>
                </div>
              </section>

              <section aria-labelledby="address-heading" className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin aria-hidden="true" className="size-4 text-brand" />
                  <h3 id="address-heading" className="font-bold text-slate-900">
                    Endereço e localização
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <label className={`${LabelClass} sm:col-span-2`}>
                    Avenida / rua
                    <input
                      required
                      maxLength={150}
                      value={draft.street}
                      onChange={(event) =>
                        UpdateDraft('street', event.target.value)
                      }
                      className={InputClass}
                    />
                  </label>
                  <label className={LabelClass}>
                    Número
                    <input
                      required
                      maxLength={20}
                      value={draft.streetNumber}
                      onChange={(event) =>
                        UpdateDraft('streetNumber', event.target.value)
                      }
                      className={InputClass}
                    />
                  </label>
                  <label className={LabelClass}>
                    Bairro
                    <input
                      required
                      maxLength={191}
                      value={draft.neighborhood}
                      onChange={(event) =>
                        UpdateDraft('neighborhood', event.target.value)
                      }
                      className={InputClass}
                    />
                  </label>
                  <label className={LabelClass}>
                    Município
                    <input
                      required
                      maxLength={100}
                      value={draft.city}
                      onChange={(event) =>
                        UpdateDraft('city', event.target.value)
                      }
                      className={InputClass}
                    />
                  </label>
                  <label className={LabelClass}>
                    UF
                    <select
                      required
                      value={draft.state}
                      onChange={(event) =>
                        UpdateDraft('state', event.target.value)
                      }
                      className={InputClass}
                    >
                      <option value="">Selecione</option>
                      {BrazilianStates.map(([code, name]) => (
                        <option key={code} value={code}>
                          {code} — {name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={LabelClass}>
                    CEP
                    <input
                      required
                      maxLength={9}
                      placeholder="00000-000"
                      value={draft.postalCode}
                      onChange={(event) =>
                        UpdateDraft('postalCode', event.target.value)
                      }
                      className={InputClass}
                    />
                  </label>
                </div>

                <div className="rounded-xl border border-slate-200 bg-surface p-4">
                  <p className="mb-1 text-sm font-semibold text-slate-800">
                    Coordenadas geográficas
                  </p>
                  <p className="mb-3 text-xs text-slate-500">
                    Informe graus, minutos e segundos. A prévia do mapa
                    acompanha as coordenadas.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <CoordinateFields
                      label="Latitude"
                      value={draft.latitude}
                      directions={['N', 'S']}
                      onChange={(field, value) =>
                        UpdateCoordinate('latitude', field, value)
                      }
                    />
                    <CoordinateFields
                      label="Longitude"
                      value={draft.longitude}
                      directions={['E', 'W']}
                      onChange={(field, value) =>
                        UpdateCoordinate('longitude', field, value)
                      }
                    />
                  </div>
                  <div className="mt-4">
                    <CollectionPointMapPreview
                      latitude={latitude}
                      longitude={longitude}
                    />
                  </div>
                </div>
              </section>

              <section aria-labelledby="point-heading" className="space-y-3">
                <h3 id="point-heading" className="font-bold text-slate-900">
                  Informações do ponto
                </h3>
                <label className={LabelClass}>
                  Nome do ponto de coleta
                  <input
                    required
                    maxLength={191}
                    value={draft.pointName}
                    onChange={(event) =>
                      UpdateDraft('pointName', event.target.value)
                    }
                    className={InputClass}
                  />
                </label>
                <label className={LabelClass}>
                  Descrição e orientações para a coleta
                  <textarea
                    rows={3}
                    maxLength={2000}
                    placeholder="Informe regras, restrições ou orientações úteis para quem vai levar materiais."
                    value={draft.description}
                    onChange={(event) =>
                      UpdateDraft('description', event.target.value)
                    }
                    className={InputClass}
                  />
                </label>
              </section>

              <section
                aria-labelledby="materials-heading"
                className="space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3
                    id="materials-heading"
                    className="font-bold text-slate-900"
                  >
                    Materiais aceitos
                  </h3>
                  <span className="text-xs text-slate-500">
                    Selecione todos os materiais recebidos
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-start gap-2 rounded-xl border border-slate-200 bg-surface p-3 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={draft.wasteCategories.includes(category.name)}
                        onChange={(event) =>
                          ToggleCategory(category.name, event.target.checked)
                        }
                        className="mt-0.5 size-4 accent-brand"
                      />
                      <span>
                        <span className="block font-semibold">
                          {CategoryLabels[category.name] ??
                            category.description ??
                            category.name}
                        </span>
                        {category.description &&
                          category.description !==
                            CategoryLabels[category.name] && (
                            <span className="mt-0.5 block text-xs text-slate-500">
                              {category.description}
                            </span>
                          )}
                      </span>
                    </label>
                  ))}
                </div>
                {categories.length === 0 && (
                  <p className="text-sm text-amber-800">
                    Não há materiais ativos para selecionar. Peça à
                    administração para cadastrar categorias.
                  </p>
                )}
              </section>

              <section aria-labelledby="hours-heading" className="space-y-3">
                <div>
                  <h3 id="hours-heading" className="font-bold text-slate-900">
                    Horários de funcionamento
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Marque os dias abertos e informe um ou mais intervalos por
                    dia.
                  </p>
                </div>
                <CollectionPointScheduleEditor
                  value={draft.operatingHours}
                  onChange={(value) => UpdateDraft('operatingHours', value)}
                />
              </section>
            </fieldset>

            {isEditing && (
              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={CancelChanges}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-surface disabled:opacity-50"
                >
                  Cancelar alterações
                </button>
                <button
                  type="submit"
                  disabled={isSaving || categories.length === 0}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2
                      aria-hidden="true"
                      className="size-4 animate-spin"
                    />
                  ) : (
                    <Save aria-hidden="true" className="size-4" />
                  )}
                  {isSaving
                    ? 'Enviando...'
                    : selectedPoint
                      ? 'Confirmar alterações'
                      : 'Enviar solicitação'}
                </button>
              </div>
            )}
          </form>
        </div>
      </section>

      <aside className="space-y-4 xl:sticky xl:top-24">
        <section className="rounded-2xl border border-slate-200 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-slate-900">Meus pontos</h2>
              <p className="mt-1 text-xs text-slate-500">
                Prévia dos pontos cadastrados pela cooperativa
              </p>
            </div>
            <span className="rounded-full bg-brand-light px-2.5 py-1 text-xs font-bold text-brand-dark">
              {points.length}
            </span>
          </div>

          {points.length === 0 ? (
            <p className="mt-4 rounded-xl bg-surface p-3 text-sm text-slate-600">
              Ainda não há pontos cadastrados. Preencha o formulário para enviar
              a primeira solicitação.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {points.map((point) => (
                <li key={point.id}>
                  <button
                    type="button"
                    onClick={() => SelectPoint(point)}
                    aria-current={selectedId === point.id ? 'true' : undefined}
                    className={`w-full rounded-xl border p-3 text-left transition-colors ${
                      selectedId === point.id
                        ? 'border-brand bg-brand-light/50'
                        : 'border-slate-200 bg-surface hover:border-brand/50'
                    }`}
                  >
                    <span className="block font-semibold text-slate-800">
                      {point.name}
                    </span>
                    <span className="mt-1 block text-xs text-slate-600">
                      {point.cooperative?.street
                        ? `${point.cooperative.street}, ${point.cooperative.streetNumber} · `
                        : ''}
                      {point.city}
                    </span>
                    <span className="mt-2 inline-flex rounded-full bg-card px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {FormatStatus(point.status)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {points.length > 0 && !isEditing && (
            <button
              type="button"
              onClick={StartNewPoint}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand px-3 py-2 text-sm font-semibold text-brand hover:bg-brand-light"
            >
              <Plus aria-hidden="true" className="size-4" />
              Adicionar outro ponto
            </button>
          )}
        </section>

        <section className="rounded-2xl border border-brand/20 bg-brand-light/40 p-4 text-sm text-slate-700">
          <h2 className="font-bold text-brand-dark">
            Como funciona a aprovação
          </h2>
          <p className="mt-1 text-xs leading-5">
            O novo cadastro ou qualquer alteração fica pendente de revisão.
            Depois da aprovação, as informações atualizadas aparecem para os
            cidadãos.
          </p>
        </section>
      </aside>
    </div>
  );
}

function CoordinateFields({
  label,
  value,
  directions,
  onChange,
}: {
  label: string;
  value: CoordinateDraft;
  directions: [Direction, Direction];
  onChange: (field: keyof CoordinateDraft, value: string) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-semibold text-slate-700">{label}</legend>
      <div className="grid grid-cols-[1fr_1fr_1.2fr_auto] items-end gap-2">
        <label className={LabelClass}>
          Graus
          <input
            type="number"
            min="0"
            step="1"
            value={value.degrees}
            onChange={(event) => onChange('degrees', event.target.value)}
            className={InputClass}
            aria-label={`${label}: graus`}
          />
        </label>
        <label className={LabelClass}>
          Minutos
          <input
            type="number"
            min="0"
            max="59"
            step="1"
            value={value.minutes}
            onChange={(event) => onChange('minutes', event.target.value)}
            className={InputClass}
            aria-label={`${label}: minutos`}
          />
        </label>
        <label className={LabelClass}>
          Segundos
          <input
            type="number"
            min="0"
            max="59.99"
            step="0.01"
            value={value.seconds}
            onChange={(event) => onChange('seconds', event.target.value)}
            className={InputClass}
            aria-label={`${label}: segundos`}
          />
        </label>
        <label className={LabelClass}>
          Direção
          <select
            value={value.direction}
            onChange={(event) => onChange('direction', event.target.value)}
            className={InputClass}
            aria-label={`${label}: direção`}
          >
            {directions.map((direction) => (
              <option key={direction} value={direction}>
                {direction}
              </option>
            ))}
          </select>
        </label>
      </div>
    </fieldset>
  );
}

export { CollectionPointSettings };
