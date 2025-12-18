import {StyleSheet, Platform} from 'react-native';
import {AppColors} from '../../Common/AppColor';
import {MAX_W} from '../../Common/GlobalStyles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },

  // ===== HEADER =====
  headerContainer: {
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 1,
    zIndex: 10,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerRight: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
    color: AppColors.MainColor,
  },
  headerTitleOrange: {
    color: AppColors.Orange,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 12,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
    backgroundColor: '#1565C0',
  },
  btnHeader: {
    backgroundColor: '#f0f0f0cc',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
  },

  // ===== MEDICAL BANNER =====
  medicalBannerContainer: {
    backgroundColor: '#1565C0',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  medicalIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medicalBannerContent: {
    flex: 1,
    gap: 4,
  },
  medicalBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  medicalBannerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // ===== SCROLL VIEW =====
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 110 : 100,
  },

  // ===== HERO SECTION =====
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    borderRadius: 0,
    marginBottom: 24,
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    width: 120,
    height: 120,
  },
  heartIcon: {
    position: 'absolute',
  },
  handIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 10,
  },
  handLeftIcon: {
    marginRight: -4,
  },
  handRightIcon: {
    marginLeft: -4,
  },
  aiText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#37474f',
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 20,
    fontWeight: '600',
  },

  // ===== ANALYSIS SECTION =====
  analysisSection: {
    marginBottom: 24,
    gap: 12,
  },

  // ===== ACTION BUTTONS ROW =====
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButtonHalf: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  actionButtonTextSmall: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1565C0',
    textAlign: 'center',
  },

  // ===== ACTION BUTTON (Legacy) =====
  actionButton: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1565C0',
  },

  // ===== LATEST RESULT SECTION =====
  latestResultSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  latestResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  latestResultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1565C0',
  },
  latestResultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    // elevation: 1,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.05,
    // shadowRadius: 2,
    marginBottom: 8,
  },
  latestResultImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  latestResultInfo: {
    flex: 1,
    gap: 4,
  },
  latestResultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  latestResultConfidence: {
    fontSize: 12,
    color: '#4CAF50',
  },

  // ===== MAIN ACTION BUTTON (Legacy - keep for compatibility) =====
  mainActionButton: {
    backgroundColor: AppColors.MainColor,
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    // elevation: 4,
    // shadowColor: AppColors.MainColor,
    // shadowOffset: {width: 0, height: 4},
    // shadowOpacity: 0.3,
    // shadowRadius: 8,
  },
  mainActionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },

  // ===== FEATURES CONTAINER =====
  featuresContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  featureIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },

  // ===== PREVIEW SECTION =====
  previewSection: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewImage: {
    width: '100%',
    height: 240,
    borderRadius: 10,
    marginBottom: 16,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
  },

  // ===== BUTTONS =====
  primaryButton: {
    flex: 1,
    backgroundColor: AppColors.MainColor,
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },

  // ===== LOADING SECTION =====
  loadingSection: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },

  // ===== RESULT SECTION =====
  resultSection: {
    marginBottom: 20,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  resultImageContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  resultImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
  },

  // ===== DIAGNOSIS CONTAINER =====
  diagnosisContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  diagnosisLabel: {
    fontSize: 13,
    color: '#2E7D32',
    marginBottom: 4,
    fontWeight: '500',
  },
  diagnosisText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 10,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 13,
    color: '#2E7D32',
    marginRight: 8,
    fontWeight: '500',
  },
  confidenceValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1B5E20',
  },

  // ===== DESCRIPTION CONTAINER =====
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },

  // ===== RECOMMENDATIONS CONTAINER =====
  recommendationsContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    padding: 14,
  },
  recommendationsLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 10,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },

  // ===== RESULT ACTIONS =====
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },

  // ===== DISCLAIMER =====
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF3E0',
    padding: 14,
    borderRadius: 10,
    gap: 10,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: '#E65100',
    lineHeight: 20,
  },

  // ===== IMAGE PICKER MODAL =====
  imagePickerModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  imagePickerModalOverlay: {
    flex: 1,
  },
  imagePickerModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  imagePickerModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  imagePickerModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  imagePickerModalCloseButton: {
    padding: 4,
  },
  imagePickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  imagePickerOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  imagePickerOptionContent: {
    flex: 1,
  },
  imagePickerOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  imagePickerOptionDescription: {
    fontSize: 13,
    color: '#999',
  },

  // ===== SECTION HEADERS =====
  sectionHeaderTitleWrapper: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  sectionTitleCenter: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3748',
    textAlign: 'center',
    marginTop: 5,
  },
  secondTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#57657b',
    textAlign: 'center',
    marginBottom: 10,
  },

  // ===== GRID & CARDS =====
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  standardCardWrapper: {
    width: (MAX_W - 62) / 3,
  },
  standardCard: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    height: 110,
    borderWidth: 1,
    borderColor: '#e8f4f8',
    elevation: 1,
    backgroundColor: '#fff',
  },
  standardIconContainer: {
    backgroundColor: '#e8f4f8',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  standardIcon: {
    width: 28,
    height: 28,
  },
  standardTitle: {
    fontSize: 11,
    textAlign: 'center',
    color: '#3d566f',
    fontWeight: '600',
    paddingHorizontal: 4,
  },

  // ===== TAB VIEW STYLES =====
  pillTabViewContainer: {
    backgroundColor: '#fff',
  },
  pillTab: {
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 0,
  },
  activePillTab: {
    backgroundColor: AppColors.MainColor,
  },
  pillTabText: {
    color: '#666',
  },
  activePillTabText: {
    color: '#fff',
    fontWeight: '600',
  },

  // ===== STICKY SECTION HEADER =====
  stickySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    height: 60,
  },
  sectionAccent: {
    width: 4,
    height: 20,
    backgroundColor: AppColors.Orange,
    borderRadius: 2,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  sectionArrowButton: {
    height: 40,
    width: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },

  // ===== TAB BAR STYLES =====
  tabBarStyle: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabStyle: {
    width: 'auto',
    paddingHorizontal: 16,
  },
  indicatorStyle: {
    backgroundColor: AppColors.MainColor,
    height: 3,
    borderRadius: 1.5,
  },
  tabLabelStyle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'none',
  },
  lazyPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  lazyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },

  // ===== NEWS STYLES =====
  featuredNewsItem: {
    marginBottom: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  featuredNewsImage: {
    width: MAX_W * 0.35,
    height: (MAX_W * 0.35 * 3) / 4,
    resizeMode: 'cover',
  },
  featuredNewsContent: {
    flex: 1,
    padding: 12,
  },
  featuredNewsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginHorizontal: 10,
    marginTop: 10,
  },
  featuredNewsDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  featuredNewsDate: {
    fontSize: 11,
    color: '#999',
  },
  featuredMainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  featuredMainImage: {
    width: '100%',
    height: (MAX_W * 9) / 16,
    resizeMode: 'cover',
  },
  featuredMainItem: {
    marginBottom: 15,
    position: 'relative',
  },
  featuredMainOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
  },
  featuredNewsImageContainer: {
    flexDirection: 'row',
  },

  // ===== HISTORY =====
  historyBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#f44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  historyBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  historyModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  historyModalOverlay: {
    flex: 1,
  },
  historyModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  historyModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  // ===== BOTTOM NAVIGATION =====
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a237e',
    flexDirection: 'row',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    // elevation: 8,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: -2},
    // shadowOpacity: 0.15,
    // shadowRadius: 8,
  },
  bottomNavTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  bottomNavText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  bottomNavTextActive: {
    color: '#fff',
  },
  historyModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  clearHistoryButton: {
    padding: 4,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyModalCloseButton: {
    padding: 4,
  },
  emptyHistoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyHistoryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  historyList: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  historyItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  historyItemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  historyItemDiagnosis: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  historyItemDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  historyItemConfidence: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyItemConfidenceText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  deleteHistoryItemButton: {
    padding: 4,
    alignSelf: 'flex-start',
  },
});
