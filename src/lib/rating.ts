export interface RatingParams {
  ratingCount: number;
  ratingAverage: number;
  globalMean?: number;
  minRatings?: number;
}

export function calculateBayesianScore({
  ratingCount,
  ratingAverage,
  globalMean = 3.5,
  minRatings = 5,
}: RatingParams): number {
  if (ratingCount <= 0) return 0;
  const weightedObserved = (ratingCount / (ratingCount + minRatings)) * ratingAverage;
  const weightedPrior = (minRatings / (ratingCount + minRatings)) * globalMean;
  return Number((weightedObserved + weightedPrior).toFixed(4));
}

export function formatRating(val: number): string {
  return Number(val || 0).toFixed(1);
}
