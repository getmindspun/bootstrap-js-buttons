var DEBUG = false;

function debug() {
    DEBUG = !DEBUG;
}

function _color(value) {
    value = value.trim();
    if (value.charAt(0) === '#') {
        return value.substring(1);
    }
    return value;
}

function red(value) {
    return parseInt(_color(value).substring(0, 2), 16);
}

function green(value) {
    return parseInt(_color(value).substring(2, 4), 16);
}

function blue(value) {
    return parseInt(_color(value).substring(4, 6), 16);
}

function rgba(value, a) {
    a = a * 100;
    return `rgb(${ red(value) } ${ green(value) } ${ blue(value) } / ${ a }%)`;
}

function mix(color_1, color_2, weight) {
    color_1 = _color(color_1);
    color_2 = _color(color_2);

    function d2h(d) {
        return d.toString(16);
    }  // convert a decimal value to hex
    function h2d(h) {
        return parseInt(h, 16);
    } // convert a hex value to decimal

    weight = (typeof (weight) !== 'undefined') ? weight : 50; // set the weight to 50%, if that argument is omitted

    var color = "#";

    for (var i = 0; i <= 5; i += 2) { // loop through each of the 3 hex pairs—red, green, and blue
        var v1 = h2d(color_1.substr(i, 2)), // extract the current pairs
            v2 = h2d(color_2.substr(i, 2)),

            // combine the current pairs from each source color, according to the specified weight
            val = d2h(Math.floor(v2 + (v1 - v2) * (weight / 100.0)));
        while (val.length < 2) {
            val = '0' + val;
        } // prepend a '0' if val results in a single digit

        color += val; // concatenate val to our new color string
    }

    return color;
}

// Tint a color: mix a color with white
function tint(color, weight) {
    return mix('ffffff', color, weight);
}

// Shade a color: mix a color with black
function shade(color, weight) {
    return mix('000000', color, weight);
}

// Return opaque color
// opaque(#fff, rgba(0, 0, 0, .5)) => #808080
function opaque(background, foreground) {
    // mix(rgba($foreground, 1), $background, opacity($foreground) * 100);
    return mix(foreground, background, opacity(foreground) * 100);
}

// A list of pre-calculated numbers of pow(($value / 255 + .055) / 1.055, 2.4). (from 0 to 255)
// stylelint-disable-next-line scss/dollar-variable-default, scss/dollar-variable-pattern
const _luminanceList = [
    .0008, .0010, .0011, .0013, .0015, .0017, .0020, .0022, .0025, .0027, .0030, .0033, .0037, .0040, .0044, .0048,
    .0052, .0056, .0060, .0065, .0070, .0075, .0080, .0086, .0091, .0097, .0103, .0110, .0116, .0123, .0130, .0137,
    .0144, .0152, .0160, .0168, .0176, .0185, .0194, .0203, .0212, .0222, .0232, .0242, .0252, .0262, .0273, .0284,
    .0296, .0307, .0319, .0331, .0343, .0356, .0369, .0382, .0395, .0409, .0423, .0437, .0452, .0467, .0482, .0497,
    .0513, .0529, .0545, .0561, .0578, .0595, .0612, .0630, .0648, .0666, .0685, .0704, .0723, .0742, .0762, .0782,
    .0802, .0823, .0844, .0865, .0887, .0908, .0931, .0953, .0976, .0999, .1022, .1046, .1070, .1095, .1119, .1144,
    .1170, .1195, .1221, .1248, .1274, .1301, .1329, .1356, .1384, .1413, .1441, .1470, .1500, .1529, .1559, .1590,
    .1620, .1651, .1683, .1714, .1746, .1779, .1812, .1845, .1878, .1912, .1946, .1981, .2016, .2051, .2086, .2122,
    .2159, .2195, .2232, .2270, .2307, .2346, .2384, .2423, .2462, .2502, .2542, .2582, .2623, .2664, .2705, .2747,
    .2789, .2831, .2874, .2918, .2961, .3005, .3050, .3095, .3140, .3185, .3231, .3278, .3325, .3372, .3419, .3467,
    .3515, .3564, .3613, .3663, .3712, .3763, .3813, .3864, .3916, .3968, .4020, .4072, .4125, .4179, .4233, .4287,
    .4342, .4397, .4452, .4508, .4564, .4621, .4678, .4735, .4793, .4851, .4910, .4969, .5029, .5089, .5149, .5210,
    .5271, .5333, .5395, .5457, .5520, .5583, .5647, .5711, .5776, .5841, .5906, .5972, .6038, .6105, .6172, .6240,
    .6308, .6376, .6445, .6514, .6584, .6654, .6724, .6795, .6867, .6939, .7011, .7084, .7157, .7231, .7305, .7379,
    .7454, .7529, .7605, .7682, .7758, .7835, .7913, .7991, .8070, .8148, .8228, .8308, .8388, .8469, .8550, .8632,
    .8714, .8796, .8879, .8963, .9047, .9131, .9216, .9301, .9387, .9473, .9560, .9647, .9734, .9823, .9911, 1
];


