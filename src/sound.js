// midi sound script from https://pub.colonq.computer/~bezelea/bells/demo.html
//
//
// Props to prod for updating this
let timeouts = [];
let oscs = new Array();
let notes = new Array();
let gain = 0.01;
const audio_ctx = new(window.AudioContext || window.webkitAudioContext)();

function make_oscillator() {
  let oscillator = audio_ctx.createOscillator();
  let gain_node = audio_ctx.createGain();

  gain_node.gain.value = gain;
  oscillator.type = "square";
  oscillator.connect(gain_node);
  gain_node.connect(audio_ctx.destination);
  return oscillator;
}

function note_to_half_step(note) {
  const chromatic = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  return chromatic.indexOf(note.symbol.toUpperCase()) - 9 + 12 * (note.octave - 4);
}

function note_to_frequency(note) {
  const step = note_to_half_step(note);
  return 440 * Math.pow(2, step / 12);
}

function parse_notes(notes_string, dur=0) {
  const notes_regex = /(?:\[(.+?)(~{0,})\])|(\/|([a-zA-Z]#?)(-?[0-9]?)(~{0,}))/g;
  return [...notes_string.matchAll(notes_regex)].map(match => {
    if (match[0].indexOf("[") === 0)
    return parse_notes(match[1], match[2].length);
    else if (match[0] === "/")
    return null;
    return {
      octave: match[4].toLowerCase() === match[4] && match[5] === "" ? 5 : parseInt(match[5]) || 4,
      symbol: match[4].toUpperCase(),
      length: match[6].length + dur + 1
    };
  });
}

export function play(inp) {
  stop();
  // const inp = "C#"
  const bpm = /^\d+/.exec(inp)?.[0] ?? 75;
  const play_note = notes => {
    const note_ms = 15000 / bpm;
    if (notes.length === 0)
    return;
    let noteobj = notes.shift();
    let dur = 1;
    if (noteobj) {
      if (noteobj.hasOwnProperty("length")) dur = noteobj.length;
      else if (noteobj[0]?.hasOwnProperty("length")) dur = noteobj[0].length;
    }
    let q = setTimeout(() => { timeouts.splice(timeouts.indexOf(q), 1); play_note(notes); }, dur * note_ms);
    timeouts.push(q);
    if (!noteobj) return;
    (noteobj.hasOwnProperty("symbol") ? [noteobj] : noteobj).forEach(note => {
      if (!note) return;
      let osc = make_oscillator();
      osc.frequency.value = note_to_frequency(note);
      osc.start();
      oscs.push(osc);
      setTimeout(() => {
        oscs.splice(oscs.indexOf(osc), 1);
        osc.stop();
      }, note.length * note_ms);
    });
  };
  inp.split("|")
    .map(x => parse_notes(x))
    .forEach(x => play_note(x));
}

export function stop() {
  for (let oscillator of oscs) oscillator.stop();
  for (let timeout of timeouts) clearTimeout(timeout);
  oscs = new Array();
  timeouts = new Array();
}

export function input_onKeyPress(event) {
  if (event.key === "Enter") {
    play();
  }
}
export function range_onChange(muted) {
  if (!muted) {
    gain = 0;
  } else {
    gain = 0.02 * 50 / 100;
  }
}
