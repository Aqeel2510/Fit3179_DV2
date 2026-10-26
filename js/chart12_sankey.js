
(() => {
  'use strict';

  const FILE = 'data/category_online_2025.csv';

  const THEME = window.DASHBOARD_THEME;

  const ABOVE = THEME.palettes.sankey[1];
  const BELOW = THEME.palettes.sankey[0];
  const TEXT = THEME.colors.text;

  function sankeyPath(x0, x1, y0, y1, h) {
    const c0 = x0 + (x1 - x0) * 0.48;
    const c1 = x1 - (x1 - x0) * 0.48;

    const fixed = v => Number(v).toFixed(2);

    return (
      `M${fixed(x0)},${fixed(y0)} ` +
      `C${fixed(c0)},${fixed(y0)} ` +
      `${fixed(c1)},${fixed(y1)} ` +
      `${fixed(x1)},${fixed(y1)} ` +
      `L${fixed(x1)},${fixed(y1 + h)} ` +
      `C${fixed(c1)},${fixed(y1 + h)} ` +
      `${fixed(c0)},${fixed(y0 + h)} ` +
      `${fixed(x0)},${fixed(y0 + h)} Z`
    );
  }

  async function renderSankey12() {
    const response = await fetch(FILE);

    if (!response.ok) {
      throw new Error(`${FILE}: HTTP ${response.status}`);
    }

    const rows = vega.read(
      await response.text(),
      { type: 'csv' }
    )
      .map(d => ({
        category: d.category,
        spend: +d.spend_billion,
        growth: +d.yoy_growth
      }))
      .filter(d =>
        d.category &&
        Number.isFinite(d.spend) &&
        Number.isFinite(d.growth) &&
        d.spend > 0
      )
      .sort((a, b) => b.spend - a.spend);

    if (!rows.length) {
      throw new Error('No valid category spending records for Sankey');
    }

    const WIDTH = 930;
    const HEIGHT = 520;

    const L_X = 155;
    const R_X = 680;
    const NODE_W = 18;

    const PAD = 7;
    const TOP = 13;
    const BENCHMARK = 14;

    const total = rows.reduce(
      (s, d) => s + d.spend,
      0
    );

    const factor =
      (HEIGHT - TOP * 2 - PAD * (rows.length - 1)) / total;

    const rightGroups = [
      'Above national growth (>14%)',
      'At/below national growth (<=14%)'
    ];

    const groupFor = d =>
      d.growth > BENCHMARK
        ? rightGroups[0]
        : rightGroups[1];

    const groupTotals = Object.fromEntries(
      rightGroups.map(name => [
        name,
        rows
          .filter(d => groupFor(d) === name)
          .reduce((s, d) => s + d.spend, 0)
      ])
    );

    const leftNodes = [];
    const rightNodes = [];
    const links = [];

    let sy = TOP;
    let groupBase = TOP;

    const nextRight = {};

    for (const name of rightGroups) {
      nextRight[name] = groupBase;

      rightNodes.push({
        name,
        y0: groupBase,
        y1: groupBase + groupTotals[name] * factor,
        total: groupTotals[name]
      });

      groupBase += groupTotals[name] * factor + 28;
    }

    for (const d of rows) {
      const h = d.spend * factor;
      const group = groupFor(d);
      const ty = nextRight[group];

      leftNodes.push({
        ...d,
        y0: sy,
        y1: sy + h
      });

      links.push({
        ...d,
        group,
        path: sankeyPath(
          L_X + NODE_W,
          R_X,
          sy,
          ty,
          h
        )
      });

      sy += h + PAD;
      nextRight[group] += h;
    }

    const spec = {
      $schema: 'https://vega.github.io/schema/vega/v6.json',

      background: 'transparent',

      description:
        'Category spending grouped by faster/slower than Australian 2025 online growth of 14%.',

      width: WIDTH,
      height: HEIGHT,

      padding: {
        left: 5,
        right: 5,
        top: 22,
        bottom: 5
      },

      autosize: 'none',

      signals: [
        {
          name: 'hovered12',
          value: null,
          on: [
            {
              events: '@links12:mouseover',
              update: 'datum.category'
            },
            {
              events: '@links12:mouseout',
              update: 'null'
            }
          ]
        }
      ],

      data: [
        {
          name: 'left12',
          values: leftNodes
        },
        {
          name: 'right12',
          values: rightNodes
        },
        {
          name: 'ribbons12',
          values: links
        }
      ],

      marks: [
        {
          type: 'path',
          name: 'links12',

          from: {
            data: 'ribbons12'
          },

          encode: {
            enter: {
              path: {
                field: 'path'
              },

              fill: {
                signal:
                  `datum.growth > ${BENCHMARK} ? '${ABOVE}' : '${BELOW}'`
              },

              tooltip: {
                signal:
                  "datum.category + ': A$' + " +
                  "format(datum.spend, '.1f') + " +
                  "'b; YoY ' + " +
                  "format(datum.growth, '.1f') + " +
                  "'%; ' + datum.group"
              }
            },

            update: {
              fillOpacity: {
                signal:
                  'hovered12 === null || hovered12 === datum.category ? 0.67 : 0.10'
              }
            }
          }
        },

        {
          type: 'rect',

          from: {
            data: 'left12'
          },

          encode: {
            enter: {
              x: { value: L_X },
              x2: { value: L_X + NODE_W },
              y: { field: 'y0' },
              y2: { field: 'y1' },

              

              tooltip: {
                signal:
                  'datum.category + ": A$" + ' +
                  'format(datum.spend, ".1f") + "b"'
              }
            }
          }
        },

        {
          type: 'text',

          from: {
            data: 'left12'
          },

          interactive: false,

          encode: {
            enter: {
              x: {
                value: L_X - 8
              },

              y: {
                signal: '(datum.y0 + datum.y1) / 2'
              },

              text: {
  signal: "datum.category === 'Books stationery & multimedia' ? ['Books stationery &', 'multimedia'] : datum.category"
},

              align: {
                value: 'right'
              },

              baseline: {
                value: 'middle'
              },

              fontSize: {
                value: 12
              },
                
              limit: {
                value: 148
              },

              fill: {
                value: TEXT
              }
            }
          }
        },

        {
          type: 'rect',

          from: {
            data: 'right12'
          },

          encode: {
            enter: {
              x: { value: R_X },
              x2: { value: R_X + NODE_W },
              y: { field: 'y0' },
              y2: { field: 'y1' },

              fill: {
                signal:
                  `indexof(datum.name, 'Above') === 0 ? '${ABOVE}' : '${BELOW}'`
              },

              tooltip: {
                signal:
                  'datum.name + ": A$" + ' +
                  'format(datum.total, ".1f") + "b"'
              }
            }
          }
        },

        {
          type: 'text',

          from: {
            data: 'right12'
          },

          interactive: false,

          encode: {
            enter: {
              x: {
                value: R_X + NODE_W + 8
              },

              y: {
                signal: '(datum.y0 + datum.y1) / 2'
              },

              text: {
                field: 'name'
              },

              align: {
                value: 'left'
              },

              baseline: {
                value: 'middle'
              },

              limit: {
                value: 218
              },

              fontSize: {
                value: 12
              },

              fontWeight: {
                value: 'bold'
              },

              fill: {
                value: TEXT
              }
            }
          }
        }
      ]
    };

    return vegaEmbed('#chart12', spec, {
      actions: false
    });
  }

  function render() {
    if (document.querySelector('#chart12')) {
      renderSankey12().catch(error => {
        console.error('Failed to render #chart12', error);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render, {
      once: true
    });
  } else {
    render();
  }
})();

