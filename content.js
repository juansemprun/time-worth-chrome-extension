(function() {
  const calculations = window.TimeWorthCalculations;
  const i18n = window.TimeWorthI18n;

  // Inject styles for the badge dynamically
  const style = document.createElement('style');
  style.id = 'timeworth-styles';
  style.textContent = `
    .timeworth-badge {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #eff6ff !important;
      color: #0f172a !important;
      border: 1px solid #bfdbfe !important;
      border-radius: 999px !important;
      padding: 4px 9px !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      font-size: 0.76em !important;
      font-weight: 600 !important;
      line-height: 1 !important;
      vertical-align: baseline !important;
      top: -2px !important;
      margin-left: 8px !important;
      box-shadow: 0 2px 10px rgba(37, 99, 235, 0.12) !important;
      transition: background-color 160ms ease, border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease !important;
      cursor: help !important;
      user-select: none !important;
    }
    
    .timeworth-badge:hover {
      background: #dbeafe !important;
      border-color: #93c5fd !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.16) !important;
    }

    .timeworth-badge svg {
      width: 12px;
      height: 12px;
      stroke: #2563eb;
      fill: none;
      stroke-width: 2.5;
      flex: 0 0 auto;
      display: block;
    }
  `;
  document.head.appendChild(style);

  // Constants
  const PRICE_SELECTORS = [
    '#corePrice_feature_div .a-price .a-offscreen',
    '#corePriceDisplay_desktop_feature_div .a-price .a-offscreen',
    '#priceblock_ourprice',
    '#priceblock_dealprice',
    '#priceblock_saleprice',
    '.a-price[data-a-size="xl"] .a-offscreen',
    '.a-price[data-a-size="l"] .a-offscreen',
    '.a-price .a-offscreen'
  ];

  let userSettings = null;
  let hourlyWage = 0;

  function getSyncStorage() {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.sync) {
      return null;
    }

    return chrome.storage.sync;
  }

  // Retrieve user settings and calculate hourly wage
  function loadSettings(callback) {
    const syncStorage = getSyncStorage();

    if (!syncStorage) {
      userSettings = calculations.DEFAULT_SETTINGS;
      hourlyWage = calculations.calculateHourlyRate(userSettings);
      if (callback) callback();
      return;
    }

    syncStorage.get(calculations.DEFAULT_SETTINGS, (items) => {
      userSettings = items;
      hourlyWage = calculations.calculateHourlyRate(items);
      if (callback) callback();
    });
  }

  // Parse price string to float (normalized to support commas and periods)
  function parsePrice(priceText) {
    if (!priceText) return null;
    
    // Clean string: remove spaces, currency symbols, and other characters, keeping only digits, commas, and periods
    let cleaned = priceText.replace(/[^\d.,]/g, '').trim();
    if (!cleaned) return null;

    const lastPeriodIdx = cleaned.lastIndexOf('.');
    const lastCommaIdx = cleaned.lastIndexOf(',');

    if (lastPeriodIdx > lastCommaIdx) {
      // Period is the last separator
      const segmentAfter = cleaned.slice(lastPeriodIdx + 1);
      // If segment after is 1 or 2 digits, it's the decimal separator
      if (/^\d{1,2}$/.test(segmentAfter)) {
        cleaned = cleaned.replace(/,/g, '');
      } else {
        // Thousands separator without decimals
        cleaned = cleaned.replace(/[.,]/g, '');
      }
    } else if (lastCommaIdx > lastPeriodIdx) {
      // Comma is the last separator
      const segmentAfter = cleaned.slice(lastCommaIdx + 1);
      if (/^\d{1,2}$/.test(segmentAfter)) {
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
      } else {
        cleaned = cleaned.replace(/[.,]/g, '');
      }
    }

    const value = parseFloat(cleaned);
    return isNaN(value) ? null : value;
  }

  // Format hours nicely
  function formatHours(hours) {
    if (hours < 0.1) {
      return hours.toFixed(2);
    }
    return hours.toFixed(1);
  }

  // Inject or update the hours badge next to the price element
  function processPriceElement(element) {
    const rawPriceText = element.textContent.trim();
    const priceValue = parsePrice(rawPriceText);

    if (!priceValue || hourlyWage <= 0) return;

    const hoursEquivalent = priceValue / hourlyWage;
    const formattedHours = formatHours(hoursEquivalent);
    const badgeText = `(~${formattedHours} ${i18n.translate('badgeHoursAbbreviation')})`;
    const currencySymbol = userSettings.currencySymbol;
    const tooltipText = i18n.translate('badgeTooltip', {
      currency: currencySymbol,
      price: priceValue,
      hourlyRate: hourlyWage.toFixed(2),
      hourUnit: i18n.translate('hourlyRateSuffix'),
      salaryType: i18n.translate(userSettings.salaryType === 'monthly' ? 'tooltipSalaryTypeMonthly' : 'tooltipSalaryTypeAnnual'),
      salaryAmount: userSettings.salaryAmount,
      weeklyHours: userSettings.weeklyHours,
      hoursUnit: i18n.translate('badgeHoursAbbreviation')
    });

    // Determine the element to insert after.
    // If it's a hidden .a-offscreen span inside a .a-price container, we want to insert after the .a-price container itself.
    const targetToInsertAfter = element.closest('.a-price') || element;

    // Check if the badge already exists as the next sibling of the target
    const existingBadge = targetToInsertAfter.nextElementSibling;
    if (existingBadge && existingBadge.classList.contains('timeworth-badge')) {
      const textSpan = existingBadge.querySelector('.hours-text');
      if (textSpan && textSpan.textContent !== badgeText) {
        textSpan.textContent = badgeText;
        existingBadge.setAttribute('title', tooltipText);
      }
      return;
    }

    // Create the badge element
    const badge = document.createElement('span');
    badge.className = 'timeworth-badge';
    badge.setAttribute('title', tooltipText);

    // SVG clock icon
    badge.innerHTML = `
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span class="hours-text">${badgeText}</span>
    `;

    // Insert badge after the target element
    targetToInsertAfter.parentNode.insertBefore(badge, targetToInsertAfter.nextSibling);
  }

  // Run calculation over all matched price elements
  function runCalculation() {
    if (hourlyWage <= 0) return;

    PRICE_SELECTORS.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        // Skip elements that are nested inside another element that we processed, or avoid doing it on empty elements
        if (element.textContent.trim()) {
          processPriceElement(element);
        }
      });
    });
  }

  // Initial Load and Setup
  loadSettings(() => {
    runCalculation();

    // Debounced observer to watch for dynamic DOM updates (SPA transitions, variations, scroll loading)
    let debounceTimeout = null;
    const observer = new MutationObserver(() => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        runCalculation();
      }, 150);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Listen for changes in chrome storage to dynamically update badges without page reload
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync') {
          loadSettings(() => {
            // Remove old badges to force recalculation with new settings
            document.querySelectorAll('.timeworth-badge').forEach(b => b.remove());
            runCalculation();
          });
        }
      });
    }
  });
})();
