import { createContext, useContext } from "react";

export interface BookingApi {
  /** Open the booking dialog. `source` says which button was pressed. */
  open: (source?: string) => void;
}

export const BookingContext = createContext<BookingApi>({ open: () => {} });

export function useBooking() {
  return useContext(BookingContext);
}
