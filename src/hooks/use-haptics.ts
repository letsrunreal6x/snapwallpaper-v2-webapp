
'use client';

import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const useHaptics = () => {
    const canVibrate = Capacitor.isPluginAvailable('Haptics');

    const impact = async (style: ImpactStyle) => {
        if (!canVibrate) return;
        await Haptics.impact({ style });
    };

    const impactLight = () => impact(ImpactStyle.Light);
    const impactMedium = () => impact(ImpactStyle.Medium);
    const impactHeavy = () => impact(ImpactStyle.Heavy);

    const vibrate = async (duration = 100) => {
        if (!canVibrate) return;
        await Haptics.vibrate({ duration });
    };
    
    return {
        impactLight,
        impactMedium,
        impactHeavy,
        vibrate,
        canVibrate,
    };
};
