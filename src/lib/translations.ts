export type Language =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "it"
  | "ja"
  | "ko"
  | "zh";

export interface Translations {
  // Home View
  hello: string;
  readyToAscend: string;
  settingsSubtitle: string;
  chooseYourVibe: string;
  logOut: string;
  customColor: string;

  // Language
  language: string;
  selectLanguage: string;

  // Colors
  white: string;
  red: string;
  orange: string;
  yellow: string;
  green: string;
  blue: string;
  purple: string;

  // Navigation
  home: string;
  check: string;
  settings: string;

  // Habits
  createHabit: string;
  editHabit: string;
  deleteHabit: string;
  habitName: string;
  habitColor: string;
  category: string;
  frequency: string;
  time: string;
  notificationTime: string;
  notificationTitle: string;
  notificationBody: string;
  dailyGoal: string;
  dailyGoalPlaceholder: string;
  daily: string;
  everyDay: string;
  everyTwoDays: string;
  weekends: string;
  weekendsSatSun: string;
  custom: string;
  todaysHabits: string;
  allHabits: string;
  noHabits: string;
  noHabitsInCategory: string;
  creatingHabit: string;
  savingHabit: string;
  habitPlaceholder: string;
  categoryPlaceholder: string;
  categoryDefault: string;

  // Actions
  save: string;
  cancel: string;
  delete: string;
  confirm: string;
  apply: string;
  creating: string;
  saving: string;
  maybeLater: string;
  letsGo: string;
  restorePurchases: string;
  subscription: string;
  manageSubscription: string;
  status: string;
  free: string;
  pro: string;

  // Stats
  statistics: string;
  weeklyStatistics: string;
  streak: string;
  completed: string;
  completedThisWeek: string;
  dailyPerformance: string;
  total: string;
  activeHabits: string;
  bestHabit: string;

  // Filter
  filterByCategories: string;
  clearFilters: string;
  noCategoriesAvailable: string;

  // Calendar
  calendarView: string;
  noHabitsScheduled: string;

  // Days - Short
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;

  // Days - Full
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;

  // Months
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
  november: string;
  december: string;

  // Auth
  welcome: string;
  signInToStart: string;
  signInWithGoogle: string;

  // Paywall / Pro
  ascendPro: string;
  unlockPotential: string;
  unlimitedHabits: string;
  trackEverything: string;
  advancedStats: string;
  visualizeProgress: string;
  customColors: string;
  personalizeApp: string;
  seeYourFutureHabits: string;
  annualAccess: string;
  monthly: string;
  lifetime: string;
  congratulations: string;
  successfullyUnlocked: string;

  // Locked states
  statisticsLocked: string;
  unlockStatistics: string;
  upgradeToProStats: string;
  calendarLocked: string;
  unlockCalendar: string;
  upgradeToProCalendar: string;
  habitLimitReached: string;
  unlockUnlimitedHabits: string;
  freeUserLimit: string;
  premiumColorsLocked: string;
  unlockPremiumColors: string;
  upgradeForCustomColors: string;

  // Errors & Messages
  habitNameExists: string;
  errorCreatingHabit: string;
  errorEditingHabit: string;
  errorDeletingHabit: string;
  habitCreatedSuccess: string;
  habitEditedSuccess: string;
  habitDeletedSuccess: string;
  selectAtLeastOneDay: string;
  confirmDeleteHabit: string;
  couldNotUpdate: string;
  noActiveSub: string;

  // Tutorial
  tutorialCreateTitle: string;
  tutorialCreateDesc: string;
  tutorialCheckTitle: string;
  tutorialCheckDesc: string;
  tutorialSettingsTitle: string;
  tutorialSettingsDesc: string;
  tutorialExitConfirm: string;

  // Mobile Auth Callback
  verifyingSession: string;
  sessionStarted: string;
  returningToApp: string;
  authError: string;
  couldNotLogin: string;
  returnToApp: string;
  connecting: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Home View
    hello: "Hello",
    readyToAscend: "Ready to ascend today?",
    settingsSubtitle: "Customize your experience",
    chooseYourVibe: "Choose your vibe",
    logOut: "Log out?",
    customColor: "Custom Color",

    // Language
    language: "Language",
    selectLanguage: "Select Language",

    // Colors
    white: "White",
    red: "Red",
    orange: "Orange",
    yellow: "Yellow",
    green: "Green",
    blue: "Blue",
    purple: "Purple",

    // Navigation
    home: "Home",
    check: "Check",
    settings: "Settings",

    // Habits
    createHabit: "Create Habit",
    editHabit: "Edit Habit",
    deleteHabit: "Delete Habit",
    habitName: "Habit name",
    habitColor: "Habit color",
    category: "Category",
    frequency: "Frequency",
    time: "Reminder",
    notificationTime: "Notification Time",
    notificationTitle: "Habit Reminder",
    notificationBody: "It's time for your habit: {habitName}!",
    dailyGoal: "Daily Goal",
    dailyGoalPlaceholder: "Select goal",
    daily: "Daily",
    everyDay: "Every day",
    everyTwoDays: "Every 2 days",
    weekends: "Weekends",
    weekendsSatSun: "Weekends (Sat & Sun)",
    custom: "Custom",
    todaysHabits: "Today's Habits",
    allHabits: "All Habits",
    noHabits: "You have no habits. Create one to get started!",
    noHabitsInCategory: "No habits in the selected categories.",
    creatingHabit: "Creating...",
    savingHabit: "Saving...",
    habitPlaceholder: "e.g., Exercise, Read, Meditate...",
    categoryPlaceholder: "e.g., Health, Productivity, Home...",
    categoryDefault: 'If you don\'t write anything, "General" will be assigned',

    // Actions
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    confirm: "Confirm",
    apply: "Apply",
    creating: "Creating...",
    saving: "Saving...",
    maybeLater: "Maybe later",
    letsGo: "Let's Go!",
    restorePurchases: "Restore Purchases",
    subscription: "Subscription",
    manageSubscription: "Manage Subscription",
    status: "Status",
    free: "Free",
    pro: "Pro",

    // Stats
    statistics: "Statistics",
    weeklyStatistics: "Weekly Statistics",
    streak: "Streak",
    completed: "Completed",
    completedThisWeek: "Completed this week",
    dailyPerformance: "Daily Performance",
    total: "Total",
    activeHabits: "Active Habits",
    bestHabit: "Best habit",

    // Filter
    filterByCategories: "Filter by Categories",
    clearFilters: "Clear Filters",
    noCategoriesAvailable: "No categories available",

    // Calendar
    calendarView: "Calendar View",
    noHabitsScheduled: "No habits scheduled",

    // Days - Short
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
    sun: "Sun",

    // Days - Full
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",

    // Months
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",

    // Auth
    welcome: "Welcome to Ascend",
    signInToStart: "Sign in to start tracking your habits",
    signInWithGoogle: "Sign in with Google",

    // Paywall / Pro
    ascendPro: "Ascend Pro",
    unlockPotential: "Unlock your full potential",
    unlimitedHabits: "Unlimited Habits",
    trackEverything: "Track everything",
    advancedStats: "Advanced Stats",
    visualizeProgress: "Visualize progress",
    customColors: "Custom Colors",
    personalizeApp: "Personalize your app",
    seeYourFutureHabits: "See your future habits",
    annualAccess: "Annual Access",
    monthly: "Monthly",
    lifetime: "Lifetime",
    congratulations: "Congratulations!",
    successfullyUnlocked: "You've successfully unlocked",

    // Locked states
    statisticsLocked: "Statistics Locked",
    unlockStatistics: "Unlock Statistics",
    upgradeToProStats:
      "Upgrade to Pro to unlock detailed insights and track your performance.",
    calendarLocked: "Calendar View is Locked",
    unlockCalendar: "Unlock Calendar",
    upgradeToProCalendar:
      "Upgrade to Pro to visualize your streaks and track your progress over time.",
    habitLimitReached: "Habit Limit Reached",
    unlockUnlimitedHabits: "Unlock Unlimited Habits",
    freeUserLimit:
      "Free users can track up to 3 habits. Upgrade to Pro for unlimited habits.",
    premiumColorsLocked: "Premium Colors Locked",
    unlockPremiumColors: "Unlock Premium Colors",
    upgradeForCustomColors: "Upgrade to Pro to unlock custom colors.",

    // Errors & Messages
    habitNameExists: "Habit name already exists",
    errorCreatingHabit: "Error creating habit. Please try again.",
    errorEditingHabit: "Could not edit habit. Please try again.",
    errorDeletingHabit: "Could not delete habit. Please try again.",
    habitCreatedSuccess: "created successfully",
    habitEditedSuccess: "edited successfully",
    habitDeletedSuccess: "deleted successfully",
    selectAtLeastOneDay: "Please select at least one day for custom frequency",
    confirmDeleteHabit: "Are you sure you want to delete",
    couldNotUpdate: "Could not update completion. Please try again.",
    noActiveSub: "No active subscription found.",

