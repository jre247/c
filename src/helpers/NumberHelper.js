var NumberHelper  = {
  formatNumber(value, precision = 0) {
    return value.toLocaleString(navigator.language, { minimumFractionDigits: precision });
  }
}

export default NumberHelper;