// Return WCAG2.0 relative luminance
// See https://www.w3.org/WAI/GL/wiki/Relative_luminance
// See https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
function luminance(color) {
    let rgb = {
        r: red(color),
        g: green(color),
        b: blue(color)
    };

    for (let [name, value] of Object.entries(rgb)) {
        if (value / 255 < .03928) {
            value = value / 255 / 12.92;
        } else {
            value = _luminanceList[value];
        }
        rgb[name] = value;
    }

    return +(rgb.r * .2126 + rgb.g * .7152 + rgb.b * .0722).toFixed(8);
}


function contrastRatio(background, options) {
    options.colorContrastLight = options.colorContrastLight || '#ffffff';
    options.foreground = options.foreground || options.colorContrastLight;

    const l1 = luminance(background);

    // If we don't allow opacity in the foreground color this will alway equal 'foreground'
    // $l2: luminance(opaque($background, $foreground));
    const l2 = luminance(options.foreground);

    if (l1 > l2) {
        return +((l1 + .05) / (l2 + .05)).toFixed(10);
    }
    return +((l2 + .05) / (l1 + .05)).toFixed(10);
}

// https://getbootstrap.com/docs/5.0/customize/sass/#color-contrast
function colorContrast(background, options) {
    options = options || {};
    options.colorContrastDark = options.colorContrastDark || '#000000';
    options.colorContrastLight = options.colorContrastLight || '#ffffff';
    options.minContrastRatio = options.minContrastRatio || 4.5;

    const foregrounds = [options.colorContrastLight, options.colorContrastDark, '#ffffff', '#000000'];
    let maxRatio = 0;
    let maxRatioColor = null;

    for (const color of foregrounds) {
        let ratio = contrastRatio(background, {
            foreground: color,
            colorContrastLight: options.colorContrastLight,
            colorContrastDark: options.colorContrastDark
        });
        if (ratio > options.minContrastRatio) {
            return color;
        } else if (ratio > maxRatio) {
            maxRatio = ratio;
            maxRatioColor = color;
        }
    }

    if (DEBUG) {
        console.log(`Found no color leading to ${options.minContrastRatio}:1 contrast ratio against ${background}...`);
    }
    return maxRatioColor;
}

function addStyleElement(name, css) {
    var head = document.querySelector('head');

    var styleId = 'bs' + name;
    var oldStyle = document.getElementById(styleId);

    var style = document.createElement('style');

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    style.setAttribute('id', styleId);

    if (oldStyle) {
        head.replaceChild(style, oldStyle);
    } else {
        head.appendChild(style);
    }
}

function squashCss(css) {
    return css.trim().replace(/\s+/g, ' ');
}

