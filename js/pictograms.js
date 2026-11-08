/*
 * Hello Dubai — airport sign pictograms (SVG), in the style of real airport signs.
 * Each entry is the inner markup of a 24×24 SVG. Classes:
 *   (default) filled with the sign colour, .st = stroked line, .bg = filled with the tile colour.
 * Plane, taxi, toilet and magnifier shapes are based on Google's Material Icons (Apache License 2.0).
 */
window.HD_PICTOGRAMS = {
  arrivals:
    '<path d="M2.5 19h19v2h-19zm7.18-5.73l4.35 1.16 5.31 1.42c.8.21 1.62-.26 1.84-1.06.21-.8-.26-1.62-1.06-1.84l-5.31-1.42-2.76-9.02L10.12 2v8.28L5.15 8.95l-.93-2.32-1.45-.39v5.17l1.6.43 5.31 1.43z"/>',
  departures:
    '<path d="M2.5 19h19v2h-19zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 1.82 3.16.77 1.33 1.6-.43 5.31-1.42 4.35-1.16L21 11.49c.81-.23 1.28-1.05 1.07-1.85z"/>',
  connections:
    '<path class="st" d="M19.5 9A8 8 0 1 0 20 14"/><path d="M21.5 4.5v6h-6z"/>' +
    '<g transform="translate(6.6 6.6) scale(.45)"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></g>',
  passport:
    '<circle cx="12" cy="6" r="3"/><path d="M6.5 14.5v-.5a5.5 5.5 0 0 1 11 0v.5z"/><rect x="2.5" y="14.5" width="19" height="6.5" rx="1"/>' +
    '<rect class="bg" x="14" y="16.3" width="4.5" height="3" rx=".5"/>',
  nationals:
    '<rect x="5" y="2" width="14" height="20" rx="2"/><circle class="bg" cx="12" cy="10" r="3.6"/><circle cx="12" cy="10" r="1.6"/><rect class="bg" x="8" y="16.5" width="8" height="1.6" rx=".8"/>',
  allpass:
    '<circle class="st" cx="12" cy="12" r="9.2" style="stroke-width:1.8"/><ellipse class="st" cx="12" cy="12" rx="3.8" ry="9.2" style="stroke-width:1.6"/><path class="st" d="M3 12h18" style="stroke-width:1.6"/>',
  baggage:
    '<rect x="6" y="3.5" width="12" height="10.5" rx="1.6"/><path class="st" d="M9.5 3.5V2.5h5v1"/><rect class="bg" x="9" y="6" width="1.4" height="6" rx=".7"/><rect class="bg" x="13.6" y="6" width="1.4" height="6" rx=".7"/>' +
    '<rect x="1.5" y="16.5" width="21" height="3.5" rx="1.75"/><circle class="bg" cx="5" cy="18.25" r=".9"/><circle class="bg" cx="12" cy="18.25" r=".9"/><circle class="bg" cx="19" cy="18.25" r=".9"/>',
  oversize:
    '<path d="M3.5 8.5a7.5 7.5 0 0 1 7.5-7.5v7.5z"/><path d="M3.5 9.5h13v1.2a6 6 0 0 1-6 6H9.5a6 6 0 0 1-6-6z"/><path class="st" d="M16.5 9.5l4-4.5"/>' +
    '<circle cx="6.5" cy="20" r="2"/><circle cx="14.5" cy="20" r="2"/><path class="st" d="M8 17l-1 1.6M13 17l1 1.6"/>',
  customs:
    '<rect x="1.5" y="8" width="13" height="11" rx="1.6"/><path class="st" d="M5.5 8V6.5h5V8"/>' +
    '<circle class="bg" cx="16" cy="12.5" r="5.2"/><circle class="st" cx="16" cy="12.5" r="3.8"/><path class="st" d="M18.8 15.3l3.2 3.2" style="stroke-width:2.6"/>',
  nothing:
    '<path class="st" d="M4 12.5l5 5L20 6.5" style="stroke-width:3.4"/>',
  declare:
    '<rect x="10.3" y="3" width="3.4" height="12.5" rx="1.7"/><circle cx="12" cy="19.5" r="2"/>',
  exit:
    '<path class="st" d="M13 4.5V3H4v18h9v-1.5"/><circle cx="10.3" cy="12" r="1"/><path class="st" d="M11 12h10M17.5 8.5L21 12l-3.5 3.5" style="stroke-width:2.4"/>',
  taxi:
    '<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9v2H6.5c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>',
  metro:
    '<rect x="5" y="2" width="14" height="15" rx="4"/><rect class="bg" x="7.5" y="4.8" width="9" height="5" rx="1"/><circle class="bg" cx="8.6" cy="13.4" r="1.3"/><circle class="bg" cx="15.4" cy="13.4" r="1.3"/>' +
    '<path class="st" d="M8.5 17.5L6 22M15.5 17.5L18 22M7.2 20h9.6"/>',
  meeting:
    '<circle cx="7" cy="5.5" r="2.6"/><circle cx="17" cy="5.5" r="2.6"/><path d="M3 21v-7a4 4 0 0 1 8 0v7zM13 21v-7a4 4 0 0 1 8 0v7z"/>',
  toilets:
    '<path d="M5.5 22v-7.5H4V9c0-1.1.9-2 2-2h3c1.1 0 2 .9 2 2v5.5H9.5V22h-4zM18 22v-6h3l-2.54-7.63C18.18 7.55 17.42 7 16.56 7h-.12c-.86 0-1.63.55-1.9 1.37L12 16h3v6h3zM7.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm9 0c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2z"/>',
  baby:
    '<rect x="10" y="1.5" width="4" height="2.5" rx="1"/><rect x="8.5" y="4" width="7" height="2" rx=".6"/><path d="M8.5 6.5h7l1 2.5v11a2.5 2.5 0 0 1-2.5 2.5h-4A2.5 2.5 0 0 1 7.5 20V9z"/>' +
    '<rect class="bg" x="9.5" y="11" width="3" height="1.2" rx=".6"/><rect class="bg" x="9.5" y="14" width="3" height="1.2" rx=".6"/><rect class="bg" x="9.5" y="17" width="3" height="1.2" rx=".6"/>',
  info:
    '<circle cx="12" cy="12" r="10"/><circle class="bg" cx="12" cy="7.3" r="1.5"/><rect class="bg" x="10.7" y="10" width="2.6" height="8" rx="1.1"/>',
  prayer:
    '<path d="M6 13a6 6 0 0 1 12 0z"/><path class="st" d="M12 7V3.5" style="stroke-width:1.4"/><circle cx="12" cy="3" r="1"/><rect x="5" y="13" width="14" height="8.5"/>' +
    '<path class="bg" d="M10.4 21.5v-3.2a1.6 1.6 0 0 1 3.2 0v3.2z"/><rect x="20" y="8" width="2.2" height="13.5"/><path d="M19.6 8.2l1.5-3.2 1.5 3.2z"/>',
  exchange:
    '<path class="st" d="M4 8h14M14.5 4.5L18 8l-3.5 3.5M20 16H6M9.5 12.5L6 16l3.5 3.5" style="stroke-width:2.4"/>',
  trolleys:
    '<path class="st" d="M2.5 4h3l3.2 12.5H20" style="stroke-width:2.2"/><rect x="9.5" y="5.5" width="9" height="8" rx="1.2"/><circle cx="10" cy="20" r="1.9"/><circle cx="18" cy="20" r="1.9"/>',
  lost:
    '<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path class="st" d="M8 8.2a1.6 1.6 0 1 1 2 1.6c-.5.2-.5.6-.5 1.1" style="stroke-width:1.5"/><circle cx="9.5" cy="12.6" r=".8"/>',
  nophotos:
    '<path d="M8 7l1.6-2.6h4.8L16 7z"/><rect x="2.5" y="7" width="19" height="13" rx="2.2"/><circle class="bg" cx="12" cy="13.5" r="4.4"/><circle cx="12" cy="13.5" r="2.4"/>',
  waitline:
    '<circle cx="12" cy="3.6" r="2.4"/><path d="M8.6 14V9.5a3.4 3.4 0 0 1 6.8 0V14z"/><rect x="9.2" y="13" width="2.3" height="6" rx="1"/><rect x="12.5" y="13" width="2.3" height="6" rx="1"/>' +
    '<path class="st" d="M2.5 22h3M10.5 22h3M18.5 22h3" style="stroke-width:2.4"/>'
};
