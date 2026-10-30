/**
 * Telegram WebApp / Mini App (TMA) Integration Suite
 * Aligned with Telegram Bot API 6.0+ WebApp standards
 */

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe?: {
          query_id?: string;
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
          };
          auth_date?: string;
          hash?: string;
        };
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        enableClosingConfirmation: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        openTelegramLink: (url: string) => void;
      };
    };
  }
}

export const isTelegramMiniApp = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(
    window.Telegram?.WebApp?.initData ||
    (window.Telegram?.WebApp?.platform && window.Telegram.WebApp.platform !== 'unknown')
  );
};

export const initTelegramMiniApp = () => {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp) return;
  const tg = window.Telegram.WebApp;

  try {
    tg.ready();
    tg.expand();
    // Brand header and background
    if (tg.setHeaderColor) tg.setHeaderColor('#881337');
    if (tg.setBackgroundColor) tg.setBackgroundColor('#FFF5F7');
    // Prevent accidental swipe-to-close during emergency triage
    if (tg.enableClosingConfirmation) tg.enableClosingConfirmation();
  } catch (err) {
    console.warn('Telegram WebApp initialization error:', err);
  }
};

export const triggerHaptic = (
  type: 'light' | 'medium' | 'heavy' | 'selection' | 'error' | 'success' = 'light'
) => {
  if (typeof window === 'undefined') return;

  // 1. Telegram Native Haptic Engine
  if (window.Telegram?.WebApp?.HapticFeedback) {
    const haptic = window.Telegram.WebApp.HapticFeedback;
    if (type === 'selection') {
      haptic.selectionChanged();
      return;
    }
    if (type === 'error' || type === 'success') {
      haptic.notificationOccurred(type);
      return;
    }
    haptic.impactOccurred(type);
    return;
  }

  // 2. Standard Web Vibration API Fallback
  if ('vibrate' in navigator) {
    if (type === 'heavy' || type === 'error') {
      navigator.vibrate([40, 60, 40]);
    } else if (type === 'medium') {
      navigator.vibrate(25);
    } else {
      navigator.vibrate(10);
    }
  }
};

export const setupTelegramBackButton = (onBack: () => void): (() => void) => {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp?.BackButton) {
    return () => {};
  }

  const bb = window.Telegram.WebApp.BackButton;
  bb.show();
  bb.onClick(onBack);

  return () => {
    bb.offClick(onBack);
    bb.hide();
  };
};

export const getTelegramUserData = () => {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp?.initDataUnsafe?.user || null;
};
