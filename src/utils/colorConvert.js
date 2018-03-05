var colorConvert = {
    hsv2rgb: function (h, s, v) {
        var hsv_h = Number(h);
        var hsv_s = Number(s);
        var hsv_v = Number(v);

        var i = Math.floor(hsv_h * 6);
        var f = hsv_h * 6 - i;
        var p = hsv_v * (1 - hsv_s);
        var q = hsv_v * (1 - f * hsv_s);
        var t = hsv_v * (1 - (1 - f) * hsv_s);

        var rgb_r = 0, rgb_g = 0, rgb_b = 0;
        switch (i % 6) {
            case 0:
                rgb_r = hsv_v;
                rgb_g = t;
                rgb_b = p;
                break;
            case 1:
                rgb_r = q;
                rgb_g = hsv_v;
                rgb_b = p;
                break;
            case 2:
                rgb_r = p;
                rgb_g = hsv_v;
                rgb_b = t;
                break;
            case 3:
                rgb_r = p;
                rgb_g = q;
                rgb_b = hsv_v;
                break;
            case 4:
                rgb_r = t;
                rgb_g = p;
                rgb_b = hsv_v;
                break;
            case 5:
                rgb_r = hsv_v, rgb_g = p, rgb_b = q;
                break;
        }
        return {
            r: Math.floor(rgb_r * 255),
            g: Math.floor(rgb_g * 255),
            b: Math.floor(rgb_g * 255),
        }
    },
    rgbToHex: function (R, G, B) {
        return colorConvert.toHex(R) + colorConvert.toHex(G) + colorConvert.toHex(B);
    },
    toHex: function (n) {
        n = parseInt(n, 10);
        if (isNaN(n))
            return "00";
        n = Math.max(0, Math.min(n, 255));
        return "0123456789ABCDEF".charAt((n - n % 16) / 16)
            + "0123456789ABCDEF".charAt(n % 16);
    }


}


module.exports = colorConvert;