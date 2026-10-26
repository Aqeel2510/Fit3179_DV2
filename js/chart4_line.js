(() => {
  'use strict';

  const FILE = {
    monthly: 'data/abs_online_monthly.csv',
    category: 'data/category_online_2025.csv',
    generation: 'data/generation_online_2025.csv',
    states: 'data/state_online_2025.csv'
  };

  const TEAL = DASHBOARD_THEME.colors.teal;

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

  const chart4 = {
    width: 'container', height: 300,
    data: { url: FILE.monthly },
    transform: [{
  calculate: '(toNumber(datum.food_m) + toNumber(datum.non_food_m))/1000',
  as: 'total_m'
}],
    params: [{ name: 'timeZoom4', select: { type: 'interval', encodings: ['x'] }, bind: 'scales' }],
    mark: { type: 'line', stroke: TEAL, strokeWidth: 3, point: { size: 16 } },
    encoding: {
      x: { field: 'month', type: 'temporal', title: 'Month' },
      y: { field: 'total_m', type: 'quantitative', title: 'Monthly online sales (A$ Billion)', scale: { zero: false } },
      tooltip: [
        { field: 'month', type: 'temporal', title: 'Month', format: '%b %Y' },
        { field: 'total_m', type: 'quantitative', title: 'Online sales (A$m)', format: ',.1f' }
      ]
    }
  };

  function render() {
    if (document.querySelector('#chart4')) {
      embedVL('#chart4', chart4);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();