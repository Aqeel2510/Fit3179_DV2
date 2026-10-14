
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



const chart6 = {
  $schema: VL_SCHEMA,

  width: 1000,
  height: 300,

  data: {
    url: FILE.monthly,
    format: {
      type: "csv",
      parse: {
        month: "date",
        food_m: "number",
        non_food_m: "number"
      }
    }
  },

  transform: [
    {
      calculate: "datum.food_m + datum.non_food_m",
      as: "total_spending"
    }
  ],

  mark: {
    type: "rect",
    stroke: "white",
    strokeWidth: 2
  },

  encoding: {

    x: {
      field: "month",
      timeUnit: "month",
      type: "ordinal",
      title: "Month",
      axis: {
        format: "%b",
        labelAngle: 0
      }
    },

    y: {
      field: "month",
      timeUnit: "year",
      type: "ordinal",
      title: "Year"
    },

    color: {
      field: "total_spending",
      type: "quantitative",
      title: "A$ million",
      scale: {
        range: ['#e0e8cb', '#afc9b7', '#6e9d83', '#315c4c']

      }
    },

    tooltip: [
      {
        field: "month",
        type: "temporal",
        title: "Month",
        format: "%B %Y"
      },
      {
        field: "total_spending",
        type: "quantitative",
        title: "Online Spending",
        format: ",.1f"
      }
    ]
  }
};

vegaEmbed("#chart6", chart6, {
  actions: false
});

  function render() {
    if (document.querySelector('#chart6')) {
      embedVL('#chart6', chart6);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
