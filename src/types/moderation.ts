export type UserBadgeType = 'verified' | 'level' | 'unverified';

export interface ModerationAuthor {
  name: string;
  avatarInitials: string;
  badgeText?: string;
  badgeType?: UserBadgeType;
  discardsCount?: number;
}

export type ItemStatus = 'pending' | 'approved' | 'hidden' | 'deleted';

export interface ModerationItem {
  id: string;
  author: ModerationAuthor;
  location: string;
  timestamp: string;
  rating?: number;
  categoryTag?: string;
  comment: string;
  infractions?: string[];
  infoBanner?: {
    type: 'constructive' | 'status';
    title: string;
    description: string;
  };
  cardType: 'critical' | 'constructive' | 'spam';
  status: ItemStatus;
}
