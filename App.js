import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const COLORS = {
  background: '#F6E9DA',
  backgroundSoft: '#FBF3E8',
  card: '#FFF9F2',
  cardSoft: '#FFF6EE',
  border: '#F2E1CD',
  text: '#4B3726',
  muted: '#8D745A',
  green: '#A7C975',
  gold: '#E4B95C',
  purple: '#A789E2',
  coral: '#E67F78',
  rose: '#F1A8A4',
  peach: '#F7C8A6',
  blue: '#A9D4EF',
  shadow: 'rgba(132, 95, 60, 0.16)',
};

const featureCards = [
  {
    key: 'map',
    title: "XiaoBai's Map",
    accent: COLORS.green,
    bullets: ['Offline Maps', 'Saved Places'],
    action: 'Open Map',
    renderArt: () => <MapArt />,
  },
  {
    key: 'bag',
    title: 'Travel Bag',
    accent: COLORS.gold,
    bullets: ['Documents', 'Tickets'],
    action: 'Open Bag',
    renderArt: () => <BagArt />,
  },
  {
    key: 'guide',
    title: 'Guidebook',
    accent: COLORS.purple,
    bullets: ['Phrasebook', 'Metro Guide', 'Embassy Info'],
    action: 'Open Guide',
    renderArt: () => <BookArt />,
  },
  {
    key: 'kit',
    title: 'Rescue Kit',
    accent: COLORS.coral,
    bullets: ['Emergency', 'Hospitals', 'Embassy Help'],
    action: 'Open Kit',
    renderArt: () => <KitArt />,
  },
];

const navItems = [
  { key: 'home', label: 'Home', icon: '⌂', active: true },
  { key: 'maps', label: 'Maps', icon: '⌖', active: false },
  { key: 'chat', label: 'Chat', icon: '◌', active: false },
  { key: 'more', label: 'More', icon: '⋯', active: false },
];

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View pointerEvents="none" style={styles.glowTopLeft} />
      <View pointerEvents="none" style={styles.glowBottomRight} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header />
        <HeroScene />
        <PrimaryActionCard />
        <View style={styles.featureGrid}>
          {featureCards.map((card, index) => (
            <FeatureCard
              key={card.key}
              title={card.title}
              accent={card.accent}
              bullets={card.bullets}
              action={card.action}
              renderArt={card.renderArt}
              isRightColumn={index % 2 === 1}
            />
          ))}
        </View>
        <StatsBar />
        <BottomNav />
      </ScrollView>
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.headerTopRow}>
        <View style={styles.offlineBadge}>
          <View style={styles.offlineMascotWrap}>
            <Mascot size={42} />
          </View>
           <Text style={styles.offlineBadgeText}>{'Offline\nMode'}</Text>
          <View style={styles.onlineDot} />
        </View>

        <Pressable style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙</Text>
        </Pressable>
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.title}>XiaoBai AI</Text>
        <Text style={styles.subtitle}>Your offline travel companion</Text>
      </View>
    </View>
  );
}

function HeroScene() {
  return (
    <View style={styles.heroScene}>
      <View style={styles.windowFrame}>
        <WindowScene />
      </View>

      <View style={styles.postcardWrap}>
        <Postcard />
      </View>

      <View style={styles.heroMascotArea}>
        <View style={styles.heroRug} />
        <Mascot size={222} />
      </View>

      <View style={styles.speechBubble}>
        <Text style={styles.speechBubbleText}>{'Woof!\nWhere shall we\nexplore today?'}</Text>
        <View style={styles.speechTail} />
      </View>

      <View style={styles.heroPlantWrap}>
        <PlantPot />
      </View>

      <View style={styles.heroBagWrap}>
        <BackpackMini />
      </View>

      <View style={styles.heroLanternWrap}>
        <LanternMini />
      </View>
    </View>
  );
}

