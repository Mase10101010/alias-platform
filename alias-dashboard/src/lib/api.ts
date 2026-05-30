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