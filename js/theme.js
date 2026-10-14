
(() => {
  'use strict';

  const COLORS = {
    forest: '#234B3A',
    sage: '#5F8D76',
    teal: '#477D87',
    gold: '#C89B51',
    terracotta: '#C47751',
    olive: '#87966A',
    blue: '#6489A4',
    plum: '#937A91',

    cream: '#F2EBDD',
    text: '#26352D',
    muted: '#6B746E',
    grid: '#D8D1C4'
  };

  const PALETTES = {
    categorical: [
      COLORS.forest,
      COLORS.gold,
      COLORS.teal,
      COLORS.terracotta,
      COLORS.sage,
      COLORS.plum,
      COLORS.olive,
      COLORS.blue
    ],

    sequential: [
      '#EAE6D9',
      '#C9D8C2',
      '#94B5A0',
      '#5F8D76',
      '#234B3A'
    ],

    diverging: [
      '#B9654E',
      '#DDA98C',
      '#F1E9DA',
      '#9FBCAF',
      '#286653'
    ]
  };

  const vlConfig = {
    background: 'transparent',

    view: {
      stroke: null
    },

    axis: {
      labelColor: COLORS.text,
      titleColor: COLORS.text,
      domainColor: COLORS.muted,
      tickColor: COLORS.muted,
      gridColor: COLORS.grid,
      gridOpacity: 0.65,
      labelFont: 'Arial',
      titleFont: 'Arial',
      labelFontSize: 12,
      titleFontSize: 13,
      titleFontWeight: 'normal'
    },

    legend: {
      labelColor: COLORS.text,
      titleColor: COLORS.text,
      labelFontSize: 11,
      titleFontSize: 12,
      titleFontWeight: 'normal',
      gradientLength: 180,
      gradientThickness: 12,
      padding: 8
    },

    title: {
      color: COLORS.text,
      fontSize: 16,
      fontWeight: 'normal',
      font: 'Arial'
    },

    range: {
      category: PALETTES.categorical,
      ramp: PALETTES.sequential,
      heatmap: PALETTES.sequential,
      diverging: PALETTES.diverging
    },

    line: {
      stroke: COLORS.forest,
      strokeWidth: 2.5
    },

    point: {
      filled: true,
      fill: COLORS.sage,
      size: 85
    },

    bar: {
      fill: COLORS.forest
    },

    rect: {
      fill: COLORS.sage
    },

    area: {
      fill: COLORS.sage,
      opacity: 0.75
    }
  };

  window.DASHBOARD_THEME = {
    colors: COLORS,
    palettes: PALETTES,
    vlConfig
  };

  const originalEmbed = window.vegaEmbed;

  if (typeof originalEmbed !== 'function') {
    console.error('Load Vega-Embed before theme.js');
    return;
  }

  window.vegaEmbed = function(target, spec, options = {}) {
    const existingConfig = options.config || {};

    const mergedConfig = {
      ...vlConfig,
      ...existingConfig,
      axis: {
        ...vlConfig.axis,
        ...existingConfig.axis
      },
      legend: {
        ...vlConfig.legend,
        ...existingConfig.legend
      },
      range: {
        ...vlConfig.range,
        ...existingConfig.range
      }
    };

    return originalEmbed(target, spec, {
      ...options,
      config: mergedConfig
    });
  };

})();
