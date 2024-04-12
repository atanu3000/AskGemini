import { scale, moderateScale, moderateVerticalScale } from 'react-native-size-matters';

const sc = (size: number) => {
    return scale(size);
}

const vc = (size: number) => {
    return moderateVerticalScale(size, 1);
}

const mc = (size: number) => {
    return moderateScale(size);
}

export { sc, vc, mc }