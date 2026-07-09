// src/screens/AddTenantScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { UserPlus, Home, CheckCircle2 } from 'lucide-react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../theme/theme';

export default function AddTenantScreen({ rooms, onAddTenant, onAddRoom }) {
  const [activeForm, setActiveForm] = useState('tenant'); // 'tenant' or 'room'

  // Tenant Form State
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [tenantAadhaar, setTenantAadhaar] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [deposit, setDeposit] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0]);

  // Room Form State
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('Single sharing');
  const [roomRent, setRoomRent] = useState('');
  const [roomCapacity, setRoomCapacity] = useState('1');

  // Filter rooms that have vacancy
  const availableRooms = rooms.filter(r => r.occupied < r.capacity && r.status !== 'maintenance');

  const handleCreateTenant = () => {
    if (!tenantName || !tenantPhone || !selectedRoomId || !rentAmount || !deposit) {
      alert('Please fill in all required tenant details.');
      return;
    }

    const room = rooms.find(r => r.id === selectedRoomId);
    if (!room) return;

    onAddTenant({
      name: tenantName,
      phone: tenantPhone,
      aadhaar: tenantAadhaar,
      roomId: selectedRoomId,
      roomNumber: room.number,
      rentAmount: parseFloat(rentAmount),
      deposit: parseFloat(deposit),
      joinDate,
    });

    // Reset Form
    setTenantName('');
    setTenantPhone('');
    setTenantAadhaar('');
    setSelectedRoomId('');
    setDeposit('');
    setRentAmount('');
    alert('Tenant registered successfully!');
  };

  const handleCreateRoom = () => {
    if (!roomNumber || !roomRent || !roomCapacity) {
      alert('Please fill in all room details.');
      return;
    }

    onAddRoom({
      number: roomNumber,
      type: roomType,
      rent: parseFloat(roomRent),
      capacity: parseInt(roomCapacity),
    });

    // Reset Form
    setRoomNumber('');
    setRoomRent('');
    setRoomCapacity('1');
    setRoomType('Single sharing');
    alert(`Room ${roomNumber} added successfully!`);
  };

  return (
    <View style={styles.container}>
      {/* Form Switch Tab */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[styles.formTab, activeForm === 'tenant' && styles.activeFormTab]}
          onPress={() => setActiveForm('tenant')}
        >
          <UserPlus size={16} color={activeForm === 'tenant' ? '#0F172A' : COLORS.textSecondary} />
          <Text style={[styles.tabText, activeForm === 'tenant' && styles.activeTabText]}>New Tenant</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.formTab, activeForm === 'room' && styles.activeFormTab]}
          onPress={() => setActiveForm('room')}
        >
          <Home size={16} color={activeForm === 'room' ? '#0F172A' : COLORS.textSecondary} />
          <Text style={[styles.tabText, activeForm === 'room' && styles.activeTabText]}>New Room</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.formScroll} showsVerticalScrollIndicator={false}>
        {activeForm === 'tenant' ? (
          // TENANT REGISTRATION FORM
          <View style={styles.card}>
            <Text style={styles.formTitle}>Register New Tenant</Text>
            
            <Text style={styles.label}>Tenant Full Name *</Text>
            <TextInput
              placeholder="e.g. Priyanshu Raj"
              placeholderTextColor={COLORS.textMuted}
              value={tenantName}
              onChangeText={setTenantName}
              style={styles.input}
            />

            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              placeholder="e.g. +91 98765 43210"
              placeholderTextColor={COLORS.textMuted}
              value={tenantPhone}
              onChangeText={setTenantPhone}
              style={styles.input}
            />

            <Text style={styles.label}>Government ID / Aadhaar No.</Text>
            <TextInput
              placeholder="e.g. 1234 5678 9012"
              placeholderTextColor={COLORS.textMuted}
              value={tenantAadhaar}
              onChangeText={setTenantAadhaar}
              style={styles.input}
            />

            <Text style={styles.label}>Select Allocated Room *</Text>
            <View style={styles.selectorContainer}>
              {availableRooms.length === 0 ? (
                <Text style={styles.noVacantText}>No vacant rooms available. Add a room first.</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roomSelectScroll}>
                  {availableRooms.map(room => (
                    <TouchableOpacity
                      key={room.id}
                      style={[
                        styles.roomSelectItem,
                        selectedRoomId === room.id && styles.selectedRoomSelectItem
                      ]}
                      onPress={() => {
                        setSelectedRoomId(room.id);
                        setRentAmount(room.rent.toString());
                        setDeposit((room.rent * 2).toString()); // Suggest 2 months deposit
                      }}
                    >
                      <Text style={[styles.roomSelectText, selectedRoomId === room.id && styles.selectedRoomSelectText]}>
                        Room {room.number}
                      </Text>
                      <Text style={[styles.roomSelectSub, selectedRoomId === room.id && styles.selectedRoomSelectSubText]}>
                        ₹{room.rent}/mo
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Monthly Rent (₹) *</Text>
                <TextInput
                  placeholder="Rent"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={rentAmount}
                  onChangeText={setRentAmount}
                  style={styles.input}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Security Deposit (₹) *</Text>
                <TextInput
                  placeholder="Deposit"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={deposit}
                  onChangeText={setDeposit}
                  style={styles.input}
                />
              </View>
            </View>

            <Text style={styles.label}>Date of Move-in</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor={COLORS.textMuted}
              value={joinDate}
              onChangeText={setJoinDate}
              style={styles.input}
            />

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleCreateTenant}
            >
              <Text style={styles.submitButtonText}>Add Tenant to PG</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // ROOM REGISTRATION FORM
          <View style={styles.card}>
            <Text style={styles.formTitle}>Add New Room</Text>

            <Text style={styles.label}>Room Number *</Text>
            <TextInput
              placeholder="e.g. 303, 401"
              placeholderTextColor={COLORS.textMuted}
              value={roomNumber}
              onChangeText={setRoomNumber}
              style={styles.input}
            />

            <Text style={styles.label}>Sharing/Room Type *</Text>
            <View style={styles.roomTypeRow}>
              {['Single sharing', 'Double sharing', 'Triple sharing'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeBtn,
                    roomType === type && styles.activeTypeBtn
                  ]}
                  onPress={() => {
                    setRoomType(type);
                    if (type === 'Single sharing') {
                      setRoomCapacity('1');
                      setRoomRent('12000');
                    } else if (type === 'Double sharing') {
                      setRoomCapacity('2');
                      setRoomRent('7500');
                    } else {
                      setRoomCapacity('3');
                      setRoomRent('5500');
                    }
                  }}
                >
                  <Text style={[styles.typeText, roomType === type && styles.activeTypeText]}>
                    {type.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Monthly Rent (₹) *</Text>
                <TextInput
                  placeholder="e.g. 8000"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={roomRent}
                  onChangeText={setRoomRent}
                  style={styles.input}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Bed Capacity *</Text>
                <TextInput
                  placeholder="Capacity"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={roomCapacity}
                  onChangeText={setRoomCapacity}
                  style={styles.input}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleCreateRoom}
            >
              <Text style={styles.submitButtonText}>Create Room</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabHeader: {
    flexDirection: 'row',
    margin: SIZES.lg,
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMd,
    gap: SIZES.xs,
  },
  activeFormTab: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.premium,
  },
  tabText: {
    ...FONTS.bodyMedium,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  formScroll: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.premium,
  },
  formTitle: {
    ...FONTS.titleSmall,
    color: COLORS.textPrimary,
    fontWeight: '800',
    marginBottom: SIZES.lg,
  },
  label: {
    ...FONTS.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: SIZES.sm,
    marginTop: SIZES.md,
  },
  input: {
    backgroundColor: COLORS.cardBgLight,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    padding: SIZES.md,
    color: COLORS.textPrimary,
    ...FONTS.bodyMedium,
    outlineStyle: 'none',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  halfInput: {
    flex: 1,
  },
  selectorContainer: {
    marginVertical: SIZES.xs,
  },
  noVacantText: {
    ...FONTS.bodySmall,
    color: COLORS.overdue,
    fontWeight: '500',
    paddingVertical: SIZES.sm,
  },
  roomSelectScroll: {
    gap: SIZES.sm,
    paddingVertical: SIZES.xs,
  },
  roomSelectItem: {
    backgroundColor: COLORS.cardBgLight,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.radiusMd,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  selectedRoomSelectItem: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(255, 199, 44, 0.05)',
  },
  roomSelectText: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  selectedRoomSelectText: {
    color: COLORS.primary,
  },
  roomSelectSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  selectedRoomSelectSubText: {
    color: COLORS.primaryLight,
  },
  roomTypeRow: {
    flexDirection: 'row',
    gap: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  typeBtn: {
    flex: 1,
    backgroundColor: COLORS.cardBgLight,
    borderRadius: SIZES.radiusMd,
    paddingVertical: SIZES.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeTypeBtn: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(255, 199, 44, 0.05)',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTypeText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusMd,
    paddingVertical: SIZES.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.xl + SIZES.sm,
    ...SHADOWS.button,
  },
  submitButtonText: {
    ...FONTS.bodyLarge,
    color: '#0F172A',
    fontWeight: '700',
  },
});
