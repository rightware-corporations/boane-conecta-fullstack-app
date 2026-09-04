export type MunicipalServiceStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type MunicipalServiceRequirementResponse = {
  id: string;
  serviceId: string;
  title: string;
  description: string | null;
  required: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MunicipalServiceFeeResponse = {
  id: string;
  serviceId: string;
  title: string;
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
};

export type MunicipalServiceResponse = {
  id: string;
  departmentId: string | null;
  departmentName: string | null;
  title: string;
  slug: string;
  description: string | null;
  processingTime: string | null;
  status: MunicipalServiceStatus;
  requirements: MunicipalServiceRequirementResponse[];
  fees: MunicipalServiceFeeResponse[];
  createdAt: string;
  updatedAt: string;
};

export type AdminServiceRequirement = {
  id: string;
  title: string;
  description: string | null;
  required: boolean;
};

export type AdminServiceFee = {
  id: string;
  title: string;
  amount: number;
  currency: string;
};

export type AdminService = {
  id: string;
  departmentName: string | null;
  title: string;
  slug: string;
  description: string | null;
  processingTime: string | null;
  status: MunicipalServiceStatus;
  statusLabel: string;
  requirements: AdminServiceRequirement[];
  fees: AdminServiceFee[];
  updatedAt: string;
};
