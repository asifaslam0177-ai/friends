import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  DollarSign, 
  Vote, 
  Users, 
  PlusCircle, 
  CheckCircle2, 
  ArrowRightLeft, 
  Trash2, 
  MapPin, 
  Sparkles, 
  TrendingUp,
  Receipt,
  UserCheck,
  ChevronRight,
  Search,
  Image as ImageIcon,
  Film,
  Upload,
  Eye,
  FolderPlus,
  Play,
  Clock,
  CalendarCheck,
  Activity,
  CalendarDays,
  Palmtree,
  Luggage,
  ThumbsUp,
  PlaneTakeoff,
  ShieldCheck,
  ShieldAlert,
  Check,
  X,
  CreditCard,
  AlertCircle,
  MessageSquare,
  Send,
  Lock,
  MessagesSquare
} from 'lucide-react';

// Default group members
const INITIAL_MEMBERS = [
  { id: 'u1', name: 'Alex', avatar: '🎒', color: 'from-amber-400 to-orange-500' },
  { id: 'u2', name: 'Samira', avatar: '✈️', color: 'from-teal-400 to-emerald-500' },
  { id: 'u3', name: 'Jordan', avatar: '🏕️', color: 'from-blue-400 to-indigo-500' },
  { id: 'u4', name: 'Elena', avatar: '📸', color: 'from-purple-400 to-pink-500' },
];

