const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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
  owner_id: string;
  subscription_status: string;
  created_at: string;
  updated_at: string;
};

function getAuthToken() {
  return localStorage.getItem('alias_access_token');
}

export async function createRestaurant(
  payload: RestaurantCreate,
): Promise<RestaurantResponse> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/v1/restaurants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      typeof error?.detail === 'string'
        ? error.detail
        : JSON.stringify(error?.detail ?? 'Unable to create restaurant')
    );
  }

  return response.json();
}

export async function getRestaurants(): Promise<RestaurantResponse[]> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/v1/restaurants`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.detail ?? 'Unable to load restaurants');
  }

  return response.json();
}