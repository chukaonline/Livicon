/*!
 * Livicon — animated device icons for Home Assistant
 * https://github.com/chukaonline/HA-Custom-Icons   (MIT, original artwork, no dependencies)
 *
 *   custom:livicon-card        one device   (layout: row | tile | icon)
 *   custom:livicon-group-card  titled list with master toggle
 *
 * `style: 3d` switches every icon to the realistic 3D look (default `flat`).
 * The icon is chosen automatically from the entity (device_class, domain, name) or set with `icon:`.
 * Colours come from the active HA theme (--primary-text-color etc.) so it works with any theme;
 * override with `accent:` or the CSS variables --tk-accent / --tk-off / --tk-body.
 */
(() => {
  const VERSION = '2.1.0';

  /* ------------------------------------------------------------------ icons
   * 48x48 grid. Helper classes (see STYLE): ln outline · fl solid · soft faint fill ·
   * acc/acs accent fill/stroke · clf/cls cool · htf/hts hot · fx only-while-on · led status LED.
   * Every animation is applied under `.on`, so "off" is perfectly still.
   * ------------------------------------------------------------------------ */
  const CLOUD = 'M13 30a6.5 6.5 0 0 1 .8-12.9A9 9 0 0 1 31 15a7.5 7.5 0 0 1 3 15Z';
  const DROPLET = 'M24 5C24 5 11 20 11 29a13 13 0 0 0 26 0C37 20 24 5 24 5Z';

  const ICONS = {
    /* ---------------- switches, lights, climate ---------------- */
    fan: `
      <circle class="ln" cx="24" cy="24" r="20"/>
      <circle class="ln" cx="24" cy="24" r="14" style="stroke-opacity:.22;stroke-width:1.2"/>
      <g class="spin" style="transform-origin:24px 24px"><g class="acc">
        <path d="M24 24C18.5 17 19 8.5 24 6.5C29 8.5 29.5 17 24 24Z"/>
        <path transform="rotate(120 24 24)" d="M24 24C18.5 17 19 8.5 24 6.5C29 8.5 29.5 17 24 24Z"/>
        <path transform="rotate(240 24 24)" d="M24 24C18.5 17 19 8.5 24 6.5C29 8.5 29.5 17 24 24Z"/>
      </g></g>
      <circle class="fl" cx="24" cy="24" r="3.4"/>`,

    bulb: `
      <g style="opacity:var(--bri,1)"><circle class="fx glow" cx="24" cy="19" r="15" style="fill:var(--glow,var(--c-on));filter:blur(6px);transform-origin:24px 19px"/></g>
      <path class="glass" d="M24 5.5A12.5 12.5 0 0 0 16.2 27.8V32H31.8V27.8A12.5 12.5 0 0 0 24 5.5Z"/>
      <path class="fil" d="M19.5 20l4.5 5 4.5-5M24 25v7"/>
      <rect class="fl" x="17" y="34" width="14" height="3" rx="1.5"/>
      <rect class="fl" x="18.5" y="38.5" width="11" height="3" rx="1.5"/>
      <path class="fl" d="M21 42.5h6a3 3 0 0 1-6 0Z"/>`,

    floodlight: `
      <g class="fx"><path class="beam" d="M17 20H31L42 44H6Z" style="fill:var(--c-on);opacity:.32;filter:blur(2px)"/></g>
      <rect class="ln" x="14" y="7" width="20" height="10" rx="3"/>
      <rect class="acc" x="17" y="17" width="14" height="2.6" rx="1.3"/>
      <path class="ln" d="M24 7V2.5M17 3h14"/>
      <g class="fx"><path class="acs flick" d="M8 22l3 3M40 22l-3 3M24 27v4" style="stroke-width:1.8"/></g>`,

    socket: `
      <rect class="ln" x="7" y="7" width="34" height="34" rx="9"/>
      <rect class="soft" x="11.5" y="11.5" width="25" height="25" rx="6"/>
      <rect class="acc" x="21.7" y="15" width="4.6" height="7.5" rx="1.2"/>
      <rect class="acc" x="14.5" y="26" width="4.6" height="7.5" rx="1.2"/>
      <rect class="acc" x="28.9" y="26" width="4.6" height="7.5" rx="1.2"/>
      <path class="fx acs flick" d="M19.6 30l2-2.5 2.5 5 2.5-5 2 2.5"/>
      <circle class="led" cx="35" cy="14" r="2"/>
      <circle class="fx okring ping" cx="35" cy="14" r="3.5" style="transform-origin:35px 14px"/>`,

    switch: `
      <rect class="ln" x="11" y="5" width="26" height="38" rx="7"/>
      <rect class="soft" x="17" y="11" width="14" height="26" rx="7"/>
      <circle class="knob" cx="24" cy="30" r="5.5"/>`,

    heater: `
      <rect class="fl" x="5" y="15.5" width="38" height="3" rx="1.5"/>
      <rect class="htf" x="7" y="18" width="4.5" height="19" rx="2.2"/>
      <rect class="htf" x="14.5" y="18" width="4.5" height="19" rx="2.2"/>
      <rect class="htf" x="22" y="18" width="4.5" height="19" rx="2.2"/>
      <rect class="htf" x="29.5" y="18" width="4.5" height="19" rx="2.2"/>
      <rect class="htf" x="37" y="18" width="4.5" height="19" rx="2.2"/>
      <rect class="fl" x="5" y="36.5" width="38" height="3" rx="1.5"/>
      <path class="ln" d="M10 40v3.5M38 40v3.5"/>
      <g class="fx">
        <g class="rise" style="animation-delay:0s"><path class="hts" d="M14 13c-2.2-2 2.2-4 0-6.2"/></g>
        <g class="rise" style="animation-delay:.55s"><path class="hts" d="M24 13c-2.2-2 2.2-4 0-6.2"/></g>
        <g class="rise" style="animation-delay:1.1s"><path class="hts" d="M34 13c-2.2-2 2.2-4 0-6.2"/></g>
      </g>`,

    ac: `
      <rect class="ln" x="4" y="7" width="40" height="17" rx="5.5"/>
      <path class="ln" d="M10 12.5h12" style="stroke-opacity:.45"/>
      <circle class="led" cx="38" cy="12.5" r="1.6"/>
      <g class="flap" style="transform-origin:9px 20.5px"><rect class="fl" x="9" y="19" width="30" height="3" rx="1.5"/></g>
      <g class="fx">
        <g class="fall" style="animation-delay:0s"><path class="cls" d="M14 27c-2.2 2 2.2 4 0 6.2"/></g>
        <g class="fall" style="animation-delay:.6s"><path class="cls" d="M24 27c-2.2 2 2.2 4 0 6.2"/></g>
        <g class="fall" style="animation-delay:1.2s"><path class="cls" d="M34 27c-2.2 2 2.2 4 0 6.2"/></g>
        <circle class="clf tw1" cx="19" cy="40" r="1.3"/><circle class="clf tw2" cx="30" cy="42" r="1.3"/><circle class="clf tw3" cx="39" cy="38" r="1.1"/>
      </g>`,

    thermostat: `
      <circle class="ln soft" cx="24" cy="24" r="19"/>
      <path class="ln" d="M24 8.5v3M39.5 24h-3M11.5 24h-3M12.5 12.5l2.1 2.1M35.5 12.5l-2.1 2.1" style="stroke-opacity:.5;stroke-width:1.6"/>
      <path class="acs arcp" d="M14 32A13 13 0 0 1 34 32" style="stroke-width:3"/>
      <circle class="acc" cx="24" cy="24" r="4.5"/>
      <circle class="fx okring ping" cx="24" cy="24" r="8" style="transform-origin:24px 24px;stroke:var(--c-on)"/>`,

    purifier: `
      <rect class="ln soft" x="13" y="14" width="22" height="30" rx="5"/>
      <path class="ln" d="M17 24h14M17 29h14M17 34h14M17 39h14" style="stroke-opacity:.5"/>
      <path class="ln" d="M17 14h14"/>
      <circle class="led" cx="31" cy="19" r="1.5"/>
      <g class="fx">
        <g class="rise" style="animation-delay:0s"><path class="cls" d="M18 11q3-3 0-6"/></g>
        <g class="rise" style="animation-delay:.6s"><path class="cls" d="M24 11q3-3 0-6"/></g>
        <g class="rise" style="animation-delay:1.2s"><path class="cls" d="M30 11q3-3 0-6"/></g>
      </g>`,

    geyser: `
      <rect class="ln soft" x="11" y="6" width="26" height="34" rx="7"/>
      <path class="ln" d="M18 6V2.5M30 6V2.5M18 40v4M30 40v4"/>
      <rect class="htf" x="12.5" y="22" width="23" height="16.5" rx="5.5" style="fill-opacity:.32"/>
      <path class="hts coil" d="M16 31l3-3 3 3 3-3 3 3 3-3 2 2" style="stroke-width:1.8"/>
      <circle class="ln" cx="24" cy="14" r="4.2"/><path class="acs" d="M24 14l2.4-2" style="stroke-width:1.6"/>
      <g class="fx"><g class="rise" style="animation-delay:.2s"><path class="hts" d="M7 26c-2-2 2-3.5 0-5.6"/></g><g class="rise" style="animation-delay:.9s"><path class="hts" d="M41 26c-2-2 2-3.5 0-5.6"/></g></g>`,

    /* ---------------- kitchen & laundry ---------------- */
    fridge: `
      <rect class="ln" x="11" y="4" width="26" height="40" rx="4.5"/>
      <path class="ln" d="M11 18H37"/>
      <path class="ln" d="M16 10.5v3.5M16 22v7" style="stroke-width:2.6"/>
      <rect class="fx clf" x="12.4" y="19.4" width="23.2" height="23.2" rx="3.2" style="fill-opacity:.12"/>
      <g class="snow" style="transform-origin:28px 31px"><path class="cls" d="M28 26.5v9M24.1 28.75l7.8 4.5M24.1 33.25l7.8-4.5"/></g>
      <circle class="led" cx="32.5" cy="11" r="1.6"/>`,

    freezer: `
      <rect class="ln" x="5" y="14" width="38" height="27" rx="4.5"/>
      <path class="ln" d="M5 22H43"/>
      <path class="ln" d="M20 18h8" style="stroke-width:2.6"/>
      <path class="ln" d="M10 41v3M38 41v3"/>
      <rect class="fx clf" x="6.4" y="23.4" width="35.2" height="16.2" rx="3" style="fill-opacity:.12"/>
      <g class="snow" style="transform-origin:24px 31.5px"><path class="cls" d="M24 26v11M18.7 28.7l10.6 5.6M18.7 34.3l10.6-5.6"/></g>
      <circle class="fx clf tw1" cx="11" cy="27" r="1.1"/><circle class="fx clf tw2" cx="37.5" cy="36" r="1.1"/>`,

    washer: `
      <clipPath id="tk-wm"><circle cx="24" cy="28" r="9.4"/></clipPath>
      <rect class="ln" x="7" y="5" width="34" height="38" rx="5"/>
      <path class="ln" d="M7 14H41"/>
      <circle class="fl" cx="13" cy="9.5" r="1.7"/>
      <rect class="acc" x="26" y="8" width="9" height="3" rx="1.5"/>
      <circle class="ln" cx="24" cy="28" r="11.5"/>
      <g clip-path="url(#tk-wm)">
        <rect class="soft" x="14" y="18" width="20" height="20"/>
        <g class="drum" style="transform-origin:24px 28px">
          <circle class="acc" cx="20" cy="24" r="3"/><circle class="acc" cx="29" cy="26" r="2.6"/><circle class="acc" cx="24" cy="33.5" r="3"/>
        </g>
        <g class="fx"><g class="wave"><path class="clf" style="fill-opacity:.5" d="M8 29q3-3 6 0t6 0t6 0t6 0t6 0t6 0t6 0V40H8Z"/></g></g>
      </g>`,

    dryer: `
      <clipPath id="tk-dr"><circle cx="24" cy="28" r="9.4"/></clipPath>
      <rect class="ln" x="7" y="5" width="34" height="38" rx="5"/>
      <path class="ln" d="M7 14H41"/>
      <circle class="fl" cx="13" cy="9.5" r="1.7"/>
      <rect class="acc" x="26" y="8" width="9" height="3" rx="1.5"/>
      <circle class="ln" cx="24" cy="28" r="11.5"/>
      <g clip-path="url(#tk-dr)">
        <rect class="soft" x="14" y="18" width="20" height="20"/>
        <g class="drum" style="transform-origin:24px 28px">
          <circle class="htf" cx="19.5" cy="25" r="3"/><circle class="htf" cx="29" cy="27" r="2.8"/><circle class="htf" cx="24" cy="33" r="3"/>
        </g>
        <g class="fx">
          <g class="rise" style="animation-delay:0s"><path class="hts" d="M19 28c-1.6-1.6 1.6-2.6 0-4.2" style="stroke-width:1.4"/></g>
          <g class="rise" style="animation-delay:.7s"><path class="hts" d="M29 30c-1.6-1.6 1.6-2.6 0-4.2" style="stroke-width:1.4"/></g>
        </g>
      </g>`,

    dishwasher: `
      <rect class="ln" x="7" y="5" width="34" height="38" rx="4"/>
      <path class="ln" d="M7 14H41"/>
      <circle class="fl" cx="13" cy="9.5" r="1.7"/>
      <rect class="acc" x="26" y="8" width="9" height="3" rx="1.5"/>
      <rect class="ln soft" x="11" y="18" width="26" height="21" rx="2.5"/>
      <path class="ln" d="M16 37v-8M21 37v-8M27 37v-8M32 37v-8" style="stroke-opacity:.45;stroke-width:1.4"/>
      <g class="arm" style="transform-origin:24px 24px"><path class="acs" d="M14 24h20" style="stroke-width:2.4"/></g>
      <g class="fx">
        <circle class="clf fall" cx="18" cy="27" r="1.2" style="animation-delay:0s"/><circle class="clf fall" cx="24" cy="27" r="1.2" style="animation-delay:.4s"/><circle class="clf fall" cx="30" cy="27" r="1.2" style="animation-delay:.8s"/>
      </g>`,

    kettle: `
      <path class="ln soft" d="M13 41V22a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v19a2 2 0 0 1-2 2H15a2 2 0 0 1-2-2Z"/>
      <path class="ln" d="M31 25l7-7M13 24H8v12h5M16 20l2-4h8l2 4"/>
      <rect class="fl" x="11" y="42.5" width="22" height="3" rx="1.5"/>
      <rect class="htf" x="14.4" y="31" width="15.2" height="10" rx="1.5" style="fill-opacity:.4"/>
      <circle class="led" cx="22" cy="26" r="1.7"/>
      <g class="fx">
        <g class="rise" style="animation-delay:0s"><path class="steam" d="M40 14c-2-2 2-3.5 0-5.5"/></g>
        <g class="rise" style="animation-delay:.6s"><path class="steam" d="M36 12c-2-2 2-3.5 0-5.5"/></g>
        <circle class="fl bub" cx="19" cy="38" r="1.1" style="animation-delay:0s"/><circle class="fl bub" cx="25" cy="38" r="1.1" style="animation-delay:.5s"/>
      </g>`,

    blender: `
      <clipPath id="tk-bl"><path d="M14 6h20l-3 26H17Z"/></clipPath>
      <rect class="fl" x="12.5" y="3.5" width="23" height="3.2" rx="1.6"/>
      <path class="jar" d="M14 6h20l-3 26H17Z"/>
      <g clip-path="url(#tk-bl)">
        <rect class="acc" x="12" y="17" width="26" height="16" style="fill-opacity:.55"/>
        <g class="fx"><circle class="fl bub" cx="20" cy="28" r="1.2" style="animation-delay:0s"/><circle class="fl bub" cx="27" cy="29" r="1.4" style="animation-delay:.4s"/><circle class="fl bub" cx="24" cy="27" r="1" style="animation-delay:.8s"/></g>
        <g class="blend" style="transform-origin:24px 30px"><path class="ln" d="M17.5 30h13" style="stroke-width:2.4"/></g>
      </g>
      <rect class="ln" x="13" y="32" width="22" height="11" rx="3.5"/>
      <circle class="acc" cx="24" cy="37.5" r="2"/>
      <g class="fx"><path class="acs flick" d="M8.5 14v7M39.5 14v7" style="stroke-width:1.6"/></g>`,

    sewing: `
      <path class="soft ln" d="M7 13a4.5 4.5 0 0 1 4.5-4.5H36.5A4.5 4.5 0 0 1 41 13V41H31V21H11.5A4.5 4.5 0 0 1 7 16.5Z"/>
      <rect class="fl" x="4" y="41" width="40" height="3.5" rx="1.75"/>
      <circle class="acc" cx="17" cy="14.5" r="2.4"/>
      <path class="acs" d="M17.4 16.8Q14 19 12.1 26" style="stroke-width:1.2"/>
      <g class="needle"><rect class="fl" x="11" y="21" width="2.2" height="8" rx="1"/><path class="acs" d="M12.1 29v5" style="stroke-width:1.6"/></g>
      <path class="ln" d="M9 37.3h6" style="stroke-width:2.2"/>
      <path class="acs dash" d="M5 39.4h24" style="stroke-dasharray:3 3;stroke-width:1.4"/>
      <g class="spin" style="transform-origin:36px 14.5px"><circle class="ln" cx="36" cy="14.5" r="3.6"/><path class="ln" d="M36 11v7" style="stroke-width:1.6"/></g>`,

    pump: `
      <rect class="ln" x="4" y="15" width="17" height="18" rx="4"/>
      <path class="ln" d="M9.5 19.5v9M13.5 19.5v9M17.5 19.5v9" style="stroke-opacity:.35"/>
      <circle class="ln" cx="30" cy="24" r="10.5"/>
      <circle class="fx clf" cx="30" cy="24" r="9" style="fill-opacity:.2"/>
      <g class="spin" style="transform-origin:30px 24px"><g class="acc">
        <rect x="29" y="15.5" width="2" height="8.5" rx="1"/>
        <rect transform="rotate(90 30 24)" x="29" y="15.5" width="2" height="8.5" rx="1"/>
        <rect transform="rotate(180 30 24)" x="29" y="15.5" width="2" height="8.5" rx="1"/>
        <rect transform="rotate(270 30 24)" x="29" y="15.5" width="2" height="8.5" rx="1"/>
      </g></g>
      <circle class="fl" cx="30" cy="24" r="2.2"/>
      <path class="ln" d="M27.5 13.7V9M32.5 13.7V9M40.3 21.5H45.5M40.3 26.5H45.5"/>
      <path class="ln" d="M9 33v4M17 33v4M30 34.5v2.5"/>
      <rect class="fl" x="3" y="37" width="34" height="3.5" rx="1.75"/>
      <g class="fx">
        <circle class="clf drop" cx="42" cy="24" r="1.5" style="animation-delay:0s"/>
        <circle class="clf drop" cx="42" cy="24" r="1.5" style="animation-delay:.4s"/>
        <circle class="clf drop" cx="42" cy="24" r="1.5" style="animation-delay:.8s"/>
      </g>`,

    tv: `
      <clipPath id="tk-tv"><rect x="7.5" y="10.5" width="33" height="20" rx="1.5"/></clipPath>
      <g class="fx"><rect x="3" y="6" width="42" height="29" rx="5" style="fill:var(--c-cool);opacity:.3;filter:blur(7px)"/></g>
      <rect class="ln" x="4" y="7" width="40" height="27" rx="3.5"/>
      <rect class="scr" x="7.5" y="10.5" width="33" height="20" rx="1.5"/>
      <g class="fx" clip-path="url(#tk-tv)" style="filter:blur(3px)">
        <rect x="7" y="10" width="34" height="21" style="fill:#16213e"/>
        <circle class="b1" cx="16" cy="18" r="9" style="fill:#4fc3f7"/>
        <circle class="b2" cx="32" cy="24" r="10" style="fill:#ff7043"/>
        <circle class="b3" cx="26" cy="14" r="7" style="fill:#ab47bc"/>
      </g>
      <path class="ln" d="M24 34v5M16 41h16"/>`,

    speaker: `
      <rect class="ln soft" x="12" y="4" width="24" height="40" rx="5"/>
      <circle class="ln" cx="24" cy="14" r="3.5"/>
      <g class="pulse" style="transform-origin:24px 31px"><circle class="acc" cx="24" cy="31" r="8"/><circle class="fl" cx="24" cy="31" r="3"/></g>
      <g class="fx">
        <path class="acs wv" d="M40 20q3 4 0 8" style="animation-delay:0s"/><path class="acs wv" d="M44 16q5 8 0 16" style="animation-delay:.3s"/>
        <path class="acs wv" d="M8 20q-3 4 0 8" style="animation-delay:0s"/><path class="acs wv" d="M4 16q-5 8 0 16" style="animation-delay:.3s"/>
      </g>`,

    /* ---------------- power & energy ---------------- */
    solar: `
      <clipPath id="tk-pv"><path d="M6 44l5-20H43l-5 20Z"/></clipPath>
      <g class="fx"><g class="spin slow" style="transform-origin:34px 12px"><path class="acs" d="M34 1.5v3M34 19.5v3M23.5 12h3M41.5 12h3M26.6 4.6l2.1 2.1M39.4 17.4l2.1 2.1M41.4 4.6l-2.1 2.1M26.6 19.4l2.1-2.1"/></g></g>
      <circle class="acc" cx="34" cy="12" r="5"/>
      <path class="ln soft" d="M6 44l5-20H43l-5 20Z"/>
      <path class="ln" d="M9.5 34H40.5M20 24l-2.5 20M31 24l2.5 20" style="stroke-opacity:.6;stroke-width:1.3"/>
      <g clip-path="url(#tk-pv)"><g class="fx"><rect class="shim" x="-12" y="22" width="7" height="24" style="fill:#fff;opacity:.4;transform:skewX(-20deg)"/></g></g>`,

    battery: `
      <rect class="ln" x="4" y="14" width="36" height="20" rx="4"/>
      <rect class="fl" x="40.5" y="20" width="3.5" height="8" rx="1.4"/>
      <rect class="lvl" x="7.5" y="17.5" width="29" height="13" rx="2" style="transform-origin:7.5px 24px;transform:scaleX(var(--lvl,1));fill:var(--lvlc,var(--c-ok));transition:transform .6s,fill .4s"/>
      <path class="chgfx" d="M24.5 16L18 25.5h5l-1 7 7-10.5h-5.2Z" style="fill:#fff;stroke:rgba(0,0,0,.4);stroke-width:.8;stroke-linejoin:round"/>`,

    inverter: `
      <clipPath id="tk-inv"><rect x="9" y="13" width="30" height="14" rx="2.5"/></clipPath>
      <rect class="ln" x="5" y="9" width="38" height="30" rx="5"/>
      <rect class="soft" x="9" y="13" width="30" height="14" rx="2.5"/>
      <g clip-path="url(#tk-inv)"><g class="wave"><path class="acs" d="M-3 20q3-7 6 0t6 0t6 0t6 0t6 0t6 0t6 0t6 0t6 0t6 0" style="stroke-width:1.8"/></g></g>
      <circle class="led" cx="14" cy="33" r="1.7"/>
      <circle class="acc" cx="20" cy="33" r="1.7"/>
      <rect class="ln" x="27.5" y="30.8" width="10.5" height="4.4" rx="1.2" style="stroke-width:1.4"/>
      <rect class="acc bar" x="29" y="32.3" width="7.5" height="1.4" rx=".5"/>`,

    fence: `
      <rect class="ln" x="8" y="8" width="32" height="32" rx="5"/>
      <path class="bolt acc" d="M26.5 12.5L16 26.5h7l-2 9.5 11-14.5h-7.2Z"/>
      <circle class="led" cx="13" cy="13" r="1.6"/>
      <circle class="fx acs ping" cx="24" cy="24" r="12" style="transform-origin:24px 24px"/>
      <path class="acs" d="M3 44h42" style="stroke-dasharray:2 3;stroke-width:1.4;stroke-opacity:.7"/>`,

    ev: `
      <path class="ln soft" d="M4 34v-6a3 3 0 0 1 2.4-2.9L11 24l4.4-6.6A4 4 0 0 1 18.7 16H30a4 4 0 0 1 3.1 1.5L38 24l3.6.8A3 3 0 0 1 44 27.7V34Z"/>
      <path class="ln" d="M16 24h20" style="stroke-opacity:.4"/>
      <circle class="fl" cx="14" cy="35" r="4.4"/><circle class="fl" cx="34" cy="35" r="4.4"/>
      <circle class="soft" cx="14" cy="35" r="1.6" style="fill:#000;fill-opacity:.4"/><circle class="soft" cx="34" cy="35" r="1.6" style="fill:#000;fill-opacity:.4"/>
      <path class="bolt acc" d="M25 4l-5 8h4l-1 6 6-9h-4.2Z"/>
      <circle class="fx acs ping" cx="24" cy="11" r="7" style="transform-origin:24px 11px"/>`,

    /* ---------------- sensors & security ---------------- */
    door: `
      <rect class="ln" x="9" y="4" width="30" height="40" rx="2"/>
      <rect class="gap" x="11" y="6" width="26" height="36"/>
      <g class="leaf" style="transform-origin:11px 24px"><rect class="ln soft" x="11" y="6" width="26" height="36" rx="1"/><circle class="acc" cx="33" cy="25" r="1.9"/></g>`,

    window: `
      <rect class="ln" x="7" y="7" width="34" height="34" rx="2.5"/>
      <rect class="gapc" x="9" y="9" width="30" height="30"/>
      <rect class="ln soft" x="9" y="9" width="14.5" height="30"/>
      <g class="leafr" style="transform-origin:39px 24px"><rect class="ln soft" x="24.5" y="9" width="14.5" height="30"/><path class="acs" d="M27 24v4" style="stroke-width:2"/></g>`,

    garage: `
      <clipPath id="tk-gar"><rect x="10" y="17" width="28" height="26"/></clipPath>
      <path class="ln" d="M5 43V16L24 6l19 10v27"/>
      <rect class="soft" x="10" y="17" width="28" height="26"/>
      <g clip-path="url(#tk-gar)"><g class="gdoor">
        <rect class="ln soft" x="10" y="17" width="28" height="6.5" style="stroke-width:1.6"/><rect class="ln soft" x="10" y="23.5" width="28" height="6.5" style="stroke-width:1.6"/>
        <rect class="ln soft" x="10" y="30" width="28" height="6.5" style="stroke-width:1.6"/><rect class="ln soft" x="10" y="36.5" width="28" height="6.5" style="stroke-width:1.6"/>
      </g></g>`,

    blind: `
      <rect class="ln" x="7" y="5" width="34" height="38" rx="2.5"/>
      <rect class="fl" x="7" y="5" width="34" height="5" rx="2"/>
      <g class="slats" style="transform-origin:24px 10px">
        <rect class="acc" x="9" y="10.5" width="30" height="4.2" rx="1"/><rect class="acc" x="9" y="16" width="30" height="4.2" rx="1"/>
        <rect class="acc" x="9" y="21.5" width="30" height="4.2" rx="1"/><rect class="acc" x="9" y="27" width="30" height="4.2" rx="1"/>
        <rect class="acc" x="9" y="32.5" width="30" height="4.2" rx="1"/>
      </g>`,

    lock: `
      <path class="ln shackle" d="M16.5 22v-6.5a7.5 7.5 0 0 1 15 0V22" style="transform-origin:31.5px 22px"/>
      <rect class="ln soft" x="10" y="22" width="28" height="21" rx="4.5"/>
      <circle class="acc" cx="24" cy="31" r="3"/><path class="acs" d="M24 33v5" style="stroke-width:2.2"/>`,

    motion: `
      <circle class="ln soft" cx="15" cy="28" r="9.5"/>
      <circle class="acc" cx="15" cy="28" r="3.6"/>
      <path class="ln" d="M15 37.5v5M10 42.5h10"/>
      <g class="fx">
        <path class="acs wv" d="M27 21q5 7 0 14" style="animation-delay:0s"/>
        <path class="acs wv" d="M32 16q9 12 0 24" style="animation-delay:.3s"/>
        <path class="acs wv" d="M37 11q13 17 0 34" style="animation-delay:.6s"/>
      </g>`,

    presence: `
      <circle class="acc" cx="24" cy="15" r="6.2"/>
      <path class="acc" d="M11.5 40a12.5 12.5 0 0 1 25 0Z"/>
      <g class="fx">
        <circle class="acs ping" cx="24" cy="27" r="14" style="transform-origin:24px 27px"/>
        <circle class="acs ping" cx="24" cy="27" r="14" style="transform-origin:24px 27px;animation-delay:.8s"/>
      </g>`,

    smoke: `
      <circle class="ln soft" cx="24" cy="24" r="18"/>
      <circle class="ln" cx="24" cy="24" r="11" style="stroke-opacity:.45"/>
      <circle class="acc" cx="24" cy="24" r="4"/>
      <path class="ln" d="M24 8v2.5M24 37.5V40M8 24h2.5M37.5 24H40" style="stroke-opacity:.5;stroke-width:1.6"/>
      <circle class="led blinkled" cx="35" cy="13" r="1.8"/>
      <g class="fx"><circle class="acs ping" cx="24" cy="24" r="14" style="transform-origin:24px 24px"/><g class="rise"><path class="acs" d="M24 8q4-3 0-6" /></g></g>`,

    leak: `
      <g class="dripf"><path class="clf ln-c" d="M24 5s-8 10-8 16a8 8 0 0 0 16 0c0-6-8-16-8-16Z"/></g>
      <path class="acs" d="M6 41h36"/>
      <g class="fx"><ellipse class="acs ping" cx="24" cy="41" rx="9" ry="3" style="transform-origin:24px 41px"/></g>
      <path class="ln" d="M9 45h30" style="stroke-opacity:.4"/>`,

    camera: `
      <rect class="ln soft" x="5" y="11" width="30" height="17" rx="5"/>
      <circle class="ln" cx="29" cy="19.5" r="5.6"/>
      <circle class="acc" cx="29" cy="19.5" r="2.4"/>
      <circle class="fl" cx="28.1" cy="18.6" r=".9"/>
      <path class="ln" d="M16 28v5.5l-5 4M16 33.5h8"/>
      <circle class="led rec" cx="10.5" cy="16" r="1.7"/>
      <g class="fx"><path class="scan cmcone" d="M36 20L46 11V29Z" style="fill:var(--c-cool);opacity:.35;transform-origin:36px 20px"/></g>`,

    doorbell: `
      <rect class="ln soft" x="13" y="4" width="22" height="40" rx="6"/>
      <circle class="ln" cx="24" cy="14" r="3"/>
      <circle class="ln" cx="24" cy="31" r="7.2"/>
      <circle class="acc bell" cx="24" cy="31" r="4.4"/>
      <g class="fx"><circle class="acs ping" cx="24" cy="31" r="9" style="transform-origin:24px 31px"/><path class="acs flick" d="M7 26q-2.5 5 0 10M41 26q2.5 5 0 10"/></g>`,

    alarm: `
      <path class="ln soft" d="M12 36a12 12 0 0 1 24 0Z"/>
      <path class="acc" d="M17 34a7 7 0 0 1 14 0Z" style="fill-opacity:.75"/>
      <rect class="fl" x="8" y="36" width="32" height="5" rx="2"/>
      <g class="fx flick"><path class="acs" d="M24 12v-6M11.5 17l-4-4M36.5 17l4-4M6 27H2.5M45.5 27H42" style="stroke-width:2.2"/></g>`,

    router: `
      <rect class="ln soft" x="6" y="28" width="36" height="12" rx="4"/>
      <circle class="led" cx="13" cy="34" r="1.5"/><circle class="led l2" cx="19" cy="34" r="1.5"/><circle class="led l3" cx="25" cy="34" r="1.5"/>
      <path class="ln" d="M12 28V20M36 28V20"/>
      <circle class="acc" cx="24" cy="21" r="1.9"/>
      <g class="fx">
        <path class="acs wf" d="M18.5 16.5a8 8 0 0 1 11 0" style="animation-delay:0s"/>
        <path class="acs wf" d="M14.5 12.5a13.5 13.5 0 0 1 19 0" style="animation-delay:.25s"/>
        <path class="acs wf" d="M10.5 8.5a19 19 0 0 1 27 0" style="animation-delay:.5s"/>
      </g>`,

    vacuum: `
      <g class="vac" style="transform-origin:24px 24px">
        <circle class="ln soft" cx="24" cy="23" r="16"/>
        <circle class="ln" cx="24" cy="23" r="9" style="stroke-opacity:.45"/>
        <circle class="acc" cx="24" cy="23" r="3.2"/>
        <circle class="led" cx="24" cy="11.2" r="1.4"/>
        <g class="spin" style="transform-origin:35px 31px"><path class="acs" d="M35 27.5v7M31.5 31h7" style="stroke-width:1.8"/></g>
      </g>
      <g class="fx"><path class="acs dash" d="M3 44.5h42" style="stroke-dasharray:3 3;stroke-width:1.6"/></g>`,

    /* ---------------- environment ---------------- */
    weather: `
      <mask id="tk-wmask" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
        <rect width="48" height="48" fill="#fff"/><path class="mk" d="${CLOUD}" style="fill:#000;stroke:#000;stroke-width:5"/>
      </mask>
      <g mask="url(#tk-wmask)"><g class="wl sunl" style="transform-origin:24px 24px">
        <g class="spin slow rays" style="transform-origin:24px 24px"><path class="acs" d="M24 5v4M24 39v4M5 24h4M39 24h4M10.6 10.6l2.8 2.8M34.6 34.6l2.8 2.8M37.4 10.6l-2.8 2.8M13.4 34.6l-2.8 2.8"/></g>
        <circle class="acc" cx="24" cy="24" r="8.5"/>
      </g></g>
      <g class="wl moonl"><path style="fill:#dfe6ff" d="M31 9a14 14 0 1 0 9 24A11 11 0 0 1 31 9Z"/><circle class="fl tw1" cx="38" cy="10" r="1.3"/><circle class="fl tw2" cx="42" cy="18" r="1"/></g>
      <g class="wl cloudl"><path class="ln soft" d="${CLOUD}"/></g>
      <g class="wl rainl"><path class="cls rn" d="M18 34l-1.6 5" style="animation-delay:0s"/><path class="cls rn" d="M25 34l-1.6 5" style="animation-delay:.35s"/><path class="cls rn" d="M32 34l-1.6 5" style="animation-delay:.7s"/></g>
      <g class="wl snowl"><circle class="fl sn" cx="18" cy="36" r="1.5" style="animation-delay:0s"/><circle class="fl sn" cx="25" cy="38" r="1.5" style="animation-delay:.6s"/><circle class="fl sn" cx="32" cy="36" r="1.5" style="animation-delay:1.2s"/></g>
      <g class="wl boltl"><path class="zapw" d="M27 30l-5 8h4l-2 7 7-10h-4.5Z" style="fill:var(--c-on)"/></g>
      <g class="wl fogl"><path class="ln fogln" d="M8 36h30M12 41h28M8 46h22" style="stroke-opacity:.8"/></g>
      <g class="wl windl"><path class="ln windln" d="M6 37h22a3.5 3.5 0 1 0-3.5-3.5M6 43h30a3.5 3.5 0 1 1-3.5 3.5"/></g>`,

    temperature: `
      <path class="ln" d="M20 10a4 4 0 0 1 8 0V29.07A8 8 0 1 1 20 29.07Z"/>
      <circle cx="24" cy="36" r="5" style="fill:var(--lvlc,var(--c-hot));transition:fill .4s"/>
      <rect x="22.4" y="12" width="3.2" height="24" rx="1.6" style="transform-origin:24px 36px;transform:scaleY(var(--lvl,.5));fill:var(--lvlc,var(--c-hot));transition:transform .6s,fill .4s"/>
      <path class="ln" d="M32 10h4M32 16h3M32 22h4M32 28h3" style="stroke-width:1.5;stroke-opacity:.55"/>`,

    humidity: `
      <clipPath id="tk-hum"><path d="${DROPLET}"/></clipPath>
      <path class="ln soft" d="${DROPLET}"/>
      <g clip-path="url(#tk-hum)"><rect x="8" y="4" width="32" height="40" style="transform-origin:24px 44px;transform:scaleY(var(--lvl,.5));fill:var(--c-cool);fill-opacity:.7;transition:transform .6s"/></g>
      <path class="ln" d="${DROPLET}"/>
      <path class="fl" d="M16.5 28.5a8 8 0 0 0 4.5 7" style="fill:none;stroke:#fff;stroke-opacity:.55;stroke-width:1.8;stroke-linecap:round"/>`,

    gauge: `
      <path class="ln" d="M7 36a17 17 0 0 1 34 0"/>
      <path class="acs" d="M11.5 36a12.5 12.5 0 0 1 25 0" style="stroke-width:3;stroke-opacity:.9"/>
      <path class="ln" d="M24 14v3M10 21l2.2 2.2M38 21l-2.2 2.2" style="stroke-opacity:.5;stroke-width:1.5"/>
      <g class="ndl" style="transform-origin:24px 36px;transform:rotate(calc(var(--lvl,.5) * 180deg - 90deg));transition:transform .7s"><path class="fl" d="M24 36L24 18" style="stroke:var(--c-body);stroke-width:2.2;stroke-linecap:round"/></g>
      <circle class="fl" cx="24" cy="36" r="3.2"/>`,
  };

  /* ===================================================================== 3D STYLE
   * `style: 3d` — same icon names, same state animations, drawn with gradients, depth and soft shadows.
   * Light comes from the top-left. Lit parts are two shapes: a dull "off" one and a coloured `.fx` overlay
   * that fades in when the device is on. Materials are self-contained (work on any theme). */
  const DEFS3D = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <linearGradient id="g-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#e4e8ef"/><stop offset="1" stop-color="#b6bfcc"/></linearGradient>
    <linearGradient id="g-side" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b7bfcc"/><stop offset="1" stop-color="#7a8394"/></linearGradient>
    <linearGradient id="g-top" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#e9edf3"/><stop offset="1" stop-color="#fff"/></linearGradient>
    <linearGradient id="g-dark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4b5363"/><stop offset="1" stop-color="#15181f"/></linearGradient>
    <linearGradient id="g-ds" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b303a"/><stop offset="1" stop-color="#0c0e12"/></linearGradient>
    <linearGradient id="g-cyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#e2e6ed"/><stop offset=".75" stop-color="#b3bbc7"/><stop offset="1" stop-color="#8b94a2"/></linearGradient>
    <linearGradient id="g-cylh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#dfe4eb"/><stop offset=".8" stop-color="#aab2be"/><stop offset="1" stop-color="#848d9b"/></linearGradient>
    <linearGradient id="g-steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f7f9fb"/><stop offset=".35" stop-color="#aab2be"/><stop offset=".6" stop-color="#eef1f5"/><stop offset="1" stop-color="#8a93a1"/></linearGradient>
    <linearGradient id="g-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#cfe3f5" stop-opacity=".14"/></linearGradient>
    <linearGradient id="g-gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="g-wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dba46e"/><stop offset="1" stop-color="#8b5a2b"/></linearGradient>
    <linearGradient id="g-pv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a7be0"/><stop offset=".6" stop-color="#1b3a85"/><stop offset="1" stop-color="#0f2152"/></linearGradient>
    <linearGradient id="g-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fdcff" stop-opacity=".95"/><stop offset="1" stop-color="#0288d1" stop-opacity=".95"/></linearGradient>
    <linearGradient id="g-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#b6c2d3"/></linearGradient>
    <radialGradient id="g-sphere" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#d3dae4"/><stop offset="1" stop-color="#8590a1"/></radialGradient>
    <radialGradient id="g-off" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#eef0f4"/><stop offset=".6" stop-color="#aab1bd"/><stop offset="1" stop-color="#727b8a"/></radialGradient>
    <radialGradient id="g-amber" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="#fff8d6"/><stop offset=".45" stop-color="#ffc83d"/><stop offset="1" stop-color="#d98200"/></radialGradient>
    <radialGradient id="g-cool" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="#eaf8ff"/><stop offset=".45" stop-color="#4fc3f7"/><stop offset="1" stop-color="#0277bd"/></radialGradient>
    <radialGradient id="g-hot" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="#ffe5d9"/><stop offset=".45" stop-color="#ff7043"/><stop offset="1" stop-color="#bf360c"/></radialGradient>
    <radialGradient id="g-green" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="#eaffec"/><stop offset=".45" stop-color="#66bb6a"/><stop offset="1" stop-color="#2e7d32"/></radialGradient>
    <radialGradient id="g-red" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="#ffe6e4"/><stop offset=".45" stop-color="#ef5350"/><stop offset="1" stop-color="#b71c1c"/></radialGradient>
  </defs></svg>`;

  // --- tiny drawing kit (returns SVG strings) ---
  const f3 = (g) => `fill="url(#${g})"`;
  const OL = 'stroke="rgba(15,20,30,.38)" stroke-width=".6" stroke-linejoin="round"';
  const rect3 = (x, y, w, h, g, rx = 1.2, ex = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ${f3(g)} ${OL} ${ex}/>`;
  const poly3 = (pts, g, ex = '') => `<polygon points="${pts}" ${f3(g)} ${OL} ${ex}/>`;
  const circ3 = (cx, cy, r, g, ex = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" ${f3(g)} ${OL} ${ex}/>`;
  const ell3 = (cx, cy, rx, ry, g, ex = '') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${f3(g)} ${OL} ${ex}/>`;
  const lit3 = (tag, attrs, g, cls = '', ex = '') => `<${tag} ${attrs} ${f3('g-off')} ${OL} ${ex}/><${tag} class="fx ${cls}" ${attrs} ${f3(g)} ${ex}/>`;
  const shd3 = (cx, cy, rx, ry = rx * 0.26) => `<ellipse class="shd" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
  const shine3 = (d, w = 1.5, o = 0.7) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="round"/>`;
  // extruded box: front face + right side + top (depth dx, dy toward the up-right)
  const box3 = (x, y, w, h, dx, dy, o = {}) => {
    const { front = 'g-body', side = 'g-side', top = 'g-top', rx = 1.4 } = o;
    return poly3(`${x + w},${y} ${x + w + dx},${y - dy} ${x + w + dx},${y + h - dy} ${x + w},${y + h}`, side)
      + poly3(`${x},${y} ${x + dx},${y - dy} ${x + w + dx},${y - dy} ${x + w},${y}`, top)
      + rect3(x, y, w, h, front, rx);
  };
  // vertical cylinder: top-ellipse y, width, body height
  const cyl3 = (cx, top, w, h, g = 'g-cyl', tg = 'g-top') => {
    const rx = w / 2, ry = Math.max(1.4, rx * 0.32);
    return `<path d="M${cx - rx} ${top}v${h}a${rx} ${ry} 0 0 0 ${w} 0v${-h}Z" ${f3(g)} ${OL}/><ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" ${f3(tg)} ${OL}/>`;
  };
  const LAMPR = 'class="fx"';

  const ICONS3D = {
    /* ---------------- lights, switching, climate ---------------- */
    fan: `
      ${shd3(24, 44.6, 12)}${ell3(24, 42.4, 9, 2.8, 'g-steel')}${rect3(22.2, 33, 3.6, 9.5, 'g-steel', 1)}
      <circle cx="24" cy="19.5" r="17" fill="url(#g-glass)" stroke="url(#g-steel)" stroke-width="2"/>
      <circle cx="24" cy="19.5" r="12.5" fill="none" stroke="rgba(120,130,145,.35)" stroke-width=".8"/>
      <g class="spin" style="transform-origin:24px 19.5px">
        ${[0, 120, 240].map((a) => lit3('path', `transform="rotate(${a} 24 19.5)" d="M24 19.5C19 13.5 19.5 7 24 5.2C28.5 7 29 13.5 24 19.5Z"`, 'g-amber')).join('')}
      </g>
      ${circ3(24, 19.5, 3.4, 'g-sphere')}${shine3('M11.5 12a14 14 0 0 1 11-5.6')}`,

    bulb: `
      <g style="opacity:var(--bri,1)"><circle class="fx glow" cx="24" cy="18" r="16" style="fill:var(--glow,#ffc83d);filter:blur(6px);transform-origin:24px 18px"/></g>
      <path d="M24 4.5A12.5 12.5 0 0 0 16.7 27.1V31H31.3V27.1A12.5 12.5 0 0 0 24 4.5Z" fill="url(#g-glass)" stroke="rgba(120,130,145,.85)" stroke-width="1"/>
      <path class="fx" d="M24 4.5A12.5 12.5 0 0 0 16.7 27.1V31H31.3V27.1A12.5 12.5 0 0 0 24 4.5Z" fill="url(#g-amber)" fill-opacity=".92"/>
      <path class="fx" d="M24 4.5A12.5 12.5 0 0 0 16.7 27.1V31H31.3V27.1A12.5 12.5 0 0 0 24 4.5Z" style="fill:var(--glow,transparent)" fill-opacity=".7"/>
      <path d="M19.5 20l4.5 5 4.5-5M24 25v6" fill="none" stroke="#9aa3b0" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="fx" d="M19.5 20l4.5 5 4.5-5M24 25v6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      ${shine3('M17.8 13a8 8 0 0 1 5-6.2', 1.8, .85)}
      ${rect3(17, 31, 14, 3, 'g-steel', 1.2)}${rect3(17.8, 34, 12.4, 3, 'g-steel', 1.2)}${rect3(18.6, 37, 10.8, 3, 'g-steel', 1.2)}
      <path d="M21 40h6a3 3 0 0 1-6 0Z" ${f3('g-dark')}/>`,

    floodlight: `
      <g class="fx"><path class="beam" d="M16 22H32L44 44H4Z" style="fill:#ffc83d;opacity:.34;filter:blur(2px)"/></g>
      ${rect3(22.5, 2, 3, 6, 'g-steel', 1)}${box3(11, 7, 26, 12, 4, 3, { rx: 3 })}
      ${lit3('rect', 'x="13.5" y="15.4" width="21" height="3.2" rx="1.6"', 'g-amber')}
      <g class="fx"><path class="acs flick" d="M6 26l3 3M42 26l-3 3M24 30v3" style="stroke-width:1.8"/></g>`,

    socket: `
      ${shd3(24, 44.6, 14)}${box3(8, 8, 30, 32, 3, 2, { rx: 5 })}${rect3(12, 12, 22, 24, 'g-top', 3)}
      ${rect3(22.5, 15, 3, 6.5, 'g-dark', .8)}${rect3(15.5, 26, 3, 6.5, 'g-dark', .8)}${rect3(28.5, 26, 3, 6.5, 'g-dark', .8)}
      <g class="fx"><path class="acs flick" d="M19.6 31l2-2.5 2.5 5 2.5-5 2 2.5"/></g>
      ${lit3('circle', 'cx="33" cy="16" r="1.8"', 'g-green')}
      <circle class="fx okring ping" cx="33" cy="16" r="3.4" style="transform-origin:33px 16px"/>`,

    switch: `
      ${shd3(24, 44.6, 12)}${box3(10, 5, 28, 38, 3, 2, { rx: 5 })}${rect3(16, 11, 16, 26, 'g-top', 3)}
      <rect class="swd" x="16" y="24" width="16" height="13" rx="3" ${f3('g-side')} opacity=".9"/>
      <g class="fx"><rect x="16" y="11" width="16" height="13" rx="3" ${f3('g-side')} opacity=".9"/></g>
      ${lit3('rect', 'x="20.5" y="14.5" width="7" height="3" rx="1.5"', 'g-amber')}`,

    heater: `
      ${shd3(24, 44.6, 18)}${rect3(5, 15, 38, 3.6, 'g-steel', 1.5)}
      ${[0, 1, 2, 3, 4].map((i) => { const x = 7 + i * 7.6; return lit3('rect', `x="${x}" y="18.4" width="5.2" height="19" rx="2.6"`, 'g-hot') + `<rect x="${x + .8}" y="19.5" width="1.4" height="16" rx=".7" fill="#fff" opacity=".5"/>`; }).join('')}
      ${rect3(5, 36.5, 38, 3.6, 'g-steel', 1.5)}${rect3(9, 40, 3, 3.6, 'g-dark', .8)}${rect3(36, 40, 3, 3.6, 'g-dark', .8)}
      <g class="fx">
        <g class="rise" style="animation-delay:0s"><path class="hts" d="M14 12c-2.2-2 2.2-4 0-6.2"/></g>
        <g class="rise" style="animation-delay:.55s"><path class="hts" d="M24 12c-2.2-2 2.2-4 0-6.2"/></g>
        <g class="rise" style="animation-delay:1.1s"><path class="hts" d="M34 12c-2.2-2 2.2-4 0-6.2"/></g>
      </g>`,

    ac: `
      ${box3(4, 8, 38, 15, 4, 3, { rx: 5 })}${rect3(8, 10.5, 14, 2.2, 'g-dark', 1)}
      ${lit3('circle', 'cx="36" cy="11.6" r="1.4"', 'g-green')}${shine3('M7.5 12a5 5 0 0 1 5-3h20', 1.4, .8)}
      ${rect3(8, 18.5, 30, 3, 'g-dark', 1.5)}
      <g class="flap" style="transform-origin:8px 20.5px">${rect3(8, 19.2, 30, 2.6, 'g-steel', 1.2)}</g>
      <g class="fx">
        <g class="fall" style="animation-delay:0s"><path class="cls" d="M14 27c-2.2 2 2.2 4 0 6.2"/></g>
        <g class="fall" style="animation-delay:.6s"><path class="cls" d="M24 27c-2.2 2 2.2 4 0 6.2"/></g>
        <g class="fall" style="animation-delay:1.2s"><path class="cls" d="M34 27c-2.2 2 2.2 4 0 6.2"/></g>
        <circle class="clf tw1" cx="19" cy="40" r="1.3"/><circle class="clf tw2" cx="30" cy="42" r="1.3"/><circle class="clf tw3" cx="39" cy="38" r="1.1"/>
      </g>`,

    thermostat: `
      ${shd3(24, 44.6, 15)}${circ3(24, 23, 19, 'g-steel')}${circ3(24, 23, 15.5, 'g-dark')}
      <path d="M24 9.5v2.5M37.5 23H35M13 23h-2.5M13.5 12.5l1.8 1.8M34.5 12.5l-1.8 1.8" stroke="#7f8998" stroke-width="1.3" stroke-linecap="round"/>
      <path class="acs arcp" d="M14 31.4A13 13 0 1 1 34 31.4" style="stroke-width:2.6"/>
      ${circ3(24, 23, 4.5, 'g-sphere')}
      <g class="fx"><circle class="okring ping" cx="24" cy="23" r="8" style="transform-origin:24px 23px;stroke:var(--c-on)"/></g>
      ${shine3('M9 15a16 16 0 0 1 11-8.5', 1.6, .55)}`,

    purifier: `
      ${shd3(26, 44.6, 12)}${box3(13, 10, 20, 33, 5, 3, { rx: 3 })}${rect3(16, 13.5, 14, 2.4, 'g-dark', 1)}
      <path d="M16.5 22h13M16.5 26h13M16.5 30h13M16.5 34h13" stroke="#aeb6c2" stroke-width="1.2" stroke-linecap="round"/>
      ${lit3('circle', 'cx="29" cy="19" r="1.4"', 'g-green')}
      <g class="fx">
        <g class="rise" style="animation-delay:0s"><path class="cls" d="M18 9q3-3 0-6"/></g>
        <g class="rise" style="animation-delay:.6s"><path class="cls" d="M24 9q3-3 0-6"/></g>
        <g class="rise" style="animation-delay:1.2s"><path class="cls" d="M30 9q3-3 0-6"/></g>
      </g>`,

    geyser: `
      ${shd3(24, 44.6, 14)}${rect3(17, 2, 3, 5, 'g-steel', 1)}${rect3(28, 2, 3, 5, 'g-steel', 1)}${cyl3(24, 7, 26, 33)}
      ${lit3('rect', 'x="11" y="25" width="26" height="9"', 'g-hot')}
      <rect x="14" y="8" width="3" height="31" fill="#fff" opacity=".4"/>
      ${circ3(24, 16, 3.8, 'g-dark')}<path class="fx" d="M24 16l2.2-2.2" stroke="#ffc83d" stroke-width="1.4" stroke-linecap="round"/>
      <g class="fx">
        <g class="rise" style="animation-delay:.2s"><path class="hts" d="M6 26c-2-2 2-3.5 0-5.6"/></g>
        <g class="rise" style="animation-delay:.9s"><path class="hts" d="M42 26c-2-2 2-3.5 0-5.6"/></g>
      </g>`,

    /* ---------------- kitchen & laundry ---------------- */
    fridge: `
      ${shd3(26, 44.6, 15)}${box3(10, 4, 26, 40, 5, 3, { rx: 2.2 })}
      <path d="M10 18H36" stroke="rgba(20,25,35,.45)" stroke-width="1"/>
      ${rect3(13.5, 9, 2, 6, 'g-steel', 1)}${rect3(13.5, 21, 2, 9, 'g-steel', 1)}
      <g class="fx"><rect x="11" y="19" width="24" height="24" fill="#4fc3f7" opacity=".16"/></g>
      <g class="snow" style="transform-origin:27px 31px"><path class="cls" d="M27 26.5v9M23.1 28.75l7.8 4.5M23.1 33.25l7.8-4.5" style="stroke-width:1.8"/></g>
      ${lit3('circle', 'cx="31.5" cy="10.5" r="1.4"', 'g-green')}${shine3('M12 6v10', 1.2, .6)}`,

    freezer: `
      ${shd3(25, 44.6, 19)}${box3(4, 16, 34, 25, 6, 3, { rx: 2.5 })}
      <path d="M4 23H38" stroke="rgba(20,25,35,.45)" stroke-width="1"/>${rect3(16, 18, 10, 2.4, 'g-steel', 1.2)}
      <path d="M9 41v3M33 41v3" stroke="#59616f" stroke-width="2.4" stroke-linecap="round"/>
      <g class="fx"><rect x="5" y="24" width="32" height="16" fill="#4fc3f7" opacity=".16"/></g>
      <g class="snow" style="transform-origin:21px 32px"><path class="cls" d="M21 26.5v11M16 29l10 6M16 35l10-6" style="stroke-width:1.8"/></g>
      <circle class="fx clf tw1" cx="9" cy="28" r="1.1"/><circle class="fx clf tw2" cx="33" cy="37" r="1.1"/>`,

    washer: `
      <clipPath id="tk3-wm"><circle cx="22.5" cy="28" r="9.4"/></clipPath>
      ${shd3(24, 44.6, 17)}${box3(7, 5, 31, 38, 5, 3, { rx: 3 })}${rect3(7, 5, 31, 8, 'g-top', 3)}
      ${circ3(12.5, 9, 1.9, 'g-sphere')}${lit3('rect', 'x="24" y="7.4" width="9" height="3.2" rx="1.6"', 'g-amber')}
      ${circ3(22.5, 28, 11.8, 'g-steel')}${circ3(22.5, 28, 9.6, 'g-dark')}
      <g clip-path="url(#tk3-wm)">
        <g class="drum" style="transform-origin:22.5px 28px">${lit3('circle', 'cx="18" cy="24" r="3"', 'g-amber')}${lit3('circle', 'cx="27" cy="26" r="2.6"', 'g-amber')}${lit3('circle', 'cx="22" cy="33.5" r="3"', 'g-amber')}</g>
        <g class="fx"><g class="wave"><path d="M6 29q3-3 6 0t6 0t6 0t6 0t6 0t6 0t6 0V40H6Z" fill="url(#g-water)" opacity=".85"/></g></g>
      </g>${shine3('M14.5 21.5a10 10 0 0 1 8-4.6', 1.6, .55)}`,

    dryer: `
      <clipPath id="tk3-dr"><circle cx="22.5" cy="28" r="9.4"/></clipPath>
      ${shd3(24, 44.6, 17)}${box3(7, 5, 31, 38, 5, 3, { rx: 3 })}${rect3(7, 5, 31, 8, 'g-top', 3)}
      ${circ3(12.5, 9, 1.9, 'g-sphere')}${lit3('rect', 'x="24" y="7.4" width="9" height="3.2" rx="1.6"', 'g-hot')}
      ${circ3(22.5, 28, 11.8, 'g-steel')}${circ3(22.5, 28, 9.6, 'g-dark')}
      <g clip-path="url(#tk3-dr)">
        <g class="drum" style="transform-origin:22.5px 28px">${lit3('circle', 'cx="18" cy="24.5" r="3"', 'g-hot')}${lit3('circle', 'cx="27" cy="26.5" r="2.8"', 'g-hot')}${lit3('circle', 'cx="22" cy="33" r="3"', 'g-hot')}</g>
        <g class="fx"><g class="rise" style="animation-delay:0s"><path class="hts" d="M18 29c-1.6-1.6 1.6-2.6 0-4.2" style="stroke-width:1.4"/></g><g class="rise" style="animation-delay:.7s"><path class="hts" d="M27 31c-1.6-1.6 1.6-2.6 0-4.2" style="stroke-width:1.4"/></g></g>
      </g>${shine3('M14.5 21.5a10 10 0 0 1 8-4.6', 1.6, .55)}`,

    dishwasher: `
      ${shd3(24, 44.6, 17)}${box3(7, 5, 31, 38, 5, 3, { rx: 3 })}${rect3(7, 5, 31, 8, 'g-top', 3)}
      ${circ3(12.5, 9, 1.9, 'g-sphere')}${lit3('rect', 'x="24" y="7.4" width="9" height="3.2" rx="1.6"', 'g-amber')}
      ${rect3(11, 17, 23, 21, 'g-dark', 2)}
      <path d="M15 36v-8M20 36v-8M25 36v-8M30 36v-8" stroke="#8e98a8" stroke-width="1.3" stroke-linecap="round"/>
      <g class="fx"><rect x="11.5" y="31" width="22" height="6.5" fill="url(#g-water)" opacity=".7"/></g>
      <g class="arm" style="transform-origin:22.5px 24px"><path d="M14 24h17" stroke="url(#g-steel)" stroke-width="2.4" stroke-linecap="round"/></g>
      <g class="fx"><circle class="clf fall" cx="17" cy="27" r="1.2" style="animation-delay:0s"/><circle class="clf fall" cx="22.5" cy="27" r="1.2" style="animation-delay:.4s"/><circle class="clf fall" cx="28" cy="27" r="1.2" style="animation-delay:.8s"/></g>
      ${shine3('M13 19.5l8-1.2', 1.4, .5)}`,

    kettle: `
      ${shd3(22, 44.6, 14)}${rect3(8, 41.2, 28, 3.2, 'g-dark', 1.5)}
      <path d="M11 41V22a3 3 0 0 1 3-3h13a3 3 0 0 1 3 3v19Z" ${f3('g-cyl')} ${OL}/>
      ${lit3('rect', 'x="11" y="35" width="19" height="3.4" rx="1.4"', 'g-hot')}
      <path d="M30 22l8-6 2 2.4-7 8.6Z" ${f3('g-steel')} ${OL}/>
      <path d="M13 19l2-4h10l2 4Z" ${f3('g-steel')} ${OL}/>${circ3(20, 13.5, 1.9, 'g-dark')}
      <path d="M11 23H7.5A1.5 1.5 0 0 0 6 24.5v9A1.5 1.5 0 0 0 7.5 35H11" fill="none" stroke="url(#g-dark)" stroke-width="3" stroke-linecap="round"/>
      ${shine3('M13.5 24v9', 1.4, .65)}
      <g class="fx">
        <g class="rise" style="animation-delay:0s"><path class="steam" d="M41 14c-2-2 2-3.5 0-5.5"/></g>
        <g class="rise" style="animation-delay:.6s"><path class="steam" d="M37 12c-2-2 2-3.5 0-5.5"/></g>
        <circle class="fl bub" cx="18" cy="32" r="1.1" style="animation-delay:0s"/><circle class="fl bub" cx="24" cy="32" r="1.1" style="animation-delay:.5s"/>
      </g>`,

    blender: `
      <clipPath id="tk3-bl"><path d="M14 6h20l-3 25H17Z"/></clipPath>
      ${shd3(24, 44.6, 13)}${rect3(12.5, 3.4, 23, 3.4, 'g-steel', 1.6)}
      <path d="M14 6h20l-3 25H17Z" fill="url(#g-glass)" stroke="rgba(120,130,145,.85)" stroke-width="1" stroke-linejoin="round"/>
      <g clip-path="url(#tk3-bl)">
        ${lit3('rect', 'x="12" y="17" width="26" height="16"', 'g-amber', '', 'opacity=".6"')}
        <g class="fx"><circle class="fl bub" cx="20" cy="27" r="1.2" style="animation-delay:0s"/><circle class="fl bub" cx="27" cy="28" r="1.4" style="animation-delay:.4s"/><circle class="fl bub" cx="24" cy="26" r="1" style="animation-delay:.8s"/></g>
        <g class="blend" style="transform-origin:24px 29px"><path d="M17.5 29h13" stroke="url(#g-steel)" stroke-width="2.4" stroke-linecap="round"/></g>
      </g>${shine3('M16 9l2 15', 1.4, .7)}
      ${box3(13, 31, 22, 12, 3, 2, { front: 'g-dark', side: 'g-ds', top: 'g-steel', rx: 3.5 })}${circ3(24, 37, 2.2, 'g-steel')}
      <g class="fx"><path class="acs flick" d="M8.5 13v7M39.5 13v7" style="stroke-width:1.6"/></g>`,

    sewing: `
      ${shd3(24, 44.6, 19)}
      <path d="M7 13a4.5 4.5 0 0 1 4.5-4.5H36.5A4.5 4.5 0 0 1 41 13V41H31V21H11.5A4.5 4.5 0 0 1 7 16.5Z" ${f3('g-body')} ${OL}/>
      <path d="M31 21V41H41V13a4.5 4.5 0 0 0-4.5-4.5" fill="none" stroke="rgba(110,120,140,.35)" stroke-width="1.2"/>
      ${rect3(4, 41, 40, 3.5, 'g-steel', 1.75)}${circ3(17, 14.5, 2.6, 'g-sphere')}
      ${lit3('rect', 'x="9" y="19.4" width="6" height="1.8" rx=".9"', 'g-amber')}
      <path d="M17.4 17.2Q14 19 12.1 26" fill="none" stroke="#c0495a" stroke-width="1.1"/>
      <g class="needle"><rect x="11" y="21" width="2.2" height="8" rx="1" ${f3('g-steel')} ${OL}/><path d="M12.1 29v5" stroke="#9aa3b0" stroke-width="1.5" stroke-linecap="round"/></g>
      <path d="M9 37.3h6" stroke="#6b7482" stroke-width="2.2" stroke-linecap="round"/>
      <path class="acs dash" d="M5 39.6h24" style="stroke-dasharray:3 3;stroke-width:1.4"/>
      <g class="spin" style="transform-origin:36px 14.5px">${circ3(36, 14.5, 3.8, 'g-steel')}<path d="M36 11.4v6.2" stroke="#59616f" stroke-width="1.4" stroke-linecap="round"/></g>`,

    pump: `
      ${shd3(22, 44.6, 20)}${rect3(3, 37, 34, 3.6, 'g-dark', 1.8)}
      <rect x="4" y="15" width="17" height="18" rx="4" ${f3('g-cylh')} ${OL}/>
      <path d="M9.5 19.5v9M13.5 19.5v9M17.5 19.5v9" stroke="#8a93a1" stroke-width="1.2" stroke-linecap="round"/>
      ${rect3(9, 33, 3, 4, 'g-dark', .8)}${rect3(26, 34, 8, 3, 'g-dark', .8)}
      ${rect3(27.4, 6, 5, 8, 'g-steel', 1)}${rect3(39.5, 21, 7, 6, 'g-steel', 1)}
      ${circ3(30, 24, 10.6, 'g-steel')}${circ3(30, 24, 8.6, 'g-dark')}
      <circle class="fx" cx="30" cy="24" r="8" fill="url(#g-water)" opacity=".55"/>
      <g class="spin" style="transform-origin:30px 24px">
        ${lit3('rect', 'x="29" y="16" width="2" height="8" rx="1"', 'g-amber')}${lit3('rect', 'transform="rotate(90 30 24)" x="29" y="16" width="2" height="8" rx="1"', 'g-amber')}
        ${lit3('rect', 'transform="rotate(180 30 24)" x="29" y="16" width="2" height="8" rx="1"', 'g-amber')}${lit3('rect', 'transform="rotate(270 30 24)" x="29" y="16" width="2" height="8" rx="1"', 'g-amber')}
      </g>${circ3(30, 24, 2.2, 'g-sphere')}
      <g class="fx"><circle class="clf drop" cx="46" cy="24" r="1.4" style="animation-delay:0s"/><circle class="clf drop" cx="46" cy="24" r="1.4" style="animation-delay:.4s"/></g>`,

    tv: `
      <clipPath id="tk3-tv"><rect x="6" y="9" width="36" height="22.5" rx="1.5"/></clipPath>
      <g class="fx"><rect x="3" y="6" width="42" height="29" rx="5" style="fill:#4fc3f7;opacity:.28;filter:blur(7px)"/></g>
      ${shd3(24, 44.6, 14)}${poly3('16,41 32,41 34,43.8 14,43.8', 'g-steel')}${rect3(21.5, 33, 5, 8.4, 'g-steel', 1)}
      ${rect3(3.5, 6.5, 41, 28, 'g-dark', 3)}${rect3(6, 9, 36, 22.5, 'g-ds', 1.5)}
      <g class="fx" clip-path="url(#tk3-tv)" style="filter:blur(3px)">
        <rect x="5" y="8" width="38" height="25" style="fill:#16213e"/>
        <circle class="b1" cx="15" cy="17" r="9" style="fill:#4fc3f7"/><circle class="b2" cx="32" cy="24" r="10" style="fill:#ff7043"/><circle class="b3" cx="26" cy="14" r="7" style="fill:#ab47bc"/>
      </g>
      <path d="M6 9h36v7L6 23Z" fill="url(#g-gloss)" opacity=".2"/>`,

    speaker: `
      ${shd3(26, 44.6, 13)}${box3(13, 5, 20, 38, 5, 3, { front: 'g-dark', side: 'g-ds', top: 'g-steel', rx: 3 })}
      ${circ3(23, 13, 3.6, 'g-steel')}${circ3(23, 13, 2, 'g-ds')}
      ${circ3(23, 30, 8.6, 'g-steel')}
      <g class="pulse" style="transform-origin:23px 30px">${circ3(23, 30, 6.6, 'g-ds')}${lit3('circle', 'cx="23" cy="30" r="3.4"', 'g-amber')}</g>
      <g class="fx">
        <path class="acs wv" d="M40 20q3 4 0 8" style="animation-delay:0s"/><path class="acs wv" d="M44 16q5 8 0 16" style="animation-delay:.3s"/>
        <path class="acs wv" d="M6 20q-3 4 0 8" style="animation-delay:0s"/><path class="acs wv" d="M2 16q-5 8 0 16" style="animation-delay:.3s"/>
      </g>`,

    /* ---------------- power & energy ---------------- */
    solar: `
      <clipPath id="tk3-pv"><polygon points="7,34.4 12.2,19.6 41.6,19.6 36.4,34.4"/></clipPath>
      ${shd3(24, 44.6, 17)}
      <path d="M17 36l-3 8.2M31 36l3 8.2" stroke="url(#g-steel)" stroke-width="2.2" stroke-linecap="round"/>
      <g class="fx"><g class="spin slow" style="transform-origin:37px 8.5px"><path class="acs" d="M37 -.5v3M37 14.5v3M28.5 8.5h3M42.5 8.5h3M31 2.5l2 2M41 12.5l2 2M43 2.5l-2 2M31 14.5l2-2"/></g></g>
      ${circ3(37, 8.5, 4.6, 'g-amber')}
      ${poly3('5,36 11,18 43,18 37,36', 'g-steel')}${poly3('7,34.4 12.2,19.6 41.6,19.6 36.4,34.4', 'g-pv')}
      <path d="M9.6 27h28.4M19.9 19.6l-2.7 14.8M30.4 19.6l2.7 14.8" stroke="#8fb0ff" stroke-opacity=".55" stroke-width=".7"/>
      <g clip-path="url(#tk3-pv)"><g class="fx"><rect class="shim" x="-14" y="18" width="7" height="18" style="fill:#fff;opacity:.45;transform:skewX(-20deg)"/></g></g>
      <path d="M12.2 19.6h29.4L28 27z" fill="url(#g-gloss)" opacity=".22"/>`,

    battery: `
      ${shd3(24, 44.6, 18)}${box3(4, 14, 32, 20, 5, 3, { front: 'g-dark', side: 'g-ds', top: 'g-steel', rx: 3 })}${rect3(41, 20, 3.5, 8, 'g-steel', 1.2)}
      <rect class="lvl" x="7" y="17.5" width="26" height="13" rx="2" style="transform-origin:7px 24px;transform:scaleX(var(--lvl,1));fill:var(--lvlc,#66bb6a);transition:transform .6s,fill .4s"/>
      <rect x="7" y="17.5" width="26" height="5" rx="2" fill="url(#g-gloss)" opacity=".4" style="transform-origin:7px 24px;transform:scaleX(var(--lvl,1));transition:transform .6s"/>
      <path d="M15.5 17.5v13M24 17.5v13" stroke="#15181f" stroke-width="1"/>
      <path class="chgfx" d="M21.5 15.5L15 25h5l-1 7.5 7-10.5h-5.2Z" style="fill:#fff;stroke:rgba(0,0,0,.45);stroke-width:.8;stroke-linejoin:round"/>`,

    inverter: `
      <clipPath id="tk3-inv"><rect x="9" y="14" width="24" height="12" rx="2"/></clipPath>
      ${shd3(24, 44.6, 18)}${box3(5, 10, 32, 28, 5, 3, { rx: 3 })}${rect3(9, 14, 24, 12, 'g-dark', 2)}
      <g clip-path="url(#tk3-inv)"><g class="wave"><path class="acs" d="M-3 20q3-6 6 0t6 0t6 0t6 0t6 0t6 0t6 0t6 0t6 0t6 0" style="stroke-width:1.6"/></g></g>
      <path d="M10 31h13M10 33.6h13" stroke="#aeb6c2" stroke-width="1.2" stroke-linecap="round"/>
      ${lit3('circle', 'cx="27" cy="31.6" r="1.6"', 'g-green')}${circ3(31, 31.6, 1.6, 'g-steel')}
      ${shine3('M9.5 16.5l10-1.6', 1.2, .4)}`,

    fence: `
      ${shd3(22, 44.6, 15)}${box3(8, 9, 28, 30, 4, 3, { rx: 3 })}
      <g class="bolt">${lit3('path', 'd="M24.5 13L14.5 26.5h6.8l-2 9 10.2-14h-6.8Z"', 'g-amber')}</g>
      ${lit3('circle', 'cx="12.5" cy="13.2" r="1.6"', 'g-green')}${circ3(14, 37.5, 1.5, 'g-steel')}${circ3(30, 37.5, 1.5, 'g-steel')}
      <circle class="fx acs ping" cx="22" cy="24" r="12" style="transform-origin:22px 24px"/>
      <path class="acs" d="M3 45h42" style="stroke-dasharray:2 3;stroke-width:1.4;stroke-opacity:.7"/>`,

    ev: `
      ${shd3(24, 40.6, 19, 2.6)}
      <path d="M4 33v-5a3 3 0 0 1 2.4-2.9L11 24l5-7.2A4 4 0 0 1 19.3 15H30a4 4 0 0 1 3.1 1.5L38 24l3.6.8A3 3 0 0 1 44 27.7V33a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" ${f3('g-body')} ${OL}/>
      <path d="M17 24l3.4-5.5H29a2 2 0 0 1 1.6.8L34.5 24Z" ${f3('g-dark')}/>${shine3('M8 27.5l6-1.6', 1.2, .7)}
      ${circ3(14, 34, 4.8, 'g-ds')}${circ3(14, 34, 2, 'g-steel')}${circ3(34, 34, 4.8, 'g-ds')}${circ3(34, 34, 2, 'g-steel')}
      ${lit3('rect', 'x="41" y="26.4" width="3" height="2.4" rx="1"', 'g-amber')}
      <g class="bolt">${lit3('path', 'd="M25 2.5l-5 8h4l-1 6 6-9h-4.2Z"', 'g-amber')}</g>
      <circle class="fx acs ping" cx="24" cy="10" r="7" style="transform-origin:24px 10px"/>`,

    /* ---------------- sensors & security ---------------- */
    door: `
      ${shd3(24, 44.6, 15)}${rect3(8, 3.5, 32, 41, 'g-steel', 2)}${rect3(10.5, 6, 27, 36, 'g-ds', 1)}
      <rect class="fx" x="10.5" y="6" width="27" height="36" ${f3('g-amber')} opacity=".6"/>
      <g class="leaf" style="transform-origin:10.5px 24px">${rect3(10.5, 6, 27, 36, 'g-wood', 1)}
        <rect x="14" y="10" width="8.5" height="13" fill="rgba(0,0,0,.14)" stroke="rgba(255,255,255,.3)" stroke-width=".7"/><rect x="25" y="10" width="8.5" height="13" fill="rgba(0,0,0,.14)" stroke="rgba(255,255,255,.3)" stroke-width=".7"/>
        <rect x="14" y="26" width="8.5" height="12" fill="rgba(0,0,0,.14)" stroke="rgba(255,255,255,.3)" stroke-width=".7"/><rect x="25" y="26" width="8.5" height="12" fill="rgba(0,0,0,.14)" stroke="rgba(255,255,255,.3)" stroke-width=".7"/>
        ${circ3(34.6, 25, 1.9, 'g-amber')}</g>`,

    window: `
      ${shd3(24, 44.6, 14)}${rect3(6, 6, 36, 36, 'g-body', 2)}${rect3(9, 9, 30, 30, 'g-water', 1, 'opacity=".35"')}
      <rect class="gapc" x="9" y="9" width="30" height="30"/>
      <rect x="9" y="9" width="14.5" height="30" fill="url(#g-glass)" stroke="url(#g-steel)" stroke-width="1.6"/>
      <g class="leafr" style="transform-origin:39px 24px"><rect x="24.5" y="9" width="14.5" height="30" fill="url(#g-glass)" stroke="url(#g-steel)" stroke-width="1.6"/>${rect3(26.5, 22, 1.8, 5, 'g-steel', .9)}</g>
      ${shine3('M12 13l7-3', 1.4, .8)}`,

    garage: `
      <clipPath id="tk3-gar"><rect x="9" y="20" width="30" height="24"/></clipPath>
      ${shd3(24, 44.6, 20)}${poly3('2,17.5 24,5 46,17.5', 'g-side')}${rect3(5, 16, 38, 28.4, 'g-body', 1)}${rect3(9, 20, 30, 24, 'g-ds', 1)}
      <g clip-path="url(#tk3-gar)"><g class="gdoor">
        ${rect3(9, 20, 30, 6.2, 'g-steel', .6)}${rect3(9, 26.2, 30, 6.2, 'g-steel', .6)}${rect3(9, 32.4, 30, 6.2, 'g-steel', .6)}${rect3(9, 38.6, 30, 6.2, 'g-steel', .6)}
      </g></g>`,

    blind: `
      ${shd3(24, 44.6, 14)}${rect3(6, 9, 36, 34, 'g-water', 1, 'opacity=".35"')}${rect3(6, 3.5, 36, 5.5, 'g-steel', 2)}
      <g class="slats" style="transform-origin:24px 9px">
        ${[0, 1, 2, 3, 4].map((i) => rect3(7.5, 9 + i * 5.4, 33, 4.6, 'g-body', 1)).join('')}
      </g>
      <path d="M40 9v12" stroke="#8a93a1" stroke-width="1" />${circ3(40, 22, 1.3, 'g-sphere')}`,

    lock: `
      ${shd3(24, 44.6, 12)}
      <path class="shackle" d="M16.5 22v-6.5a7.5 7.5 0 0 1 15 0V22" fill="none" stroke="url(#g-steel)" stroke-width="3.8" stroke-linecap="round" style="transform-origin:31.5px 22px"/>
      ${rect3(10, 22, 28, 21, 'g-dark', 4.5)}
      <g class="fx"><rect x="10" y="22" width="28" height="21" rx="4.5" ${f3('g-amber')} opacity=".95"/></g>
      ${circ3(24, 30.5, 3, 'g-body')}${rect3(23, 31.5, 2, 6, 'g-body', .8)}${shine3('M13 25.5h9', 1.4, .6)}`,

    motion: `
      ${shd3(15, 44, 10)}${ell3(15, 40, 9.5, 3, 'g-steel')}${circ3(15, 30, 9.6, 'g-sphere')}
      ${circ3(15, 30, 4, 'g-ds')}${lit3('circle', 'cx="15" cy="30" r="2"', 'g-amber')}${shine3('M9 25a8 8 0 0 1 5-3.6', 1.5, .8)}
      <g class="fx">
        <path class="acs wv" d="M27 23q5 7 0 14" style="animation-delay:0s"/>
        <path class="acs wv" d="M32 18q9 12 0 24" style="animation-delay:.3s"/>
        <path class="acs wv" d="M37 13q13 17 0 34" style="animation-delay:.6s"/>
      </g>`,

    presence: `
      ${shd3(24, 44.6, 12)}
      ${lit3('path', 'd="M11.5 41a12.5 12.5 0 0 1 25 0Z"', 'g-amber')}${lit3('circle', 'cx="24" cy="15" r="6.2"', 'g-amber')}
      ${shine3('M15 33a9 9 0 0 1 5-5', 1.6, .55)}
      <g class="fx">
        <circle class="acs ping" cx="24" cy="27" r="14" style="transform-origin:24px 27px"/>
        <circle class="acs ping" cx="24" cy="27" r="14" style="transform-origin:24px 27px;animation-delay:.8s"/>
      </g>`,

    smoke: `
      ${shd3(24, 40, 17, 3)}${cyl3(24, 18, 34, 12, 'g-cyl', 'g-top')}${ell3(24, 18, 12.5, 4, 'g-ds')}
      <g fill="#6c7584"><circle cx="19" cy="18" r=".8"/><circle cx="24" cy="18.6" r=".8"/><circle cx="29" cy="18" r=".8"/><circle cx="21.5" cy="16.8" r=".7"/><circle cx="26.5" cy="16.8" r=".7"/></g>
      ${lit3('circle', 'cx="34" cy="26.5" r="1.5"', 'g-red', 'blinkled')}${shine3('M10 27v-6', 1.4, .6)}
      <g class="fx"><circle class="acs ping" cx="24" cy="22" r="13" style="transform-origin:24px 22px"/><g class="rise"><path class="acs" d="M24 11q4-3 0-6"/></g></g>`,

    leak: `
      ${shd3(24, 44.4, 13, 2.6)}
      <g class="fx"><ellipse cx="24" cy="41.5" rx="15" ry="3.4" fill="url(#g-water)" opacity=".7"/></g>
      <g class="dripf">
        <path d="M24 4s-9 11-9 17.5a9 9 0 0 0 18 0C33 15 24 4 24 4Z" ${f3('g-off')} ${OL}/>
        <path class="fx" d="M24 4s-9 11-9 17.5a9 9 0 0 0 18 0C33 15 24 4 24 4Z" fill="url(#g-water)" stroke="rgba(2,100,160,.7)" stroke-width=".8"/>
        ${shine3('M19.5 20.5a5 5 0 0 0 3 4.8', 1.7, .8)}
      </g>
      <g class="fx"><ellipse class="acs ping" cx="24" cy="41.5" rx="10" ry="2.6" style="transform-origin:24px 41.5px"/></g>`,

    camera: `
      ${shd3(20, 44.6, 14)}${rect3(7, 34, 12, 3.2, 'g-steel', 1.2)}<path d="M15 23.5v7l-3 3.5" fill="none" stroke="url(#g-steel)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="4" y="9" width="29" height="15.5" rx="6" ${f3('g-cylh')} ${OL}/>${rect3(4, 8, 30, 4.6, 'g-steel', 2.3)}
      ${ell3(33, 16.8, 4.2, 7.6, 'g-ds')}${lit3('ellipse', 'cx="33" cy="16.8" rx="2.1" ry="3.7"', 'g-cool')}
      <circle class="rec" cx="10" cy="18" r="1.7"/>${shine3('M8 14.5h16', 1.3, .6)}
      <g class="fx"><path class="scan cmcone" d="M37 17L47 9V26Z" style="fill:#4fc3f7;opacity:.35;transform-origin:37px 17px"/></g>`,

    doorbell: `
      ${shd3(24, 44.6, 11)}${box3(13, 4, 20, 38, 4, 3, { front: 'g-body', rx: 4 })}
      ${circ3(23, 13, 3.6, 'g-steel')}${lit3('circle', 'cx="23" cy="13" r="2.2"', 'g-cool')}
      ${circ3(23, 30, 7.4, 'g-steel')}${circ3(23, 30, 6, 'g-dark')}<g class="bell" style="transform-origin:23px 30px">${lit3('circle', 'cx="23" cy="30" r="4.6"', 'g-amber')}</g>
      <g class="fx"><circle class="acs ping" cx="23" cy="30" r="9" style="transform-origin:23px 30px"/><path class="acs flick" d="M6 25q-2.5 5 0 10M42 25q2.5 5 0 10"/></g>
      ${shine3('M15.5 8v26', 1.2, .55)}`,

    alarm: `
      ${shd3(24, 44.6, 15)}${rect3(7, 35, 34, 5.5, 'g-steel', 2)}
      <path d="M11 35a13 13 0 0 1 26 0Z" ${f3('g-off')} ${OL}/>
      <path class="fx" d="M11 35a13 13 0 0 1 26 0Z" ${f3('g-red')}/>
      ${shine3('M15 31a9 9 0 0 1 6-7', 1.8, .8)}
      <g class="fx flick"><path class="acs" d="M24 18v-6M11.5 21l-4-4M36.5 21l4-4M6 29H2.5M45.5 29H42" style="stroke-width:2.2"/></g>`,

    router: `
      ${shd3(24, 44.6, 17)}${box3(5, 29, 34, 10, 5, 3, { rx: 2.5 })}
      <rect x="10" y="17" width="3" height="12" rx="1.4" ${f3('g-dark')} ${OL}/><rect x="31" y="17" width="3" height="12" rx="1.4" ${f3('g-dark')} ${OL}/>
      ${lit3('circle', 'cx="12" cy="34" r="1.5"', 'g-green')}${lit3('circle', 'cx="18" cy="34" r="1.5"', 'g-green', 'l2')}${lit3('circle', 'cx="24" cy="34" r="1.5"', 'g-green', 'l3')}
      ${shine3('M8 31h26', 1.2, .6)}
      <g class="fx">
        <path class="acs wf" d="M18.5 19.5a8 8 0 0 1 11 0" style="animation-delay:0s"/>
        <path class="acs wf" d="M14.5 15.5a13.5 13.5 0 0 1 19 0" style="animation-delay:.25s"/>
        <path class="acs wf" d="M10.5 11.5a19 19 0 0 1 27 0" style="animation-delay:.5s"/>
      </g>`,

    vacuum: `
      ${shd3(24, 41, 16, 3.4)}
      <g class="vac" style="transform-origin:24px 22px">
        ${circ3(24, 22, 16, 'g-body')}<circle cx="24" cy="22" r="15.4" fill="none" stroke="#3a4150" stroke-width="2" stroke-dasharray="38 59" transform="rotate(200 24 22)"/>
        ${circ3(24, 22, 11.6, 'g-top')}${circ3(24, 17, 3.6, 'g-dark')}${lit3('circle', 'cx="24" cy="27.5" r="2.4"', 'g-green')}
        <g class="spin" style="transform-origin:34px 31px"><path d="M34 27.5v7M30.5 31h7" stroke="#3a4150" stroke-width="1.8" stroke-linecap="round"/></g>
        ${shine3('M12 17a13 13 0 0 1 9-7', 1.6, .8)}
      </g>
      <g class="fx"><path class="acs dash" d="M3 45h42" style="stroke-dasharray:3 3;stroke-width:1.6"/></g>`,

    /* ---------------- environment ---------------- */
    weather: `
      <mask id="tk3-wmask" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
        <rect width="48" height="48" fill="#fff"/><path class="mk" d="${CLOUD}" style="fill:#000;stroke:#000;stroke-width:5"/>
      </mask>
      <g mask="url(#tk3-wmask)"><g class="wl sunl" style="transform-origin:24px 24px">
        <g class="spin slow rays" style="transform-origin:24px 24px"><path d="M24 4.5v4M24 39.5v4M4.5 24h4M39.5 24h4M10.2 10.2l2.8 2.8M35 35l2.8 2.8M37.8 10.2L35 13M13 35l-2.8 2.8" stroke="#ffb020" stroke-width="2.2" stroke-linecap="round"/></g>
        <circle cx="24" cy="24" r="9" fill="#ffc83d" opacity=".35" style="filter:blur(4px)"/>${circ3(24, 24, 8.6, 'g-amber')}${shine3('M18.5 20a6.5 6.5 0 0 1 4-3', 1.6, .8)}
      </g></g>
      <g class="wl moonl"><path d="M31 9a14 14 0 1 0 9 24A11 11 0 0 1 31 9Z" ${f3('g-body')} ${OL}/><circle class="fl tw1" cx="38" cy="10" r="1.3"/><circle class="fl tw2" cx="42" cy="18" r="1"/></g>
      <g class="wl cloudl"><path d="${CLOUD}" ${f3('g-cloud')} stroke="rgba(120,135,160,.55)" stroke-width=".8"/>${shine3('M15.5 26.5a4.6 4.6 0 0 1 1.5-7', 1.6, .85)}</g>
      <g class="wl rainl"><path class="rn" d="M18 34l-1.6 5" stroke="#4fc3f7" stroke-width="2.2" stroke-linecap="round" style="animation-delay:0s"/><path class="rn" d="M25 34l-1.6 5" stroke="#4fc3f7" stroke-width="2.2" stroke-linecap="round" style="animation-delay:.35s"/><path class="rn" d="M32 34l-1.6 5" stroke="#4fc3f7" stroke-width="2.2" stroke-linecap="round" style="animation-delay:.7s"/></g>
      <g class="wl snowl"><circle class="sn" cx="18" cy="36" r="1.6" ${f3('g-sphere')} style="animation-delay:0s"/><circle class="sn" cx="25" cy="38" r="1.6" ${f3('g-sphere')} style="animation-delay:.6s"/><circle class="sn" cx="32" cy="36" r="1.6" ${f3('g-sphere')} style="animation-delay:1.2s"/></g>
      <g class="wl boltl"><path class="zapw" d="M27 30l-5 8h4l-2 7 7-10h-4.5Z" ${f3('g-amber')} ${OL}/></g>
      <g class="wl fogl"><path class="fogln" d="M8 36h30M12 41h28M8 46h22" stroke="#9aa8bc" stroke-width="2.4" stroke-linecap="round"/></g>
      <g class="wl windl"><path class="windln" d="M6 37h22a3.5 3.5 0 1 0-3.5-3.5M6 43h30a3.5 3.5 0 1 1-3.5 3.5" fill="none" stroke="#9aa8bc" stroke-width="2.2" stroke-linecap="round"/></g>`,

    temperature: `
      ${shd3(24, 44.6, 9)}
      <path d="M20 10a4 4 0 0 1 8 0V29.07A8 8 0 1 1 20 29.07Z" fill="url(#g-glass)" stroke="rgba(120,130,145,.9)" stroke-width="1.2"/>
      <circle cx="24" cy="36" r="5.2" style="fill:var(--lvlc,#ef5350);transition:fill .4s"/>
      <rect x="22.4" y="12" width="3.2" height="24" rx="1.6" style="transform-origin:24px 36px;transform:scaleY(var(--lvl,.5));fill:var(--lvlc,#ef5350);transition:transform .6s,fill .4s"/>
      <circle cx="22.4" cy="34.6" r="1.4" fill="#fff" opacity=".7"/>${shine3('M21.4 11v14', 1.2, .8)}
      <path d="M32 10h4M32 16h3M32 22h4M32 28h3" stroke="#8a93a1" stroke-width="1.4" stroke-linecap="round"/>`,

    humidity: `
      <clipPath id="tk3-hum"><path d="${DROPLET}"/></clipPath>
      ${shd3(24, 44.6, 11)}
      <path d="${DROPLET}" fill="url(#g-glass)" stroke="rgba(120,130,145,.9)" stroke-width="1.2"/>
      <g clip-path="url(#tk3-hum)"><rect x="8" y="4" width="32" height="40" fill="url(#g-water)" style="transform-origin:24px 44px;transform:scaleY(var(--lvl,.5));transition:transform .6s"/></g>
      ${shine3('M16.5 28.5a8 8 0 0 0 4.5 7', 1.8, .85)}`,

    gauge: `
      ${shd3(24, 44.6, 15)}${circ3(24, 25, 19, 'g-steel')}${circ3(24, 25, 15.5, 'g-dark')}
      <path class="acs" d="M12.5 33a12.5 12.5 0 0 1 23 0" style="stroke-width:2.4"/>
      <path d="M24 12.5v3M12 19l2.2 2.2M36 19l-2.2 2.2" stroke="#8a93a1" stroke-width="1.4" stroke-linecap="round"/>
      <g class="ndl" style="transform-origin:24px 29px;transform:rotate(calc(var(--lvl,.5) * 180deg - 90deg));transition:transform .7s"><path d="M24 29L24 15.5" stroke="#ef5350" stroke-width="2" stroke-linecap="round"/></g>
      ${circ3(24, 29, 3, 'g-sphere')}${shine3('M9.5 17a16 16 0 0 1 11-8', 1.6, .55)}`,
  };

  /* ------------------------------------------------------------- detection */
  // Name keywords. First match wins, so order matters ("TV Socket" is a socket, "Water heater" a geyser).
  const KEYWORDS = [
    ['socket',     /socket|plug|extension|outlet|power ?strip/],
    ['ev',         /\bev\b|wallbox|car charger|vehicle charger|tesla/],
    ['fence',      /fence|energi[sz]er/],
    ['solar',      /solar|\bpv\b|photovoltaic/],
    ['battery',    /battery|lithium|powerwall|power ?bank|\bsoc\b|\bess\b/],
    ['inverter',   /inverter|charge controller|mppt/],
    ['dishwasher', /dishwasher/],
    ['dryer',      /dryer|tumble/],
    ['freezer',    /freezer/],
    ['fridge',     /fridge|refrigerator/],
    ['washer',     /washing|washer|laundry/],
    ['sewing',     /sewing/],
    ['blender',    /blender|juicer/],
    ['kettle',     /kettle/],
    ['vacuum',     /vacuum|roomba|roborock|dreame|ecovacs|robovac|\brobo\b/],
    ['camera',     /camera|cctv|\bcam\b|ipcam|webcam/],
    ['doorbell',   /doorbell/],
    ['lock',       /\block\b|deadbolt/],
    ['garage',     /garage|gate opener/],
    ['blind',      /blind|curtain|shutter|shade|awning/],
    ['motion',     /motion|\bpir\b|movement/],
    ['presence',   /presence|occupancy|mmwave|\bperson\b|someone/],
    ['door',       /\bdoor\b/],
    ['window',     /window/],
    ['smoke',      /smoke|fire alarm|\bgas\b|carbon monoxide|\bco\b/],
    ['leak',       /leak|flood sensor|moisture|water sensor/],
    ['geyser',     /geyser|water heater|boiler|immersion/],
    ['heater',     /heater|heating|radiator/],
    ['ac',         /\bac\b|a\/c|air ?con|cooler|heat ?pump/],
    ['pump',       /pump|borehole|booster/],
    ['thermostat', /thermostat|ecobee|tado/],
    ['purifier',   /purifier|air quality|humidifier/],
    ['tv',         /\btv\b|\wtv\b|television|projector/],
    ['speaker',    /speaker|sonos|alexa|\becho\b|homepod|google home|nest mini|soundbar/],
    ['router',     /router|wi-?fi|modem|gateway|access point|mesh/],
    ['weather',    /weather|forecast/],
    ['temperature',/temperature|thermometer|\btemp\b/],
    ['humidity',   /humidity|hygrometer/],
    ['alarm',      /alarm|siren/],
    ['floodlight', /(security|flood|outside|outdoor|garden|gate|yard).*(light|lamp)|spot ?light|floodlight/],
    ['fan',        /\bfan\b|extractor|ventilat|exhaust|blower/],
    ['bulb',       /light|lamp|bulb|lantern|chandelier/],
  ];
  const DEVICE_CLASS = {
    door: 'door', opening: 'door', garage_door: 'garage', gate: 'garage', window: 'window',
    motion: 'motion', moving: 'motion', vibration: 'motion', occupancy: 'presence', presence: 'presence',
    smoke: 'smoke', gas: 'smoke', carbon_monoxide: 'smoke', moisture: 'leak', connectivity: 'router',
    battery: 'battery', battery_charging: 'battery', lock: 'lock', tamper: 'alarm', safety: 'alarm', problem: 'alarm',
    temperature: 'temperature', humidity: 'humidity', blind: 'blind', curtain: 'blind', shade: 'blind', shutter: 'blind', awning: 'blind', damper: 'blind',
    pm25: 'purifier', pm10: 'purifier', aqi: 'purifier', volatile_organic_compounds: 'purifier',
    power: 'inverter', energy: 'inverter', voltage: 'inverter', current: 'inverter', apparent_power: 'inverter', speaker: 'speaker', outlet: 'socket',
  };
  const CLASS_FIRST = new Set(['binary_sensor', 'cover', 'weather', 'camera', 'vacuum', 'lock', 'alarm_control_panel', 'water_heater', 'person', 'device_tracker', 'siren']);
  const DOMAIN_ICON = {
    light: 'bulb', fan: 'fan', weather: 'weather', camera: 'camera', vacuum: 'vacuum', lock: 'lock', alarm_control_panel: 'alarm', siren: 'alarm',
    water_heater: 'geyser', person: 'presence', device_tracker: 'presence', humidifier: 'purifier', cover: 'blind', media_player: 'tv',
    binary_sensor: 'gauge', sensor: 'gauge',
  };

  const detectIcon = (cfg, st) => {
    if (cfg.icon && ICONS[cfg.icon]) return cfg.icon;
    const [domain, obj = ''] = (cfg.entity || '').split('.');
    const a = st?.attributes || {};
    const dc = a.device_class;
    const name = `${cfg.name || ''} ${a.friendly_name || ''} ${obj.replace(/_/g, ' ')}`.toLowerCase();
    const byName = () => { for (const [t, re] of KEYWORDS) if (re.test(name)) return t; return null; };
    if (domain === 'sensor') {
      if (dc === 'temperature' || dc === 'humidity') return DEVICE_CLASS[dc];
      return byName() || DEVICE_CLASS[dc] || 'gauge';
    }
    if (domain === 'cover') {
      const t = byName(); if (t === 'garage' || t === 'blind') return t;
      return DEVICE_CLASS[dc] || 'blind';
    }
    if (CLASS_FIRST.has(domain)) {
      if (DEVICE_CLASS[dc]) return DEVICE_CLASS[dc];
      if (domain === 'binary_sensor') return byName() || 'gauge';
      if (domain === 'device_tracker') return byName() === 'router' ? 'router' : 'presence';
      return DOMAIN_ICON[domain] || byName() || 'gauge';
    }
    const t = byName(); if (t) return t;
    if (domain === 'climate') return (a.hvac_modes || []).includes('cool') ? 'ac' : 'heater';
    if (domain === 'media_player') return dc === 'speaker' ? 'speaker' : 'tv';
    if (DEVICE_CLASS[dc] === 'socket') return 'socket';
    return DOMAIN_ICON[domain] || 'switch';
  };

  /* ----------------------------------------------------------------- state */
  const OFF_STATES = new Set(['off', 'closed', 'idle', 'standby', 'paused', 'locked', 'none', 'not_home', 'disarmed', 'docked']);
  const ALERT_STATES = new Set(['error', 'problem', 'jammed', 'triggered', 'fault', 'alarm']);
  const ALWAYS_ON = new Set(['weather', 'camera', 'temperature', 'humidity', 'gauge']);
  const TOGGLE_DOMAINS = new Set(['light', 'switch', 'fan', 'input_boolean', 'climate', 'media_player', 'humidifier', 'automation']);
  const isUnavail = (st) => !st || st.state === 'unavailable' || st.state === 'unknown';
  const isOn = (st) => {
    if (isUnavail(st)) return false;
    const s = String(st.state).toLowerCase();
    if (OFF_STATES.has(s)) return false;
    if (s !== '' && !isNaN(Number(s))) return Number(s) > 0;
    return true;
  };
  const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ----------------------------------------------------------------- style */
  const STYLE = `
  :host{display:block;--c-cool:#4fc3f7;--c-hot:#ff7043;--c-ok:#66bb6a;--c-bad:#ef5350}
  /* resolved on ha-card AND each row, so a card-level or row-level --tk-* override is picked up */
  ha-card,.row{
    --c-body:var(--tk-body,var(--primary-text-color,#e8eaed));
    --c-off:var(--tk-off,var(--state-inactive-color,var(--disabled-text-color,#8c929b)));
    --c-on:var(--tk-accent,#ffb020);}
  *{box-sizing:border-box}
  .hd{display:flex;align-items:center;justify-content:space-between;padding:14px 14px 4px 16px}
  .title{font-size:20px;font-weight:400;color:var(--primary-text-color,#e8eaed)}
  .list{padding:4px 0 8px}
  .row{display:flex;align-items:center;gap:12px;padding:4px 14px;min-height:43px;-webkit-tap-highlight-color:transparent}
  .ico{width:var(--tk-size,34px);height:var(--tk-size,34px);flex:none;cursor:pointer}
  .ico svg{width:100%;height:100%;display:block;overflow:visible}
  .txt{flex:1;min-width:0;cursor:pointer}
  .nm{font-size:14px;color:var(--primary-text-color,#e8eaed);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .sub{font-size:12px;color:var(--secondary-text-color,#9aa0a6);white-space:nowrap}
  .sub:empty{display:none}
  .stt{font-size:13px;color:var(--secondary-text-color,#9aa0a6);white-space:nowrap}
  .row.tile{flex-direction:column;justify-content:center;text-align:center;padding:16px 12px 14px;gap:8px}
  .row.tile .ico{width:var(--tk-size,64px);height:var(--tk-size,64px)}
  .row.tile .txt{flex:none;max-width:100%}
  .row.tile .ctl{display:none}
  .row.icon{justify-content:center;padding:12px}
  .row.icon .ico{width:var(--tk-size,52px);height:var(--tk-size,52px)}
  .row.icon .txt,.row.icon .ctl{display:none}
  .unavail .ico{opacity:.35;filter:grayscale(1)}
  .unavail .nm{opacity:.6}
  .unavail .sw{opacity:.35;pointer-events:none}
  .row.alert,.row.t-smoke,.row.t-leak,.row.t-alarm{--c-on:var(--c-bad)}
  .row.t-leak{--c-on:var(--c-bad)}

  .sw{appearance:none;border:0;padding:0;margin:0;width:38px;height:20px;border-radius:10px;position:relative;flex:none;cursor:pointer;
      background:rgba(127,127,127,.32);transition:background .25s}
  .sw span{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .25s,background .25s;box-shadow:0 1px 3px rgba(0,0,0,.4)}
  .sw.on{background:rgba(255,176,32,.45);background:color-mix(in srgb,var(--c-on) 45%,transparent)}
  .sw.on span{transform:translateX(18px);background:var(--c-on)}
  .sw:focus-visible{outline:2px solid var(--c-on);outline-offset:2px}

  /* ---- svg building blocks ---- */
  svg .ln{fill:none;stroke:var(--c-body);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  svg .fl{fill:var(--c-body)}
  svg .soft{fill:var(--c-body);fill-opacity:.1}
  svg .soft.ln{stroke:var(--c-body)}
  svg .acc,svg .htf,svg .clf{transition:fill .35s}
  svg .acc{fill:var(--c-off)} .on svg .acc{fill:var(--c-on)}
  svg .htf{fill:var(--c-off)} .on svg .htf{fill:var(--c-hot)}
  svg .clf{fill:var(--c-off)} .on svg .clf{fill:var(--c-cool)}
  svg .acs,svg .hts,svg .cls{fill:none;stroke:var(--c-off);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:stroke .35s}
  .on svg .acs{stroke:var(--c-on)} .on svg .hts{stroke:var(--c-hot)} .on svg .cls{stroke:var(--c-cool)}
  svg .hts{stroke:var(--c-hot)}
  svg .steam{fill:none;stroke:var(--c-body);stroke-opacity:.7;stroke-width:2;stroke-linecap:round}
  svg .fx{opacity:0;transition:opacity .4s}
  .on svg .fx{opacity:1}
  svg .led{fill:var(--c-off);fill-opacity:.55;transition:fill .3s}
  .on svg .led{fill:var(--c-ok);fill-opacity:1;filter:drop-shadow(0 0 2px var(--c-ok))}
  .t-smoke.on svg .led,.t-leak.on svg .led,.t-alarm.on svg .led,.alert svg .led{fill:var(--c-bad);filter:drop-shadow(0 0 2px var(--c-bad))}
  svg .okring{fill:none;stroke:var(--c-ok);stroke-width:1.2}
  svg .glass{fill:var(--c-body);fill-opacity:.1;stroke:var(--c-body);stroke-width:2;stroke-linejoin:round;transition:all .35s}
  .on svg .glass{fill:var(--glow,var(--c-on));fill-opacity:.9;stroke:var(--glow,var(--c-on))}
  svg .fil{fill:none;stroke:var(--c-off);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  .on svg .fil{stroke:#fff}
  svg .scr{fill:var(--c-body);fill-opacity:.08}
  svg .jar{fill:var(--c-body);fill-opacity:.08;stroke:var(--c-body);stroke-width:2;stroke-linejoin:round}
  svg .knob{fill:var(--c-off);transition:transform .3s,fill .3s}
  .on svg .knob{fill:var(--c-on);transform:translateY(-12px)}
  svg .ln-c{stroke:var(--c-body);stroke-width:2;stroke-linejoin:round}

  /* ---- state-driven shapes (transitions, not loops) ---- */
  svg .leaf{transition:transform .55s ease} .on svg .leaf{transform:scaleX(.28) skewY(-6deg)}
  svg .leafr{transition:transform .55s ease} .on svg .leafr{transform:scaleX(.28) skewY(8deg)}
  svg .gap{fill:var(--c-on);fill-opacity:0;transition:fill-opacity .5s} .on svg .gap{fill-opacity:.4}
  svg .gapc{fill:var(--c-cool);fill-opacity:0;transition:fill-opacity .5s} .on svg .gapc{fill-opacity:.3}
  svg .gdoor{transition:transform .7s ease} .on svg .gdoor{transform:translateY(-23px)}
  svg .slats{transition:transform .7s ease} .on svg .slats{transform:scaleY(.26)}
  svg .shackle{transition:transform .45s ease} .on svg .shackle{transform:translateY(-4px) rotate(-32deg)}
  svg .chgfx{opacity:0;transition:opacity .3s} .chg svg .chgfx{opacity:1;animation:tk-zap 1.6s linear infinite}
  .low svg .lvl{animation:tk-flick 1s steps(2) infinite}
  svg .rec{fill:var(--c-off);fill-opacity:.55} .on svg .rec{fill:#ef5350;fill-opacity:1;filter:drop-shadow(0 0 2px #ef5350);animation:tk-flick 1.4s steps(2) infinite}
  svg .arcp{transition:stroke .4s}

  /* ---- 3D style ---- */
  svg .shd{fill:#000;opacity:.3;filter:blur(1.2px)}
  svg .swd{transition:opacity .3s} .on svg .swd{opacity:0}
  .s3d .ico svg{filter:drop-shadow(0 1px 1.2px rgba(0,0,0,.28))}

  /* ---- weather layers ---- */
  svg .wl{opacity:0;transition:opacity .35s,transform .35s}
  svg .sunl{transform-origin:24px 24px}
  .w-sunny .sunl,.w-partlycloudy .sunl,.w-exceptional .sunl{opacity:1}
  .w-clear-night .moonl{opacity:1}
  .w-cloudy .cloudl,.w-partlycloudy .cloudl,.w-rainy .cloudl,.w-pouring .cloudl,.w-snowy .cloudl,.w-snowy-rainy .cloudl,
  .w-lightning .cloudl,.w-lightning-rainy .cloudl,.w-hail .cloudl,.w-windy .cloudl,.w-windy-variant .cloudl,.w-fog .cloudl{opacity:1}
  .w-rainy .rainl,.w-pouring .rainl,.w-snowy-rainy .rainl,.w-lightning-rainy .rainl{opacity:1}
  .w-snowy .snowl,.w-snowy-rainy .snowl,.w-hail .snowl{opacity:1}
  .w-lightning .boltl,.w-lightning-rainy .boltl,.w-exceptional .boltl{opacity:1}
  .w-fog .fogl{opacity:1}
  .w-windy .windl,.w-windy-variant .windl{opacity:1}
  .w-partlycloudy .sunl{transform:translate(-8px,-8px) scale(.72)}
  .w-cloudy .cloudl,.w-partlycloudy .cloudl,.w-windy .cloudl,.w-windy-variant .cloudl{transform:translateY(-3px)}
  .w-fog .cloudl{transform:translateY(-5px)}
  svg .mk{opacity:0}
  .w-partlycloudy .mk{opacity:1}
  .w-partlycloudy .mk{transform:translateY(-3px)}
  .w-windy .windl,.w-windy-variant .windl{transform:translateY(-3px)}

  /* ---- animations (only while .on) ---- */
  .on svg .spin{animation:tk-spin var(--spin,1.1s) linear infinite}
  .on svg .spin.slow{animation-duration:14s}
  .on svg .drum{animation:tk-spin 2.4s linear infinite}
  .on svg .blend{animation:tk-spin .3s linear infinite}
  .on svg .snow{animation:tk-spin 7s linear infinite}
  .on svg .glow,.on svg .beam{animation:tk-breathe 3.2s ease-in-out infinite}
  .on svg .rise{animation:tk-rise 1.8s ease-in-out infinite}
  .on svg .fall{animation:tk-fall 1.9s ease-in-out infinite}
  .on svg .wave{animation:tk-slide 1.3s linear infinite}
  .on svg .needle{animation:tk-bob .45s ease-in-out infinite}
  .on svg .dash{animation:tk-dash .45s linear infinite}
  .on svg .flap{animation:tk-flap 3.5s ease-in-out infinite}
  .on svg .ping{animation:tk-ping 1.6s ease-out infinite}
  .on svg .bolt,.on svg .zapw{animation:tk-zap 1.3s linear infinite}
  .on svg .flick{animation:tk-flick .9s steps(2) infinite}
  .on svg .drop{animation:tk-drop 1.2s linear infinite}
  .on svg .bub{animation:tk-bub 1.1s ease-in infinite}
  .on svg .b1{animation:tk-b1 5s ease-in-out infinite alternate}
  .on svg .b2{animation:tk-b2 6s ease-in-out infinite alternate}
  .on svg .b3{animation:tk-b3 4.5s ease-in-out infinite alternate}
  .on svg .tw1{animation:tk-tw 2.2s ease-in-out infinite}
  .on svg .tw2{animation:tk-tw 2.2s ease-in-out .7s infinite}
  .on svg .tw3{animation:tk-tw 2.2s ease-in-out 1.4s infinite}
  .on svg .bar{animation:tk-charge 2.4s ease-in-out infinite;transform-origin:29px 33px}
  .on svg .vac{animation:tk-wob 3.2s ease-in-out infinite}
  .on svg .arm{animation:tk-persp 1.5s ease-in-out infinite}
  .on svg .pulse{animation:tk-pulse .7s ease-in-out infinite}
  .on svg .wv{animation:tk-wv 1.5s ease-in-out infinite}
  .on svg .wf{animation:tk-wf 1.6s ease-in-out infinite}
  .on svg .l2{animation:tk-flick 1.1s steps(2) infinite}
  .on svg .l3{animation:tk-flick 1.7s steps(2) infinite}
  .on svg .blinkled{animation:tk-flick 1.2s steps(2) infinite}
  .on svg .cmcone{animation:tk-sweep 4.5s ease-in-out infinite alternate}
  .on svg .shim{animation:tk-shim 2.8s ease-in-out infinite}
  .on svg .coil,.on svg .arcp{animation:tk-breathe 2.4s ease-in-out infinite}
  .on svg .bell,.on svg .dripf{animation:tk-ring .6s ease-in-out infinite}
  .on svg .dripf{animation:tk-drip 1.6s ease-in infinite}
  .on svg .rn{animation:tk-rain .9s linear infinite}
  .on svg .sn{animation:tk-snow 2.2s linear infinite}
  .on svg .fogln{animation:tk-sway 4s ease-in-out infinite alternate}
  .on svg .windln{animation:tk-sway 2.2s ease-in-out infinite alternate}
  @keyframes tk-spin{to{transform:rotate(360deg)}}
  @keyframes tk-breathe{0%,100%{opacity:.5;transform:scale(.94)}50%{opacity:1;transform:scale(1.06)}}
  @keyframes tk-rise{0%{transform:translateY(7px);opacity:0}30%{opacity:.95}100%{transform:translateY(-6px);opacity:0}}
  @keyframes tk-fall{0%{transform:translateY(-4px);opacity:0}30%{opacity:.95}100%{transform:translateY(9px);opacity:0}}
  @keyframes tk-slide{to{transform:translateX(-12px)}}
  @keyframes tk-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}
  @keyframes tk-dash{to{stroke-dashoffset:-6}}
  @keyframes tk-flap{0%,100%{transform:rotate(0)}50%{transform:rotate(16deg)}}
  @keyframes tk-ping{0%{transform:scale(.45);opacity:.9}100%{transform:scale(1.5);opacity:0}}
  @keyframes tk-zap{0%,100%{opacity:1}6%{opacity:.3}12%{opacity:1}18%{opacity:.4}26%{opacity:1}}
  @keyframes tk-flick{0%{opacity:1}50%{opacity:.25}}
  @keyframes tk-drop{0%{transform:translateX(0);opacity:0}20%{opacity:1}100%{transform:translateX(6px);opacity:0}}
  @keyframes tk-bub{0%{transform:translateY(3px);opacity:0}30%{opacity:.9}100%{transform:translateY(-12px);opacity:0}}
  @keyframes tk-b1{to{transform:translate(10px,6px)}}
  @keyframes tk-b2{to{transform:translate(-9px,-7px)}}
  @keyframes tk-b3{to{transform:translate(-6px,8px)}}
  @keyframes tk-tw{0%,100%{opacity:.2;transform:scale(.6)}50%{opacity:1;transform:scale(1.3)}}
  @keyframes tk-charge{0%{transform:scaleX(.35)}100%{transform:scaleX(1)}}
  @keyframes tk-wob{0%,100%{transform:rotate(-5deg) translateX(-2px)}50%{transform:rotate(5deg) translateX(2px)}}
  @keyframes tk-persp{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.2)}}
  @keyframes tk-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
  @keyframes tk-wv{0%{opacity:0;transform:translateX(-3px)}40%{opacity:1}100%{opacity:0;transform:translateX(3px)}}
  @keyframes tk-wf{0%,100%{opacity:.2}40%{opacity:1}}
  @keyframes tk-sweep{from{transform:rotate(-12deg)}to{transform:rotate(12deg)}}
  @keyframes tk-shim{0%{transform:translateX(0) skewX(-20deg)}100%{transform:translateX(70px) skewX(-20deg)}}
  @keyframes tk-ring{0%,100%{transform:rotate(0)}25%{transform:rotate(-8deg)}75%{transform:rotate(8deg)}}
  @keyframes tk-drip{0%{transform:translateY(-3px);opacity:0}15%{opacity:1}70%{transform:translateY(20px);opacity:1}100%{transform:translateY(22px);opacity:0}}
  @keyframes tk-rain{0%{transform:translate(0,0);opacity:0}25%{opacity:1}100%{transform:translate(-2px,8px);opacity:0}}
  @keyframes tk-snow{0%{transform:translate(0,-2px);opacity:0}25%{opacity:1}100%{transform:translate(3px,9px);opacity:0}}
  @keyframes tk-sway{from{transform:translateX(-3px)}to{transform:translateX(3px)}}
  @media (prefers-reduced-motion:reduce){svg *{animation:none!important}}
  `;

  /* ---------------------------------------------------------------- gestures */
  // tap = click; hold = press for 500 ms without moving. Timers are always cleared (no leaks).
  const bindGestures = (el, onTap, onHold, canHold) => {
    let timer = null, held = false, sx = 0, sy = 0;
    const clear = () => { if (timer) { clearTimeout(timer); timer = null; } };
    el.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      held = false; sx = e.clientX; sy = e.clientY; clear();
      if (canHold()) timer = setTimeout(() => { timer = null; held = true; onHold(); }, 500);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => el.addEventListener(t, clear));
    el.addEventListener('pointermove', (e) => { if (timer && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) clear(); });
    el.addEventListener('click', (e) => {
      if (e.target.closest && e.target.closest('.sw')) return;
      if (held) { held = false; return; }
      onTap();
    });
    el.addEventListener('contextmenu', (e) => { if (canHold()) e.preventDefault(); });
  };

  /* ------------------------------------------------------------------- row */
  class Row {
    constructor(cfg, layout, fire) {
      this.cfg = cfg;
      this.layout = layout;
      this.fire = fire;
      this.type = null;
      this.wcls = null;
      this.domain = (cfg.entity || '').split('.')[0];
      this.toggleable = cfg.show_toggle !== false && TOGGLE_DOMAINS.has(this.domain);
      const el = (this.el = document.createElement('div'));
      this.style3d = cfg.style === '3d';
      el.className = `row ${layout}${this.style3d ? ' s3d' : ''}`;
      if (cfg.accent) el.style.setProperty('--tk-accent', cfg.accent);
      if (cfg.icon_size) el.style.setProperty('--tk-size', `${parseInt(cfg.icon_size, 10)}px`);
      el.innerHTML = `<div class="ico"></div><div class="txt"><div class="nm"></div><div class="sub"></div></div><div class="ctl"></div>`;
      this.icoEl = el.querySelector('.ico');
      this.nmEl = el.querySelector('.nm');
      this.subEl = el.querySelector('.sub');
      const ctl = el.querySelector('.ctl');
      if (this.toggleable) {
        ctl.innerHTML = `<button class="sw" role="switch" aria-checked="false" aria-label="toggle"><span></span></button>`;
        this.swEl = ctl.firstChild;
        this.swEl.addEventListener('click', (e) => { e.stopPropagation(); this.toggle(); });
      } else {
        ctl.innerHTML = `<span class="stt"></span>`;
        this.sttEl = ctl.firstChild;
      }
      // tap/hold on the icon + name (row layout) or on the whole tile (tile / icon layouts)
      const onTap = () => this.runAction(this.tapAction());
      const onHold = () => this.runAction(this.holdAction());
      const canHold = () => this.holdAction().action !== 'none';
      if (layout === 'row') {
        this.icoEl.setAttribute('tabindex', '0');
        this.icoEl.setAttribute('role', 'button');
        this.icoEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(); } });
        bindGestures(this.icoEl, onTap, onHold, canHold);
        bindGestures(el.querySelector('.txt'), onTap, onHold, canHold);
      } else {
        bindGestures(el, onTap, onHold, canHold);
      }
      this.setIcon(detectIcon(cfg, null));
    }
    /* actions: HA-style objects, e.g. {action:'toggle'} — toggle | more-info | navigate | url | perform-action | none */
    tapAction() { return this.cfg.tap_action || { action: this.layout === 'row' || !this.toggleable ? 'more-info' : 'toggle' }; }
    holdAction() { return this.cfg.hold_action || { action: this.layout === 'row' ? 'none' : 'more-info' }; }
    runAction(a) {
      const notify = (err) => this.fire('hass-notification', { message: `Action failed: ${err?.message || err}` });
      switch (a?.action) {
        case 'toggle': this.toggle(); break;
        case 'more-info': this.moreInfo(); break;
        case 'navigate':
          if (a.navigation_path) {
            window.history.pushState(null, '', a.navigation_path);
            window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
          }
          break;
        case 'url':
          if (a.url_path && !/^\s*javascript:/i.test(a.url_path)) window.open(a.url_path, '_blank', 'noopener');
          break;
        case 'perform-action':
        case 'call-service': {
          const svc = a.perform_action || a.service;
          if (!svc || !svc.includes('.') || !this.hass) break;
          const [d, s] = svc.split('.');
          const p = this.hass.callService(d, s, a.data || a.service_data || {}, a.target);
          if (p && p.catch) p.catch(notify);
          break;
        }
        default: break; // 'none'
      }
    }
    setIcon(type) {
      if (type === this.type) return;
      if (this.type) this.el.classList.remove(`t-${this.type}`);
      this.type = type;
      this.el.classList.add(`t-${type}`);
      const src = (this.style3d && ICONS3D[type]) || ICONS[type] || ICONS.switch;
      this.icoEl.innerHTML = `<svg viewBox="0 0 48 48" aria-hidden="true">${src}</svg>`;
    }
    moreInfo() { this.fire('hass-more-info', { entityId: this.cfg.entity }); }
    toggle() {
      if (!this.hass) return;
      const st = this.hass.states[this.cfg.entity];
      if (isUnavail(st)) return;
      const p = this.hass.callService('homeassistant', isOn(st) ? 'turn_off' : 'turn_on', { entity_id: this.cfg.entity });
      if (p && p.catch) p.catch((err) => this.fire('hass-notification', { message: `Could not toggle ${this.cfg.entity}: ${err?.message || err}` }));
    }
    update(hass) {
      this.hass = hass;
      const st = hass.states[this.cfg.entity];
      const a = st?.attributes || {};
      const missing = !st;
      const unavail = isUnavail(st);
      this.setIcon(detectIcon(this.cfg, st));
      const type = this.type;
      const sval = String(st?.state ?? '').toLowerCase();
      const alert = !unavail && ALERT_STATES.has(sval);
      const on = alert || (ALWAYS_ON.has(type) ? !unavail : isOn(st));
      const el = this.el, style = el.style;
      el.classList.toggle('on', on);
      el.classList.toggle('alert', alert);
      el.classList.toggle('unavail', unavail);
      this.nmEl.textContent = this.cfg.name || a.friendly_name || this.cfg.entity;

      const num = parseFloat(st?.state);
      const setVar = (k, v) => (v == null ? style.removeProperty(k) : style.setProperty(k, String(v)));
      // fan speed -> rotation speed
      setVar('--spin', typeof a.percentage === 'number' && a.percentage > 0 ? `${(1.6 - 1.2 * Math.min(a.percentage, 100) / 100).toFixed(2)}s` : null);
      // light colour + brightness -> glow
      setVar('--glow', Array.isArray(a.rgb_color) && on ? `rgb(${a.rgb_color.join(',')})` : null);
      setVar('--bri', typeof a.brightness === 'number' && on ? Math.max(0.4, a.brightness / 255).toFixed(2) : null);
      // climate: heating = warm accent, cooling = cool accent
      setVar('--c-on', a.hvac_action === 'heating' ? 'var(--c-hot)' : a.hvac_action === 'cooling' ? 'var(--c-cool)' : null);

      // level-aware icons
      let lvl = null, lvlc = null, charging = false;
      if (type === 'battery') {
        let v = (st && (a.device_class === 'battery' || a.unit_of_measurement === '%') && isFinite(num)) ? num : a.battery_level;
        if (this.domain === 'binary_sensor') v = sval === 'on' ? 10 : 100; // binary battery sensor: on = low
        if (typeof v === 'number' && isFinite(v)) {
          lvl = clamp(v / 100);
          lvlc = lvl < 0.15 ? 'var(--c-bad)' : lvl < 0.4 ? 'var(--c-on)' : 'var(--c-ok)';
        }
        const ce = this.cfg.charging_entity && hass.states[this.cfg.charging_entity]?.state;
        charging = ['on', 'charging'].includes(String(ce)) || (sval.includes('charging') && !sval.includes('discharging')) || a.battery_charging === true;
      } else if (type === 'temperature' && isFinite(num)) {
        lvl = clamp((num + 10) / 50, 0.08, 1);
        lvlc = num < 15 ? 'var(--c-cool)' : num < 30 ? 'var(--c-ok)' : 'var(--c-hot)';
      } else if (type === 'humidity' && isFinite(num)) {
        lvl = clamp(num / 100, 0.05, 1);
      } else if (type === 'gauge' && isFinite(num) && a.unit_of_measurement === '%') {
        lvl = clamp(num / 100);
      }
      setVar('--lvl', lvl == null ? null : lvl.toFixed(3));
      setVar('--lvlc', lvlc);
      el.classList.toggle('chg', charging);
      el.classList.toggle('low', type === 'battery' && lvl != null && lvl < 0.15 && !charging);

      // weather: pick layers from the state
      if (this.wcls) el.classList.remove(this.wcls);
      this.wcls = type === 'weather' && st ? `w-${sval}` : null;
      if (this.wcls) el.classList.add(this.wcls);

      const pretty = missing ? 'Not found' : hass.formatEntityState ? hass.formatEntityState(st) : String(st.state).replace(/_/g, ' ');
      let text = pretty;
      if (type === 'weather' && a.temperature != null) text = `${a.temperature}${a.temperature_unit || hass.config?.unit_system?.temperature || '°'} · ${pretty}`;
      else if (a.unit_of_measurement && !missing && !hass.formatEntityState) text = `${st.state} ${a.unit_of_measurement}`;
      this.subEl.textContent = unavail || missing ? (missing ? 'Not found' : 'Unavailable') : this.layout === 'tile' ? text : '';
      if (this.swEl) {
        this.swEl.classList.toggle('on', on);
        this.swEl.setAttribute('aria-checked', String(on));
      } else if (this.sttEl) {
        this.sttEl.textContent = unavail ? '' : text;
      }
    }
  }

  const fireFrom = (host) => (type, detail) => host.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail }));
  const cleanEntity = (e) => (typeof e === 'string' ? { entity: e } : { ...e });
  const LIKELY = /^(light|switch|fan|climate|vacuum|lock|camera|cover|weather)\./;
  const pickEntities = (hass, n) => Object.keys(hass?.states || {}).filter((e) => LIKELY.test(e)).slice(0, n);

  /* ------------------------------------------------------- single-entity card */
  class LiviconCard extends HTMLElement {
    static getConfigElement() { return document.createElement('livicon-card-editor'); }
    static getStubConfig(hass) { return { entity: pickEntities(hass, 1)[0] || '', layout: 'row' }; }
    setConfig(config) {
      if (!config || !config.entity) throw new Error('livicon-card: `entity` is required');
      this._config = config;
      if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
      const layout = ['row', 'tile', 'icon'].includes(config.layout) ? config.layout : 'row';
      this.shadowRoot.innerHTML = `<style>${STYLE}</style>${DEFS3D}<ha-card></ha-card>`;
      this._row = new Row(cleanEntity(config), layout, fireFrom(this));
      this.shadowRoot.querySelector('ha-card').appendChild(this._row.el);
      if (this._hass) this._row.update(this._hass);
    }
    set hass(h) { this._hass = h; this._row && this._row.update(h); }
    getCardSize() { return this._config?.layout === 'tile' ? 3 : 1; }
  }

  /* ------------------------------------------------------------- group card */
  class LiviconGroupCard extends HTMLElement {
    static getConfigElement() { return document.createElement('livicon-group-card-editor'); }
    static getStubConfig(hass) { return { title: 'Devices', entities: pickEntities(hass, 3) }; }
    setConfig(config) {
      if (!config || !Array.isArray(config.entities)) throw new Error('livicon-group-card: `entities` list is required');
      this._config = config;
      if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
      const showMaster = config.master_toggle !== false && !!config.title;
      this.shadowRoot.innerHTML = `<style>${STYLE}</style>${DEFS3D}<ha-card>
        ${config.title ? `<div class="hd"><span class="title">${esc(config.title)}</span>${showMaster ? '<button class="sw master" role="switch" aria-checked="false" aria-label="toggle all"><span></span></button>' : ''}</div>` : ''}
        <div class="list"></div></ha-card>`;
      const fire = fireFrom(this);
      this._rows = config.entities.map((e) => {
        const c = cleanEntity(e);
        if (config.accent && !c.accent) c.accent = config.accent;
        if (config.icon_size && !c.icon_size) c.icon_size = config.icon_size;
        if (config.style && !c.style) c.style = config.style;
        if (config.tap_action && !c.tap_action) c.tap_action = config.tap_action;   // group-wide defaults,
        if (config.hold_action && !c.hold_action) c.hold_action = config.hold_action; // per-entity values win
        return new Row(c, 'row', fire);
      });
      const list = this.shadowRoot.querySelector('.list');
      this._rows.forEach((r) => list.appendChild(r.el));
      this._master = this.shadowRoot.querySelector('.master');
      if (this._master && !this._rows.some((r) => r.toggleable)) { this._master.remove(); this._master = null; } // nothing to toggle (all sensors)
      if (config.accent) this.shadowRoot.querySelector('ha-card').style.setProperty('--tk-accent', config.accent);
      if (this._master) this._master.addEventListener('click', () => this._toggleAll());
      if (this._hass) this.hass = this._hass;
    }
    _toggleAll() {
      const h = this._hass; if (!h) return;
      const ids = this._rows.filter((r) => r.toggleable && !isUnavail(h.states[r.cfg.entity])).map((r) => r.cfg.entity);
      if (!ids.length) return;
      const anyOn = ids.some((id) => isOn(h.states[id]));
      const p = h.callService('homeassistant', anyOn ? 'turn_off' : 'turn_on', { entity_id: ids });
      if (p && p.catch) p.catch((err) => fireFrom(this)('hass-notification', { message: `Could not toggle group: ${err?.message || err}` }));
    }
    set hass(h) {
      this._hass = h;
      if (!this._rows) return;
      this._rows.forEach((r) => r.update(h));
      if (this._master) {
        const on = this._rows.some((r) => r.toggleable && isOn(h.states[r.cfg.entity]));
        this._master.classList.toggle('on', on);
        this._master.setAttribute('aria-checked', String(on));
      }
    }
    getCardSize() { return (this._config?.entities?.length || 1) + 1; }
  }

  /* ---------------------------------------------------- visual card editors */
  const ICON_OPTIONS = () => [{ value: '', label: 'Auto-detect (recommended)' }, ...Object.keys(ICONS).sort().map((k) => ({ value: k, label: k }))];
  const LABELS = {
    entity: 'Entity', name: 'Name (optional)', icon: 'Icon type', layout: 'Layout',
    accent: 'Accent colour (optional, e.g. #ffb020)', title: 'Title', master_toggle: 'Master toggle',
    icon_size: 'Icon size in px (optional)', charging_entity: 'Charging entity (battery icons)',
    tap_action: 'Tap action', hold_action: 'Hold action', add: 'Add entity', style: 'Icon style',
  };
  const STYLE_OPTIONS = [{ value: 'flat', label: 'Flat (default)' }, { value: '3d', label: '3D (realistic)' }];
  const computeLabel = (s) => LABELS[s.name] || s.name;
  const actionFields = (tapDefault) => [
    { name: 'tap_action', selector: { ui_action: { default_action: tapDefault } } },
    { name: 'hold_action', selector: { ui_action: { default_action: 'none' } } },
  ];
  // drop empty values so saved YAML stays tidy
  const prune = (o) => {
    const r = {};
    for (const [k, v] of Object.entries(o || {})) {
      if (v === '' || v == null) continue;
      if (typeof v === 'object' && !Array.isArray(v) && !Object.keys(v).length) continue;
      r[k] = v;
    }
    return r;
  };

  class EditorBase extends HTMLElement {
    setConfig(c) {
      const s = JSON.stringify(c);
      this._config = c;
      if (s === this._last) return; // echo of our own change: don't rebuild (keeps input focus)
      this._last = s;
      this._render();
    }
    set hass(h) { this._hass = h; (this._forms || []).forEach((f) => (f.hass = h)); }
    _emit(cfg) {
      this._config = cfg;
      this._last = JSON.stringify(cfg);
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: cfg }, bubbles: true, composed: true }));
    }
    _form(schema, data, onChange) {
      const f = document.createElement('ha-form');
      f.hass = this._hass; f.schema = schema; f.data = data; f.computeLabel = computeLabel;
      f.addEventListener('value-changed', (e) => { e.stopPropagation(); onChange(e.detail.value); });
      (this._forms = this._forms || []).push(f);
      return f;
    }
  }

  class LiviconCardEditor extends EditorBase {
    _render() {
      this._forms = [];
      this.innerHTML = '';
      const schema = [
        { name: 'entity', required: true, selector: { entity: {} } },
        { name: 'name', selector: { text: {} } },
        { type: 'grid', name: '', schema: [
          { name: 'icon', selector: { select: { options: ICON_OPTIONS(), mode: 'dropdown' } } },
          { name: 'layout', selector: { select: { options: ['row', 'tile', 'icon'], mode: 'dropdown' } } },
        ] },
        { name: 'style', selector: { select: { options: STYLE_OPTIONS, mode: 'dropdown' } } },
        ...actionFields('more-info'),
        { name: 'accent', selector: { text: {} } },
        { name: 'icon_size', selector: { number: { min: 16, max: 120, mode: 'box' } } },
      ];
      const c = this._config || {};
      this.appendChild(this._form(schema, { layout: 'row', icon: '', ...c }, (v) =>
        this._emit({ type: c.type || 'custom:livicon-card', ...prune(v) })));
    }
  }

  class LiviconGroupCardEditor extends EditorBase {
    constructor() { super(); this._open = new Set(); }
    _items() { return (this._config?.entities || []).map((e) => (typeof e === 'string' ? { entity: e } : { ...e })); }
    _commit(items, rerender) {
      const ents = items.map((i) => { const p = prune(i); return Object.keys(p).length === 1 && p.entity ? p.entity : p; });
      this._emit({ ...this._config, entities: ents });
      if (rerender) this._render();
    }
    _label(item) {
      const st = this._hass?.states?.[item.entity];
      const real = st?.attributes?.friendly_name || item.entity;
      return item.name ? `${item.name} · ${item.entity}` : real === item.entity ? item.entity : `${real} · ${item.entity}`;
    }
    _reorder(from, to) {
      const items = this._items();
      if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return;
      const order = items.map((_, i) => i);
      const [m] = order.splice(from, 1); order.splice(to, 0, m);
      this._open = new Set([...this._open].map((i) => order.indexOf(i)));
      this._commit(order.map((i) => items[i]), true);
    }
    _remove(idx) {
      const items = this._items(); items.splice(idx, 1);
      this._open = new Set([...this._open].filter((i) => i !== idx).map((i) => (i > idx ? i - 1 : i)));
      this._commit(items, true);
    }
    _render() {
      this._forms = [];
      this.innerHTML = '';
      const c = this._config || {};
      const style = document.createElement('style');
      style.textContent = `
        .it{border:1px solid var(--divider-color,rgba(127,127,127,.35));border-radius:10px;margin:8px 0;padding:0 10px}
        .it.over{outline:2px dashed var(--primary-color,#03a9f4)}
        .it summary{display:flex;align-items:center;gap:8px;padding:8px 0;cursor:pointer;list-style:none}
        .it summary::-webkit-details-marker{display:none}
        .h{cursor:grab;opacity:.6;user-select:none;font-size:18px;padding:0 2px}
        .t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .b button{background:none;border:0;cursor:pointer;color:var(--primary-text-color);font-size:16px;padding:4px 7px;opacity:.75}
        .b button:hover{opacity:1} .b button[disabled]{opacity:.25;cursor:default}
        h4{margin:18px 0 2px;font-weight:500;color:var(--primary-text-color)}
        .hint{font-size:12px;color:var(--secondary-text-color);margin:0 0 6px}`;
      this.appendChild(style);

      // card-level options
      this.appendChild(this._form([
        { name: 'title', selector: { text: {} } },
        { type: 'grid', name: '', schema: [
          { name: 'master_toggle', selector: { boolean: {} } },
          { name: 'icon_size', selector: { number: { min: 16, max: 120, mode: 'box' } } },
        ] },
        { name: 'style', selector: { select: { options: STYLE_OPTIONS, mode: 'dropdown' } } },
        { name: 'accent', selector: { text: {} } },
        ...actionFields('more-info'),
      ], { master_toggle: true, ...c, entities: undefined }, (v) =>
        this._emit({ ...prune({ ...v, type: c.type || 'custom:livicon-group-card' }), entities: c.entities || [] })));

      // entity list
      const h = document.createElement('h4'); h.textContent = 'Entities'; this.appendChild(h);
      const hint = document.createElement('p'); hint.className = 'hint';
      hint.textContent = 'Drag ⠿ or use ↑ ↓ to re-order. Open an entity to rename it, force its icon type or set its own tap/hold action.';
      this.appendChild(hint);
      const items = this._items();
      items.forEach((item, idx) => {
        const det = document.createElement('details'); det.className = 'it';
        det.open = this._open.has(idx);
        det.addEventListener('toggle', () => (det.open ? this._open.add(idx) : this._open.delete(idx)));
        const sum = document.createElement('summary');
        const handle = document.createElement('span'); handle.className = 'h'; handle.textContent = '⠿'; handle.draggable = true; handle.title = 'Drag to re-order';
        const title = document.createElement('span'); title.className = 't'; title.textContent = this._label(item);
        const btns = document.createElement('span'); btns.className = 'b';
        const mkBtn = (txt, tip, fn, disabled) => {
          const b = document.createElement('button'); b.type = 'button'; b.textContent = txt; b.title = tip; b.disabled = !!disabled;
          b.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); fn(); });
          return b;
        };
        btns.append(mkBtn('↑', 'Move up', () => this._reorder(idx, idx - 1), idx === 0), mkBtn('↓', 'Move down', () => this._reorder(idx, idx + 1), idx === items.length - 1), mkBtn('✕', 'Remove', () => this._remove(idx)));
        sum.append(handle, title, btns);
        det.appendChild(sum);
        // drag & drop (handle is the drag source, each row a drop target)
        handle.addEventListener('dragstart', (e) => { this._drag = idx; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(idx)); });
        handle.addEventListener('dragend', () => { this._drag = null; this.querySelectorAll('.it.over').forEach((n) => n.classList.remove('over')); });
        det.addEventListener('dragover', (e) => { if (this._drag != null) { e.preventDefault(); det.classList.add('over'); } });
        det.addEventListener('dragleave', () => det.classList.remove('over'));
        det.addEventListener('drop', (e) => { e.preventDefault(); det.classList.remove('over'); const from = this._drag; this._drag = null; if (from != null) this._reorder(from, idx); });
        // per-entity options
        det.appendChild(this._form([
          { name: 'entity', required: true, selector: { entity: {} } },
          { name: 'name', selector: { text: {} } },
          { name: 'icon', selector: { select: { options: ICON_OPTIONS(), mode: 'dropdown' } } },
          ...actionFields(c.tap_action?.action || 'more-info'),
        ], { icon: '', ...item }, (v) => {
          const all = this._items();
          if (!v.entity) v.entity = all[idx].entity;
          all[idx] = prune(v);
          title.textContent = this._label(all[idx]);
          this._commit(all, false);
        }));
        this.appendChild(det);
      });

      // add
      this.appendChild(this._form([{ name: 'add', selector: { entity: {} } }], { add: '' }, (v) => {
        if (!v.add) return;
        this._open.add(this._items().length);
        this._commit([...this._items(), { entity: v.add }], true);
      }));
    }
  }

  const define = (n, c) => { if (!customElements.get(n)) customElements.define(n, c); };
  define('livicon-card', LiviconCard);
  define('livicon-group-card', LiviconGroupCard);
  define('livicon-card-editor', LiviconCardEditor);
  define('livicon-group-card-editor', LiviconGroupCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push(
    { type: 'livicon-card', name: 'Livicon — Icon', description: 'One device with an animated icon that follows its state.', preview: true },
    { type: 'livicon-group-card', name: 'Livicon — Group', description: 'A titled list of devices with animated icons and a master toggle.', preview: true },
  );
  window.liviconIcons = Object.keys(ICONS);
  console.info(`%c LIVICON %c v${VERSION} — ${Object.keys(ICONS).length} icons`, 'color:#000;background:#ffb020;font-weight:700', 'color:#ffb020');
})();
