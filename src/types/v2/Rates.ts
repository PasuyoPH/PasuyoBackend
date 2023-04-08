// Income rates
const DEFAULT_INCOME_RATE = .25,
  /*
    Based on rider level.
    If rider is at lowest rank, company will take .25 (or 25%) of takings.
    E.g, for a Php 10.00 fee, company will take .25 which is Php 2.5, and rider keeps Php 7.5.
    With rider's balance, this will deduct Php 2.5 to them as that will go to the company.
  */
  IncomeRates = [
    DEFAULT_INCOME_RATE,
    .24,
    .23,
    .22,
    .21,
    .2
  ]

export {
  DEFAULT_INCOME_RATE,
  IncomeRates
}