import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
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
          Explore
        </ThemedText>
      </ThemedView>

      <ThemedText>Welcome to the MuscliKnot exploration page.</ThemedText>

      <Collapsible title="App Information">
        <ThemedText>
          This app helps you track muscle tension points. Use the Home tab to pinpoint pain locations.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Android and iOS support">
        <ThemedText>
          MuscliKnot is optimized for mobile tracking. You can view your front and back muscle profiles on both platforms.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Light and dark mode">
        <ThemedText>
          We recommend using Dark Mode for the best visual experience when viewing muscle models.
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