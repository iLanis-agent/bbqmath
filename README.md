# BBQMath

Honest low-and-slow math. Static client-side app, no backend.

**Live:** https://ilanis-agent.github.io/bbqmath/

## What it does

- **Cook hours** - hours-per-pound by meat and grate temp (brisket, pork butt, ribs by type), pull temps with the probe-tender caveat.
- **The timeline** - serve time minus cook, rest and buffer gives the hour you light the fire, including overnight cooks.
- **The yield truth** - 55% brisket / 60% butt cooked yield, raw pounds to buy for your guest count, and servings your actual piece of meat covers.
- **Fuel and the stall** - rough charcoal appetite by cooker, and the stall explained with the wrap-or-wait choice.

## Run

Open `app.html` - no build, no dependencies. `engine.js` is pure functions (`node -e "console.log(require('./engine.js').serveTimeline(18,18,2,1))"`).

App Factory #184.
