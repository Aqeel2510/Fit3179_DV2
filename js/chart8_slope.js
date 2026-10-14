
(() => {
  'use strict';

  const FILE = {
    monthly: 'data/abs_online_monthly.csv',
    category: 'data/category_online_2025.csv',
    generation: 'data/generation_online_2025.csv',
    states: 'data/state_online_2025.csv'
  };

 
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

  const chart8 = {
    width: 'container', height: 335,
    data: { url: FILE.generation },
    transform: [
      { window: [{ op: 'rank', as: 'spend_rank' }], sort: [{ field: 'spend_billion', order: 'descending' }] },
      { window: [{ op: 'rank', as: 'basket_rank' }], sort: [{ field: 'basket_aud', order: 'descending' }] },
      { fold: ['spend_rank', 'basket_rank'], as: ['metric', 'ranking'] },
      { calculate: "datum.metric === 'spend_rank' ? 'Total spending' : 'Average Order'", as: 'metric_label' }
    ],
    mark: { type: 'line', strokeWidth: 3, point: { filled: true, size: 130 } },
    encoding: {
      x: { field: 'metric_label', type: 'nominal', sort: ['Total spending', 'Average Order'], title: null },
      y: { field: 'ranking', type: 'quantitative', title: 'Rank (1 = highest)', scale: { domain: [1, 5], reverse: true }, axis: { tickMinStep: 1 } },
      color: { field: 'generation', type: 'nominal', title: 'Generation' },
      detail: { field: 'generation' },
      tooltip: [
        { field: 'generation', type: 'nominal' },
        { field: 'metric_label', type: 'nominal', title: 'Metric' },
        { field: 'ranking', type: 'quantitative', title: 'Rank' },
        { field: 'basket_aud', type: 'quantitative', title: 'Avg basket (A$)', format: '.2f' },
        { field: 'spend_billion', type: 'quantitative', title: 'Online spend (A$b)', format: '.1f' }
      ]
    }
  };

  function render() {
    if (document.querySelector('#chart8')) {
      embedVL('#chart8', chart8);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
