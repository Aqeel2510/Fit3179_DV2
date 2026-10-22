
(() => {
  'use strict';

  const FILE = 'data/category_online_2025.csv';
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

  

  function categoryIndex(name) {
    const s = String(name).toLowerCase();

    if (s.includes('marketplace')) return 0;
    if (s.includes('food')) return 1;
    if (s.includes('fashion')) return 2;
    if (s.includes('home')) return 3;
    if (s.includes('electronics')) return 4;
    if (s.includes('hobbies') || s.includes('recreation')) return 5;
    if (s.includes('health') || s.includes('beauty')) return 6;
    if (s.includes('department')) return 7;
    if (s.includes('books') || s.includes('stationery')) return 8;

    return -1;
  }

  function embedVL(target, spec) {
    return vegaEmbed(target, {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      background: 'transparent',
      ...spec,
      config: {
        view: { stroke: null },
        axis: {
          labelFontSize: 12,
          titleFontSize: 13
        },
        legend: {
          labelFontSize: 12,
          titleFontSize: 12
        },
        ...(spec.config || {})
      }
    }, { actions: false });
  }

  async function render() {
    if (!document.querySelector('#chart5')) return;

    try {
      const csv = await vega.loader().load(FILE);
      const rows = vega.read(csv, { type: 'csv' });

      const categories = [
        ...new Set(rows.map(d => d.category))
      ];

      const categoryColors = categories.map(name => {
        const index = categoryIndex(name);
        return index >= 0 ? palette[index] : '#64748b';
      });

      const chart5 = {
        width: 'container',
        height: 320,

        data: {
          url: FILE
        },

        layer: [
          {
            mark: {
              type: 'rule',
              strokeDash: [6, 4],
              color: '#64748b'
            },
            encoding: {
              y: { datum: 14 }
            }
          },

          {
            params: [{
              name: 'categoryClick5',
              select: {
                type: 'point',
                fields: ['category'],
                on: 'click',
                toggle: false
              }
            }],

            mark: {
              type: 'circle',
              stroke: 'white',
              strokeWidth: 1.5
            },

            encoding: {
              x: {
                field: 'spend_billion',
                type: 'quantitative',
                title: '2025 online spend (A$ billion)'
              },

              y: {
                field: 'yoy_growth',
                type: 'quantitative',
                title: '2025 YoY growth (%)',
                scale: { zero: false }
              },

              size: {
                field: 'spend_billion',
                type: 'quantitative',
                scale: {
                  range: [120, 850]
                },
                legend: null
              },

              color: {
                field: 'category',
                type: 'nominal',
                scale: {
                  domain: categories,
                  range: categoryColors
                },
                legend: null
              },

              opacity: {
                condition: {
                  param: 'categoryClick5',
                  value: 1
                },
                value: 0.55
              },

              tooltip: [
                {
                  field: 'category',
                  type: 'nominal',
                  title: 'Category'
                },
                {
                  field: 'spend_billion',
                  type: 'quantitative',
                  title: 'Spend (A$b)'
                },
                {
                  field: 'yoy_growth',
                  type: 'quantitative',
                  title: 'Growth (%)'
                }
              ]
            }
          }
        ]
      };

      await embedVL('#chart5', chart5);

      const legend = document.querySelector('#chart5-legend');

      if (legend) {
        legend.replaceChildren();

        const ordered = categories
          .map((name, i) => ({
            name,
            color: categoryColors[i],
            order: categoryIndex(name)
          }))
          .sort((a, b) => a.order - b.order);

        ordered.forEach(item => {
          const row = document.createElement('div');
          row.className = 'scatter-legend-item';

          const dot = document.createElement('span');
          dot.className = 'scatter-legend-dot';
          dot.style.backgroundColor = item.color;

          const label = document.createElement('span');
          label.textContent = item.name;

          row.append(dot, label);
          legend.appendChild(row);
        });
      }

    } catch (error) {
      console.error('Failed to render scatter chart', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();

