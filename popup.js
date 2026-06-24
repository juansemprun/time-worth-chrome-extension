document.addEventListener('DOMContentLoaded', () => {
  const calculations = window.TimeWorthCalculations;
  const i18n = window.TimeWorthI18n;
  const currencySelector = document.getElementById('currency-selector');
  const salaryAmountInput = document.getElementById('salary-amount');
  const weeklyHoursInput = document.getElementById('weekly-hours');
  const calculatedRateSpan = document.getElementById('calculated-rate');
  const saveButton = document.getElementById('save-button');
  const statusToast = document.getElementById('status-toast');
  const salaryTypeRadios = document.getElementsByName('salaryType');
  const t = (key, replacements) => i18n.translate(key, replacements);

  applyLocalization();

  weeklyHoursInput.min = calculations.WEEKLY_HOURS_MIN;
  weeklyHoursInput.max = calculations.WEEKLY_HOURS_MAX;

  // Load settings on popup open
  chrome.storage.sync.get(calculations.DEFAULT_SETTINGS, (items) => {
    currencySelector.value = items.currencySymbol;
    // Set form fields based on saved data
    salaryAmountInput.value = items.salaryAmount;
    weeklyHoursInput.value = items.weeklyHours;
    
    for (const radio of salaryTypeRadios) {
      if (radio.value === items.salaryType) {
        radio.checked = true;
        break;
      }
    }
    
    updateHourlyRatePreview();
  });

  // Calculate and update the preview in real-time
  function updateHourlyRatePreview() {
    const salaryAmount = parseFloat(salaryAmountInput.value);
    const weeklyHours = parseFloat(weeklyHoursInput.value);
    const salaryType = getSelectedSalaryType();

    if (!calculations.isValidSalaryAmount(salaryAmount) || !calculations.isValidWeeklyHours(weeklyHours)) {
      calculatedRateSpan.textContent = `$0.00/${t('hourlyRateSuffix')}`;
      return;
    }

    const hourlyRate = calculations.calculateHourlyRate({
      salaryAmount,
      weeklyHours,
      salaryType
    });

    const currency = currencySelector.value;
    calculatedRateSpan.textContent = `${currency}${hourlyRate.toFixed(2)}/${t('hourlyRateSuffix')}`;
  }

  function applyLocalization() {
    document.documentElement.lang = i18n.getLanguageCode(i18n.getBrowserLanguage());

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
    });
  }

  function getSelectedSalaryType() {
    for (const radio of salaryTypeRadios) {
      if (radio.checked) {
        return radio.value;
      }
    }
    return 'annual';
  }

  // Bind input and change events for real-time preview updating
  currencySelector.addEventListener('change', () => {
    updateHourlyRatePreview();
    // Auto-save currency when changed
    chrome.storage.sync.set({ currencySymbol: currencySelector.value });
  });

  salaryAmountInput.addEventListener('input', updateHourlyRatePreview);
  weeklyHoursInput.addEventListener('input', updateHourlyRatePreview);
  for (const radio of salaryTypeRadios) {
    radio.addEventListener('change', updateHourlyRatePreview);
  }

  // Save Settings
  saveButton.addEventListener('click', () => {
    const currencySymbol = currencySelector.value;
    const salaryAmount = parseFloat(salaryAmountInput.value);
    const weeklyHours = parseFloat(weeklyHoursInput.value);
    const salaryType = getSelectedSalaryType();

    // Input Validation
    if (!calculations.isValidSalaryAmount(salaryAmount)) {
      alert(t('salaryValidation'));
      return;
    }

    if (!calculations.isValidWeeklyHours(weeklyHours)) {
      alert(t('weeklyHoursValidation', {
        min: calculations.WEEKLY_HOURS_MIN,
        max: calculations.WEEKLY_HOURS_MAX
      }));
      return;
    }

    chrome.storage.sync.set({
      currencySymbol,
      salaryType,
      salaryAmount,
      weeklyHours
    }, () => {
      showToast(t('successToast'));
    });
  });

  function showToast(message) {
    statusToast.textContent = message;
    statusToast.classList.add('show');
    
    // Smooth fade out
    setTimeout(() => {
      statusToast.classList.remove('show');
    }, 2000);
  }
});
