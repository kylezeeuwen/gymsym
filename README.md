# gymsym
visual sim to determine ideal behaviour for putting dumbells back on the rack

See the project gitpage here : http://kylezeeuwen.github.io/gymsym/

> Over the last two days I completed "Milestone 3", which made the visualization much easier to understand and added some routing to the mix. However, at present there is a bug I haven't had a chance to investigate. You will get the feared angular fail {{}} did not interpolate content error. Simply refresh, and everything will be good.


## install notes

1. You must have gulp installed globally via `sudo npm install -g gulp`
2. You must have the sass ruby gem installed globally via `sudo gem install sass`
3. Install local npm dependencies via `npm install`
4. Install local bower dependencies via `bower install`

## To run the server locally

1. Run `gulp serve` (must have chrome web browser installed for the auto open to work)
2. Go to `http://localhost:9000/`

## Next Steps

1. add non-zero time rest and put weights back periods
2. add users xy in grid (could dynamic move ppl as they arrive)
3. add randomized cornyMotion