function gradientBackground(color, options) {
    options.enableGradients = options.enableGradients || false;

    let css = `
    background-color: ${color};
    `
    if (options.enableGradients) {
        css += `
        background-image: var(--bs-gradient);
        `
    }
    return css;
}

function btnBoxShadow(options) {
    options = options || {};
    options.enableShadows = options.enableShadows || false;
    options.btnBoxShadow = options.btnBoxShadow || 'inset 0 1px 0 #ffffff, 0 1px 1px #000000';

    // FIXME: user is responsible for using 'none' correctly.
    if (options.enableShadows) {
        return `box-shadow: ${options.btnBoxShadow}`
    }
    return '';
}

function focusBoxShadow(shadow, color, border, options) {
    options = options || {};
    options.btnFocusWidth = options.btnFocusWidth || '.25rem';

    if (options.enableShadows) {
        return `box-shadow: ${shadow}  0 0 0 ${options.btnFocusWidth} ${rgba(mix(color, border, 15), .5)}`;
    } else {
        return `box-shadow: 0 0 0 ${options.btnFocusWidth}  ${rgba(mix(color, border, 15), .5)}`;
    }
}

function focusBoxShadowOutline(shadow, color, options) {
    options = options || {};
    options.btnFocusWidth = options.btnFocusWidth || '.25rem';

    if (options.enableShadows) {
        return `box-shadow: ${shadow}  0 0 0 ${options.btnFocusWidth} ${rgba(color, .5)}`;
    } else {
        return `box-shadow: 0 0 0 ${options.btnFocusWidth}  ${rgba(color, .5)}`;
    }
}

function removeGradientIfEnabled(options) {
    options = options || {};

    if (options.enableGradients) {
        return `background-image: none;`
    }
    return '';
}

function defaultOptions(options) {
    options = options || {};

    options.colorContrastLight = options.colorContrastLight || '#ffffff';
    options.colorContrastDark = options.colorContrastDark || '#000000';
    options.minContrastRatio = options.minContrastRatio || 4.5;
    options.btnHoverBgShadeAmount = options.btnHoverBgShadeAmount || 15;
    options.btnHoverBgTintAmount = options.btnHoverBgTintAmount || 15;
    options.btnHoverBorderShadeAmount = options.btnHoverBorderShadeAmount || 20;
    options.btnHoverBorderTintAmount = options.btnHoverBorderTintAmount || 10;
    options.btnActiveBgShadeAmount = options.btnHoverBgShadeAmount || 20;
    options.btnActiveBgTintAmount = options.btnActiveBgTintAmount || 20;
    options.btnActiveBorderShadeAmount = options.btnActiveBorderShadeAmount || 25;
    options.btnActiveBorderTintAmount = options.btnActiveBorderTintAmount || 10;
    options.btnBoxShadow = options.btnBoxShadow || `inset 0 1px 0 ${rgba('#ffffff', .15)}, 0 1px 1px ${rgba('#000000', .075)} !default`;
    options.btnActiveBoxShadow = options.btnActiveBoxShadow || `inset 0 3px 5px ${rgba('#000000', .125)}`;

    options.enableGradients = options.enableGradients || false;
    options.enableShadows = options.enableShadows || false;

    return options;
}

