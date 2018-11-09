import {RGBColor} from 'react-color';

export const toHexString = (color: RGBColor) => {
    return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
}

export const toRgbString = (color: RGBColor) => {
    return `rgb(${ color.r }, ${ color.g }, ${ color.b })`
}

const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}