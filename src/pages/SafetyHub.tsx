import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Shield,
  Phone,
  ArrowLeft,
  Ambulance,
  User,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userService } from '@/lib/services';

export default function SafetyHub() {
  // Trusted contacts - loaded from backend
  const [trustedContacts, setTrustedContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  // Load trusted contacts on mount
  useEffect(() => {
    loadTrustedContacts();
  }, []);

  const loadTrustedContacts = async () => {
    try {
      const response = await userService.getTrustedContacts();
      if (response.success) {
        setTrustedContacts(response.contacts || []);
      }
    } catch (error) {
      console.error('Failed to load trusted contacts:', error);
    } finally {
      setLoadingContacts(false);
    }
  };

  // ========== EMERGENCY CALL HANDLERS ==========
  const handleCall = (number: string, label: string) => {
    if (window.confirm(`Are you sure you want to call ${label}?`)) {
      toast.info(`Calling ${label}...`, {
        description: `Connecting to ${number}`,
      });
      window.location.href = `tel:${number}`;
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
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">SafeSpace</span>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Safety Hub</h1>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Emergency Assistance</h2>
          <p className="text-gray-600">Quick access to emergency services and your trusted contacts.</p>
        </div>

        {/* Primary Emergency Buttons List */}
        <div className="space-y-4 mb-10">
          <Card 
            className="overflow-hidden border-l-4 border-l-red-600 hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99]"
            onClick={handleAmbulanceCall}
          >
            <div className="flex items-center p-6 space-x-6">
              <div className="bg-red-100 p-4 rounded-full">
                <Ambulance className="h-8 w-8 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">Call Ambulance</h3>
                <p className="text-gray-600">National Ambulance Service (102)</p>
              </div>
              <div className="text-red-600 font-bold text-lg px-4 py-2 bg-red-50 rounded-lg">102</div>
            </div>
          </Card>

          <Card 
            className="overflow-hidden border-l-4 border-l-blue-600 hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99]"
            onClick={() => handleCall('100', 'Police')}
          >
            <div className="flex items-center p-6 space-x-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">Call Police</h3>
                <p className="text-gray-600">National Police Helpline (100)</p>
              </div>
              <div className="text-blue-600 font-bold text-lg px-4 py-2 bg-blue-50 rounded-lg">100</div>
            </div>
          </Card>

          <Card 
            className="overflow-hidden border-l-4 border-l-orange-500 hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99]"
            onClick={() => handleCall('124', 'Campus Security')}
          >
            <div className="flex items-center p-6 space-x-6">
              <div className="bg-orange-100 p-4 rounded-full">
                <Phone className="h-8 w-8 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">Campus Security</h3>
                <p className="text-gray-600">Local Campus Security Office</p>
              </div>
              <div className="text-orange-600 font-bold text-lg px-4 py-2 bg-orange-50 rounded-lg">124</div>
            </div>
          </Card>
        </div>

        {/* Trusted Contacts */}
        {!loadingContacts && trustedContacts.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2 text-blue-600" />
              Your Trusted Contacts
            </h3>
            <div className="grid gap-3">
              {trustedContacts.map((contact, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 justify-between group"
                  onClick={() => handleCall(contact.contact_phone, contact.contact_name)}
                >
                  <div className="flex items-center">
                    <div className="bg-blue-200 p-2 rounded-lg mr-4 group-hover:bg-blue-300 transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">{contact.contact_name}</p>
                      <p className="text-xs opacity-70">Trusted Contact</p>
                    </div>
                  </div>
                  <div className="font-mono">{contact.contact_phone}</div>
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center text-sm text-gray-500 bg-white p-6 rounded-2xl border shadow-sm">
          <p className="font-semibold text-gray-700 mb-2 italic">Remember:</p>
          <p>Always speak clearly and provide your exact location to the emergency dispatcher.</p>
        </div>
      </div>
    </div>
  );
}