function PrimaryActionCard() {
  return (
    <View style={styles.primaryCard}>
      <View style={styles.primaryArtWrap}>
        <HouseArt />
      </View>

      <View style={styles.primaryTextWrap}>
        <Text style={styles.primaryTitle}>
          Find Home <Text style={styles.primaryHeart}>{'<3'}</Text>
        </Text>
        <Text style={styles.primaryDescription}>I’ll help you find your way back.</Text>
      </View>

      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>→</Text>
      </Pressable>
    </View>
  );
}

function FeatureCard({ title, accent, bullets, action, renderArt, isRightColumn }) {
  return (
    <View
      style={[
        styles.featureCard,
        { marginRight: isRightColumn ? 0 : 10, marginLeft: isRightColumn ? 10 : 0 },
      ]}
    >
      <View style={styles.featureCardTop}>
        <View style={styles.featureCardCopy}>
          <Text style={[styles.featureTitle, { color: accent }]}>{title}</Text>
          <View style={styles.bulletList}>
            {bullets.map((bullet) => (
              <View key={bullet} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: accent }]} />
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.featureArtWrap}>{renderArt()}</View>
      </View>

      <Pressable style={[styles.featureButton, { backgroundColor: accent + '26' }]}>
         <Text style={[styles.featureButtonText, { color: accent }]}>{action + ' >'}</Text>
      </Pressable>
    </View>
  );
}

function StatsBar() {
  return (
    <View style={styles.statsBar}>
      <View style={styles.statsLeft}>
        <View style={styles.statsMascotWrap}>
          <Mascot size={58} />
        </View>
        <View>
          <Text style={styles.statsTitle}>Traveling together</Text>
          <Text style={styles.statsSubtitle}>You and XiaoBai</Text>
        </View>
      </View>

      <View style={styles.statsDivider} />

      <View style={styles.statsMetric}>
        <Text style={styles.statsMetricValue}>12</Text>
        <Text style={styles.statsMetricLabel}>Places</Text>
      </View>

      <View style={styles.statsMetric}>
        <Text style={styles.statsMetricValue}>5</Text>
        <Text style={styles.statsMetricLabel}>Notes</Text>
      </View>

      <Pressable style={styles.statsArrowButton}>
        <Text style={styles.statsArrow}>›</Text>
      </Pressable>
    </View>
  );
}

function BottomNav() {
  return (
    <View style={styles.bottomNav}>
      <View style={styles.bottomNavRow}>
        {navItems.slice(0, 2).map((item) => (
          <NavItem key={item.key} {...item} />
        ))}

        <View style={styles.navCenterSpacer} />

        {navItems.slice(2).map((item) => (
          <NavItem key={item.key} {...item} />
        ))}
      </View>

      <Pressable style={styles.centerButton}>
        <Mascot size={58} />
      </Pressable>
    </View>
  );
}

