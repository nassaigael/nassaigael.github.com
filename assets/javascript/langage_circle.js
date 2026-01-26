function makesvg(level, inner_text = "") {

  // Mapping des niveaux vers des pourcentages pour l'affichage visuel
  const levelToPercent = {
    "A1": 20,
    "A2": 40,
    "B1": 60,
    "B2": 75,
    "C1": 85,
    "C2": 95
  };

  var percentage = levelToPercent[level] || 0;
  var abs_percentage = Math.abs(percentage).toString();
  var classes = "success-stroke";

  var svg = '<svg class="circle-chart" viewbox="0 0 33.83098862 33.83098862" xmlns="http://www.w3.org/2000/svg">'
    + '<circle class="circle-chart__background" cx="16.9" cy="16.9" r="15.9" />'
    + '<circle class="circle-chart__circle ' + classes + '"'
    + 'stroke-dasharray="' + abs_percentage + ',100" cx="16.9" cy="16.9" r="15.9" />'
    + '<g class="circle-chart__info">'
    + '   <text class="circle-chart__percent" x="17.9" y="15.5">' + level + '</text>';

  if (inner_text) {
    svg += '<text class="circle-chart__subline" x="16.91549431" y="22">' + inner_text + '</text>'
  }

  svg += ' </g></svg>';

  return svg;
}

(function ($) {
  $.fn.circlechart = function () {
    this.each(function () {
      var level = $(this).data("level");
      var inner_text = $(this).text();
      $(this).html(makesvg(level, inner_text));
    });
    return this;
  };
}(jQuery));