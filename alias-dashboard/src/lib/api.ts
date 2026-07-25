const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export type TableSetup = {
  count: number;
  seats: number;
};

export type WeeklyScheduleItem = {
  day: string;
  is_open?: boolean;
  isOpen?: boolean;
  opening_hour?: string;
  openingHour?: string;
  closing_hour?: string;
  closingHour?: string;
};

export type SpecialClosure = {
  id?: number | string;
  date: string;
  reason: string;
};

export type RestaurantCreate = {
  name: string;
  slug: string;
  business_type: string;
  phone?: string;
  email?: string;
  preferred_language?: string;
  timezone: string;
  opening_hour: number;
  closing_hour: number;
  number_of_tables: number;
  table_setup?: TableSetup[];
  weekly_schedule?: WeeklyScheduleItem[];
  special_closures?: SpecialClosure[];
  concierge_tone: string;
};

export type RestaurantResponse = RestaurantCreate & {
  id: string;
  owner_id: string;
  subscription_status: string;
  created_at: string;
  updated_at: string;
};

export type ReservationCreate = {
  restaurant_id?: string;
  table_id?: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  party_size: number;
  reservation_time: string;
  special_requests?: string;
  duration_minutes?: number;
};

export type ReservationResponse = ReservationCreate & {
  id: string;
  duration_minutes: number;
  status: string;
  session_id?: string | null;
  created_at: string;
  updated_at: string;
  table_id: string | null;
  table_number: string | null;
  table_code: string | null;
};

function getAuthToken() {
  return localStorage.getItem('alias_access_token');
}

async function parseApiError(response: Response, fallback: string) {
  const error = await response.json().catch(() => null);

  return new Error(
    typeof error?.detail === 'string'
      ? error.detail
      : JSON.stringify(error?.detail ?? fallback),
  );
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
    throw await parseApiError(response, 'Unable to create restaurant');
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
    throw await parseApiError(response, 'Unable to load restaurants');
  }

  return response.json();
}

export async function getPublicRestaurant(
  slug: string,
): Promise<RestaurantResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/public/${slug}`,
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to load public restaurant',
    );
  }

  return response.json();
}

export async function updateRestaurant(
  restaurantId: string,
  payload: Partial<RestaurantCreate>,
): Promise<RestaurantResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw await parseApiError(response, 'Unable to update restaurant');
  }

  return response.json();
}

export async function getReservations(): Promise<ReservationResponse[]> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/v1/reservations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Unable to load reservations');
  }

  return response.json();
}

export async function createReservation(
  payload: ReservationCreate,
): Promise<ReservationResponse> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/v1/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Unable to create reservation');
  }

  return response.json();
}

export type ChatResponse = {
  session_id: string;
  reply: string;
  reservation_id?: string | null;
};

export async function sendChatMessage(
  message: string,
  sessionId?: string | null,
  restaurantId?: string | null,
): Promise<ChatResponse> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      restaurant_id: restaurantId ?? null,
      session_id: sessionId ?? null,
      message,
    }),
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Unable to send chat message');
  }

  return response.json();
}
export async function sendPublicChatMessage(
  restaurantSlug: string,
  message: string,
  sessionId?: string | null,
): Promise<ChatResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/chat/public/${restaurantSlug}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId ?? null,
        message,
      }),
    },
  );

  if (!response.ok) {
    throw await parseApiError(response, 'Unable to send public chat message');
  }

  return response.json();
}

export type ConversationMessage = {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  created_at: string;
};

export type ConversationHistoryResponse = {
  session_id: string;
  customer_name?: string | null;
  messages: ConversationMessage[];
};

export async function getConversationHistory(
  sessionId: string,
): Promise<ConversationHistoryResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/chat/${sessionId}/history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw await parseApiError(response, 'Unable to load conversation history');
  }

  return response.json();
}

export type MessageResponse = {
  message: string;
};

export async function forgotPassword(
  email: string,
): Promise<MessageResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Unable to request password reset');
  }

  return response.json();
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<MessageResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      new_password: newPassword,
    }),
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Unable to reset password');
  }

  return response.json();
}

export async function verifyEmail(
  token: string,
): Promise<MessageResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`,
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to verify email',
    );
  }

  return response.json();
}

