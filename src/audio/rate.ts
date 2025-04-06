export function getRate(rateString: string): number {
  const parsedRate = parseInt(rateString, 10);

  if (isNaN(parsedRate)) {
    console.warn("Invalid rate string:", rateString);
    return 0;
  }

  if (parsedRate < 0 || parsedRate > 99) {
    console.warn("Rate out of range:", parsedRate);
    return 0;
  }

  return parsedRate / 10;
}
