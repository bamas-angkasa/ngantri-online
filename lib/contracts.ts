export type GlobalRole = "customer" | "super_admin";
export type BusinessRole = "owner" | "admin";
export type SubscriptionPlan = "free" | "pro" | "business";
export type SubscriptionStatus = "active" | "past_due" | "cancelled";
export type QueueSource = "walk_in" | "online";
export type QueueStatus =
  | "waiting"
  | "called"
  | "serving"
  | "completed"
  | "skipped"
  | "cancelled"
  | "no_show";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "serving"
  | "completed"
  | "cancelled"
  | "no_show";
export type NotificationEvent =
  | "queue_created"
  | "queue_almost_ready"
  | "queue_called"
  | "booking_confirmed"
  | "booking_cancelled";

export type ApiEnvelope<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roleGlobal: GlobalRole;
};

export type Business = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
};

export type Branch = {
  id: string;
  businessId: string;
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  timezone: string;
  isActive: boolean;
};

export type BranchStaff = {
  id: string;
  branchId: string;
  userId?: string;
  name: string;
  roleLabel: string;
  avatarUrl?: string;
  isAvailable: boolean;
};

export type Service = {
  id: string;
  businessId: string;
  branchId?: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price?: number;
  isActive: boolean;
};

export type QueueItem = {
  id: string;
  businessId: string;
  branchId: string;
  customerId: string;
  serviceId: string;
  staffId?: string;
  queueNumber: string;
  source: QueueSource;
  status: QueueStatus;
  estimatedWaitMinutes: number;
  createdAt: string;
};

export type Booking = {
  id: string;
  businessId: string;
  branchId: string;
  customerId: string;
  serviceId: string;
  staffId?: string;
  bookingCode: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  notes?: string;
};

export type AnalyticsOverview = {
  totalQueuesToday: number;
  currentlyWaiting: number;
  currentlyServing: number;
  completedToday: number;
  noShowToday: number;
  averageWaitMinutes: number;
  busiestHour: string;
  topService: string;
};
