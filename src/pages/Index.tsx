import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Shield, Heart, BookOpen, Phone, User, LogOut, Ambulance, Clock, Activity, Stethoscope, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userService, authService, doctorService } from '@/lib/services';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { waitingListService } from '@/lib/services';
import BulletinBoard from '@/components/BulletinBoard';

const FALLBACK_SCHEDULE = [
  { id: 1, day_name: 'Monday', doctor_name: 'Dr. John', specialization: 'General', status: 'Available', current_appointments: 0, max_slots: 10 },
  { id: 2, day_name: 'Tuesday', doctor_name: 'Dr. John', specialization: 'Gynecologist', status: 'Available', current_appointments: 0, max_slots: 10 },
  { id: 3, day_name: 'Wednesday', doctor_name: 'Dr. John', specialization: 'General', status: 'Available', current_appointments: 0, max_slots: 10 },
  { id: 4, day_name: 'Thursday', doctor_name: 'Dr. John', specialization: 'Orthopedic', status: 'Available', current_appointments: 0, max_slots: 10 },
  { id: 5, day_name: 'Friday', doctor_name: 'Dr. John', specialization: 'General', status: 'Available', current_appointments: 0, max_slots: 10 },
  { id: 6, day_name: 'Saturday', doctor_name: 'Dr. John', specialization: 'General', status: 'Available', current_appointments: 0, max_slots: 10 },
  { id: 7, day_name: 'Sunday', doctor_name: 'No Doctor Available', specialization: 'N/A', status: 'Offline', current_appointments: 0, max_slots: 10 }
];

