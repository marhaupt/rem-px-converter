export const transformRemToPx = (remString: string, baseSize = 16) => {
    const remToPx = (rem: string): string => `${parseFloat(rem) * baseSize}px`;

    return remString.replace(/\b(\d+(\.\d+)?)rem\b/g, (match, remValue) => remToPx(remValue));
}
