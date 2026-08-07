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
  onboarding_completed?: boolean;
};

export type RestaurantResponse = RestaurantCreate & {
  id: string;
  owner_id: string;
  subscription_status: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
  
};

export type IntelligenceInsight = {
  code: string;
  title: string;
  description: string;
  confidence: 'low' | 'medium' | 'high';
  evidence_count: number;
  value: string | number | boolean | null;
};

export type IntelligenceLearningSnapshot = {
  suggestions_observed: number;
  suggestions_read: number;
  suggestions_accepted: number;
  suggestions_dismissed: number;
  suggestions_expired: number;
  manager_decisions: number;
  acceptance_rate: number;
  dismissal_rate: number;
  read_rate: number;
  confidence_score: number;
  profile_version: number;
  last_processed_event_at: string | null;
};

export type IntelligenceBehaviourSnapshot = {
  restaurant_id: string;
  trust_level: string;
  preferred_plan: string;
  accepted_score_reference: number | null;
  average_moves_accepted: number | null;
  average_seat_waste_accepted: number | null;
  total_suggestions_observed: number;
  total_manager_decisions: number;
  confidence: 'low' | 'medium' | 'high';
  insights: IntelligenceInsight[];
  generated_at: string;
};

export type IntelligencePolicySnapshot = {
  restaurant_id: string;
  move_penalty_weight: number;
  seat_waste_penalty_weight: number;
  score_weight: number;
  single_move_bonus: number;
  low_seat_waste_bonus: number;
  minimum_recommended_score: number | null;
  maximum_preferred_moves: number | null;
  maximum_preferred_seat_waste: number | null;
  automation_level:
    | 'advisory_only'
    | 'assisted'
    | 'eligible_for_automation';
  rationale: string[];
  generated_at: string;
};

export type IntelligenceSnapshotResponse = {
  restaurant_id: string;
  learning: IntelligenceLearningSnapshot;
  behaviour: IntelligenceBehaviourSnapshot;
  policy: IntelligencePolicySnapshot | null;
  generated_at: string;
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
  status: ReservationStatus;
  session_id?: string | null;
  created_at: string;
  updated_at: string;
  table_id: string | null;
  table_number: string | null;
  table_code: string | null;
  table_ids?: string[];
  table_numbers?: string[];
};

export type IntelligenceOptimizeRequest = {
  restaurant_id: string;
  requested_start: string;
  party_size: number;
  reservation_id?: string | null;
  duration_minutes?: number;
  buffer_before_minutes?: number;
  buffer_after_minutes?: number;
  preferred_service_area_id?: string | null;
  max_alternatives?: number;
};

export type IntelligenceAssignmentResponse = {
  table_ids: string[];
  table_numbers: string[];
  start_at: string;
  end_at: string;
  capacity: number;
  score: number;
  seat_waste: number;
  fragmentation_minutes: number;
  explanation: string;
};

export type IntelligenceOptimizeResponse = {
  available: boolean;
  recommended: IntelligenceAssignmentResponse | null;
  alternatives: IntelligenceAssignmentResponse[];
  rejected_candidates: number;
  engine_version: string;
  mode: 'read_only';
};

export type IntelligenceApplyRequest = {
  reservation_id: string;
  table_ids: string[];
  primary_table_id: string;
};

export type IntelligenceApplyResponse = {
  reservation_id: string;
  restaurant_id: string;
  primary_table_id: string;
  table_ids: string[];
  table_numbers: string[];
  status: ReservationStatus;
  mode: 'assisted';
  applied: boolean;
};

export type IntelligenceReoptimizeRequest = {
  restaurant_id: string;
  requested_start: string;
  party_size: number;
  duration_minutes?: number;
  reservation_id?: string | null;
  buffer_before_minutes?: number;
  buffer_after_minutes?: number;
  preferred_service_area_id?: string | null;
  max_reservations_to_move?: number;
  max_plans?: number;
};

export type IntelligenceReservationMoveResponse = {
  reservation_id: string;

  from_table_ids: string[];
  from_table_numbers: string[];

  to_table_ids: string[];
  to_table_numbers: string[];

  party_size: number;
  start_at: string;
  end_at: string;

  destination_capacity: number;
  seat_waste: number;
  explanation: string;
};

export type IntelligenceReoptimizationPlanResponse = {
  new_reservation_assignment:
    IntelligenceAssignmentResponse;

  moves: IntelligenceReservationMoveResponse[];

  score: number;
  base_score: number;
  personalized_score: number;
  personalization_applied: boolean;
  personalization_reasons: string[];

  total_seat_waste: number;
  moved_reservations_count: number;
  explanation: string;
};

