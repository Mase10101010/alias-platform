export type RestaurantCreate = {
  name: string;
  slug: string;
  business_type: string;
  phone?: string;
  email?: string;
  timezone: string;
  opening_hour: number;
  closing_hour: number;
  number_of_tables: number;
  concierge_tone: string;
};

export type RestaurantResponse = RestaurantCreate & {
  id: string;
  subscription_status: string;
  created_at: string;
  updated_at: string;
};

export async function createRestaurant(
  payload: RestaurantCreate,
): Promise<RestaurantResponse> {
  const response = await fetch('/api/v1/restaurants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? 'Unable to create restaurant');
  }

  return response.json();
}