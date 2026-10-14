(() => {
  'use strict';

  const spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',

    width: 'container',
    height: 360,
    background: null,

    data: {
      url: 'data/abs_online_monthly.csv',
      format: {
        parse: {
          month: 'date',
          food_m: 'number',
          non_food_m: 'number'
        }
      }
    },

    transform: [
      {
        calculate: 'datum.food_m + datum.non_food_m',
        as: 'total_m'
      },
      {
        calculate: 'year(datum.month)',
        as: 'year_num'
      },
      {
        filter: 'datum.year_num >= 2020 && datum.year_num <= 2025'
      },
      {
        calculate:
          "datum.year_num == 2020 ? '2020 (Jun–Dec)' : " +
          "datum.year_num == 2025 ? '2025 (Jan–Jun)' : " +
          "toString(datum.year_num)",
        as: 'year_label'
      },
      {
        calculate: 'month(datum.month)',
        as: 'month_num'
      }
    ],

    layer: [
      {
        mark: {
          type: 'boxplot',
          extent: 'min-max',
          size: 48,

          box: {
            fill: 'transparent',
            stroke: '#315c4c',
            strokeWidth: 1.5
          },

          median: {
            color: '#c28b42',
            strokeWidth: 3
          },

          rule: {
            stroke: '#315c4c',
            strokeWidth: 1.5,
            strokeDash: [5, 4]
          },

          ticks: {
            color: '#315c4c',
            strokeWidth: 1.5,
            size: 18
          }
        },

        encoding: {
          x: {
            field: 'year_label',
            type: 'ordinal',
            sort: [
              '2020 (Jun–Dec)',
              '2021',
              '2022',
              '2023',
              '2024',
              '2025 (Jan–Jun)'
            ],
            title: null,
            axis: {
              labelAngle: 0,
              labelFontSize: 12,
              labelPadding: 10,
              labelColor: '#203d33',
              tickColor: '#b7b09f',
              domainColor: '#b7b09f'
            }
          },

          y: {
            field: 'total_m',
            type: 'quantitative',
            title: 'Monthly online spending (A$ million)',
            scale: {
              domain: [2800, 4800],
              zero: false
            },
            axis: {
              format: ',.0f',
              grid: true,
              labelFontSize: 12,
              titleFontSize: 13,
              labelColor: '#203d33',
              titleColor: '#203d33',
              gridColor: '#d8d0c1',
              tickColor: '#b7b09f',
              domainColor: '#b7b09f'
            }
          }
        }
      }
    ],

    config: {
      view: {
        stroke: null
      },
      axis: {
        labelColor: '#203d33',
        titleColor: '#203d33',
        domainColor: '#b7b09f',
        tickColor: '#b7b09f',
        gridColor: '#d8d0c1'
      }
    }
  };

  vegaEmbed('#chart10', spec, {
    actions: false
  }).catch(console.error);

})();