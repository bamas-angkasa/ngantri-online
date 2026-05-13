import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@/lib/api/client";
import type { AnalyticsOverview, Booking, Branch, BranchStaff, Business, QueueItem, Service, User } from "@/lib/contracts";

const demoBusiness: Business = {
  id: "10000000-0000-0000-0000-000000000001",
  ownerId: "00000000-0000-0000-0000-000000000001",
  name: "Barber Adi",
  slug: "barber-adi",
  description: "Barbershop lokal dengan antrean realtime dari Ngantri.",
  subscriptionPlan: "free",
  subscriptionStatus: "active",
};

const demoBranches: Branch[] = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    businessId: demoBusiness.id,
    name: "Barber Adi Sawojajar",
    slug: "sawojajar",
    address: "Sawojajar, Malang",
    phone: "+6281200000001",
    timezone: "Asia/Jakarta",
    isActive: true,
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    businessId: demoBusiness.id,
    name: "Barber Adi Sulfat",
    slug: "sulfat",
    address: "Sulfat, Malang",
    phone: "+6281200000002",
    timezone: "Asia/Jakarta",
    isActive: true,
  },
];

const demoStaff: BranchStaff[] = [
  { id: "s1", branchId: demoBranches[0].id, name: "Adi", roleLabel: "Capster", isAvailable: true },
  { id: "s2", branchId: demoBranches[0].id, name: "Raka", roleLabel: "Capster", isAvailable: true },
  { id: "s3", branchId: demoBranches[0].id, name: "Bima", roleLabel: "Capster", isAvailable: false },
];

const demoServices: Service[] = [
  { id: "svc1", businessId: demoBusiness.id, name: "Potong Rambut", durationMinutes: 20, price: 35000, isActive: true },
  { id: "svc2", businessId: demoBusiness.id, name: "Cukur Jenggot", durationMinutes: 10, price: 20000, isActive: true },
  { id: "svc3", businessId: demoBusiness.id, name: "Hair Wash", durationMinutes: 15, price: 15000, isActive: true },
  { id: "svc4", businessId: demoBusiness.id, name: "Coloring", durationMinutes: 90, price: 150000, isActive: true },
];

const demoQueues: QueueItem[] = [
  {
    id: "q1",
    businessId: demoBusiness.id,
    branchId: demoBranches[0].id,
    customerId: "c1",
    serviceId: "svc1",
    staffId: "s1",
    queueNumber: "A-01",
    source: "online",
    status: "serving",
    estimatedWaitMinutes: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "q2",
    businessId: demoBusiness.id,
    branchId: demoBranches[0].id,
    customerId: "c2",
    serviceId: "svc1",
    staffId: "s1",
    queueNumber: "A-04",
    source: "walk_in",
    status: "waiting",
    estimatedWaitMinutes: 20,
    createdAt: new Date().toISOString(),
  },
  {
    id: "q3",
    businessId: demoBusiness.id,
    branchId: demoBranches[0].id,
    customerId: "c3",
    serviceId: "svc2",
    staffId: "s2",
    queueNumber: "B-02",
    source: "online",
    status: "serving",
    estimatedWaitMinutes: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "q4",
    businessId: demoBusiness.id,
    branchId: demoBranches[0].id,
    customerId: "c4",
    serviceId: "svc3",
    staffId: "s2",
    queueNumber: "B-03",
    source: "online",
    status: "waiting",
    estimatedWaitMinutes: 15,
    createdAt: new Date().toISOString(),
  },
];

export const demoAnalytics: AnalyticsOverview = {
  totalQueuesToday: 28,
  currentlyWaiting: 7,
  currentlyServing: 2,
  completedToday: 19,
  noShowToday: 1,
  averageWaitMinutes: 18,
  busiestHour: "16.00",
  topService: "Potong Rambut",
};

export function useDemoPublicBusiness() {
  return useQuery({
    queryKey: ["demo-public-business"],
    queryFn: async () => ({
      business: demoBusiness,
      branches: demoBranches,
      staff: demoStaff,
      services: demoServices,
      queues: demoQueues,
    }),
  });
}

export function useDemoDashboard() {
  return useQuery({
    queryKey: ["demo-dashboard"],
    queryFn: async () => ({
      business: demoBusiness,
      branches: demoBranches,
      staff: demoStaff,
      services: demoServices,
      queues: demoQueues,
      analytics: demoAnalytics,
    }),
  });
}

export type PublicBusinessPayload = {
  business: Business;
  branches: Branch[];
  staff: BranchStaff[];
  services: Service[];
  queues: QueueItem[];
  analytics: AnalyticsOverview;
};

export type DashboardPayload = PublicBusinessPayload & {
  activeBranch: Branch;
  bookings: Booking[];
  qrUrl?: string;
};

export async function fetchPublicBusiness(businessSlug: string, branchSlug?: string) {
  const path = branchSlug ? `/api/public/${businessSlug}/${branchSlug}` : `/api/public/${businessSlug}`;
  return apiRequest<PublicBusinessPayload>(path);
}

export async function fetchDashboard() {
  const businesses = await apiRequest<Business[]>("/api/businesses/");
  const business = businesses[0];
  if (!business) {
    throw new Error("Belum ada bisnis.");
  }

  const branches = await apiRequest<Branch[]>(`/api/businesses/${business.id}/branches`);
  const activeBranch = branches[0];
  if (!activeBranch) {
    throw new Error("Belum ada cabang.");
  }

  const [staff, services, queues, bookings, analytics, qr] = await Promise.all([
    apiRequest<BranchStaff[]>(`/api/branches/${activeBranch.id}/staff`),
    apiRequest<Service[]>(`/api/businesses/${business.id}/services`),
    apiRequest<QueueItem[]>(`/api/branches/${activeBranch.id}/queues`),
    apiRequest<Booking[]>(`/api/branches/${activeBranch.id}/bookings`),
    apiRequest<AnalyticsOverview>(`/api/branches/${activeBranch.id}/analytics/overview`),
    apiRequest<{ url: string }>(`/api/branches/${activeBranch.id}/qr`).catch(() => undefined),
  ]);

  return {
    business,
    branches,
    activeBranch,
    staff,
    services,
    queues,
    bookings,
    analytics,
    qrUrl: qr?.url,
  };
}

export function usePublicBusiness(businessSlug: string, branchSlug?: string) {
  return useQuery({
    queryKey: ["public-business", businessSlug, branchSlug],
    queryFn: () => fetchPublicBusiness(businessSlug, branchSlug),
  });
}

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });
}

export async function fetchAdminData() {
  const [businesses, users] = await Promise.all([
    apiRequest<Business[]>("/api/admin/businesses"),
    apiRequest<User[]>("/api/admin/users"),
  ]);

  return { businesses, users };
}

export function useAdminData() {
  return useQuery({
    queryKey: ["admin"],
    queryFn: fetchAdminData,
  });
}
