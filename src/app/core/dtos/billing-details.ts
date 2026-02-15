export interface BillingDetails {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: {
    line1: string | null;
    city: string | null;
    postal_code: string | null;
    state: string | null;
    line2?: string | null;
    country: string | null;

  };
}