export async function sendVerificationEmail(
  language: string = 'en',
): Promise<MessageResponse> {
  const token = localStorage.getItem('alias_access_token');

  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/send-verification-email`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        language,
      }),
    },
  );

  if (!response.ok) {
    throw await parseApiError(response, 'Unable to send verification email');
  }

  return response.json();
}

export type ServiceAreaType =
  | 'indoor'
  | 'outdoor'
  | 'terrace'
  | 'garden'
  | 'bar'
  | 'private'
  | 'rooftop'
  | 'other';

export type ServiceAreaResponse = {
  id: string;
  restaurant_id: string;
  name: string;
  area_type: ServiceAreaType;
  color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ServiceAreaCreate = {
  name: string;
  area_type?: ServiceAreaType;
  color?: string;
  sort_order?: number;
};

export type ServiceAreaUpdate = {
  name?: string;
  area_type?: ServiceAreaType;
  color?: string;
  sort_order?: number;
  is_active?: boolean;
};

export type FloorPlanResponse = {
  id: string;
  service_area_id: string;
  name: string;
  width: number;
  height: number;
  sort_order: number;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type FloorPlanCreate = {
  name?: string;
  width?: number;
  height?: number;
  sort_order?: number;
  is_default?: boolean;
};

export type FloorPlanUpdate = {
  name?: string;
  width?: number;
  height?: number;
  sort_order?: number;
  is_default?: boolean;
  is_active?: boolean;
};

export type TableShape = 'square' | 'round' | 'rectangle';

export type TableCreate = {
  floor_plan_id: string;
  table_number: string;
  seats: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  shape?: TableShape;
  rotation?: number;
};

export type TableUpdate = {
  floor_plan_id?: string;
  table_number?: string;
  seats?: number;
  is_active?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  shape?: TableShape;
  rotation?: number;
};

export type TableResponse = {
  id: string;
  floor_plan_id: string;
  restaurant_id: string;
  table_code: string;
  table_number: string;
  seats: number;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: TableShape;
  rotation: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TablePlacementUpdate = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  is_visible?: boolean;
};

export type TablePlacementResponse = {
  id: string;
  floor_plan_id: string;
  table_id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  is_visible: boolean;
};

export async function getServiceAreas(
  restaurantId: string,
  includeInactive = false,
): Promise<ServiceAreaResponse[]> {
  const token = getAuthToken();

  const query = new URLSearchParams({
    include_inactive: String(includeInactive),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/service-areas?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to load service areas',
    );
  }

  return response.json();
}

export async function createServiceArea(
  restaurantId: string,
  payload: ServiceAreaCreate,
): Promise<ServiceAreaResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/service-areas`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to create service area',
    );
  }

  return response.json();
}

export async function updateServiceArea(
  restaurantId: string,
  areaId: string,
  payload: ServiceAreaUpdate,
): Promise<ServiceAreaResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/service-areas/${areaId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to update service area',
    );
  }

  return response.json();
}

export async function deactivateServiceArea(
  restaurantId: string,
  areaId: string,
): Promise<ServiceAreaResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/service-areas/${areaId}/deactivate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to deactivate service area',
    );
  }

  return response.json();

}

export async function getFloorPlans(
  restaurantId: string,
  areaId: string,
): Promise<FloorPlanResponse[]> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/service-areas/${areaId}/floor-plans`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to load floor plans',
    );
  }

  return response.json();
}

export async function createFloorPlan(
  restaurantId: string,
  areaId: string,
  payload: FloorPlanCreate,
): Promise<FloorPlanResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/service-areas/${areaId}/floor-plans`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to create floor plan',
    );
  }

  return response.json();
}

export async function updateFloorPlan(
  restaurantId: string,
  areaId: string,
  floorPlanId: string,
  payload: FloorPlanUpdate,
): Promise<FloorPlanResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/service-areas/${areaId}/floor-plans/${floorPlanId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to update floor plan',
    );
  }

  return response.json();
}

export async function deactivateFloorPlan(
  restaurantId: string,
  areaId: string,
  floorPlanId: string,
): Promise<FloorPlanResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/service-areas/${areaId}/floor-plans/${floorPlanId}/deactivate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to deactivate floor plan',
    );
  }

  return response.json();
}
export async function getTables(
  restaurantId: string,
  floorPlanId?: string | null,
): Promise<TableResponse[]> {
  const token = getAuthToken();

  const query = new URLSearchParams();

  if (floorPlanId) {
    query.set('floor_plan_id', floorPlanId);
  }

  const queryString = query.toString();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/tables${
      queryString ? `?${queryString}` : ''
    }`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to load tables',
    );
  }

  return response.json();
}

export async function createTable(
  restaurantId: string,
  payload: TableCreate,
): Promise<TableResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/tables`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw await parseApiError(response, 'Unable to create table');
  }

  return response.json();
}

export async function updateTable(
  restaurantId: string,
  tableId: string,
  payload: TableUpdate,
): Promise<TableResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/tables/${tableId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw await parseApiError(response, 'Unable to update table');
  }

  return response.json();
}

export async function updateTablePlacement(
  restaurantId: string,
  floorPlanId: string,
  tableId: string,
  payload: TablePlacementUpdate,
): Promise<TablePlacementResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/floor-plans/${floorPlanId}/tables/${tableId}/placement`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to update table placement',
    );
  }

  return response.json();
}

export async function deleteTable(
  restaurantId: string,
  tableId: string,
): Promise<void> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/tables/${tableId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw await parseApiError(response, 'Unable to delete table');
  }
}

export type BillingStatusResponse = {
  user_id: string;
  email: string;
  subscription_status: string;
  has_used_trial: boolean;
  trial_start_date?: string | null;
  trial_end_date?: string | null;
  subscription_start_date?: string | null;
  subscription_end_date?: string | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
};

export async function getBillingStatus(): Promise<BillingStatusResponse> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/v1/billing/status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Unable to load billing status');
  }

  return response.json();
}

export async function createCheckoutSession(): Promise<{ checkout_url: string; session_id: string }> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/v1/billing/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      success_url: `${window.location.origin}`,
      cancel_url: `${window.location.origin}`,
    }),
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Unable to create checkout session');
  }

  return response.json();
}

export async function createCustomerPortal(): Promise<{ portal_url: string }> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/v1/billing/customer-portal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      return_url: `${window.location.origin}/settings`,
    }),
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Unable to open customer portal');
  }

  return response.json();
}