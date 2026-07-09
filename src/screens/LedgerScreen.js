// src/screens/LedgerScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { Receipt, Search, IndianRupee, ArrowDownCircle, ArrowUpRight, Plus, Check } from 'lucide-react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../theme/theme';

export default function LedgerScreen({ transactions, tenants, onAddTransaction, onViewReceipt }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form State
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI (GPay)');

  // Filter & Search Logic
  const filteredTx = transactions.filter(tx => {
    const matchesFilter = filter === 'All' || tx.status === filter;
    const matchesSearch = tx.tenantName.toLowerCase().includes(search.toLowerCase()) || 
                          tx.roomNumber.includes(search);
    return matchesFilter && matchesSearch;
  });

  const totalCollected = transactions
    .filter(t => t.status === 'Paid')
    .reduce((acc, t) => acc + t.amount, 0);

  const handleLogPayment = () => {
    if (!selectedTenantId || !amount) {
      alert('Please select a tenant and enter the amount.');
      return;
    }
    
    const tenant = tenants.find(t => t.id === selectedTenantId);
    if (!tenant) return;

    onAddTransaction({
      tenantId: tenant.id,
      tenantName: tenant.name,
      roomNumber: tenant.roomNumber,
      amount: parseFloat(amount),
      method: paymentMethod,
    });

    // Reset state & close
    setSelectedTenantId('');
    setAmount('');
    setPaymentMethod('UPI (GPay)');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Search & Filter Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Search size={16} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Search tenant or room..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity 
          style={styles.logBtn}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={16} color="#0F172A" />
          <Text style={styles.logBtnText}>Log Pay</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction status filter */}
      <View style={styles.tabContainer}>
        {['All', 'Paid', 'Pending'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, filter === tab && styles.activeTab]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredTx}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.txCard}>
            <View style={styles.txLeft}>
              <View style={[styles.iconBg, { backgroundColor: item.status === 'Paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)' }]}>
                <ArrowDownCircle size={18} color={item.status === 'Paid' ? COLORS.paid : COLORS.pending} />
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.tenantName}>{item.tenantName}</Text>
                <Text style={styles.txSubtitle}>Room {item.roomNumber} • {item.method}</Text>
                <Text style={styles.txDate}>{item.date}</Text>
              </View>
            </View>

            <View style={styles.txRight}>
              <Text style={[styles.amountText, item.status === 'Paid' ? { color: COLORS.paid } : { color: COLORS.pending }]}>
                {item.status === 'Paid' ? '+' : ''}₹{item.amount.toLocaleString('en-IN')}
              </Text>
              {item.status === 'Paid' && (
                <TouchableOpacity 
                  style={styles.receiptIconBtn}
                  onPress={() => onViewReceipt(item)}
                >
                  <Receipt size={14} color={COLORS.primary} style={{ marginRight: 2 }} />
                  <Text style={styles.receiptBtnText}>Receipt</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>No matching transactions found.</Text>
          </View>
        }
      />

      {/* Manual Payment Logger Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Manual Payment</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalBtn}>
                <Text style={styles.closeText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
              {/* Tenant Selector */}
              <Text style={styles.inputLabel}>Select Tenant</Text>
              <View style={styles.selectorWrapper}>
                {tenants.map(t => (
                  <TouchableOpacity
                    key={t.id}
                    style={[
                      styles.selectorItem,
                      selectedTenantId === t.id && styles.selectedSelectorItem
                    ]}
                    onPress={() => {
                      setSelectedTenantId(t.id);
                      setAmount(t.rentAmount.toString());
                    }}
                  >
                    <Text style={[styles.selectorText, selectedTenantId === t.id && styles.selectedSelectorText]}>
                      {t.name} (Room {t.roomNumber})
                    </Text>
                    {selectedTenantId === t.id && <Check size={14} color="#0F172A" />}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Amount Input */}
              <Text style={styles.inputLabel}>Amount Paid (₹)</Text>
              <TextInput
                placeholder="Enter Rent Amount"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                style={styles.textInput}
              />

              {/* Payment Mode Selector */}
              <Text style={styles.inputLabel}>Payment Method</Text>
              <View style={styles.paymentMethodsGrid}>
                {['UPI (GPay)', 'UPI (PhonePe)', 'Net Banking', 'Cash'].map(method => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.methodCard,
                      paymentMethod === method && styles.activeMethodCard
                    ]}
                    onPress={() => setPaymentMethod(method)}
                  >
                    <Text style={[styles.methodText, paymentMethod === method && styles.activeMethodText]}>{method}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Submit Button */}
              <TouchableOpacity 
                style={styles.submitBtn}
                onPress={handleLogPayment}
              >
                <Text style={styles.submitBtnText}>Record Payment</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.lg,
    paddingBottom: SIZES.sm,
    gap: SIZES.md,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SIZES.md,
    height: 44,
  },
  searchIcon: {
    marginRight: SIZES.sm,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    ...FONTS.bodyMedium,
    outlineStyle: 'none', // Remove web outline
  },
  logBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.md,
    height: 44,
    gap: SIZES.xs,
  },
  logBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: SIZES.lg,
    marginBottom: SIZES.sm,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: SIZES.radiusMd,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusMd - 2,
  },
  activeTab: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabText: {
    ...FONTS.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: COLORS.primary,
  },
  listContainer: {
    padding: SIZES.lg,
    paddingBottom: 80,
  },
  txCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBg: {
    width: 38,
    height: 38,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  infoCol: {
    flex: 1,
  },
  tenantName: {
    ...FONTS.bodyLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  txSubtitle: {
    ...FONTS.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  txDate: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: SIZES.xs,
  },
  amountText: {
    ...FONTS.bodyLarge,
    fontWeight: '800',
  },
  receiptIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 199, 44, 0.1)',
    paddingHorizontal: SIZES.sm,
    paddingVertical: 2,
    borderRadius: SIZES.radiusSm,
  },
  receiptBtnText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.primary,
  },
  emptyList: {
    alignItems: 'center',
    paddingVertical: SIZES.xxl,
  },
  emptyText: {
    ...FONTS.bodyMedium,
    color: COLORS.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlayBg,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.radiusXl,
    borderTopRightRadius: SIZES.radiusXl,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    maxHeight: '85%',
    padding: SIZES.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingBottom: SIZES.md,
    marginBottom: SIZES.md,
  },
  modalTitle: {
    ...FONTS.titleSmall,
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  closeModalBtn: {
    padding: SIZES.sm,
  },
  closeText: {
    ...FONTS.bodyMedium,
    color: COLORS.textSecondary,
  },
  formContainer: {
    paddingBottom: SIZES.xxl,
  },
  inputLabel: {
    ...FONTS.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: SIZES.sm,
    marginTop: SIZES.md,
  },
  selectorWrapper: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: 180,
    overflow: 'scroll',
  },
  selectorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.md,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  selectedSelectorItem: {
    backgroundColor: COLORS.primary,
  },
  selectorText: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
  },
  selectedSelectorText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.md,
    color: COLORS.textPrimary,
    ...FONTS.bodyMedium,
    outlineStyle: 'none',
  },
  paymentMethodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  methodCard: {
    backgroundColor: COLORS.cardBg,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: 100,
  },
  activeMethodCard: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(255, 199, 44, 0.05)',
  },
  methodText: {
    ...FONTS.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeMethodText: {
    color: COLORS.primary,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusMd,
    paddingVertical: SIZES.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.xl + SIZES.sm,
    ...SHADOWS.button,
  },
  submitBtnText: {
    ...FONTS.bodyLarge,
    color: '#0F172A',
    fontWeight: '700',
  },
});
