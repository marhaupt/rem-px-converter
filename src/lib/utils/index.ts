export const transformRemToPx = (remString: string, baseSize: number) => {
    const remToPx = (rem: string): string => `${parseFloat(rem) * baseSize}px`;

    return remString.replace(/\b(\d+(\.\d+)?)rem\b/g, (match, remValue) => remToPx(remValue));
}

export const transformPxToRem = (pxString: string, baseSize: number) => {
    const pxToRem = (px: string): string => `${parseFloat(px) / baseSize}rem`;

    return pxString.replace(/\b(\d+(\.\d+)?)px\b/g, (match, pxValue) => pxToRem(pxValue));
}
