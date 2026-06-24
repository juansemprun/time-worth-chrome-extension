(function(global) {
  const dictionaries = {
    en: {
      popupTitle: 'TimeWorth',
      popupSubtitle: 'See what purchases cost in working time.',
      salaryPeriod: 'Salary period',
      salaryPeriodSelector: 'Salary period selector',
      annual: 'Annual',
      monthly: 'Monthly',
      netSalaryLabel: 'Net salary amount',
      currencySelector: 'Currency selector',
      netSalaryHelp: 'Enter your net salary (what you actually receive in hand).',
      weeklyHoursLabel: 'Weekly work hours',
      weeklyHoursSuffix: 'hrs',
      weeklyHoursHelp: 'Typical hours worked per week.',
      hourlyRateLabel: 'Estimated hourly rate',
      hourlyRateSuffix: 'hr',
      saveButton: 'Save settings',
      successToast: 'Settings saved successfully!',
      salaryValidation: 'Please enter a valid positive salary amount.',
      weeklyHoursValidation: 'Please enter work hours between {min} and {max} hours per week.',
      badgeHoursAbbreviation: 'hrs',
      tooltipSalaryTypeAnnual: 'annual',
      tooltipSalaryTypeMonthly: 'monthly',
      badgeTooltip: 'Equivalent to {currency}{price} based on your salary\nCalculated based on hourly rate of {currency}{hourlyRate}/{hourUnit} ({salaryType} salary: {currency}{salaryAmount}, {weeklyHours} {hoursUnit}/week)'
    },
    es: {
      popupTitle: 'TimeWorth',
      popupSubtitle: 'Ve cuánto cuestan tus compras en tiempo de trabajo.',
      salaryPeriod: 'Periodo salarial',
      salaryPeriodSelector: 'Selector de periodo salarial',
      annual: 'Anual',
      monthly: 'Mensual',
      netSalaryLabel: 'Salario neto',
      currencySelector: 'Selector de moneda',
      netSalaryHelp: 'Ingresa tu salario neto (lo que realmente recibes).',
      weeklyHoursLabel: 'Horas de trabajo semanales',
      weeklyHoursSuffix: 'h',
      weeklyHoursHelp: 'Horas típicas trabajadas por semana.',
      hourlyRateLabel: 'Tarifa por hora estimada',
      hourlyRateSuffix: 'h',
      saveButton: 'Guardar ajustes',
      successToast: '¡Ajustes guardados correctamente!',
      salaryValidation: 'Ingresa un salario positivo válido.',
      weeklyHoursValidation: 'Ingresa horas de trabajo entre {min} y {max} por semana.',
      badgeHoursAbbreviation: 'h',
      tooltipSalaryTypeAnnual: 'anual',
      tooltipSalaryTypeMonthly: 'mensual',
      badgeTooltip: 'Equivale a {currency}{price} según tu salario\nCalculado con una tarifa por hora de {currency}{hourlyRate}/{hourUnit} (salario {salaryType}: {currency}{salaryAmount}, {weeklyHours} {hoursUnit}/semana)'
    }
  };

  function getBrowserLanguage() {
    if (global.chrome && global.chrome.i18n && typeof global.chrome.i18n.getUILanguage === 'function') {
      try {
        return global.chrome.i18n.getUILanguage();
      } catch (error) {
        // The extension context can be invalidated after reloads while an old content script is still running.
      }
    }

    return global.navigator && global.navigator.language ? global.navigator.language : 'en';
  }

  function getLanguageCode(language) {
    return String(language || '').toLowerCase().startsWith('es') ? 'es' : 'en';
  }

  function translate(key, replacements) {
    const languageCode = getLanguageCode(getBrowserLanguage());
    const dictionary = dictionaries[languageCode] || dictionaries.en;
    let value = dictionary[key] || dictionaries.en[key] || key;

    if (replacements) {
      Object.keys(replacements).forEach((name) => {
        value = value.replace(new RegExp(`\\{${name}\\}`, 'g'), replacements[name]);
      });
    }

    return value;
  }

  global.TimeWorthI18n = Object.freeze({
    dictionaries,
    getBrowserLanguage,
    getLanguageCode,
    translate
  });
})(window);
