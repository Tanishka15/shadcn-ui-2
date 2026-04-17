import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, ArrowLeft, Loader2, Search, Filter, Calendar, CheckCircle2, XCircle, Clock, Users, Activity, ListOrdered } from 'lucide-react';
import { appointmentService, waitingListService } from '@/lib/services';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [waitingList, setWaitingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('booked');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const pollInterval = useRef<any>(null);

  const fetchData = async () => {
    try {
      const [aptRes, waitRes] = await Promise.all([
        appointmentService.getAllAdmin(),
        waitingListService.getAllAdmin()
      ]);
      
      if (aptRes.success) setAppointments(aptRes.data);
      if (waitRes.success) setWaitingList(waitRes.data);
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    pollInterval.current = setInterval(fetchData, 15000); // 15s auto-refresh for "Live" feel
    return () => clearInterval(pollInterval.current);
  }, []);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const response = await appointmentService.updateStatus(id, newStatus);
      if (response.success) {
        toast.success(`Status updated to ${newStatus}`);
        setAppointments(appointments.map(apt => 
          apt.id === id ? { ...apt, status: newStatus } : apt
        ));
      } else {
        toast.error(response.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Connection error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      case 'Completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityBadge = (level: number) => {
    switch (level) {
      case 1: return <Badge className="bg-red-100 text-red-600 border-red-200 font-black uppercase tracking-tighter text-[7px] px-1.5 h-4">Priority 1</Badge>;
      case 2: return <Badge className="bg-orange-100 text-orange-600 border-orange-200 font-black uppercase tracking-tighter text-[7px] px-1.5 h-4">Priority 2</Badge>;
      case 3: return <Badge className="bg-blue-100 text-blue-600 border-blue-200 font-black uppercase tracking-tighter text-[7px] px-1.5 h-4">Priority 3</Badge>;
      default: return <Badge variant="outline" className="text-slate-400 border-slate-200 font-black uppercase tracking-tighter text-[7px] px-1.5 h-4">Standard</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Button 
              variant="ghost" 
              className="mb-4 -ml-2 hover:bg-white text-slate-600 font-bold"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Admin Portal
            </Button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Master Queue
              <Badge variant="outline" className="animate-pulse bg-blue-50 text-blue-600 border-blue-100 font-black tracking-tighter text-[10px]">
                LIVE TRACKING
              </Badge>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Real-time oversight of appointments and digital waiting lists.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Booked</div>
                  <div className="text-xl font-black text-slate-900 leading-tight">{appointments.length}</div>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Waiting</div>
                  <div className="text-xl font-black text-slate-900 leading-tight">{waitingList.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="booked" className="w-full space-y-8" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 h-auto">
              <TabsTrigger value="booked" className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirmed Bookings
              </TabsTrigger>
              <TabsTrigger value="waiting" className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs">
                <ListOrdered className="h-4 w-4 mr-2" />
                Live Waiting List
              </TabsTrigger>
            </TabsList>
            
            <span className="text-[10px] font-mono text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
              Synced at: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>

          <TabsContent value="booked" className="mt-0 outline-none">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-white">
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-bold">Syncing encrypted data...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-none">
                          <TableHead className="text-xs font-black uppercase text-slate-400 tracking-widest px-8 py-6">Student</TableHead>
                          <TableHead className="text-xs font-black uppercase text-slate-400 tracking-widest py-6 px-1">Pri</TableHead>
                          <TableHead className="text-xs font-black uppercase text-slate-400 tracking-widest py-6">Token</TableHead>
                          <TableHead className="text-xs font-black uppercase text-slate-400 tracking-widest py-6">Doctor / Day</TableHead>
                          <TableHead className="text-xs font-black uppercase text-slate-400 tracking-widest py-6 text-center">Status</TableHead>
                          <TableHead className="text-xs font-black uppercase text-slate-400 tracking-widest py-6 text-right px-8">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.map((apt) => (
                          <TableRow key={apt.id} className="hover:bg-slate-50/30 transition-colors border-slate-50">
                            <TableCell className="px-8 py-6">
                              <div className="font-bold text-slate-900">{apt.student_name}</div>
                              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                                {apt.purpose_category || apt.purpose}
                              </div>
                              {(apt.purpose_detail || apt.custom_reason) && (
                                <div className="text-[9px] font-medium text-slate-400 uppercase tracking-tight mt-0.5">
                                  {apt.purpose_detail === 'Other' ? (
                                    <span className="text-blue-500 font-bold italic">“{apt.custom_reason}”</span>
                                  ) : (
                                    apt.purpose_detail
                                  )}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="px-1">
                                {getPriorityBadge(apt.priority_level)}
                            </TableCell>
                            <TableCell>
                              <div className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-md shadow-blue-100">
                                #{apt.token_number || '--'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-bold text-slate-700">Dr. {apt.doctor_name}</div>
                              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mt-1">{apt.appointment_day} • {apt.specialization}</div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={`${getStatusColor(apt.status)} border-none font-black uppercase tracking-widest text-[8px] px-3 py-1`}>
                                {apt.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right px-8">
                              <Select 
                                onValueChange={(val) => handleStatusUpdate(apt.id, val)}
                                defaultValue={apt.status}
                              >
                                <SelectTrigger className="w-32 inline-flex border-slate-200 rounded-xl font-bold text-[10px] h-10">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                                  <SelectItem value="Completed">Completed</SelectItem>
                                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="waiting" className="mt-0 outline-none">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-orange-50/30">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="text-xs font-black uppercase text-orange-400 tracking-widest px-8 py-6">Pos</TableHead>
                        <TableHead className="text-xs font-black uppercase text-orange-400 tracking-widest py-6">Pri</TableHead>
                        <TableHead className="text-xs font-black uppercase text-orange-400 tracking-widest py-6">Student</TableHead>
                        <TableHead className="text-xs font-black uppercase text-orange-400 tracking-widest py-6">Doctor</TableHead>
                        <TableHead className="text-xs font-black uppercase text-orange-400 tracking-widest py-6">Requested</TableHead>
                        <TableHead className="text-xs font-black uppercase text-orange-400 tracking-widest py-6 text-right px-8">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {waitingList.map((entry) => (
                        <TableRow key={entry.id} className="hover:bg-orange-50/10 transition-colors border-slate-50">
                          <TableCell className="px-8 py-6">
                            <div className="bg-slate-100 text-slate-600 w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs">
                              #{entry.position}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getPriorityBadge(entry.priority_level)}
                          </TableCell>
                          <TableCell>
                            <div className="font-bold text-slate-900">{entry.first_name} {entry.last_name}</div>
                            <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                              {entry.purpose_category || entry.appointment_purpose}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-bold text-slate-700">Dr. {entry.doctor_name}</div>
                            <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1.5">{entry.day_name} • {entry.specialization}</div>
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm font-medium">
                            {new Date(entry.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right px-8">
                            <Badge className="bg-orange-50 text-orange-600 border-none font-black uppercase tracking-widest text-[8px] px-3 py-1">
                              WAITING
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {waitingList.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="py-20 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <Users className="h-12 w-12 text-slate-200" />
                              <div className="text-slate-300 font-bold">No students are currently waiting.</div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
