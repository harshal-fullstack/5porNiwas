// src/screens/RoomsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Phone, Calendar, IndianRupee, UserCheck, ShieldAlert, Wrench, X } from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../theme/theme';

export default function RoomsScreen({ rooms, tenants, onCollectRent }) {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeRoomId, setActiveRoomId] = useState(null);

  // Filter logic
  const filteredRooms = selectedFilter === 'All'
    ? rooms
    : rooms.filter(r => r.type.toLowerCase().includes(selectedFilter.toLowerCase().split(' ')[0]));

  const activeRoom = rooms.find(r => r.id === activeRoomId);
  const activeRoomTenants = activeRoom
    ? tenants.filter(t => activeRoom.tenantIds.includes(t.id))
    : [];

  const renderRoomStatus = (status) => {
    switch (status) {
      case 'paid':
        return { label: 'Paid', bg: 'rgba(16, 185, 129, 0.15)', text: COLORS.paid };
      case 'pending':
        return { label: 'Pending', bg: 'rgba(245, 158, 11, 0.15)', text: COLORS.pending };
      case 'overdue':
        return { label: 'Overdue', bg: 'rgba(239, 68, 68, 0.15)', text: COLORS.overdue };
      case 'maintenance':
        return { label: 'Maintenance', bg: 'rgba(59, 130, 246, 0.15)', text: COLORS.maintenance };
      default:
        return { label: 'Vacant', bg: 'rgba(100, 116, 139, 0.15)', text: COLORS.vacant };
    }
  };

  return (
    <View style={styles.container}>
      {/* Filters bar */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {['All', 'Single', 'Double', 'Triple'].map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                selectedFilter === filter && styles.activeFilterTab
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text 
                style={[
                  styles.filterText, 
                  selectedFilter === filter && styles.activeFilterText
                ]}
              >
                {filter === 'All' ? 'All Rooms' : `${filter} Share`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Grid of rooms */}
      <FlatList
        data={filteredRooms}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => {
          const statusInfo = renderRoomStatus(item.status);
          
          return (
            <TouchableOpacity
              style={[
                styles.roomCard, 
                activeRoomId === item.id && { borderColor: COLORS.primary }
              ]}
              onPress={() => setActiveRoomId(activeRoomId === item.id ? null : item.id)}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.roomNo}>Room {item.number}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                  <Text style={[styles.statusLabel, { color: statusInfo.text }]}>{statusInfo.label}</Text>
                </View>
              </View>

              <Text style={styles.roomType}>{item.type}</Text>

              {/* Occupancy dots indicator */}
              <View style={styles.occupancyRow}>
                <Text style={styles.capacityText}>Beds: </Text>
                <View style={styles.dotsContainer}>
                  {Array.from({ length: item.capacity }).map((_, i) => (
                    <View 
                      key={i} 
                      style={[
                        styles.dot, 
                        i < item.occupied 
                          ? { backgroundColor: statusInfo.text } 
                          : styles.emptyDot
                      ]}
                    />
                  ))}
                </View>
              </View>

              <Text style={styles.rentText}>₹{item.rent.toLocaleString('en-IN')}/mo</Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Tenant Details Drawer (Visible when a room is clicked) */}
      {activeRoom && (
        <View style={styles.drawerContainer}>
          <View style={styles.drawerHeader}>
            <View>
              <Text style={styles.drawerTitle}>Room {activeRoom.number} Details</Text>
              <Text style={styles.drawerSubtitle}>{activeRoom.type} • ₹{activeRoom.rent.toLocaleString('en-IN')}/mo</Text>
            </View>
            <TouchableOpacity 
              style={styles.closeDrawerBtn} 
              onPress={() => setActiveRoomId(null)}
            >
              <X size={18} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.drawerContent} showsVerticalScrollIndicator={false}>
            {activeRoomTenants.length === 0 ? (
              <View style={styles.emptyDrawer}>
                <ShieldAlert size={36} color={COLORS.textMuted} />
                <Text style={styles.emptyText}>This room is currently vacant.</Text>
              </View>
            ) : (
              activeRoomTenants.map(tenant => {
                const tenantStatus = renderRoomStatus(tenant.status);
                return (
                  <View key={tenant.id} style={styles.tenantCard}>
                    <View style={styles.tenantRowHeader}>
                      <Text style={styles.tenantName}>{tenant.name}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: tenantStatus.bg }]}>
                        <Text style={[styles.statusLabel, { color: tenantStatus.text }]}>{tenantStatus.label}</Text>
                      </View>
                    </View>

                    <View style={styles.tenantMeta}>
                      <Phone size={14} color={COLORS.textSecondary} />
                      <Text style={styles.tenantMetaText}>{tenant.phone}</Text>
                    </View>
                    
                    <View style={styles.tenantMeta}>
                      <Calendar size={14} color={COLORS.textSecondary} />
                      <Text style={styles.tenantMetaText}>Joined: {tenant.joinDate}</Text>
                    </View>

                    <View style={styles.tenantMeta}>
                      <IndianRupee size={14} color={COLORS.textSecondary} />
                      <Text style={styles.tenantMetaText}>Due Date: {tenant.dueDate}</Text>
                    </View>

                    {/* Action buttons inside drawer */}
                    <View style={styles.drawerActionsRow}>
                      {tenant.status !== 'paid' && (
                        <TouchableOpacity
                          style={styles.collectBtn}
                          onPress={() => onCollectRent(tenant.id)}
                        >
                          <IndianRupee size={14} color="#0F172A" style={{ marginRight: 4 }} />
                          <Text style={styles.collectBtnText}>Collect Rent</Text>
                        </TouchableOpacity>
                      )}
                      
                      <TouchableOpacity
                        style={styles.msgBtn}
                        onPress={() => alert(`Redirecting to call/chat with ${tenant.name}...`)}
                      >
                        <Text style={styles.msgBtnText}>Call Tenant</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterWrapper: {
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
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
    borderColor: 'rgba(255, 255, 255, 0.05)',
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
  gridContainer: {
    padding: SIZES.lg,
    paddingBottom: 280, // Safe padding for details drawer
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
    gap: SIZES.md,
  },
  roomCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.md,
    justifyContent: 'space-between',
    minHeight: 140,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  roomNo: {
    ...FONTS.titleSmall,
    fontWeight: '800',
    color: COLORS.textPrimary,
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
  roomType: {
    ...FONTS.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SIZES.sm,
  },
  occupancyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  capacityText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  rentText: {
    ...FONTS.bodyLarge,
    fontWeight: '800',
    color: COLORS.primary,
  },
  drawerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: SIZES.radiusXl,
    borderTopRightRadius: SIZES.radiusXl,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    height: 290,
    padding: SIZES.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 24,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingBottom: SIZES.md,
    marginBottom: SIZES.md,
  },
  drawerTitle: {
    ...FONTS.titleSmall,
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  drawerSubtitle: {
    ...FONTS.bodySmall,
    color: COLORS.textSecondary,
  },
  closeDrawerBtn: {
    padding: SIZES.sm,
    borderRadius: SIZES.radiusFull,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  drawerContent: {
    flex: 1,
  },
  emptyDrawer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xl,
    gap: SIZES.sm,
  },
  emptyText: {
    ...FONTS.bodyMedium,
    color: COLORS.textSecondary,
  },
  tenantCard: {
    backgroundColor: COLORS.cardBgLight,
    padding: SIZES.md,
    borderRadius: SIZES.radiusMd,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  tenantRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  tenantName: {
    ...FONTS.bodyLarge,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  tenantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
    marginVertical: 2,
  },
  tenantMetaText: {
    ...FONTS.bodySmall,
    color: COLORS.textSecondary,
  },
  drawerActionsRow: {
    flexDirection: 'row',
    gap: SIZES.md,
    marginTop: SIZES.md,
  },
  collectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusSm,
  },
  collectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  msgBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusSm,
  },
  msgBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});