// Rich curated database of tourist places
const TOURIST_PLACES_CATALOG = [
  {
    id: 'tp-1',
    name: "Cox's Bazar Sea Beach",
    country: "Bangladesh",
    category: "Beach & Nature",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=80",
    description: "The world's longest unbroken natural sea beach stretching over 120 km with breathtaking sunsets."
  },
  {
    id: 'tp-2',
    name: "Sajek Valley",
    country: "Bangladesh",
    category: "Mountains & Clouds",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80",
    description: "Known as the Queen of Hills, surrounded by floating clouds, green hills, and indigenous tribal culture."
  },
  {
    id: 'tp-3',
    name: "Ratargul Swamp Forest",
    country: "Bangladesh",
    category: "Eco & Adventure",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80",
    description: "The only freshwater swamp forest in Bangladesh, navigated via serene wooden boat canopies."
  },
  {
    id: 'tp-4',
    name: "Kyoto Arashiyama & Fushimi",
    country: "Japan",
    category: "Culture & Heritage",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
    description: "Iconic bamboo groves, traditional zen gardens, and thousands of vermilion torii shrine gates."
  },
  {
    id: 'tp-5',
    name: "Banff National Park & Lake Louise",
    country: "Canada",
    category: "Alpine & Lakes",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&auto=format&fit=crop&q=80",
    description: "Vibrant turquoise glacial lakes framed by rugged Canadian Rocky Mountain peaks and pristine wilderness."
  },
  {
    id: 'tp-6',
    name: "Santorini & Oia Caldera",
    country: "Greece",
    category: "Coastal & Islands",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80",
    description: "Dramatic volcanic cliffs with whitewashed cubic houses and cobalt-blue domes over the Aegean Sea."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' | 'voting' | 'explore' | 'media' | 'meetup' | 'holidays' | 'chat'
  const [currentUser, setCurrentUser] = useState(INITIAL_MEMBERS[0].id);

  // TOUR ADMIN DESIGNATION STATE
  const [tripAdminId, setTripAdminId] = useState('u1'); // Default admin: Alex

  // SEARCH & EXPLORE STATE
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // CHAT STATE (GROUP & PRIVATE 1-ON-1)
  const [activeChatTarget, setActiveChatTarget] = useState('group'); // 'group' or memberId ('u1', 'u2', etc.)
  const [chatInputText, setChatInputText] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-1',
      senderId: 'u1',
      receiverId: null, // null = group chat
      text: "Hey everyone! Don't forget to check the luggage list and badminton session times.",
      timestamp: '10:14 AM'
    },
    {
      id: 'msg-2',
      senderId: 'u2',
      receiverId: null,
      text: "Just submitted my $150 deposit for the van and groceries to the admin!",
      timestamp: '10:20 AM'
    },
    {
      id: 'msg-3',
      senderId: 'u3',
      receiverId: null,
      text: "Awesome! I'll bring the badminton gear for Court #3.",
      timestamp: '10:35 AM'
    },
    {
      id: 'msg-4',
      senderId: 'u2',
      receiverId: 'u1', // Private between Samira and Alex
      text: "Hey Alex, could you review the bKash receipt when you have a moment?",
      timestamp: '11:02 AM'
    },
    {
      id: 'msg-5',
      senderId: 'u1',
      receiverId: 'u2',
      text: "Checking it now! Will approve it in the trip ledger right away.",
      timestamp: '11:05 AM'
    }
  ]);

  // PAYMENT / DEPOSIT APPROVAL QUEUE STATE
  const [paymentDeposits, setPaymentDeposits] = useState([
    {
      id: 'dep-1',
      memberId: 'u2',
      amount: 150,
      paymentMethod: 'bKash / Mobile Wallet (Txn #8KJ29D)',
      notes: 'Initial trip pool contribution for groceries & van rental',
      date: '2026-11-12',
      status: 'pending' // 'pending' | 'approved' | 'rejected'
    },
    {
      id: 'dep-2',
      memberId: 'u3',
      amount: 120,
      paymentMethod: 'Bank Transfer (Trx 44921)',
      notes: 'Fuel advance payment confirmation',
      date: '2026-11-13',
      status: 'approved'
    }
  ]);

  const [depositForm, setDepositForm] = useState({
    amount: '',
    paymentMethod: 'bKash / Mobile Banking',
    notes: ''
  });
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  // HOLIDAYS & TOUR PROPOSALS STATE
  const [holidayProposals, setHolidayProposals] = useState([
    {
      id: 'hp-1',
      creatorId: 'u1',
      title: 'Eid / Long Weekend Escape to Sajek & Cox’s Bazar',
      startDate: '2026-12-18',
      endDate: '2026-12-24',
      daysCount: 6,
      destination: "Sajek Valley & Cox's Bazar",
      approxBudget: 220,
      vibe: 'Mountains & Beach Chill',
      notes: 'I have 6 continuous official holidays! Let’s rent a 4x4 Chander Gari and chill in Sajek, then hit the beach sunset.',
      interestedMembers: ['u1', 'u2', 'u3']
    },
    {
      id: 'hp-2',
      creatorId: 'u2',
      title: 'Autumn Foliage & Cherry Blossom Quest',
      startDate: '2027-03-25',
      endDate: '2027-04-02',
      daysCount: 8,
      destination: 'Kyoto & Tokyo, Japan',
      approxBudget: 1400,
      vibe: 'Culture & Photography',
      notes: 'Planning to submit annual leave during late March. Flights are reasonable if we book early.',
      interestedMembers: ['u2', 'u4']
    }
  ]);

  const [holidayForm, setHolidayForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    destination: '',
    approxBudget: '',
    vibe: 'Relaxation & Scenic',
    notes: ''
  });
  const [isAddingHoliday, setIsAddingHoliday] = useState(false);

  // MEETUP / BADMINTON SESSION STATE
  const [meetupSessions, setMeetupSessions] = useState([
    {
      id: 'session-1',
      title: 'Badminton Championship & Friendly Rally 🏸',
      date: 'Today, Nov 12',
      courtLocation: 'Indoor Badminton Arena / Court 3',
      note: 'Bring your racquets! Shuttlecocks are covered.',
      attendees: [
        { userId: 'u1', status: 'available', timeSlot: '06:30 PM - 08:30 PM', gearNote: 'Bringing 2 Yonex racquets' },
        { userId: 'u2', status: 'available', timeSlot: '07:00 PM - 09:00 PM', gearNote: 'Got feathers & grips' },
        { userId: 'u3', status: 'late', timeSlot: '07:45 PM - 09:00 PM', gearNote: 'Joining after office' },
        { userId: 'u4', status: 'unavailable', timeSlot: 'Unavailable', gearNote: 'Busy with work' }
      ]
    },
    {
      id: 'session-2',
      title: 'Evening Sunset Warmup & Quick Singles 🏸',
      date: 'Tomorrow, Nov 13',
      courtLocation: 'Community Sports Complex',
      note: 'Light warmup session and cardio rallies.',
      attendees: [
        { userId: 'u1', status: 'available', timeSlot: '06:00 PM - 07:30 PM', gearNote: 'Ready for singles' },
        { userId: 'u3', status: 'available', timeSlot: '06:00 PM - 08:00 PM', gearNote: 'Bringing extra shuttle tube' }
      ]
    }
  ]);

  const [activeSessionId, setActiveSessionId] = useState('session-1');
  const [userTimeSlotInput, setUserTimeSlotInput] = useState('06:30 PM - 08:30 PM');
  const [userStatusInput, setUserStatusInput] = useState('available');
  const [userGearNoteInput, setUserGearNoteInput] = useState('');
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionDate, setNewSessionDate] = useState('');
  const [newSessionLocation, setNewSessionLocation] = useState('');
  const [newSessionNote, setNewSessionNote] = useState('');
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  // MEDIA STORAGE BY PLACE STATE
  const [mediaPlaces, setMediaPlaces] = useState([
    "Cox's Bazar Sea Beach",
    "Sajek Valley",
    "Banff National Park & Lake Louise"
  ]);
  const [selectedPlaceForMedia, setSelectedPlaceForMedia] = useState("Cox's Bazar Sea Beach");
  const [newPlaceInput, setNewPlaceInput] = useState('');
  
  const [mediaItems, setMediaItems] = useState([
    {
      id: 'm-1',
      placeName: "Cox's Bazar Sea Beach",
      type: 'photo',
      url: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=80",
      caption: "Golden hour sunset walk on the sandy shoreline",
      uploadedBy: 'u2',
      date: '2026-11-12'
    },
    {
      id: 'm-2',
      placeName: "Cox's Bazar Sea Beach",
      type: 'video',
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      caption: "Waves rolling in during high tide clip",
      uploadedBy: 'u1',
      date: '2026-11-12'
    },
    {
      id: 'm-3',
      placeName: "Sajek Valley",
      type: 'photo',
      url: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80",
      caption: "Morning cloud blanket outside our resort balcony",
      uploadedBy: 'u3',
      date: '2026-11-13'
    },
    {
      id: 'm-4',
      placeName: "Banff National Park & Lake Louise",
      type: 'photo',
      url: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&auto=format&fit=crop&q=80",
      caption: "Glacier reflection early in the morning",
      uploadedBy: 'u4',
      date: '2026-11-14'
    }
  ]);

  // Upload modal / form state
  const [uploadMediaType, setUploadMediaType] = useState('photo');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [lightboxItem, setLightboxItem] = useState(null);

  // 1. EXPENSES STATE
  const [expenses, setExpenses] = useState([
    {
      id: 'exp-1',
      description: 'Mountain Cabin Rental',
      amount: 480,
      paidById: 'u1',
      splitBetween: ['u1', 'u2', 'u3', 'u4'],
      date: '2026-11-12',
      category: 'Lodging'
    },
    {
      id: 'exp-2',
      description: 'Supermarket Groceries & Snacks',
      amount: 140,
      paidById: 'u2',
      splitBetween: ['u1', 'u2', 'u3', 'u4'],
      date: '2026-11-13',
      category: 'Food'
    },
    {
      id: 'exp-3',
      description: 'National Park Passes & Fuel',
      amount: 90,
      paidById: 'u3',
      splitBetween: ['u1', 'u3', 'u4'],
      date: '2026-11-14',
      category: 'Transit'
    }
  ]);

  // Form State for new expense
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    paidById: INITIAL_MEMBERS[0].id,
    splitBetween: INITIAL_MEMBERS.map(m => m.id),
    category: 'Food'
  });

  // 2. VOTING & POLLS STATE
  const [polls, setPolls] = useState([
    {
      id: 'poll-1',
      title: 'Which adventure destination for this Summer?',
      options: [
        { id: 'opt-1', title: 'Banff & Lake Louise, Canada', tags: 'Nature, Hiking', votes: ['u1', 'u3', 'u4'] },
        { id: 'opt-2', title: 'Kyoto & Mt. Fuji, Japan', tags: 'Culture, Scenic', votes: ['u1', 'u2'] },
        { id: 'opt-3', title: 'Amalfi Coast & Capri, Italy', tags: 'Coast, Culinary', votes: ['u2'] }
      ]
    },
    {
      id: 'poll-2',
      title: 'Top group activity for Day 3',
      options: [
        { id: 'opt-201', title: 'Whitewater River Rafting', tags: 'High Adrenaline', votes: ['u1', 'u3'] },
        { id: 'opt-202', title: 'Sunset Lake Kayaking & BBQ', tags: 'Chill & Relax', votes: ['u2', 'u3', 'u4'] },
        { id: 'opt-203', title: 'Alpine Peak Panoramic Hike', tags: 'Scenic Photography', votes: ['u4'] }
      ]
    }
  ]);

  const [newOptionText, setNewOptionText] = useState('');
  const [newOptionTag, setNewOptionTag] = useState('');
  const [activePollIndex, setActivePollIndex] = useState(0);

  // ==========================================
  // CALCULATIONS FOR EXPENSES & BALANCES
  // ==========================================
  const balances = useMemo(() => {
    const net = {};
    INITIAL_MEMBERS.forEach(m => { net[m.id] = 0; });

    expenses.forEach(exp => {
      const amount = parseFloat(exp.amount) || 0;
      if (amount <= 0 || exp.splitBetween.length === 0) return;

      const perPerson = amount / exp.splitBetween.length;

      // Payer gets credited
      net[exp.paidById] = (net[exp.paidById] || 0) + amount;

      // Each consumer gets debited
      exp.splitBetween.forEach(userId => {
        net[userId] = (net[userId] || 0) - perPerson;
      });
    });

    return net;
  }, [expenses]);

  // Settle up suggestions (Greedy min-cash-flow algorithm)
  const settlementTransfers = useMemo(() => {
    const debtors = [];
    const creditors = [];

    Object.entries(balances).forEach(([uid, bal]) => {
      const rounded = Math.round(bal * 100) / 100;
      if (rounded < -0.01) debtors.push({ uid, balance: -rounded });
      if (rounded > 0.01) creditors.push({ uid, balance: rounded });
    });

    debtors.sort((a, b) => b.balance - a.balance);
    creditors.sort((a, b) => b.balance - a.balance);

    const transfers = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.balance, creditor.balance);

      transfers.push({
        from: debtor.uid,
        to: creditor.uid,
        amount: Math.round(amount * 100) / 100
      });

      debtor.balance -= amount;
      creditor.balance -= amount;

      if (debtor.balance < 0.01) i++;
      if (creditor.balance < 0.01) j++;
    }

    return transfers;
  }, [balances]);

  const totalTripSpend = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  }, [expenses]);

  // Handler: Add Expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseForm.description || !expenseForm.amount || expenseForm.splitBetween.length === 0) return;

    const newExp = {
      id: `exp-${Date.now()}`,
      description: expenseForm.description,
      amount: parseFloat(expenseForm.amount),
      paidById: expenseForm.paidById,
      splitBetween: expenseForm.splitBetween,
      date: new Date().toISOString().split('T')[0],
      category: expenseForm.category
    };

    setExpenses([newExp, ...expenses]);
    setExpenseForm({
      description: '',
      amount: '',
      paidById: currentUser,
      splitBetween: INITIAL_MEMBERS.map(m => m.id),
      category: 'Food'
    });
  };

  // Handler: Toggle user selection in split array
  const toggleSplitUser = (userId) => {
    if (expenseForm.splitBetween.includes(userId)) {
      if (expenseForm.splitBetween.length > 1) {
        setExpenseForm({
          ...expenseForm,
          splitBetween: expenseForm.splitBetween.filter(id => id !== userId)
        });
      }
    } else {
      setExpenseForm({
        ...expenseForm,
        splitBetween: [...expenseForm.splitBetween, userId]
      });
    }
  };

  // Handler: Upvote / Cancel vote on poll option
  const handleToggleVote = (pollIdx, optionId) => {
    setPolls(prev => {
      const copy = [...prev];
      const targetPoll = { ...copy[pollIdx] };
      targetPoll.options = targetPoll.options.map(opt => {
        if (opt.id === optionId) {
          const hasVoted = opt.votes.includes(currentUser);
          return {
            ...opt,
            votes: hasVoted
              ? opt.votes.filter(id => id !== currentUser)
              : [...opt.votes, currentUser]
          };
        }
        return opt;
      });
      copy[pollIdx] = targetPoll;
      return copy;
    });
  };

  // Handler: Add custom option to poll
  const handleAddOption = (e) => {
    e.preventDefault();
    if (!newOptionText.trim()) return;

    const newOpt = {
      id: `opt-${Date.now()}`,
      title: newOptionText.trim(),
      tags: newOptionTag.trim() || 'Custom Suggestion',
      votes: [currentUser]
    };

    setPolls(prev => {
      const copy = [...prev];
      copy[activePollIndex] = {
        ...copy[activePollIndex],
        options: [...copy[activePollIndex].options, newOpt]
      };
      return copy;
    });

    setNewOptionText('');
    setNewOptionTag('');
  };

  // Handler: Submit payment deposit for Admin Approval
  const handleSubmitDeposit = (e) => {
    e.preventDefault();
    const amt = parseFloat(depositForm.amount);
    if (!amt || amt <= 0) return;

    const newDeposit = {
      id: `dep-${Date.now()}`,
      memberId: currentUser,
      amount: amt,
      paymentMethod: depositForm.paymentMethod.trim() || 'Direct Transfer',
      notes: depositForm.notes.trim() || 'Trip advance contribution',
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setPaymentDeposits([newDeposit, ...paymentDeposits]);
    setDepositForm({
      amount: '',
      paymentMethod: 'bKash / Mobile Banking',
      notes: ''
    });
    setIsDepositModalOpen(false);
  };

  // Handler: Admin Approves or Rejects Payment Deposit
  const handleReviewDeposit = (depositId, newStatus) => {
    if (currentUser !== tripAdminId) return; // Only Admin can approve

    setPaymentDeposits(prev => prev.map(dep => {
      if (dep.id !== depositId) return dep;
      return { ...dep, status: newStatus };
    }));

    // If approved, automatically inject it into the shared expense ledger as a general fund credit
    if (newStatus === 'approved') {
      const dep = paymentDeposits.find(d => d.id === depositId);
      if (dep) {
        const approvedExpense = {
          id: `exp-dep-${Date.now()}`,
          description: `💰 Approved Deposit: ${dep.notes} (${dep.paymentMethod})`,
          amount: dep.amount,
          paidById: dep.memberId,
          splitBetween: INITIAL_MEMBERS.map(m => m.id),
          date: new Date().toISOString().split('T')[0],
          category: 'Other'
        };
        setExpenses(prev => [approvedExpense, ...prev]);
      }
    }
  };

  // Handler: Toggle Interest in Holiday / Vacation Plan
  const handleToggleHolidayInterest = (proposalId) => {
    setHolidayProposals(prev => prev.map(hp => {
      if (hp.id !== proposalId) return hp;
      const isInterested = hp.interestedMembers.includes(currentUser);
      return {
        ...hp,
        interestedMembers: isInterested
          ? hp.interestedMembers.filter(id => id !== currentUser)
          : [...hp.interestedMembers, currentUser]
      };
    }));
  };

  // Handler: Add Holiday & Tour Proposal
  const handleAddHolidayProposal = (e) => {
    e.preventDefault();
    if (!holidayForm.title.trim() || !holidayForm.destination.trim() || !holidayForm.startDate) return;

    let calculatedDays = 1;
    if (holidayForm.startDate && holidayForm.endDate) {
      const start = new Date(holidayForm.startDate);
      const end = new Date(holidayForm.endDate);
      const diffTime = Math.abs(end - start);
      calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (isNaN(calculatedDays) || calculatedDays < 1) calculatedDays = 1;
    }

    const newProposal = {
      id: `hp-${Date.now()}`,
      creatorId: currentUser,
      title: holidayForm.title.trim(),
      startDate: holidayForm.startDate,
      endDate: holidayForm.endDate || holidayForm.startDate,
      daysCount: calculatedDays,
      destination: holidayForm.destination.trim(),
      approxBudget: parseFloat(holidayForm.approxBudget) || 0,
      vibe: holidayForm.vibe,
      notes: holidayForm.notes.trim() || 'Excited for this getaway!',
      interestedMembers: [currentUser]
    };

    setHolidayProposals([newProposal, ...holidayProposals]);
    setHolidayForm({
      title: '',
      startDate: '',
      endDate: '',
      destination: '',
      approxBudget: '',
      vibe: 'Relaxation & Scenic',
      notes: ''
    });
    setIsAddingHoliday(false);
  };

  // Handler: Update Current User's Meetup/Badminton Availability
  const handleSaveMeetupTime = (e) => {
    e.preventDefault();
    setMeetupSessions(prev => prev.map(session => {
      if (session.id !== activeSessionId) return session;

      const existingIndex = session.attendees.findIndex(a => a.userId === currentUser);
      const updatedAttendee = {
        userId: currentUser,
        status: userStatusInput,
        timeSlot: userStatusInput === 'unavailable' ? 'Unavailable' : (userTimeSlotInput.trim() || 'Flexible Time'),
        gearNote: userGearNoteInput.trim() || 'No gear note'
      };

      let newAttendees;
      if (existingIndex >= 0) {
        newAttendees = [...session.attendees];
        newAttendees[existingIndex] = updatedAttendee;
      } else {
        newAttendees = [...session.attendees, updatedAttendee];
      }

      return { ...session, attendees: newAttendees };
    }));
  };

  // Handler: Create New Badminton / Meetup Session
  const handleCreateSession = (e) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) return;

    const newSession = {
      id: `session-${Date.now()}`,
      title: newSessionTitle.trim(),
      date: newSessionDate.trim() || 'Upcoming Day',
      courtLocation: newSessionLocation.trim() || 'Local Court / Venue',
      note: newSessionNote.trim() || 'Friendly match',
      attendees: [
        {
          userId: currentUser,
          status: 'available',
          timeSlot: '07:00 PM - 09:00 PM',
          gearNote: 'Session host'
        }
      ]
    };

    setMeetupSessions([newSession, ...meetupSessions]);
    setActiveSessionId(newSession.id);
    setNewSessionTitle('');
    setNewSessionDate('');
    setNewSessionLocation('');
    setNewSessionNote('');
    setIsCreatingSession(false);
  };

  const getMember = (id) => INITIAL_MEMBERS.find(m => m.id === id) || { name: 'Unknown', avatar: '👤' };

  const currentMeetupSession = meetupSessions.find(s => s.id === activeSessionId) || meetupSessions[0];
  const currentUserAttendance = currentMeetupSession?.attendees.find(a => a.userId === currentUser);
  const isAdmin = currentUser === tripAdminId;

  // Handler: Send Message (Group or Direct Private)
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser,
      receiverId: activeChatTarget === 'group' ? null : activeChatTarget,
      text: chatInputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInputText('');
  };

  // Filter messages for active channel
  const currentChatMessages = useMemo(() => {
    if (activeChatTarget === 'group') {
      return chatMessages.filter(m => m.receiverId === null);
    }
    // Private chat between currentUser and selected friend
    return chatMessages.filter(m => 
      (m.senderId === currentUser && m.receiverId === activeChatTarget) ||
      (m.senderId === activeChatTarget && m.receiverId === currentUser)
    );
  }, [chatMessages, activeChatTarget, currentUser]);

  // UNIVERSAL GLOBAL SEARCH MATCHES
  const globalSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedPlaces = TOURIST_PLACES_CATALOG.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.country.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );

    const matchedExpenses = expenses.filter(e => 
      e.description.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      getMember(e.paidById).name.toLowerCase().includes(q)
    );

    const matchedPolls = [];
    polls.forEach((poll, pIdx) => {
      if (poll.title.toLowerCase().includes(q)) {
        matchedPolls.push({ poll, option: null, pIdx });
      } else {
        poll.options.forEach(opt => {
          if (opt.title.toLowerCase().includes(q) || opt.tags.toLowerCase().includes(q)) {
            matchedPolls.push({ poll, option: opt, pIdx });
          }
        });
      }
    });

    const matchedHolidays = holidayProposals.filter(h =>
      h.title.toLowerCase().includes(q) ||
      h.destination.toLowerCase().includes(q) ||
      h.vibe.toLowerCase().includes(q) ||
      h.notes.toLowerCase().includes(q)
    );

    const matchedSessions = meetupSessions.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.courtLocation.toLowerCase().includes(q) ||
      s.note.toLowerCase().includes(q)
    );

    const matchedChats = chatMessages.filter(m =>
      m.text.toLowerCase().includes(q)
    );

    const totalCount = matchedPlaces.length + matchedExpenses.length + matchedPolls.length + matchedHolidays.length + matchedSessions.length + matchedChats.length;

    return {
      places: matchedPlaces,
      expenses: matchedExpenses,
      polls: matchedPolls,
      holidays: matchedHolidays,
      sessions: matchedSessions,
      chats: matchedChats,
      totalCount
    };
  }, [searchQuery, expenses, polls, holidayProposals, meetupSessions, chatMessages]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-bold">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-amber-400 via-rose-300 to-teal-300 bg-clip-text text-transparent">
                  WanderSync
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Trip Workspace
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-slate-400">Summer Expedition 2026</p>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Admin: {getMember(tripAdminId).name}
                </span>
              </div>
            </div>
          </div>

          {/* Current User Simulator & Tour Admin Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Tour Admin Designation Dropdown */}
            <div className="flex items-center bg-slate-800/90 rounded-full px-3 py-1.5 border border-amber-500/30 text-xs">
              <span className="text-slate-400 mr-1.5 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Trip Admin:
              </span>
              <select
                value={tripAdminId}
                onChange={(e) => setTripAdminId(e.target.value)}
                className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
              >
                {INITIAL_MEMBERS.map(m => (
                  <option key={m.id} value={m.id} className="bg-slate-800 text-white">
                    {m.name} {m.id === currentUser ? '(You)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Viewing as Selector */}
            <div className="flex items-center bg-slate-800/90 rounded-full px-3 py-1.5 border border-slate-700/60 shadow-inner">
              <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                Viewing as:
              </span>
              <div className="flex items-center gap-1.5">
                {INITIAL_MEMBERS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setCurrentUser(m.id)}
                    className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all flex items-center gap-1 ${
                      currentUser === m.id
                        ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <span>{m.avatar}</span>
                    <span>{m.name}</span>
                    {m.id === tripAdminId && (
                      <span className="text-[10px] font-black ml-0.5" title="Designated Trip Admin">🛡️</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Global Search Bar Integrated in Header Bar */}
        <div className="max-w-6xl mx-auto px-4 py-2 border-t border-slate-800/40">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across EVERYTHING (Tour places, expenses, destination polls, holiday dates, badminton matches)..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 pt-1 flex space-x-2 border-t border-slate-800/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'expenses'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Expenses & Split</span>
            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
              ${totalTripSpend.toFixed(0)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'explore'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search Places</span>
          </button>

          <button
            onClick={() => setActiveTab('voting')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'voting'
                ? 'border-rose-400 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Vote className="w-4 h-4" />
            <span>Destination Voting</span>
          </button>

          <button
            onClick={() => setActiveTab('holidays')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'holidays'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Holiday & Tour Plans</span>
            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-md bg-sky-500/10 text-sky-300">
              {holidayProposals.length} Proposed
            </span>
          </button>

          <button
            onClick={() => setActiveTab('meetup')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'meetup'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Daily Meetup / Play Badminton</span>
            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300">
              🏸 Active
            </span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'chat'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat (Group & Private)</span>
            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300">
              💬 Active
            </span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'media'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Place Media Vault</span>
            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-300">
              {mediaItems.length}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        {/* ======================================================== */}
        {/* GLOBAL SEARCH RESULTS OVERLAY (When Search active)      */}
        {/* ======================================================== */}
        {globalSearchResults && (
          <div className="mb-8 p-6 bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Universal Search Results for: <span className="text-cyan-300 italic">"{searchQuery}"</span>
                </h3>
              </div>
              <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full font-semibold border border-cyan-500/30">
                {globalSearchResults.totalCount} matches found
              </span>
            </div>

            {globalSearchResults.totalCount === 0 ? (
              <p className="text-xs text-slate-400 italic py-4">
                No matching tourist places, expenses, polls, holiday dates, or messages found for "{searchQuery}".
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Matched Places */}
                {globalSearchResults.places.map(p => (
                  <div key={p.id} className="p-3.5 bg-slate-800/70 border border-slate-700/60 rounded-xl flex items-start gap-3">
                    <img src={p.image} alt={p.name} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Tourist Spot</span>
                      <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                      <p className="text-[11px] text-slate-400">{p.country} • {p.category}</p>
                      <button
                        onClick={() => { setActiveTab('explore'); }}
                        className="text-[10px] text-cyan-300 hover:underline mt-1 font-semibold flex items-center gap-0.5"
                      >
                        View in Catalog <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Matched Expenses */}
                {globalSearchResults.expenses.map(e => (
                  <div key={e.id} className="p-3.5 bg-slate-800/70 border border-slate-700/60 rounded-xl flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300 font-bold text-xs">
                      ${e.amount}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Trip Expense</span>
                      <h4 className="text-xs font-bold text-white truncate">{e.description}</h4>
                      <p className="text-[11px] text-slate-400">Paid by {getMember(e.paidById).name} • {e.category}</p>
                      <button
                        onClick={() => { setActiveTab('expenses'); }}
                        className="text-[10px] text-amber-300 hover:underline mt-1 font-semibold flex items-center gap-0.5"
                      >
                        View in Ledger <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Matched Polls */}
                {globalSearchResults.polls.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-800/70 border border-slate-700/60 rounded-xl">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Poll / Option</span>
                    <h4 className="text-xs font-bold text-white truncate">{item.option ? item.option.title : item.poll.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{item.poll.title}</p>
                    <button
                      onClick={() => { setActivePollIndex(item.pIdx); setActiveTab('voting'); }}
                      className="text-[10px] text-rose-300 hover:underline mt-1 font-semibold flex items-center gap-0.5"
                    >
                      Go to Poll #{item.pIdx + 1} <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Matched Holiday Proposals */}
                {globalSearchResults.holidays.map(h => (
                  <div key={h.id} className="p-3.5 bg-slate-800/70 border border-slate-700/60 rounded-xl">
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">Holiday Proposal</span>
                    <h4 className="text-xs font-bold text-white truncate">{h.title}</h4>
                    <p className="text-[11px] text-slate-400">{h.destination} ({h.daysCount} days)</p>
                    <button
                      onClick={() => { setActiveTab('holidays'); }}
                      className="text-[10px] text-sky-300 hover:underline mt-1 font-semibold flex items-center gap-0.5"
                    >
                      View Holiday Plan <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Matched Meetup Sessions */}
                {globalSearchResults.sessions.map(s => (
                  <div key={s.id} className="p-3.5 bg-slate-800/70 border border-slate-700/60 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Badminton / Meetup</span>
                    <h4 className="text-xs font-bold text-white truncate">{s.title}</h4>
                    <p className="text-[11px] text-slate-400">{s.courtLocation} ({s.date})</p>
                    <button
                      onClick={() => { setActiveSessionId(s.id); setActiveTab('meetup'); }}
                      className="text-[10px] text-emerald-300 hover:underline mt-1 font-semibold flex items-center gap-0.5"
                    >
                      Open Meetup Session <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Matched Chats */}
                {globalSearchResults.chats.map(m => (
                  <div key={m.id} className="p-3.5 bg-slate-800/70 border border-slate-700/60 rounded-xl">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Chat Message</span>
                    <h4 className="text-xs font-bold text-white truncate">"{m.text}"</h4>
                    <p className="text-[11px] text-slate-400">From {getMember(m.senderId).name} • {m.receiverId ? 'Private' : 'Group'}</p>
                    <button
                      onClick={() => {
                        setActiveChatTarget(m.receiverId ? (m.senderId === currentUser ? m.receiverId : m.senderId) : 'group');
                        setActiveTab('chat');
                      }}
                      className="text-[10px] text-indigo-300 hover:underline mt-1 font-semibold flex items-center gap-0.5"
                    >
                      Open in Chat <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: CHAT (GROUP & PRIVATE 1-ON-1)                       */}
        {/* ======================================================== */}
        {activeTab === 'chat' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-purple-950/30 to-slate-900 border border-indigo-900/40 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400 flex items-center gap-1.5">
                  <MessagesSquare className="w-4 h-4" /> Tour Communication Hub
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1">Group & Private Chat</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Talk with the whole crew in the Trip Group Chat or start a 1-on-1 private chat with any friend.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-indigo-500/30 text-xs">
                <span className="text-slate-400">Chatting as:</span>
                <span className="font-bold text-indigo-300 flex items-center gap-1">
                  <span>{getMember(currentUser).avatar}</span>
                  <span>{getMember(currentUser).name}</span>
                </span>
              </div>
            </div>

            {/* Chat Layout: Sidebar + Message Window */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Left Column: Channels & Members List */}
              <div className="border-b md:border-b-0 md:border-r border-slate-800 p-4 space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Channels
                  </span>
                  <button
                    onClick={() => setActiveChatTarget('group')}
                    className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                      activeChatTarget === 'group'
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessagesSquare className="w-4 h-4 text-amber-300" />
                      <span>Tour Group Chat</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 font-semibold">
                      {chatMessages.filter(m => m.receiverId === null).length}
                    </span>
                  </button>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Direct / Private Messages
                  </span>
                  <div className="space-y-1.5">
                    {INITIAL_MEMBERS.filter(m => m.id !== currentUser).map(m => {
                      const isSelected = activeChatTarget === m.id;
                      const dmCount = chatMessages.filter(msg =>
                        (msg.senderId === currentUser && msg.receiverId === m.id) ||
                        (msg.senderId === m.id && msg.receiverId === currentUser)
                      ).length;

                      return (
                        <button
                          key={m.id}
                          onClick={() => setActiveChatTarget(m.id)}
                          className={`w-full p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                            isSelected
                              ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20'
                              : 'bg-slate-800/40 text-slate-300 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{m.avatar}</span>
                            <span className="truncate">{m.name}</span>
                            {m.id === tripAdminId && (
                              <span className="text-[10px] text-amber-400" title="Trip Admin">🛡️</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Lock className="w-3 h-3 text-slate-400" />
                            {dmCount > 0 && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 text-purple-200">
                                {dmCount}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Chat Messages & Input */}
              <div className="md:col-span-3 flex flex-col h-[520px]">
                {/* Active Chat Header */}
                <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {activeChatTarget === 'group' ? (
                      <>
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Tour Group Chat</h4>
                          <p className="text-[11px] text-slate-400">All {INITIAL_MEMBERS.length} trip members</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">{getMember(activeChatTarget).avatar}</span>
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span>{getMember(activeChatTarget).name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> End-to-End Private
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-400">Private 1-on-1 direct conversation</p>
                        </div>
                      </>
                    )}
                  </div>

                  <span className="text-xs text-slate-500">
                    {currentChatMessages.length} message{currentChatMessages.length === 1 ? '' : 's'}
                  </span>
                </div>

                {/* Message Log */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/20">
                  {currentChatMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                      <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
                      <p className="text-xs">No messages yet in this conversation.</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">Send a message below to start chatting!</p>
                    </div>
                  ) : (
                    currentChatMessages.map(msg => {
                      const isMe = msg.senderId === currentUser;
                      const sender = getMember(msg.senderId);

                      return (
                        <div
                          key={msg.id}
                          className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          <span className="text-xl mt-0.5">{sender.avatar}</span>
                          <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                            isMe
                              ? 'bg-indigo-600 text-white rounded-tr-none'
                              : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/60'
                          }`}>
                            <div className="flex items-center justify-between gap-3 mb-1">
                              <span className={`text-[10px] font-bold ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                {isMe ? 'You' : sender.name}
                              </span>
                              <span className={`text-[9px] ${isMe ? 'text-indigo-200/80' : 'text-slate-500'}`}>
                                {msg.timestamp}
                              </span>
                            </div>
                            <p className="text-xs leading-relaxed break-words">{msg.text}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input Box */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900 flex gap-2">
                  <input
                    type="text"
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    placeholder={
                      activeChatTarget === 'group'
                        ? "Message everyone in Tour Group Chat..."
                        : `Send private direct message to ${getMember(activeChatTarget).name}...`
                    }
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: HOLIDAYS & TOUR PROPOSALS                           */}
        {/* ======================================================== */}
        {activeTab === 'holidays' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950/40 via-blue-950/30 to-slate-900 border border-sky-900/40 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-sky-400 flex items-center gap-1.5">
                  <Palmtree className="w-4 h-4" /> Vacation & Leave Planner
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1">Holiday & Tour Proposals</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Got upcoming office or semester holidays? Share your holiday dates, dream destinations, and estimated budgets so everyone can sync leaves and join the tour!
                </p>
              </div>

              <button
                onClick={() => setIsAddingHoliday(!isAddingHoliday)}
                className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isAddingHoliday ? 'Close Form' : 'Propose Holiday Tour'}</span>
              </button>
            </div>

            {/* Propose Holiday Plan Form */}
            {isAddingHoliday && (
              <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-6 shadow-xl animate-fadeIn">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-sky-300 flex items-center gap-2">
                    <PlaneTakeoff className="w-4 h-4" /> Post Your Holiday Availability & Destination
                  </h4>
                  <span className="text-xs text-slate-400">
                    Posting as: <strong className="text-sky-300">{getMember(currentUser).name}</strong>
                  </span>
                </div>

                <form onSubmit={handleAddHolidayProposal} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Trip / Holiday Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Winter Break Trek, Long Weekend Beach Camp"
                        value={holidayForm.title}
                        onChange={(e) => setHolidayForm({ ...holidayForm, title: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Target Destination(s)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sajek Valley, Banff, Cox's Bazar, Pokhara"
                        value={holidayForm.destination}
                        onChange={(e) => setHolidayForm({ ...holidayForm, destination: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Holiday Start Date
                      </label>
                      <input
                        type="date"
                        value={holidayForm.startDate}
                        onChange={(e) => setHolidayForm({ ...holidayForm, startDate: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Holiday End Date
                      </label>
                      <input
                        type="date"
                        value={holidayForm.endDate}
                        onChange={(e) => setHolidayForm({ ...holidayForm, endDate: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Approx. Budget / Person ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 250"
                        value={holidayForm.approxBudget}
                        onChange={(e) => setHolidayForm({ ...holidayForm, approxBudget: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Tour Vibe / Style
                      </label>
                      <select
                        value={holidayForm.vibe}
                        onChange={(e) => setHolidayForm({ ...holidayForm, vibe: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="Relaxation & Scenic">Relaxation & Scenic</option>
                        <option value="Trekking & Adventure">Trekking & Adventure</option>
                        <option value="Road Trip & Camping">Road Trip & Camping</option>
                        <option value="Beach & Sun">Beach & Sun</option>
                        <option value="Heritage & Food Tour">Heritage & Food Tour</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Holiday Details / Leave Context & Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. My team has mandatory office shutdown from Dec 20-25. Let me know who can manage leave so we can book transit early!"
                      value={holidayForm.notes}
                      onChange={(e) => setHolidayForm({ ...holidayForm, notes: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingHoliday(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/20"
                    >
                      <Palmtree className="w-4 h-4" />
                      Post Holiday Proposal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List of Holiday Proposals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {holidayProposals.map((proposal) => {
                const creator = getMember(proposal.creatorId);
                const isInterested = proposal.interestedMembers.includes(currentUser);

                return (
                  <div
                    key={proposal.id}
                    className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all"
                  >
                    <div>
                      {/* Top tag & Creator */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{creator.avatar}</span>
                          <div>
                            <span className="text-xs font-bold text-white">{creator.name}'s Holiday</span>
                            <p className="text-[10px] text-slate-400">Proposed for group tour</p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          {proposal.vibe}
                        </span>
                      </div>

                      {/* Title & Destination */}
                      <h4 className="text-base font-bold text-white mb-1.5 hover:text-sky-300 transition-colors">
                        {proposal.title}
                      </h4>

                      <div className="flex items-center gap-1.5 text-xs text-sky-300 font-semibold mb-3">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                        <span>{proposal.destination}</span>
                      </div>

                      {/* Dates & Budget Pill box */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Holiday Dates</span>
                          <span className="text-white font-bold text-[11px] block mt-0.5">
                            {proposal.startDate}
                          </span>
                          <span className="text-[10px] text-slate-500">to {proposal.endDate}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Duration</span>
                          <span className="text-sky-300 font-extrabold text-sm block mt-0.5">
                            {proposal.daysCount} Days
                          </span>
                          <span className="text-[10px] text-slate-500">vacation</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Est. Budget</span>
                          <span className="text-emerald-400 font-extrabold text-sm block mt-0.5">
                            {proposal.approxBudget > 0 ? `$${proposal.approxBudget}` : 'Flexible'}
                          </span>
                          <span className="text-[10px] text-slate-500">per person</span>
                        </div>
                      </div>

                      {/* Notes / Leave Context */}
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/30 p-3 rounded-xl border border-slate-800/60 italic mb-4">
                        "{proposal.notes}"
                      </p>
                    </div>

                    {/* Bottom: Friends Interested & Actions */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400 mr-1">Can Join ({proposal.interestedMembers.length}):</span>
                        {proposal.interestedMembers.length === 0 ? (
                          <span className="text-[11px] text-slate-500 italic">No responses yet</span>
                        ) : (
                          proposal.interestedMembers.map(uid => (
                            <span
                              key={uid}
                              title={getMember(uid).name}
                              className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs"
                            >
                              {getMember(uid).avatar}
                            </span>
                          ))
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleHolidayInterest(proposal.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                            isInterested
                              ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20 font-extrabold'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{isInterested ? "I'm In! 🏖️" : 'Mark Interested'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: DAILY MEETUP & PLAY BADMINTON                       */}
        {/* ======================================================== */}
        {activeTab === 'meetup' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-900/40 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" /> Sports & Daily Meetup Scheduler
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1">Daily Meetup / Play Badminton 🏸</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Coordinate game time with friends! Pick your court session, put down the exact hours you can join, mention your gear/shuttles, and find the overlapping match window.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCreatingSession(!isCreatingSession)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isCreatingSession ? 'Cancel' : 'New Match / Meetup'}</span>
                </button>
              </div>
            </div>

            {/* Create Session Form */}
            {isCreatingSession && (
              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 shadow-xl animate-fadeIn">
                <h4 className="text-sm font-bold text-emerald-300 mb-3 flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4" /> Schedule a New Game or Meetup
                </h4>
                <form onSubmit={handleCreateSession} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Session / Activity Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Badminton Doubles Tournament, Post-Dinner Rally"
                      value={newSessionTitle}
                      onChange={(e) => setNewSessionTitle(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Date / Day</label>
                    <input
                      type="text"
                      placeholder="e.g. Friday, Nov 14"
                      value={newSessionDate}
                      onChange={(e) => setNewSessionDate(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Court / Venue Location</label>
                    <input
                      type="text"
                      placeholder="e.g. City Badminton Hall Court #2"
                      value={newSessionLocation}
                      onChange={(e) => setNewSessionLocation(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Gear Notes / Instructions</label>
                    <input
                      type="text"
                      placeholder="e.g. Bring non-marking court shoes and extra shuttle tubes"
                      value={newSessionNote}
                      onChange={(e) => setNewSessionNote(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Create Session
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Session Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Sessions:</span>
              {meetupSessions.map(session => {
                const isSelected = session.id === activeSessionId;
                const availableCount = session.attendees.filter(a => a.status === 'available' || a.status === 'late').length;
                return (
                  <button
                    key={session.id}
                    onClick={() => setActiveSessionId(session.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{session.title}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${isSelected ? 'bg-black/20 text-slate-950 font-extrabold' : 'bg-slate-800 text-emerald-400'}`}>
                      {availableCount} Joined
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Session Card & Join Time Form */}
            {currentMeetupSession && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left/Middle: Session Details & Members Joining Board */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Session Info Bar */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {currentMeetupSession.date}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                            {currentMeetupSession.courtLocation}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-white mt-1.5">{currentMeetupSession.title}</h4>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-slate-400">Total Group Turnout</span>
                        <div className="text-lg font-extrabold text-emerald-400">
                          {currentMeetupSession.attendees.filter(a => a.status === 'available').length} Available
                          {currentMeetupSession.attendees.filter(a => a.status === 'late').length > 0 && (
                            <span className="text-amber-400 text-xs font-normal ml-1">
                              (+{currentMeetupSession.attendees.filter(a => a.status === 'late').length} late)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 italic mb-4">
                      💡 {currentMeetupSession.note}
                    </p>

                    {/* Member Slots Schedule Grid */}
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" /> Member Join Times & Court Readiness
                    </h5>

                    <div className="space-y-3">
                      {INITIAL_MEMBERS.map(m => {
                        const att = currentMeetupSession.attendees.find(a => a.userId === m.id);
                        const status = att ? att.status : 'not_responded';
                        const time = att ? att.timeSlot : 'Has not specified time';
                        const note = att ? att.gearNote : '';

                        return (
                          <div
                            key={m.id}
                            className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 transition-all ${
                              status === 'available'
                                ? 'bg-emerald-950/20 border-emerald-500/30'
                                : status === 'late'
                                ? 'bg-amber-950/20 border-amber-500/30'
                                : status === 'unavailable'
                                ? 'bg-rose-950/20 border-rose-500/30 opacity-70'
                                : 'bg-slate-800/40 border-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{m.avatar}</span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-white">{m.name}</span>
                                  {m.id === currentUser && (
                                    <span className="text-[10px] bg-slate-700 text-emerald-300 px-1.5 py-0.5 rounded font-semibold">You</span>
                                  )}
                                  {status === 'available' && (
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                      Ready to Play 🏸
                                    </span>
                                  )}
                                  {status === 'late' && (
                                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                      Joining Later ⏳
                                    </span>
                                  )}
                                  {status === 'unavailable' && (
                                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                                      Can't Join ❌
                                    </span>
                                  )}
                                  {status === 'not_responded' && (
                                    <span className="text-[10px] text-slate-500 italic">
                                      Pending response
                                    </span>
                                  )}
                                </div>
                                {note && <p className="text-[11px] text-slate-400 mt-0.5">{note}</p>}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-semibold">
                              <Clock className="w-3.5 h-3.5 text-emerald-400" />
                              <span className={status === 'unavailable' ? 'text-slate-500' : 'text-slate-200'}>
                                {time}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right: Put Down My Time Form */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 h-fit">
                  <h4 className="text-base font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Put Down Your Time
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">
                    Updating as <strong className="text-emerald-300">{getMember(currentUser).name}</strong> for this badminton/meetup session.
                  </p>

                  <form onSubmit={handleSaveMeetupTime} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Availability Status</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setUserStatusInput('available')}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                            userStatusInput === 'available'
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          Available 🏸
                        </button>
                        <button
                          type="button"
                          onClick={() => setUserStatusInput('late')}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                            userStatusInput === 'late'
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          Joining Late ⏳
                        </button>
                        <button
                          type="button"
                          onClick={() => setUserStatusInput('unavailable')}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                            userStatusInput === 'unavailable'
                              ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          Can't Join ❌
                        </button>
                      </div>
                    </div>

                    {userStatusInput !== 'unavailable' && (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">When can you join? (Time range)</label>
                          <input
                            type="text"
                            placeholder="e.g. 06:30 PM - 08:30 PM or After 7:00 PM"
                            value={userTimeSlotInput}
                            onChange={(e) => setUserTimeSlotInput(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                          />
                          <div className="flex gap-1.5 mt-2">
                            {['06:00 PM - 08:00 PM', '07:00 PM - 09:00 PM', '08:00 PM - 10:00 PM'].map(quickSlot => (
                              <button
                                key={quickSlot}
                                type="button"
                                onClick={() => setUserTimeSlotInput(quickSlot)}
                                className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                              >
                                {quickSlot.split(' ')[0]}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Racquet, Shuttlecocks & Notes</label>
                          <input
                            type="text"
                            placeholder="e.g. Bringing 2 racquets, 1 feather tube, got grip"
                            value={userGearNoteInput}
                            onChange={(e) => setUserGearNoteInput(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs flex items-center justify-center gap-1.5 transition-all mt-4"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Save My Time & Join
                    </button>

                    {currentUserAttendance && (
                      <p className="text-[11px] text-center text-slate-500 mt-2">
                        Currently logged as: <span className="text-emerald-400 font-semibold">{currentUserAttendance.timeSlot}</span>
                      </p>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: SEARCH TOURIST PLACES BY NAME                      */}
        {/* ======================================================== */}
        {activeTab === 'explore' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900 border border-cyan-900/40">
              <span className="text-xs font-semibold tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> Tourist Destination Directory
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">Search & Discover Tourist Attractions</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Search tourist spots by name or country. Push candidates directly to group voting or initialize a dedicated media album.
              </p>

              {/* Search bar & filter */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                <div className="sm:col-span-2 relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by tourist place name (e.g., Cox's Bazar, Sajek, Kyoto, Banff)..."
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="All">All Categories</option>
                    <option value="Beach & Nature">Beach & Nature</option>
                    <option value="Mountains & Clouds">Mountains & Clouds</option>
                    <option value="Eco & Adventure">Eco & Adventure</option>
                    <option value="Culture & Heritage">Culture & Heritage</option>
                    <option value="Alpine & Lakes">Alpine & Lakes</option>
                    <option value="Coastal & Islands">Coastal & Islands</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Places Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TOURIST_PLACES_CATALOG
                .filter(place => {
                  const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    place.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    place.description.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesCat = categoryFilter === 'All' || place.category === categoryFilter;
                  return matchesSearch && matchesCat;
                })
                .map(place => (
                  <div key={place.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-slate-700 transition-all">
                    <div className="h-48 relative overflow-hidden">
                      <img 
                        src={place.image} 
                        alt={place.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-cyan-300 border border-cyan-500/20">
                        {place.category}
                      </div>
                      <div className="absolute top-3 right-3 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-bold text-amber-300 flex items-center gap-1">
                        ★ {place.rating}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{place.country}</span>
                        </div>
                        <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {place.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                          {place.description}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center gap-2">
                        <button
                          onClick={() => {
                            // Add to first poll if not already there
                            const optExists = polls[0].options.some(o => o.title === place.name);
                            if (!optExists) {
                              setPolls(prev => {
                                const copy = [...prev];
                                copy[0] = {
                                  ...copy[0],
                                  options: [
                                    ...copy[0].options,
                                    {
                                      id: `opt-${Date.now()}`,
                                      title: place.name,
                                      tags: place.category,
                                      votes: [currentUser]
                                    }
                                  ]
                                };
                                return copy;
                              });
                            }
                            setActiveTab('voting');
                          }}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-rose-300 border border-slate-700 flex items-center justify-center gap-1 transition-all"
                        >
                          <Vote className="w-3.5 h-3.5" />
                          <span>Vote on This</span>
                        </button>

                        <button
                          onClick={() => {
                            if (!mediaPlaces.includes(place.name)) {
                              setMediaPlaces(prev => [...prev, place.name]);
                            }
                            setSelectedPlaceForMedia(place.name);
                            setActiveTab('media');
                          }}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-xs font-semibold text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-1 transition-all"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Place Vault</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: TOURIST PLACE MEDIA STORAGE & GALLERY               */}
        {/* ======================================================== */}
        {activeTab === 'media' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-900/40 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-purple-400 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" /> Destination Media Vault
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1">Tourist Place Photos & Videos Storage</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Centralized multi-media vault organized by tourist spot name. Every friend can store photos and video clips tagged directly to the location.
                </p>
              </div>

              {/* Add New Album/Place Button */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="New place album..."
                  value={newPlaceInput}
                  onChange={(e) => setNewPlaceInput(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs px-3 py-2 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => {
                    if (newPlaceInput.trim() && !mediaPlaces.includes(newPlaceInput.trim())) {
                      setMediaPlaces([...mediaPlaces, newPlaceInput.trim()]);
                      setSelectedPlaceForMedia(newPlaceInput.trim());
                      setNewPlaceInput('');
                    }
                  }}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-md shadow-purple-600/20"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Create Album</span>
                </button>
              </div>
            </div>

            {/* Place Album Selection Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Albums:</span>
              {mediaPlaces.map(place => {
                const count = mediaItems.filter(m => m.placeName === place).length;
                const isSelected = selectedPlaceForMedia === place;
                return (
                  <button
                    key={place}
                    onClick={() => setSelectedPlaceForMedia(place)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-purple-500 text-white border-purple-400 shadow-md shadow-purple-500/20'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{place}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isSelected ? 'bg-black/30' : 'bg-slate-800'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Upload form for selected place */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-purple-400" />
                  Store Media in: <strong className="text-purple-300">{selectedPlaceForMedia}</strong>
                </span>
                <span className="text-xs text-slate-400">Uploading as: {getMember(currentUser).name}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="flex gap-2 sm:col-span-1">
                  <button
                    type="button"
                    onClick={() => setUploadMediaType('photo')}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 ${
                      uploadMediaType === 'photo'
                        ? 'bg-purple-600/30 text-purple-300 border-purple-500'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMediaType('video')}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 ${
                      uploadMediaType === 'video'
                        ? 'bg-purple-600/30 text-purple-300 border-purple-500'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" /> Video
                  </button>
                </div>

                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder={uploadMediaType === 'photo' ? "Photo URL (or choose sample below)..." : "MP4 Video URL..."}
                    value={uploadUrl}
                    onChange={(e) => setUploadUrl(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <input
                    type="file"
                    accept={uploadMediaType === 'photo' ? "image/*" : "video/*"}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const localUrl = URL.createObjectURL(file);
                        setUploadUrl(localUrl);
                      }
                    }}
                    className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-purple-300 hover:file:bg-slate-700 cursor-pointer"
                  />
                </div>

                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Add a caption or memory description..."
                    value={uploadCaption}
                    onChange={(e) => setUploadCaption(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <button
                    onClick={() => {
                      const fallbackPhoto = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80";
                      const fallbackVideo = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
                      const finalUrl = uploadUrl.trim() || (uploadMediaType === 'photo' ? fallbackPhoto : fallbackVideo);

                      const newItem = {
                        id: `m-${Date.now()}`,
                        placeName: selectedPlaceForMedia,
                        type: uploadMediaType,
                        url: finalUrl,
                        caption: uploadCaption.trim() || `${uploadMediaType === 'photo' ? 'Photo' : 'Video clip'} at ${selectedPlaceForMedia}`,
                        uploadedBy: currentUser,
                        date: new Date().toISOString().split('T')[0]
                      };

                      setMediaItems([newItem, ...mediaItems]);
                      setUploadUrl('');
                      setUploadCaption('');
                    }}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Save to Album
                  </button>
                </div>
              </div>
            </div>

            {/* Gallery Media Grid */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  Media in "{selectedPlaceForMedia}" ({mediaItems.filter(m => m.placeName === selectedPlaceForMedia).length})
                </h4>
              </div>

              {mediaItems.filter(m => m.placeName === selectedPlaceForMedia).length === 0 ? (
                <div className="py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  <ImageIcon className="w-10 h-10 mx-auto opacity-30 mb-2" />
                  <p className="text-xs">No media uploaded for {selectedPlaceForMedia} yet.</p>
                  <p className="text-[11px] text-slate-600 mt-1">Be the first to upload photos or videos above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {mediaItems
                    .filter(m => m.placeName === selectedPlaceForMedia)
                    .map(item => (
                      <div
                        key={item.id}
                        className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950/60 shadow-md hover:border-purple-500/40 transition-all"
                      >
                        {item.type === 'photo' ? (
                          <div className="h-48 overflow-hidden bg-slate-900 relative">
                            <img
                              src={item.url}
                              alt={item.caption}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <button
                              onClick={() => setLightboxItem(item)}
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                            >
                              <Eye className="w-6 h-6" />
                            </button>
                          </div>
                        ) : (
                          <div className="h-48 overflow-hidden bg-slate-950 relative flex items-center justify-center">
                            <video
                              src={item.url}
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              controls={false}
                            />
                            <button
                              onClick={() => setLightboxItem(item)}
                              className="absolute w-10 h-10 rounded-full bg-purple-600/80 hover:bg-purple-600 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                            >
                              <Play className="w-5 h-5 ml-0.5 fill-current" />
                            </button>
                            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-purple-300 flex items-center gap-1">
                              <Film className="w-3 h-3" /> Video
                            </span>
                          </div>
                        )}

                        <div className="p-3">
                          <p className="text-xs font-semibold text-slate-200 truncate">{item.caption}</p>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                            <span className="flex items-center gap-1">
                              <span>{getMember(item.uploadedBy).avatar}</span>
                              <span>{getMember(item.uploadedBy).name}</span>
                            </span>
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Media Lightbox Modal */}
            {lightboxItem && (
              <div 
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
                onClick={() => setLightboxItem(null)}
              >
                <div 
                  className="max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{lightboxItem.placeName}</h4>
                      <p className="text-xs text-slate-400">{lightboxItem.caption}</p>
                    </div>
                    <button
                      onClick={() => setLightboxItem(null)}
                      className="text-slate-400 hover:text-white text-sm font-bold px-2 py-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-4 bg-black flex items-center justify-center max-h-[65vh]">
                    {lightboxItem.type === 'photo' ? (
                      <img src={lightboxItem.url} alt={lightboxItem.caption} className="max-h-[60vh] object-contain rounded-lg" />
                    ) : (
                      <video src={lightboxItem.url} controls autoPlay className="max-h-[60vh] max-w-full rounded-lg" />
                    )}
                  </div>

                  <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Uploaded by <strong>{getMember(lightboxItem.uploadedBy).name}</strong> on {lightboxItem.date}</span>
                    <button 
                      onClick={() => {
                        setMediaItems(mediaItems.filter(m => m.id !== lightboxItem.id));
                        setLightboxItem(null);
                      }}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove from Vault
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: EXPENSES & ACCOUNT BALANCES                       */}
        {/* ======================================================== */}
        {activeTab === 'expenses' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-slate-700">
                  <TrendingUp className="w-12 h-12 opacity-30" />
                </div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Total Trip Expense</p>
                <h3 className="text-3xl font-extrabold text-white mt-2">${totalTripSpend.toFixed(2)}</h3>
                <p className="text-xs text-slate-500 mt-1">Split across {INITIAL_MEMBERS.length} friends</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-slate-700">
                  <Receipt className="w-12 h-12 opacity-30" />
                </div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Your Net Standing ({getMember(currentUser).name})</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className={`text-3xl font-extrabold ${balances[currentUser] >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {balances[currentUser] >= 0 ? `+$${balances[currentUser].toFixed(2)}` : `-$${Math.abs(balances[currentUser]).toFixed(2)}`}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {balances[currentUser] >= 0 ? 'You are owed money by the group' : 'You need to settle up your share'}
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-slate-700">
                  <ArrowRightLeft className="w-12 h-12 opacity-30" />
                </div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Pending Settlements</p>
                <h3 className="text-3xl font-extrabold text-amber-400 mt-2">{settlementTransfers.length}</h3>
                <p className="text-xs text-slate-400 mt-1">Direct transfers to resolve all debts</p>
              </div>

              {/* Admin Approval Queue Counter Card */}
              <div className="bg-slate-900/80 border border-amber-500/30 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-amber-500/20">
                  <ShieldCheck className="w-12 h-12" />
                </div>
                <p className="text-xs uppercase tracking-wider text-amber-400 font-medium flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" /> Payment Approvals
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-2">
                  {paymentDeposits.filter(d => d.status === 'pending').length}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-slate-400">
                    {isAdmin ? 'Awaiting your admin review' : `Managed by ${getMember(tripAdminId).name}`}
                  </p>
                  <button
                    onClick={() => setIsDepositModalOpen(true)}
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline"
                  >
                    + Send Money
                  </button>
                </div>
              </div>
            </div>

            {/* MEMBER PAYMENT / DEPOSIT SUBMISSION MODAL */}
            {isDepositModalOpen && (
              <div 
                className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
                onClick={() => setIsDepositModalOpen(false)}
              >
                <div 
                  className="max-w-md w-full bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-amber-400" />
                      <h4 className="text-base font-bold text-white">Record Member Trip Payment</h4>
                    </div>
                    <button
                      onClick={() => setIsDepositModalOpen(false)}
                      className="text-slate-400 hover:text-white text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    Paid money towards the tour fund? Submit payment details here. The payment will route to Trip Admin <strong className="text-amber-300">{getMember(tripAdminId).name}</strong> for verification before crediting your balance.
                  </p>

                  <form onSubmit={handleSubmitDeposit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Amount Paid ($ USD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        placeholder="e.g. 100"
                        value={depositForm.amount}
                        onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Payment Channel / Transaction ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. bKash / Nagad Trx #9J24K or Cash in hand"
                        value={depositForm.paymentMethod}
                        onChange={(e) => setDepositForm({ ...depositForm, paymentMethod: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Notes / Purpose
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Sent $100 for hotel advance reservation"
                        value={depositForm.notes}
                        onChange={(e) => setDepositForm({ ...depositForm, notes: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsDepositModalOpen(false)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Submit for Admin Approval
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ADMIN APPROVAL BOARD FOR PAYMENTS */}
            <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      Tour Payment Approvals
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">
                        Admin: {getMember(tripAdminId).name}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Members submit payments for the tour. The tour admin approves once the funds are physically or digitally received.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsDepositModalOpen(true)}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Input Payment Made</span>
                  </button>
                </div>
              </div>

              {/* Deposit List */}
              <div className="divide-y divide-slate-800">
                {paymentDeposits.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">No payment deposit requests submitted yet.</p>
                ) : (
                  paymentDeposits.map((dep) => {
                    const member = getMember(dep.memberId);
                    const isPending = dep.status === 'pending';

                    return (
                      <div key={dep.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{member.avatar}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-bold text-slate-200">
                                {member.name} paid <span className="text-emerald-400 font-extrabold">${dep.amount.toFixed(2)}</span>
                              </h5>
                              {dep.status === 'pending' && (
                                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                  Pending Approval ⏳
                                </span>
                              )}
                              {dep.status === 'approved' && (
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                  Approved & Credited ✓
                                </span>
                              )}
                              {dep.status === 'rejected' && (
                                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                                  Rejected ✕
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Channel: <strong className="text-slate-300">{dep.paymentMethod}</strong> • {dep.notes}
                            </p>
                            <span className="text-[10px] text-slate-500">Date: {dep.date}</span>
                          </div>
                        </div>

                        {/* Admin Action Buttons */}
                        <div className="flex items-center gap-2">
                          {isPending && (
                            isAdmin ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleReviewDeposit(dep.id, 'approved')}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-md shadow-emerald-600/20"
                                  title="Confirm money received and credit to trip fund"
                                >
                                  <Check className="w-3.5 h-3.5" /> Approve & Credit
                                </button>
                                <button
                                  onClick={() => handleReviewDeposit(dep.id, 'rejected')}
                                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1"
                                  title="Reject if payment not received"
                                >
                                  <X className="w-3.5 h-3.5" /> Reject
                                </button>
                              </div>
                            ) : (
                              <div className="text-[11px] text-slate-400 italic flex items-center gap-1 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                                <AlertCircle className="w-3 h-3 text-amber-400" />
                                Awaiting Admin ({getMember(tripAdminId).name}) verification
                              </div>
                            )
                          )}
                          {!isPending && (
                            <button
                              onClick={() => setPaymentDeposits(paymentDeposits.filter(d => d.id !== dep.id))}
                              className="text-slate-500 hover:text-rose-400 p-1"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Balances & Settlement Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Member Net Balances */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <h4 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  Group Net Balances
                </h4>
                <div className="space-y-3">
                  {INITIAL_MEMBERS.map(m => {
                    const bal = balances[m.id] || 0;
                    return (
                      <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{m.avatar}</span>
                          <div>
                            <span className="text-sm font-semibold text-slate-200">{m.name}</span>
                            {currentUser === m.id && (
                              <span className="ml-2 text-[10px] bg-slate-700 text-amber-300 px-1.5 py-0.5 rounded">You</span>
                            )}
                            {tripAdminId === m.id && (
                              <span className="ml-1 text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">Admin</span>
                            )}
                          </div>
                        </div>
                        <div className={`text-sm font-bold ${bal >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {bal >= 0 ? `+$${bal.toFixed(2)}` : `-$${Math.abs(bal).toFixed(2)}`}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Settle Up Recommendation */}
                <div className="mt-6 pt-5 border-t border-slate-800">
                  <h5 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">Optimal Settlement Plan</h5>
                  {settlementTransfers.length === 0 ? (
                    <div className="text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-center">
                      All balances are completely settled! 🥂
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {settlementTransfers.map((st, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-800/70 border border-slate-700/50">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-rose-300">{getMember(st.from).name}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                            <span className="font-semibold text-emerald-300">{getMember(st.to).name}</span>
                          </div>
                          <span className="font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            ${st.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Add Expense Form */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 lg:col-span-2">
                <h4 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  Log New Trip Expense
                </h4>
                <form onSubmit={handleAddExpense} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Dinner, Boat tickets, Fuel"
                        value={expenseForm.description}
                        onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                        className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Amount ($ USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.5"
                        placeholder="0.00"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                        className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Paid By</label>
                      <select
                        value={expenseForm.paidById}
                        onChange={(e) => setExpenseForm({ ...expenseForm, paidById: e.target.value })}
                        className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {INITIAL_MEMBERS.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.avatar} {m.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
                      <select
                        value={expenseForm.category}
                        onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                        className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Food">🍽️ Food & Drinks</option>
                        <option value="Lodging">🏨 Hotel & Lodging</option>
                        <option value="Transit">🚗 Rides & Gas</option>
                        <option value="Activity">🎟️ Tickets & Fun</option>
                        <option value="Other">📦 Other Supplies</option>
                      </select>
                    </div>
                  </div>

                  {/* Split between selection */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">
                      Split equally between ({expenseForm.splitBetween.length} selected):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {INITIAL_MEMBERS.map(m => {
                        const isSelected = expenseForm.splitBetween.includes(m.id);
                        return (
                          <button
                            type="button"
                            key={m.id}
                            onClick={() => toggleSplitUser(m.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                              isSelected
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                                : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <span>{m.avatar}</span>
                            <span>{m.name}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Save & Split Expense
                  </button>
                </form>
              </div>
            </div>

            {/* Expense Transaction History */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <h4 className="text-base font-bold text-slate-200 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-400" />
                  Transaction History ({expenses.length})
                </span>
                <span className="text-xs text-slate-500 font-normal">Real-time ledger</span>
              </h4>

              <div className="divide-y divide-slate-800">
                {expenses.map(exp => (
                  <div key={exp.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg">
                        {exp.category === 'Lodging' && '🏨'}
                        {exp.category === 'Food' && '🍽️'}
                        {exp.category === 'Transit' && '🚗'}
                        {exp.category === 'Activity' && '🎟️'}
                        {exp.category === 'Other' && '📦'}
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-slate-200">{exp.description}</h5>
                        <p className="text-xs text-slate-400">
                          Paid by <strong className="text-slate-300">{getMember(exp.paidById).name}</strong> • Split with {exp.splitBetween.length} friends
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-base font-bold text-white">${exp.amount.toFixed(2)}</span>
                        <p className="text-[11px] text-slate-400">
                          (${(exp.amount / exp.splitBetween.length).toFixed(2)}/ea)
                        </p>
                      </div>
                      <button
                        onClick={() => setExpenses(expenses.filter(e => e.id !== exp.id))}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: DESTINATION & ACTIVITY VOTING                     */}
        {/* ======================================================== */}
        {activeTab === 'voting' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900 border border-rose-900/40 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-rose-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Democratic Itinerary
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1">Tour Destination & Activities Polls</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Propose places to visit, restaurants, or experiences. Vote on your preferences to lock in the final itinerary.
                </p>
              </div>

              {/* Poll Selector */}
              <div className="flex gap-2">
                {polls.map((poll, idx) => (
                  <button
                    key={poll.id}
                    onClick={() => setActivePollIndex(idx)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl transition-all border ${
                      activePollIndex === idx
                        ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Poll #{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Poll Details */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <div className="mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question #{activePollIndex + 1}</span>
                <h2 className="text-xl font-bold text-slate-100 mt-1">{polls[activePollIndex].title}</h2>
              </div>

              {/* Poll Options Grid */}
              <div className="space-y-4">
                {polls[activePollIndex].options.map(option => {
                  const hasVoted = option.votes.includes(currentUser);
                  const totalVotes = polls[activePollIndex].options.reduce((sum, o) => sum + o.votes.length, 0);
                  const percentage = totalVotes > 0 ? Math.round((option.votes.length / totalVotes) * 100) : 0;

                  return (
                    <div
                      key={option.id}
                      className={`p-4 rounded-xl border transition-all ${
                        hasVoted
                          ? 'bg-rose-950/20 border-rose-500/50 shadow-md'
                          : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-semibold text-slate-100">{option.title}</h4>
                            <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                              {option.tags}
                            </span>
                          </div>
                          {/* Voter Avatars */}
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[11px] text-slate-400 mr-1">Voters:</span>
                            {option.votes.length === 0 ? (
                              <span className="text-[11px] text-slate-500 italic">No votes yet</span>
                            ) : (
                              option.votes.map(uid => (
                                <span
                                  key={uid}
                                  title={getMember(uid).name}
                                  className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs"
                                >
                                  {getMember(uid).avatar}
                                </span>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Vote Button */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleVote(activePollIndex, option.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                              hasVoted
                                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 hover:bg-rose-600'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                            }`}
                          >
                            <Vote className="w-4 h-4" />
                            <span>{hasVoted ? 'Voted' : 'Upvote'}</span>
                            <span className="bg-black/30 px-1.5 py-0.5 rounded text-[10px]">
                              {option.votes.length}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                        <div
                          className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                        <span>{option.votes.length} votes</span>
                        <span>{percentage}% of total</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Option Form */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <h5 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  Suggest an Alternative Destination or Activity
                </h5>
                <form onSubmit={handleAddOption} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="e.g. Whistler Mountain Bike Park"
                    value={newOptionText}
                    onChange={(e) => setNewOptionText(e.target.value)}
                    className="sm:col-span-2 bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Tag (e.g. Adventure, Food)"
                    value={newOptionTag}
                    onChange={(e) => setNewOptionTag(e.target.value)}
                    className="bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    type="submit"
                    className="sm:col-span-3 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all shadow-md shadow-rose-500/20 text-sm flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Propose & Cast My Vote
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        WanderSync — Unified Trip Accounts, Destination Polls & Place Media Vault
      </footer>
    </div>
  );
}