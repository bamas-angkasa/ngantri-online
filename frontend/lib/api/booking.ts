import { apiRequest } from "@/lib/api/client";
import type { Booking, BookingStatus } from "@/lib/contracts";

export type CreateBookingInput = {
  branchId: string;
  serviceId: string;
  staffId?: string;
  customerName: string;
  customerEmail?: string;
  startTime: string;
  notes?: string;
};

export async function createBooking(input: CreateBookingInput) {
  const { branchId, ...body } = input;
  return apiRequest<Booking>(`/api/branches/${branchId}/bookings`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  return apiRequest<Booking>(`/api/bookings/${bookingId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function checkInBooking(bookingId: string) {
  return apiRequest(`/api/bookings/${bookingId}/check-in`, {
    method: "POST",
  });
}
