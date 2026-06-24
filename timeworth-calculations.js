(function(global) {
  const DEFAULT_SETTINGS = Object.freeze({
    currencySymbol: '$',
    salaryType: 'annual',
    salaryAmount: 50000,
    weeklyHours: 40
  });

  const WEEKLY_HOURS_MIN = 1;
  const WEEKLY_HOURS_MAX = 168;
  const WEEKS_PER_YEAR = 52;
  const WEEKS_PER_MONTH_APPROXIMATION = 4.33;

  function isValidSalaryAmount(value) {
    const salaryAmount = Number(value);
    return Number.isFinite(salaryAmount) && salaryAmount > 0;
  }

  function isValidWeeklyHours(value) {
    const weeklyHours = Number(value);
    return Number.isFinite(weeklyHours) && weeklyHours >= WEEKLY_HOURS_MIN && weeklyHours <= WEEKLY_HOURS_MAX;
  }

  function calculateHourlyRate(settings) {
    const normalizedSettings = Object.assign({}, DEFAULT_SETTINGS, settings);

    if (!isValidSalaryAmount(normalizedSettings.salaryAmount) || !isValidWeeklyHours(normalizedSettings.weeklyHours)) {
      return 0;
    }

    const salaryAmount = Number(normalizedSettings.salaryAmount);
    const weeklyHours = Number(normalizedSettings.weeklyHours);
    const weeksInPeriod = normalizedSettings.salaryType === 'monthly'
      ? WEEKS_PER_MONTH_APPROXIMATION
      : WEEKS_PER_YEAR;

    return salaryAmount / (weeklyHours * weeksInPeriod);
  }

  global.TimeWorthCalculations = Object.freeze({
    DEFAULT_SETTINGS,
    WEEKLY_HOURS_MIN,
    WEEKLY_HOURS_MAX,
    WEEKS_PER_YEAR,
    WEEKS_PER_MONTH_APPROXIMATION,
    calculateHourlyRate,
    isValidSalaryAmount,
    isValidWeeklyHours
  });
})(window);
