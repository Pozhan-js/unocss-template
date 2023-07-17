
/**
 * 
 * @param {} bgcolor 输入十六进制颜色值 
 * @returns 返回对应的文字颜色
 */
export function computedColor(bgcolor) {
  // 将十六进制颜色转换为RGB格式
  var rgbValues = hexToRgb(bgcolor);
  var red = rgbValues.r;
  var green = rgbValues.g;
  var blue = rgbValues.b;

  // 调整文字颜色的亮度
  var lightenAmount = 0.2; // 调整亮度的值（范围：0-1）
  var darkenAmount = 0.2; // 调整暗度的值（范围：0-1）

  // 计算调整后的文字颜色
  var lightenColor = adjustColorLightness(red, green, blue, lightenAmount);
  var darkenColor = adjustColorLightness(red, green, blue, -darkenAmount);

  // 根据背景颜色的亮度值选择文字颜色
  var brightness = (red * 299 + green * 587 + blue * 114) / 1000;
  if (brightness > 125) {
    // console.log(darkenColor);
    return darkenColor; // 背景较亮，文字颜色变暗
  } else {
    // console.log(lightenColor);
    return lightenColor; // 背景较暗，文字颜色变亮
  }

  // 调整颜色的亮度
  function adjustColorLightness(red, green, blue, amount) {
    var hslValues = rgbToHsl(red, green, blue);
    var h = hslValues[0];
    var s = hslValues[1];
    var l = hslValues[2] + amount;

    l = Math.max(0, Math.min(1, l)); // 限制亮度值在0-1之间

    var rgbValues = hslToRgb(h, s, l);
    var adjustedColor =
      "rgb(" +
      rgbValues[0] +
      ", " +
      rgbValues[1] +
      ", " +
      rgbValues[2] +
      ")";

    return adjustedColor;
  }

  // 将十六进制颜色转换为RGB颜色
  function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  }

  // 将HSL颜色转换为RGB颜色
  function hslToRgb(h, s, l) {
    var r, g, b;

    if (s === 0) {
      r = g = b = l; // 饱和度为0，即灰色
    } else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  // 将RGB颜色转换为HSL颜色
  function rgbToHsl(red, green, blue) {
    var r = red / 255;
    var g = green / 255;
    var b = blue / 255;
    var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var h,
      s,
      l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [h, s, l];
  }
}