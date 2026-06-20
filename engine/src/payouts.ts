// Usage metering + revenue share. Consumers' usage generates gross revenue; creators
// get a share (default 80%); the marketplace keeps the rest.

const DEFAULT_CREATOR_SHARE = 0.8;

export function creatorPayout(grossUsd: number, share = DEFAULT_CREATOR_SHARE): number {
  return Math.round(grossUsd * share * 100) / 100;
}

export function marketplaceFee(grossUsd: number, share = DEFAULT_CREATOR_SHARE): number {
  return Math.round(grossUsd * (1 - share) * 100) / 100;
}
