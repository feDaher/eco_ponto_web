export type DisposalCategoryTotal = {
  name: string;
  weightKg: number;
  disposals: number;
};

export type DisposalSummary = {
  totalDisposals: number;
  totalWeightKg: number;
  totalPoints: number;
  byCategory: DisposalCategoryTotal[];
};
