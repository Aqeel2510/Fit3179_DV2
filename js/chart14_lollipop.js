
(() => {
  'use strict';


  const FILE = {
    monthly: 'data/abs_online_monthly.csv',
    category: 'data/category_online_2025.csv',
    generation: 'data/generation_online_2025.csv',
    states: 'data/state_online_2025.csv'
  };

  const T = window.DASHBOARD_THEME;

  const palette = [
    T.colors.forest,
    T.colors.gold,
    T.colors.terracotta,
    T.colors.sage,
    T.colors.teal,
    T.colors.olive,
    T.colors.plum,
    T.colors.blue,
    T.colors.brown
  ];


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
      },
      {
        calculate: `{
          'Online marketplaces': '${palette[0]}',
          'Food & liquor': '${palette[1]}',
          'Fashion': '${palette[2]}',
          'Home & garden': '${palette[3]}',
          'Consumer electronics': '${palette[4]}',
          'Hobbies & rec goods': '${palette[5]}',
          'Health & beauty': '${palette[6]}',
          'Department stores': '${palette[7]}',
          'Books stationery & multimedia': '${palette[8]}'
        }[datum.category] || '#64748b'`,
        as: 'category_color'
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
          labelExpr: "datum.value === 0 ? '0' : format(datum.value, '.2f')",
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
          opacity: 0.95,
          stroke: 'white',
          strokeWidth: 1
        },

        encoding: {
          color: {
            field: 'category_color',
            type: 'nominal',
            scale: null,
            legend: null
          },

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
