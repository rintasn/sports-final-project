import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users, 
  UserCircle, 
  Mail,
  ArrowRight,
  Tag,
  X
} from 'lucide-react';

interface SportActivity {
  id: number;
  title: string;
  description?: string;
  price: number;
  price_discount: number | null;
  slot: number;
  address: string;
  activity_date: string;
  start_time: string;
  end_time: string;
  organizer: {
    id: number;
    name: string;
    email: string;
  };
  participants: Array<{
    id: number;
    user: {
      name: string;
      email: string;
    };
  }>;
  city: {
    city_name: string;
    province: {
      province_name: string;
    };
  };
  sport_category: {
    name: string;
  };
}

interface VenueCardProps {
  venue: SportActivity;
  onTransactionCreated: () => void;
}

interface PaymentMethod {
  id: number;
  name: string;
  virtual_account_number: string;
  virtual_account_name: string;
  image_url: string;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, onTransactionCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    sport_activity_id: '',
    payment_method_id: ''
  });
  const [errors, setErrors] = useState({
    sport_activity_id: '',
    payment_method_id: ''
  });

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (isModalOpen) {
        try {
          const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
          const response = await fetch(`${BASE_URL}/api/v1/payment-methods`);
          const data = await response.json();
          
          if (!data.error) {
            setPaymentMethods(data.result);
          }
        } catch (error) {
          console.error("Error fetching payment methods:", error);
          toast.error("Error fetching payment methods");
        }
      }
    };

    if (isModalOpen) {
      fetchPaymentMethods();
      setFormData(prev => ({ ...prev, sport_activity_id: venue.id.toString() }));
    }
  }, [isModalOpen, venue.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setFormData({ sport_activity_id: '', payment_method_id: '' });
    setSelectedPaymentMethod(null);
    setErrors({ sport_activity_id: '', payment_method_id: '' });
  };

  const validateForm = () => {
    const newErrors = {
      sport_activity_id: '',
      payment_method_id: ''
    };
    
    if (!formData.sport_activity_id) {
      newErrors.sport_activity_id = "Sport activity is required";
    }
    if (!formData.payment_method_id) {
      newErrors.payment_method_id = "Payment method is required";
    }

    setErrors(newErrors);
    return !newErrors.sport_activity_id && !newErrors.payment_method_id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
    const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');

    try {
      const response = await fetch(`${BASE_URL}/api/v1/transaction/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sport_activity_id: Number(formData.sport_activity_id),
          payment_method_id: Number(formData.payment_method_id)
        })
      });

      const result = await response.json();

      if (!result.error) {
        toast.success(result.message);
        onTransactionCreated();
        handleClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Transaction creation error");
      console.error("Transaction creation error", error);
    }
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, payment_method_id: value }));
    const selectedMethod = paymentMethods.find(method => method.id === Number(value));
    setSelectedPaymentMethod(selectedMethod || null);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="p-6">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{venue.title}</h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {venue.sport_category.name}
              </span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {formatPrice(venue.price)}
              </p>
              {venue.price_discount && (
                <p className="text-sm text-gray-500 line-through">
                  {formatPrice(venue.price_discount)}
                </p>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-2">
              <CalendarDays className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-600">Date</p>
                <p className="text-gray-900">{formatDate(venue.activity_date)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-600">Time</p>
                <p className="text-gray-900">
                  {formatTime(venue.start_time)} - {formatTime(venue.end_time)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-600">Location</p>
                <p className="text-gray-900">{venue.address}</p>
                <p className="text-sm text-gray-500">
                  {venue.city.city_name}, {venue.city.province.province_name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Users className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-600">Participants</p>
                <p className="text-gray-900">
                  {venue.participants.length} / {venue.slot} slots filled
                </p>
              </div>
            </div>
          </div>

          {/* Organizer Section */}
          <div className="border-t pt-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <UserCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{venue.organizer.name}</p>
                <p className="text-sm text-gray-500">{venue.organizer.email}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Join Event
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* See Participants Button */}
          {venue.participants.length > 0 && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              See Participants
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Participants
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Participants List */}
              <div className="mb-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">List of Participants</h3>
                <div className="space-y-4">
                  {venue.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-2">
                      <div className="bg-blue-100 p-1.5 rounded-full">
                        <UserCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{participant.user.name}</p>
                        <p className="text-sm text-gray-600">{participant.user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VenueCard;
