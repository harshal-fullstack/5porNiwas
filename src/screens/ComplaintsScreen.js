// src/screens/ComplaintsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { AlertCircle, Clock, CheckCircle2, Plus, Wrench, ShieldAlert } from 'lucide-react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../theme/theme';

export default function ComplaintsScreen({ complaints, tenants, onAddComplaint, onUpdateStatus }) {
  const [filter, setFilter] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('Medium');

  // Filter Logic
  const filteredComplaints = filter === 'All'
    ? complaints
    : complaints.filter(c => c.status === filter);

  const getPriorityColor = (p) => {
    switch (p.toLowerCase()) {
      case 'high':
        return COLORS.overdue;
      case 'medium':
        return COLORS.pending;
      default:
        return COLORS.vacant;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <AlertCircle size={16} color={COLORS.overdue} />;
      case 'In Progress':
        return <Clock size={16} color={COLORS.pending} />;
      default:
        return <CheckCircle2 size={16} color={COLORS.paid} />;
    }
  };

  const handleCreateComplaint = () => {
    if (!selectedTenantId || !title || !desc) {
      alert('Please fill in all details.');
      return;
    }

    const tenant = tenants.find(t => t.id === selectedTenantId);
    if (!tenant) return;

    onAddComplaint({
      tenantName: tenant.name,
      roomNumber: tenant.roomNumber,
      title,
      desc,
      priority,
    });

    // Reset & close
    setSelectedTenantId('');
    setTitle('');
    setDesc('');
    setPriority('Medium');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Tab filter bar */}
      <View style={styles.topBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {['All', 'Pending', 'In Progress', 'Resolved'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.filterTab, filter === tab && styles.activeFilterTab]}
              onPress={() => setFilter(tab)}
            >
              <Text style={[styles.filterText, filter === tab && styles.activeFilterText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={16} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Ticket List */}
      <FlatList
        data={filteredComplaints}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.ticketCard}>
            <View style={styles.cardHeader}>
              <View style={styles.headerLeft}>
                {getStatusIcon(item.status)}
                <Text style={styles.statusLabel}>{item.status}</Text>
              </View>
              <View style={[styles.priorityBadge, { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: getPriorityColor(item.priority), borderWidth: 1 }]}>
                <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>{item.priority} Priority</Text>
              </View>
            </View>

            <Text style={styles.ticketTitle}>{item.title}</Text>
            <Text style={styles.ticketDesc}>{item.desc}</Text>

            <View style={styles.divider} />

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.footerTenant}>{item.tenantName}</Text>
                <Text style={styles.footerRoom}>Room {item.roomNumber} • {item.date}</Text>
              </View>
              
              {/* Action Buttons depending on status */}
              <View style={styles.actionsRow}>
                {item.status === 'Pending' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.progressBtn]}
                    onPress={() => onUpdateStatus(item.id, 'In Progress')}
                  >
                    <Text style={styles.actionBtnText}>Start Work</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'In Progress' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.resolveBtn]}
                    onPress={() => onUpdateStatus(item.id, 'Resolved')}
                  >
                    <Text style={styles.resolveBtnText}>Resolve</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Wrench size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No complaints found.</Text>
          </View>
        }
      />

      {/* Log Complaint Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>File Maintenance Ticket</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalBtn}>
                <Text style={styles.closeText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
              {/* Tenant selector */}
              <Text style={styles.inputLabel}>Select Tenant Affected</Text>
              <View style={styles.selectorWrapper}>
                {tenants.map(t => (
                  <TouchableOpacity
                    key={t.id}
                    style={[
                      styles.selectorItem,
                      selectedTenantId === t.id && styles.selectedSelectorItem
                    ]}
                    onPress={() => setSelectedTenantId(t.id)}
                  >
                    <Text style={[styles.selectorText, selectedTenantId === t.id && styles.selectedSelectorText]}>
                      {t.name} (Room {t.roomNumber})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Title input */}
              <Text style={styles.inputLabel}>Issue Title</Text>
              <TextInput
                placeholder="e.g., Water leakage, WiFi disconnected"
                placeholderTextColor={COLORS.textMuted}
                value={title}
                onChangeText={setTitle}
                style={styles.textInput}
              />

              {/* Description Input */}
              <Text style={styles.inputLabel}>Detailed Description</Text>
              <TextInput
                placeholder="Describe the issue in detail..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={3}
                value={desc}
                onChangeText={setDesc}
                style={[styles.textInput, styles.textArea]}
              />

              {/* Priority Selection */}
              <Text style={styles.inputLabel}>Select Severity/Priority</Text>
              <View style={styles.prioritySelector}>
                {['Low', 'Medium', 'High'].map(p => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityCard,
                      priority === p && { borderColor: getPriorityColor(p), backgroundColor: 'rgba(255,255,255,0.03)' }
                    ]}
                    onPress={() => setPriority(p)}
                  >
                    <Text style={[styles.priorityLabelText, { color: priority === p ? getPriorityColor(p) : COLORS.textSecondary }]}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Submit Ticket */}
              <TouchableOpacity 
                style={styles.submitBtn}
                onPress={handleCreateComplaint}
              >
                <Text style={styles.submitBtnText}>Submit Complaint</Text>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  filterScroll: {
    paddingHorizontal: SIZES.lg,
    gap: SIZES.sm,
  },
  filterTab: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm - 2,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  activeFilterTab: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    ...FONTS.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#0F172A',
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.lg,
    ...SHADOWS.button,
  },
  listContainer: {
    padding: SIZES.lg,
    paddingBottom: 80,
  },
  ticketCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.md,
    marginBottom: SIZES.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  priorityBadge: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: 2,
    borderRadius: SIZES.radiusSm,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '700',
  },
  ticketTitle: {
    ...FONTS.titleSmall,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SIZES.xs,
  },
  ticketDesc: {
    ...FONTS.bodyMedium,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: SIZES.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerTenant: {
    ...FONTS.bodyMedium,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  footerRoom: {
    ...FONTS.bodySmall,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  actionBtn: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusSm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.pending,
  },
  actionBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.pending,
  },
  resolveBtn: {
    backgroundColor: COLORS.paid,
  },
  resolveBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xxl,
    gap: SIZES.sm,
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
    maxHeight: 140,
    overflow: 'scroll',
  },
  selectorItem: {
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  priorityCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SIZES.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityLabelText: {
    ...FONTS.bodySmall,
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusMd,
    paddingVertical: SIZES.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.xl,
    ...SHADOWS.button,
  },
  submitBtnText: {
    ...FONTS.bodyLarge,
    color: '#0F172A',
    fontWeight: '700',
  },
});
