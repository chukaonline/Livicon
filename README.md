# Livicon

Animated device icons for Home Assistant dashboards. **44 icons** that follow your entity's state:
fans spin, bulbs glow in the light's real colour, the washer drum turns, the robot vacuum trundles,
solar panels shimmer, the battery fills to its real level, doors swing open, the weather changes with the forecast.
A device that is off sits perfectly still.

One file. No dependencies. Original artwork (MIT). Works with any theme. Two looks: **flat** (default) and realistic **3D** (`style: 3d`).

## Install with HACS

1. HACS → **⋮ → Custom repositories**
2. Repository: `https://github.com/chukaonline/Livicon` · Category: **Dashboard** (called *Plugin* in older HACS)
3. Download **Livicon**, then reload your browser (HACS adds the resource for you).

Cards: `custom:livicon-card` and `custom:livicon-group-card`.

<details><summary>Manual install</summary>

Copy `dist/livicon.js` to `/config/www/`, then **Settings → Dashboards → ⋮ → Resources → Add**:
`/local/livicon.js` as a *JavaScript module*. Reload the browser.
</details>

## Cards

Add them from the card picker (search "Livicon") — both have a visual editor — or use YAML.

### Group card: a titled list with a master toggle

```yaml
type: custom:livicon-group-card
title: Energy
entities:
  - sensor.solar_power
  - sensor.battery_soc
  - entity: switch.ev_charger
    name: Car charger        # optional rename
  - entity: sensor.inverter_output
    icon: inverter           # optional: force an icon
```

| option          | default | notes                                            |
|-----------------|---------|--------------------------------------------------|
| `title`         | –       | header text                                      |
| `entities`      | –       | strings, or `{entity, name, icon, accent}`       |
| `master_toggle` | `true`  | hidden automatically if nothing is toggleable    |
| `accent`        | amber   | any CSS colour                                   |
| `icon_size`     | 34      | px                                               |
| `style`         | flat    | `flat` or `3d` (see below)                       |
| `tap_action`    | more-info | default for every entity (see Actions)         |
| `hold_action`   | none    | default for every entity (see Actions)           |

In the visual editor each entity can be opened to give it its **own name**, force its **icon type** when the
auto-detection guesses wrong, or set its own tap/hold action. Re-order with **drag (⠿)** or the **↑ ↓** buttons.

### Single card

```yaml
type: custom:livicon-card
entity: weather.home
layout: tile        # row (default) | tile | icon
```

Options: `entity`, `name`, `icon`, `layout`, `style`, `accent`, `icon_size`, `show_toggle`, `tap_action`, `hold_action`, and for batteries
`charging_entity` (any entity that is `on`/`charging` while charging — shows a lightning bolt).

### Actions

`tap_action` and `hold_action` (press ~0.5 s) use Home Assistant's standard action objects and are available per card,
per entity, or as group-wide defaults:

| `action`         | extra keys                                   |
|------------------|----------------------------------------------|
| `toggle`         |                                              |
| `more-info`      |                                              |
| `navigate`       | `navigation_path: /lovelace/kitchen`         |
| `url`            | `url_path: https://…`                        |
| `perform-action` | `perform_action: script.turn_on`, `data`, `target` |
| `none`           |                                              |

Defaults: **row** layout — tap opens more-info (the switch on the right toggles), hold does nothing.
**tile / icon** layouts — tap toggles (more-info if the entity can't be toggled), hold opens more-info.

```yaml
- entity: light.hall
  tap_action: { action: toggle }
  hold_action: { action: navigate, navigation_path: /lovelace/lights }
```

## Icons

| Category            | Icons |
|---------------------|-------|
| Lights & switching  | `bulb` `floodlight` `socket` `switch` |
| Climate             | `fan` `heater` `ac` `thermostat` `purifier` `geyser` |
| Kitchen & laundry   | `fridge` `freezer` `washer` `dryer` `dishwasher` `kettle` `blender` `sewing` |
| Water & media       | `pump` `tv` `speaker` |
| Energy              | `solar` `battery` `inverter` `ev` `fence` |
| Security & sensors  | `door` `window` `garage` `blind` `lock` `motion` `presence` `smoke` `leak` `camera` `doorbell` `alarm` `router` |
| Home & environment  | `vacuum` `weather` `temperature` `humidity` `gauge` |

### It picks the icon for you

You rarely need `icon:`. Order of precedence:

1. `icon:` in the card
2. For sensors, covers, locks, cameras, weather, vacuums…: the entity's **`device_class`** and domain
3. The entity's **name** (`Fridge`, `Water Pump`, `Fence Charger`, `FamilyTV`, `Solar`, `Lithium`, …)
4. The domain (`light` → bulb, `climate` → AC or heater, anything else → switch)

Order is deliberate: "TV Socket Left" is a socket, "Bedroom TV" is a TV, "Water heater" is a geyser.
Wrong guess? Set `icon:` for that entity.

### What the icons react to

| Icon / entity              | Reacts to |
|----------------------------|-----------|
| fan                        | `percentage` → rotation speed |
| bulb                       | `rgb_color` glow colour, `brightness` |
| battery                    | level from `%` state or `battery_level`; green / amber / red; flashes when < 15 %; bolt when charging |
| temperature, humidity      | thermometer / droplet fill follows the value |
| solar, inverter            | animate while power > 0 |
| door, window, garage, blind, lock | open/unlocked = on |
| smoke, leak, alarm         | turn red when triggered |
| weather                    | 13 conditions (sunny, rainy, snowy, lightning, fog, windy …) plus the temperature |
| vacuum                     | animates while `cleaning` / `returning` |
| climate                    | warm accent while `heating`, cool while `cooling` |
| anything unavailable       | greys out and says "Unavailable" |

Respects the browser's *reduce motion* setting.

## 3D style

```yaml
type: custom:livicon-group-card
title: Kitchen
style: 3d          # flat (default) | 3d  — also settable per card or per entity
entities:
  - switch.fridge
  - switch.dishwasher
```

All 44 icons exist in 3D with the same names, auto-detection and live animations (spinning drum, rising steam, filling battery,
swinging door, weather…). They are drawn with gradients, depth and soft shadows, lit from the top-left, so they look right on
light and dark themes alike. A device that is off is a dull, unlit object; on, its lamps, glass and indicators light up.
You can mix: `style: 3d` on one entity inside a flat group works.

## Theming

The card uses your theme's own variables (`--primary-text-color`, `--secondary-text-color`, card background), so it fits
light, dark and custom themes with no setup. Override per card, or globally in a theme / `card-mod`:

```yaml
accent: "#4dd0e1"          # per card
```
```css
--tk-accent: #4dd0e1;      /* active colour   */
--tk-off:    #8c929b;      /* inactive colour */
--tk-body:   #e8eaed;      /* outline colour  */
```

## Add or change an icon

Every icon is an SVG fragment in the `ICONS` object in `dist/livicon.js` (48×48 grid). Use the helper classes
(`ln`, `fl`, `acc`, `acs`, `fx`…) and it picks up on/off colours; add a line to `KEYWORDS` so entities find it by name.

## Preview without Home Assistant

```bash
python3 -m http.server   # in this folder, then open http://localhost:8000/preview.html
```
`preview.html` mocks a dashboard with every icon (flat and 3D) on and off, all weather states, tap/hold actions, a live group-editor test and light/blue themes.

## Releasing

Tag a version (`git tag v2.0.0 && git push --tags`) and the *Release* workflow attaches `livicon.js` to a GitHub release,
which HACS prefers. For users who aren't you, the repository must be **public**.

## License

MIT
