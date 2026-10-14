
(() => {
  'use strict';


  const FILE = {
    monthly: 'data/abs_online_monthly.csv',
    category: 'data/category_online_2025.csv',
    generation: 'data/generation_online_2025.csv',
    states: 'data/state_online_2025.csv'
  };

  const TEAL = DASHBOARD_THEME.colors.sage;
  const VL_SCHEMA = 'https://vega.github.io/schema/vega-lite/v6.json';

  function embedVL(target, spec) {
    return vegaEmbed(target, {
      $schema: VL_SCHEMA, background: 'transparent', ...spec,
      config: {
        view: { stroke: null },
        axis: { labelFontSize: 12, titleFontSize: 13 },
        legend: { labelFontSize: 12, titleFontSize: 12 },
        ...(spec.config || {})
      }
    }, { actions: false }).catch(error => console.error(`Failed to render ${target}`, error));
  }

  function embedVega(target, spec) {
    return vegaEmbed(target, spec, { actions: false })
      .catch(error => console.error(`Failed to render ${target}`, error));
  }


  const chart14 = {
    width: 'container',
    height: 420,

    data: { url: FILE.category },

    transform: [
      {
        calculate: 'datum.spend_billion / (1 + datum.yoy_growth / 100)',
        as: 'spend_2024_est'
      },
      {
        calculate: 'datum.spend_billion - datum.spend_2024_est',
        as: 'increase_b'
      },
      {
        calculate: '0',
        as: 'zero'
      }
    ],

    encoding: {
      y: {
        field: 'category',
        type: 'nominal',
        sort: {
          field: 'increase_b',
          op: 'max',
          order: 'descending'
        },
        title: null,
        axis: {
          labelFontSize: 12,
          labelLimit: 200
        }
      },

      x: {
        field: 'increase_b',
        type: 'quantitative',
        title: 'Estimated spending increase (A$ billion)',
        scale: { zero: true, nice: true },
        axis: {
          format: '.2f',
          grid: true,
          gridColor: '#e2e8f0'
        }
      }
    },

    layer: [
      {
        mark: {
          type: 'rule',
          strokeWidth: 2.5,
          color: '#94a3b8'
        },

        encoding: {
          x2: {
            field: 'zero'
          }
        }
      },

      {
        mark: {
          type: 'circle',
          size: 200,
          color: TEAL,
          opacity: 0.95
        },

        encoding: {
          tooltip: [
            {
              field: 'category',
              type: 'nominal',
              title: 'Category'
            },
            {
              field: 'increase_b',
              type: 'quantitative',
              title: 'Estimated increase (A$b)',
              format: '.3f'
            },
            {
              field: 'spend_2024_est',
              type: 'quantitative',
              title: 'Estimated 2024 spending (A$b)',
              format: '.2f'
            },
            {
              field: 'spend_billion',
              type: 'quantitative',
              title: '2025 spending (A$b)',
              format: '.2f'
            },
            {
              field: 'yoy_growth',
              type: 'quantitative',
              title: 'YoY growth (%)',
              format: '.1f'
            }
          ]
        }
      },

      {
        mark: {
          type: 'text',
          align: 'left',
          baseline: 'middle',
          dx: 12,
          fontSize: 12,
          fontWeight: 'bold',
          color: '#334155'
        },

        encoding: {
          text: {
            field: 'increase_b',
            type: 'quantitative',
            format: '.2f'
          }
        }
      }
    ]
  };

  function render() {
    if (document.querySelector('#chart14')) {
      embedVL('#chart14', chart14);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
