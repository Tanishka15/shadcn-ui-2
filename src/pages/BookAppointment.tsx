import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, ArrowLeft, User, Stethoscope, Calendar, Clock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { authService, appointmentService } from '@/lib/services';

export default function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const doctorData = location.state?.doctor;

  const [user, setUser] = useState<any>(null);
  const purposeOptions: any = {
    "General Illness": ["Fever", "Cold & Cough", "Headache", "Body Pain", "Stomach Ache", "Allergy", "Viral Infection", "Other"],
    "Injury": ["Minor Cut", "Sprain", "Burn", "Suspected Fracture", "Other"],
    "Serious Illness": ["High Fever", "Chickenpox", "Severe Infection", "Breathing Difficulty", "Chest Pain", "Dengue Symptoms", "Other"],
    "Follow-up": ["Review", "Test Discussion", "Ongoing Treatment", "Other"],
    "Medical Certificate": ["Sick Leave", "Fitness Certificate", "Other"]
  };

  const priorityMapping: any = {
    "Serious Illness": 1,
    "Injury": 2,
    "General Illness": 3,
    "Follow-up": 4,
    "Medical Certificate": 5
  };

  const [formData, setFormData] = useState({
    student_name: '',
    doctor_id: doctorData?.id || '',
    doctor_name: doctorData?.doctor_name || '',
    specialization: doctorData?.specialization || '',
    appointment_day: doctorData?.day_name || '',
    purpose_category: '',
    purpose_detail: '',
    custom_reason: '',
    priority_level: 3,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenNumber, setTokenNumber] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData(prev => ({
        ...prev,
        student_name: `${parsedUser.first_name} ${parsedUser.last_name}`
      }));
    }

    if (!doctorData) {
      toast.error('No doctor selected. Please select a doctor from the dashboard.');
      navigate('/');
    }
  }, [doctorData, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.purpose_category || !formData.purpose_detail) {
      toast.error('Please select a purpose and specific issue for your visit');
      return;
    }

    if (formData.purpose_detail === 'Other' && !formData.custom_reason) {
      toast.error('Please specify your custom reason');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await appointmentService.create(formData);
      if (response.success) {
        setIsSuccess(true);
        setTokenNumber(response.token_number);
        toast.success('Appointment booked successfully!');
        // Keep results visible for a moment then redirect
        setTimeout(() => {
          navigate('/medical/my-appointments');
        }, 8000);
      } else {
        toast.error(response.message || 'Failed to book appointment');
      }
    } catch (error) {
      toast.error('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8 rounded-3xl border-none shadow-2xl bg-white">
          <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Confirmed!</h2>
          <p className="text-slate-600 font-medium mb-8">Your appointment has been booked. Token recalculated based on priority.</p>
          
          <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Doctor</span>
              <span className="font-bold text-slate-900">Dr. {formData.doctor_name}</span>
            </div>
            <div className="flex justify-between items-center py-4 border-y border-slate-100 my-2">
              <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Queue Token</span>
              <div className="flex flex-col items-end">
                <span className="text-4xl font-black text-blue-600">#{tokenNumber || '--'}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Current Position</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Purpose</span>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-700 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">{formData.purpose_category}</span>
                <span className="bg-slate-200 text-slate-700 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                  {formData.purpose_detail === 'Other' ? formData.custom_reason : formData.purpose_detail}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Priority</span>
              {formData.priority_level === 1 ? (
                <Badge className="bg-red-100 text-red-600 border-none font-black uppercase tracking-widest text-[8px] px-3 animate-pulse">
                  High Priority
                </Badge>
              ) : formData.priority_level === 2 ? (
                <Badge className="bg-orange-100 text-orange-600 border-none font-black uppercase tracking-widest text-[8px] px-3">
                  Urgent
                </Badge>
              ) : (
                <Badge variant="outline" className="text-slate-400 border-slate-200 font-black uppercase tracking-widest text-[8px] px-3">
                  Standard
                </Badge>
              )}
            </div>
          </div>

          <Button 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[10px]"
            onClick={() => navigate('/medical/my-appointments')}
          >
            Manage Appointments
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-8 hover:bg-white text-slate-600 font-bold"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-900 text-white p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-black tracking-tight">Book Appointment</CardTitle>
                <CardDescription className="text-slate-400 font-medium text-lg mt-1">
                  Complete the form to secure your consultation.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Specialist</Label>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-slate-900">Dr. {formData.doctor_name}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Day</Label>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-slate-900">{formData.appointment_day}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="student_name" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Student Name</Label>
                  <Input 
                    id="student_name" 
                    value={formData.student_name}
                    onChange={(e) => setFormData({...formData, student_name: e.target.value})}
                    className="rounded-xl border-slate-200 py-6 px-4 font-bold text-slate-900" 
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="purpose_category" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Medical Category</Label>
                    <Select 
                      onValueChange={(val) => setFormData({
                        ...formData, 
                        purpose_category: val, 
                        purpose_detail: '',
                        custom_reason: '',
                        priority_level: priorityMapping[val] || 3
                      })}
                      value={formData.purpose_category}
                    >
                      <SelectTrigger className="rounded-xl border-slate-200 py-6 px-4 font-bold text-slate-900">
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(purposeOptions).map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose_detail" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Specific Issue</Label>
                    <Select 
                      onValueChange={(val) => setFormData({...formData, purpose_detail: val, custom_reason: ''})}
                      value={formData.purpose_detail}
                      disabled={!formData.purpose_category}
                    >
                      <SelectTrigger className="rounded-xl border-slate-200 py-6 px-4 font-bold text-slate-900">
                        <SelectValue placeholder={formData.purpose_category ? "Select issue..." : "Select category first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.purpose_category && purposeOptions[formData.purpose_category].map((issue: string) => (
                          <SelectItem key={issue} value={issue}>{issue}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.purpose_detail === 'Other' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="custom_reason" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Please Specify Reason</Label>
                    <Input 
                      id="custom_reason" 
                      value={formData.custom_reason}
                      onChange={(e) => setFormData({...formData, custom_reason: e.target.value})}
                      className="rounded-xl border-blue-200 py-6 px-4 font-bold text-slate-900 bg-blue-50/30" 
                      placeholder="Enter your specific medical concern..."
                      required
                    />
                  </div>
                )}

                {formData.purpose_category === 'Serious Illness' && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex gap-3 items-start animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="text-red-900 font-black text-sm uppercase tracking-tight">Serious Condition Detected</h4>
                      <p className="text-red-700 text-xs font-medium mt-1">
                        Serious cases are prioritized. If this is a life-threatening emergency, 
                        please seek immediate help or call the campus emergency hotline.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Additional Details</Label>
                  <Textarea 
                    id="notes" 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="rounded-xl border-slate-200 min-h-[100px] p-4 font-medium text-slate-900" 
                    placeholder="Provide any additional details for the doctor..."
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : null}
                Confirm Appointment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
