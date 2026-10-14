
(() => {
  'use strict';

  const FILE = 'data/category_online_2025.csv';
  const T = window.DASHBOARD_THEME;

  const palette = T?.semantic?.treemap || [
    '#234B3A',
    '#C89B51',
    '#C47751',
    '#5F8D76',
    '#477D87',
    '#87966A',
    '#937A91',
    '#6489A4',
    '#A77F60'
  ];

  const cream = T?.colors?.cream || '#F2EBDD';

  const chart7 = {
    $schema: 'https://vega.github.io/schema/vega/v6.json',
    background: 'transparent',

    width: 1000,
    height: 450,
    padding: 5,
    autosize: 'fit-x',

    data: [
      {
        name: 'tree',
        url: FILE,

        format: {
          type: 'csv',
          parse: {
            spend_billion: 'number',
            yoy_growth: 'number'
          }
        },

        transform: [
          { type: 'nest' },
          {
            type: 'treemap',
            field: 'spend_billion',
            method: 'squarify',
            ratio: 1.6,
            round: true,
            paddingInner: 3,
            paddingOuter: 2,
            size: [
              { signal: 'width' },
              { signal: 'height' }
            ]
          }
        ]
      }
    ],

    scales: [
      {
        name: 'categoryColor',
        type: 'ordinal',
        domain: {
          data: 'tree',
          field: 'category'
        },
        range: palette
      }
    ],

    marks: [
      {
        type: 'rect',
        from: { data: 'tree' },

        encode: {
          enter: {
            x: { field: 'x0' },
            y: { field: 'y0' },
            x2: { field: 'x1' },
            y2: { field: 'y1' },

            fill: {
              scale: 'categoryColor',
              field: 'category'
            },

            stroke: { value: cream },
            strokeWidth: { value: 3 },

            tooltip: {
              signal: "{'Category': datum.category, 'Online Spending': '$' + format(datum.spend_billion, '.1f') + ' billion', 'YoY Growth': format(datum.yoy_growth, '.1f') + '%'}"
            }
          },

          update: {
            fillOpacity: { value: 1 }
          },

          hover: {
            fillOpacity: { value: 0.78 }
          }
        }
      },

      {
        type: 'text',
        from: { data: 'tree' },
        interactive: false,

        encode: {
          enter: {
            x: {
              signal: '(datum.x0 + datum.x1) / 2'
            },
            y: {
              signal: '(datum.y0 + datum.y1) / 2 - 9'
            },

            text: { field: 'category' },
            align: { value: 'center' },
            baseline: { value: 'middle' },
            fill: { value: '#FFFFFF' },
            fontSize: { value: 13 },
            fontWeight: { value: 'bold' },

            limit: {
              signal: 'max(0, datum.x1 - datum.x0 - 16)'
            }
          },

          update: {
            opacity: {
              signal: '(datum.x1 - datum.x0) >= 135 && (datum.y1 - datum.y0) >= 55 ? 1 : 0'
            }
          }
        }
      },

      {
        type: 'text',
        from: { data: 'tree' },
        interactive: false,

        encode: {
          enter: {
            x: {
              signal: '(datum.x0 + datum.x1) / 2'
            },
            y: {
              signal: '(datum.y0 + datum.y1) / 2 + 12'
            },

            text: {
              signal: "'$' + format(datum.spend_billion, '.1f') + 'b'"
            },

            align: { value: 'center' },
            baseline: { value: 'middle' },
            fill: { value: '#FFFFFF' },
            fontSize: { value: 12 },

            limit: {
              signal: 'max(0, datum.x1 - datum.x0 - 12)'
            }
          },

          update: {
            opacity: {
              signal: '(datum.x1 - datum.x0) >= 80 && (datum.y1 - datum.y0) >= 35 ? 1 : 0'
            }
          }
        }
      }
    ]
  };

  function render() {
    const element = document.querySelector('#chart7');
    if (!element) return;

    chart7.width = Math.max(
      280,
      Math.floor(element.clientWidth - 12)
    );

    vegaEmbed('#chart7', chart7, {
      actions: false
    }).catch(error => {
      console.error('Failed to render #chart7', error);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render, {
      once: true
    });
  } else {
    render();
  }
})();

