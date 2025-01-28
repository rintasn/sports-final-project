import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import Navbar from "../_components/NavbarComponent";
import { useToast } from "@/hooks/use-toast"; // Import the useToast hook

// Define the type for the user data based on the API response
type UserData = {
  id: number;
  name: string;
  email: string;
  role: string;
  phone_number: string | null;
  password: string | null;
  c_password: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

type ApiResponse = {
  success: boolean;
  data: UserData;
  message: string;
};

const Home = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UserData>>({}); // Use Partial to allow partial updates
  const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility

  const { toast } = useToast(); // Initialize the useToast hook
  const router = useRouter(); // Initialize the useRouter hook

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found in localStorage');
        }

        const response = await fetch(`https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setUserData(data.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!userData) return; // Ensure userData is available
  
    const updatedData = {
      ...userData,
      ...formData,
    };
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/update-user/${userData.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      const result = await response.json();
  
      if (!result.error) {
        setUserData(updatedData); // Update userData with the new data
        setIsFormVisible(false); // Hide the form after successful update
        toast({
          title: "Success",
          description: result.message, // Use the message from the API response
          variant: "default",
        });
  
        router.refresh(); // Redirect to the home page
      } else {
        toast({
          title: "Error",
          description: result.message, // Use the message from the API response
          variant: "destructive",
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: 'An unknown error occurred',
          variant: "destructive",
        });
      }
    }
  };
  

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
    if (!isFormVisible && userData) {
      setFormData(userData); // Pre-fill form with current user data
    }
  };

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="mx-auto p-4">
          <header className="bg-red-500 text-white py-12 px-6 mb-8 rounded-lg">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">PROFILE USER</h1>
            </div>
          </header>
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <Navbar />
        <div className="mx-auto p-4">
          <header className="bg-red-500 text-white py-12 px-6 mb-8 rounded-lg">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">PROFILE USER</h1>
            </div>
          </header>
          <div className="text-center">
            {/* <p>Error: {error}</p> */}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="mx-auto p-4">
        <header className="bg-red-500 text-white py-12 px-6 mb-8 rounded-lg">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">PROFILE USER</h1>
          </div>
        </header>
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">User Information</h2>
          <div className="mb-2">
            <strong>Name:</strong> {userData?.name || 'N/A'}
          </div>
          <div className="mb-2">
            <strong>Email:</strong> {userData?.email || 'N/A'}
          </div>
          <div className="mb-2">
            <strong>Role:</strong> {userData?.role || 'N/A'}
          </div>
          <div className="mb-2">
            <strong>Phone Number:</strong> {userData?.phone_number || 'N/A'}
          </div>
          <div className="mb-2">
            <strong>Email Verified At:</strong> {userData?.email_verified_at || 'N/A'}
          </div>
          <div className="mb-2">
            <strong>Created At:</strong> {userData?.created_at || 'N/A'}
          </div>
          <div className="mb-2">
            <strong>Updated At:</strong> {userData?.updated_at || 'N/A'}
          </div>

          {/* Button to toggle the update form */}
          <button onClick={toggleFormVisibility} className="btn btn-primary mb-4">
            Update Profile
          </button>

          {/* Update Form */}
          {isFormVisible && (
            <>
              <h2 className="text-2xl font-bold mb-4">Update User Information</h2>
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-2"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-2"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-2"
                />
                <input
                  type="password"
                  name="c_password"
                  placeholder="Confirm Password"
                  value={formData.c_password || ''}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-2"
                />
                <input
                  type="text"
                  name="phone_number"
                  placeholder="Phone Number"
                  value={formData.phone_number || ''}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mb-2"
                />
              </div>
              <button onClick={handleUpdate} className="btn btn-primary">
                Update Data
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
