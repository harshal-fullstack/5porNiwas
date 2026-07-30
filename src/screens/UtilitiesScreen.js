// src/screens/UtilitiesScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { 
  Zap, 
  Droplet, 
  Wifi, 
  Users, 
  Wrench, 
  Plus, 
  Edit3, 
  IndianRupee, 
  Check, 
  X, 
  TrendingUp, 
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../theme/theme';
import ProgressRing from '../components/ProgressRing';

export default function UtilitiesScreen({ 
  utilities, 
  roomMeters, 
  tenants, 
  onUpdateMeter, 
  onBillRoom, 
  onAddUtilityBill 
}) {
  const [activeTab, setActiveTab] = useState('meters'); // 'meters' or 'expenses'
  
  // Modals state
  const [meterModalVisible, setMeterModalVisible] = useState(false);
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  
  // Edit Meter state
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [newReading, setNewReading] = useState('');
  const [newRate, setNewRate] = useState('8');
  const [meterError, setMeterError] = useState('');
  
  // Add Expense state
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseType, setExpenseType] = useState('Electricity');
  const [expenseDueDate, setExpenseDueDate] = useState('');
  const [expenseError, setExpenseError] = useState('');

  // 1. Calculations
  const totalPgExpenses = utilities.reduce((acc, u) => acc + u.amount, 0);
  
  // Calculate total room billing
  const roomBillsTotal = roomMeters.reduce((acc, meter) => {
    const units = Math.max(0, meter.currReading - meter.prevReading);
    return acc + (units * meter.rate);
  }, 0);

  // Total utilities cost
  const overallCost = totalPgExpenses + roomBillsTotal;

  // Billed rooms progress
  const totalRooms = roomMeters.length;
  const billedRoomsCount = roomMeters.filter(m => m.status === 'Paid' || m.status === 'Pending').length;
  const billingProgress = totalRooms > 0 ? billedRoomsCount / totalRooms : 0;

  // 2. Helper functions
  const getCategoryIcon = (type) => {
    switch (type) {
      case 'Electricity':
        return { icon: Zap, color: COLORS.primary, bg: 'rgba(255, 199, 44, 0.1)' };
      case 'Water':
        return { icon: Droplet, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' };
      case 'Internet':
        return { icon: Wifi, color: '#A855F7', bg: 'rgba(168, 85, 247, 0.1)' };
      case 'Staff':
        return { icon: Users, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
      case 'Maintenance':
      default:
        return { icon: Wrench, color: '#F97316', bg: 'rgba(249, 115, 22, 0.1)' };
    }
  };

  const getMeterStatusStyle = (status) => {
    switch (status) {
      case 'Paid':
        return { label: 'Billed (Paid)', bg: 'rgba(16, 185, 129, 0.15)', text: COLORS.paid };
      case 'Pending':
        return { label: 'Billed (Pending)', bg: 'rgba(245, 158, 11, 0.15)', text: COLORS.pending };
      default:
        return { label: 'Unbilled', bg: 'rgba(148, 163, 184, 0.15)', text: COLORS.textSecondary };
    }
  };

  // 3. Handlers
  const openEditMeter = (meter) => {
    setSelectedMeter(meter);
    setNewReading(meter.currReading.toString());
    setNewRate(meter.rate.toString());
    setMeterError('');
    setMeterModalVisible(true);
  };

  const saveMeterReading = () => {
    const readingVal = parseInt(newReading);
    const rateVal = parseFloat(newRate);

    if (isNaN(readingVal) || readingVal < 0) {
      setMeterError('Please enter a valid meter reading.');
      return;
    }

    if (readingVal < selectedMeter.prevReading) {
      setMeterError(`Reading cannot be less than previous (${selectedMeter.prevReading}).`);
      return;
    }

    if (isNaN(rateVal) || rateVal <= 0) {
      setMeterError('Please enter a valid rate per unit.');
      return;
    }

    onUpdateMeter(selectedMeter.roomId, readingVal, rateVal);
    setMeterModalVisible(false);
  };

  const handleCreateExpense = () => {
    const amt = parseFloat(expenseAmount);
    if (!expenseName.trim()) {
      setExpenseError('Please enter a bill description.');
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      setExpenseError('Please enter a valid amount.');
      return;
    }
    
    // Default due date to 5 days from now if not entered
    const dateStr = expenseDueDate.trim() || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    onAddUtilityBill({
      name: expenseName,
      amount: amt,
      type: expenseType,
      dueDate: dateStr,
    });

    // Reset and Close
    setExpenseName('');
    setExpenseAmount('');
    setExpenseType('Electricity');
    setExpenseDueDate('');
    setExpenseError('');
    setExpenseModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Top Banner KPI Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroTitle}>Utility Dashboard</Text>
          <Text style={styles.heroAmount}>₹{overallCost.toLocaleString('en-IN')}</Text>
          <Text style={styles.heroSubText}>This month's expenses & room charges</Text>
          
          <View style={styles.statsTrendRow}>
            <TrendingUp size={14} color={COLORS.paid} style={{ marginRight: 4 }} />
            <Text style={styles.trendText}>₹{roomBillsTotal.toLocaleString('en-IN')} calculated from meters</Text>
          </View>
        </View>
        <View style={styles.heroRight}>
          <ProgressRing
            size={90}
            strokeWidth={8}
            progress={billingProgress}
            color={COLORS.primary}
            valueText={`${Math.round(billingProgress * 100)}%`}
            labelText="Room Billed"
          />
        </View>
      </View>

      {/* Screen Mode Switches */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'meters' && styles.activeTab]}
          onPress={() => setActiveTab('meters')}
        >
          <Zap size={14} color={activeTab === 'meters' ? COLORS.primary : COLORS.textSecondary} style={{ marginRight: 6 }} />
          <Text style={[styles.tabText, activeTab === 'meters' && styles.activeTabText]}>Room Meters</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
          onPress={() => setActiveTab('expenses')}
        >
          <Droplet size={14} color={activeTab === 'expenses' ? COLORS.primary : COLORS.textSecondary} style={{ marginRight: 6 }} />
          <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>PG Expenses</Text>
        </TouchableOpacity>
      </View>

      {/* Content Rendering */}
      {activeTab === 'meters' ? (
        /* ROOM METERS VIEW */
        <FlatList
          data={roomMeters}
          keyExtractor={item => item.roomId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const tenant = tenants.find(t => t.roomNumber === item.roomNumber);
            const unitsConsumed = Math.max(0, item.currReading - item.prevReading);
            const totalCharge = unitsConsumed * item.rate;
            const statusStyle = getMeterStatusStyle(item.status);
            const isVacant = !tenant;

            return (
              <View style={styles.meterCard}>
                {/* Header */}
                <View style={styles.meterHeader}>
                  <View>
                    <Text style={styles.roomNo}>Room {item.roomNumber}</Text>
                    <Text style={styles.tenantName}>{isVacant ? 'Vacant Room' : tenant.name}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusLabel, { color: statusStyle.text }]}>{statusStyle.label}</Text>
                  </View>
                </View>

                {/* Sub-meter stats */}
                <View style={styles.statsRow}>
                  <View style={styles.statCol}>
                    <Text style={styles.statLabel}>Prev Reading</Text>
                    <Text style={styles.statVal}>{item.prevReading} kWh</Text>
                  </View>
                  <View style={styles.statCol}>
                    <Text style={styles.statLabel}>Current Reading</Text>
                    <Text style={styles.statVal}>{item.currReading} kWh</Text>
                  </View>
                  <View style={styles.statCol}>
                    <Text style={styles.statLabel}>Units Used</Text>
                    <Text style={[styles.statVal, { color: COLORS.primary }]}>{unitsConsumed}</Text>
                  </View>
                </View>

                {/* Pricing summary */}
                <View style={styles.billingSummaryRow}>
                  <Text style={styles.rateLabel}>Rate: ₹{item.rate}/unit</Text>
                  <Text style={styles.chargeLabel}>
                    Total: <Text style={styles.chargeVal}>₹{totalCharge.toLocaleString('en-IN')}</Text>
                  </Text>
                </View>

                {/* Actions */}
                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={styles.editBtn}
                    onPress={() => openEditMeter(item)}
                  >
                    <Edit3 size={14} color={COLORS.textPrimary} style={{ marginRight: 6 }} />
                    <Text style={styles.editBtnText}>Update Meter</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[
                      styles.billBtn, 
                      (item.status === 'Paid' || item.status === 'Pending' || isVacant) && styles.billBtnDisabled
                    ]}
                    disabled={item.status === 'Paid' || item.status === 'Pending' || isVacant}
                    onPress={() => onBillRoom(item.roomId)}
                  >
                    <Check size={14} color={item.status === 'Unbilled' && !isVacant ? '#0F172A' : COLORS.textMuted} style={{ marginRight: 6 }} />
                    <Text style={[
                      styles.billBtnText, 
                      (item.status === 'Paid' || item.status === 'Pending' || isVacant) && { color: COLORS.textMuted }
                    ]}>
                      {item.status === 'Unbilled' ? 'Generate Bill' : 'Bill Sent'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      ) : (
        /* PG GENERAL EXPENSES VIEW */
        <View style={{ flex: 1 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shared Monthly Bills</Text>
            <TouchableOpacity 
              style={styles.addBillBtn}
              onPress={() => setExpenseModalVisible(true)}
            >
              <Plus size={14} color="#0F172A" style={{ marginRight: 4 }} />
              <Text style={styles.addBillBtnText}>Add Bill</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={utilities}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const design = getCategoryIcon(item.type);
              const CatIcon = design.icon;

              return (
                <View style={styles.expenseCard}>
                  <View style={styles.expenseLeft}>
                    <View style={[styles.iconWrapper, { backgroundColor: design.bg }]}>
                      <CatIcon size={18} color={design.color} />
                    </View>
                    <View>
                      <Text style={styles.expenseName}>{item.name}</Text>
                      <View style={styles.expenseMetaRow}>
                        <Calendar size={12} color={COLORS.textMuted} style={{ marginRight: 4 }} />
                        <Text style={styles.expenseMetaText}>Due: {item.dueDate}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.expenseRight}>
                    <Text style={styles.expenseAmount}>₹{item.amount.toLocaleString('en-IN')}</Text>
                    <View style={styles.paidBadge}>
                      <Text style={styles.paidBadgeText}>{item.status}</Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        </View>
      )}

      {/* MODAL 1: UPDATE METER READING */}
      {selectedMeter && (
        <Modal
          visible={meterModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setMeterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
              style={styles.modalContent}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Room {selectedMeter.roomNumber} Sub-meter</Text>
                <TouchableOpacity onPress={() => setMeterModalVisible(false)}>
                  <X size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>

              {meterError ? (
                <View style={styles.errorBox}>
                  <AlertCircle size={16} color={COLORS.overdue} style={{ marginRight: 6 }} />
                  <Text style={styles.errorText}>{meterError}</Text>
                </View>
              ) : null}

              {/* Informational box */}
              <View style={styles.infoBox}>
                <Info size={16} color={COLORS.primary} style={{ marginRight: 8, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoBoxText}>
                    Last recorded reading was <Text style={{ fontWeight: '700', color: COLORS.textPrimary }}>{selectedMeter.prevReading} kWh</Text>. Enter the current reading shown on the room's physical sub-meter.
                  </Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Previous Reading (kWh)</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={selectedMeter.prevReading.toString()}
                  editable={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current Reading (kWh)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 1380"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={newReading}
                  onChangeText={(text) => {
                    setNewReading(text);
                    setMeterError('');
                  }}
                  autoFocus={true}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Rate per Unit (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="8"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={newRate}
                  onChangeText={setNewRate}
                />
              </View>

              {/* Live Preview Box */}
              {parseInt(newReading) >= selectedMeter.prevReading && (
                <View style={styles.previewBox}>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Units Consumed:</Text>
                    <Text style={styles.previewVal}>{parseInt(newReading) - selectedMeter.prevReading} units</Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Calculated Amount:</Text>
                    <Text style={[styles.previewVal, { color: COLORS.primary, fontWeight: '700' }]}>
                      ₹{((parseInt(newReading) - selectedMeter.prevReading) * parseFloat(newRate || 0)).toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelBtn} 
                  onPress={() => setMeterModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveBtn}
                  onPress={saveMeterReading}
                >
                  <Text style={styles.saveBtnText}>Save Reading</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      )}

      {/* MODAL 2: ADD GENERAL PG EXPENSE */}
      <Modal
        visible={expenseModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setExpenseModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log PG Expense</Text>
              <TouchableOpacity onPress={() => setExpenseModalVisible(false)}>
                <X size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {expenseError ? (
              <View style={styles.errorBox}>
                <AlertCircle size={16} color={COLORS.overdue} style={{ marginRight: 6 }} />
                <Text style={styles.errorText}>{expenseError}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bill Description</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Wi-Fi internet broadband, Water Tanker"
                placeholderTextColor={COLORS.textMuted}
                value={expenseName}
                onChangeText={(text) => {
                  setExpenseName(text);
                  setExpenseError('');
                }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount (₹)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 1500"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numeric"
                value={expenseAmount}
                onChangeText={(text) => {
                  setExpenseAmount(text);
                  setExpenseError('');
                }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryRow}>
                {['Electricity', 'Water', 'Internet', 'Staff', 'Maintenance'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryTab,
                      expenseType === cat && styles.activeCategoryTab
                    ]}
                    onPress={() => setExpenseType(cat)}
                  >
                    <Text style={[
                      styles.categoryTabText,
                      expenseType === cat && styles.activeCategoryTabText
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Due Date (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD (e.g. 2026-08-05)"
                placeholderTextColor={COLORS.textMuted}
                value={expenseDueDate}
                onChangeText={setExpenseDueDate}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setExpenseModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveBtn}
                onPress={handleCreateExpense}
              >
                <Text style={styles.saveBtnText}>Log Bill</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.lg,
  },
  heroCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radiusXl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
    ...SHADOWS.premium,
  },
  heroLeft: {
    flex: 1,
  },
  heroTitle: {
    ...FONTS.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroAmount: {
    ...FONTS.titleLarge,
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginVertical: SIZES.xs,
  },
  heroSubText: {
    ...FONTS.bodySmall,
    color: COLORS.textMuted,
  },
  statsTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.sm,
  },
  trendText: {
    ...FONTS.bodySmall,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  heroRight: {
    marginLeft: SIZES.md,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: SIZES.radiusMd,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SIZES.lg,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusSm,
  },
  activeTab: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabText: {
    ...FONTS.bodySmall,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.textPrimary,
  },
  listContent: {
    gap: SIZES.md,
    paddingBottom: 120, // Tabbar cushion
  },
  meterCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.md,
  },
  meterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  roomNo: {
    ...FONTS.bodyLarge,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  tenantName: {
    ...FONTS.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: 2,
    borderRadius: SIZES.radiusSm,
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: SIZES.sm,
    borderRadius: SIZES.radiusSm,
    marginBottom: SIZES.sm,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  statVal: {
    ...FONTS.bodyMedium,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  billingSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
    paddingHorizontal: 4,
  },
  rateLabel: {
    ...FONTS.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  chargeLabel: {
    ...FONTS.bodySmall,
    color: COLORS.textSecondary,
  },
  chargeVal: {
    ...FONTS.bodyLarge,
    fontWeight: '800',
    color: COLORS.primary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SIZES.sm - 2,
    borderRadius: SIZES.radiusSm,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  billBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.sm - 2,
    borderRadius: SIZES.radiusSm,
  },
  billBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  billBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    ...FONTS.titleSmall,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  addBillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.md,
    paddingVertical: 6,
    borderRadius: SIZES.radiusFull,
  },
  addBillBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  expenseCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  expenseName: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  expenseMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  expenseMetaText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    ...FONTS.bodyLarge,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  paidBadge: {
    marginTop: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paidBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.paid,
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.overlayBg,
    padding: SIZES.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radiusXl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  modalTitle: {
    ...FONTS.titleSmall,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: SIZES.sm,
    borderRadius: SIZES.radiusSm,
    marginBottom: SIZES.md,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.overdue,
    fontWeight: '600',
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 199, 44, 0.05)',
    padding: SIZES.sm,
    borderRadius: SIZES.radiusSm,
    marginBottom: SIZES.md,
  },
  infoBoxText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  inputGroup: {
    marginBottom: SIZES.md,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm - 2,
    color: COLORS.textPrimary,
    ...FONTS.bodyMedium,
  },
  disabledInput: {
    backgroundColor: 'rgba(255,255,255,0.01)',
    color: COLORS.textMuted,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.xs,
    marginTop: 4,
  },
  categoryTab: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSm,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeCategoryTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryTabText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeCategoryTabText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  previewBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: SIZES.radiusSm,
    padding: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SIZES.md,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  previewLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  previewVal: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SIZES.md,
    marginTop: SIZES.md,
  },
  cancelBtn: {
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.lg,
    borderRadius: SIZES.radiusSm,
    backgroundColor: 'transparent',
  },
  cancelBtnText: {
    ...FONTS.bodyMedium,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  saveBtn: {
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.lg,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.primary,
  },
  saveBtnText: {
    ...FONTS.bodyMedium,
    color: '#0F172A',
    fontWeight: '700',
  },
});
