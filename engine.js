/* BBQMath engine - honest low-and-slow math. Pure functions, no DOM. */
var BBQEngine = (function () {
  /* hours per pound at grate temp */
  var RATES = {
    brisket: { 225: 1.5, 250: 1.25, 275: 1.1 },
    butt:    { 225: 2.0, 250: 1.5, 275: 1.25 }
  };
  /* ribs go by type and time, not weight */
  var RIB_HOURS = { baby: { 225: 5, 250: 4, 275: 3.5 }, spare: { 225: 6, 250: 5, 275: 4.5 } };
  /* cooked yield after trim and cook */
  var YIELD = { brisket: 0.55, butt: 0.60 };
  /* rough charcoal appetite, lb per hour at 225-250F */
  var FUEL = { kettle: 0.6, kamado: 0.4, offset: 2.0 };
  var DONENESS = {
    brisket: { pull: 203, note: 'probe-tender beats the number - 203F is where it usually happens, not a law' },
    butt: { pull: 205, note: 'the bone should slide out clean; 205F is pulling territory' }
  };

  function r1(x) { return Math.round(x * 10) / 10; }

  function cookHours(meat, lb, tempF) {
    if (meat === 'ribs-baby' || meat === 'ribs-spare') {
      var t = meat === 'ribs-baby' ? RIB_HOURS.baby : RIB_HOURS.spare;
      return t[tempF] || null;
    }
    var rate = RATES[meat] && RATES[meat][tempF];
    if (!rate) throw new Error('unknown meat/temp combo');
    return r1(lb * rate);
  }

  function yieldPct(meat) {
    return YIELD[meat];
  }

  /* raw pounds to buy: guests at half a pound cooked each */
  function rawForGuests(guests, meat, lbPerPerson) {
    var per = lbPerPerson || 0.5;
    return r1(guests * per / YIELD[meat]);
  }

  function servings(rawLb, meat, lbPerPerson) {
    var per = lbPerPerson || 0.5;
    return Math.floor(rawLb * YIELD[meat] / per);
  }

  /* work backwards from serve time; returns hours before serve to light the fire */
  function serveTimeline(serveHour24, cookH, restH, bufferH) {
    var rest = restH == null ? 1.5 : restH;
    var buffer = bufferH == null ? 1 : bufferH;
    var total = r1(cookH + rest + buffer);
    var start = serveHour24 - total;
    var dayBefore = start < 0;
    if (dayBefore) start += 24;
    return { totalHours: total, fireHour: r1(start), dayBefore: dayBefore, rest: rest, buffer: buffer };
  }

  function doneness(meat) { return DONENESS[meat]; }

  function fuelLb(hours, cooker) {
    var f = FUEL[cooker];
    if (!f) throw new Error('unknown cooker');
    return r1(hours * f);
  }

  function stallNote() {
    return 'the stall parks the internal temp around 150-170F for hours while evaporation does its thing - wrap in foil or butcher paper to push through, or wait it out and keep the bark';
  }

  function restVerdict(restH) {
    if (restH < 1) return 'too short - the juices are still running; give it at least an hour wrapped';
    if (restH <= 2) return 'the sweet spot - wrapped in a towel in a cooler it holds for hours';
    return 'fine in a dry cooler - a wrapped brisket holds safe and hot for 4+ hours, and the texture only improves';
  }

  return {
    RATES: RATES, YIELD: YIELD, FUEL: FUEL, DONENESS: DONENESS,
    cookHours: cookHours, yieldPct: yieldPct, rawForGuests: rawForGuests,
    servings: servings, serveTimeline: serveTimeline, doneness: doneness,
    fuelLb: fuelLb, stallNote: stallNote, restVerdict: restVerdict
  };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = BBQEngine;