function NavItem({ label, icon, active }) {
  return (
    <Pressable style={styles.navItem}>
      <Text style={[styles.navIcon, active && styles.navIconActive]}>{icon}</Text>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function Mascot({ size = 180 }) {
  const earWidth = size * 0.28;
  const earHeight = size * 0.34;
  const faceSize = size * 0.78;
  const eyeSize = size * 0.09;
  const blushSize = size * 0.10;
  const noseSize = size * 0.08;

  return (
    <View style={[styles.mascot, { width: size, height: size }]}> 
      <View
        style={[
          styles.mascotEar,
          {
            width: earWidth,
            height: earHeight,
            left: size * 0.07,
            top: size * 0.02,
            transform: [{ rotate: '-16deg' }],
          },
        ]}
      />
      <View
        style={[
          styles.mascotEar,
          {
            width: earWidth,
            height: earHeight,
            right: size * 0.07,
            top: size * 0.02,
            transform: [{ rotate: '16deg' }],
          },
        ]}
      />

      <View style={[styles.mascotFace, { width: faceSize, height: faceSize, borderRadius: faceSize / 2 }]}>
        <View style={[styles.mascotEye, { width: eyeSize, height: eyeSize, left: faceSize * 0.23, top: faceSize * 0.33 }]} />
        <View style={[styles.mascotEye, { width: eyeSize, height: eyeSize, right: faceSize * 0.23, top: faceSize * 0.33 }]} />
        <View style={[styles.mascotEyeShine, { width: eyeSize * 0.28, height: eyeSize * 0.28, left: faceSize * 0.28, top: faceSize * 0.39 }]} />
        <View style={[styles.mascotEyeShine, { width: eyeSize * 0.28, height: eyeSize * 0.28, right: faceSize * 0.18, top: faceSize * 0.39 }]} />
        <View style={[styles.mascotBlush, { width: blushSize, height: blushSize * 0.72, left: faceSize * 0.10, top: faceSize * 0.56 }]} />
        <View style={[styles.mascotBlush, { width: blushSize, height: blushSize * 0.72, right: faceSize * 0.10, top: faceSize * 0.56 }]} />
        <View style={[styles.mascotNose, { width: noseSize, height: noseSize * 0.72, top: faceSize * 0.50 }]} />
        <View style={[styles.mascotMouth, { width: faceSize * 0.17, height: faceSize * 0.08, top: faceSize * 0.63 }]} />
      </View>
    </View>
  );
}

function WindowScene() {
  return (
    <View style={styles.windowScene}>
      <View style={styles.windowSky} />
      <View style={styles.windowMist} />
      <View style={styles.windowHillBack} />
      <View style={styles.windowHillFront} />
      <View style={styles.windowTowerBase} />
      <View style={styles.windowTowerRoof} />
      <View style={styles.windowTowerTop} />
    </View>
  );
}

function Postcard() {
  return (
    <View style={styles.postcard}>
      <View style={styles.postcardClip} />
      <View style={styles.postcardPhoto}>
        <View style={styles.postcardSun} />
        <View style={styles.postcardMountainBack} />
        <View style={styles.postcardMountainFront} />
      </View>
      <Text style={styles.postcardTitle}>Together</Text>
      <Text style={styles.postcardCaption}>We go anywhere</Text>
    </View>
  );
}

function PlantPot() {
  return (
    <View style={styles.plantPot}>
      <View style={styles.plantLeaves}>
        <View style={[styles.plantLeaf, styles.plantLeafLeft]} />
        <View style={[styles.plantLeaf, styles.plantLeafCenter]} />
        <View style={[styles.plantLeaf, styles.plantLeafRight]} />
      </View>
      <View style={styles.plantCup} />
      <Text style={styles.plantLabel}>Good Trip!</Text>
    </View>
  );
}

function BackpackMini() {
  return (
    <View style={styles.backpackMini}>
      <View style={styles.backpackHandle} />
      <View style={styles.backpackBody}>
        <View style={styles.backpackPocket} />
        <View style={styles.backpackStrapLeft} />
        <View style={styles.backpackStrapRight} />
      </View>
      <View style={styles.backpackTag}>
        <Text style={styles.backpackTagText}>XiaoBai</Text>
      </View>
    </View>
  );
}

function LanternMini() {
  return (
    <View style={styles.lanternMini}>
      <View style={styles.lanternTop} />
      <View style={styles.lanternBody}>
        <View style={styles.lanternPaw} />
      </View>
      <View style={styles.lanternBase} />
    </View>
  );
}

function HouseArt() {
  return (
    <View style={styles.artShell}>
      <View style={[styles.artRoof, { backgroundColor: COLORS.coral }]} />
      <View style={[styles.artHouseBody, { backgroundColor: '#FFF5EB' }]} />
      <View style={[styles.artDoor, { backgroundColor: COLORS.peach }]} />
      <View style={[styles.artTreeTrunk, { backgroundColor: '#C28C56' }]} />
      <View style={[styles.artTreeTop, { backgroundColor: COLORS.green }]} />
    </View>
  );
}

function MapArt() {
  return (
    <View style={styles.artShell}>
      <View style={[styles.mapPanel, { backgroundColor: '#EEF6DA' }]} />
      <View style={[styles.mapPanel, styles.mapPanelMiddle, { backgroundColor: '#F9F3D5' }]} />
      <View style={[styles.mapPanel, styles.mapPanelRight, { backgroundColor: '#E7F0D6' }]} />
      <View style={[styles.mapRouteLine, { backgroundColor: COLORS.green }]} />
      <View style={styles.mapPin}>
        <View style={styles.mapPinInner} />
      </View>
    </View>
  );
}

function BagArt() {
  return (
    <View style={styles.artShell}>
      <View style={[styles.bagHandle, { borderColor: COLORS.gold }]} />
      <View style={[styles.bagBody, { backgroundColor: '#F6E4C0' }]} />
      <View style={[styles.bagPocket, { backgroundColor: '#FDF4D8' }]} />
      <View style={[styles.bagPocketLine, { backgroundColor: COLORS.gold }]} />
      <View style={[styles.bagSidePocketLeft, { backgroundColor: '#EFDAB2' }]} />
      <View style={[styles.bagSidePocketRight, { backgroundColor: '#EFDAB2' }]} />
    </View>
  );
}

function BookArt() {
  return (
    <View style={styles.artShell}>
      <View style={[styles.bookPageLeft, { backgroundColor: '#FFF9F1' }]} />
      <View style={[styles.bookPageRight, { backgroundColor: '#F9F4FF' }]} />
      <View style={styles.bookSpine} />
      <View style={[styles.bookRibbon, { backgroundColor: COLORS.purple }]} />
      <View style={[styles.bookStickerOne, { backgroundColor: COLORS.gold }]} />
      <View style={[styles.bookStickerTwo, { backgroundColor: COLORS.coral }]} />
    </View>
  );
}

function KitArt() {
  return (
    <View style={styles.artShell}>
      <View style={[styles.kitBody, { backgroundColor: '#F9C2B9' }]} />
      <View style={styles.kitHandle} />
      <View style={styles.kitCrossVertical} />
      <View style={styles.kitCrossHorizontal} />
      <View style={styles.kitPawOne} />
      <View style={styles.kitPawTwo} />
    </View>
  );
}

function BackpackArt() {
  return (
    <View style={styles.artShell}>
      <View style={styles.backpackArtHandle} />
      <View style={[styles.backpackArtBody, { backgroundColor: '#F3D6A0' }]} />
      <View style={styles.backpackArtPocket} />
      <View style={styles.backpackArtBadge}>
        <Text style={styles.backpackArtBadgeText}>H</Text>
      </View>
    </View>
  );
}

function BadgeArt() {
  return (
    <View style={styles.artShell}>
      <View style={[styles.badgeArtCircle, { backgroundColor: '#FFF7EF' }]} />
      <Text style={styles.badgeArtText}>AI</Text>
    </View>
  );
}

function MiniNote() {
  return (
    <View style={styles.miniNote}>
      <View style={styles.miniNoteLine} />
      <View style={styles.miniNoteLineShort} />
    </View>
  );
}

function iconButton() {}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  glowTopLeft: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    top: -90,
    left: -80,
    backgroundColor: '#FFF8EE',
    opacity: 0.85,
  },
  glowBottomRight: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    bottom: -120,
    right: -120,
    backgroundColor: '#FFF3EA',
    opacity: 0.8,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  offlineBadge: {
    width: 94,
    minHeight: 132,
    borderRadius: 30,
    backgroundColor: COLORS.card,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(242, 225, 205, 0.85)',
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 24,
    elevation: 6,
  },
  offlineMascotWrap: {
    marginTop: 2,
  },
  offlineBadgeText: {
    color: COLORS.text,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 17,
    fontWeight: '700',
    marginTop: -2,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#B4D66D',
    position: 'absolute',
    right: 14,
    top: 48,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  settingsButton: {
    width: 60,
    height: 60,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 24,
    elevation: 6,
  },
  settingsIcon: {
    fontSize: 27,
    color: COLORS.text,
    marginTop: -1,
  },
  titleBlock: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 42,
    lineHeight: 46,
    letterSpacing: 0.2,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 18,
    lineHeight: 22,
    color: COLORS.muted,
    textAlign: 'center',
  },
  heroScene: {
    minHeight: 420,
    marginTop: 2,
    marginBottom: 12,
    position: 'relative',
  },
  windowFrame: {
    position: 'absolute',
    left: -8,
    top: 40,
    width: 122,
    height: 192,
    borderRadius: 30,
    padding: 10,
    backgroundColor: '#F3E7D5',
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 24,
    elevation: 4,
  },
  windowScene: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: '#DCECF7',
    overflow: 'hidden',
    position: 'relative',
  },
  windowSky: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#DDECF7',
  },
  windowMist: {
    position: 'absolute',
    left: -8,
    top: 0,
    width: 90,
    height: 130,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  windowHillBack: {
    position: 'absolute',
    left: -20,
    right: -10,
    bottom: 18,
    height: 62,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: 'rgba(198, 219, 226, 0.95)',
    transform: [{ scaleX: 1.1 }],
  },
  windowHillFront: {
    position: 'absolute',
    left: -8,
    right: -8,
    bottom: 0,
    height: 48,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: '#B8D4DB',
  },
  windowTowerBase: {
    position: 'absolute',
    left: 43,
    bottom: 34,
    width: 18,
    height: 34,
    borderRadius: 4,
    backgroundColor: '#E8E0D0',
  },
  windowTowerRoof: {
    position: 'absolute',
    left: 39,
    bottom: 62,
    width: 26,
    height: 26,
    transform: [{ rotate: '45deg' }],
    borderRadius: 4,
    backgroundColor: '#C39A67',
  },
  windowTowerTop: {
    position: 'absolute',
    left: 47,
    bottom: 56,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8D6B48',
  },
  postcardWrap: {
    position: 'absolute',
    right: -2,
    top: 34,
    width: 126,
    transform: [{ rotate: '-4deg' }],
  },
  postcard: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: COLORS.card,
    padding: 10,
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 22,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(242, 225, 205, 0.8)',
  },
  postcardClip: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -6,
    width: 12,
    height: 18,
    borderRadius: 7,
    backgroundColor: '#E0C39C',
  },
  postcardPhoto: {
    height: 78,
    borderRadius: 12,
    backgroundColor: '#E5CFB0',
    overflow: 'hidden',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  postcardSun: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F8E2B1',
  },
  postcardMountainBack: {
    position: 'absolute',
    left: -10,
    right: -10,
    bottom: 13,
    height: 28,
    backgroundColor: '#C9B28E',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    transform: [{ scaleX: 1.1 }],
  },
  postcardMountainFront: {
    position: 'absolute',
    left: 12,
    right: 20,
    bottom: 0,
    height: 30,
    backgroundColor: '#AF8F64',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  postcardTitle: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  postcardCaption: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '500',
  },
  heroMascotArea: {
    alignSelf: 'center',
    marginTop: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroRug: {
    position: 'absolute',
    bottom: 10,
    width: 200,
    height: 44,
    borderRadius: 999,
    backgroundColor: '#F3E2C7',
    opacity: 0.95,
    shadowColor: '#D6B98C',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 3,
  },
  speechBubble: {
    position: 'absolute',
    right: 6,
    top: 135,
    width: 176,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 34,
    backgroundColor: COLORS.card,
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 24,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(242, 225, 205, 0.72)',
  },
  speechBubbleText: {
    fontSize: 17,
    lineHeight: 25,
    color: COLORS.text,
    fontWeight: '600',
  },
  speechTail: {
    position: 'absolute',
    bottom: 8,
    left: 14,
    width: 22,
    height: 22,
    backgroundColor: COLORS.card,
    transform: [{ rotate: '45deg' }],
    borderBottomLeftRadius: 6,
  },
  heroPlantWrap: {
    position: 'absolute',
    left: 6,
    bottom: 50,
  },
  heroBagWrap: {
    position: 'absolute',
    right: 28,
    bottom: 40,
  },
  heroLanternWrap: {
    position: 'absolute',
    right: 0,
    bottom: 12,
  },
  mascot: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotEar: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#FFF6ED',
    shadowColor: 'rgba(119, 93, 58, 0.08)',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
  },
  mascotFace: {
    backgroundColor: '#FFFDFC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(119, 93, 58, 0.10)',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
  },
  mascotEye: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#2E2016',
  },
  mascotEyeShine: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  mascotBlush: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(239, 164, 154, 0.45)',
  },
  mascotNose: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#2B1D13',
    top: 0,
  },
  mascotMouth: {
    position: 'absolute',
    borderBottomWidth: 3,
    borderColor: '#2B1D13',
    borderRadius: 12,
    top: 0,
  },
  plantPot: {
    alignItems: 'center',
    width: 70,
  },
  plantLeaves: {
    height: 44,
    width: 60,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: -4,
  },
  plantLeaf: {
    position: 'absolute',
    bottom: 4,
    width: 16,
    height: 30,
    borderRadius: 999,
    backgroundColor: '#C3D894',
  },
  plantLeafLeft: {
    left: 6,
    transform: [{ rotate: '-22deg' }],
  },
  plantLeafCenter: {
    top: 0,
    width: 18,
    height: 34,
  },
  plantLeafRight: {
    right: 6,
    transform: [{ rotate: '20deg' }],
  },
  plantCup: {
    width: 54,
    height: 36,
    borderRadius: 16,
    backgroundColor: '#F3E2C6',
    borderWidth: 1,
    borderColor: 'rgba(192, 152, 105, 0.34)',
  },
  plantLabel: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: '#B07A45',
  },
  backpackMini: {
    width: 106,
    height: 120,
    alignItems: 'center',
  },
  backpackHandle: {
    width: 26,
    height: 10,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderWidth: 3,
    borderBottomWidth: 0,
    borderColor: '#C7995E',
    marginBottom: -1,
  },
  backpackBody: {
    width: 88,
    height: 92,
    borderRadius: 24,
    backgroundColor: '#EFD6AB',
    borderWidth: 1,
    borderColor: 'rgba(194, 145, 91, 0.26)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backpackPocket: {
    width: 48,
    height: 28,
    borderRadius: 12,
    backgroundColor: '#F6E8CF',
  },
  backpackStrapLeft: {
    position: 'absolute',
    left: 10,
    top: 30,
    width: 10,
    height: 30,
    borderRadius: 6,
     top: 0,
     left: 0,
     right: 0,
     bottom: 0,
  },
  backpackStrapRight: {
    position: 'absolute',
    right: 10,
    top: 30,
    width: 10,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#D3B17B',
  },
  backpackTag: {
    position: 'absolute',
    bottom: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#F4E5CD',
    borderWidth: 1,
    borderColor: 'rgba(176, 126, 73, 0.28)',
  },
  backpackTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9C6E3D',
  },
  lanternMini: {
    width: 58,
    alignItems: 'center',
  },
  lanternTop: {
    width: 18,
    height: 12,
    borderRadius: 8,
    backgroundColor: '#D6A86E',
  },
  lanternBody: {
    marginTop: -2,
    width: 42,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FFEFC7',
    borderWidth: 1,
    borderColor: 'rgba(197, 150, 83, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(255, 229, 155, 0.4)',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
  },
  lanternPaw: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F2D681',
    shadowColor: 'rgba(214, 170, 90, 0.18)',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  lanternBase: {
    width: 28,
    height: 8,
    borderRadius: 4,
    marginTop: -2,
    backgroundColor: '#D6A86E',
  },
  primaryCard: {
    minHeight: 124,
    borderRadius: 32,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: 'rgba(242, 225, 205, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 24,
    elevation: 6,
    marginBottom: 16,
  },
  primaryArtWrap: {
    width: 88,
    height: 88,
    marginRight: 10,
  },
  primaryTextWrap: {
    flex: 1,
    paddingRight: 6,
  },
  primaryTitle: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    color: COLORS.text,
  },
  primaryHeart: {
    color: COLORS.rose,
    fontSize: 20,
  },
  primaryDescription: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.text,
    opacity: 0.82,
    fontWeight: '500',
  },
  primaryButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: COLORS.rose,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(240, 168, 163, 0.4)',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFF7F3',
    fontSize: 30,
    lineHeight: 30,
    fontWeight: '700',
    marginTop: -2,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  featureCard: {
    width: '48%',
    minHeight: 222,
    borderRadius: 28,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: 'rgba(242, 225, 205, 0.85)',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
    marginBottom: 14,
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 22,
    elevation: 5,
  },
  featureCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flex: 1,
  },
  featureCardCopy: {
    flex: 1,
    paddingRight: 8,
  },
  featureTitle: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
    marginBottom: 10,
  },
  bulletList: {
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
  },
  featureArtWrap: {
    width: 90,
    height: 110,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  featureButton: {
    alignSelf: 'flex-start',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  featureButtonText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
  },
  artShell: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  artRoof: {
    position: 'absolute',
    top: 10,
    width: 34,
    height: 34,
    borderRadius: 8,
    transform: [{ rotate: '45deg' }],
  },
  artHouseBody: {
    position: 'absolute',
    bottom: 14,
    width: 54,
    height: 42,
    borderRadius: 16,
  },
  artDoor: {
    position: 'absolute',
    bottom: 14,
    width: 14,
    height: 22,
    borderRadius: 8,
  },
  artTreeTrunk: {
    position: 'absolute',
    right: 10,
    bottom: 18,
    width: 7,
    height: 20,
    borderRadius: 4,
  },
  artTreeTop: {
    position: 'absolute',
    right: 2,
    bottom: 28,
    width: 28,
    height: 28,
    borderRadius: 999,
  },
  mapPanel: {
    position: 'absolute',
    left: 4,
    bottom: 12,
    width: 26,
    height: 58,
    borderRadius: 10,
    transform: [{ rotate: '-8deg' }],
  },
  mapPanelMiddle: {
    left: 24,
    bottom: 10,
    width: 26,
    height: 62,
    transform: [{ rotate: '2deg' }],
  },
  mapPanelRight: {
    left: 45,
    bottom: 14,
    width: 26,
    height: 56,
    transform: [{ rotate: '10deg' }],
  },
  mapRouteLine: {
    position: 'absolute',
    left: 16,
    bottom: 24,
    width: 48,
    height: 6,
    borderRadius: 3,
    opacity: 0.7,
  },
  mapPin: {
    position: 'absolute',
    right: 18,
    top: 12,
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: COLORS.coral,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '6deg' }],
  },
  mapPinInner: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#FFF7F2',
  },
  bagHandle: {
    position: 'absolute',
    top: 2,
    width: 28,
    height: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 3,
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
  },
  bagBody: {
    position: 'absolute',
    bottom: 12,
    width: 60,
    height: 70,
    borderRadius: 18,
  },
  bagPocket: {
    position: 'absolute',
    bottom: 22,
    width: 30,
    height: 18,
    borderRadius: 9,
  },
  bagPocketLine: {
    position: 'absolute',
    bottom: 35,
    width: 26,
    height: 3,
    borderRadius: 2,
  },
  bagSidePocketLeft: {
    position: 'absolute',
    left: 4,
    bottom: 20,
    width: 7,
    height: 26,
    borderRadius: 5,
  },
  bagSidePocketRight: {
    position: 'absolute',
    right: 4,
    bottom: 20,
    width: 7,
    height: 26,
    borderRadius: 5,
  },
  bookPageLeft: {
    position: 'absolute',
    left: 4,
    bottom: 16,
    width: 32,
    height: 50,
    borderRadius: 10,
    transform: [{ rotate: '-8deg' }],
  },
  bookPageRight: {
    position: 'absolute',
    right: 4,
    bottom: 14,
    width: 32,
    height: 54,
    borderRadius: 10,
    transform: [{ rotate: '7deg' }],
  },
  bookSpine: {
    position: 'absolute',
    left: '50%',
    marginLeft: -3,
    bottom: 14,
    width: 6,
    height: 56,
    borderRadius: 3,
    backgroundColor: '#C8B0F3',
  },
  bookRibbon: {
    position: 'absolute',
    left: '50%',
    marginLeft: -1,
    bottom: 12,
    width: 2,
    height: 42,
    borderRadius: 1,
  },
  bookStickerOne: {
    position: 'absolute',
    left: 10,
    top: 16,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  bookStickerTwo: {
    position: 'absolute',
    right: 14,
    top: 24,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  kitBody: {
    position: 'absolute',
    bottom: 12,
    width: 64,
    height: 62,
    borderRadius: 16,
  },
  kitHandle: {
    position: 'absolute',
    top: 12,
    width: 28,
    height: 12,
    borderRadius: 7,
    backgroundColor: '#D26F62',
  },
  kitCrossVertical: {
    position: 'absolute',
    bottom: 28,
    width: 9,
    height: 30,
    borderRadius: 5,
    backgroundColor: '#FFF7F3',
  },
  kitCrossHorizontal: {
    position: 'absolute',
    bottom: 38,
    width: 30,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#FFF7F3',
  },
  kitPawOne: {
    position: 'absolute',
    right: 8,
    top: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F7E5E2',
  },
  kitPawTwo: {
    position: 'absolute',
    left: 8,
    bottom: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F7E5E2',
  },
  statsBar: {
    minHeight: 92,
    borderRadius: 28,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: 'rgba(242, 225, 205, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 24,
    elevation: 5,
    marginBottom: 16,
  },
  statsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statsMascotWrap: {
    marginRight: 10,
  },
  statsTitle: {
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  statsSubtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.muted,
    fontWeight: '500',
  },
  statsDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 12,
    backgroundColor: 'rgba(149, 117, 88, 0.16)',
  },
  statsMetric: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  statsMetricValue: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  statsMetricLabel: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 15,
    color: COLORS.muted,
    fontWeight: '600',
  },
  statsArrowButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FAEFE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsArrow: {
    fontSize: 26,
    lineHeight: 26,
    color: '#D08E82',
    marginTop: -2,
  },
  bottomNav: {
    borderRadius: 30,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: 'rgba(242, 225, 205, 0.85)',
    paddingHorizontal: 14,
    paddingTop: 24,
    paddingBottom: 12,
    position: 'relative',
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 24,
    elevation: 7,
    marginBottom: 6,
  },
  bottomNavRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  navCenterSpacer: {
    width: 72,
  },
  navItem: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  navIcon: {
    fontSize: 27,
    lineHeight: 30,
    color: '#8F7763',
  },
  navIconActive: {
    color: COLORS.coral,
  },
  navLabel: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 14,
    color: '#8F7763',
    fontWeight: '600',
  },
  navLabelActive: {
    color: COLORS.coral,
  },
  centerButton: {
    position: 'absolute',
    top: -30,
    left: '50%',
    marginLeft: -38,
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F5E0D4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(181, 138, 111, 0.26)',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 22,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(242, 225, 205, 0.75)',
  },
});
