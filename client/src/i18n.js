import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "Order History": "Order History",
      "Deliver to": "Deliver to",
      "Your Address": "Your Address",
      "Login": "Login",
      "Logout": "Logout",
      "Cart": "Cart"
    }
  },
  hi: {
    translation: {
      "Order History": "ऑर्डर इतिहास",
      "Deliver to": "पहुंचाने के लिए",
      "Your Address": "आपका पता",
      "Login": "लॉगिन",
      "Logout": "लॉगआउट",
      "Cart": "कार्ट"
    }
  }
};

i18n
  .use(LanguageDetector) // detects browser language
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
