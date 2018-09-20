import I18n, {getLanguages} from 'react-native-i18n';
import DeviceInfo from 'react-native-device-info';
import LanguageRespository from '../../utils/LanguageRespository';
import en from './en';
// import zh from './zh'

import zhSimple from './zhSimple';
import zhTraditional from './zhTraditional';
import ja from './ja';
import es from './es';
import fr from './fr';
import de from './de';
import pt from './pt';
import ko from './ko';
I18n.defaultLocale = 'en';

I18n.fallbacks = true;

I18n.translations = {
    en,
    zhSimple,
    zhTraditional,
    ja,
    es,
    fr,
    de,
    pt,
    ko
};


I18n.localeLanguage = () => {

    new LanguageRespository().fetchLocalRepository('localLanguage')
        .then((res) => {
            console.log('res is ', res);
            I18n.locale = res;

        })
        .catch((error) => {

            I18n.locale = DeviceInfo.getDeviceLocale();

        });

    return I18n.locale;

};


export {I18n, getLanguages};

