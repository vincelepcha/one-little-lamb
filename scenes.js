/* One Little Lamb: the drawings.
   Every page is its own little scene, drawn as inline SVG. The same lamb (and its mother)
   appear throughout, built from one shared drawing so they always look like the same characters.
   Gentle movement (breathing, blinking, a wagging tail) is in style.css and switches off with "reduce motion". */
(function () {
  "use strict";

  /* ---------- The lamb ---------- */
  // o: { x, y, s, lying, asleep, flip, mum, cls, blanket }
  // Drawn facing left in a 120 x 80 box with its feet on y = 80.
  function lamb(o) {
    var s = o.s || 1;
    var wool = o.mum ? "#F1E3D0" : "#FBF0E2";
    var face = o.mum ? "#5F4D5C" : "#7A6672";
    var ear = o.mum ? "#54434F" : "#6A5763";
    var leg = o.mum ? "#5A4957" : "#6E5C6B";
    var place = o.flip
      ? "translate(" + (o.x + 120 * s) + " " + o.y + ") scale(" + (-s) + " " + s + ")"
      : "translate(" + o.x + " " + o.y + ") scale(" + s + ")";
    var cls = "lamb" + (o.lying ? " is-lying" : "") + (o.asleep ? " is-asleep" : "") + (o.cls ? " " + o.cls : "");

    return '<g transform="' + place + '"><g class="' + cls + '">' +
      '<ellipse cx="64" cy="81" rx="50" ry="5" fill="#140F26" opacity=".16"/>' +
      '<g class="l-legs" fill="' + leg + '">' +
        '<rect x="36" y="50" width="9" height="30" rx="4.5"/><rect x="49" y="52" width="9" height="28" rx="4.5"/>' +
        '<rect x="80" y="52" width="9" height="28" rx="4.5"/><rect x="93" y="50" width="9" height="30" rx="4.5"/>' +
      '</g>' +
      '<g class="l-body">' +
        '<g class="l-breathe">' +
          '<g class="l-tail"><circle cx="108" cy="38" r="7.5" fill="' + wool + '"/></g>' +
          '<g fill="' + wool + '">' +
            '<circle cx="48" cy="42" r="16"/><circle cx="64" cy="32" r="18"/><circle cx="84" cy="34" r="16"/>' +
            '<circle cx="97" cy="45" r="13"/><circle cx="82" cy="55" r="15"/><circle cx="62" cy="55" r="15"/><circle cx="46" cy="52" r="12"/>' +
          '</g>' +
        '</g>' +
        (o.blanket ?
          '<g class="l-blanket">' +
            '<path d="M62 36 C76 28 96 30 106 40 C109 52 105 62 98 66 C84 70 66 70 56 67 C52 56 55 44 62 36 Z" fill="#D7A6B8"/>' +
            '<path d="M62 36 C76 28 96 30 106 40" fill="none" stroke="#EBC6D3" stroke-width="3" stroke-linecap="round"/>' +
            '<g fill="#F3DCE6" opacity=".8"><circle cx="72" cy="46" r="1.5"/><circle cx="86" cy="42" r="1.5"/><circle cx="98" cy="50" r="1.5"/><circle cx="78" cy="58" r="1.5"/><circle cx="92" cy="60" r="1.5"/><circle cx="64" cy="57" r="1.5"/></g>' +
          '</g>' : '') +
        '<g class="l-head">' +
          '<ellipse cx="16" cy="27" rx="10" ry="4.6" transform="rotate(-28 16 27)" fill="' + ear + '"/>' +
          '<ellipse cx="16" cy="27" rx="6" ry="2.2" transform="rotate(-28 16 27)" fill="#E3A9A6" opacity=".7"/>' +
          '<ellipse cx="27" cy="36" rx="15.5" ry="13.5" fill="' + face + '"/>' +
          '<g fill="' + wool + '"><circle cx="25" cy="23" r="6.5"/><circle cx="33" cy="22" r="5.5"/></g>' +
          '<circle cx="29" cy="43" r="3.4" fill="#F2A7A0" opacity=".55"/>' +
          '<path class="l-mouth" d="M13.5 43 q2.4 1.8 4.8 0" fill="none" stroke="#3E2F3E" stroke-width="1.6" stroke-linecap="round"/>' +
          '<ellipse class="l-yawn" cx="15.5" cy="44.5" rx="2.8" ry="3.4" fill="#3E2F3E"/>' +
          '<g class="l-eye-open"><circle cx="21" cy="34" r="2.6" fill="#2E2433"/><circle cx="21.9" cy="33.1" r=".9" fill="#FFF7EC"/></g>' +
          '<path class="l-eye-closed" d="M17 34.5 q4.5 4 9 0" fill="none" stroke="#F4E6D6" stroke-width="2.2" stroke-linecap="round"/>' +
        '</g>' +
      '</g>' +
    '</g></g>';
  }

  /* ---------- Small helpers ---------- */
  function hill(fill) { return '<use href="#hill" fill="' + fill + '"/>'; }
  function use(id, x, y, w, h, extra) {
    return '<use href="#' + id + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"' + (extra || "") + '/>';
  }
  // A counted item: appears in turn (see script.js). "from" is where it travels in from.
  function item(from, inner, dur) {
    return '<g class="c" style="--from:' + from + (dur ? ";--dur:" + dur : "") + '">' + inner + '</g>';
  }
  function amb(cls, inner, style) {
    return '<g class="amb ' + cls + '"' + (style ? ' style="' + style + '"' : "") + '>' + inner + '</g>';
  }
  function flower(x, y, colour, delay) {
    return amb("a-sway",
      '<path d="M' + x + ' ' + y + ' q-2 -8 0 -15" fill="none" stroke="#A3706C" stroke-width="2" stroke-linecap="round"/>' +
      '<g transform="translate(' + x + ' ' + (y - 17) + ')"><circle r="4.4" fill="' + colour + '"/><circle r="1.7" fill="#FFE6B0"/></g>',
      "animation-delay:" + delay + "s");
  }
  function sleepyCloud(x, y, w) {
    var k = w / 100, cx = x + 49 * k, cy = y + 32 * k;
    return use("cloud", x, y, w, 52 * k) +
      '<g transform="translate(' + cx + ' ' + cy + ') scale(' + k + ')">' +
        '<path d="M-14 -2 q4 3.4 8 0 M6 -2 q4 3.4 8 0" fill="none" stroke="#9A7C86" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="M-4 6 q4 3.4 8 0" fill="none" stroke="#9A7C86" stroke-width="2" stroke-linecap="round"/>' +
        '<circle cx="-17" cy="5" r="3.4" fill="#F4B3AE" opacity=".6"/><circle cx="17" cy="5" r="3.4" fill="#F4B3AE" opacity=".6"/>' +
      '</g>';
  }
  function firefly(x, y, dur, delay) {
    return amb("a-firefly",
      '<circle cx="' + x + '" cy="' + y + '" r="7" fill="#FFE6A0" opacity=".16"/><circle cx="' + x + '" cy="' + y + '" r="2.1" fill="#FFE6A0"/>',
      "animation-duration:" + dur + "s;animation-delay:" + delay + "s");
  }
  function specks() {
    return '<g fill="#E8E4F5" opacity=".45"><circle cx="52" cy="48" r="1.5"/><circle cx="112" cy="20" r="1.2"/><circle cx="176" cy="34" r="1.4"/>' +
      '<circle cx="230" cy="70" r="1.1"/><circle cx="20" cy="120" r="1.2"/><circle cx="388" cy="140" r="1.2"/><circle cx="150" cy="80" r="1"/></g>';
  }
  function glow(id, cx, cy, rx, ry, strength) {
    return '<defs><radialGradient id="' + id + '" cx="50%" cy="50%" r="50%">' +
      '<stop offset="0" stop-color="#FFF1D6" stop-opacity="' + strength + '"/>' +
      '<stop offset=".45" stop-color="#FFF1D6" stop-opacity="' + (strength * 0.38).toFixed(2) + '"/>' +
      '<stop offset="1" stop-color="#FFF1D6" stop-opacity="0"/></radialGradient></defs>' +
      '<ellipse class="glow-light" cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="url(#' + id + ')"/>';
  }

  /* ---------- The scenes ---------- */
  var scenes = {};

  // Cover: the lamb stands on the hill at sunset, awake, looking about.
  scenes.cover =
    '<circle cx="300" cy="206" r="60" fill="#FFE2B8" opacity=".25"/><circle cx="300" cy="206" r="40" fill="#FFE2B8" opacity=".85"/>' +
    amb("a-drift", use("cloud", 26, 40, 96, 50, ' opacity=".7"')) +
    amb("a-drift a-drift-back", use("cloud", 250, 22, 64, 34, ' opacity=".55"')) +
    hill("#D9A08F") +
    flower(64, 216, "#F4A9B6", 0) + flower(80, 213, "#FFE6B0", -1.6) +
    flower(332, 214, "#F4A9B6", -0.8) + flower(348, 217, "#FFF3E6", -2.4) +
    lamb({ x: 116, y: 93, s: 1.4, cls: "blink wag look" });

  // 1: the lamb yawns, lies down in its straw bed, closes its eyes; a blanket settles over it.
  scenes["page-1"] =
    hill("#D29590") +
    '<ellipse cx="196" cy="207" rx="96" ry="15" fill="#C9955F"/>' +
    '<path d="M112 204 l14 -5 M138 210 l16 -6 M232 209 l16 -5 M262 203 l14 -4 M178 213 l14 -4" stroke="#AD7D4C" stroke-width="2.2" stroke-linecap="round"/>' +
    lamb({ x: 116, y: 93, s: 1.4, lying: true, asleep: true, blanket: true, cls: "act-bed" }) +
    '<path d="M108 198 l10 -9 M286 200 l-8 -10" stroke="#D9AA72" stroke-width="2.2" stroke-linecap="round"/>';

  // 2: two sleepy clouds drift in from either side; the lamb lifts its head to watch them.
  scenes["page-2"] =
    hill("#CF9290") +
    item("translateX(-170px)", amb("a-float", sleepyCloud(28, 22, 128)), "3.6s") +
    item("translateX(170px)", amb("a-float a-float-late", sleepyCloud(240, 52, 116)), "3.6s") +
    lamb({ x: 116, y: 93, s: 1.4, lying: true, cls: "act-gaze blink-slow" });

  // 3: three stars glide down and settle into place; the lamb looks up at each.
  scenes["page-3"] =
    '<g transform="translate(0 4)"><rect x="336" y="140" width="10" height="70" rx="4" fill="#3F3972"/>' +
    '<circle cx="341" cy="126" r="30" fill="#4A4482"/><circle cx="318" cy="140" r="20" fill="#4A4482"/><circle cx="364" cy="142" r="22" fill="#4A4482"/></g>' +
    hill("#57508C") +
    item("translate(60px, -140px) scale(.4)", amb("a-twinkle", use("star", 66, 50, 38, 38)), "2.6s") +
    item("translate(-50px, -120px) scale(.4)", amb("a-twinkle", use("star", 182, 22, 38, 38), "animation-delay:-1.7s"), "2.6s") +
    item("translate(40px, -150px) scale(.4)", amb("a-twinkle", use("star", 270, 62, 38, 38), "animation-delay:-3.1s"), "2.6s") +
    lamb({ x: 92, y: 93, s: 1.4, lying: true, cls: "act-stargaze blink-slow" });

  // 4: Mum leans down and nuzzles her lamb four times; a heart floats up with each kiss.
  (function () {
    var hearts = [[146, 92], [184, 62], [226, 80], [262, 48]];
    var out = hill("#4A4780") +
      lamb({ x: 150, y: 73, s: 1.65, mum: true, asleep: true, cls: "act-nuzzle" }) +
      lamb({ x: 40, y: 105, s: 1.25, lying: true, asleep: true, flip: true, cls: "breathe-slow" });
    hearts.forEach(function (h) {
      var dx = 176 - (h[0] + 15), dy = 150 - (h[1] + 15);
      out += item("translate(" + dx + "px, " + dy + "px) scale(.3)", amb("a-bob", use("heart", h[0], h[1], 30, 30)), "2.2s");
    });
    scenes["page-4"] = out;
  })();

  // 5: a close-up of the lamb breathing slowly; each breath drifts up as a soft puff.
  (function () {
    var puffs = [[84, 128, 6], [68, 100, 8], [62, 68, 10], [76, 38, 12], [104, 14, 14]];
    var out = specks() + hill("#2C3566") +
      lamb({ x: 77, y: 41, s: 2.05, lying: true, asleep: true, cls: "breathe-deep" });
    puffs.forEach(function (p, n) {
      var dx = 106 - p[0], dy = 150 - p[1];
      out += item("translate(" + dx + "px, " + dy + "px) scale(.2)",
        '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + p[2] + '" fill="#FFF7EC" opacity="' + (0.55 - n * 0.05).toFixed(2) + '"/>', "3s");
    });
    scenes["page-5"] = out;
  })();

  // 6: dream bubbles float up from the sleeping lamb and line up in a row, each with a tiny moving picture.
  (function () {
    var xs = [46, 108, 169, 231, 292, 354], cy = 62;
    var pics = [
      // a tiny lamb hopping over a fence
      function (x) {
        return '<path d="M' + (x - 7) + ' 77 v-11 M' + (x + 7) + ' 77 v-11 M' + (x - 10) + ' 70 h20" stroke="#D8C7AE" stroke-width="2" stroke-linecap="round"/>' +
          amb("a-hop", lamb({ x: x - 12, y: 52, s: 0.2 }));
      },
      function (x) { return amb("a-pulse", use("heart", x - 13, cy - 13, 26, 26)); },
      function (x) { return amb("a-spin", use("star", x - 13, cy - 13, 26, 26)); },
      function (x) { return lamb({ x: x - 16, y: cy - 10, s: 0.27, mum: true, lying: true, asleep: true }); },
      function (x) { return amb("a-sway", use("flower", x - 12, cy - 12, 24, 24)); },
      function (x) { return amb("a-rock", use("crescent", x - 13, cy - 13, 26, 26)); }
    ];
    var out = specks() + hill("#242D5C") +
      lamb({ x: 116, y: 93, s: 1.4, lying: true, asleep: true, cls: "breathe-slow" }) +
      '<g fill="#FFF7EC" opacity=".4"><circle cx="160" cy="120" r="3"/><circle cx="168" cy="102" r="4.5"/></g>';
    xs.forEach(function (x, n) {
      out += item("translate(" + (165 - x) + "px, 60px) scale(.15)",
        '<circle cx="' + x + '" cy="' + cy + '" r="25" class="bubble"/>' + pics[n](x), "2.4s");
    });
    scenes["page-6"] = out;
  })();

  // 7: deep night. The moon rises, fireflies drift, an owl blinks; Mum and lamb sleep curled together.
  scenes["page-7"] =
    specks() +
    item("translateY(130px)", use("moon", 262, 8, 100, 100), "5s") +
    hill("#121738") +
    '<path d="M34 216 C38 180 42 150 52 116 L58 116 C54 150 52 180 50 216 Z" fill="#0C1030"/>' +
    '<path d="M52 128 C70 124 92 122 116 126" fill="none" stroke="#0C1030" stroke-width="6" stroke-linecap="round"/>' +
    '<circle cx="36" cy="96" r="38" fill="#0E1334"/><circle cx="70" cy="86" r="28" fill="#0E1334"/><circle cx="12" cy="120" r="24" fill="#0E1334"/>' +
    // the owl
    '<g class="owl" transform="translate(98 112)">' +
      '<path d="M-10 -12 l3 -7 l4 6 M10 -12 l-3 -7 l-4 6" fill="#5B4E6E"/>' +
      '<ellipse cx="0" cy="0" rx="12" ry="15" fill="#5B4E6E"/><ellipse cx="0" cy="5" rx="7.5" ry="9" fill="#7A6C8A"/>' +
      '<circle cx="-5" cy="-6" r="4.6" fill="#F6E4C0"/><circle cx="5" cy="-6" r="4.6" fill="#F6E4C0"/>' +
      '<circle cx="-5" cy="-6" r="1.8" fill="#2E2433"/><circle cx="5" cy="-6" r="1.8" fill="#2E2433"/>' +
      '<g class="owl-lids" fill="#5B4E6E"><circle cx="-5" cy="-6" r="4.9"/><circle cx="5" cy="-6" r="4.9"/></g>' +
      '<path d="M-1.6 -2 l1.6 2.4 l1.6 -2.4 Z" fill="#E8B57A"/>' +
    '</g>' +
    lamb({ x: 196, y: 105, s: 1.25, mum: true, lying: true, asleep: true, flip: true, cls: "breathe-slow" }) +
    lamb({ x: 148, y: 136, s: 0.9, lying: true, asleep: true, cls: "breathe-slow" }) +
    firefly(150, 160, 9, 0) + firefly(214, 128, 11, -3) + firefly(330, 176, 10, -6) +
    firefly(262, 196, 12, -2) + firefly(118, 190, 9.5, -5) + firefly(372, 118, 11.5, -8);

  // 8: close-up. The lamb snuggles into Mum, both fast asleep; little z's float up, and the night hushes.
  scenes["page-8"] =
    specks() + use("moon", 26, 6, 72, 72) +
    hill("#0B0F2A") +
    lamb({ x: 140, y: 58, s: 1.9, mum: true, lying: true, asleep: true, flip: true, cls: "breathe-slow" }) +
    lamb({ x: 60, y: 110, s: 1.3, lying: true, asleep: true, cls: "breathe-slow" }) +
    '<g class="zzz" fill="#E8E4F5" font-family="Nunito Lamb, ui-rounded, system-ui, sans-serif" font-weight="800">' +
      amb("a-z", '<text x="96" y="130" font-size="14">z</text>') +
      amb("a-z", '<text x="104" y="118" font-size="17">z</text>', "animation-delay:2s") +
      amb("a-z", '<text x="114" y="104" font-size="20">z</text>', "animation-delay:4s") +
    '</g>';

  // End: one soft light returns on the lamb.
  scenes.end =
    hill("#0A0D24") +
    '<g class="c" style="--from:none;--dur:3s">' + glow("glow-end", 200, 168, 160, 120, 0.42) + '</g>' +
    '<g class="end-lamb">' + lamb({ x: 116, y: 93, s: 1.4, lying: true, asleep: true, cls: "breathe-slow" }) + '</g>';

  // Dedication: the lamb asleep under a few stars.
  scenes.dedication =
    '<g fill="#E8E4F5" opacity=".5"><circle cx="70" cy="40" r="1.5"/><circle cx="130" cy="20" r="1.2"/><circle cx="300" cy="30" r="1.5"/><circle cx="350" cy="80" r="1.2"/></g>' +
    glow("glow-ded", 200, 100, 120, 64, 0.3) +
    lamb({ x: 146, y: 62, s: 0.9, lying: true, asleep: true, cls: "breathe-slow" });

  Array.prototype.forEach.call(document.querySelectorAll("svg[data-scene]"), function (svg) {
    var html = scenes[svg.getAttribute("data-scene")];
    if (html) svg.innerHTML = html;
  });
})();
