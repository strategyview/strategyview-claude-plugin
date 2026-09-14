source: script://grammar

# Rule language

Statements over the indicators already on the chart. Their aliases and plots come with the
question. There are no variables, no loops and no functions of your own: if a value is
not on the chart or listed below, it does not exist.

## Statements

  long_when: <condition>
      Open a long on the bar where this becomes true.
  short_when: <condition>
      Open a short on the bar where this becomes true.
  exit_when: <condition>
      Close whatever is open. Applies to both sides.
  exit_long_when: <condition>
      Close only a long. Use when the two sides exit differently.
  exit_short_when: <condition>
      Close only a short.
  size: <size>  (required)
      How much to commit per entry.
  stop_loss: <percent>
      Close at this loss from entry.
  take_profit: <percent>
      Close at this gain from entry.
  trailing_stop: <percent>
      Close at this retracement from the best price reached during the trade.

  <size> is a number and a unit: % equity | usd | coin. Example: 10% equity
  <percent> is a number followed by %. Example: 2%

## A complete script

  long_when:   crossover(cvd.cvd, cvd.ma)
           and hour >= 14
  exit_when:   crossunder(cvd.cvd, cvd.ma)
  size:        10% equity
  stop_loss:   2%

  References are bare words. Never quoted, never in brackets.

## Values

  alias.plot     a plot of an indicator on the chart, e.g. cvd.ma
  open           Open of the current bar.
  high           High of the current bar.
  low            Low of the current bar.
  close          Close of the current bar.
  volume         Volume of the current bar.
  in_long        A long position is open.
  in_short       A short position is open.
  flat           No position is open.
  bars_in_trade  Bars since the open position was entered. Zero when flat.
  pnl_pct        Unrealised profit of the open position, percent. Zero when flat.
  hour           Hour of the bar, 0-23, UTC.
  dayofweek      Day of the bar, 1 Monday to 7 Sunday, UTC.

## Operators

  == != >= <= > <    compare two numbers
  not and or     combine conditions, and () to group
  + - * /        arithmetic

## Functions

  crossover(a, b)             True only on the bar where a crosses from below b to above. Not while above.
  crossunder(a, b)            True only on the bar where a crosses from above b to below.
  rising(a, bars)             True when a has increased on each of the last N bars.
  falling(a, bars)            True when a has decreased on each of the last N bars.
  highest(a, bars)            Highest value of a over the last N bars, current bar included.
  lowest(a, bars)             Lowest value of a over the last N bars, current bar included.
  change(a, bars)             a minus its value N bars ago.
  abs(a)                      Absolute value.
  within(condition, bars)     True when the condition held on any of the last N bars. Widens a one-bar event.
  bars_since(condition)       Bars elapsed since the condition was last true. Very large until it first is.

  A `bars` argument is a positive whole number written literally, not an expression.

## Not expressible

  Variables, loops, several positions at once, pyramiding, parameter optimisation, and
  indicators that are not already on the chart. Say so plainly rather than writing
  something that compiles and measures a different idea.