export type IntelligenceReoptimizeResponse = {
  available: boolean;

  recommended:
    | IntelligenceReoptimizationPlanResponse
    | null;

  alternatives:
    IntelligenceReoptimizationPlanResponse[];

  evaluated_plans: number;
  rejected_plans: number;

  engine_version: string;
  mode: 'read_only';
};

export type IntelligenceReoptimizationMoveApply = {
  reservation_id: string;
  to_table_ids: string[];
  primary_table_id: string;
};

export type IntelligenceApplyReoptimizationRequest = {
  new_reservation_id: string;

  new_reservation_table_ids: string[];
  new_reservation_primary_table_id: string;

  moves: IntelligenceReoptimizationMoveApply[];
};

export type IntelligenceAppliedMoveResponse = {
  reservation_id: string;
  primary_table_id: string;
  table_ids: string[];
  table_numbers: string[];
};

export type IntelligenceApplyReoptimizationResponse = {
  new_reservation_id: string;

  new_reservation_primary_table_id: string;
  new_reservation_table_ids: string[];
  new_reservation_table_numbers: string[];

  applied_moves: IntelligenceAppliedMoveResponse[];

  mode: 'assisted_reoptimization';
  applied: boolean;
};

export type AISuggestionStatus =
  | 'pending'
  | 'accepted'
  | 'dismissed'
  | 'expired';

export type AISuggestionType =
  | 'reoptimization'
  | 'capacity'
  | 'table_release';

export type AISuggestionReservationPayload = {
  id: string;
  customer_name: string;
  party_size: number;
  reservation_time: string;
  duration_minutes: number;
};

export type AISuggestionPayload = {
  reservation: AISuggestionReservationPayload;
  plan: IntelligenceReoptimizationPlanResponse;
  engine_version: string;
  mode: string;
};

export type AISuggestionResponse = {
  id: string;
  restaurant_id: string;
  reservation_id: string | null;
  suggestion_type: AISuggestionType;
  status: AISuggestionStatus;
  title: string;
  description: string;
  score: number | null;
  payload: AISuggestionPayload;
  is_read: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AISuggestionListResponse = {
  suggestions: AISuggestionResponse[];
  total: number;
};

export type AISuggestionActionResponse = {
  id: string;
  status: AISuggestionStatus;
  is_read: boolean;
  updated_at: string;
};

export type AISuggestionAnalyzeResponse = {
  created: boolean;
  suggestion: AISuggestionResponse | null;
};

export async function analyzeAISuggestion(
  reservationId: string,
): Promise<AISuggestionAnalyzeResponse> {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      'Authentication is required to analyze AI suggestions.',
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/ai-suggestions/analyze/${reservationId}`,
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
      'Unable to analyze AI suggestion',
    );
  }

  return response.json();
}

export type TableCombinationMemberResponse = {
  table_id: string;
  table_number: string;
  seats: number;
  sort_order: number;
};

export type TableCombinationResponse = {
  id: string;
  restaurant_id: string;
  service_area_id: string;
  name: string;
  min_capacity: number;
  max_capacity: number;
  setup_minutes: number;
  is_active: boolean;
  members: TableCombinationMemberResponse[];
};

export type TableCombinationCreate = {
  service_area_id: string;
  name: string;
  min_capacity: number;
  max_capacity: number;
  setup_minutes: number;
  table_ids: string[];
};

export type TableCombinationUpdate = {
  name?: string;
  min_capacity?: number;
  max_capacity?: number;
  setup_minutes?: number;
  table_ids?: string[];
  is_active?: boolean;
};

export async function getTableCombinations(
  restaurantId: string,
  serviceAreaId?: string | null,
): Promise<TableCombinationResponse[]> {
  const token = getAuthToken();

  const query = new URLSearchParams();

  if (serviceAreaId) {
    query.set('service_area_id', serviceAreaId);
  }

  const queryString = query.toString();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/table-combinations${
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
      'Unable to load table combinations',
    );
  }

  return response.json();
}

export async function createTableCombination(
  restaurantId: string,
  payload: TableCombinationCreate,
): Promise<TableCombinationResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/table-combinations`,
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
      'Unable to create table combination',
    );
  }

  return response.json();
}

export async function updateTableCombination(
  restaurantId: string,
  combinationId: string,
  payload: TableCombinationUpdate,
): Promise<TableCombinationResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/table-combinations/${combinationId}`,
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
      'Unable to update table combination',
    );
  }

  return response.json();
}

export async function deleteTableCombination(
  restaurantId: string,
  combinationId: string,
): Promise<void> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/table-combinations/${combinationId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to delete table combination',
    );
  }
}

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

export async function getIntelligenceSnapshot(
  restaurantId: string,
): Promise<IntelligenceSnapshotResponse> {
  const token = getAuthToken();

  const query = new URLSearchParams({
    restaurant_id: restaurantId,
  });

  const response = await fetch(
    `${API_BASE_URL}/api/v1/intelligence/snapshot?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to load Alias Intelligence',
    );
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

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'seated'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type ReservationUpdate = {
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string | null;
  party_size?: number;
  reservation_time?: string;
  duration_minutes?: number;
  special_requests?: string | null;
  status?: ReservationStatus;
};

