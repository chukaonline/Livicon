# HA Custom Icons

Animated device icons for Home Assistant dashboards. **44 icons** that follow your entity's state:
fans spin, bulbs glow in the light's real colour, the washer drum turns, the robot vacuum trundles,
solar panels shimmer, the battery fills to its real level, doors swing open, the weather changes with the forecast.
A device that is off sits perfectly still.

One file. No dependencies. Original artwork (MIT). Works with any theme.

## Install with HACS

1. HACS → **⋮ → Custom repositories**
2. Repository: `https://github.com/chukaonline/HA-Custom-Icons` · Category: **Dashboard** (called *Plugin* in older HACS)
3. Download **HA Custom Icons**, then reload your browser (HACS adds the resource for you).

<details><summary>Manual install</summary>

Copy `dist/ha-custom-icons.js` to `/config/www/`, then **Settings → Dashboards → ⋮ → Resources → Add**:
`/local/ha-custom-icons.js` as a *JavaScript module*. Reload the browser.
</details>

## Cards

Add them from the card picker (search "HA Custom Icons") — both have a visual editor — or use YAML.

### Group card: a titled list with a master toggle

```yaml
type: custom:ha-custom-icons-group-card
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

### Single card

```yaml
type: custom:ha-custom-icons-card
entity: weather.home
layout: tile        # row (default) | tile | icon
```

Options: `entity`, `name`, `icon`, `layout`, `accent`, `icon_size`, `show_toggle`, and for batteries
`charging_entity` (any entity that is `on`/`charging` while charging — shows a lightning bolt).

Tap the icon/name for the more-info dialog (row layout) or to toggle (tile / icon layout).

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

Every icon is an SVG fragment in the `ICONS` object in `dist/ha-custom-icons.js` (48×48 grid). Use the helper classes
(`ln`, `fl`, `acc`, `acs`, `fx`…) and it picks up on/off colours; add a line to `KEYWORDS` so entities find it by name.

## Preview without Home Assistant

```bash
python3 -m http.server   # in this folder, then open http://localhost:8000/preview.html
```
`preview.html` mocks a dashboard with every icon on and off, all weather states, and light/blue themes.

## Releasing

Tag a version (`git tag v2.0.0 && git push --tags`) and the *Release* workflow attaches `ha-custom-icons.js` to a GitHub release,
which HACS prefers. For users who aren't you, the repository must be **public**.

## License

MIT