    // Tutorial
    tutorialCreateTitle: "Create Habit",
    tutorialCreateDesc: "Click here to create a new habit and start tracking.",
    tutorialCheckTitle: "Check Habits",
    tutorialCheckDesc: "View and check off your daily habits here.",
    tutorialSettingsTitle: "Settings",
    tutorialSettingsDesc: "Customize your experience, change theme, and more.",
    tutorialExitConfirm: "Are you sure you want to exit the tutorial?",

    // Mobile Auth Callback
    verifyingSession: "Verifying session...",
    sessionStarted: "Session started!",
    returningToApp: "Returning to app...",
    authError: "Authentication error",
    couldNotLogin: "Could not log in",
    returnToApp: "Return to app",
    connecting: "Connecting...",
  },
  es: {
    // Home View
    hello: "Hola",
    readyToAscend: "¿Listo para ascender hoy?",
    settingsSubtitle: "Personaliza tu experiencia",
    chooseYourVibe: "Elige tu vibra",
    logOut: "¿Cerrar sesión?",
    customColor: "Color Personalizado",

    // Language
    language: "Idioma",
    selectLanguage: "Seleccionar Idioma",

    // Colors
    white: "Blanco",
    red: "Rojo",
    orange: "Naranja",
    yellow: "Amarillo",
    green: "Verde",
    blue: "Azul",
    purple: "Morado",

    // Navigation
    home: "Inicio",
    check: "Revisar",
    settings: "Ajustes",

    // Habits
    createHabit: "Crear Hábito",
    editHabit: "Editar Hábito",
    deleteHabit: "Eliminar Hábito",
    habitName: "Nombre del hábito",
    habitColor: "Color del hábito",
    category: "Categoría",
    frequency: "Frecuencia",
    time: "Recordatorio",
    notificationTime: "Hora de notificación",
    notificationTitle: "Recordatorio de Hábito",
    notificationBody: "¡Es hora de tu hábito: {habitName}!",
    dailyGoal: "Meta Diaria",
    dailyGoalPlaceholder: "Seleccionar meta",
    daily: "Diario",
    everyDay: "Todos los días",
    everyTwoDays: "Cada 2 días",
    weekends: "Fines de semana",
    weekendsSatSun: "Fines de semana (Sáb y Dom)",
    custom: "Personalizado",
    todaysHabits: "Hábitos de Hoy",
    allHabits: "Todos los Hábitos",
    noHabits: "No tienes hábitos. ¡Crea uno para empezar!",
    noHabitsInCategory: "No hay hábitos en las categorías seleccionadas.",
    creatingHabit: "Creando...",
    savingHabit: "Guardando...",
    habitPlaceholder: "Ej: Ejercicio, Leer, Meditar...",
    categoryPlaceholder: "Ej: Salud, Productividad, Hogar...",
    categoryDefault: 'Si no escribes nada, se asignará "General"',

    // Actions
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    confirm: "Confirmar",
    apply: "Aplicar",
    creating: "Creando...",
    saving: "Guardando...",
    maybeLater: "Quizás después",
    letsGo: "¡Vamos!",
    restorePurchases: "Restaurar Compras",
    subscription: "Suscripción",
    manageSubscription: "Gestionar Suscripción",
    status: "Estado",
    free: "Gratis",
    pro: "Pro",

    // Stats
    statistics: "Estadísticas",
    weeklyStatistics: "Estadísticas Semanales",
    streak: "Racha",
    completed: "Completado",
    completedThisWeek: "Completado esta semana",
    dailyPerformance: "Rendimiento Diario",
    total: "Total",
    activeHabits: "Hábitos Activos",
    bestHabit: "Mejor hábito",

    // Filter
    filterByCategories: "Filtrar por Categorías",
    clearFilters: "Limpiar Filtros",
    noCategoriesAvailable: "No hay categorías disponibles",

    // Calendar
    calendarView: "Vista de Calendario",
    noHabitsScheduled: "No hay hábitos programados",

    // Days - Short
    mon: "Lun",
    tue: "Mar",
    wed: "Mié",
    thu: "Jue",
    fri: "Vie",
    sat: "Sáb",
    sun: "Dom",

    // Days - Full
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",

    // Months
    january: "Enero",
    february: "Febrero",
    march: "Marzo",
    april: "Abril",
    may: "Mayo",
    june: "Junio",
    july: "Julio",
    august: "Agosto",
    september: "Septiembre",
    october: "Octubre",
    november: "Noviembre",
    december: "Diciembre",

    // Auth
    welcome: "Bienvenido a Ascend",
    signInToStart: "Inicia sesión para empezar a seguir tus hábitos",
    signInWithGoogle: "Iniciar sesión con Google",

    // Paywall / Pro
    ascendPro: "Ascend Pro",
    unlockPotential: "Desbloquea todo tu potencial",
    unlimitedHabits: "Hábitos Ilimitados",
    trackEverything: "Rastrea todo",
    advancedStats: "Estadísticas Avanzadas",
    visualizeProgress: "Visualiza tu progreso",
    customColors: "Colores Personalizados",
    personalizeApp: "Personaliza tu app",
    seeYourFutureHabits: "Ve tus hábitos futuros",
    annualAccess: "Acceso Anual",
    monthly: "Mensual",
    lifetime: "De por vida",
    congratulations: "¡Felicidades!",
    successfullyUnlocked: "Has desbloqueado exitosamente",

    // Locked states
    statisticsLocked: "Estadísticas Bloqueadas",
    unlockStatistics: "Desbloquear Estadísticas",
    upgradeToProStats:
      "Actualiza a Pro para desbloquear información detallada y seguir tu rendimiento.",
    calendarLocked: "Vista de Calendario Bloqueada",
    unlockCalendar: "Desbloquear Calendario",
    upgradeToProCalendar:
      "Actualiza a Pro para visualizar tus rachas y seguir tu progreso en el tiempo.",
    habitLimitReached: "Límite de Hábitos Alcanzado",
    unlockUnlimitedHabits: "Desbloquear Hábitos Ilimitados",
    freeUserLimit:
      "Los usuarios gratuitos pueden rastrear hasta 3 hábitos. Actualiza a Pro para hábitos ilimitados.",
    premiumColorsLocked: "Colores Premium Bloqueados",
    unlockPremiumColors: "Desbloquear Colores Premium",
    upgradeForCustomColors:
      "Actualiza a Pro para desbloquear colores personalizados.",

    // Errors & Messages
    habitNameExists: "El nombre del hábito ya existe",
    errorCreatingHabit: "Error al crear hábito. Por favor, inténtalo de nuevo.",
    errorEditingHabit:
      "No se pudo editar el hábito. Por favor, inténtalo de nuevo.",
    errorDeletingHabit:
      "No se pudo eliminar el hábito. Por favor, inténtalo de nuevo.",
    habitCreatedSuccess: "creado exitosamente",
    habitEditedSuccess: "editado exitosamente",
    habitDeletedSuccess: "eliminado exitosamente",
    selectAtLeastOneDay:
      "Por favor, selecciona al menos un día para frecuencia personalizada",
    confirmDeleteHabit: "¿Estás seguro de que quieres eliminar",
    couldNotUpdate: "No se pudo actualizar. Por favor, inténtalo de nuevo.",
    noActiveSub: "No se encontró suscripción activa.",

    // Tutorial
    tutorialCreateTitle: "Crear Hábito",
    tutorialCreateDesc:
      "Pulsa aquí para crear un nuevo hábito y empezar tu seguimiento.",
    tutorialCheckTitle: "Revisar Hábitos",
    tutorialCheckDesc:
      "Aquí puedes ver y marcar tus hábitos diarios como completados.",
    tutorialSettingsTitle: "Ajustes",
    tutorialSettingsDesc:
      "Personaliza tu experiencia, cambia el tema y más opciones.",
    tutorialExitConfirm: "¿Seguro que quieres salir del tutorial?",

    // Mobile Auth Callback
    verifyingSession: "Verificando sesión...",
    sessionStarted: "¡Sesión iniciada!",
    returningToApp: "Volviendo a la app...",
    authError: "Error de autenticación",
    couldNotLogin: "No se pudo iniciar sesión",
    connecting: "Conectando...",
    returnToApp: "Volver a la app",
  },
  fr: {
    // Home View
    hello: "Bonjour",
    readyToAscend: "Prêt à monter aujourd'hui?",
    settingsSubtitle: "Personnalisez votre expérience",
    chooseYourVibe: "Choisissez votre ambiance",
    logOut: "Se déconnecter?",
    customColor: "Couleur Personnalisée",

    // Language
    language: "Langue",
    selectLanguage: "Sélectionner la Langue",

    // Colors
    white: "Blanc",
    red: "Rouge",
    orange: "Orange",
    yellow: "Jaune",
    green: "Vert",
    blue: "Bleu",
    purple: "Violet",

    // Navigation
    home: "Accueil",
    check: "Vérifier",
    settings: "Paramètres",

    // Habits
    createHabit: "Créer une Habitude",
    editHabit: "Modifier l'Habitude",
    deleteHabit: "Supprimer l'Habitude",
    habitName: "Nom de l'habitude",
    habitColor: "Couleur de l'habitude",
    category: "Catégorie",
    frequency: "Fréquence",
    time: "Rappel",
    notificationTime: "Heure de notification",
    notificationTitle: "Rappel d'Habitude",
    notificationBody: "C'est l'heure de votre habitude : {habitName} !",
    dailyGoal: "Objectif Quotidien",
    dailyGoalPlaceholder: "Sélectionner l'objectif",
    daily: "Quotidien",
    everyDay: "Tous les jours",
    everyTwoDays: "Tous les 2 jours",
    weekends: "Week-ends",
    weekendsSatSun: "Week-ends (Sam & Dim)",
    custom: "Personnalisé",
    todaysHabits: "Habitudes du Jour",
    allHabits: "Toutes les Habitudes",
    noHabits: "Vous n'avez pas d'habitudes. Créez-en une pour commencer!",
    noHabitsInCategory: "Pas d'habitudes dans les catégories sélectionnées.",
    creatingHabit: "Création...",
    savingHabit: "Enregistrement...",
    habitPlaceholder: "Ex: Exercice, Lecture, Méditation...",
    categoryPlaceholder: "Ex: Santé, Productivité, Maison...",
    categoryDefault: 'Si vous n\'écrivez rien, "Général" sera attribué',

    // Actions
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    confirm: "Confirmer",
    apply: "Appliquer",
    creating: "Création...",
    saving: "Enregistrement...",
    maybeLater: "Peut-être plus tard",
    letsGo: "Allons-y!",
    restorePurchases: "Restaurer les Achats",
    subscription: "Abonnement",
    manageSubscription: "Gérer l'abonnement",
    status: "Statut",
    free: "Gratuit",
    pro: "Pro",

    // Stats
    statistics: "Statistiques",
    weeklyStatistics: "Statistiques Hebdomadaires",
    streak: "Série",
    completed: "Terminé",
    completedThisWeek: "Complété cette semaine",
    dailyPerformance: "Performance Quotidienne",
    total: "Total",
    activeHabits: "Habitudes Actives",
    bestHabit: "Meilleure habitude",

    // Filter
    filterByCategories: "Filtrer par Catégories",
    clearFilters: "Effacer les Filtres",
    noCategoriesAvailable: "Aucune catégorie disponible",

    // Calendar
    calendarView: "Vue Calendrier",
    noHabitsScheduled: "Aucune habitude programmée",

    // Days - Short
    mon: "Lun",
    tue: "Mar",
    wed: "Mer",
    thu: "Jeu",
    fri: "Ven",
    sat: "Sam",
    sun: "Dim",

    // Days - Full
    monday: "Lundi",
    tuesday: "Mardi",
    wednesday: "Mercredi",
    thursday: "Jeudi",
    friday: "Vendredi",
    saturday: "Samedi",
    sunday: "Dimanche",

    // Months
    january: "Janvier",
    february: "Février",
    march: "Mars",
    april: "Avril",
    may: "Mai",
    june: "Juin",
    july: "Juillet",
    august: "Août",
    september: "Septembre",
    october: "Octobre",
    november: "Novembre",
    december: "Décembre",

    // Auth
    welcome: "Bienvenue sur Ascend",
    signInToStart: "Connectez-vous pour commencer à suivre vos habitudes",
    signInWithGoogle: "Se connecter avec Google",

    // Paywall / Pro
    ascendPro: "Ascend Pro",
    unlockPotential: "Libérez tout votre potentiel",
    unlimitedHabits: "Habitudes Illimitées",
    trackEverything: "Suivez tout",
    advancedStats: "Statistiques Avancées",
    visualizeProgress: "Visualisez vos progrès",
    customColors: "Couleurs Personnalisées",
    personalizeApp: "Personnalisez votre app",
    seeYourFutureHabits: "Voyez vos habitudes futures",
    annualAccess: "Accès Annuel",
    monthly: "Mensuel",
    lifetime: "À vie",
    congratulations: "Félicitations!",
    successfullyUnlocked: "Vous avez débloqué avec succès",

    // Locked states
    statisticsLocked: "Statistiques Verrouillées",
    unlockStatistics: "Débloquer les Statistiques",
    upgradeToProStats:
      "Passez à Pro pour débloquer des informations détaillées et suivre vos performances.",
    calendarLocked: "Vue Calendrier Verrouillée",
    unlockCalendar: "Débloquer le Calendrier",
    upgradeToProCalendar:
      "Passez à Pro pour visualiser vos séries et suivre vos progrès dans le temps.",
    habitLimitReached: "Limite d'Habitudes Atteinte",
    unlockUnlimitedHabits: "Débloquer Habitudes Illimitées",
    freeUserLimit:
      "Les utilisateurs gratuits peuvent suivre jusqu'à 3 habitudes. Passez à Pro pour des habitudes illimitées.",
    premiumColorsLocked: "Couleurs Premium Verrouillées",
    unlockPremiumColors: "Débloquer Couleurs Premium",
    upgradeForCustomColors:
      "Passez à Pro pour débloquer des couleurs personnalisées.",

    // Errors & Messages
    habitNameExists: "Le nom de l'habitude existe déjà",
    errorCreatingHabit: "Erreur lors de la création. Veuillez réessayer.",
    errorEditingHabit: "Impossible de modifier l'habitude. Veuillez réessayer.",
    errorDeletingHabit:
      "Impossible de supprimer l'habitude. Veuillez réessayer.",
    habitCreatedSuccess: "créé avec succès",
    habitEditedSuccess: "modifié avec succès",
    habitDeletedSuccess: "supprimé avec succès",
    selectAtLeastOneDay:
      "Veuillez sélectionner au moins un jour pour la fréquence personnalisée",
    confirmDeleteHabit: "Êtes-vous sûr de vouloir supprimer",
    couldNotUpdate: "Impossible de mettre à jour. Veuillez réessayer.",
    noActiveSub: "Aucun abonnement actif trouvé.",

    // Tutorial
    tutorialCreateTitle: "Créer une Habitude",
    tutorialCreateDesc:
      "Cliquez ici pour créer une nouvelle habitude et commencer le suivi.",
    tutorialCheckTitle: "Vérifier les Habitudes",
    tutorialCheckDesc: "Consultez et cochez vos habitudes quotidiennes ici.",
    tutorialSettingsTitle: "Paramètres",
    tutorialSettingsDesc:
      "Personnalisez votre expérience, changez de thème, et plus encore.",
    tutorialExitConfirm: "Êtes-vous sûr de vouloir quitter le tutoriel ?",

    // Mobile Auth Callback
    verifyingSession: "Vérification de la session...",
    sessionStarted: "Session démarrée !",
    returningToApp: "Retour à l'application...",
    authError: "Erreur d'authentification",
    couldNotLogin: "Impossible de se connecter",
    connecting: "Connexion...",
    returnToApp: "Retourner à l'application",
  },
  de: {
    // Home View
    hello: "Hallo",
    readyToAscend: "Bereit aufzusteigen?",
    settingsSubtitle: "Passen Sie Ihr Erlebnis an",
    chooseYourVibe: "Wähle deine Stimmung",
    logOut: "Abmelden?",
    customColor: "Benutzerdefinierte Farbe",

    // Language
    language: "Sprache",
    selectLanguage: "Sprache Auswählen",

    // Colors
    white: "Weiß",
    red: "Rot",
    orange: "Orange",
    yellow: "Gelb",
    green: "Grün",
    blue: "Blau",
    purple: "Lila",

    // Navigation
    home: "Start",
    check: "Prüfen",
    settings: "Einstellungen",

    // Habits
    createHabit: "Gewohnheit Erstellen",
    editHabit: "Gewohnheit Bearbeiten",
    deleteHabit: "Gewohnheit Löschen",
    habitName: "Gewohnheitsname",
    habitColor: "Gewohnheitsfarbe",
    category: "Kategorie",
    frequency: "Häufigkeit",
    time: "Erinnerung",
    notificationTime: "Benachrichtigungszeit",
    notificationTitle: "Gewohnheitserinnerung",
    notificationBody: "Es ist Zeit für deine Gewohnheit: {habitName}!",
    dailyGoal: "Tagesziel",
    dailyGoalPlaceholder: "Ziel auswählen",
    daily: "Täglich",
    everyDay: "Jeden Tag",
    everyTwoDays: "Alle 2 Tage",
    weekends: "Wochenenden",
    weekendsSatSun: "Wochenenden (Sa & So)",
    custom: "Benutzerdefiniert",
    todaysHabits: "Heutige Gewohnheiten",
    allHabits: "Alle Gewohnheiten",
    noHabits: "Du hast keine Gewohnheiten. Erstelle eine, um loszulegen!",
    noHabitsInCategory: "Keine Gewohnheiten in den ausgewählten Kategorien.",
    creatingHabit: "Erstellen...",
    savingHabit: "Speichern...",
    habitPlaceholder: "Z.B. Sport, Lesen, Meditieren...",
    categoryPlaceholder: "Z.B. Gesundheit, Produktivität, Zuhause...",
    categoryDefault: 'Wenn du nichts schreibst, wird "Allgemein" zugewiesen',

    // Actions
    save: "Speichern",
    cancel: "Abbrechen",
    delete: "Löschen",
    confirm: "Bestätigen",
    apply: "Anwenden",
    creating: "Erstellen...",
    saving: "Speichern...",
    maybeLater: "Vielleicht später",
    letsGo: "Los geht's!",
    restorePurchases: "Käufe Wiederherstellen",
    subscription: "Abonnement",
    manageSubscription: "Abonnement Verwalten",
    status: "Status",
    free: "Kostenlos",
    pro: "Pro",

    // Stats
    statistics: "Statistiken",
    weeklyStatistics: "Wöchentliche Statistiken",
    streak: "Serie",
    completed: "Abgeschlossen",
    completedThisWeek: "Diese Woche abgeschlossen",
    dailyPerformance: "Tägliche Leistung",
    total: "Gesamt",
    activeHabits: "Aktive Gewohnheiten",
    bestHabit: "Beste Gewohnheit",

    // Filter
    filterByCategories: "Nach Kategorien Filtern",
    clearFilters: "Filter Löschen",
    noCategoriesAvailable: "Keine Kategorien verfügbar",

    // Calendar
    calendarView: "Kalenderansicht",
    noHabitsScheduled: "Keine Gewohnheiten geplant",

    // Days - Short
    mon: "Mo",
    tue: "Di",
    wed: "Mi",
    thu: "Do",
    fri: "Fr",
    sat: "Sa",
    sun: "So",

    // Days - Full
    monday: "Montag",
    tuesday: "Dienstag",
    wednesday: "Mittwoch",
    thursday: "Donnerstag",
    friday: "Freitag",
    saturday: "Samstag",
    sunday: "Sonntag",

    // Months
    january: "Januar",
    february: "Februar",
    march: "März",
    april: "April",
    may: "Mai",
    june: "Juni",
    july: "Juli",
    august: "August",
    september: "September",
    october: "Oktober",
    november: "November",
    december: "Dezember",

    // Auth
    welcome: "Willkommen bei Ascend",
    signInToStart: "Melden Sie sich an, um Ihre Gewohnheiten zu verfolgen",
    signInWithGoogle: "Mit Google anmelden",

    // Paywall / Pro
    ascendPro: "Ascend Pro",
    unlockPotential: "Entfalte dein volles Potenzial",
    unlimitedHabits: "Unbegrenzte Gewohnheiten",
    trackEverything: "Verfolge alles",
    advancedStats: "Erweiterte Statistiken",
    visualizeProgress: "Fortschritt visualisieren",
    customColors: "Benutzerdefinierte Farben",
    personalizeApp: "Personalisiere deine App",
    seeYourFutureHabits: "Sieh deine zukünftigen Gewohnheiten",
    annualAccess: "Jährlicher Zugang",
    monthly: "Monatlich",
    lifetime: "Lebenslang",
    congratulations: "Herzlichen Glückwunsch!",
    successfullyUnlocked: "Du hast erfolgreich freigeschaltet",

    // Locked states
    statisticsLocked: "Statistiken Gesperrt",
    unlockStatistics: "Statistiken Freischalten",
    upgradeToProStats:
      "Upgrade auf Pro, um detaillierte Einblicke zu erhalten und deine Leistung zu verfolgen.",
    calendarLocked: "Kalenderansicht Gesperrt",
    unlockCalendar: "Kalender Freischalten",
    upgradeToProCalendar:
      "Upgrade auf Pro, um deine Serien zu visualisieren und deinen Fortschritt zu verfolgen.",
    habitLimitReached: "Gewohnheitslimit Erreicht",
    unlockUnlimitedHabits: "Unbegrenzte Gewohnheiten Freischalten",
    freeUserLimit:
      "Kostenlose Nutzer können bis zu 3 Gewohnheiten verfolgen. Upgrade auf Pro für unbegrenzte Gewohnheiten.",
    premiumColorsLocked: "Premium-Farben Gesperrt",
    unlockPremiumColors: "Premium-Farben Freischalten",
    upgradeForCustomColors:
      "Upgrade auf Pro, um benutzerdefinierte Farben freizuschalten.",

    // Errors & Messages
    habitNameExists: "Gewohnheitsname existiert bereits",
    errorCreatingHabit: "Fehler beim Erstellen. Bitte versuche es erneut.",
    errorEditingHabit:
      "Gewohnheit konnte nicht bearbeitet werden. Bitte versuche es erneut.",
    errorDeletingHabit:
      "Gewohnheit konnte nicht gelöscht werden. Bitte versuche es erneut.",
    habitCreatedSuccess: "erfolgreich erstellt",
    habitEditedSuccess: "erfolgreich bearbeitet",
    habitDeletedSuccess: "erfolgreich gelöscht",
    selectAtLeastOneDay:
      "Bitte wähle mindestens einen Tag für die benutzerdefinierte Häufigkeit",
    confirmDeleteHabit: "Bist du sicher, dass du löschen möchtest",
    couldNotUpdate: "Aktualisierung nicht möglich. Bitte versuche es erneut.",
    noActiveSub: "Kein aktives Abonnement gefunden.",

    // Tutorial
    tutorialCreateTitle: "Gewohnheit Erstellen",
    tutorialCreateDesc:
      "Klicken Sie hier, um eine neue Gewohnheit zu erstellen und mit dem Tracking zu beginnen.",
    tutorialCheckTitle: "Gewohnheiten Prüfen",
    tutorialCheckDesc:
      "Sehen Sie hier Ihre täglichen Gewohnheiten und haken Sie sie ab.",
    tutorialSettingsTitle: "Einstellungen",
    tutorialSettingsDesc:
      "Passen Sie Ihr Erlebnis an, ändern Sie das Thema und mehr.",
    tutorialExitConfirm:
      "Sind Sie sicher, dass Sie das Tutorial verlassen möchten?",

    // Mobile Auth Callback
    verifyingSession: "Sitzung wird überprüft...",
    sessionStarted: "Sitzung gestartet!",
    returningToApp: "Zurück zur App...",
    authError: "Authentifizierungsfehler",
    connecting: "Verbinden...",
    couldNotLogin: "Anmeldung fehlgeschlagen",
    returnToApp: "Zurück zur App",
  },
  pt: {
    // Home View
    hello: "Olá",
    readyToAscend: "Pronto para ascender hoje?",
    settingsSubtitle: "Personalize sua experiência",
    chooseYourVibe: "Escolha sua vibe",
    logOut: "Sair?",
    customColor: "Cor Personalizada",

    // Language
    language: "Idioma",
    selectLanguage: "Selecionar Idioma",

    // Colors
    white: "Branco",
    red: "Vermelho",
    orange: "Laranja",
    yellow: "Amarelo",
    green: "Verde",
    blue: "Azul",
    purple: "Roxo",

    // Navigation
    home: "Início",
    check: "Verificar",
    settings: "Configurações",

    // Habits
    createHabit: "Criar Hábito",
    editHabit: "Editar Hábito",
    deleteHabit: "Excluir Hábito",
    habitName: "Nome do Hábito",
    habitColor: "Cor do Hábito",
    category: "Categoria",
    frequency: "Frequência",
    time: "Lembrete",
    notificationTime: "Hora da notificação",
    notificationTitle: "Lembrete de Hábito",
    notificationBody: "É hora do seu hábito: {habitName}!",
    dailyGoal: "Meta Diária",
    dailyGoalPlaceholder: "Selecionar meta",
    daily: "Diário",
    everyDay: "Todos os dias",
    everyTwoDays: "A Cada 2 Dias",
    weekends: "Fins de Semana",
    weekendsSatSun: "Fins de Semana (Sáb & Dom)",
    custom: "Personalizado",
    todaysHabits: "Hábitos de Hoje",
    allHabits: "Todos os Hábitos",
    noHabits: "Você não tem hábitos. Crie um para começar!",
    noHabitsInCategory: "Nenhum hábito nas categorias selecionadas.",
    creatingHabit: "Criando...",
    savingHabit: "Salvando...",
    habitPlaceholder: "Ex: Exercício, Leitura, Meditação...",
    categoryPlaceholder: "Ex: Saúde, Produtividade, Casa...",
    categoryDefault: 'Se você não escrever nada, será atribuído "Geral"',

    // Actions
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Excluir",
    confirm: "Confirmar",
    apply: "Aplicar",
    creating: "Criando...",
    saving: "Salvando...",
    maybeLater: "Talvez depois",
    letsGo: "Vamos lá!",
    restorePurchases: "Restaurar Compras",
    subscription: "Assinatura",
    manageSubscription: "Gerenciar Assinatura",
    status: "Status",
    free: "Gratuito",
    pro: "Pro",

    // Stats
    statistics: "Estatísticas",
    weeklyStatistics: "Estatísticas Semanais",
    streak: "Sequência",
    completed: "Concluído",
    completedThisWeek: "Concluídos esta semana",
    dailyPerformance: "Desempenho Diário",
    total: "Total",
    activeHabits: "Hábitos Ativos",
    bestHabit: "Melhor Hábito",

    // Filter
    filterByCategories: "Filtrar por Categorias",
    clearFilters: "Limpar Filtros",
    noCategoriesAvailable: "Nenhuma categoria disponível",

    // Calendar
    calendarView: "Vista do Calendário",
    noHabitsScheduled: "Nenhum hábito programado",

    // Days - Short
    mon: "Seg",
    tue: "Ter",
    wed: "Qua",
    thu: "Qui",
    fri: "Sex",
    sat: "Sáb",
    sun: "Dom",

    // Days - Full
    monday: "Segunda",
    tuesday: "Terça",
    wednesday: "Quarta",
    thursday: "Quinta",
    friday: "Sexta",
    saturday: "Sábado",
    sunday: "Domingo",

    // Months
    january: "Janeiro",
    february: "Fevereiro",
    march: "Março",
    april: "Abril",
    may: "Maio",
    june: "Junho",
    july: "Julho",
    august: "Agosto",
    september: "Setembro",
    october: "Outubro",
    november: "Novembro",
    december: "Dezembro",

    // Auth
    welcome: "Bem-vindo ao Ascend",
    signInToStart: "Entre para começar a acompanhar seus hábitos",
    signInWithGoogle: "Entrar com Google",

    // Paywall / Pro
    ascendPro: "Ascend Pro",
    unlockPotential: "Libere seu potencial máximo",
    unlimitedHabits: "Hábitos Ilimitados",
    trackEverything: "Acompanhe tudo",
    advancedStats: "Estatísticas Avançadas",
    visualizeProgress: "Visualize seu progresso",
    customColors: "Cores Personalizadas",
    personalizeApp: "Personalize seu app",
    seeYourFutureHabits: "Veja seus hábitos futuros",
    annualAccess: "Acesso Anual",
    monthly: "Mensal",
    lifetime: "Vitalício",
    congratulations: "Parabéns!",
    successfullyUnlocked: "Você desbloqueou com sucesso",

    // Locked states
    statisticsLocked: "Estatísticas Bloqueadas",
    unlockStatistics: "Desbloquear Estatísticas",
    upgradeToProStats:
      "Atualize para Pro para obter insights detalhados e acompanhar seu desempenho.",
    calendarLocked: "Vista do Calendário Bloqueada",
    unlockCalendar: "Desbloquear Calendário",
    upgradeToProCalendar:
      "Atualize para Pro para visualizar suas sequências e acompanhar seu progresso.",
    habitLimitReached: "Limite de Hábitos Atingido",
    unlockUnlimitedHabits: "Desbloquear Hábitos Ilimitados",
    freeUserLimit:
      "Usuários gratuitos podem acompanhar até 3 hábitos. Atualize para Pro para hábitos ilimitados.",
    premiumColorsLocked: "Cores Premium Bloqueadas",
    unlockPremiumColors: "Desbloquear Cores Premium",
    upgradeForCustomColors:
      "Atualize para Pro para desbloquear cores personalizadas.",

    // Errors & Messages
    habitNameExists: "Nome do hábito já existe",
    errorCreatingHabit: "Erro ao criar. Por favor, tente novamente.",
    errorEditingHabit:
      "Não foi possível editar o hábito. Por favor, tente novamente.",
    errorDeletingHabit:
      "Não foi possível excluir o hábito. Por favor, tente novamente.",
    habitCreatedSuccess: "criado com sucesso",
    habitEditedSuccess: "editado com sucesso",
    habitDeletedSuccess: "excluído com sucesso",
    selectAtLeastOneDay:
      "Por favor, selecione pelo menos um dia para frequência personalizada",
    confirmDeleteHabit: "Tem certeza que deseja excluir",
    couldNotUpdate: "Não foi possível atualizar. Por favor, tente novamente.",
    noActiveSub: "Nenhuma assinatura ativa encontrada.",

    // Tutorial
    tutorialCreateTitle: "Criar Hábito",
    tutorialCreateDesc:
      "Clique aqui para criar um novo hábito e começar a acompanhar.",
    tutorialCheckTitle: "Verificar Hábitos",
    tutorialCheckDesc: "Veja e marque seus hábitos diários aqui.",
    tutorialSettingsTitle: "Configurações",
    tutorialSettingsDesc:
      "Personalize sua experiência, mude o tema e muito mais.",
    tutorialExitConfirm: "Tem certeza que deseja sair do tutorial?",

    // Mobile Auth Callback
    verifyingSession: "Verificando sessão...",
    sessionStarted: "Sessão iniciada!",
    returningToApp: "Voltando ao app...",
    authError: "Erro de autenticação",
    connecting: "Conectando...",
    couldNotLogin: "Não foi possível fazer login",
    returnToApp: "Voltar ao app",
  },
  it: {
    // Home View
    hello: "Ciao",
    readyToAscend: "Pronto a salire oggi?",
    settingsSubtitle: "Personalizza la tua esperienza",
    chooseYourVibe: "Scegli la tua atmosfera",
    logOut: "Disconnettersi?",
    customColor: "Colore Personalizzato",

    // Language
    language: "Lingua",
    selectLanguage: "Seleziona Lingua",

    // Colors
    white: "Bianco",
    red: "Rosso",
    orange: "Arancione",
    yellow: "Giallo",
    green: "Verde",
    blue: "Blu",
    purple: "Viola",

    // Navigation
    home: "Home",
    check: "Controlla",
    settings: "Impostazioni",

    // Habits
    createHabit: "Crea Abitudine",
    editHabit: "Modifica Abitudine",
    deleteHabit: "Elimina Abitudine",
    habitName: "Nome Abitudine",
    habitColor: "Colore Abitudine",
    category: "Categoria",
    frequency: "Frequenza",
    time: "Promemoria",
    notificationTime: "Ora della notifica",
    notificationTitle: "Promemoria Abitudine",
    notificationBody: "È ora della tua abitudine: {habitName}!",
    dailyGoal: "Obiettivo Giornaliero",
    dailyGoalPlaceholder: "Seleziona obiettivo",
    daily: "Giornaliero",
    everyDay: "Ogni giorno",
    everyTwoDays: "Ogni 2 Giorni",
    weekends: "Fine Settimana",
    weekendsSatSun: "Fine Settimana (Sab & Dom)",
    custom: "Personalizzato",
    todaysHabits: "Abitudini di Oggi",
    allHabits: "Tutte le Abitudini",
    noHabits: "Non hai abitudini. Creane una per iniziare!",
    noHabitsInCategory: "Nessuna abitudine nelle categorie selezionate.",
    creatingHabit: "Creazione...",
    savingHabit: "Salvataggio...",
    habitPlaceholder: "Es: Esercizio, Lettura, Meditazione...",
    categoryPlaceholder: "Es: Salute, Produttività, Casa...",
    categoryDefault: 'Se non scrivi nulla, verrà assegnato "Generale"',

    // Actions
    save: "Salva",
    cancel: "Annulla",
    delete: "Elimina",
    confirm: "Conferma",
    apply: "Applica",
    creating: "Creazione...",
    saving: "Salvataggio...",
    maybeLater: "Forse dopo",
    letsGo: "Andiamo!",
    restorePurchases: "Ripristina Acquisti",
    subscription: "Abbonamento",
    manageSubscription: "Gestisci Abbonamento",
    status: "Stato",
    free: "Gratuito",
    pro: "Pro",

    // Stats
    statistics: "Statistiche",
    weeklyStatistics: "Statistiche Settimanali",
    streak: "Serie",
    completed: "Completato",
    completedThisWeek: "Completati questa settimana",
    dailyPerformance: "Prestazioni Giornaliere",
    total: "Totale",
    activeHabits: "Abitudini Attive",
    bestHabit: "Migliore Abitudine",

    // Filter
    filterByCategories: "Filtra per Categorie",
    clearFilters: "Cancella Filtri",
    noCategoriesAvailable: "Nessuna categoria disponibile",

    // Calendar
    calendarView: "Vista Calendario",
    noHabitsScheduled: "Nessuna abitudine programmata",

    // Days - Short
    mon: "Lun",
    tue: "Mar",
    wed: "Mer",
    thu: "Gio",
    fri: "Ven",
    sat: "Sab",
    sun: "Dom",

    // Days - Full
    monday: "Lunedì",
    tuesday: "Martedì",
    wednesday: "Mercoledì",
    thursday: "Giovedì",
    friday: "Venerdì",
    saturday: "Sabato",
    sunday: "Domenica",

    // Months
    january: "Gennaio",
    february: "Febbraio",
    march: "Marzo",
    april: "Aprile",
    may: "Maggio",
    june: "Giugno",
    july: "Luglio",
    august: "Agosto",
    september: "Settembre",
    october: "Ottobre",
    november: "Novembre",
    december: "Dicembre",

    // Auth
    welcome: "Benvenuto su Ascend",
    signInToStart: "Accedi per iniziare a tracciare le tue abitudini",
    signInWithGoogle: "Accedi con Google",

    // Paywall / Pro
    ascendPro: "Ascend Pro",
    unlockPotential: "Sblocca il tuo pieno potenziale",
    unlimitedHabits: "Abitudini Illimitate",
    trackEverything: "Traccia tutto",
    advancedStats: "Statistiche Avanzate",
    visualizeProgress: "Visualizza i tuoi progressi",
    customColors: "Colori Personalizzati",
    personalizeApp: "Personalizza la tua app",
    seeYourFutureHabits: "Vedi le tue abitudini future",
    annualAccess: "Accesso Annuale",
    monthly: "Mensile",
    lifetime: "A Vita",
    congratulations: "Congratulazioni!",
    successfullyUnlocked: "Hai sbloccato con successo",

    // Locked states
    statisticsLocked: "Statistiche Bloccate",
    unlockStatistics: "Sblocca Statistiche",
    upgradeToProStats:
      "Passa a Pro per ottenere approfondimenti dettagliati e monitorare le tue prestazioni.",
    calendarLocked: "Vista Calendario Bloccata",
    unlockCalendar: "Sblocca Calendario",
    upgradeToProCalendar:
      "Passa a Pro per visualizzare le tue serie e monitorare i tuoi progressi.",
    habitLimitReached: "Limite Abitudini Raggiunto",
    unlockUnlimitedHabits: "Sblocca Abitudini Illimitate",
    freeUserLimit:
      "Gli utenti gratuiti possono tracciare fino a 3 abitudini. Passa a Pro per abitudini illimitate.",
    premiumColorsLocked: "Colori Premium Bloccati",
    unlockPremiumColors: "Sblocca Colori Premium",
    upgradeForCustomColors: "Passa a Pro per sbloccare colori personalizzati.",

    // Errors & Messages
    habitNameExists: "Il nome dell'abitudine esiste già",
    errorCreatingHabit: "Errore nella creazione. Per favore riprova.",
    errorEditingHabit:
      "Impossibile modificare l'abitudine. Per favore riprova.",
    errorDeletingHabit:
      "Impossibile eliminare l'abitudine. Per favore riprova.",
    habitCreatedSuccess: "creata con successo",
    habitEditedSuccess: "modificata con successo",
    habitDeletedSuccess: "eliminata con successo",
    selectAtLeastOneDay:
      "Seleziona almeno un giorno per la frequenza personalizzata",
    confirmDeleteHabit: "Sei sicuro di voler eliminare",
    couldNotUpdate: "Impossibile aggiornare. Per favore riprova.",
    noActiveSub: "Nessun abbonamento attivo trovato.",

    // Tutorial
    tutorialCreateTitle: "Crea Abitudine",
    tutorialCreateDesc:
      "Clicca qui per creare una nuova abitudine e iniziare il tracciamento.",
    tutorialCheckTitle: "Controlla Abitudini",
    tutorialCheckDesc: "Visualizza e spunta le tue abitudini quotidiane qui.",
    tutorialSettingsTitle: "Impostazioni",
    tutorialSettingsDesc:
      "Personalizza la tua esperienza, cambia tema e altro ancora.",
    tutorialExitConfirm: "Sei sicuro di voler uscire dal tutorial?",

    // Mobile Auth Callback
    verifyingSession: "Verifica della sessione...",
    sessionStarted: "Sessione avviata!",
    returningToApp: "Ritorno all'app...",
    connecting: "Connessione...",
    authError: "Errore di autenticazione",
    couldNotLogin: "Impossibile accedere",
    returnToApp: "Torna all'app",
  },
  ja: {
    // Home View
    hello: "こんにちは",
    readyToAscend: "今日も上を目指しますか？",
    settingsSubtitle: "エクスペリエンスをカスタマイズ",
    chooseYourVibe: "テーマを選ぶ",
    logOut: "ログアウト？",
    customColor: "カスタムカラー",

    // Language
    language: "言語",
    selectLanguage: "言語を選択",

    // Colors
    white: "白",
    red: "赤",
    orange: "オレンジ",
    yellow: "黄色",
    green: "緑",
    blue: "青",
    purple: "紫",

    // Navigation
    home: "ホーム",
    check: "チェック",
    settings: "設定",

    // Habits
    createHabit: "習慣を作成",
    editHabit: "習慣を編集",
    deleteHabit: "習慣を削除",
    habitName: "習慣名",
    habitColor: "習慣の色",
    category: "カテゴリ",
    frequency: "頻度",
    time: "リマインダー",
    notificationTime: "通知時間",
    notificationTitle: "習慣のリマインダー",
    notificationBody: "習慣の時間です：{habitName}！",
    dailyGoal: "毎日の目標",
    dailyGoalPlaceholder: "目標を選択",
    daily: "毎日",
    everyDay: "毎日",
    everyTwoDays: "2日ごと",
    weekends: "週末",
    weekendsSatSun: "週末（土・日）",
    custom: "カスタム",
    todaysHabits: "今日の習慣",
    allHabits: "すべての習慣",
    noHabits: "習慣がありません。作成して始めましょう！",
    noHabitsInCategory: "選択したカテゴリに習慣がありません。",
    creatingHabit: "作成中...",
    savingHabit: "保存中...",
    habitPlaceholder: "例：運動、読書、瞑想...",
    categoryPlaceholder: "例：健康、生産性、家庭...",
    categoryDefault: "何も書かなければ「一般」が割り当てられます",

    // Actions
    save: "保存",
    cancel: "キャンセル",
    delete: "削除",
    confirm: "確認",
    apply: "適用",
    creating: "作成中...",
    saving: "保存中...",
    maybeLater: "後で",
    letsGo: "始めよう！",
    restorePurchases: "購入を復元",
    subscription: "サブスクリプション",
    manageSubscription: "サブスクリプションの管理",
    status: "ステータス",
    free: "無料",
    pro: "Pro",

    // Stats
    statistics: "統計",
    weeklyStatistics: "週間統計",
    streak: "連続",
    completed: "完了",
    completedThisWeek: "今週完了",
    dailyPerformance: "日々のパフォーマンス",
    total: "合計",
    activeHabits: "アクティブな習慣",
    bestHabit: "ベスト習慣",

    // Filter
    filterByCategories: "カテゴリでフィルター",
    clearFilters: "フィルターをクリア",
    noCategoriesAvailable: "利用可能なカテゴリがありません",

    // Calendar
    calendarView: "カレンダー表示",
    noHabitsScheduled: "予定された習慣がありません",

    // Days - Short
    mon: "月",
    tue: "火",
    wed: "水",
    thu: "木",
    fri: "金",
    sat: "土",
    sun: "日",

    // Days - Full
    monday: "月曜日",
    tuesday: "火曜日",
    wednesday: "水曜日",
    thursday: "木曜日",
    friday: "金曜日",
    saturday: "土曜日",
    sunday: "日曜日",

    // Months
    january: "1月",
    february: "2月",
    march: "3月",
    april: "4月",
    may: "5月",
    june: "6月",
    july: "7月",
    august: "8月",
    september: "9月",
    october: "10月",
    november: "11月",
    december: "12月",

    // Auth
    welcome: "Ascendへようこそ",
    signInToStart: "習慣を追跡するにはサインインしてください",
    signInWithGoogle: "Googleでサインイン",

    // Paywall / Pro
    ascendPro: "Ascend Pro",
    unlockPotential: "あなたの可能性を最大限に引き出す",
    unlimitedHabits: "無制限の習慣",
    trackEverything: "すべてを追跡",
    advancedStats: "高度な統計",
    visualizeProgress: "進捗を可視化",
    customColors: "カスタムカラー",
    personalizeApp: "アプリをパーソナライズ",
    seeYourFutureHabits: "将来の習慣を見る",
    annualAccess: "年間アクセス",
    monthly: "月額",
    lifetime: "永久",
    congratulations: "おめでとうございます！",
    successfullyUnlocked: "正常にアンロックされました",

    // Locked states
    statisticsLocked: "統計がロックされています",
    unlockStatistics: "統計をアンロック",
    upgradeToProStats:
      "Proにアップグレードして詳細なインサイトを取得し、パフォーマンスを追跡しましょう。",
    calendarLocked: "カレンダー表示がロックされています",
    unlockCalendar: "カレンダーをアンロック",
    upgradeToProCalendar:
      "Proにアップグレードして連続記録を可視化し、進捗を追跡しましょう。",
    habitLimitReached: "習慣の上限に達しました",
    unlockUnlimitedHabits: "無制限の習慣をアンロック",
    freeUserLimit:
      "無料ユーザーは最大3つの習慣を追跡できます。Proにアップグレードして無制限に。",
    premiumColorsLocked: "プレミアムカラーがロックされています",
    unlockPremiumColors: "プレミアムカラーをアンロック",
    upgradeForCustomColors:
      "Proにアップグレードしてカスタムカラーをアンロックしましょう。",

    // Errors & Messages
    habitNameExists: "習慣名は既に存在します",
    errorCreatingHabit: "作成エラー。もう一度お試しください。",
    errorEditingHabit: "習慣を編集できませんでした。もう一度お試しください。",
    errorDeletingHabit: "習慣を削除できませんでした。もう一度お試しください。",
    habitCreatedSuccess: "が正常に作成されました",
    habitEditedSuccess: "が正常に編集されました",
    habitDeletedSuccess: "が正常に削除されました",
    selectAtLeastOneDay: "カスタム頻度には少なくとも1日を選択してください",
    confirmDeleteHabit: "削除してもよろしいですか",
    couldNotUpdate: "更新できませんでした。もう一度お試しください。",
    noActiveSub: "アクティブなサブスクリプションが見つかりません。",

    // Tutorial
    tutorialCreateTitle: "習慣を作成",
    tutorialCreateDesc:
      "ここをクリックして新しい習慣を作成し、追跡を開始します。",
    tutorialCheckTitle: "習慣をチェック",
    tutorialCheckDesc: "ここで毎日の習慣を確認し、チェックします。",
    tutorialSettingsTitle: "設定",
    tutorialSettingsDesc: "体験をカスタマイズし、テーマを変更するなど。",
    tutorialExitConfirm: "チュートリアルを終了してもよろしいですか？",

    // Mobile Auth Callback
    verifyingSession: "セッションを確認中...",
    sessionStarted: "セッション開始！",
    returningToApp: "アプリに戻ります...",
    connecting: "接続中...",
    authError: "認証エラー",
    couldNotLogin: "ログインできませんでした",
    returnToApp: "アプリに戻る",
  },
  ko: {
    // Home View
    hello: "안녕하세요",
    readyToAscend: "오늘도 올라갈 준비 되셨나요?",
    settingsSubtitle: "경험을 맞춤 설정하세요",
    chooseYourVibe: "테마 선택",
    logOut: "로그아웃?",
    customColor: "사용자 정의 색상",

    // Language
    language: "언어",
    selectLanguage: "언어 선택",

    // Colors
    white: "흰색",
    red: "빨강",
    orange: "주황",
    yellow: "노랑",
    green: "초록",
    blue: "파랑",
    purple: "보라",

    // Navigation
    home: "홈",
    check: "체크",
    settings: "설정",

    // Habits
    createHabit: "습관 만들기",
    editHabit: "습관 수정",
    deleteHabit: "습관 삭제",
    habitName: "습관 이름",
    habitColor: "습관 색상",
    category: "카테고리",
    frequency: "빈도",
    time: "알림",
    notificationTime: "알림 시간",
    notificationTitle: "습관 알림",
    notificationBody: "습관을 실천할 시간입니다: {habitName}!",
    dailyGoal: "일일 목표",
    dailyGoalPlaceholder: "목표 선택",
    daily: "매일",
    everyDay: "매일",
    everyTwoDays: "이틀마다",
    weekends: "주말",
    weekendsSatSun: "주말 (토 & 일)",
    custom: "사용자 정의",
    todaysHabits: "오늘의 습관",
    allHabits: "모든 습관",
    noHabits: "습관이 없습니다. 하나 만들어 시작하세요!",
    noHabitsInCategory: "선택한 카테고리에 습관이 없습니다.",
    creatingHabit: "생성 중...",
    savingHabit: "저장 중...",
    habitPlaceholder: "예: 운동, 독서, 명상...",
    categoryPlaceholder: "예: 건강, 생산성, 가정...",
    categoryDefault: '아무것도 적지 않으면 "일반"이 지정됩니다',

    // Actions
    save: "저장",
    cancel: "취소",
    delete: "삭제",
    confirm: "확인",
    apply: "적용",
    creating: "생성 중...",
    saving: "저장 중...",
    maybeLater: "나중에",
    letsGo: "시작하기!",
    restorePurchases: "구매 복원",
    subscription: "구독",
    manageSubscription: "구독 관리",
    status: "상태",
    free: "무료",
    pro: "Pro",

    // Stats
    statistics: "통계",
    weeklyStatistics: "주간 통계",
    streak: "연속",
    completed: "완료",
    completedThisWeek: "이번 주 완료",
    dailyPerformance: "일일 성과",
    total: "전체",
    activeHabits: "활성 습관",
    bestHabit: "최고 습관",

    // Filter
    filterByCategories: "카테고리로 필터",
    clearFilters: "필터 지우기",
    noCategoriesAvailable: "사용 가능한 카테고리 없음",

    // Calendar
    calendarView: "캘린더 보기",
    noHabitsScheduled: "예정된 습관 없음",

    // Days - Short
    mon: "월",
    tue: "화",
    wed: "수",
    thu: "목",
    fri: "금",
    sat: "토",
    sun: "일",

    // Days - Full
    monday: "월요일",
    tuesday: "화요일",
    wednesday: "수요일",
    thursday: "목요일",
    friday: "금요일",
    saturday: "토요일",
    sunday: "일요일",

    // Months
    january: "1월",
    february: "2월",
    march: "3월",
    april: "4월",
    may: "5월",
    june: "6월",
    july: "7월",
    august: "8월",
    september: "9월",
    october: "10월",
    november: "11월",
    december: "12월",

    // Auth
    welcome: "Ascend에 오신 것을 환영합니다",
    signInToStart: "습관 추적을 시작하려면 로그인하세요",
    signInWithGoogle: "Google로 로그인",

    // Paywall / Pro
    ascendPro: "Ascend Pro",
    unlockPotential: "당신의 잠재력을 최대한 발휘하세요",
    unlimitedHabits: "무제한 습관",
    trackEverything: "모든 것을 추적",
    advancedStats: "고급 통계",
    visualizeProgress: "진행 상황 시각화",
    customColors: "사용자 정의 색상",
    personalizeApp: "앱 개인화",
    seeYourFutureHabits: "미래 습관 보기",
    annualAccess: "연간 이용권",
    monthly: "월간",
    lifetime: "평생",
    congratulations: "축하합니다!",
    successfullyUnlocked: "성공적으로 잠금 해제됨",

    // Locked states
    statisticsLocked: "통계 잠김",
    unlockStatistics: "통계 잠금 해제",
    upgradeToProStats:
      "Pro로 업그레이드하여 상세한 인사이트를 얻고 성과를 추적하세요.",
    calendarLocked: "캘린더 보기 잠김",
    unlockCalendar: "캘린더 잠금 해제",
    upgradeToProCalendar:
      "Pro로 업그레이드하여 연속 기록을 시각화하고 진행 상황을 추적하세요.",
    habitLimitReached: "습관 한도 도달",
    unlockUnlimitedHabits: "무제한 습관 잠금 해제",
    freeUserLimit:
      "무료 사용자는 최대 3개의 습관을 추적할 수 있습니다. Pro로 업그레이드하여 무제한으로.",
    premiumColorsLocked: "프리미엄 색상 잠김",
    unlockPremiumColors: "프리미엄 색상 잠금 해제",
    upgradeForCustomColors:
      "Pro로 업그레이드하여 사용자 정의 색상을 잠금 해제하세요.",

    // Errors & Messages
    habitNameExists: "습관 이름이 이미 존재합니다",
    errorCreatingHabit: "생성 오류. 다시 시도해 주세요.",
    errorEditingHabit: "습관을 수정할 수 없습니다. 다시 시도해 주세요.",
    errorDeletingHabit: "습관을 삭제할 수 없습니다. 다시 시도해 주세요.",
    habitCreatedSuccess: "성공적으로 생성됨",
    habitEditedSuccess: "성공적으로 수정됨",
    habitDeletedSuccess: "성공적으로 삭제됨",
    selectAtLeastOneDay: "사용자 정의 빈도에는 최소 하루를 선택하세요",
    confirmDeleteHabit: "정말 삭제하시겠습니까",
    couldNotUpdate: "업데이트할 수 없습니다. 다시 시도해 주세요.",
    noActiveSub: "활성 구독을 찾을 수 없습니다.",

    // Tutorial
    tutorialCreateTitle: "습관 만들기",
    tutorialCreateDesc: "여기를 클릭하여 새 습관을 만들고 추적을 시작하세요.",
    tutorialCheckTitle: "습관 확인",
    tutorialCheckDesc: "여기에서 매일의 습관을 확인하고 체크하세요.",
    tutorialSettingsTitle: "설정",
    tutorialSettingsDesc:
      "경험을 사용자 정의하고 테마를 변경하는 등 다양한 기능을 이용하세요.",
    tutorialExitConfirm: "튜토리얼을 종료하시겠습니까?",

    // Mobile Auth Callback
    verifyingSession: "세션 확인 중...",
    sessionStarted: "세션 시작!",
    returningToApp: "앱으로 돌아가는 중...",
    connecting: "연결 중...",
    authError: "인증 오류",
    couldNotLogin: "로그인할 수 없습니다",
    returnToApp: "앱으로 돌아가기",
  },
  zh: {
    // Home View
    hello: "你好",
    readyToAscend: "今天准备好提升了吗？",
    settingsSubtitle: "自定义您的体验",
    chooseYourVibe: "选择你的风格",
    logOut: "登出？",
    customColor: "自定义颜色",

    // Language
    language: "语言",
    selectLanguage: "选择语言",

    // Colors
    white: "白色",
    red: "红色",
    orange: "橙色",
    yellow: "黄色",
    green: "绿色",
    blue: "蓝色",
    purple: "紫色",

    // Navigation
    home: "首页",
    check: "检查",
    settings: "设置",

    // Habits
    createHabit: "创建习惯",
    editHabit: "编辑习惯",
    deleteHabit: "删除习惯",
    habitName: "习惯名称",
    habitColor: "习惯颜色",
    category: "类别",
    frequency: "频率",
    time: "提醒",
    notificationTime: "通知时间",
    notificationTitle: "习惯提醒",
    notificationBody: "是时候进行您的习惯了：{habitName}！",
    dailyGoal: "每日目标",
    dailyGoalPlaceholder: "选择目标",
    daily: "每天",
    everyDay: "每天",
    everyTwoDays: "每两天",
    weekends: "周末",
    weekendsSatSun: "周末（周六和周日）",
    custom: "自定义",
    todaysHabits: "今日习惯",
    allHabits: "所有习惯",
    noHabits: "您没有习惯。创建一个开始吧！",
    noHabitsInCategory: "所选类别中没有习惯。",
    creatingHabit: "创建中...",
    savingHabit: "保存中...",
    habitPlaceholder: "例如：运动、阅读、冥想...",
    categoryPlaceholder: "例如：健康、生产力、家庭...",
    categoryDefault: '如果不填写，将分配"通用"',

    // Actions
    save: "保存",
    cancel: "取消",
    delete: "删除",
    confirm: "确认",
    apply: "应用",
    creating: "创建中...",
    saving: "保存中...",
    maybeLater: "稍后",
    letsGo: "开始吧！",
    restorePurchases: "恢复购买",
    subscription: "订阅",
    manageSubscription: "管理订阅",
    status: "状态",
    free: "免费",
    pro: "Pro",

    // Stats
    statistics: "统计",
    weeklyStatistics: "周统计",
    streak: "连续",
    completed: "已完成",
    completedThisWeek: "本周完成",
    dailyPerformance: "每日表现",
    total: "总计",
    activeHabits: "活跃习惯",
    bestHabit: "最佳习惯",

    // Filter
    filterByCategories: "按类别筛选",
    clearFilters: "清除筛选",
    noCategoriesAvailable: "没有可用类别",

    // Calendar
    calendarView: "日历视图",
    noHabitsScheduled: "没有预定的习惯",

    // Days - Short
    mon: "一",
    tue: "二",
    wed: "三",
    thu: "四",
    fri: "五",
    sat: "六",
    sun: "日",

    // Days - Full
    monday: "星期一",
    tuesday: "星期二",
    wednesday: "星期三",
    thursday: "星期四",
    friday: "星期五",
    saturday: "星期六",
    sunday: "星期日",

    // Months
    january: "一月",
    february: "二月",
    march: "三月",
    april: "四月",
    may: "五月",
    june: "六月",
    july: "七月",
    august: "八月",
    september: "九月",
    october: "十月",
    november: "十一月",
    december: "十二月",

    // Auth
    welcome: "欢迎来到 Ascend",
    signInToStart: "登录以开始追踪您的习惯",
    signInWithGoogle: "使用 Google 登录",

    // Paywall / Pro
    ascendPro: "Ascend Pro",
    unlockPotential: "释放您的全部潜力",
    unlimitedHabits: "无限习惯",
    trackEverything: "追踪一切",
    advancedStats: "高级统计",
    visualizeProgress: "可视化您的进度",
    customColors: "自定义颜色",
    personalizeApp: "个性化您的应用",
    seeYourFutureHabits: "查看您未来的习惯",
    annualAccess: "年度访问",
    monthly: "月度",
    lifetime: "终身",
    congratulations: "恭喜！",
    successfullyUnlocked: "您已成功解锁",

    // Locked states
    statisticsLocked: "统计已锁定",
    unlockStatistics: "解锁统计",
    upgradeToProStats: "升级到Pro获取详细洞察并追踪您的表现。",
    calendarLocked: "日历视图已锁定",
    unlockCalendar: "解锁日历",
    upgradeToProCalendar: "升级到Pro可视化您的连续记录并追踪您的进度。",
    habitLimitReached: "习惯数量已达上限",
    unlockUnlimitedHabits: "解锁无限习惯",
    freeUserLimit: "免费用户最多可追踪3个习惯。升级到Pro享受无限习惯。",
    premiumColorsLocked: "高级颜色已锁定",
    unlockPremiumColors: "解锁高级颜色",
    upgradeForCustomColors: "升级到Pro解锁自定义颜色。",

    // Errors & Messages
    habitNameExists: "习惯名称已存在",
    errorCreatingHabit: "创建错误。请重试。",
    errorEditingHabit: "无法编辑习惯。请重试。",
    errorDeletingHabit: "无法删除习惯。请重试。",
    habitCreatedSuccess: "创建成功",
    habitEditedSuccess: "编辑成功",
    habitDeletedSuccess: "删除成功",
    selectAtLeastOneDay: "请为自定义频率选择至少一天",
    confirmDeleteHabit: "确定要删除吗",
    couldNotUpdate: "无法更新。请重试。",
    noActiveSub: "未找到活跃订阅。",

    // Tutorial
    tutorialCreateTitle: "创建习惯",
    tutorialCreateDesc: "点击此处创建一个新习惯并开始追踪。",
    tutorialCheckTitle: "检查习惯",
    tutorialCheckDesc: "在此处查看并勾选您的每日习惯。",
    tutorialSettingsTitle: "设置",
    tutorialSettingsDesc: "自定义您的体验，更改主题等。",
    tutorialExitConfirm: "您确定要退出教程吗？",

    // Mobile Auth Callback
    verifyingSession: "正在验证会话...",
    sessionStarted: "会话已开始！",
    connecting: "连接中...",
    returningToApp: "返回应用...",
    authError: "认证错误",
    couldNotLogin: "无法登录",
    returnToApp: "返回应用",
  },
};

export const languageNames: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  zh: "中文",
};

export const languageFlags: Record<Language, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  pt: "🇧🇷",
  it: "🇮🇹",
  ja: "🇯🇵",
  ko: "🇰🇷",
  zh: "🇨🇳",
};
