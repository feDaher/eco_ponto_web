export type CategoryApprovalStatus = 'PENDING' | 'APPROVED';

export type CategoryDecision = 'APPROVED' | 'REJECTED';

export interface WasteCategoryOption {
  id: string;
  code: string;
  label: string;
}

export interface PointCategoryLink {
  categoryId: string;
  code: string;
  approvalStatus: CategoryApprovalStatus;
  isAccepting: boolean;
}

export interface CollectorPoint {
  id: string;
  name: string;
  status: string;
  categories: PointCategoryLink[];
}

export interface PendingCategoryRequest {
  pointId: string;
  pointName: string;
  categoryId: string;
  code: string;
}

export interface CategoryReviewEntry {
  id: string;
  categoryId: string;
  code: string;
  decision: CategoryDecision;
  reason: string | null;
  reviewedAt: string;
  reviewedBy: { id: string; name: string } | null;
}
