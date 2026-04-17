import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowLeft, Calendar, Clock, User, Stethoscope, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { appointmentService, authService } from '@/lib/services';
import { toast } from 'sonner';

export default function MyAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchAppointments();
  }, [navigate]);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getMyAppointments();
      if (response.success) {
        setAppointments(response.data);
      }
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Button 
              variant="ghost" 
              className="mb-4 -ml-2 hover:bg-white text-slate-600 font-bold"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Appointments</h1>
            <p className="text-slate-500 font-medium mt-1">Manage and track your upcoming medical visits.</p>
          </div>
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 font-black uppercase tracking-widest text-[10px]">
              New Appointment
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <p className="text-slate-500 font-bold">Loading your appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <Card className="rounded-3xl border-dashed border-2 border-slate-200 p-16 text-center bg-white/50">
            <div className="bg-slate-100 text-slate-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No appointments yet</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven't booked any medical appointments yet. Start by choosing a doctor from the dashboard.</p>
            <Link to="/">
              <Button variant="outline" className="rounded-2xl border-slate-200 font-black uppercase tracking-widest text-[10px] px-8 py-6">
                Go to Dashboard
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6">
            {appointments.map((apt) => (
              <Card key={apt.id} className="rounded-3xl border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white">
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center min-w-[120px]">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Day</span>
                    <span className="text-lg font-black text-slate-900">{apt.appointment_day}</span>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-black text-slate-900">Dr. {apt.doctor_name}</h3>
                      <Badge className={`${getStatusColor(apt.status)} border-none font-black uppercase tracking-widest text-[9px] px-3`}>
                        {apt.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-8 gap-y-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-slate-500 text-sm font-bold">
                          <Stethoscope className="h-4 w-4 mr-2 text-blue-600" />
                          {apt.specialization}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 font-black uppercase tracking-widest text-[8px] px-2">
                             {apt.purpose_category || apt.purpose}
                          </Badge>
                          {apt.purpose_detail && (
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                              • {apt.purpose_detail}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {apt.notes && (
                      <div className="text-slate-400 text-xs font-medium italic bg-slate-50/50 p-3 rounded-lg border border-slate-50">
                        "{apt.notes}"
                      </div>
                    )}
                  </div>

                  <div className="w-full md:w-auto flex flex-row md:flex-col gap-3">
                    <Button variant="outline" className="flex-1 md:w-full rounded-xl border-slate-200 font-bold text-xs py-5">
                      Reschedule
                    </Button>
                    <Button variant="ghost" className="flex-1 md:w-full text-red-500 hover:text-red-600 hover:bg-red-50 font-bold text-xs py-5">
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
