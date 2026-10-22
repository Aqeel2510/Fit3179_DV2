
(() => {
  'use strict';


  const FILE = {
    monthly: 'data/abs_online_monthly.csv',
    category: 'data/category_online_2025.csv',
    generation: 'data/generation_online_2025.csv',
    states: 'data/state_online_2025.csv'
  };

  const TEAL = DASHBOARD_THEME.colors.teal;
  const GOLD = DASHBOARD_THEME.colors.gold;
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



  const chart9 = {
    width: 'container', height: 360,
    data: { url: FILE.states },
    transform: [
      { joinaggregate: [
        { op: 'sum', field: 'spend_billion', as: 'total_spend' },
        { op: 'sum', field: 'population', as: 'total_population' }
      ] },
      { calculate: '100 * datum.spend_billion / datum.total_spend', as: 'spending_share' },
      { calculate: '100 * datum.population / datum.total_population', as: 'population_share' }
    ],
    encoding: { y: { field: 'state', type: 'nominal', sort: { field: 'spend_billion', order: 'descending' }, title: null } },
    layer: [
      {
        mark: { type: 'rule', strokeWidth: 3, color: '#94a3b8' },
        encoding: {
          x: { field: 'population_share', type: 'quantitative', title: 'Share of Australia (%)' },
          x2: { field: 'spending_share' }
        }
      },
      {
        transform: [
          { fold: ['population_share', 'spending_share'], as: ['metric', 'share'] },
          { calculate: "datum.metric === 'population_share' ? 'Population share' : 'Online spend share'", as: 'metric_label' }
        ],
        mark: { type: 'circle', size: 150 },
        encoding: {
          x: { field: 'share', type: 'quantitative' },
          color: { field: 'metric_label', type: 'nominal', scale: { domain: ['Population share', 'Online spend share'], range: [GOLD, TEAL] }, title: null },
          tooltip: [
            { field: 'state', type: 'nominal' },
            { field: 'metric_label', type: 'nominal', title: 'Measure' },
            { field: 'share', type: 'quantitative', format: '.2f', title: 'Share (%)' }
          ]
        }
      }
    ]
  };

  function render() {
    if (document.querySelector('#chart9')) {
      embedVL('#chart9', chart9);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
