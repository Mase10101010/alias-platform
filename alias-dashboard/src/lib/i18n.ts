export type LanguageCode = 'en' | 'it' | 'es' | 'fr' | 'de';

export const languages: {
  code: LanguageCode;
  label: string;
  shortLabel: string;
}[] = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'it', label: 'Italiano', shortLabel: 'IT' },
  { code: 'es', label: 'Español', shortLabel: 'ES' },
  { code: 'fr', label: 'Français', shortLabel: 'FR' },
  { code: 'de', label: 'Deutsch', shortLabel: 'DE' },
];

export function detectDefaultLanguage(): LanguageCode {
  const saved = localStorage.getItem('alias_language') as LanguageCode | null;

  if (saved && languages.some((language) => language.code === saved)) {
    return saved;
  }

  const browserLanguage = navigator.language.toLowerCase();

  if (browserLanguage.startsWith('it')) return 'it';
  if (browserLanguage.startsWith('es')) return 'es';
  if (browserLanguage.startsWith('fr')) return 'fr';
  if (browserLanguage.startsWith('de')) return 'de';

  return 'en';
}

export function saveLanguage(language: LanguageCode) {
  localStorage.setItem('alias_language', language);
}

export const translations = {
  en: {
    overview: 'Overview',
    concierge: 'Concierge AI',
    onboarding: 'Onboarding',
    reservations: 'Reservations',
    availability: 'Availability',
    analytics: 'Analytics',
    settings: 'Settings',
    trialDay: 'Trial day 3',
    intelligenceAutomationPath:
      'Path to automation',
    intelligenceCurrentLevel:
      'Current level',
    intelligenceNextLevel:
      'Next level',
    intelligenceRequirementBehaviourConfidence:
      'Behaviour confidence above the low level.',
    intelligenceRequirementCalibrationData:
      'Sufficient calibration data.',
    intelligenceRequirementManagerTrustHigh:
      'Manager trust at the high level.',
    intelligenceRequirementBehaviourConfidenceHigh:
      'Behaviour confidence at the high level.',
    intelligenceRequirementCalibrationWellCalibrated:
      'Predictions well calibrated.',
    intelligenceRequirementAutomationReached:
      'Automation eligibility requirements reached.',
    seatingDecisionReviewRecommended:
      'Manager review recommended',
    seatingDecisionRecommended:
      'Recommended by Alias',
    seatingDecisionStrongRecommendation:
      'Strong recommendation',
    liveConcierge:
      'Your AI concierge is live and handling guest requests.',
    dashboard: 'Alias Dashboard',
    logout: 'Logout',
    publicWelcome: 'Welcome. I am the concierge for {restaurantName}. I can help you reserve a table, check availability, or share special requests with the team.',
    publicReserveTitle: 'Reserve your table with the restaurant’s concierge.',
    publicSecure: 'Your booking details are sent securely to the restaurant team.',
    publicPlaceholder: 'Example: table for 2 tomorrow at 8pm',
    publicPoweredBy: 'Powered by Alias Concierge AI',
    publicLiveAI: 'Live AI',
    publicChecking: 'Alias is checking availability…',
    publicReservationConfirmed: 'Reservation confirmed',
    publicBookingRegistered: 'Your booking is now registered with {restaurantName}.',
    publicReservationId: 'Reservation ID',
    overviewTitle: 'Overview',
    goodEvening: 'Good evening',
    intelligencePredictionQuality: 'Prediction quality',
    intelligencePredictionReliability:
      'How reliable Alias predictions are',
    intelligencePredictionsEvaluated:
      'Predictions evaluated',
    intelligencePredictionAccuracy:
      'Prediction accuracy',
    intelligenceAverageConfidence:
      'Average predicted probability',
    intelligenceCalibrationGap:
      'Calibration gap',
    intelligenceCalibrationStatus:
      'Calibration status',
    intelligenceCalibrationInsufficient:
      'Not enough data yet',
    intelligenceCalibrationOverconfident:
      'Alias is currently overconfident',
    intelligenceCalibrationUnderconfident:
      'Alias is currently underconfident',
    intelligenceCalibrationWellCalibrated:
      'Predictions are well calibrated',
    overviewSubtitle: 'Live operational overview powered by Alias Concierge AI.',
    trialModeActive: 'Trial Mode Active',
    statReservations: 'Reservations',
    statConfirmed: 'Confirmed',
    statConcierge: 'Concierge',
    seatingExecutionBlocked:
      'Blocked',
    seatingExecutionManagerConfirmation:
      'Manager confirmation required',
    seatingExecutionEligible:
      'Eligible for automatic execution',
    statSubscription: 'Subscription',
    liveActivity: 'Live Activity',
    recentReservations: 'Recent reservations.',
    live: 'Live',
    loadingActivity: 'Loading activity...',
    noActivity: 'No activity yet.',
    partyOf: 'Party of',
    conciergeTitle: 'Concierge AI',
    conciergeHeading: 'Guest conversation layer.',
    conciergeSubtitle:
      'This is the future customer-facing concierge that will take bookings and service requests automatically.',
    conciergeLiveConnection: 'AI live connection',
    conciergeWelcome:
      'Good evening. I am Alias Concierge. I can help guests with reservations, availability, and service requests.',
    conciergeThinking: 'Alias is thinking…',
    conciergePlaceholder: 'Ask Alias Concierge for a table...',
    conciergeError:
      'Sorry, something went wrong while contacting the AI service.',
    onboardingTitle: 'Onboarding',
    onboardingHeading: 'Configure your AI concierge.',
    back: 'Back',
    launching: 'Launching…',
    launchConcierge: 'Launch concierge',
    seatingPlanMatchPreferences:
      'Match with your preferences',
    seatingPlanConfidence:
      'Confidence',
    seatingPlanPredictionDescription:
      'This estimates how closely the plan matches the seating decisions Alias has observed for this restaurant.',
    seatingPlanWhyRecommended:
      'Why Alias recommends this',

    seatingReasonNoMovesTitle:
      'No reservation moves required',
    seatingReasonNoMovesDescription:
      'This plan can be applied without moving any existing reservation.',

    seatingReasonPreferredSingleMoveTitle:
      'Matches preferred move structure',
    seatingReasonPreferredSingleMoveDescription:
      'This plan requires moving only one reservation, which matches the manager’s observed preferences.',

    seatingReasonPreferredMoveLimitTitle:
      'Within preferred move limit',
    seatingReasonPreferredMoveLimitDescription:
      'The number of reservation moves is within the range currently preferred for this restaurant.',

    seatingReasonAboveMoveLimitTitle:
      'More moves than usually preferred',
    seatingReasonAboveMoveLimitDescription:
      'This plan requires more reservation moves than the current learned preference.',

    seatingReasonExactFitTitle:
      'Exact capacity fit',
    seatingReasonExactFitDescription:
      'This plan creates no unused seating capacity.',

    seatingReasonSeatWasteWithinTitle:
      'Seat waste within preferred range',
    seatingReasonSeatWasteWithinDescription:
      'Unused seating capacity remains within the restaurant’s learned preference.',

    seatingReasonSeatWasteHighTitle:
      'Higher seat waste than usual',
    seatingReasonSeatWasteHighDescription:
      'This plan leaves more unused seating capacity than plans usually accepted by the manager.',

    seatingReasonStrongScoreTitle:
      'Strong technical score',
    seatingReasonStrongScoreDescription:
      'The technical score is above the current learned recommendation reference.',

    seatingReasonLowScoreTitle:
      'Below learned score reference',
    seatingReasonLowScoreDescription:
      'The technical score is below the current learned reference, so manager review remains advisable.',

    seatingReasonPersonalizationBonusTitle:
      'Boosted by learned preferences',
    seatingReasonPersonalizationBonusDescription:
      'Alias ranked this plan higher after applying the restaurant’s learned preferences.',

    seatingReasonPersonalizationPenaltyTitle:
      'Reduced by learned preferences',
    seatingReasonPersonalizationPenaltyDescription:
      'Alias ranked this plan more cautiously after applying the restaurant’s learned preferences.',
    continue: 'Continue',
    businessStepTitle: 'Tell us about the establishment',
    businessStepDescription:
      'These details help Alias configure your workspace and personalize the AI concierge experience for your guests.',
    serviceStepTitle: 'Restaurant capacity setup',
    serviceStepDescription:
      'Configure the seating structure of your restaurant so the AI concierge can better manage reservations and availability.',
    openingHours: 'Opening hours',
    restaurantSchedule: 'Restaurant schedule',
    openingTime: 'Opening time',
    closingTime: 'Closing time',
    availabilityPageTitle: 'Availability',
    openingDays: 'Opening days',
    openingDaysDescription:
      'Select the days when the restaurant is open.',
    open: 'Open',
    closed: 'Closed',
    seatingConfiguration: 'Seating configuration',
    tableDistribution: 'Table distribution',
    totalTables: 'Total tables',
    numberOfTables: 'Number of tables',
    seatsPerTable: 'Seats per table',
    add: 'Add',
    noTableConfigurations: 'No table configurations added yet.',
    totalSeats: 'Total seats',
    remove: 'Remove',
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
    tonePickerTitle: 'Choose a concierge tone',
    seatingExecutionStatus:
      'Operational status',
    seatingExecutionReasonPolicyAdvisory:
      'Alias is currently operating in advisory-only mode.',
    seatingExecutionReasonManagerConfirmation:
      'Manager confirmation is required before this plan can be applied.',
    seatingExecutionReasonDecisionNotStrong:
      'The current recommendation is not strong enough for automatic execution.',
    seatingExecutionReasonConfidenceNotHigh:
      'Prediction confidence is not high enough for automatic execution.',
    seatingExecutionReasonEligible:
      'This plan currently meets the requirements for future automatic execution.',
    tonePickerDescription: 'Select how the AI concierge should communicate with your guests.',
    toneCardDescription: 'Premium communication profile for guest interactions.',
    toneLuxury: 'Luxury',
    toneElegant: 'Elegant',
    toneCasual: 'Casual',
    toneModern: 'Modern',
    intelligenceInsightManagerTrustDeveloping:
      'Manager trust is still developing as Alias observes more seating decisions.',
    toneLuxuryDescription: 'Refined, exclusive and high-end language for premium dining.',
    toneElegantDescription: 'Polished, warm and graceful communication for refined service.',
    toneCasualDescription: 'Friendly, relaxed and approachable tone for informal hospitality.',
    toneModernDescription: 'Clean, confident and contemporary language for modern venues.',
    launchTitle: 'Your workspace is ready.',
    launchDescription: 'Alias will configure the concierge workspace for {restaurantName}.',
    estimatedSeats: 'Estimated seats',
    successTitle: '{restaurantName} is live on Alias.',
    successDescription:
      'The restaurant workspace has been created successfully and the trial is now active.',
    restaurantId: 'Restaurant ID',
    reservationsTitle: 'Reservations',
    reservationsHeading: 'Reservations overview',
    liveReservationFeed: 'Live reservation feed',
    newReservation: 'New Reservation',
    manualBooking: 'Manual booking',
    createReservationTitle: 'Create reservation.',
    guestName: 'Guest name',
    phoneNumber: 'Phone number',
    emailOptional: 'Email optional',
    partySize: 'Party size',
    date: 'Date',
    time: 'Time',
    specialRequestsOptional: 'Special requests optional',
    creating: 'Creating…',
    createReservationButton: 'Create reservation',
    timeColumn: 'Time',
    guestColumn: 'Guest',
    partyColumn: 'Party',
    statusColumn: 'Status',
    notesColumn: 'Notes',
    actionsColumn: 'Actions',

    loadingReservations: 'Loading reservations...',
    noReservations: 'No reservations found.',

    viewConversation: 'View conversation',
    aiConversation: 'AI Conversation',
    partyOfLabel: 'Party of',
    loadingConversation: 'Loading conversation...',
    noConversationMessages: 'No conversation messages found.',
    availabilityHeading: 'Manage your opening schedule.',
    availabilityDescription:
      'Manage your weekly opening schedule and special closures for holidays, private events, or unexpected shutdowns.',

    weeklySchedule: 'Weekly schedule',
    regularOpeningHours: 'Regular opening hours',
    weeklyScheduleDescription:
      'Set the default opening days and hours used by the AI concierge.',

    saveChanges: 'Save changes',
    opening: 'Opening',
    closing: 'Closing',
    specialClosures: 'Special closures',
    holidaysExceptions: 'Holidays and exceptions',
    specialClosuresDescription:
      'Add holidays, private events, or unexpected closures so the AI concierge never confirms reservations when the restaurant is closed.',
    closureReasonPlaceholder: 'Reason (e.g. Christmas Day)',
    addClosure: 'Add closure',
    noSpecialClosures: 'No special closures added yet.',
    availabilitySaved: 'Availability saved successfully.',
    availabilityLoadError: 'Unable to load availability.',
    availabilitySaveError: 'Unable to save availability.',

    closureDateRequired: 'Please select a closure date.',
    specialClosureAdded: 'Special closure added.',
    specialClosureRemoved: 'Special closure removed.',

    noRestaurantFound: 'No restaurant found.',
    noRestaurantSelected: 'No restaurant selected.',
    availabilityTitle: 'Availability',
    settingsHeading: 'Restaurant settings.',
    restaurantName: 'Restaurant name',
    contactEmail: 'Contact email',
    openingHoursLabel: 'Opening hours',
    businessType: 'Business type',
    conciergeTone: 'Concierge tone',
    intelligenceInsightLowReviewRateTitle:
      'Low suggestion review rate',
    intelligenceInsightLowReviewRateDescription:
      'Less than half of the generated suggestions have been reviewed.',
    trialActive: 'Trial active',
    billingNextPhase:
      'Billing integration will be connected in the next product phase.',
      publicConcierge: 'Public Concierge',
    shareEmbedTitle: 'Share or embed your AI concierge.',
    shareEmbedDescription:
      'Use this public link on your website, Instagram bio, Google Business profile, QR code, or embed it directly with an iframe.',
    openConcierge: 'Open concierge',
    publicLink: 'Public link',
    intelligenceInsightManagerTrustTitle:
      'Manager trust level',
    intelligenceInsightManagerTrustUnknown:
      'There is not enough evidence yet to estimate manager trust reliably.',
    intelligenceInsightManagerTrustLow:
      'The manager currently accepts few of Alias’s seating suggestions.',
    intelligenceInsightManagerTrustMedium:
      'The manager accepts Alias suggestions with moderate frequency.',
    intelligenceInsightManagerTrustHigh:
      'The manager frequently accepts Alias seating suggestions.',

    intelligenceInsightAcceptedScoreTitle:
      'Accepted score reference',
    intelligenceInsightAcceptedScoreDescription:
      'Accepted seating plans currently have an average score of {value}.',

    intelligenceInsightPreferredPlanTitle:
      'Preferred plan structure',
    intelligenceInsightPreferredPlanSingle:
      'Accepted plans usually require only one existing reservation to be moved.',
    intelligenceInsightPreferredPlanMulti:
      'Accepted plans often involve multiple reservation moves.',
    intelligenceInsightPreferredPlanLowWaste:
      'Accepted plans usually minimise unused seating capacity.',
    intelligenceInsightPreferredPlanFlexible:
      'No dominant plan structure has emerged yet.',

    intelligenceInsightExpiredTitle:
      'Suggestions becoming obsolete',
    intelligenceInsightExpiredDescription:
      '{value} suggestion(s) became obsolete before a manager decision was recorded.',
    iframeEmbedCode: 'Iframe embed code',
    createRestaurantFirst: 'Create a restaurant first.',
    copied: 'Copied',
    copy: 'Copy',
    qrAccess: 'QR Access',
    instantGuestAccess: 'Instant guest access.',
    qrDescription:
      'Guests can scan this QR code to instantly open your AI concierge and make reservations without downloading any app.',
    downloadQr: 'Download QR',
    qrAlt: 'Alias Concierge QR code',
    analyticsHeading: 'Hospitality intelligence.',
    monthlyBookings: 'Monthly bookings',
    noShowReduction: 'No-show reduction',
    automationRate: 'Automation rate',
    estimated: 'estimated',
    resolved: 'resolved',
    requestsByHour: 'Requests by hour',
    totalBookings: 'Total bookings',
    confirmedBookings: 'Confirmed bookings',
    averagePartySize: 'Average party size',
    bookingsByHour: 'Bookings by hour',
    realTime: 'real-time',
    intelligenceDeveloping: 'Developing',
    guests: 'guests',
    noAnalyticsData: 'No analytics data available yet.',
    statusConfirmed: 'Confirmed',
    statusPending: 'Pending',
    statusCancelled: 'Cancelled',
    statusCompleted: 'Completed',
    statusNoShow: 'No-show',
    subscriptionTrialing: 'Trial',
    subscriptionActive: 'Active',
    subscriptionCancelled: 'Cancelled',
    phoneNumberLabel: 'Phone number',
    tablesLabel: 'tables',
    seatsEachLabel: 'seats each',
    floorPlan: 'Floor Plan',
    support: 'Support',
    supportTitle: 'Support',
    supportHeading: 'Need help?',
    supportDescription:
      'Our team is here to help you with onboarding, reservations, integrations and concierge setup.',
    supportEmailTitle: 'Email support',
    supportEmailDescription:
      'Contact us anytime and we’ll get back to you as soon as possible.',
    supportFastResponseTitle: 'Fast response',
    supportFastResponseDescription:
      'We usually reply within a few hours during business days.',
    goToDashboard: 'Go to dashboard',
    welcomeFlowHeading: 'Let’s configure your AI concierge.',
    welcomeFlowDescription:
      'Alias will help you manage reservations, availability and guest communication from one simple workspace.',
    verifyEmailHeading: 'Before continuing, verify your email.',
    verifyEmailDescription:
      'We have sent you a verification email. Open the link in your inbox, then come back here and continue.',
    emailVerifiedButton: 'I verified my email',
    sendingVerificationEmail: 'Sending verification email...',
    authHeroTitle: 'AI operations for places where service matters',
    authHeroDescription:
      'Create your restaurant workspace, configure your AI concierge, and begin the 7-day trial in minutes.',
    authPrivateBeta: 'Private beta',
    authCreateAccount: 'Create your Alias account',
    authWelcomeBack: 'Welcome back to Alias',
    authRegister: 'Register',
    authLogin: 'Login',
    authFullNamePlaceholder: 'Enter your full name',
    authEmailPlaceholder: 'Enter your email',
    authPasswordPlaceholder: 'Enter your password',
    authForgotPassword: 'Forgot password?',
    authSendingResetLink: 'Sending reset link...',
    authPleaseWait: 'Please wait...',
    authStartTrial: 'Start 7-day trial',
    authFooter: 'No installation required. Cancel anytime.',
    privacyAcceptancePrefix: 'I have read and accept the',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    privacyAcceptanceMiddle: 'and',
    privacyRequired:
      'Please review and accept the Privacy Policy and Terms of Service before creating an account.',
    welcomeToAlias: 'Welcome to Alias.',
    welcomeLanguageDescription:
      'Choose your language before configuring your restaurant workspace.',
    searchAndSortReservations: 'Search and sort reservations',
    searchReservationsPlaceholder: 'Search by name, phone or email',
    newestFirst: 'Newest first',
    oldestFirst: 'Oldest first',
    emailRequired: 'Email required',
    emailRequiredError: 'Customer email is required to send the booking confirmation.',
    automaticTableAssignment: 'Automatic table assignment',
    tableLabel: 'Table',
    seatsLabel: 'seats',
    contactDetails: 'Contact',
    welcome: 'Welcome',
    tableManagement: 'Table Management',
    restaurantTablesTitle: 'Restaurant tables.',
    restaurantTablesDescription:
      'Add physical tables with visible numbers and internal Alias codes for future AI reservation assignment.',
    tableNumberRequired: 'Table number is required.',
    unableToLoadTables: 'Unable to load tables.',
    unableToCreateTable: 'Unable to create table.',
    unableToDeleteTable: 'Unable to delete table.',
    tableNumberPlaceholder: 'Table number',
    seatsPlaceholder: 'Seats',
    addingTable: 'Adding...',
    addTable: 'Add table',
    loadingTables: 'Loading tables...',
    noTablesAdded: 'No tables added yet.',
    restaurantLanguage: 'Restaurant language',
    save: 'Save',
    saving: 'Saving...',
    languageUpdatedSuccessfully: 'Language updated successfully.',
    unableToUpdateLanguage: 'Unable to update language.',
    trialTitle: 'Start your free trial',
    trialDescription: 'Try Alias free for 7 days. After your trial, your subscription renews automatically at €99/month.',
    trialFeature1: 'AI concierge',
    trialFeature2: 'Automatic reservations',
    trialFeature3: 'Table availability',
    trialFeature4: 'Public booking widget',
    trialFeature5: 'Multilingual support',
    trialFeature6: 'Customer email flows',
    trialButton: 'Start 7-day free trial',
    trialRedirecting: 'Redirecting...',
    trialFooter: 'No charge today. Cancel anytime from your billing portal.',
    trialError: 'Unable to start free trial.',
    manageSubscription: 'Manage subscription',
    freeTrial: 'Free trial',
    activeSubscription: 'Active subscription',
    seatingDecisionSummaryReview:
      'Alias recommends manager review before accepting this plan.',
    seatingDecisionSummaryRecommended:
      'Alias recommends this plan, but the current evidence still calls for explicit manager review.',
    seatingDecisionSummaryStrong:
      'Alias considers this a strong recommendation based on the current evidence and learned preferences.',

    seatingDecisionReasonCalibrationNotMature:
      'Alias does not yet have enough evaluated predictions to treat this recommendation as highly reliable.',
    seatingDecisionReasonHighAcceptanceProbability:
      'The plan closely matches the manager’s observed seating preferences.',
    seatingDecisionReasonLowAcceptanceProbability:
      'The plan has a relatively weak match with the manager’s observed decisions.',
    seatingDecisionReasonNoMovesRequired:
      'The plan does not require moving any existing reservation.',
    seatingDecisionReasonAbovePreferredMoveLimit:
      'The plan requires more reservation moves than the learned preference.',
    seatingDecisionReasonExactCapacityFit:
      'The plan creates no unused seating capacity.',
    seatingDecisionReasonBelowRecommendedScore:
      'The technical score is below the current learned recommendation reference.',
    lifetimeSubscription: 'Lifetime subscription',
    inactiveSubscription: 'Inactive subscription',
    trialEnds: 'Trial ends',
    renewsOn: 'Renews on',
    noRenewalRequired: 'No renewal required',
    subscriptionRequired: 'Subscription required',
    loadingBilling: 'Loading billing',
    loadingBillingDescription: 'Checking your subscription status...',
    tableNumberLabel: 'Table number',
    seatsPerTableLabel: 'Seats',
    billing: 'Billing',
    subscription: 'Subscription',
    billingDescription: 'Manage your Alias subscription, trial, payment method and customer portal.',
    loadingBillingStatus: 'Loading billing status...',
    currentPlan: 'Current plan',
    lifetime: 'Lifetime',
    inactive: 'Inactive',
    account: 'Account',
    trialUsed: 'Trial used',
    subscriptionStarts: 'Subscription starts',
    subscriptionEnds: 'Subscription ends',
    yes: 'Yes',
    no: 'No',
    subscribeNow: 'Subscribe now',
    startFreeTrial: 'Start free trial',
    aliasProDescription: 'Unlock AI reservations, table management, availability, public concierge and premium automation.',
    aiConcierge: 'AI concierge',
    publicBookingWidget: 'Public booking widget',
    reservationManagement: 'Reservation management',
    tableAvailability: 'Table availability',
    customerEmails: 'Customer emails',
    multilingualSupport: 'Multilingual support',
    intelligence: 'Alias Intelligence',
    intelligenceEyebrow: 'Alias Intelligence',
    intelligenceTitle:
      'Alias is learning how you run your restaurant.',
    intelligenceDescription:
      'Every seating decision helps Alias understand your preferences and rank future recommendations around the way you operate.',
    intelligenceRefresh: 'Refresh',
    intelligenceLoading: 'Loading Alias Intelligence...',
    intelligenceUnavailable: 'Alias Intelligence is unavailable',
    intelligenceUnavailableDescription:
      'The intelligence profile is not available yet.',
    intelligenceTryAgain: 'Try again',

    intelligenceLearning: 'Learning',
    intelligenceSuggestionsObserved: 'Suggestions observed',
    intelligenceManagerDecision: 'manager decision',
    intelligenceManagerDecisions: 'manager decisions',
    intelligenceAcceptanceRate: 'Acceptance rate',
    intelligenceAccepted: 'accepted',
    intelligenceReadRate: 'Read rate',
    intelligenceReviewed: 'reviewed',
    intelligenceLearningConfidence: 'Learning confidence',
    intelligenceProfile: 'Profile',

    intelligenceBehaviour: 'Behaviour',
    intelligenceWhatLearned: 'What Alias has learned',
    intelligencePreferredPlan: 'Preferred plan',
    intelligenceTypicalAcceptedMoves: 'Typical accepted moves',
    intelligenceTypicalSeatWaste: 'Typical seat waste',
    intelligenceManagerTrust: 'Manager trust',

    intelligenceAutomation: 'Automation',
    intelligenceOperatingMode: 'Current operating mode',
    intelligencePreferredMoves: 'Preferred moves',
    intelligencePreferredSeatWaste: 'Preferred seat waste',
    intelligenceAdvisoryDescription:
      'Alias will continue presenting seating recommendations for explicit manager review.',
    intelligenceAssistedDescription:
      'Alias can prioritize plans, while final confirmation remains with the manager.',
    intelligenceAutomationEligibleDescription:
      'Alias has enough evidence to support future opt-in automation.',

    intelligenceInsights: 'Insights',
    intelligenceUnderstands: 'What Alias currently understands',
    intelligenceEvidence: 'evidence',

    intelligenceUnknown: 'Unknown',
    intelligenceSingleMove: 'Single move',
    intelligenceMultiMove: 'Multiple moves',
    intelligenceLowSeatWaste: 'Low seat waste',
    intelligenceFlexible: 'Flexible',
    intelligenceAdvisoryOnly: 'Advisory only',
    intelligenceAssisted: 'Assisted',
    intelligenceEligibleAutomation: 'Eligible for automation',
    intelligenceLow: 'Low',
    intelligenceMedium: 'Medium',
    intelligenceHigh: 'High',
  },

  it: {
    overview: 'Panoramica',
    concierge: 'Concierge AI',
    onboarding: 'Onboarding',
    reservations: 'Prenotazioni',
    availability: 'Disponibilità',
    availabilityTitle: 'Disponibilità',
    analytics: 'Analytics',
    settings: 'Impostazioni',
    intelligenceAutomationPath:
      'Percorso verso l’automazione',
    intelligenceCurrentLevel:
      'Stato attuale',
    intelligenceNextLevel:
      'Prossimo livello',
    intelligenceRequirementBehaviourConfidence:
      'Confidenza del comportamento superiore al livello basso.',
    intelligenceRequirementCalibrationData:
      'Dati di calibrazione sufficienti.',
    intelligenceRequirementManagerTrustHigh:
      'Fiducia del manager al livello alto.',
    intelligenceRequirementBehaviourConfidenceHigh:
      'Confidenza del comportamento al livello alto.',
    intelligenceRequirementCalibrationWellCalibrated:
      'Previsioni ben calibrate.',
    intelligenceRequirementAutomationReached:
      'Requisiti per l’idoneità all’automazione raggiunti.',
    trialDay: 'Giorno di prova 3',
    seatingDecisionReviewRecommended:
      'Revisione del manager consigliata',
    seatingDecisionRecommended:
      'Consigliato da Alias',
    seatingDecisionStrongRecommendation:
      'Fortemente consigliato',
    liveConcierge:
      'Il tuo concierge AI è attivo e gestisce le richieste dei clienti.',
    dashboard: 'Dashboard Alias',
    logout: 'Esci',
    publicWelcome: 'Benvenuto. Sono il concierge di {restaurantName}. Posso aiutarti a prenotare un tavolo, controllare la disponibilità o comunicare richieste speciali al team.',
    publicReserveTitle: 'Prenota il tuo tavolo con il concierge del ristorante.',
    publicSecure: 'I dati della tua prenotazione vengono inviati in modo sicuro al team del ristorante.',
    publicPlaceholder: 'Esempio: tavolo per 2 domani alle 20',
    publicPoweredBy: 'Powered by Alias Concierge AI',
    publicLiveAI: 'AI live',
    seatingExecutionStatus:
      'Stato operativo',
    seatingExecutionReasonPolicyAdvisory:
      'Alias è attualmente in modalità solo consulenza.',
    seatingExecutionReasonManagerConfirmation:
      'È richiesta la conferma del manager prima di applicare questo piano.',
    seatingExecutionReasonDecisionNotStrong:
      'La raccomandazione attuale non è abbastanza forte per l’esecuzione automatica.',
    seatingExecutionReasonConfidenceNotHigh:
      'La confidenza della previsione non è abbastanza alta per l’esecuzione automatica.',
    seatingExecutionReasonEligible:
      'Questo piano soddisfa attualmente i requisiti per una futura esecuzione automatica.',
    publicChecking: 'Alias sta controllando la disponibilità…',
    publicReservationConfirmed: 'Prenotazione confermata',
    publicBookingRegistered: 'La tua prenotazione è ora registrata presso {restaurantName}.',
    publicReservationId: 'ID prenotazione',
    overviewTitle: 'Panoramica',
    goodEvening: 'Buonasera',
    seatingExecutionBlocked:
      'Bloccato',
    seatingExecutionManagerConfirmation:
      'Conferma del manager richiesta',
    seatingExecutionEligible:
      'Idoneo all’esecuzione automatica',
    seatingPlanMatchPreferences:
      'Compatibilità con le tue preferenze',
    seatingPlanConfidence:
      'Confidenza',
    seatingPlanPredictionDescription:
      'Questa stima indica quanto il piano è coerente con le decisioni sui tavoli che Alias ha osservato per questo ristorante.',
    seatingPlanWhyRecommended:
      'Perché Alias consiglia questo piano',

    seatingReasonNoMovesTitle:
      'Nessuno spostamento necessario',
    seatingReasonNoMovesDescription:
      'Questo piano può essere applicato senza spostare alcuna prenotazione esistente.',

    seatingReasonPreferredSingleMoveTitle:
      'Rispetta la struttura di spostamento preferita',
    seatingReasonPreferredSingleMoveDescription:
      'Questo piano richiede lo spostamento di una sola prenotazione, in linea con le preferenze osservate del manager.',

    seatingReasonPreferredMoveLimitTitle:
      'Entro il limite di spostamenti preferito',
    seatingReasonPreferredMoveLimitDescription:
      'Il numero di spostamenti rientra nell’intervallo attualmente preferito per questo ristorante.',

    seatingReasonAboveMoveLimitTitle:
      'Più spostamenti del solito',
    seatingReasonAboveMoveLimitDescription:
      'Questo piano richiede più spostamenti rispetto alla preferenza attualmente appresa.',

    seatingReasonExactFitTitle:
      'Capienza perfettamente utilizzata',
    seatingReasonExactFitDescription:
      'Questo piano non crea posti inutilizzati.',

    seatingReasonSeatWasteWithinTitle:
      'Posti inutilizzati entro il limite preferito',
    seatingReasonSeatWasteWithinDescription:
      'I posti inutilizzati restano entro la preferenza appresa del ristorante.',

    seatingReasonSeatWasteHighTitle:
      'Più posti inutilizzati del solito',
    seatingReasonSeatWasteHighDescription:
      'Questo piano lascia più posti inutilizzati rispetto ai piani normalmente accettati dal manager.',

    seatingReasonStrongScoreTitle:
      'Punteggio tecnico elevato',
    seatingReasonStrongScoreDescription:
      'Il punteggio tecnico è superiore al riferimento appreso attuale.',

    seatingReasonLowScoreTitle:
      'Sotto il riferimento appreso',
    seatingReasonLowScoreDescription:
      'Il punteggio tecnico è inferiore al riferimento appreso attuale, quindi è consigliata la revisione del manager.',

    seatingReasonPersonalizationBonusTitle:
      'Favorito dalle preferenze apprese',
    seatingReasonPersonalizationBonusDescription:
      'Alias ha classificato questo piano più in alto dopo aver applicato le preferenze apprese del ristorante.',

    seatingReasonPersonalizationPenaltyTitle:
      'Ridotto dalle preferenze apprese',
    seatingReasonPersonalizationPenaltyDescription:
      'Alias ha classificato questo piano con maggiore cautela dopo aver applicato le preferenze apprese del ristorante.',
    overviewSubtitle: 'Panoramica operativa live alimentata da Alias Concierge AI.',
    trialModeActive: 'Modalità prova attiva',
    statReservations: 'Prenotazioni',
    statConfirmed: 'Confermate',
    intelligenceInsightManagerTrustDeveloping:
      'La fiducia del manager è ancora in fase di sviluppo mentre Alias osserva altre decisioni sui tavoli.',
    statConcierge: 'Concierge',
    intelligenceInsightManagerTrustTitle:
      'Livello di fiducia del manager',
    intelligenceInsightManagerTrustUnknown:
      'Non ci sono ancora abbastanza dati per stimare in modo affidabile la fiducia del manager.',
    intelligenceInsightManagerTrustLow:
      'Il manager accetta attualmente poche proposte di disposizione dei tavoli generate da Alias.',
    intelligenceInsightManagerTrustMedium:
      'Il manager accetta le proposte di Alias con frequenza moderata.',
    intelligenceInsightManagerTrustHigh:
      'Il manager accetta frequentemente le proposte di disposizione dei tavoli generate da Alias.',

    intelligenceInsightAcceptedScoreTitle:
      'Punteggio medio accettato',
    intelligenceInsightAcceptedScoreDescription:
      'I piani di disposizione accettati hanno attualmente un punteggio medio di {value}.',

    intelligenceInsightPreferredPlanTitle:
      'Struttura del piano preferita',
    intelligenceInsightPreferredPlanSingle:
      'I piani accettati richiedono generalmente lo spostamento di una sola prenotazione esistente.',
    intelligenceInsightPreferredPlanMulti:
      'I piani accettati prevedono spesso più spostamenti di prenotazioni.',
    intelligenceInsightPreferredPlanLowWaste:
      'I piani accettati tendono a ridurre al minimo i posti inutilizzati.',
    intelligenceInsightPreferredPlanFlexible:
      'Non è ancora emersa una struttura di piano dominante.',

    intelligenceInsightExpiredTitle:
      'Suggerimenti diventati obsoleti',
    intelligenceInsightExpiredDescription:
      '{value} suggerimento/i sono diventati obsoleti prima che venisse registrata una decisione del manager.',
    statSubscription: 'Abbonamento',
    liveActivity: 'Attività live',
    intelligencePredictionQuality:
      'Qualità delle previsioni',
    intelligencePredictionReliability:
      'Quanto sono affidabili le previsioni di Alias',
    intelligencePredictionsEvaluated:
      'Previsioni valutate',
    intelligencePredictionAccuracy:
      'Accuratezza delle previsioni',
    intelligenceAverageConfidence:
      'Probabilità media prevista',
    intelligenceCalibrationGap:
      'Scarto di calibrazione',
    intelligenceCalibrationStatus:
      'Stato della calibrazione',
    intelligenceCalibrationInsufficient:
      'Dati ancora insufficienti',
    intelligenceCalibrationOverconfident:
      'Alias è attualmente troppo sicuro nelle sue previsioni',
    intelligenceCalibrationUnderconfident:
      'Alias è attualmente troppo prudente nelle sue previsioni',
    intelligenceCalibrationWellCalibrated:
      'Le previsioni sono ben calibrate',
    recentReservations: 'Prenotazioni recenti.',
    live: 'Live',
    loadingActivity: 'Caricamento attività...',
    noActivity: 'Nessuna attività ancora.',
    partyOf: 'Tavolo per',
    seatingDecisionSummaryReview:
      'Alias consiglia una revisione del manager prima di accettare questo piano.',
    seatingDecisionSummaryRecommended:
      'Alias consiglia questo piano, ma le evidenze attuali richiedono ancora una revisione esplicita del manager.',
    seatingDecisionSummaryStrong:
      'Alias considera questo piano fortemente consigliato in base alle evidenze attuali e alle preferenze apprese.',

    seatingDecisionReasonCalibrationNotMature:
      'Alias non dispone ancora di un numero sufficiente di previsioni valutate per considerare questa raccomandazione altamente affidabile.',
    seatingDecisionReasonHighAcceptanceProbability:
      'Il piano è molto coerente con le preferenze sui tavoli osservate del manager.',
    seatingDecisionReasonLowAcceptanceProbability:
      'Il piano mostra una compatibilità relativamente debole con le decisioni osservate del manager.',
    seatingDecisionReasonNoMovesRequired:
      'Il piano non richiede lo spostamento di prenotazioni esistenti.',
    seatingDecisionReasonAbovePreferredMoveLimit:
      'Il piano richiede più spostamenti rispetto alla preferenza appresa.',
    seatingDecisionReasonExactCapacityFit:
      'Il piano non crea posti inutilizzati.',
    seatingDecisionReasonBelowRecommendedScore:
      'Il punteggio tecnico è inferiore al riferimento di raccomandazione attualmente appreso.',
    conciergeTitle: 'Concierge AI',
    conciergeHeading: 'Conversazioni con gli ospiti.',
    conciergeSubtitle:
      'Questo è il concierge rivolto ai clienti che gestirà prenotazioni e richieste di servizio automaticamente.',
    conciergeLiveConnection: 'Connessione AI live',
    conciergeWelcome:
      'Buonasera. Sono Alias Concierge. Posso aiutare gli ospiti con prenotazioni, disponibilità e richieste di servizio.',
    conciergeThinking: 'Alias sta pensando…',
    conciergePlaceholder: 'Chiedi ad Alias Concierge un tavolo...',
    conciergeError:
      'Spiacente, si è verificato un errore nel contattare il servizio AI.',
    onboardingTitle: 'Onboarding',
    onboardingHeading: 'Configura il tuo concierge AI.',
    back: 'Indietro',
    launching: 'Avvio…',
    launchConcierge: 'Avvia concierge',
    intelligenceInsightLowReviewRateTitle:
      'Basso tasso di revisione dei suggerimenti',
    intelligenceInsightLowReviewRateDescription:
      'È stato revisionato meno della metà dei suggerimenti generati.',
    continue: 'Continua',
    floorPlan: 'Mappa Tavoli',
    businessStepTitle: 'Raccontaci il tuo locale',
    businessStepDescription:
      'Questi dettagli aiutano Alias a configurare il workspace e personalizzare l’esperienza del concierge AI per i tuoi ospiti.',
    serviceStepTitle: 'Configurazione capacità ristorante',
    serviceStepDescription:
      'Configura la struttura dei tavoli del tuo ristorante così il concierge AI potrà gestire meglio prenotazioni e disponibilità.',
    openingHours: 'Orari di apertura',
    restaurantSchedule: 'Programma del ristorante',
    openingTime: 'Orario apertura',
    intelligenceDeveloping: 'In sviluppo',
    closingTime: 'Orario chiusura',
    availabilityPageTitle: 'Disponibilità',
    openingDays: 'Giorni di apertura',
    openingDaysDescription:
      'Seleziona i giorni in cui il ristorante è aperto.',
    open: 'Aperto',
    closed: 'Chiuso',
    seatingConfiguration: 'Configurazione tavoli',
    tableDistribution: 'Distribuzione tavoli',
    totalTables: 'Tavoli totali',
    numberOfTables: 'Numero di tavoli',
    seatsPerTable: 'Posti per tavolo',
    add: 'Aggiungi',
    noTableConfigurations: 'Nessuna configurazione tavoli aggiunta.',
    totalSeats: 'Posti totali',
    remove: 'Rimuovi',
    monday: 'Lun',
    tuesday: 'Mar',
    wednesday: 'Mer',
    thursday: 'Gio',
    friday: 'Ven',
    saturday: 'Sab',
    sunday: 'Dom',
    tonePickerTitle: 'Scegli il tono del concierge',
    tonePickerDescription: 'Seleziona come il concierge AI dovrebbe comunicare con i tuoi ospiti.',
    toneCardDescription: 'Profilo di comunicazione premium per le interazioni con gli ospiti.',
    toneLuxury: 'Lusso',
    toneElegant: 'Elegante',
    toneCasual: 'Casual',
    toneModern: 'Moderno',
    toneLuxuryDescription: 'Linguaggio raffinato, esclusivo e premium per ristoranti di alto livello.',
    toneElegantDescription: 'Comunicazione curata, calda ed elegante per un servizio raffinato.',
    toneCasualDescription: 'Tono amichevole, rilassato e accessibile per locali informali.',
    toneModernDescription: 'Linguaggio pulito, sicuro e contemporaneo per locali moderni.',
    launchTitle: 'Il tuo workspace è pronto.',
    launchDescription: 'Alias configurerà il workspace concierge per {restaurantName}.',
    estimatedSeats: 'Posti stimati',
    successTitle: '{restaurantName} è live su Alias.',
    successDescription:
      'Il workspace del ristorante è stato creato con successo e il periodo di prova è ora attivo.',
    restaurantId: 'ID ristorante',
    reservationsTitle: 'Prenotazioni',
    reservationsHeading: 'Panoramica del servizio',
    liveReservationFeed: 'Feed prenotazioni live',
    newReservation: 'Nuova prenotazione',
    manualBooking: 'Prenotazione manuale',
    createReservationTitle: 'Crea prenotazione.',
    guestName: 'Nome ospite',
    phoneNumber: 'Numero di telefono',
    emailOptional: 'Email opzionale',
    partySize: 'Numero persone',
    date: 'Data',
    time: 'Orario',
    specialRequestsOptional: 'Richieste speciali opzionali',
    creating: 'Creazione…',
    createReservationButton: 'Crea prenotazione',
    timeColumn: 'Orario',
    guestColumn: 'Ospite',
    partyColumn: 'Persone',
    statusColumn: 'Stato',
    notesColumn: 'Note',
    actionsColumn: 'Azioni',

    loadingReservations: 'Caricamento prenotazioni...',
    noReservations: 'Nessuna prenotazione trovata.',

    viewConversation: 'Visualizza conversazione',
    aiConversation: 'Conversazione AI',
    partyOfLabel: 'Tavolo per',
    loadingConversation: 'Caricamento conversazione...',
    noConversationMessages: 'Nessun messaggio trovato.',
    availabilityHeading: 'Gestisci gli orari di apertura.',
    availabilityDescription:
      'Gestisci il programma settimanale e le chiusure speciali per festività, eventi privati o chiusure impreviste.',

    weeklySchedule: 'Programmazione settimanale',
    regularOpeningHours: 'Orari di apertura regolari',
    weeklyScheduleDescription:
      'Imposta i giorni e gli orari di apertura utilizzati dal concierge AI.',

    saveChanges: 'Salva modifiche',
    opening: 'Apertura',
    closing: 'Chiusura',
    specialClosures: 'Chiusure speciali',
    holidaysExceptions: 'Festività ed eccezioni',
    specialClosuresDescription:
      'Aggiungi festività, eventi privati o chiusure impreviste così il concierge AI non confermerà prenotazioni quando il ristorante è chiuso.',
    closureReasonPlaceholder: 'Motivo (es. Natale)',
    addClosure: 'Aggiungi chiusura',
    noSpecialClosures: 'Nessuna chiusura speciale aggiunta.',
    availabilitySaved: 'Disponibilità salvata con successo.',
    availabilityLoadError: 'Impossibile caricare la disponibilità.',
    availabilitySaveError: 'Impossibile salvare la disponibilità.',

    closureDateRequired: 'Seleziona una data di chiusura.',
    specialClosureAdded: 'Chiusura speciale aggiunta.',
    specialClosureRemoved: 'Chiusura speciale rimossa.',

    noRestaurantFound: 'Nessun ristorante trovato.',
    noRestaurantSelected: 'Nessun ristorante selezionato.',
    settingsHeading: 'Impostazioni ristorante.',
    restaurantName: 'Nome ristorante',
    contactEmail: 'Email contatto',
    openingHoursLabel: 'Orari di apertura',
    businessType: 'Tipo di attività',
    conciergeTone: 'Tono concierge',
    trialActive: 'Prova attiva',
    billingNextPhase:
      'L’integrazione dei pagamenti sarà collegata nella prossima fase del prodotto.',
    publicConcierge: 'Concierge pubblico',
    shareEmbedTitle: 'Condividi o incorpora il tuo concierge AI.',
    shareEmbedDescription:
      'Usa questo link pubblico sul tuo sito web, bio Instagram, profilo Google Business, QR code oppure incorporalo direttamente con un iframe.',
    openConcierge: 'Apri concierge',
    publicLink: 'Link pubblico',
    iframeEmbedCode: 'Codice iframe',
    createRestaurantFirst: 'Crea prima un ristorante.',
    copied: 'Copiato',
    copy: 'Copia',
    qrAccess: 'Accesso QR',
    instantGuestAccess: 'Accesso immediato per gli ospiti.',
    qrDescription:
      'Gli ospiti possono scansionare questo QR code per aprire immediatamente il concierge AI e prenotare senza scaricare nessuna app.',
    downloadQr: 'Scarica QR',
    qrAlt: 'QR code Alias Concierge',
    analyticsHeading: 'Intelligence per hospitality.',
    monthlyBookings: 'Prenotazioni mensili',
    noShowReduction: 'Riduzione no-show',
    automationRate: 'Tasso automazione',
    estimated: 'stimato',
    resolved: 'risolte',
    requestsByHour: 'Richieste per ora',
    totalBookings: 'Prenotazioni totali',
    confirmedBookings: 'Prenotazioni confermate',
    averagePartySize: 'Media persone per tavolo',
    bookingsByHour: 'Prenotazioni per ora',
    realTime: 'tempo reale',
    guests: 'ospiti',
    noAnalyticsData: 'Nessun dato analytics disponibile.',
    statusConfirmed: 'Confermata',
    statusPending: 'In attesa',
    statusCancelled: 'Cancellata',
    statusCompleted: 'Completata',
    statusNoShow: 'No-show',
    subscriptionTrialing: 'Prova',
    subscriptionActive: 'Attivo',
    subscriptionCancelled: 'Cancellato',
    phoneNumberLabel: 'Numero di telefono',
    tablesLabel: 'tavoli',
    seatsEachLabel: 'posti ciascuno',
    support: 'Supporto',
    supportTitle: 'Supporto',
    supportHeading: 'Hai bisogno di aiuto?',
    supportDescription:
      'Il nostro team è qui per aiutarti con onboarding, prenotazioni, integrazioni e configurazione del concierge.',
    supportEmailTitle: 'Supporto email',
    supportEmailDescription:
      'Contattaci quando vuoi e ti risponderemo il prima possibile.',
    supportFastResponseTitle: 'Risposta rapida',
    supportFastResponseDescription:
      'Di solito rispondiamo entro poche ore nei giorni lavorativi.',
    goToDashboard: 'Vai alla dashboard',
    welcomeFlowHeading: 'Configuriamo il tuo concierge AI.',
    welcomeFlowDescription:
      'Alias ti aiuterà a gestire prenotazioni, disponibilità e comunicazione con gli ospiti da un unico workspace semplice.',
    verifyEmailHeading: 'Prima di continuare, verifica la tua email.',
    verifyEmailDescription:
      'Ti abbiamo inviato una email di verifica. Apri il link nella tua casella di posta, poi torna qui e continua.',
    emailVerifiedButton: 'Ho verificato la email',
    sendingVerificationEmail: 'Invio email di verifica...',
    authHeroTitle: 'Operazioni AI per luoghi dove il servizio conta',
    authHeroDescription:
      'Crea il workspace del tuo ristorante, configura il tuo concierge AI e inizia la prova di 7 giorni in pochi minuti.',
    authPrivateBeta: 'Private beta',
    authCreateAccount: 'Crea il tuo account Alias',
    authWelcomeBack: 'Bentornato su Alias',
    authRegister: 'Registrati',
    authLogin: 'Accedi',
    authFullNamePlaceholder: 'Inserisci il tuo nome completo',
    authEmailPlaceholder: 'Inserisci la tua email',
    authPasswordPlaceholder: 'Inserisci la tua password',
    authForgotPassword: 'Password dimenticata?',
    authSendingResetLink: 'Invio link di reset...',
    authPleaseWait: 'Attendi...',
    authStartTrial: 'Inizia prova di 7 giorni',
    authFooter: 'Nessuna installazione richiesta. Puoi annullare quando vuoi.',
    privacyAcceptancePrefix: 'Ho preso visione e accetto la',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Termini di Servizio',
    privacyAcceptanceMiddle: 'e i',
    privacyRequired:
      'Prima di creare un account devi prendere visione e accettare Privacy Policy e Termini di Servizio.',
    welcomeToAlias: 'Benvenuto in Alias.',
    welcomeLanguageDescription:
      'Scegli la tua lingua prima di configurare il tuo ristorante.',
    searchAndSortReservations: 'Cerca e ordina prenotazioni',
    searchReservationsPlaceholder: 'Cerca per nome, telefono o email',
    newestFirst: 'Più recenti prima',
    oldestFirst: 'Meno recenti prima',
    emailRequired: 'Email obbligatoria',
    emailRequiredError: 'L’email del cliente è obbligatoria per inviare la conferma della prenotazione.',
    automaticTableAssignment: 'Assegnazione automatica tavolo',
    tableLabel: 'Tavolo',
    seatsLabel: 'posti',
    contactDetails: 'Contatti',
    welcome: 'Benvenuto',
    tableManagement: 'Gestione tavoli',
    restaurantTablesTitle: 'Tavoli del ristorante.',
    restaurantTablesDescription:
      'Aggiungi i tavoli fisici con numeri visibili e codici interni Alias per l’assegnazione futura delle prenotazioni AI.',
    tableNumberRequired: 'Il numero del tavolo è obbligatorio.',
    unableToLoadTables: 'Impossibile caricare i tavoli.',
    unableToCreateTable: 'Impossibile creare il tavolo.',
    unableToDeleteTable: 'Impossibile eliminare il tavolo.',
    tableNumberPlaceholder: 'Numero tavolo',
    seatsPlaceholder: 'Posti',
    addingTable: 'Aggiunta...',
    addTable: 'Aggiungi tavolo',
    loadingTables: 'Caricamento tavoli...',
    noTablesAdded: 'Nessun tavolo aggiunto.',
    restaurantLanguage: 'Lingua del ristorante',
    save: 'Salva',
    saving: 'Salvataggio...',
    languageUpdatedSuccessfully: 'Lingua aggiornata con successo.',
    unableToUpdateLanguage: 'Impossibile aggiornare la lingua.',
    trialTitle: 'Inizia la tua prova gratuita',
    trialDescription: 'Prova Alias gratuitamente per 7 giorni. Al termine della prova, l’abbonamento si rinnoverà automaticamente a €99/mese.',
    trialFeature1: 'Concierge AI',
    trialFeature2: 'Prenotazioni automatiche',
    trialFeature3: 'Disponibilità tavoli',
    trialFeature4: 'Widget prenotazioni pubblico',
    trialFeature5: 'Supporto multilingua',
    trialFeature6: 'Email automatiche ai clienti',
    trialButton: 'Inizia la prova gratuita di 7 giorni',
    trialRedirecting: 'Reindirizzamento...',
    trialFooter: 'Nessun addebito oggi. Annulla in qualsiasi momento dal portale di fatturazione.',
    trialError: 'Impossibile avviare la prova gratuita.',
    manageSubscription: 'Gestisci abbonamento',
    freeTrial: 'Prova gratuita',
    activeSubscription: 'Abbonamento attivo',
    lifetimeSubscription: 'Abbonamento lifetime',
    inactiveSubscription: 'Abbonamento inattivo',
    trialEnds: 'La prova termina il',
    renewsOn: 'Rinnovo il',
    noRenewalRequired: 'Nessun rinnovo richiesto',
    subscriptionRequired: 'Abbonamento richiesto',
    loadingBilling: 'Caricamento abbonamento',
    loadingBillingDescription: 'Controllo dello stato dell’abbonamento...',
    tableNumberLabel: 'Numero tavolo',
    seatsPerTableLabel: 'Posti',
    billing: 'Fatturazione',
    subscription: 'Abbonamento',
    billingDescription: 'Gestisci il tuo abbonamento Alias, il periodo di prova, il metodo di pagamento e il portale clienti.',
    loadingBillingStatus: 'Caricamento stato abbonamento...',
    currentPlan: 'Piano attuale',
    lifetime: 'A vita',
    inactive: 'Inattivo',
    account: 'Account',
    trialUsed: 'Prova utilizzata',
    subscriptionStarts: 'Inizio abbonamento',
    subscriptionEnds: 'Fine abbonamento',
    yes: 'Sì',
    no: 'No',
    subscribeNow: 'Abbonati ora',
    intelligence: 'Alias Intelligence',
    intelligenceEyebrow: 'Alias Intelligence',
    intelligenceTitle:
      'Alias sta imparando come gestisci il tuo ristorante.',
    intelligenceDescription:
      'Ogni decisione sui tavoli aiuta Alias a comprendere le tue preferenze e a classificare i suggerimenti futuri in base al tuo modo di lavorare.',
    intelligenceRefresh: 'Aggiorna',
    intelligenceLoading: 'Caricamento Alias Intelligence...',
    intelligenceUnavailable: 'Alias Intelligence non è disponibile',
    intelligenceUnavailableDescription:
      'Il profilo di intelligence non è ancora disponibile.',
    intelligenceTryAgain: 'Riprova',

    intelligenceLearning: 'Apprendimento',
    intelligenceSuggestionsObserved: 'Suggerimenti osservati',
    intelligenceManagerDecision: 'decisione del manager',
    intelligenceManagerDecisions: 'decisioni del manager',
    intelligenceAcceptanceRate: 'Tasso di accettazione',
    intelligenceAccepted: 'accettati',
    intelligenceReadRate: 'Tasso di lettura',
    intelligenceReviewed: 'revisionati',
    intelligenceLearningConfidence: 'Confidenza di apprendimento',
    intelligenceProfile: 'Profilo',

    intelligenceBehaviour: 'Comportamento',
    intelligenceWhatLearned: 'Cosa ha imparato Alias',
    intelligencePreferredPlan: 'Piano preferito',
    intelligenceTypicalAcceptedMoves: 'Movimenti accettati tipici',
    intelligenceTypicalSeatWaste: 'Posti inutilizzati tipici',
    intelligenceManagerTrust: 'Fiducia del manager',

    intelligenceAutomation: 'Automazione',
    intelligenceOperatingMode: 'Modalità operativa attuale',
    intelligencePreferredMoves: 'Movimenti preferiti',
    intelligencePreferredSeatWaste: 'Posti inutilizzati preferiti',
    intelligenceAdvisoryDescription:
      'Alias continuerà a presentare suggerimenti sui tavoli richiedendo l’approvazione esplicita del manager.',
    intelligenceAssistedDescription:
      'Alias può dare priorità ai piani, ma la conferma finale rimane al manager.',
    intelligenceAutomationEligibleDescription:
      'Alias dispone di sufficienti evidenze per supportare una futura automazione attivabile dal manager.',

    intelligenceInsights: 'Insight',
    intelligenceUnderstands: 'Cosa comprende attualmente Alias',
    intelligenceEvidence: 'evidenze',

    intelligenceUnknown: 'Sconosciuta',
    intelligenceSingleMove: 'Singolo spostamento',
    intelligenceMultiMove: 'Più spostamenti',
    intelligenceLowSeatWaste: 'Basso spreco di posti',
    intelligenceFlexible: 'Flessibile',
    intelligenceAdvisoryOnly: 'Solo consulenza',
    intelligenceAssisted: 'Assistita',
    intelligenceEligibleAutomation: 'Idonea all’automazione',
    intelligenceLow: 'Bassa',
    intelligenceMedium: 'Media',
    intelligenceHigh: 'Alta',
    startFreeTrial: 'Avvia prova gratuita',
    aliasProDescription: 'Sblocca prenotazioni AI, gestione tavoli, disponibilità, concierge pubblico e automazioni premium.',
    aiConcierge: 'Concierge AI',
    publicBookingWidget: 'Widget prenotazioni pubblico',
    reservationManagement: 'Gestione prenotazioni',
    tableAvailability: 'Disponibilità tavoli',
    customerEmails: 'Email clienti',
    multilingualSupport: 'Supporto multilingua',
    },
  es: {
    overview: 'Resumen',
    concierge: 'Conserje AI',
    onboarding: 'Onboarding',
    reservations: 'Reservas',
    availability: 'Disponibilidad',
    availabilityTitle: 'Disponibilidad',
    intelligenceAutomationPath:
      'Camino hacia la automatización',
    intelligenceCurrentLevel:
      'Nivel actual',
    intelligenceNextLevel:
      'Siguiente nivel',
    intelligenceRequirementBehaviourConfidence:
      'Confianza del comportamiento superior al nivel bajo.',
    intelligenceRequirementCalibrationData:
      'Datos de calibración suficientes.',
    intelligenceRequirementManagerTrustHigh:
      'Confianza del gerente en el nivel alto.',
    intelligenceRequirementBehaviourConfidenceHigh:
      'Confianza del comportamiento en el nivel alto.',
    intelligenceRequirementCalibrationWellCalibrated:
      'Predicciones bien calibradas.',
    intelligenceRequirementAutomationReached:
      'Requisitos de elegibilidad para la automatización alcanzados.',
    analytics: 'Analíticas',
    seatingExecutionStatus:
      'Estado operativo',
    seatingExecutionReasonPolicyAdvisory:
      'Alias está actualmente en modo solo asesoramiento.',
    seatingExecutionReasonManagerConfirmation:
      'Se requiere la confirmación del gerente antes de aplicar este plan.',
    seatingExecutionReasonDecisionNotStrong:
      'La recomendación actual no es lo suficientemente fuerte para la ejecución automática.',
    seatingExecutionReasonConfidenceNotHigh:
      'La confianza de la predicción no es lo suficientemente alta para la ejecución automática.',
    seatingExecutionReasonEligible:
      'Este plan cumple actualmente los requisitos para una futura ejecución automática.',
    settings: 'Configuración',
    seatingDecisionReviewRecommended:
      'Se recomienda revisión del gerente',
    seatingDecisionRecommended:
      'Recomendado por Alias',
    seatingDecisionStrongRecommendation:
      'Recomendación fuerte',
    seatingPlanMatchPreferences:
      'Compatibilidad con tus preferencias',
    seatingPlanConfidence:
      'Confianza',
    seatingPlanPredictionDescription:
      'Esta estimación indica hasta qué punto el plan coincide con las decisiones de mesas que Alias ha observado para este restaurante.',
    seatingPlanWhyRecommended:
      'Por qué Alias recomienda este plan',

    seatingReasonNoMovesTitle:
      'No es necesario mover reservas',
    seatingReasonNoMovesDescription:
      'Este plan puede aplicarse sin mover ninguna reserva existente.',

    seatingReasonPreferredSingleMoveTitle:
      'Coincide con la estructura de movimientos preferida',
    seatingReasonPreferredSingleMoveDescription:
      'Este plan requiere mover una sola reserva, en línea con las preferencias observadas del gerente.',

    seatingReasonPreferredMoveLimitTitle:
      'Dentro del límite de movimientos preferido',
    seatingReasonPreferredMoveLimitDescription:
      'El número de movimientos está dentro del rango actualmente preferido para este restaurante.',

    seatingReasonAboveMoveLimitTitle:
      'Más movimientos de los habituales',
    seatingReasonAboveMoveLimitDescription:
      'Este plan requiere más movimientos que la preferencia actualmente aprendida.',

    seatingReasonExactFitTitle:
      'Capacidad exacta',
    seatingReasonExactFitDescription:
      'Este plan no genera asientos sin utilizar.',

    seatingReasonSeatWasteWithinTitle:
      'Asientos sin utilizar dentro del rango preferido',
    seatingReasonSeatWasteWithinDescription:
      'La capacidad sin utilizar permanece dentro de la preferencia aprendida del restaurante.',

    seatingReasonSeatWasteHighTitle:
      'Más asientos sin utilizar de lo habitual',
    seatingReasonSeatWasteHighDescription:
      'Este plan deja más asientos sin utilizar que los planes normalmente aceptados por el gerente.',

    seatingReasonStrongScoreTitle:
      'Puntuación técnica alta',
    seatingReasonStrongScoreDescription:
      'La puntuación técnica está por encima de la referencia aprendida actual.',

    seatingReasonLowScoreTitle:
      'Por debajo de la referencia aprendida',
    seatingReasonLowScoreDescription:
      'La puntuación técnica está por debajo de la referencia aprendida actual, por lo que se recomienda revisión del gerente.',

    seatingReasonPersonalizationBonusTitle:
      'Favorecido por las preferencias aprendidas',
    seatingReasonPersonalizationBonusDescription:
      'Alias clasificó este plan más alto después de aplicar las preferencias aprendidas del restaurante.',

    seatingReasonPersonalizationPenaltyTitle:
      'Reducido por las preferencias aprendidas',
    seatingReasonPersonalizationPenaltyDescription:
      'Alias clasificó este plan con mayor cautela después de aplicar las preferencias aprendidas del restaurante.',
    trialDay: 'Día de prueba 3',
    liveConcierge:
      'Tu concierge AI está activo y gestionando solicitudes.',
    dashboard: 'Panel Alias',
    logout: 'Salir',
    intelligenceInsightManagerTrustDeveloping:
      'La confianza del gerente aún está en desarrollo mientras Alias observa más decisiones sobre las mesas.',
    publicWelcome: 'Bienvenido. Soy el concierge de {restaurantName}. Puedo ayudarte a reservar una mesa, comprobar disponibilidad o comunicar solicitudes especiales al equipo.',
    publicReserveTitle: 'Reserva tu mesa con el concierge del restaurante.',
    publicSecure: 'Los datos de tu reserva se envían de forma segura al equipo del restaurante.',
    publicPlaceholder: 'Ejemplo: mesa para 2 mañana a las 20:00',
    publicPoweredBy: 'Powered by Alias Concierge AI',
    publicLiveAI: 'AI en vivo',
    seatingExecutionBlocked:
      'Bloqueado',
    seatingExecutionManagerConfirmation:
      'Se requiere confirmación del gerente',
    seatingExecutionEligible:
      'Apto para ejecución automática',
    publicChecking: 'Alias está comprobando la disponibilidad…',
    publicReservationConfirmed: 'Reserva confirmada',
    publicBookingRegistered: 'Tu reserva ya está registrada en {restaurantName}.',
    publicReservationId: 'ID de reserva',
    overviewTitle: 'Resumen',
    goodEvening: 'Buenas tardes',
    overviewSubtitle: 'Resumen operativo en vivo impulsado por Alias Concierge AI.',
    trialModeActive: 'Modo de prueba activo',
    statReservations: 'Reservas',
    statConfirmed: 'Confirmadas',
    seatingDecisionSummaryReview:
      'Alias recomienda una revisión del gerente antes de aceptar este plan.',
    seatingDecisionSummaryRecommended:
      'Alias recomienda este plan, pero la evidencia actual todavía requiere una revisión explícita del gerente.',
    seatingDecisionSummaryStrong:
      'Alias considera este plan una recomendación fuerte según la evidencia actual y las preferencias aprendidas.',

    seatingDecisionReasonCalibrationNotMature:
      'Alias todavía no dispone de suficientes predicciones evaluadas para considerar esta recomendación altamente fiable.',
    seatingDecisionReasonHighAcceptanceProbability:
      'El plan coincide estrechamente con las preferencias de mesas observadas del gerente.',
    seatingDecisionReasonLowAcceptanceProbability:
      'El plan tiene una coincidencia relativamente débil con las decisiones observadas del gerente.',
    seatingDecisionReasonNoMovesRequired:
      'El plan no requiere mover ninguna reserva existente.',
    seatingDecisionReasonAbovePreferredMoveLimit:
      'El plan requiere más movimientos de reservas que la preferencia aprendida.',
    seatingDecisionReasonExactCapacityFit:
      'El plan no genera asientos sin utilizar.',
    seatingDecisionReasonBelowRecommendedScore:
      'La puntuación técnica está por debajo de la referencia de recomendación aprendida actual.',
    intelligenceInsightLowReviewRateTitle:
      'Baja tasa de revisión de sugerencias',
    intelligenceInsightLowReviewRateDescription:
      'Se ha revisado menos de la mitad de las sugerencias generadas.',
    intelligenceDeveloping: 'En desarrollo',
    statConcierge: 'Conserje',
    statSubscription: 'Suscripción',
    liveActivity: 'Actividad en vivo',
    intelligenceInsightManagerTrustTitle:
      'Nivel de confianza del gerente',
    intelligenceInsightManagerTrustUnknown:
      'Todavía no hay suficientes datos para estimar de forma fiable la confianza del gerente.',
    intelligenceInsightManagerTrustLow:
      'El gerente acepta actualmente pocas sugerencias de distribución de mesas de Alias.',
    intelligenceInsightManagerTrustMedium:
      'El gerente acepta las sugerencias de Alias con una frecuencia moderada.',
    intelligenceInsightManagerTrustHigh:
      'El gerente acepta con frecuencia las sugerencias de distribución de mesas de Alias.',

    intelligenceInsightAcceptedScoreTitle:
      'Puntuación media aceptada',
    intelligenceInsightAcceptedScoreDescription:
      'Los planes de distribución aceptados tienen actualmente una puntuación media de {value}.',

    intelligenceInsightPreferredPlanTitle:
      'Estructura de plan preferida',
    intelligenceInsightPreferredPlanSingle:
      'Los planes aceptados suelen requerir mover una sola reserva existente.',
    intelligenceInsightPreferredPlanMulti:
      'Los planes aceptados suelen implicar varios movimientos de reservas.',
    intelligenceInsightPreferredPlanLowWaste:
      'Los planes aceptados suelen minimizar los asientos sin utilizar.',
    intelligenceInsightPreferredPlanFlexible:
      'Todavía no ha surgido una estructura de plan dominante.',

    intelligenceInsightExpiredTitle:
      'Sugerencias que quedan obsoletas',
    intelligenceInsightExpiredDescription:
      '{value} sugerencia(s) quedaron obsoletas antes de registrar una decisión del gerente.',
    recentReservations: 'Reservas recientes.',
    live: 'En vivo',
    loadingActivity: 'Cargando actividad...',
    intelligence: 'Inteligencia de Alias',
    noActivity: 'Sin actividad todavía.',
    partyOf: 'Mesa para',
    conciergeTitle: 'Concierge AI',
    conciergeHeading: 'Capa de conversación con huéspedes.',
    conciergeSubtitle:
      'Este es el concierge orientado al cliente que gestionará reservas y solicitudes automáticamente.',
    conciergeLiveConnection: 'Conexión AI en vivo',
    conciergeWelcome:
      'Buenas tardes. Soy Alias Concierge. Puedo ayudar a los huéspedes con reservas, disponibilidad y solicitudes de servicio.',
    conciergeThinking: 'Alias está pensando…',
    conciergePlaceholder: 'Pide una mesa a Alias Concierge...',
    conciergeError:
      'Lo sentimos, ocurrió un error al contactar el servicio AI.',
    onboardingTitle: 'Onboarding',
    onboardingHeading: 'Configura tu concierge AI.',
    back: 'Atrás',
    launching: 'Lanzando…',
    intelligencePredictionQuality:
      'Calidad de las predicciones',
    intelligencePredictionReliability:
      'Qué tan fiables son las predicciones de Alias',
    intelligencePredictionsEvaluated:
      'Predicciones evaluadas',
    intelligencePredictionAccuracy:
      'Precisión de las predicciones',
    intelligenceAverageConfidence:
      'Probabilidad media prevista',
    intelligenceCalibrationGap:
      'Diferencia de calibración',
    intelligenceCalibrationStatus:
      'Estado de calibración',
    intelligenceCalibrationInsufficient:
      'Todavía no hay suficientes datos',
    intelligenceCalibrationOverconfident:
      'Alias está siendo demasiado confiado en sus predicciones',
    intelligenceCalibrationUnderconfident:
      'Alias está siendo demasiado prudente en sus predicciones',
    intelligenceCalibrationWellCalibrated:
      'Las predicciones están bien calibradas',
    launchConcierge: 'Lanzar concierge',
    continue: 'Continuar',
    floorPlan: 'Plano de Mesas',
    businessStepTitle: 'Cuéntanos sobre tu establecimiento',
    businessStepDescription:
      'Estos detalles ayudan a Alias a configurar tu workspace y personalizar la experiencia del concierge AI para tus clientes.',
    serviceStepTitle: 'Configuración de capacidad del restaurante',
    serviceStepDescription:
      'Configura la estructura de mesas de tu restaurante para que el concierge AI gestione mejor las reservas y disponibilidades.',
    openingHours: 'Horario de apertura',
    restaurantSchedule: 'Horario del restaurante',
    openingTime: 'Hora de apertura',
    closingTime: 'Hora de cierre',
    availabilityPageTitle: 'Disponibilidad',
    openingDays: 'Días de apertura',
    openingDaysDescription:
      'Selecciona los días en los que el restaurante está abierto.',
    open: 'Abierto',
    closed: 'Cerrado',
    seatingConfiguration: 'Configuración de mesas',
    tableDistribution: 'Distribución de mesas',
    totalTables: 'Mesas totales',
    numberOfTables: 'Número de mesas',
    seatsPerTable: 'Asientos por mesa',
    add: 'Añadir',
    noTableConfigurations: 'Todavía no se añadieron configuraciones.',
    totalSeats: 'Asientos totales',
    remove: 'Eliminar',
    monday: 'Lun',
    tuesday: 'Mar',
    wednesday: 'Mié',
    thursday: 'Jue',
    friday: 'Vie',
    saturday: 'Sáb',
    sunday: 'Dom',
    tonePickerTitle: 'Elige el tono del concierge',
    tonePickerDescription: 'Selecciona cómo el concierge AI debe comunicarse con tus clientes.',
    toneCardDescription: 'Perfil de comunicación premium para interacciones con clientes.',
    toneLuxury: 'Lujo',
    toneElegant: 'Elegante',
    toneCasual: 'Casual',
    toneModern: 'Moderno',
    toneLuxuryDescription:
      'Lenguaje refinado, exclusivo y premium para restaurantes de alto nivel.',
    toneElegantDescription:
      'Comunicación cuidada, cálida y elegante para un servicio refinado.',
    toneCasualDescription:
      'Tono amigable, relajado y accesible para locales informales.',
    toneModernDescription:
      'Lenguaje limpio, seguro y contemporáneo para espacios modernos.',
    launchTitle: 'Tu workspace está listo.',
    launchDescription: 'Alias configurará el workspace concierge para {restaurantName}.',
    estimatedSeats: 'Asientos estimados',
    successTitle: '{restaurantName} ya está activo en Alias.',
    successDescription:
      'El workspace del restaurante se ha creado correctamente y la prueba ya está activa.',
    restaurantId: 'ID del restaurante',
    reservationsTitle: 'Reservas',
    reservationsHeading: 'Resumen de reservas',
    liveReservationFeed: 'Feed de reservas en vivo',
    newReservation: 'Nueva reserva',
    manualBooking: 'Reserva manual',
    createReservationTitle: 'Crear reserva.',
    guestName: 'Nombre del cliente',
    phoneNumber: 'Número de teléfono',
    emailOptional: 'Email opcional',
    partySize: 'Número de personas',
    date: 'Fecha',
    time: 'Hora',
    specialRequestsOptional: 'Solicitudes especiales opcionales',
    creating: 'Creando…',
    createReservationButton: 'Crear reserva',
    timeColumn: 'Hora',
    guestColumn: 'Cliente',
    partyColumn: 'Personas',
    statusColumn: 'Estado',
    notesColumn: 'Notas',
    actionsColumn: 'Acciones',

    loadingReservations: 'Cargando reservas...',
    noReservations: 'No se encontraron reservas.',

    viewConversation: 'Ver conversación',
    aiConversation: 'Conversación AI',
    partyOfLabel: 'Mesa para',
    loadingConversation: 'Cargando conversación...',
    noConversationMessages: 'No se encontraron mensajes.',
    availabilityHeading: 'Gestiona los horarios de apertura.',
    availabilityDescription:
      'Gestiona el horario semanal y los cierres especiales por festivos, eventos privados o cierres inesperados.',

    weeklySchedule: 'Horario semanal',
    regularOpeningHours: 'Horario regular de apertura',
    weeklyScheduleDescription:
      'Configura los días y horarios de apertura utilizados por el concierge AI.',

    saveChanges: 'Guardar cambios',
    opening: 'Apertura',
    closing: 'Cierre',
    specialClosures: 'Cierres especiales',
    holidaysExceptions: 'Festivos y excepciones',
    specialClosuresDescription:
      'Añade festivos, eventos privados o cierres inesperados para que el concierge AI nunca confirme reservas cuando el restaurante esté cerrado.',
    closureReasonPlaceholder: 'Motivo (ej. Navidad)',
    addClosure: 'Añadir cierre',
    noSpecialClosures: 'Aún no hay cierres especiales.',
    availabilitySaved: 'Disponibilidad guardada correctamente.',
    availabilityLoadError: 'No se pudo cargar la disponibilidad.',
    availabilitySaveError: 'No se pudo guardar la disponibilidad.',

    closureDateRequired: 'Selecciona una fecha de cierre.',
    specialClosureAdded: 'Cierre especial añadido.',
    specialClosureRemoved: 'Cierre especial eliminado.',

    noRestaurantFound: 'No se encontró ningún restaurante.',
    noRestaurantSelected: 'Ningún restaurante seleccionado.',
    settingsHeading: 'Configuración del restaurante.',
    restaurantName: 'Nombre del restaurante',
    contactEmail: 'Email de contacto',
    openingHoursLabel: 'Horario de apertura',
    businessType: 'Tipo de negocio',
    conciergeTone: 'Tono del concierge',
    trialActive: 'Prueba activa',
    billingNextPhase:
      'La integración de pagos se conectará en la próxima fase del producto.',
    publicConcierge: 'Concierge público',
    shareEmbedTitle: 'Comparte o integra tu concierge AI.',
    shareEmbedDescription:
      'Usa este enlace público en tu sitio web, biografía de Instagram, perfil de Google Business, código QR o intégralo directamente con un iframe.',
    openConcierge: 'Abrir concierge',
    publicLink: 'Enlace público',
    iframeEmbedCode: 'Código iframe',
    createRestaurantFirst: 'Primero crea un restaurante.',
    copied: 'Copiado',
    copy: 'Copiar',
    qrAccess: 'Acceso QR',
    instantGuestAccess: 'Acceso instantáneo para clientes.',
    qrDescription:
      'Los clientes pueden escanear este código QR para abrir instantáneamente el concierge AI y reservar sin descargar ninguna app.',
    downloadQr: 'Descargar QR',
    qrAlt: 'Código QR Alias Concierge',
    analyticsHeading: 'Inteligencia para hospitality.',
    monthlyBookings: 'Reservas mensuales',
    noShowReduction: 'Reducción de no-show',
    automationRate: 'Tasa de automatización',
    estimated: 'estimado',
    resolved: 'resueltas',
    requestsByHour: 'Solicitudes por hora',
    totalBookings: 'Reservas totales',
    confirmedBookings: 'Reservas confirmadas',
    averagePartySize: 'Media de personas por mesa',
    bookingsByHour: 'Reservas por hora',
    realTime: 'tiempo real',
    guests: 'clientes',
    noAnalyticsData: 'Todavía no hay datos analytics.',
    statusConfirmed: 'Confirmada',
    statusPending: 'Pendiente',
    statusCancelled: 'Cancelada',
    statusCompleted: 'Completada',
    statusNoShow: 'No-show',
    subscriptionTrialing: 'Prueba',
    subscriptionActive: 'Activo',
    subscriptionCancelled: 'Cancelado',
    phoneNumberLabel: 'Número de teléfono',
    tablesLabel: 'mesas',
    seatsEachLabel: 'asientos cada una',
    support: 'Soporte',
    supportTitle: 'Soporte',
    supportHeading: '¿Necesitas ayuda?',
    supportDescription:
      'Nuestro equipo está aquí para ayudarte con onboarding, reservas, integraciones y configuración del concierge.',
    supportEmailTitle: 'Soporte por email',
    supportEmailDescription:
      'Contáctanos cuando quieras y te responderemos lo antes posible.',
    supportFastResponseTitle: 'Respuesta rápida',
    supportFastResponseDescription:
      'Normalmente respondemos en pocas horas durante días laborables.',
    goToDashboard: 'Ve a la dashboard',
    welcomeFlowHeading: 'Configuremos tu concierge AI.',
    welcomeFlowDescription:
      'Alias te ayudará a gestionar reservas, disponibilidad y comunicación con clientes desde un workspace simple.',
    verifyEmailHeading: 'Antes de continuar, verifica tu correo electrónico.',
    verifyEmailDescription:
      'Te hemos enviado un correo de verificación. Abre el enlace en tu bandeja de entrada y luego vuelve aquí para continuar.',
    emailVerifiedButton: 'He verificado mi correo',
    sendingVerificationEmail: 'Enviando email de verificación...',
    authHeroTitle: 'Operaciones de IA para lugares donde el servicio importa',
    authHeroDescription:
      'Crea el espacio de trabajo de tu restaurante, configura tu conserje de IA y comienza la prueba de 7 días en minutos.',
    authPrivateBeta: 'Beta privada',
    authCreateAccount: 'Crea tu cuenta Alias',
    authWelcomeBack: 'Bienvenido de nuevo a Alias',
    authRegister: 'Registrarse',
    authLogin: 'Iniciar sesión',
    authFullNamePlaceholder: 'Introduce tu nombre completo',
    authEmailPlaceholder: 'Introduce tu correo electrónico',
    authPasswordPlaceholder: 'Introduce tu contraseña',
    authForgotPassword: '¿Olvidaste tu contraseña?',
    authSendingResetLink: 'Enviando enlace de restablecimiento...',
    authPleaseWait: 'Por favor espera...',
    authStartTrial: 'Comenzar prueba de 7 días',
    authFooter: 'No se requiere instalación. Cancela cuando quieras.',
    privacyAcceptancePrefix: 'He leído y acepto la',
    privacyPolicy: 'Política de Privacidad',
    termsOfService: 'Términos de Servicio',
    privacyAcceptanceMiddle: 'y los',
    privacyRequired:
      'Antes de crear una cuenta debes leer y aceptar la Política de Privacidad y los Términos de Servicio.',
    welcomeToAlias: 'Bienvenido a Alias.',
    welcomeLanguageDescription:
      'Elige tu idioma antes de configurar tu restaurante.',
    searchAndSortReservations: 'Buscar y ordenar reservas',
    searchReservationsPlaceholder: 'Buscar por nombre, teléfono o email',
    newestFirst: 'Más recientes primero',
    oldestFirst: 'Más antiguas primero',
    emailRequired: 'Email obligatoria',
    emailRequiredError: 'El email del cliente es obligatorio para enviar la confirmación de la reserva.',
    automaticTableAssignment: 'Asignación automática de mesa',
    tableLabel: 'Mesa',
    seatsLabel: 'plazas',
    contactDetails: 'Contacto',
    welcome: 'Bienvenido',
    tableManagement: 'Gestión de mesas',
    restaurantTablesTitle: 'Mesas del restaurante.',
    restaurantTablesDescription:
      'Añade mesas físicas con números visibles y códigos internos de Alias para futuras asignaciones de reservas con IA.',
    tableNumberRequired: 'El número de mesa es obligatorio.',
    unableToLoadTables: 'No se pudieron cargar las mesas.',
    unableToCreateTable: 'No se pudo crear la mesa.',
    unableToDeleteTable: 'No se pudo eliminar la mesa.',
    tableNumberPlaceholder: 'Número de mesa',
    seatsPlaceholder: 'Plazas',
    addingTable: 'Añadiendo...',
    addTable: 'Añadir mesa',
    loadingTables: 'Cargando mesas...',
    noTablesAdded: 'Aún no se han añadido mesas.',
    restaurantLanguage: 'Idioma del restaurante',
    save: 'Guardar',
    saving: 'Guardando...',
    languageUpdatedSuccessfully: 'Idioma actualizado correctamente.',
    unableToUpdateLanguage: 'No se pudo actualizar el idioma.',
    trialTitle: 'Comienza tu prueba gratuita',
    trialDescription: 'Prueba Alias gratis durante 7 días. Después del período de prueba, tu suscripción se renovará automáticamente por 99 €/mes.',
    trialFeature1: 'Conserje IA',
    trialFeature2: 'Reservas automáticas',
    trialFeature3: 'Disponibilidad de mesas',
    trialFeature4: 'Widget público de reservas',
    trialFeature5: 'Soporte multilingüe',
    trialFeature6: 'Correos automáticos para clientes',
    trialButton: 'Comenzar prueba gratuita de 7 días',
    trialRedirecting: 'Redirigiendo...',
    trialFooter: 'Sin cargos hoy. Cancela cuando quieras desde tu portal de facturación.',
    trialError: 'No se pudo iniciar la prueba gratuita.',
    manageSubscription: 'Gestionar suscripción',
    freeTrial: 'Prueba gratuita',
    activeSubscription: 'Suscripción activa',
    lifetimeSubscription: 'Suscripción de por vida',
    inactiveSubscription: 'Suscripción inactiva',
    trialEnds: 'La prueba termina el',
    renewsOn: 'Se renueva el',
    noRenewalRequired: 'No requiere renovación',
    subscriptionRequired: 'Suscripción requerida',
    loadingBilling: 'Cargando suscripción',
    loadingBillingDescription: 'Comprobando el estado de la suscripción...',
    tableNumberLabel: 'Número de mesa',
    seatsPerTableLabel: 'Plazas',
    billing: 'Facturación',
    subscription: 'Suscripción',
    billingDescription: 'Gestiona tu suscripción de Alias, el período de prueba, el método de pago y el portal de clientes.',
    loadingBillingStatus: 'Cargando estado de suscripción...',
    currentPlan: 'Plan actual',
    lifetime: 'Vitalicio',
    inactive: 'Inactivo',
    account: 'Cuenta',
    trialUsed: 'Prueba utilizada',
    subscriptionStarts: 'Inicio de suscripción',
    subscriptionEnds: 'Fin de suscripción',
    yes: 'Sí',
    no: 'No',
    subscribeNow: 'Suscribirse ahora',
    startFreeTrial: 'Iniciar prueba gratuita',
    aliasProDescription: 'Desbloquea reservas con IA, gestión de mesas, disponibilidad, concierge público y automatización premium.',
    aiConcierge: 'Concierge IA',
    intelligenceEyebrow: 'Inteligencia de Alias',
    intelligenceTitle:
      'Alias está aprendiendo cómo gestionas tu restaurante.',
    intelligenceDescription:
      'Cada decisión sobre las mesas ayuda a Alias a comprender tus preferencias y ordenar futuras recomendaciones según tu forma de trabajar.',
    intelligenceRefresh: 'Actualizar',
    intelligenceLoading: 'Cargando Inteligencia de Alias...',
    intelligenceUnavailable: 'La Inteligencia de Alias no está disponible',
    intelligenceUnavailableDescription:
      'El perfil de inteligencia aún no está disponible.',
    intelligenceTryAgain: 'Reintentar',

    intelligenceLearning: 'Aprendizaje',
    intelligenceSuggestionsObserved: 'Sugerencias observadas',
    intelligenceManagerDecision: 'decisión del gerente',
    intelligenceManagerDecisions: 'decisiones del gerente',
    intelligenceAcceptanceRate: 'Tasa de aceptación',
    intelligenceAccepted: 'aceptadas',
    intelligenceReadRate: 'Tasa de lectura',
    intelligenceReviewed: 'revisadas',
    intelligenceLearningConfidence: 'Confianza del aprendizaje',
    intelligenceProfile: 'Perfil',

    intelligenceBehaviour: 'Comportamiento',
    intelligenceWhatLearned: 'Lo que Alias ha aprendido',
    intelligencePreferredPlan: 'Plan preferido',
    intelligenceTypicalAcceptedMoves: 'Movimientos aceptados habituales',
    intelligenceTypicalSeatWaste: 'Asientos libres habituales',
    intelligenceManagerTrust: 'Confianza del gerente',

    intelligenceAutomation: 'Automatización',
    intelligenceOperatingMode: 'Modo operativo actual',
    intelligencePreferredMoves: 'Movimientos preferidos',
    intelligencePreferredSeatWaste: 'Asientos libres preferidos',
    intelligenceAdvisoryDescription:
      'Alias seguirá presentando recomendaciones para que el gerente las revise explícitamente.',
    intelligenceAssistedDescription:
      'Alias puede priorizar los planes, pero la confirmación final sigue siendo del gerente.',
    intelligenceAutomationEligibleDescription:
      'Alias dispone de evidencia suficiente para admitir una futura automatización opcional.',

    intelligenceInsights: 'Insights',
    intelligenceUnderstands: 'Lo que Alias comprende actualmente',
    intelligenceEvidence: 'evidencias',

    intelligenceUnknown: 'Desconocida',
    intelligenceSingleMove: 'Un movimiento',
    intelligenceMultiMove: 'Varios movimientos',
    intelligenceLowSeatWaste: 'Bajo desperdicio de asientos',
    intelligenceFlexible: 'Flexible',
    intelligenceAdvisoryOnly: 'Solo asesoramiento',
    intelligenceAssisted: 'Asistida',
    intelligenceEligibleAutomation: 'Apta para automatización',
    intelligenceLow: 'Baja',
    intelligenceMedium: 'Media',
    intelligenceHigh: 'Alta',
    publicBookingWidget: 'Widget público de reservas',
    reservationManagement: 'Gestión de reservas',
    tableAvailability: 'Disponibilidad de mesas',
    customerEmails: 'Correos de clientes',
    multilingualSupport: 'Soporte multilingüe',   
    },

  fr: {
    overview: 'Vue générale',
    concierge: 'Concierge AI',
    onboarding: 'Onboarding',
    reservations: 'Réservations',
    availability: 'Disponibilité',
    availabilityTitle: 'Disponibilité',
    analytics: 'Analytiques',
    intelligenceAutomationPath:
      'Parcours vers l’automatisation',
    intelligenceCurrentLevel:
      'Niveau actuel',
    intelligenceNextLevel:
      'Niveau suivant',
    intelligenceRequirementBehaviourConfidence:
      'Confiance comportementale supérieure au niveau faible.',
    intelligenceRequirementCalibrationData:
      'Données de calibration suffisantes.',
    intelligenceRequirementManagerTrustHigh:
      'Confiance du manager au niveau élevé.',
    intelligenceRequirementBehaviourConfidenceHigh:
      'Confiance comportementale au niveau élevé.',
    intelligenceRequirementCalibrationWellCalibrated:
      'Prédictions bien calibrées.',
    intelligenceRequirementAutomationReached:
      'Conditions d’éligibilité à l’automatisation remplies.',
    seatingExecutionStatus:
      'Statut opérationnel',
    seatingExecutionReasonPolicyAdvisory:
      'Alias fonctionne actuellement en mode conseil uniquement.',
    seatingExecutionReasonManagerConfirmation:
      'La confirmation du manager est requise avant d’appliquer ce plan.',
    seatingExecutionReasonDecisionNotStrong:
      'La recommandation actuelle n’est pas assez forte pour une exécution automatique.',
    seatingExecutionReasonConfidenceNotHigh:
      'Le niveau de confiance de la prédiction n’est pas assez élevé pour une exécution automatique.',
    seatingExecutionReasonEligible:
      'Ce plan remplit actuellement les conditions requises pour une future exécution automatique.',
    settings: 'Paramètres',
    seatingDecisionReviewRecommended:
      'Révision du manager recommandée',
    seatingDecisionRecommended:
      'Recommandé par Alias',
    seatingDecisionStrongRecommendation:
      'Forte recommandation',
    seatingPlanMatchPreferences:
      'Compatibilité avec vos préférences',
    seatingPlanConfidence:
      'Confiance',
    seatingPlanPredictionDescription:
      'Cette estimation indique dans quelle mesure le plan correspond aux décisions de placement observées par Alias pour ce restaurant.',
    seatingPlanWhyRecommended:
      'Pourquoi Alias recommande ce plan',

    seatingReasonNoMovesTitle:
      'Aucun déplacement nécessaire',
    seatingReasonNoMovesDescription:
      'Ce plan peut être appliqué sans déplacer de réservation existante.',

    seatingReasonPreferredSingleMoveTitle:
      'Correspond à la structure de déplacement préférée',
    seatingReasonPreferredSingleMoveDescription:
      'Ce plan nécessite le déplacement d’une seule réservation, conformément aux préférences observées du manager.',

    seatingReasonPreferredMoveLimitTitle:
      'Dans la limite de déplacements préférée',
    seatingReasonPreferredMoveLimitDescription:
      'Le nombre de déplacements reste dans la plage actuellement préférée pour ce restaurant.',

    seatingReasonAboveMoveLimitTitle:
      'Plus de déplacements que d’habitude',
    seatingReasonAboveMoveLimitDescription:
      'Ce plan nécessite davantage de déplacements que la préférence actuellement apprise.',

    seatingReasonExactFitTitle:
      'Capacité parfaitement utilisée',
    seatingReasonExactFitDescription:
      'Ce plan ne crée aucune place inutilisée.',

    seatingReasonSeatWasteWithinTitle:
      'Places inutilisées dans la plage préférée',
    seatingReasonSeatWasteWithinDescription:
      'La capacité inutilisée reste dans la préférence apprise du restaurant.',

    seatingReasonSeatWasteHighTitle:
      'Plus de places inutilisées que d’habitude',
    seatingReasonSeatWasteHighDescription:
      'Ce plan laisse davantage de places inutilisées que les plans habituellement acceptés par le manager.',

    seatingReasonStrongScoreTitle:
      'Score technique élevé',
    seatingReasonStrongScoreDescription:
      'Le score technique est supérieur à la référence actuellement apprise.',

    seatingReasonLowScoreTitle:
      'Sous la référence apprise',
    seatingReasonLowScoreDescription:
      'Le score technique est inférieur à la référence actuelle, une validation du manager reste donc recommandée.',

    seatingReasonPersonalizationBonusTitle:
      'Favorisé par les préférences apprises',
    seatingReasonPersonalizationBonusDescription:
      'Alias a mieux classé ce plan après avoir appliqué les préférences apprises du restaurant.',

    seatingReasonPersonalizationPenaltyTitle:
      'Réduit par les préférences apprises',
    seatingReasonPersonalizationPenaltyDescription:
      'Alias a classé ce plan avec davantage de prudence après avoir appliqué les préférences apprises du restaurant.',
    trialDay: "Jour d'essai 3",
    intelligenceInsightManagerTrustTitle:
      'Niveau de confiance du manager',
    intelligenceInsightManagerTrustUnknown:
      'Il n’y a pas encore assez de données pour estimer de manière fiable la confiance du manager.',
    intelligenceInsightManagerTrustLow:
      'Le manager accepte actuellement peu de suggestions de placement proposées par Alias.',
    intelligenceInsightManagerTrustMedium:
      'Le manager accepte les suggestions d’Alias avec une fréquence modérée.',
    intelligenceInsightManagerTrustHigh:
      'Le manager accepte fréquemment les suggestions de placement d’Alias.',

    intelligenceInsightAcceptedScoreTitle:
      'Score moyen accepté',
    intelligenceInsightAcceptedScoreDescription:
      'Les plans de placement acceptés ont actuellement un score moyen de {value}.',

    intelligenceInsightPreferredPlanTitle:
      'Structure de plan préférée',
    intelligenceInsightPreferredPlanSingle:
      'Les plans acceptés nécessitent généralement le déplacement d’une seule réservation existante.',
    intelligenceInsightPreferredPlanMulti:
      'Les plans acceptés impliquent souvent plusieurs déplacements de réservations.',
    intelligenceInsightPreferredPlanLowWaste:
      'Les plans acceptés minimisent généralement les places inutilisées.',
    intelligenceInsightPreferredPlanFlexible:
      'Aucune structure de plan dominante ne s’est encore dégagée.',

    intelligenceInsightExpiredTitle:
      'Suggestions devenues obsolètes',
    intelligenceInsightExpiredDescription:
      '{value} suggestion(s) sont devenues obsolètes avant qu’une décision du manager ne soit enregistrée.',
    liveConcierge:
      'Votre concierge AI est actif et gère les demandes clients.',
    dashboard: 'Tableau de bord Alias',
    logout: 'Déconnexion',
    publicWelcome: "Bienvenue. Je suis le concierge de {restaurantName}. Je peux vous aider à réserver une table, vérifier les disponibilités ou transmettre des demandes spéciales à l'équipe.",
    publicReserveTitle: 'Réservez votre table avec le concierge du restaurant.',
    publicSecure: "Les détails de votre réservation sont envoyés de manière sécurisée à l'équipe du restaurant.",
    publicPlaceholder: 'Exemple : table pour 2 demain à 20h',
    publicPoweredBy: 'Powered by Alias Concierge AI',
    intelligenceInsightLowReviewRateTitle:
      'Faible taux de consultation des suggestions',
    intelligenceInsightLowReviewRateDescription:
      'Moins de la moitié des suggestions générées ont été consultées.',
    publicChecking: 'Alias vérifie les disponibilités…',
    publicReservationConfirmed: 'Réservation confirmée',
    publicBookingRegistered: 'Votre réservation est maintenant enregistrée chez {restaurantName}.',
    publicReservationId: 'ID de réservation',
    overviewTitle: 'Vue générale',
    goodEvening: 'Bonsoir',
    intelligenceDeveloping: 'En développement',
    seatingDecisionSummaryReview:
      'Alias recommande une révision par le manager avant d’accepter ce plan.',
    seatingDecisionSummaryRecommended:
      'Alias recommande ce plan, mais les données actuelles nécessitent encore une validation explicite du manager.',
    seatingDecisionSummaryStrong:
      'Alias considère ce plan comme fortement recommandé au vu des données actuelles et des préférences apprises.',

    seatingDecisionReasonCalibrationNotMature:
      'Alias ne dispose pas encore de suffisamment de prédictions évaluées pour considérer cette recommandation comme très fiable.',
    seatingDecisionReasonHighAcceptanceProbability:
      'Le plan correspond étroitement aux préférences de placement observées du manager.',
    seatingDecisionReasonLowAcceptanceProbability:
      'Le plan correspond relativement peu aux décisions observées du manager.',
    seatingDecisionReasonNoMovesRequired:
      'Le plan ne nécessite le déplacement d’aucune réservation existante.',
    seatingDecisionReasonAbovePreferredMoveLimit:
      'Le plan nécessite davantage de déplacements de réservations que la préférence apprise.',
    seatingDecisionReasonExactCapacityFit:
      'Le plan ne crée aucune place inutilisée.',
    seatingExecutionBlocked:
      'Bloqué',
    seatingExecutionManagerConfirmation:
      'Confirmation du manager requise',
    seatingExecutionEligible:
      'Éligible à l’exécution automatique',
    seatingDecisionReasonBelowRecommendedScore:
      'Le score technique est inférieur à la référence de recommandation actuellement apprise.',
    overviewSubtitle: 'Vue opérationnelle en direct alimentée par Alias Concierge AI.',
    trialModeActive: 'Mode essai actif',
    statReservations: 'Réservations',
    statConfirmed: 'Confirmées',
    statConcierge: 'Concierge',
    intelligenceInsightManagerTrustDeveloping:
      'La confiance du manager est encore en développement pendant qu’Alias observe davantage de décisions concernant les tables.',
    statSubscription: 'Abonnement',
    intelligencePredictionQuality:
      'Qualité des prédictions',
    intelligencePredictionReliability:
      'Fiabilité des prédictions d’Alias',
    intelligencePredictionsEvaluated:
      'Prédictions évaluées',
    intelligencePredictionAccuracy:
      'Précision des prédictions',
    intelligenceAverageConfidence:
      'Probabilité moyenne prédite',
    intelligenceCalibrationGap:
      'Écart de calibration',
    intelligenceCalibrationStatus:
      'État de la calibration',
    intelligenceCalibrationInsufficient:
      'Pas encore assez de données',
    intelligenceCalibrationOverconfident:
      'Alias est actuellement trop confiant dans ses prédictions',
    intelligenceCalibrationUnderconfident:
      'Alias est actuellement trop prudent dans ses prédictions',
    intelligenceCalibrationWellCalibrated:
      'Les prédictions sont bien calibrées',
    liveActivity: 'Activité en direct',
    recentReservations: 'Réservations récentes.',
    live: 'En direct',
    loadingActivity: "Chargement de l'activité...",
    noActivity: 'Aucune activité pour le moment.',
    partyOf: 'Table pour',
    conciergeTitle: 'Concierge AI',
    conciergeHeading: 'Couche de conversation client.',
    conciergeSubtitle:
      'Voici le concierge destiné aux clients qui gérera automatiquement les réservations et demandes de service.',
    conciergeLiveConnection: 'Connexion AI en direct',
    conciergeWelcome:
      'Bonsoir. Je suis Alias Concierge. Je peux aider les clients avec les réservations, disponibilités et demandes de service.',
    conciergeThinking: 'Alias réfléchit…',
    conciergePlaceholder: 'Demandez une table à Alias Concierge...',
    conciergeError:
      'Désolé, une erreur est survenue lors du contact avec le service AI.',
    onboardingTitle: 'Onboarding',
    onboardingHeading: 'Configurez votre concierge AI.',
    back: 'Retour',
    launching: 'Lancement…',
    launchConcierge: 'Lancer le concierge',
    continue: 'Continuer',
    businessStepTitle: 'Parlez-nous de votre établissement',
    businessStepDescription:
      'Ces informations aident Alias à configurer votre espace de travail et à personnaliser l’expérience du concierge AI pour vos clients.',
    serviceStepTitle: 'Configuration de capacité du restaurant',
    serviceStepDescription:
      'Configurez la disposition des tables afin que le concierge AI puisse mieux gérer les réservations et disponibilités.',
    openingHours: 'Horaires d’ouverture',
    restaurantSchedule: 'Programme du restaurant',
    openingTime: 'Heure d’ouverture',
    closingTime: 'Heure de fermeture',
    availabilityPageTitle: 'Disponibilité',
    openingDays: 'Jours d’ouverture',
    floorPlan: 'Plan de Salle',
    openingDaysDescription:
      'Sélectionnez les jours où le restaurant est ouvert.',
    open: 'Ouvert',
    closed: 'Fermé',
    seatingConfiguration: 'Configuration des tables',
    tableDistribution: 'Répartition des tables',
    totalTables: 'Tables totales',
    numberOfTables: 'Nombre de tables',
    seatsPerTable: 'Places par table',
    add: 'Ajouter',
    noTableConfigurations: 'Aucune configuration ajoutée.',
    totalSeats: 'Places totales',
    remove: 'Supprimer',
    monday: 'Lun',
    tuesday: 'Mar',
    wednesday: 'Mer',
    thursday: 'Jeu',
    friday: 'Ven',
    saturday: 'Sam',
    sunday: 'Dim',
    tonePickerTitle: 'Choisissez le ton du concierge',
    tonePickerDescription: 'Sélectionnez comment le concierge AI doit communiquer avec vos clients.',
    toneCardDescription: 'Profil de communication premium pour les interactions clients.',
    toneLuxury: 'Luxe',
    toneElegant: 'Élégant',
    toneCasual: 'Décontracté',
    toneModern: 'Moderne',
    toneLuxuryDescription:
      'Langage raffiné, exclusif et premium pour la restauration haut de gamme.',
    toneElegantDescription:
      'Communication soignée, chaleureuse et élégante pour un service raffiné.',
    toneCasualDescription:
      'Ton amical, détendu et accessible pour les établissements informels.',
    toneModernDescription:
      'Langage propre, confiant et contemporain pour les lieux modernes.',
    launchTitle: 'Votre workspace est prêt.',
    launchDescription: 'Alias configurera le workspace concierge pour {restaurantName}.',
    estimatedSeats: 'Places estimées',
    successTitle: '{restaurantName} est maintenant actif sur Alias.',
    successDescription:
      'Le workspace du restaurant a été créé avec succès et la période d’essai est maintenant active.',
    restaurantId: 'ID du restaurant',
    reservationsTitle: 'Réservations',
    reservationsHeading: 'Vue d’ensemble des réservations',
    liveReservationFeed: 'Flux de réservations en direct',
    newReservation: 'Nouvelle réservation',
    manualBooking: 'Réservation manuelle',
    createReservationTitle: 'Créer une réservation.',
    guestName: 'Nom du client',
    phoneNumber: 'Numéro de téléphone',
    emailOptional: 'Email optionnel',
    partySize: 'Nombre de personnes',
    date: 'Date',
    time: 'Heure',
    specialRequestsOptional: 'Demandes spéciales optionnelles',
    creating: 'Création…',
    createReservationButton: 'Créer une réservation',
    timeColumn: 'Heure',
    guestColumn: 'Client',
    partyColumn: 'Personnes',
    statusColumn: 'Statut',
    notesColumn: 'Notes',
    actionsColumn: 'Actions',

    loadingReservations: 'Chargement des réservations...',
    noReservations: 'Aucune réservation trouvée.',

    viewConversation: 'Voir la conversation',
    aiConversation: 'Conversation AI',
    partyOfLabel: 'Table pour',
    loadingConversation: 'Chargement de la conversation...',
    noConversationMessages: 'Aucun message trouvé.',
    availabilityHeading: 'Gérez vos horaires d’ouverture.',
    availabilityDescription:
      'Gérez le planning hebdomadaire et les fermetures spéciales pour les jours fériés, événements privés ou fermetures imprévues.',

    weeklySchedule: 'Planning hebdomadaire',
    regularOpeningHours: 'Horaires d’ouverture réguliers',
    weeklyScheduleDescription:
      'Définissez les jours et horaires d’ouverture utilisés par le concierge AI.',

    saveChanges: 'Enregistrer les modifications',
    opening: 'Ouverture',
    closing: 'Fermeture',
    specialClosures: 'Fermetures spéciales',
    holidaysExceptions: 'Jours fériés et exceptions',
    specialClosuresDescription:
      'Ajoutez des jours fériés, événements privés ou fermetures imprévues afin que le concierge AI ne confirme jamais de réservations lorsque le restaurant est fermé.',
    closureReasonPlaceholder: 'Raison (ex. Noël)',
    addClosure: 'Ajouter une fermeture',
    noSpecialClosures: 'Aucune fermeture spéciale ajoutée.',
    availabilitySaved: 'Disponibilité enregistrée avec succès.',
    availabilityLoadError: 'Impossible de charger la disponibilité.',
    availabilitySaveError: 'Impossible d’enregistrer la disponibilité.',

    closureDateRequired: 'Sélectionnez une date de fermeture.',
    specialClosureAdded: 'Fermeture spéciale ajoutée.',
    specialClosureRemoved: 'Fermeture spéciale supprimée.',

    noRestaurantFound: 'Aucun restaurant trouvé.',
    noRestaurantSelected: 'Aucun restaurant sélectionné.',
    settingsHeading: 'Paramètres du restaurant.',
    restaurantName: 'Nom du restaurant',
    contactEmail: 'Email de contact',
    openingHoursLabel: 'Horaires d’ouverture',
    businessType: 'Type d’activité',
    conciergeTone: 'Ton du concierge',
    trialActive: 'Essai actif',
    billingNextPhase:
      'L’intégration de la facturation sera connectée dans la prochaine phase du produit.',
    publicConcierge: 'Concierge public',
    shareEmbedTitle: 'Partagez ou intégrez votre concierge AI.',
    shareEmbedDescription:
      'Utilisez ce lien public sur votre site web, bio Instagram, profil Google Business, QR code ou intégrez-le directement avec un iframe.',
    openConcierge: 'Ouvrir le concierge',
    publicLink: 'Lien public',
    iframeEmbedCode: 'Code iframe',
    createRestaurantFirst: 'Créez d’abord un restaurant.',
    copied: 'Copié',
    copy: 'Copier',
    qrAccess: 'Accès QR',
    instantGuestAccess: 'Accès instantané pour les clients.',
    qrDescription:
      'Les clients peuvent scanner ce QR code pour ouvrir instantanément votre concierge AI et réserver sans télécharger d’application.',
    downloadQr: 'Télécharger QR',
    qrAlt: 'QR code Alias Concierge',
    analyticsHeading: 'Intelligence pour l’hospitality.',
    monthlyBookings: 'Réservations mensuelles',
    noShowReduction: 'Réduction des no-shows',
    automationRate: 'Taux d’automatisation',
    estimated: 'estimé',
    resolved: 'résolues',
    requestsByHour: 'Demandes par heure',
    totalBookings: 'Réservations totales',
    confirmedBookings: 'Réservations confirmées',
    averagePartySize: 'Moyenne de personnes par table',
    bookingsByHour: 'Réservations par heure',
    realTime: 'temps réel',
    guests: 'clients',
    noAnalyticsData: 'Aucune donnée analytics disponible.',
    statusConfirmed: 'Confirmée',
    statusPending: 'En attente',
    statusCancelled: 'Annulée',
    statusCompleted: 'Terminée',
    statusNoShow: 'No-show',
    subscriptionTrialing: 'Essai',
    subscriptionActive: 'Actif',
    subscriptionCancelled: 'Annulé',
    phoneNumberLabel: 'Numéro de téléphone',
    tablesLabel: 'tables',
    seatsEachLabel: 'places chacune',
    support: 'Support',
    supportTitle: 'Support',
    supportHeading: 'Besoin d’aide ?',
    supportDescription:
      'Notre équipe est là pour vous aider avec l’onboarding, les réservations, les intégrations et la configuration du concierge.',
    supportEmailTitle: 'Support email',
    supportEmailDescription:
      'Contactez-nous à tout moment et nous vous répondrons dès que possible.',
    supportFastResponseTitle: 'Réponse rapide',
    supportFastResponseDescription:
      'Nous répondons généralement en quelques heures pendant les jours ouvrés.',
    goToDashboard: 'va au tableau de bord',
    welcomeFlowHeading: 'Configurons votre concierge AI.',
    welcomeFlowDescription:
      'Alias vous aidera à gérer les réservations, les disponibilités et la communication client depuis un workspace simple.',
    verifyEmailHeading: 'Avant de continuer, vérifiez votre adresse e-mail.',
    verifyEmailDescription:
      'Nous vous avons envoyé un e-mail de vérification. Ouvrez le lien dans votre boîte de réception puis revenez ici pour continuer.',
    emailVerifiedButton: "J'ai vérifié mon e-mail",
    sendingVerificationEmail: 'Envoi de l’e-mail de vérification...',
    authHeroTitle: 'Des opérations IA pour les lieux où le service compte',
    authHeroDescription:
      'Créez l’espace de travail de votre restaurant, configurez votre concierge IA et démarrez l’essai de 7 jours en quelques minutes.',
    authPrivateBeta: 'Bêta privée',
    authCreateAccount: 'Créez votre compte Alias',
    authWelcomeBack: 'Bon retour sur Alias',
    authRegister: "S'inscrire",
    authLogin: 'Connexion',
    authFullNamePlaceholder: 'Entrez votre nom complet',
    authEmailPlaceholder: 'Entrez votre adresse e-mail',
    authPasswordPlaceholder: 'Entrez votre mot de passe',
    authForgotPassword: 'Mot de passe oublié ?',
    authSendingResetLink: 'Envoi du lien de réinitialisation...',
    authPleaseWait: 'Veuillez patienter...',
    authStartTrial: "Commencer l'essai de 7 jours",
    authFooter: 'Aucune installation requise. Annulez à tout moment.',
    privacyAcceptancePrefix: "J'ai lu et j'accepte la",
    privacyPolicy: 'Politique de Confidentialité',
    termsOfService: "Conditions d'Utilisation",
    privacyAcceptanceMiddle: 'et les',
    privacyRequired:
      "Avant de créer un compte, vous devez lire et accepter la Politique de Confidentialité et les Conditions d'Utilisation.",
    welcomeToAlias: 'Bienvenue sur Alias.',
    welcomeLanguageDescription:
      'Choisissez votre langue avant de configurer votre restaurant.',
    searchAndSortReservations: 'Rechercher et trier les réservations',
    searchReservationsPlaceholder: 'Rechercher par nom, téléphone ou email',
    newestFirst: 'Plus récentes d’abord',
    oldestFirst: 'Plus anciennes d’abord',
    emailRequired: 'Email obligatoire',
    emailRequiredError: "L’email du client est obligatoire pour envoyer la confirmation de réservation.",
    automaticTableAssignment: 'Attribution automatique de table',
    tableLabel: 'Table',
    seatsLabel: 'places',
    contactDetails: 'Contact',
    welcome: 'Bienvenue',
    tableManagement: 'Gestion des tables',
    restaurantTablesTitle: 'Tables du restaurant.',
    restaurantTablesDescription:
      'Ajoutez des tables physiques avec des numéros visibles et des codes internes Alias pour les futures attributions de réservations par IA.',
    tableNumberRequired: 'Le numéro de table est obligatoire.',
    unableToLoadTables: 'Impossible de charger les tables.',
    unableToCreateTable: 'Impossible de créer la table.',
    unableToDeleteTable: 'Impossible de supprimer la table.',
    tableNumberPlaceholder: 'Numéro de table',
    seatsPlaceholder: 'Places',
    addingTable: 'Ajout...',
    addTable: 'Ajouter une table',
    loadingTables: 'Chargement des tables...',
    noTablesAdded: 'Aucune table ajoutée.',
    restaurantLanguage: 'Langue du restaurant',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    languageUpdatedSuccessfully: 'Langue mise à jour avec succès.',
    unableToUpdateLanguage: 'Impossible de mettre à jour la langue.',
    trialTitle: 'Commencez votre essai gratuit',
    trialDescription: 'Essayez Alias gratuitement pendant 7 jours. Après l’essai, votre abonnement se renouvelle automatiquement à 99 €/mois.',
    trialFeature1: 'Conciergerie IA',
    trialFeature2: 'Réservations automatiques',
    trialFeature3: 'Disponibilité des tables',
    trialFeature4: 'Widget de réservation public',
    trialFeature5: 'Support multilingue',
    trialFeature6: 'Emails automatiques aux clients',
    trialButton: 'Commencer l’essai gratuit de 7 jours',
    trialRedirecting: 'Redirection...',
    trialFooter: 'Aucun paiement aujourd’hui. Annulez à tout moment depuis votre portail client.',
    trialError: 'Impossible de démarrer l’essai gratuit.',
    manageSubscription: 'Gérer l’abonnement',
    freeTrial: 'Essai gratuit',
    activeSubscription: 'Abonnement actif',
    lifetimeSubscription: 'Abonnement à vie',
    inactiveSubscription: 'Abonnement inactif',
    trialEnds: 'L’essai se termine le',
    renewsOn: 'Renouvellement le',
    noRenewalRequired: 'Aucun renouvellement requis',
    subscriptionRequired: 'Abonnement requis',
    loadingBilling: 'Chargement de l’abonnement',
    loadingBillingDescription: 'Vérification du statut de l’abonnement...',
    tableNumberLabel: 'Numéro de table',
    seatsPerTableLabel: 'Places',
    billing: 'Facturation',
    subscription: 'Abonnement',
    billingDescription: 'Gérez votre abonnement Alias, votre période d’essai, votre moyen de paiement et votre portail client.',
    loadingBillingStatus: 'Chargement du statut d’abonnement...',
    currentPlan: 'Forfait actuel',
    lifetime: 'À vie',
    inactive: 'Inactif',
    account: 'Compte',
    trialUsed: 'Essai utilisé',
    subscriptionStarts: 'Début de l’abonnement',
    subscriptionEnds: 'Fin de l’abonnement',
    yes: 'Oui',
    no: 'Non',
    subscribeNow: 'S’abonner maintenant',
    intelligence: 'Intelligence Alias',
    intelligenceEyebrow: 'Intelligence Alias',
    intelligenceTitle:
      'Alias apprend comment vous gérez votre restaurant.',
    intelligenceDescription:
      'Chaque décision concernant les tables aide Alias à comprendre vos préférences et à classer les futures recommandations selon votre façon de travailler.',
    intelligenceRefresh: 'Actualiser',
    intelligenceLoading: 'Chargement d’Alias Intelligence...',
    intelligenceUnavailable: 'Alias Intelligence est indisponible',
    intelligenceUnavailableDescription:
      'Le profil d’intelligence n’est pas encore disponible.',
    intelligenceTryAgain: 'Réessayer',

    intelligenceLearning: 'Apprentissage',
    intelligenceSuggestionsObserved: 'Suggestions observées',
    intelligenceManagerDecision: 'décision du manager',
    intelligenceManagerDecisions: 'décisions du manager',
    intelligenceAcceptanceRate: 'Taux d’acceptation',
    intelligenceAccepted: 'acceptées',
    intelligenceReadRate: 'Taux de lecture',
    intelligenceReviewed: 'consultées',
    intelligenceLearningConfidence: 'Confiance d’apprentissage',
    intelligenceProfile: 'Profil',

    intelligenceBehaviour: 'Comportement',
    intelligenceWhatLearned: 'Ce qu’Alias a appris',
    intelligencePreferredPlan: 'Plan préféré',
    intelligenceTypicalAcceptedMoves: 'Déplacements acceptés habituels',
    intelligenceTypicalSeatWaste: 'Places inutilisées habituelles',
    intelligenceManagerTrust: 'Confiance du manager',

    intelligenceAutomation: 'Automatisation',
    intelligenceOperatingMode: 'Mode de fonctionnement actuel',
    intelligencePreferredMoves: 'Déplacements préférés',
    intelligencePreferredSeatWaste: 'Places inutilisées préférées',
    intelligenceAdvisoryDescription:
      'Alias continuera à présenter les recommandations de placement pour validation explicite du manager.',
    intelligenceAssistedDescription:
      'Alias peut prioriser les plans, mais la confirmation finale reste au manager.',
    intelligenceAutomationEligibleDescription:
      'Alias dispose de suffisamment de données pour permettre une future automatisation optionnelle.',

    intelligenceInsights: 'Insights',
    intelligenceUnderstands: 'Ce qu’Alias comprend actuellement',
    intelligenceEvidence: 'éléments de preuve',

    intelligenceUnknown: 'Inconnue',
    intelligenceSingleMove: 'Un déplacement',
    intelligenceMultiMove: 'Plusieurs déplacements',
    intelligenceLowSeatWaste: 'Faible perte de places',
    intelligenceFlexible: 'Flexible',
    intelligenceAdvisoryOnly: 'Conseil uniquement',
    intelligenceAssisted: 'Assisté',
    intelligenceEligibleAutomation: 'Éligible à l’automatisation',
    intelligenceLow: 'Faible',
    intelligenceMedium: 'Moyenne',
    intelligenceHigh: 'Élevée',
    startFreeTrial: 'Commencer l’essai gratuit',
    aliasProDescription: 'Débloquez les réservations IA, la gestion des tables, les disponibilités, le concierge public et les automatisations premium.',
    aiConcierge: 'Concierge IA',
    publicBookingWidget: 'Widget public de réservation',
    reservationManagement: 'Gestion des réservations',
    tableAvailability: 'Disponibilité des tables',
    customerEmails: 'Emails clients',
    multilingualSupport: 'Support multilingue',
  },
  de: {
    overview: 'Übersicht',
    concierge: 'Concierge AI',
    onboarding: 'Onboarding',
    reservations: 'Reservierungen',
    availability: 'Verfügbarkeit',
    availabilityTitle: 'Verfügbarkeit',
    analytics: 'Analysen',
    intelligenceAutomationPath:
      'Weg zur Automatisierung',
    intelligenceCurrentLevel:
      'Aktueller Stand',
    intelligenceNextLevel:
      'Nächste Stufe',
    intelligenceRequirementBehaviourConfidence:
      'Verhaltenskonfidenz über dem niedrigen Niveau.',
    intelligenceRequirementCalibrationData:
      'Ausreichende Kalibrierungsdaten.',
    intelligenceRequirementManagerTrustHigh:
      'Vertrauen des Managers auf hohem Niveau.',
    intelligenceRequirementBehaviourConfidenceHigh:
      'Verhaltenskonfidenz auf hohem Niveau.',
    intelligenceRequirementCalibrationWellCalibrated:
      'Gut kalibrierte Vorhersagen.',
    intelligenceRequirementAutomationReached:
      'Voraussetzungen für die Automatisierungsberechtigung erfüllt.',
    settings: 'Einstellungen',
    seatingExecutionStatus:
      'Betriebsstatus',
    seatingExecutionReasonPolicyAdvisory:
      'Alias arbeitet derzeit ausschließlich im Beratungsmodus.',
    seatingExecutionReasonManagerConfirmation:
      'Vor der Anwendung dieses Plans ist die Bestätigung durch den Manager erforderlich.',
    seatingExecutionReasonDecisionNotStrong:
      'Die aktuelle Empfehlung ist nicht stark genug für eine automatische Ausführung.',
    seatingExecutionReasonConfidenceNotHigh:
      'Die Vorhersagekonfidenz ist nicht hoch genug für eine automatische Ausführung.',
    seatingExecutionReasonEligible:
      'Dieser Plan erfüllt derzeit die Voraussetzungen für eine zukünftige automatische Ausführung.',
    trialDay: 'Testtag 3',
    seatingDecisionReviewRecommended:
      'Überprüfung durch den Manager empfohlen',
    seatingDecisionRecommended:
      'Von Alias empfohlen',
    seatingDecisionStrongRecommendation:
      'Starke Empfehlung',
    liveConcierge:
      'Ihr AI-Concierge ist aktiv und bearbeitet Gästeanfragen.',
    dashboard: 'Alias Dashboard',
    logout: 'Abmelden',
    publicWelcome: 'Willkommen. Ich bin der Concierge von {restaurantName}. Ich kann Ihnen helfen, einen Tisch zu reservieren, Verfügbarkeiten zu prüfen oder Sonderwünsche an das Team weiterzugeben.',
    publicReserveTitle: 'Reservieren Sie Ihren Tisch mit dem Concierge des Restaurants.',
    publicSecure: 'Ihre Buchungsdaten werden sicher an das Restaurantteam gesendet.',
    publicPlaceholder: 'Beispiel: Tisch für 2 morgen um 20 Uhr',
    publicPoweredBy: 'Powered by Alias Concierge AI',
    publicLiveAI: 'Live AI',
    publicChecking: 'Alias prüft die Verfügbarkeit…',
    publicReservationConfirmed: 'Reservierung bestätigt',
    publicBookingRegistered: 'Ihre Reservierung ist jetzt bei {restaurantName} registriert.',
    publicReservationId: 'Reservierungs-ID',
    overviewTitle: 'Übersicht',
    goodEvening: 'Guten Abend',
    overviewSubtitle: 'Live-Betriebsübersicht unterstützt von Alias Concierge AI.',
    trialModeActive: 'Testmodus aktiv',
    statReservations: 'Reservierungen',
    statConfirmed: 'Bestätigt',
    statConcierge: 'Concierge',
    statSubscription: 'Abonnement',
    intelligenceInsightLowReviewRateTitle:
      'Niedrige Überprüfungsrate der Vorschläge',
    intelligenceInsightLowReviewRateDescription:
      'Weniger als die Hälfte der generierten Vorschläge wurde überprüft.',
    intelligenceInsightManagerTrustDeveloping:
      'Das Vertrauen des Managers befindet sich noch im Aufbau, während Alias weitere Tischentscheidungen beobachtet.',
    seatingPlanMatchPreferences:
      'Übereinstimmung mit Ihren Präferenzen',
    seatingPlanConfidence:
      'Konfidenz',
    seatingPlanPredictionDescription:
      'Diese Schätzung zeigt, wie gut der Plan zu den von Alias beobachteten Tischentscheidungen dieses Restaurants passt.',
    seatingPlanWhyRecommended:
      'Warum Alias diesen Plan empfiehlt',

    seatingReasonNoMovesTitle:
      'Keine Reservierungsverschiebung erforderlich',
    seatingReasonNoMovesDescription:
      'Dieser Plan kann ohne Verschiebung bestehender Reservierungen angewendet werden.',

    seatingReasonPreferredSingleMoveTitle:
      'Entspricht der bevorzugten Verschiebungsstruktur',
    seatingReasonPreferredSingleMoveDescription:
      'Dieser Plan erfordert nur die Verschiebung einer Reservierung und entspricht damit den beobachteten Präferenzen des Managers.',

    seatingReasonPreferredMoveLimitTitle:
      'Innerhalb der bevorzugten Verschiebungsgrenze',
    seatingReasonPreferredMoveLimitDescription:
      'Die Anzahl der Verschiebungen liegt im aktuell bevorzugten Bereich dieses Restaurants.',

    seatingReasonAboveMoveLimitTitle:
      'Mehr Verschiebungen als üblich',
    seatingReasonAboveMoveLimitDescription:
      'Dieser Plan erfordert mehr Verschiebungen als derzeit bevorzugt.',

    seatingReasonExactFitTitle:
      'Exakte Kapazitätsauslastung',
    seatingReasonExactFitDescription:
      'Dieser Plan erzeugt keine ungenutzten Sitzplätze.',

    seatingReasonSeatWasteWithinTitle:
      'Ungenutzte Plätze im bevorzugten Bereich',
    seatingReasonSeatWasteWithinDescription:
      'Die ungenutzte Kapazität bleibt innerhalb der gelernten Präferenz des Restaurants.',

    seatingReasonSeatWasteHighTitle:
      'Mehr ungenutzte Plätze als üblich',
    seatingReasonSeatWasteHighDescription:
      'Dieser Plan lässt mehr Sitzplätze ungenutzt als die üblicherweise vom Manager akzeptierten Pläne.',

    seatingReasonStrongScoreTitle:
      'Hoher technischer Score',
    seatingReasonStrongScoreDescription:
      'Der technische Score liegt über der aktuell gelernten Referenz.',

    seatingReasonLowScoreTitle:
      'Unterhalb der gelernten Referenz',
    seatingReasonLowScoreDescription:
      'Der technische Score liegt unter der aktuell gelernten Referenz, daher wird eine Managerprüfung empfohlen.',

    seatingReasonPersonalizationBonusTitle:
      'Durch gelernte Präferenzen aufgewertet',
    seatingReasonPersonalizationBonusDescription:
      'Alias hat diesen Plan nach Anwendung der gelernten Restaurantpräferenzen höher eingestuft.',

    seatingReasonPersonalizationPenaltyTitle:
      'Durch gelernte Präferenzen abgewertet',
    seatingReasonPersonalizationPenaltyDescription:
      'Alias hat diesen Plan nach Anwendung der gelernten Restaurantpräferenzen vorsichtiger eingestuft.',
    liveActivity: 'Live-Aktivität',
    recentReservations: 'Aktuelle Reservierungen.',
    live: 'Live',
    loadingActivity: 'Aktivität wird geladen...',
    noActivity: 'Noch keine Aktivität.',
    partyOf: 'Tisch für',
    conciergeTitle: 'Concierge AI',
    conciergeHeading: 'Gesprächsebene für Gäste.',
    conciergeSubtitle:
      'Dies ist der kundenorientierte Concierge, der Reservierungen und Serviceanfragen automatisch verwaltet.',
    conciergeLiveConnection: 'Live AI-Verbindung',
    conciergeWelcome:
      'Guten Abend. Ich bin Alias Concierge. Ich kann Gästen bei Reservierungen, Verfügbarkeiten und Serviceanfragen helfen.',
    conciergeThinking: 'Alias denkt nach…',
    conciergePlaceholder: 'Fragen Sie Alias Concierge nach einem Tisch...',
    conciergeError:
      'Entschuldigung, beim Kontaktieren des AI-Dienstes ist ein Fehler aufgetreten.',
    onboardingTitle: 'Onboarding',
    onboardingHeading: 'Konfigurieren Sie Ihren AI-Concierge.',
    back: 'Zurück',
    launching: 'Wird gestartet…',
    launchConcierge: 'Concierge starten',
    intelligenceInsightManagerTrustTitle:
      'Vertrauensniveau des Managers',
    intelligenceInsightManagerTrustUnknown:
      'Es liegen noch nicht genügend Daten vor, um das Vertrauen des Managers zuverlässig einzuschätzen.',
    intelligenceInsightManagerTrustLow:
      'Der Manager akzeptiert derzeit nur wenige Sitzplatzvorschläge von Alias.',
    intelligenceInsightManagerTrustMedium:
      'Der Manager akzeptiert Alias-Vorschläge mit mittlerer Häufigkeit.',
    intelligenceInsightManagerTrustHigh:
      'Der Manager akzeptiert Sitzplatzvorschläge von Alias häufig.',

    intelligenceInsightAcceptedScoreTitle:
      'Durchschnittlicher akzeptierter Score',
    intelligenceInsightAcceptedScoreDescription:
      'Akzeptierte Sitzpläne haben derzeit einen durchschnittlichen Score von {value}.',

    intelligenceInsightPreferredPlanTitle:
      'Bevorzugte Planstruktur',
    intelligenceInsightPreferredPlanSingle:
      'Akzeptierte Pläne erfordern normalerweise nur die Verschiebung einer bestehenden Reservierung.',
    intelligenceInsightPreferredPlanMulti:
      'Akzeptierte Pläne beinhalten häufig mehrere Reservierungsverschiebungen.',
    intelligenceInsightPreferredPlanLowWaste:
      'Akzeptierte Pläne minimieren normalerweise ungenutzte Sitzplätze.',
    intelligenceInsightPreferredPlanFlexible:
      'Es hat sich noch keine dominante Planstruktur herausgebildet.',

    intelligenceInsightExpiredTitle:
      'Veraltete Vorschläge',
    intelligenceInsightExpiredDescription:
      '{value} Vorschlag/Vorschläge wurden veraltet, bevor eine Managerentscheidung aufgezeichnet wurde.',
    continue: 'Weiter',
    intelligencePredictionQuality:
      'Vorhersagequalität',
    intelligencePredictionReliability:
      'Wie zuverlässig die Vorhersagen von Alias sind',
    intelligencePredictionsEvaluated:
      'Ausgewertete Vorhersagen',
    intelligencePredictionAccuracy:
      'Vorhersagegenauigkeit',
    intelligenceAverageConfidence:
      'Durchschnittlich vorhergesagte Wahrscheinlichkeit',
    intelligenceCalibrationGap:
      'Kalibrierungsabweichung',
    intelligenceCalibrationStatus:
      'Kalibrierungsstatus',
    intelligenceCalibrationInsufficient:
      'Noch nicht genügend Daten',
    intelligenceCalibrationOverconfident:
      'Alias ist derzeit zu sicher in seinen Vorhersagen',
    intelligenceCalibrationUnderconfident:
      'Alias ist derzeit zu vorsichtig in seinen Vorhersagen',
    intelligenceCalibrationWellCalibrated:
      'Die Vorhersagen sind gut kalibriert',
    businessStepTitle: 'Erzählen Sie uns von Ihrem Betrieb',
    businessStepDescription:
      'Diese Details helfen Alias, Ihren Workspace einzurichten und das AI-Concierge-Erlebnis für Ihre Gäste zu personalisieren.',
    serviceStepTitle: 'Restaurantkapazität konfigurieren',
    serviceStepDescription:
      'Konfigurieren Sie die Tischstruktur Ihres Restaurants, damit der AI-Concierge Reservierungen und Verfügbarkeiten besser verwalten kann.',
    openingHours: 'Öffnungszeiten',
    restaurantSchedule: 'Restaurantplan',
    openingTime: 'Öffnungszeit',
    closingTime: 'Schließzeit',
    availabilityPageTitle: 'Verfügbarkeit',
    seatingExecutionBlocked:
      'Blockiert',
    seatingExecutionManagerConfirmation:
      'Bestätigung durch den Manager erforderlich',
    seatingExecutionEligible:
      'Für automatische Ausführung geeignet',
    openingDays: 'Öffnungstage',
    openingDaysDescription:
      'Wählen Sie die Tage aus, an denen das Restaurant geöffnet ist.',
    open: 'Geöffnet',
    closed: 'Geschlossen',
    seatingConfiguration: 'Tischkonfiguration',
    tableDistribution: 'Tischverteilung',
    totalTables: 'Gesamttische',
    numberOfTables: 'Anzahl der Tische',
    seatsPerTable: 'Sitze pro Tisch',
    add: 'Hinzufügen',
    seatingDecisionSummaryReview:
      'Alias empfiehlt eine Überprüfung durch den Manager, bevor dieser Plan angenommen wird.',
    seatingDecisionSummaryRecommended:
      'Alias empfiehlt diesen Plan, aber die aktuelle Datenlage erfordert weiterhin eine ausdrückliche Überprüfung durch den Manager.',
    seatingDecisionSummaryStrong:
      'Alias stuft diesen Plan auf Grundlage der aktuellen Daten und erlernten Präferenzen als starke Empfehlung ein.',

    seatingDecisionReasonCalibrationNotMature:
      'Alias verfügt noch nicht über genügend ausgewertete Vorhersagen, um diese Empfehlung als besonders zuverlässig einzustufen.',
    seatingDecisionReasonHighAcceptanceProbability:
      'Der Plan entspricht eng den beobachteten Tischpräferenzen des Managers.',
    seatingDecisionReasonLowAcceptanceProbability:
      'Der Plan stimmt nur relativ schwach mit den beobachteten Entscheidungen des Managers überein.',
    seatingDecisionReasonNoMovesRequired:
      'Der Plan erfordert keine Verschiebung bestehender Reservierungen.',
    seatingDecisionReasonAbovePreferredMoveLimit:
      'Der Plan erfordert mehr Reservierungsverschiebungen als die erlernte Präferenz.',
    seatingDecisionReasonExactCapacityFit:
      'Der Plan erzeugt keine ungenutzten Sitzplätze.',
    seatingDecisionReasonBelowRecommendedScore:
      'Der technische Score liegt unter der aktuell erlernten Empfehlungsschwelle.',
    intelligenceDeveloping: 'In Entwicklung',
    noTableConfigurations: 'Noch keine Tischkonfiguration hinzugefügt.',
    totalSeats: 'Gesamtsitze',
    remove: 'Entfernen',
    monday: 'Mo',
    tuesday: 'Di',
    wednesday: 'Mi',
    thursday: 'Do',
    friday: 'Fr',
    saturday: 'Sa',
    sunday: 'So',
    intelligence: 'Alias Intelligence',
    intelligenceEyebrow: 'Alias Intelligence',
    intelligenceTitle:
      'Alias lernt, wie Sie Ihr Restaurant führen.',
    intelligenceDescription:
      'Jede Entscheidung zur Tischbelegung hilft Alias, Ihre Präferenzen zu verstehen und zukünftige Empfehlungen an Ihre Arbeitsweise anzupassen.',
    intelligenceRefresh: 'Aktualisieren',
    intelligenceLoading: 'Alias Intelligence wird geladen...',
    intelligenceUnavailable: 'Alias Intelligence ist nicht verfügbar',
    intelligenceUnavailableDescription:
      'Das Intelligence-Profil ist noch nicht verfügbar.',
    intelligenceTryAgain: 'Erneut versuchen',

    intelligenceLearning: 'Lernen',
    intelligenceSuggestionsObserved: 'Beobachtete Vorschläge',
    intelligenceManagerDecision: 'Managerentscheidung',
    intelligenceManagerDecisions: 'Managerentscheidungen',
    intelligenceAcceptanceRate: 'Akzeptanzrate',
    intelligenceAccepted: 'akzeptiert',
    intelligenceReadRate: 'Leserate',
    intelligenceReviewed: 'überprüft',
    intelligenceLearningConfidence: 'Lernkonfidenz',
    intelligenceProfile: 'Profil',

    intelligenceBehaviour: 'Verhalten',
    intelligenceWhatLearned: 'Was Alias gelernt hat',
    intelligencePreferredPlan: 'Bevorzugter Plan',
    intelligenceTypicalAcceptedMoves: 'Typische akzeptierte Verschiebungen',
    intelligenceTypicalSeatWaste: 'Typische ungenutzte Plätze',
    intelligenceManagerTrust: 'Vertrauen des Managers',

    intelligenceAutomation: 'Automatisierung',
    intelligenceOperatingMode: 'Aktueller Betriebsmodus',
    intelligencePreferredMoves: 'Bevorzugte Verschiebungen',
    intelligencePreferredSeatWaste: 'Bevorzugte ungenutzte Plätze',
    intelligenceAdvisoryDescription:
      'Alias wird weiterhin Sitzplatzempfehlungen zur ausdrücklichen Prüfung durch den Manager vorlegen.',
    intelligenceAssistedDescription:
      'Alias kann Pläne priorisieren, die endgültige Bestätigung bleibt jedoch beim Manager.',
    intelligenceAutomationEligibleDescription:
      'Alias verfügt über genügend Erkenntnisse, um zukünftig eine optionale Automatisierung zu unterstützen.',

    intelligenceInsights: 'Insights',
    intelligenceUnderstands: 'Was Alias derzeit versteht',
    intelligenceEvidence: 'Nachweise',

    intelligenceUnknown: 'Unbekannt',
    intelligenceSingleMove: 'Eine Verschiebung',
    intelligenceMultiMove: 'Mehrere Verschiebungen',
    intelligenceLowSeatWaste: 'Geringe Sitzplatzverschwendung',
    intelligenceFlexible: 'Flexibel',
    intelligenceAdvisoryOnly: 'Nur Beratung',
    intelligenceAssisted: 'Assistiert',
    intelligenceEligibleAutomation: 'Für Automatisierung geeignet',
    intelligenceLow: 'Niedrig',
    intelligenceMedium: 'Mittel',
    intelligenceHigh: 'Hoch',
    floorPlan: 'Tischplan',
    tonePickerTitle: 'Wählen Sie den Concierge-Ton',
    tonePickerDescription: 'Wählen Sie, wie der AI-Concierge mit Ihren Gästen kommunizieren soll.',
    toneCardDescription: 'Premium-Kommunikationsprofil für Gästeinteraktionen.',
    toneLuxury: 'Luxus',
    toneElegant: 'Elegant',
    toneCasual: 'Locker',
    toneModern: 'Modern',
    toneLuxuryDescription:
      'Raffinierte, exklusive und hochwertige Sprache für Premium-Restaurants.',
    toneElegantDescription:
      'Stilvolle, warme und elegante Kommunikation für gehobenen Service.',
    toneCasualDescription:
      'Freundlicher, entspannter und zugänglicher Ton für informelle Lokale.',
    toneModernDescription:
      'Klare, moderne und selbstbewusste Sprache für moderne Locations.',
    launchTitle: 'Ihr Workspace ist bereit.',
    launchDescription: 'Alias richtet den Concierge-Workspace für {restaurantName} ein.',
    estimatedSeats: 'Geschätzte Sitzplätze',
    successTitle: '{restaurantName} ist jetzt live auf Alias.',
    successDescription:
      'Der Restaurant-Workspace wurde erfolgreich erstellt und die Testphase ist jetzt aktiv.',
    restaurantId: 'Restaurant-ID',
    reservationsTitle: 'Reservierungen',
    reservationsHeading: 'Reservierungsübersicht',
    liveReservationFeed: 'Live-Reservierungsfeed',
    newReservation: 'Neue Reservierung',
    manualBooking: 'Manuelle Buchung',
    createReservationTitle: 'Reservierung erstellen.',
    guestName: 'Name des Gastes',
    phoneNumber: 'Telefonnummer',
    emailOptional: 'Optionale E-Mail',
    partySize: 'Personenzahl',
    date: 'Datum',
    time: 'Uhrzeit',
    specialRequestsOptional: 'Optionale Sonderwünsche',
    creating: 'Wird erstellt…',
    createReservationButton: 'Reservierung erstellen',
    timeColumn: 'Uhrzeit',
    guestColumn: 'Gast',
    partyColumn: 'Personen',
    statusColumn: 'Status',
    notesColumn: 'Notizen',
    actionsColumn: 'Aktionen',

    loadingReservations: 'Reservierungen werden geladen...',
    noReservations: 'Keine Reservierungen gefunden.',

    viewConversation: 'Konversation anzeigen',
    aiConversation: 'AI-Konversation',
    partyOfLabel: 'Tisch für',
    loadingConversation: 'Konversation wird geladen...',
    noConversationMessages: 'Keine Nachrichten gefunden.',
    availabilityHeading: 'Öffnungszeiten verwalten.',
    availabilityDescription:
      'Verwalten Sie den Wochenplan und besondere Schließungen für Feiertage, private Veranstaltungen oder unerwartete Schließungen.',

    weeklySchedule: 'Wochenplan',
    regularOpeningHours: 'Reguläre Öffnungszeiten',
    weeklyScheduleDescription:
      'Legen Sie die Standard-Öffnungstage und -zeiten fest, die der AI-Concierge verwendet.',

    saveChanges: 'Änderungen speichern',
    opening: 'Öffnung',
    closing: 'Schließung',
    specialClosures: 'Besondere Schließungen',
    holidaysExceptions: 'Feiertage und Ausnahmen',
    specialClosuresDescription:
      'Fügen Sie Feiertage, private Veranstaltungen oder unerwartete Schließungen hinzu, damit der AI-Concierge niemals Reservierungen bestätigt, wenn das Restaurant geschlossen ist.',
    closureReasonPlaceholder: 'Grund (z. B. Weihnachten)',
    addClosure: 'Schließung hinzufügen',
    noSpecialClosures: 'Noch keine besonderen Schließungen hinzugefügt.',
    availabilitySaved: 'Verfügbarkeit erfolgreich gespeichert.',
    availabilityLoadError: 'Verfügbarkeit konnte nicht geladen werden.',
    availabilitySaveError: 'Verfügbarkeit konnte nicht gespeichert werden.',

    closureDateRequired: 'Bitte wählen Sie ein Schließdatum aus.',
    specialClosureAdded: 'Besondere Schließung hinzugefügt.',
    specialClosureRemoved: 'Besondere Schließung entfernt.',

    noRestaurantFound: 'Kein Restaurant gefunden.',
    noRestaurantSelected: 'Kein Restaurant ausgewählt.',
    settingsHeading: 'Restaurant-Einstellungen.',
    restaurantName: 'Restaurantname',
    contactEmail: 'Kontakt-E-Mail',
    openingHoursLabel: 'Öffnungszeiten',
    businessType: 'Geschäftstyp',
    conciergeTone: 'Concierge-Ton',
    trialActive: 'Testphase aktiv',
    billingNextPhase:
      'Die Zahlungsintegration wird in der nächsten Produktphase verbunden.',
    publicConcierge: 'Öffentlicher Concierge',
    shareEmbedTitle: 'Teilen oder integrieren Sie Ihren AI-Concierge.',
    shareEmbedDescription:
      'Verwenden Sie diesen öffentlichen Link auf Ihrer Website, Instagram-Bio, Ihrem Google-Business-Profil, QR-Code oder integrieren Sie ihn direkt per iframe.',
    openConcierge: 'Concierge öffnen',
    publicLink: 'Öffentlicher Link',
    iframeEmbedCode: 'Iframe-Code',
    createRestaurantFirst: 'Erstellen Sie zuerst ein Restaurant.',
    copied: 'Kopiert',
    copy: 'Kopieren',
    qrAccess: 'QR-Zugang',
    instantGuestAccess: 'Sofortiger Gästezugang.',
    qrDescription:
      'Gäste können diesen QR-Code scannen, um sofort Ihren AI-Concierge zu öffnen und Reservierungen ohne App-Download vorzunehmen.',
    downloadQr: 'QR herunterladen',
    qrAlt: 'Alias Concierge QR-Code',
    analyticsHeading: 'Hospitality-Intelligence.',
    monthlyBookings: 'Monatliche Buchungen',
    noShowReduction: 'No-Show-Reduktion',
    automationRate: 'Automatisierungsrate',
    estimated: 'geschätzt',
    resolved: 'gelöst',
    requestsByHour: 'Anfragen pro Stunde',
    totalBookings: 'Gesamtbuchungen',
    confirmedBookings: 'Bestätigte Buchungen',
    averagePartySize: 'Durchschnittliche Gruppengröße',
    bookingsByHour: 'Buchungen nach Uhrzeit',
    realTime: 'Echtzeit',
    guests: 'Gäste',
    noAnalyticsData: 'Noch keine Analytics-Daten verfügbar.',
    statusConfirmed: 'Bestätigt',
    statusPending: 'Ausstehend',
    statusCancelled: 'Storniert',
    statusCompleted: 'Abgeschlossen',
    statusNoShow: 'No-show',
    subscriptionTrialing: 'Testversion',
    subscriptionActive: 'Aktiv',
    subscriptionCancelled: 'Storniert',
    phoneNumberLabel: 'Telefonnummer',
    tablesLabel: 'Tische',
    seatsEachLabel: 'Sitzplätze pro Tisch',
    support: 'Support',
    supportTitle: 'Support',
    supportHeading: 'Brauchst du Hilfe?',
    supportDescription:
      'Unser Team hilft dir bei Onboarding, Reservierungen, Integrationen und der Einrichtung des Concierges.',
    supportEmailTitle: 'E-Mail-Support',
    supportEmailDescription:
      'Kontaktiere uns jederzeit und wir melden uns so schnell wie möglich.',
    supportFastResponseTitle: 'Schnelle Antwort',
    supportFastResponseDescription:
      'Wir antworten normalerweise innerhalb weniger Stunden an Werktagen.',
    goToDashboard: 'Geh zum Dashboard',
    welcomeFlowHeading: 'Lass uns deinen AI-Concierge einrichten.',
    welcomeFlowDescription:
      'Alias hilft dir, Reservierungen, Verfügbarkeit und Gästekommunikation über einen einfachen Workspace zu verwalten.',
    verifyEmailHeading: 'Bevor Sie fortfahren, bestätigen Sie Ihre E-Mail-Adresse.',
    verifyEmailDescription:
      'Wir haben Ihnen eine Bestätigungs-E-Mail gesendet. Öffnen Sie den Link in Ihrem Posteingang und kehren Sie anschließend hierher zurück.',
    emailVerifiedButton: 'Ich habe meine E-Mail bestätigt',
    sendingVerificationEmail: 'Bestätigungs-E-Mail wird gesendet...',
    authHeroTitle: 'KI-gestützte Abläufe für Orte, an denen Service zählt',
    authHeroDescription:
      'Erstellen Sie Ihren Restaurant-Workspace, konfigurieren Sie Ihren KI-Concierge und starten Sie die 7-Tage-Testversion in wenigen Minuten.',
    authPrivateBeta: 'Private Beta',
    authCreateAccount: 'Erstellen Sie Ihr Alias-Konto',
    authWelcomeBack: 'Willkommen zurück bei Alias',
    authRegister: 'Registrieren',
    authLogin: 'Anmelden',
    authFullNamePlaceholder: 'Vollständigen Namen eingeben',
    authEmailPlaceholder: 'E-Mail-Adresse eingeben',
    authPasswordPlaceholder: 'Passwort eingeben',
    authForgotPassword: 'Passwort vergessen?',
    authSendingResetLink: 'Reset-Link wird gesendet...',
    authPleaseWait: 'Bitte warten...',
    authStartTrial: '7-Tage-Test starten',
    authFooter: 'Keine Installation erforderlich. Jederzeit kündbar.',
    privacyAcceptancePrefix: 'Ich habe die',
    privacyPolicy: 'Datenschutzerklärung',
    termsOfService: 'Nutzungsbedingungen',
    privacyAcceptanceMiddle: 'gelesen und akzeptiere die',
    privacyRequired:
      'Bevor du ein Konto erstellst, musst du die Datenschutzerklärung und die Nutzungsbedingungen lesen und akzeptieren.',
    welcomeToAlias: 'Willkommen bei Alias.',
    welcomeLanguageDescription:
      'Wähle deine Sprache, bevor du dein Restaurant konfigurierst.',
    searchAndSortReservations: 'Reservierungen suchen und sortieren',
    searchReservationsPlaceholder: 'Nach Name, Telefon oder E-Mail suchen',
    newestFirst: 'Neueste zuerst',
    oldestFirst: 'Älteste zuerst',
    emailRequired: 'E-Mail erforderlich',
    emailRequiredError: 'Die E-Mail des Kunden ist erforderlich, um die Buchungsbestätigung zu senden.',
    automaticTableAssignment: 'Automatische Tischzuweisung',
    tableLabel: 'Tisch',
    seatsLabel: 'Sitzplätze',
    contactDetails: 'Kontakt',
    welcome: 'Willkommen',
    tableManagement: 'Tischverwaltung',
    restaurantTablesTitle: 'Restauranttische.',
    restaurantTablesDescription:
      'Füge physische Tische mit sichtbaren Nummern und internen Alias-Codes für zukünftige KI-Reservierungszuweisungen hinzu.',
    tableNumberRequired: 'Die Tischnummer ist erforderlich.',
    unableToLoadTables: 'Tische konnten nicht geladen werden.',
    unableToCreateTable: 'Tisch konnte nicht erstellt werden.',
    unableToDeleteTable: 'Tisch konnte nicht gelöscht werden.',
    tableNumberPlaceholder: 'Tischnummer',
    seatsPlaceholder: 'Sitzplätze',
    addingTable: 'Wird hinzugefügt...',
    addTable: 'Tisch hinzufügen',
    loadingTables: 'Tische werden geladen...',
    noTablesAdded: 'Noch keine Tische hinzugefügt.',
    restaurantLanguage: 'Restaurantsprache',
    save: 'Speichern',
    saving: 'Wird gespeichert...',
    languageUpdatedSuccessfully: 'Sprache erfolgreich aktualisiert.',
    unableToUpdateLanguage: 'Sprache konnte nicht aktualisiert werden.',
    trialTitle: 'Starten Sie Ihre kostenlose Testphase',
    trialDescription: 'Testen Sie Alias 7 Tage kostenlos. Danach verlängert sich Ihr Abonnement automatisch für 99 € pro Monat.',
    trialFeature1: 'KI-Concierge',
    trialFeature2: 'Automatische Reservierungen',
    trialFeature3: 'Tischverfügbarkeit',
    trialFeature4: 'Öffentliches Buchungs-Widget',
    trialFeature5: 'Mehrsprachige Unterstützung',
    trialFeature6: 'Automatische Kunden-E-Mails',
    trialButton: '7-tägige Testphase starten',
    trialRedirecting: 'Weiterleitung...',
    trialFooter: 'Heute keine Kosten. Kündigen Sie jederzeit im Kundenportal.',
    trialError: 'Die Testphase konnte nicht gestartet werden.',
    manageSubscription: 'Abonnement verwalten',
    freeTrial: 'Kostenlose Testphase',
    activeSubscription: 'Aktives Abonnement',
    lifetimeSubscription: 'Lifetime-Abonnement',
    inactiveSubscription: 'Inaktives Abonnement',
    trialEnds: 'Testphase endet am',
    renewsOn: 'Verlängert sich am',
    noRenewalRequired: 'Keine Verlängerung erforderlich',
    subscriptionRequired: 'Abonnement erforderlich',
    loadingBilling: 'Abonnement wird geladen',
    loadingBillingDescription: 'Abonnementstatus wird geprüft...',
    tableNumberLabel: 'Tischnummer',
    seatsPerTableLabel: 'Sitzplätze',
    billing: 'Abrechnung',
    subscription: 'Abonnement',
    billingDescription: 'Verwalten Sie Ihr Alias-Abonnement, die Testphase, Zahlungsmethode und das Kundenportal.',
    loadingBillingStatus: 'Abonnementstatus wird geladen...',
    currentPlan: 'Aktueller Tarif',
    lifetime: 'Lebenslang',
    inactive: 'Inaktiv',
    account: 'Konto',
    trialUsed: 'Testversion verwendet',
    subscriptionStarts: 'Abonnement beginnt',
    subscriptionEnds: 'Abonnement endet',
    yes: 'Ja',
    no: 'Nein',
    subscribeNow: 'Jetzt abonnieren',
    startFreeTrial: 'Kostenlose Testversion starten',
    aliasProDescription: 'Schalten Sie KI-Reservierungen, Tischverwaltung, Verfügbarkeit, öffentlichen Concierge und Premium-Automatisierungen frei.',
    aiConcierge: 'KI Concierge',
    publicBookingWidget: 'Öffentliches Buchungs-Widget',
    reservationManagement: 'Reservierungsverwaltung',
    tableAvailability: 'Tischverfügbarkeit',
    customerEmails: 'Kunden-E-Mails',
    multilingualSupport: 'Mehrsprachige Unterstützung',
  },
} as const;