function buttonVariant(
    name,
    background,
    border,
    options
) {
    if (name.charAt(0) !== '.') {
        name = '.' + name;
    }
    options = defaultOptions(options);

    /* Function */
    options.color = options.color || colorContrast(background, options);
    border = border ? boarder : background;

    if (!options.hoverBackground) {
        if (options.color === options.colorContrastLight) {
            options.hoverBackground = shade(background, options.btnHoverBgShadeAmount);
        } else {
            options.hoverBackground = tint(background, options.btnHoverBgTintAmount);
        }
    }

    if (!options.hoverBorder) {
        if (options.color === options.colorContrastLight) {
            options.hoverBorder = shade(border, options.btnHoverBorderShadeAmount);
        } else {
            options.hoverBorder = tint(border, options.btnHoverBgTintAmount);
        }
    }
    options.hoverColor = options.hoverColor || colorContrast(options.hoverBackground, options);

    if (!options.activeBackground) {
        if (options.color === options.colorContrastLight) {
            options.activeBackground = shade(background, options.btnActiveBgShadeAmount);
        } else {
            options.activeBackground = tint(background, options.btnActiveBorderTintAmount);
        }
    }

    if (!options.activeBorder) {
        if (options.color === options.colorContrastLight) {
            options.activeBorder = shade(border, options.btnActiveBorderShadeAmount);
        } else {
            options.activeBorder = tint(border, options.btnActiveBorderTintAmount);
        }
    }

    options.activeColor = options.activeColor || colorContrast(options.activeBackground, options);
    options.disabledBackground = background;
    options.disabledBorder = border;
    options.disabledColor = colorContrast(options.disabledBackground);

    //---
    let css = `
    ${name} {
        color: ${options.color};
        ${gradientBackground(background, options)}
        border-color: ${border};
        ${btnBoxShadow(options)}
    }
    
    ${name}:hover {
        color: ${options.hoverColor};
        ${gradientBackground(options.hoverBackground, options)};
        border-color: ${options.hoverBorder};
    }
    .btn-check:focus + ${name},
    ${name}:focus {
        color: ${options.hoverColor};
        ${gradientBackground(options.hoverBackground, options)};
        border-color: ${options.hoverBorder};
        ${focusBoxShadow(options.btnBoxShadow, options.color, border, options)};
    }
    .btn-check:checked + ${name},
    .btn-check:active + ${name},
    ${name}:active,
    ${name}.active,
    .show > ${name}.dropdown-toggle {
        color: ${options.activeColor};
        background-color: ${options.activeBackground};
        ${removeGradientIfEnabled(options)}
        border-color: ${options.activeBorder};
    }
    ${name}:focus {
        ${focusBoxShadow(options.activeBoxShadow, options.color, border, options)};
    }
    ${name}:disabled,
    ${name}.disabled {
        color: ${options.disabledColor};
        background-color: ${options.disabledBackground};
        ${removeGradientIfEnabled(options)}
        border-color: ${options.disabledBorder};
    }`;

    //---
    addStyleElement(name, squashCss(css));
}

function buttonOutlineVariant(
    name,
    color,
    options
) {
    if (name.charAt(0) !== '.') {
        name = '.' + name;
    }

    options = defaultOptions(options);

    /* Function */
    options.colorHover = options.colorHover || colorContrast(color, options);
    options.activeBackground = options.activeBackground || color;
    options.activeBorder = options.activeBorder || color;
    options.activeColor = options.activeColor || options.activeBackground;

    //---
    let css = `
    ${name} {
        color: ${color};
        border-color: ${color};
    }
    
    ${name}:hover {
        color: ${options.colorHover};
        background-color: ${options.activeBackground};
        border-color: ${options.activeBorder};
    }
    
    .btn-check:focus + ${name},
    ${name}:focus {
        ${focusBoxShadowOutline(options.btnBoxShadow, color, options)};
    }
    .btn-check:checked + ${name},
    .btn-check:active + ${name},
    ${name}:active,
    ${name}.active,
    ${name}.dropdown-toggle {
        color: ${color};
        background-color: ${options.activeBackground};
        border-color: ${options.activeBorder};
    }
    ${name}:focus {
        ${focusBoxShadowOutline(options.activeBoxShadow, color, options)};
    }
    ${name}:disabled,
    ${name}.disabled {
        color: ${color};
        background-color: transparent;
    }`;
    //---

    addStyleElement(name, squashCss(css));
}

export {
    buttonVariant,
    buttonOutlineVariant,
    debug
}
