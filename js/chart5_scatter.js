
(() => {
  'use strict';

  const FILE = {
    monthly: 'data/abs_online_monthly.csv',
    category: 'data/category_online_2025.csv',
    generation: 'data/generation_online_2025.csv',
    states: 'data/state_online_2025.csv'
  };

  const BLUE = DASHBOARD_THEME.colors.teal;
  const ORANGE = DASHBOARD_THEME.colors.gold;
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

  const chart5 = {
    width: 'container', height: 320,
    data: { url: FILE.category },
    layer: [
      { mark: { type: 'rule', strokeDash: [6, 4], color: '#64748b' }, encoding: { y: { datum: 14 } } },
      {
        params: [{ name: 'categoryClick5', select: { type: 'point', fields: ['category'], on: 'click', toggle: false } }],
        mark: { type: 'circle', opacity: 0.85, stroke: 'white', strokeWidth: 1 },
        encoding: {
          x: { field: 'spend_billion', type: 'quantitative', title: '2025 online spend (A$ billion)' },
          y: { field: 'yoy_growth', type: 'quantitative', title: '2025 YoY growth (%)', scale: { zero: false } },
          size: { field: 'spend_billion', type: 'quantitative', scale: { range: [120, 850] }, legend: null },
          color: { condition: { param: 'categoryClick5', value: ORANGE }, value: BLUE },
          tooltip: [
            { field: 'category', type: 'nominal', title: 'Category' },
            { field: 'spend_billion', type: 'quantitative', title: 'Spend (A$b)' },
            { field: 'yoy_growth', type: 'quantitative', title: 'Growth (%)' }
          ]
        }
      }
    ]
  };

  function render() {
    if (document.querySelector('#chart5')) {
      embedVL('#chart5', chart5);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
