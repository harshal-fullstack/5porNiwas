// src/screens/DashboardScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Users, IndianRupee, AlertTriangle, Wrench, Plus, ArrowUpRight, TrendingUp } from 'lucide-react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../theme/theme';
import MetricCard from '../components/MetricCard';
import ProgressRing from '../components/ProgressRing';

export default function DashboardScreen({ tenants, rooms, transactions, complaints, onNavigate }) {
  // Compute Dashboard Metrics
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.occupied > 0).length;
  
  // Calculate total rent amount expected vs collected
  const totalExpectedRent = tenants.reduce((acc, t) => acc + t.rentAmount, 0);
  const collectedRent = tenants
    .filter(t => t.status === 'paid')
    .reduce((acc, t) => acc + t.rentAmount, 0);
  
  const pendingRent = totalExpectedRent - collectedRent;
  const collectionRate = totalExpectedRent > 0 ? collectedRent / totalExpectedRent : 0;
  
  const overdueCount = tenants.filter(t => t.status === 'overdue').length;
  const activeComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;

  // Actions data
  const quickActions = [
    { id: 'add_tenant', title: 'Add Tenant', icon: Plus, screen: 'add' },
    { id: 'log_complaint', title: 'New Complaint', icon: Wrench, screen: 'complaints' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Banner */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome, Administrator</Text>
          <Text style={styles.pgName}>BananaStay PG Premium</Text>
        </View>
        <View style={styles.statusIndicator}>
          <View style={styles.pulseDot} />
          <Text style={styles.statusText}>Live Sync</Text>
        </View>
      </View>

      {/* Hero Financial Collection Status Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroTitle}>Collection Progress</Text>
          <Text style={styles.heroAmount}>₹{collectedRent.toLocaleString('en-IN')}</Text>
          <Text style={styles.heroSubText}>Collected of ₹{totalExpectedRent.toLocaleString('en-IN')}</Text>
          
          <View style={styles.statsTrendRow}>
            <TrendingUp size={16} color={COLORS.paid} />
            <Text style={styles.trendText}>+12.4% vs last month</Text>
          </View>
        </View>
        <View style={styles.heroRight}>
          <ProgressRing
            size={110}
            strokeWidth={10}
            progress={collectionRate}
            color={COLORS.primary}
            valueText={`${Math.round(collectionRate * 100)}%`}
            labelText="Collected"
          />
        </View>
      </View>

      {/* Main KPI Grid */}
      <View style={styles.kpiGrid}>
        <View style={styles.gridRow}>
          <MetricCard
            title="Occupancy"
            value={`${occupiedRooms}/${totalRooms} Rooms`}
            icon={Users}
            color={COLORS.primary}
            subtitle={`${totalRooms - occupiedRooms} vacant rooms`}
          />
          <MetricCard
            title="Pending Rent"
            value={`₹${pendingRent.toLocaleString('en-IN')}`}
            icon={IndianRupee}
            color={COLORS.pending}
            subtitle="Collect from 2 tenants"
          />
        </View>
        <View style={styles.gridRow}>
          <MetricCard
            title="Overdue Invoices"
            value={`${overdueCount}`}
            icon={AlertTriangle}
            color={COLORS.overdue}
            subtitle={`${overdueCount > 0 ? 'Urgent notifications sent' : 'All clean!'}`}
          />
          <MetricCard
            title="Active Complaints"
            value={`${activeComplaintsCount}`}
            icon={Wrench}
            color={COLORS.maintenance}
            subtitle={`${complaints.filter(c => c.status === 'Pending').length} pending review`}
          />
        </View>
      </View>

      {/* Quick Actions Panel */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsContainer}>
        {quickActions.map(action => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionButton}
            onPress={() => onNavigate(action.screen)}
          >
            <View style={styles.actionIconBg}>
              <action.icon size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.actionBtnText}>{action.title}</Text>
            <ArrowUpRight size={16} color={COLORS.textMuted} style={styles.arrowIcon} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Activity Section */}
      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => onNavigate('ledger')}>
          <Text style={styles.viewAllBtn}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.activityCard}>
        {transactions.slice(0, 3).map((item, index) => (
          <View 
            key={item.id} 
            style={[
              styles.activityItem, 
              index === 0 && { paddingTop: 0 },
              index === 2 && { borderBottomWidth: 0, paddingBottom: 0 }
            ]}
          >
            <View style={styles.activityLeft}>
              <View style={styles.paymentMethodBadge}>
                <Text style={styles.badgeText}>{item.method.split(' ')[0]}</Text>
              </View>
              <View>
                <Text style={styles.activityTenant}>{item.tenantName}</Text>
                <Text style={styles.activityDetails}>Room {item.roomNumber} • {item.date}</Text>
              </View>
            </View>
            <Text style={styles.activityAmount}>+₹{item.amount.toLocaleString('en-IN')}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.lg,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  greeting: {
    ...FONTS.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  pgName: {
    ...FONTS.titleMedium,
    color: COLORS.primary,
    fontWeight: '800',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusFull,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.paid,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.paid,
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
    fontSize: 30,
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
    color: COLORS.paid,
    fontWeight: '600',
    marginLeft: 4,
  },
  heroRight: {
    marginLeft: SIZES.md,
  },
  kpiGrid: {
    marginBottom: SIZES.lg,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...FONTS.titleSmall,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SIZES.sm,
    marginTop: SIZES.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.sm,
    marginBottom: SIZES.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    padding: SIZES.md,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIconBg: {
    width: 38,
    height: 38,
    borderRadius: SIZES.radiusMd,
    backgroundColor: 'rgba(255, 199, 44, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.sm,
  },
  actionBtnText: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  arrowIcon: {
    marginLeft: SIZES.xs,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  viewAllBtn: {
    ...FONTS.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.md,
    marginBottom: SIZES.xxl,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodBadge: {
    width: 44,
    height: 34,
    borderRadius: SIZES.radiusSm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.sm,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  activityTenant: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  activityDetails: {
    ...FONTS.bodySmall,
    color: COLORS.textMuted,
  },
  activityAmount: {
    ...FONTS.bodyLarge,
    color: COLORS.paid,
    fontWeight: '700',
  },
});
