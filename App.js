// App.js
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LayoutDashboard, BedDouble, Receipt, Wrench, PlusCircle } from 'lucide-react-native';

import { COLORS, SIZES, SHADOWS, FONTS } from './src/theme/theme';
import DeviceFrame from './src/components/DeviceFrame';
import RentReceiptModal from './src/components/RentReceiptModal';

// Screens
import DashboardScreen from './src/screens/DashboardScreen';
import RoomsScreen from './src/screens/RoomsScreen';
import LedgerScreen from './src/screens/LedgerScreen';
import ComplaintsScreen from './src/screens/ComplaintsScreen';
import AddTenantScreen from './src/screens/AddTenantScreen';

// Mock Data
import { 
  INITIAL_ROOMS, 
  INITIAL_TENANTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_COMPLAINTS 
} from './src/utils/mockData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  
  // App States
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [tenants, setTenants] = useState(INITIAL_TENANTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  
  // Modal / Receipt States
  const [activeReceiptTx, setActiveReceiptTx] = useState(null);
  const [receiptVisible, setReceiptVisible] = useState(false);

  // Core Actions
  const handleUpdateRoomStatus = (roomId, currentTenants = tenants) => {
    setRooms(prevRooms => prevRooms.map(room => {
      if (room.id !== roomId) return room;
      
      const roomTenants = currentTenants.filter(t => room.tenantIds.includes(t.id));
      if (roomTenants.length === 0) {
        return { ...room, occupied: 0, status: 'vacant' };
      }
      
      // Determine status based on tenants' status
      let newStatus = 'paid';
      if (roomTenants.some(t => t.status === 'overdue')) {
        newStatus = 'overdue';
      } else if (roomTenants.some(t => t.status === 'pending')) {
        newStatus = 'pending';
      }
      
      return { 
        ...room, 
        occupied: roomTenants.length, 
        status: newStatus 
      };
    }));
  };

  const handleCollectRent = (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return;

    // 1. Update tenant status to paid
    const updatedTenants = tenants.map(t => {
      if (t.id === tenantId) {
        return { ...t, status: 'paid' };
      }
      return t;
    });
    setTenants(updatedTenants);

    // 2. Create new transaction log
    const newTx = {
      id: `tx${Date.now().toString().slice(-4)}`,
      tenantName: tenant.name,
      roomNumber: tenant.roomNumber,
      amount: tenant.rentAmount,
      date: new Date().toISOString().split('T')[0],
      method: 'UPI (GPay)',
      status: 'Paid',
    };
    setTransactions([newTx, ...transactions]);

    // 3. Update related room status
    const room = rooms.find(r => r.tenantIds.includes(tenantId));
    if (room) {
      handleUpdateRoomStatus(room.id, updatedTenants);
    }

    // 4. Trigger Receipt dialog
    setActiveReceiptTx(newTx);
    setReceiptVisible(true);
  };

  const handleAddTransaction = (newTxData) => {
    // 1. Add Transaction
    const newTx = {
      id: `tx${Date.now().toString().slice(-4)}`,
      tenantName: newTxData.tenantName,
      roomNumber: newTxData.roomNumber,
      amount: newTxData.amount,
      date: new Date().toISOString().split('T')[0],
      method: newTxData.method,
      status: 'Paid',
    };
    setTransactions([newTx, ...transactions]);

    // 2. Update Tenant Rent Status
    const updatedTenants = tenants.map(t => {
      if (t.id === newTxData.tenantId) {
        return { ...t, status: 'paid' };
      }
      return t;
    });
    setTenants(updatedTenants);

    // 3. Update Room Rent Status
    const room = rooms.find(r => r.tenantIds.includes(newTxData.tenantId));
    if (room) {
      handleUpdateRoomStatus(room.id, updatedTenants);
    }

    // 4. Trigger Receipt dialog
    setActiveReceiptTx(newTx);
    setReceiptVisible(true);
  };

  const handleAddComplaint = (newComplaintData) => {
    const newTicket = {
      id: `c${Date.now().toString().slice(-3)}`,
      tenantName: newComplaintData.tenantName,
      roomNumber: newComplaintData.roomNumber,
      title: newComplaintData.title,
      desc: newComplaintData.desc,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      priority: newComplaintData.priority,
    };
    setComplaints([newTicket, ...complaints]);
  };

  const handleUpdateComplaintStatus = (ticketId, newStatus) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === ticketId) {
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  const handleAddRoom = (newRoomData) => {
    const newRoom = {
      id: `r${Date.now().toString().slice(-3)}`,
      number: newRoomData.number,
      type: newRoomData.type,
      rent: newRoomData.rent,
      capacity: newRoomData.capacity,
      occupied: 0,
      status: 'vacant',
      tenantIds: [],
    };
    setRooms([...rooms, newRoom]);
  };

  const handleAddTenant = (newTenantData) => {
    const newTenantId = `t${Date.now().toString().slice(-3)}`;
    const newTenant = {
      id: newTenantId,
      name: newTenantData.name,
      phone: newTenantData.phone,
      aadhaar: newTenantData.aadhaar,
      roomNumber: newTenantData.roomNumber,
      rentAmount: newTenantData.rentAmount,
      deposit: newTenantData.deposit,
      joinDate: newTenantData.joinDate,
      status: 'paid', // Initial rent is paid
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days due
    };

    // 1. Add tenant to list
    const updatedTenants = [...tenants, newTenant];
    setTenants(updatedTenants);

    // 2. Add tenant to room
    const updatedRooms = rooms.map(room => {
      if (room.id === newTenantData.roomId) {
        const tenantIds = [...room.tenantIds, newTenantId];
        return {
          ...room,
          tenantIds,
          occupied: tenantIds.length,
          status: 'paid',
        };
      }
      return room;
    });
    setRooms(updatedRooms);

    // 3. Log initial Deposit/Rent transaction
    const initialTx = {
      id: `tx${Date.now().toString().slice(-4)}`,
      tenantName: newTenantData.name,
      roomNumber: newTenantData.roomNumber,
      amount: newTenantData.deposit + newTenantData.rentAmount,
      date: newTenantData.joinDate,
      method: 'UPI (GPay)',
      status: 'Paid',
    };
    setTransactions([initialTx, ...transactions]);
  };

  const handleViewReceipt = (tx) => {
    setActiveReceiptTx(tx);
    setReceiptVisible(true);
  };

  // Screen Rendering Router
  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return (
          <DashboardScreen
            tenants={tenants}
            rooms={rooms}
            transactions={transactions}
            complaints={complaints}
            onNavigate={setCurrentScreen}
          />
        );
      case 'rooms':
        return (
          <RoomsScreen
            rooms={rooms}
            tenants={tenants}
            onCollectRent={handleCollectRent}
          />
        );
      case 'ledger':
        return (
          <LedgerScreen
            transactions={transactions}
            tenants={tenants}
            onAddTransaction={handleAddTransaction}
            onViewReceipt={handleViewReceipt}
          />
        );
      case 'complaints':
        return (
          <ComplaintsScreen
            complaints={complaints}
            tenants={tenants}
            onAddComplaint={handleAddComplaint}
            onUpdateStatus={handleUpdateComplaintStatus}
          />
        );
      case 'add':
        return (
          <AddTenantScreen
            rooms={rooms}
            onAddTenant={handleAddTenant}
            onAddRoom={handleAddRoom}
          />
        );
      default:
        return <View />;
    }
  };

  return (
    <DeviceFrame activeTab={currentScreen} onTabSelect={setCurrentScreen}>
      <View style={styles.appContainer}>
        {/* Active Screen Area */}
        <View style={styles.contentArea}>
          {renderScreen()}
        </View>

        {/* Global Floating Custom Tab Navigation Bar */}
        <View style={styles.navBar}>
          {[
            { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
            { id: 'rooms', label: 'Rooms', icon: BedDouble },
            { id: 'ledger', label: 'Ledger', icon: Receipt },
            { id: 'complaints', label: 'Issues', icon: Wrench },
            { id: 'add', label: 'Register', icon: PlusCircle },
          ].map(tab => {
            const isActive = currentScreen === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.navItem}
                onPress={() => setCurrentScreen(tab.id)}
              >
                <View style={styles.iconWrapper}>
                  <tab.icon 
                    size={isActive ? 22 : 18} 
                    color={isActive ? COLORS.primary : COLORS.textSecondary} 
                  />
                  {isActive && <View style={styles.glowLine} />}
                </View>
                <Text style={[styles.navText, isActive && styles.activeNavText]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Statusbar Helper */}
        <StatusBar style="light" />

        {/* Global Receipt Viewer */}
        <RentReceiptModal
          visible={receiptVisible}
          onClose={() => setReceiptVisible(false)}
          transaction={activeReceiptTx}
          onDownload={() => {
            alert('Receipt PDF downloaded to device storage successfully!');
            setReceiptVisible(false);
          }}
        />
      </View>
    </DeviceFrame>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    position: 'relative',
  },
  contentArea: {
    flex: 1,
    width: '100%',
  },
  navBar: {
    flexDirection: 'row',
    height: 72,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
    paddingTop: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 28,
  },
  glowLine: {
    position: 'absolute',
    bottom: -6,
    width: 16,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  navText: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  activeNavText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
