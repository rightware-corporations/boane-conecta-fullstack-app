import { api } from '@/lib/api';
import type { ApiResponse } from '@/types';

import type {
  MunicipalService,
  ServiceAudience,
  ServiceAvailability,
  ServiceChannel,
} from '../types';

type RequirementDto = {
  id?: string;
  title?: string;
  description?: string | null;
  required?: boolean;
};

type FeeDto = {
  id?: string;
  title?: string;
  amount?: number | string;
  currency?: string;
};

type MunicipalServiceDto = {
  id?: string;
  departmentName?: string | null;
  title?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  processingTime?: string | null;
  status?: string;
  requirements?: RequirementDto[];
  fees?: FeeDto[];
  channels?: string[];
  channel?: string | null;
  audiences?: string[];
  audience?: string | null;
  documents?: string[];
  process?: string[];
  locations?: string[];
  legalReferences?: string[];
  faq?: Array<{ question?: string; answer?: string }>;
  keywords?: string[];
  synonyms?: string[];
};

const channelMap: Record<string, ServiceChannel> = {
  ONLINE: 'online',
  DIGITAL: 'online',
  IN_PERSON: 'in_person',
  PRESENCIAL: 'in_person',
  INFORMATIONAL: 'informational',
  INFORMATIVO: 'informational',
};

const audienceMap: Record<string, ServiceAudience> = {
  CITIZEN: 'citizen',
  MUNICIPE: 'citizen',
  BUSINESS: 'business',
  EMPRESA: 'business',
  INSTITUTION: 'institution',
  INSTITUICAO: 'institution',
  ALL: 'all',
  TODOS: 'all',
};

function uniqueValues<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function normalizeChannels(dto: MunicipalServiceDto): ServiceChannel[] {
  const source = [...(dto.channels || []), ...(dto.channel ? [dto.channel] : [])];
  return uniqueValues(source.map((value) => channelMap[value.toUpperCase()]).filter(Boolean));
}

function normalizeAudiences(dto: MunicipalServiceDto): ServiceAudience[] {
  const source = [...(dto.audiences || []), ...(dto.audience ? [dto.audience] : [])];
  return uniqueValues(source.map((value) => audienceMap[value.toUpperCase()]).filter(Boolean));
}

function normalizeAvailability(status?: string): {
  availability: ServiceAvailability;
  label: string;
} {
  switch (status?.toUpperCase()) {
    case 'SUSPENDED':
      return { availability: 'suspended', label: 'Temporariamente suspenso' };
    case 'UNAVAILABLE':
    case 'ARCHIVED':
      return { availability: 'unavailable', label: 'Indisponível' };
    default:
      return { availability: 'available', label: 'Disponível' };
  }
}

function stringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];
}

export function toMunicipalService(dto: MunicipalServiceDto): MunicipalService {
  const availability = normalizeAvailability(dto.status);
  const title = dto.title || dto.name || 'Serviço municipal';

  return {
    id: String(dto.id || dto.slug || title),
    slug: dto.slug || String(dto.id || ''),
    title,
    description: dto.description || null,
    category: dto.departmentName || 'Serviço municipal',
    processingTime: dto.processingTime || null,
    availability: availability.availability,
    availabilityLabel: availability.label,
    channels: normalizeChannels(dto),
    audiences: normalizeAudiences(dto),
    requirements: (dto.requirements || []).map((requirement, index) => ({
      id: String(requirement.id || `${dto.id || dto.slug}-requirement-${index}`),
      title: requirement.title || 'Requisito',
      description: requirement.description || null,
      required: requirement.required !== false,
    })),
    documents: stringList(dto.documents),
    process: stringList(dto.process),
    locations: stringList(dto.locations),
    legalReferences: stringList(dto.legalReferences),
    faq: (dto.faq || [])
      .filter((item) => item.question && item.answer)
      .map((item) => ({ question: item.question as string, answer: item.answer as string })),
    fees: (dto.fees || []).map((fee, index) => ({
      id: String(fee.id || `${dto.id || dto.slug}-fee-${index}`),
      title: fee.title || 'Taxa do serviço',
      amount: Number(fee.amount || 0),
      currency: fee.currency || 'MZN',
    })),
    keywords: uniqueValues([...(dto.keywords || []), ...(dto.synonyms || [])]),
  };
}

export async function getMunicipalServices(): Promise<MunicipalService[]> {
  const response = await api.get<ApiResponse<MunicipalServiceDto[]>>('/public/services');
  if (!response.success) {
    throw new Error(response.message || 'Não foi possível carregar os serviços.');
  }
  return (response.data || []).map(toMunicipalService);
}

export async function getMunicipalService(slug: string): Promise<MunicipalService> {
  const response = await api.get<ApiResponse<MunicipalServiceDto>>(`/public/services/${encodeURIComponent(slug)}`);
  if (!response.success || !response.data) {
    throw new Error(response.message || 'Serviço não encontrado.');
  }
  return toMunicipalService(response.data);
}