export type GetReservationsParams = {
  restaurantId?: string;
  start?: string;
  end?: string;
  status?: ReservationStatus;
  skip?: number;
  limit?: number;
};

export async function getReservations(
  params: GetReservationsParams = {},
): Promise<ReservationResponse[]> {
  const token = getAuthToken();

  const query = new URLSearchParams();

  if (params.restaurantId) {
    query.set('restaurant_id', params.restaurantId);
  }

  if (params.start) {
    query.set('start', params.start);
  }

  if (params.end) {
    query.set('end', params.end);
  }

  if (params.status) {
    query.set('status', params.status);
  }

  if (params.skip !== undefined) {
    query.set('skip', String(params.skip));
  }

  if (params.limit !== undefined) {
    query.set('limit', String(params.limit));
  }

  const queryString = query.toString();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/reservations${
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
      'Unable to load reservations',
    );
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

export async function updateReservation(
  reservationId: string,
  payload: ReservationUpdate,
): Promise<ReservationResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/reservations/${reservationId}`,
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
      'Unable to update reservation',
    );
  }

  return response.json();
}

export async function moveReservation(
  reservationId: string,
  tableId: string,
): Promise<ReservationResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/reservations/${reservationId}/move`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        table_id: tableId,
      }),
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to move reservation',
    );
  }

  return response.json();
}

export async function optimizeReservation(
  payload: IntelligenceOptimizeRequest,
): Promise<IntelligenceOptimizeResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/intelligence/optimize`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to optimize reservation',
    );
  }

  return response.json();
}

export async function reoptimizeReservation(
  payload: IntelligenceReoptimizeRequest,
): Promise<IntelligenceReoptimizeResponse> {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      'Authentication is required to reoptimize reservations.',
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/intelligence/reoptimize`,
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
      'Unable to reoptimize reservations',
    );
  }

  return response.json();
}

export async function applyIntelligenceRecommendation(
  payload: IntelligenceApplyRequest,
): Promise<IntelligenceApplyResponse> {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      'Authentication is required to apply an Alias recommendation.',
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/intelligence/apply`,
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
      'Unable to apply Alias recommendation',
    );
  }

  return response.json();
}

export async function applyIntelligenceReoptimization(
  payload: IntelligenceApplyReoptimizationRequest,
): Promise<IntelligenceApplyReoptimizationResponse> {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      'Authentication is required to apply a reoptimization plan.',
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/intelligence/apply-reoptimization`,
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
      'Unable to apply the reoptimization plan',
    );
  }

  return response.json();
}

export async function cancelReservation(
  reservationId: string,
): Promise<ReservationResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/reservations/${reservationId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to cancel reservation',
    );
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
  floorPlanid: string,
  tableId: string,
  payload: TableUpdate,
): Promise<TableResponse> {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants/${restaurantId}/tables/${tableId}?floor_plan_id=${encodeURIComponent(floorPlanid)}`,
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

export async function getAISuggestions(
  limit = 20,
): Promise<AISuggestionListResponse> {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      'Authentication is required to load AI suggestions.',
    );
  }

  const query = new URLSearchParams({
    limit: String(limit),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/v1/ai-suggestions?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw await parseApiError(
      response,
      'Unable to load AI suggestions',
    );
  }

  return response.json();
}

export async function markAISuggestionRead(
  suggestionId: string,
): Promise<AISuggestionActionResponse> {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      'Authentication is required to update AI suggestions.',
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/ai-suggestions/${suggestionId}/read`,
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
      'Unable to mark AI suggestion as read',
    );
  }

  return response.json();
}

export async function dismissAISuggestion(
  suggestionId: string,
): Promise<AISuggestionActionResponse> {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      'Authentication is required to dismiss AI suggestions.',
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/ai-suggestions/${suggestionId}/dismiss`,
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
      'Unable to dismiss AI suggestion',
    );
  }

  return response.json();
}

export async function acceptAISuggestion(
  suggestionId: string,
): Promise<AISuggestionActionResponse> {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      'Authentication is required to accept AI suggestions.',
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/ai-suggestions/${suggestionId}/accept`,
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
      'Unable to accept AI suggestion',
    );
  }

  return response.json();
}