export default function Index() {
  const [user, setUser] = useState<any>(null);
  const [doctorSchedule, setDoctorSchedule] = useState<any[]>(FALLBACK_SCHEDULE);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [bookingPurpose, setBookingPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

    // Send activity heartbeat if user is logged in
    const sendHeartbeat = async () => {
      if (authService.isAuthenticated()) {
        try {
          await userService.updateLastActive();
        } catch (e) {
          console.error('Failed to update activity:', e);
        }
      }
    };

    // Send heartbeat immediately
    sendHeartbeat();

    // Send heartbeat every 60 seconds
    const heartbeatInterval = setInterval(sendHeartbeat, 60000);

    return () => clearInterval(heartbeatInterval);
  }, []);

  // Fetch Doctor Schedule
  useEffect(() => {
    fetchSchedule();
    const interval = setInterval(fetchSchedule, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await doctorService.getSchedule();
      if (response.success && response.data && response.data.length > 0) {
        setDoctorSchedule(response.data);
      } else if (response.success && (!response.data || response.data.length === 0)) {
        // Keep fallback if data is empty but response succeeded
        setDoctorSchedule(FALLBACK_SCHEDULE);
      }
    } catch (error) {
      console.error('Failed to fetch doctor schedule, using fallback:', error);
      setDoctorSchedule(FALLBACK_SCHEDULE);
    } finally {
      setLoadingDoctor(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800 border-green-200';
      case 'Busy': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Offline': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleBookingInit = (doctor: any) => {
    if (!authService.isAuthenticated()) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }
    setSelectedDoctor(doctor);
    setIsBookingModalOpen(true);
  };

  const handleJoinWaitlist = async () => {
    if (!selectedDoctor) return;
    
    setIsSubmitting(true);
    try {
      const response = await waitingListService.join(
        selectedDoctor.id, 
        'General Illness', 
        bookingPurpose || 'General Consultation', 
        3,
        ''
      );
      if (response.success) {
        toast.success('Successfully joined the waiting list!', {
          description: `You are at position #${response.position}.`,
        });
        setIsBookingModalOpen(false);
        navigate('/medical/waitlist');
      } else {
        toast.error(response.message || 'Failed to join waiting list');
      }
    } catch (error) {
      console.error('Waitlist error:', error);
      toast.error('Connection error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmbulanceCall = () => {
    if (window.confirm("Are you sure you want to call Ambulance?")) {
      toast.info('Calling Ambulance...', {
        description: 'Connecting to 102 - Ambulance Service',
      });
      window.location.href = 'tel:102';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">SafeSpace</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/safety" className="text-gray-700 hover:text-blue-600 transition-colors">Safety Hub</Link>
              <Link to="/wellness" className="text-gray-700 hover:text-blue-600 transition-colors">Wellness Hub</Link>
              <Link to="/resources" className="text-gray-700 hover:text-blue-600 transition-colors">Resources</Link>
              <Link to="/security" className="text-gray-700 hover:text-blue-600 transition-colors">Security</Link>
              <Link to="/feedback" className="text-gray-700 hover:text-blue-600 transition-colors">Feedback & Reports</Link>
              <Link to="/medical/my-appointments" className="text-gray-700 hover:text-blue-600 transition-colors">My Appointments</Link>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition-colors">Profile</Link>
              
              {user ? (
                <div className="flex items-center space-x-4 ml-4">
                  <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profile_picture} alt={user.first_name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </span>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-4">
                  <Link to="/login">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          {user && (
            <div className="mb-6 inline-block">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-3">
                <p className="text-lg text-blue-900">
                  👋 Welcome back, <span className="font-bold">{user.first_name}!</span>
                </p>
              </div>
            </div>
          )}
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Safety & Wellness
            <span className="block text-blue-600">Matters</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            SafeSpace is your comprehensive platform for student safety, mental health support, and wellness resources. 
            Get help when you need it, access professional support, and prioritize your well-being.
          </p>
          <div className="flex justify-center mt-10">
            <button
              onClick={handleAmbulanceCall}
              className="group relative flex flex-col items-center justify-center w-64 h-64 rounded-full
                bg-red-600 hover:bg-red-700 active:scale-95 text-white
                shadow-[0_0_50px_rgba(220,38,38,0.5)] hover:shadow-[0_0_70px_rgba(220,38,38,0.8)]
                transition-all duration-300 transform hover:-translate-y-1"
              aria-label="Call Ambulance 102"
            >
              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20 group-hover:opacity-40"></div>
              <Ambulance className="h-20 w-20 mb-3 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-2xl font-black tracking-tighter">CALL AMBULANCE</span>
              <span className="text-sm font-bold mt-1 opacity-80 uppercase tracking-widest">Tap to Dial 102</span>
            </button>
          </div>
        </div>

        <BulletinBoard />

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Link to="/wellness" className="group">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Stress Relief</CardTitle>
                <CardDescription>Guided breathing & mindfulness</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/self_guidance" className="group">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Self-Help Guides</CardTitle>
                <CardDescription>Educational resources & tips</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/resources" className="group">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <User className="h-12 w-12 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Counseling Session</CardTitle>
                <CardDescription>Book professional support</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/security" className="group">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Phone className="h-12 w-12 text-red-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Crisis Helpline</CardTitle>
                <CardDescription>24/7 emergency contacts</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Pharmacy Timings Section */}
        <div className="mb-16">
          <Card className="border-blue-50 bg-white/80 backdrop-blur-md shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="flex flex-col items-center gap-6">
                <div className="bg-blue-600/10 p-6 rounded-3xl">
                  <Activity className="h-12 w-12 text-blue-600" />
                </div>
                
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Campus Pharmacy</h2>
                  <p className="text-slate-500 font-medium text-lg">Medicine and essential health services at your fingertips</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
                  <div className="bg-slate-50 border border-slate-100 px-8 py-4 rounded-2xl">
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Operating Hours</div>
                    <div className="text-2xl font-black text-slate-900">8:00 AM – 8:00 PM</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Open Daily for Students</div>
                  </div>

                  {(() => {
                    const now = new Date();
                    const hours = now.getHours();
                    const isOpen = hours >= 8 && hours < 20;
                    
                    return (
                      <div className={`px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg inline-flex items-center gap-2 text-white transition-all ${
                        isOpen ? "bg-green-500 hover:bg-green-600 shadow-green-100" : "bg-red-500 hover:bg-red-600 shadow-red-100"
                      }`}>
                        <Clock className="h-4 w-4" />
                        {isOpen ? "Open Now" : "Closed"}
                      </div>
                    );
                  })()}
                </div>

                <p className="max-w-md text-slate-400 text-sm font-medium mt-4 leading-relaxed">
                  Please visit during working hours for medicines and official prescriptions. 
                  In case of emergencies after 8 PM, please use the SOS feature or contact the crisis hotline.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Doctor Availability Dashboard Container */}
        <Card className="mb-16 border-blue-100 bg-white/50 backdrop-blur-sm shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-white/80 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">Doctor Availability Dashboard</CardTitle>
                  <CardDescription className="text-blue-100 font-medium text-lg mt-1">
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 border rounded-2xl font-bold backdrop-blur-md"
                  onClick={() => navigate('/medical/queue')}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Live Queue Dashboard
                </Button>
                <div className="bg-green-500/20 text-green-300 px-4 py-3 rounded-2xl flex items-center gap-3 border border-green-500/30">
                  <Activity className="h-5 w-5 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest leading-none">Live System Online</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingDoctor ? (
                Array(7).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse h-44 bg-gray-100 rounded-3xl"></div>
                ))
              ) : (
                doctorSchedule.map((item) => {
                  const isToday = item.day_name === new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
                  const isOffline = item.status === 'Offline' || item.day_name === 'Sunday';
                  const slotsFull = item.current_appointments >= item.max_slots;
                  const showWaitlist = item.status === 'Busy' || slotsFull;

                  return (
                    <Card 
                      key={item.id} 
                      className={`group relative overflow-hidden transition-all duration-500 border-2 
                        ${isToday 
                          ? 'border-blue-500 shadow-xl shadow-blue-100 scale-[1.03] z-10 bg-white' 
                          : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-lg'
                        } 
                        ${isOffline ? 'opacity-60 grayscale-[0.5]' : ''}
                      `}
                    >
                      {isToday && (
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500"></div>
                      )}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                            ${isToday ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                            {item.day_name} {isToday && '• Today'}
                          </div>
                          <Badge className={`${getStatusColor(item.status)} border-0 shadow-none font-bold text-[10px] px-2.5 py-1 uppercase tracking-wider`}>
                            {item.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center mb-6">
                          <div className={`p-4 rounded-2xl mr-4 shadow-sm transition-transform duration-500 group-hover:scale-110
                            ${isToday ? 'bg-blue-600 text-white' : isOffline ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600'}`}>
                            <User className="h-6 w-6" />
                          </div>
                          <div className="overflow-hidden">
                            <h4 className={`text-xl font-black truncate leading-tight tracking-tight
                              ${isToday ? 'text-blue-900' : isOffline ? 'text-gray-400' : 'text-gray-900'}`}>
                                {item.doctor_name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`flex items-center text-xs font-bold uppercase tracking-widest
                                ${isOffline ? 'text-gray-400' : 'text-blue-500'}`}>
                                <Calendar className="h-3 w-3 mr-1.5" />
                                {item.specialization}
                              </div>
                              {!isOffline && (
                                <Badge variant="outline" className={`text-[9px] font-bold px-1.5 py-0 rounded-md
                                  ${slotsFull ? 'text-red-600 bg-red-50 border-red-100' : 'text-green-600 bg-green-50 border-green-100'}`}>
                                  {slotsFull ? 'FULL' : `${item.max_slots - item.current_appointments} SLOTS LEFT`}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className={`pt-4 border-t flex items-center justify-between
                          ${isToday ? 'border-blue-100' : 'border-gray-50'}`}>
                           <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                             <Clock className="h-3 w-3 mr-1.5" />
                             Full-Day Schedule
                           </div>
                           {!isOffline && (
                             <div className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                           )}
                        </div>

                        {!isOffline && (
                          <div className="mt-6">
                            <Button 
                               className={`w-full font-bold py-6 rounded-2xl transition-all duration-300
                                 ${showWaitlist 
                                   ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200 border shadow-none' 
                                   : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100'}`}
                               onClick={showWaitlist ? () => handleBookingInit(item) : () => navigate('/medical/book-appointment', { state: { doctor: item } })}
                             >
                               {showWaitlist ? 'Join Waiting List' : 'Book Appointment'}
                             </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
            <div className="mt-8 text-center text-sm text-gray-400 font-medium">
              * Schedule is subject to change. Please contact professional support for emergencies.
            </div>
          </CardContent>
        </Card>

        {/* Features Overview */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span>Safety Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Campus security directory</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-green-600" />
                <span>Wellness Tools</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Daily mood tracking & journaling</li>
                <li>• Guided breathing exercises</li>
                <li>• Mindfulness & meditation sessions</li>
                <li>• Sleep tips & healthy routines</li>
                <li>• Positive affirmations & coping strategies</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">SafeSpace</span>
          </div>
          <p className="text-gray-400">Your safety and wellness matter. We're here to help, 24/7.</p>
        </div>
      </footer>

      {/* Booking / Waitlist Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl p-8 border-blue-50 bg-white shadow-2xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight leading-none flex items-center gap-2">
              {(selectedDoctor?.status === 'Busy' || (selectedDoctor?.current_appointments >= selectedDoctor?.max_slots)) ? (
                <>
                  <Clock className="h-6 w-6 text-orange-600" />
                  Join Waiting List
                </>
              ) : (
                <>
                  <Calendar className="h-6 w-6 text-blue-600" />
                  Book Appointment
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-gray-600 font-medium leading-relaxed">
              {(selectedDoctor?.status === 'Busy' || (selectedDoctor?.current_appointments >= selectedDoctor?.max_slots))
                ? `Dr. ${selectedDoctor?.doctor_name}'s slots are currently full. Joining the waitlist will notify you once a slot becomes available.`
                : `Confirm your appointment with Dr. ${selectedDoctor?.doctor_name} for ${selectedDoctor?.day_name}.`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-6 border-y border-slate-50 my-2">
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Selected Specialist</Label>
              <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-200">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 leading-none">{selectedDoctor?.doctor_name}</div>
                  <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1.5">{selectedDoctor?.specialization}</div>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="purpose" className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Purpose of Consultation</Label>
              <Input
                id="purpose"
                placeholder="Briefly describe your concern..."
                className="rounded-xl border-slate-200 focus:ring-blue-500 py-6 px-4 font-medium text-slate-900"
                value={bookingPurpose}
                onChange={(e) => setBookingPurpose(e.target.value)}
              />
            </div>

            {(selectedDoctor?.status === 'Busy' || (selectedDoctor?.current_appointments >= selectedDoctor?.max_slots)) && (
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex gap-3 items-start">
                <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-800 font-bold leading-relaxed">
                  You are entering the queue. You will be redirected to your live waitlist tracker after confirmation.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3 pt-4">
            <Button 
              variant="ghost" 
              onClick={() => setIsBookingModalOpen(false)}
              className="rounded-2xl font-black uppercase tracking-widest text-[10px] py-6 px-6 text-slate-400 hover:text-slate-600"
            >
              Cancel
            </Button>
            <Button 
              className={`rounded-2xl font-black uppercase tracking-widest text-[10px] py-6 px-8 shadow-xl transition-all active:scale-95
                ${(selectedDoctor?.status === 'Busy' || (selectedDoctor?.current_appointments >= selectedDoctor?.max_slots))
                  ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-100' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}
              onClick={(selectedDoctor?.status === 'Busy' || (selectedDoctor?.current_appointments >= selectedDoctor?.max_slots)) ? handleJoinWaitlist : () => navigate('/medical/book-appointment', { state: { doctor: selectedDoctor } })}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {(selectedDoctor?.status === 'Busy' || (selectedDoctor?.current_appointments >= selectedDoctor?.max_slots)) ? 'Join Digital Queue' : 'Confirm Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}