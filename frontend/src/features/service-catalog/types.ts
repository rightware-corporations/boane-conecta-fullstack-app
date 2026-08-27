export type ServiceAvailability = 'available' | 'suspended' | 'unavailable';

export type ServiceChannel = 'online' | 'in_person' | 'informational';

export type ServiceAudience = 'citizen' | 'business' | 'institution' | 'all';

export type ServiceRequirement = {
  id: string;
  title: string;
  description: string | null;
  required: boolean;
};

export type ServiceFee = {
  id: string;
  title: string;
  amount: number;
  currency: string;
};

export type MunicipalService = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  processingTime: string | null;
  availability: ServiceAvailability;
  availabilityLabel: string;
  channels: ServiceChannel[];
  audiences: ServiceAudience[];
  requirements: ServiceRequirement[];
  documents: string[];
  process: string[];
  locations: string[];
  legalReferences: string[];
  faq: Array<{ question: string; answer: string }>;
  fees: ServiceFee[];
  keywords: string[];
};

export type ServiceCatalogFilters = {
  search: string;
  category: string;
  channel: string;
  audience: string;
  availability: string;
};
