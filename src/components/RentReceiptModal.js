// src/components/RentReceiptModal.js
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { CheckCircle2, X, Download, Share2, Receipt } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS, FONTS } from '../theme/theme';

export default function RentReceiptModal({ visible, onClose, transaction, onDownload }) {
  if (!transaction) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Receipt Wrapper */}
            <View style={styles.receiptCard}>
              <View style={styles.brandingHeader}>
                <View style={styles.logoCircle}>
                  <Receipt size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.brandName}>BananaStay</Text>
                <Text style={styles.brandTagline}>Premium PG & Room Rentals</Text>
              </View>

              {/* Status Badge */}
              <View style={styles.statusSection}>
                <CheckCircle2 size={44} color={COLORS.paid} />
                <Text style={styles.statusText}>Payment Successful</Text>
                <Text style={styles.amountText}>₹{transaction.amount?.toLocaleString('en-IN')}</Text>
              </View>

              {/* Dotted Divider line */}
              <View style={styles.dividerContainer}>
                <View style={styles.dot} />
                <View style={styles.dottedLine} />
                <View style={styles.dot} />
              </View>

              {/* Receipt Details */}
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Receipt ID</Text>
                  <Text style={styles.detailValue}>{transaction.id?.toUpperCase()}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tenant Name</Text>
                  <Text style={styles.detailValue}>{transaction.tenantName}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Room Number</Text>
                  <Text style={styles.detailValue}>Room {transaction.roomNumber}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Date</Text>
                  <Text style={styles.detailValue}>{transaction.date}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Mode</Text>
                  <Text style={styles.detailValue}>{transaction.method}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Purpose</Text>
                  <Text style={styles.detailValue}>Monthly Room Rent</Text>
                </View>
              </View>
              
              <Text style={styles.thankyouText}>Thank you for staying at BananaStay!</Text>
            </View>

            {/* Actions */}
            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryButton]} 
                onPress={() => {
                  if (onDownload) onDownload();
                }}
              >
                <Download size={18} color="#0F172A" style={styles.actionIcon} />
                <Text style={styles.primaryButtonText}>Download Receipt</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => alert('Receipt link copied to clipboard!')}
              >
                <Share2 size={18} color={COLORS.textPrimary} style={styles.actionIcon} />
                <Text style={styles.secondaryButtonText}>Share Receipt</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlayBg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.lg,
  },
  modalContainer: {
    backgroundColor: COLORS.cardBg,
    width: '100%',
    maxWidth: 360,
    borderRadius: SIZES.radiusXl,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    ...SHADOWS.premium,
  },
  closeButton: {
    position: 'absolute',
    top: SIZES.lg,
    right: SIZES.lg,
    padding: SIZES.sm,
    borderRadius: SIZES.radiusFull,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    zIndex: 10,
  },
  scrollContent: {
    padding: SIZES.xl,
    alignItems: 'center',
  },
  receiptCard: {
    backgroundColor: COLORS.cardBgLight,
    width: '100%',
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: SIZES.lg,
  },
  brandingHeader: {
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 199, 44, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.sm,
  },
  brandName: {
    ...FONTS.titleSmall,
    color: COLORS.primary,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandTagline: {
    ...FONTS.bodySmall,
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusSection: {
    alignItems: 'center',
    marginVertical: SIZES.sm,
  },
  statusText: {
    ...FONTS.bodyMedium,
    color: COLORS.paid,
    fontWeight: '700',
    marginTop: SIZES.sm,
  },
  amountText: {
    ...FONTS.titleLarge,
    fontSize: 32,
    color: COLORS.textPrimary,
    marginTop: SIZES.xs,
    fontWeight: '800',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: SIZES.lg,
    overflow: 'hidden',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.cardBg, // Punch a hole visually
    marginHorizontal: -6,
  },
  dottedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderStyle: 'dashed',
    borderRadius: 1,
  },
  detailsContainer: {
    width: '100%',
    marginBottom: SIZES.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SIZES.sm - 2,
  },
  detailLabel: {
    ...FONTS.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    ...FONTS.bodySmall,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  thankyouText: {
    ...FONTS.bodySmall,
    fontSize: 10,
    fontStyle: 'italic',
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SIZES.sm,
  },
  actionContainer: {
    width: '100%',
    gap: SIZES.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMd,
    width: '100%',
    height: 48,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.button,
  },
  primaryButtonText: {
    ...FONTS.bodyLarge,
    color: '#0F172A',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    ...FONTS.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  actionIcon: {
    marginRight: SIZES.sm,
  },
});
