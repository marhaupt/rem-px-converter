const round = (value: number, precision: number) => {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
}

export const transformRemToPx = (remString: string, baseSize: number) => {
    const remToPx = (rem: string): string => `${parseFloat(rem) * baseSize}px`;

    return remString.replace(/\b(\d+(\.\d+)?)rem\b/g, (match, remValue) => remToPx(remValue));
}

export const transformPxToRem = (pxString: string, baseSize: number) => {
    const pxToRem = (px: string): string => `${round(parseFloat(px) / baseSize, 5)}rem`;

    return pxString.replace(/\b(\d+(\.\d+)?)px\b/g, (match, pxValue) => pxToRem(pxValue));
}
