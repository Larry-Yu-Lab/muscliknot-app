import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';

export default function TabTwoScreen() {
  const { language, theme } = usePreferences();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
  const colors = Colors[theme];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          {t('exploreTitle')}
        </ThemedText>
      </ThemedView>

      <ThemedText>{t('exploreWelcome')}</ThemedText>

      <Collapsible title={t('exploreAppInfoTitle')}>
        <ThemedText>
          {t('exploreAppInfoDesc')}
        </ThemedText>
      </Collapsible>

      <Collapsible title={t('explorePlatformTitle')}>
        <ThemedText>
          {t('explorePlatformDesc')}
        </ThemedText>
      </Collapsible>

      <Collapsible title={t('exploreThemeTitle')}>
        <ThemedText>
          {t('exploreThemeDesc')}
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});