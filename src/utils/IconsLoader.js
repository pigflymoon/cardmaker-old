import Icon from 'react-native-vector-icons/Ionicons';

export async function prepareIcons() {
    const icons = await Promise.all([
        Icon.getImageSource('ios-home', 30),
        Icon.getImageSource('ios-settings', 30),
        Icon.getImageSource('ios-bookmarks', 30),
        Icon.getImageSource('ios-heart', 30),
        Icon.getImageSource('ios-person', 30),
    ]);
    const [home, settings, cards, notifications, profile] = icons;
    return {home, settings, cards, notifications, profile};
}