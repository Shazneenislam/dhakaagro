import React, { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Phone, Loader } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const LoginRegisterModal = ({ isOpen, onClose, defaultTab = "login" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const { login, register, createTestUser } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('🔍 Submitting form:', {
      activeTab,
      email: formData.email,
      hasPassword: !!formData.password
    });

    try {
      if (activeTab === "login") {
        await login({ 
          email: formData.email, 
          password: formData.password 
        });
        toast.success("Login successful!");
        onClose();
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords don't match!");
          setLoading(false);
          return;
        }

        if (!formData.agreeToTerms) {
          toast.error("Please agree to the terms and conditions");
          setLoading(false);
          return;
        }

        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        };

        await register(userData);
        toast.success("Registration successful!");
        onClose();
      }
    } catch (error) {
      console.error('❌ Form submission error:', error);
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestUser = async () => {
    try {
      setLoading(true);
      const response = await createTestUser();
      toast.success(`Test user created! Email: ${response.credentials?.email}, Password: ${response.credentials?.password}`);
    } catch (error) {
      toast.error(error.message || "Failed to create test user");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              <button onClick={onClose} className="absolute right-4 top-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <X size={20} className="text-gray-600" />
              </button>

              <div className="flex border-b border-gray-200">
                <button onClick={() => setActiveTab("login")} className={`flex-1 py-4 text-center font-semibold text-lg ${activeTab === "login" ? "bg-[#425A8B] text-white" : "bg-gray-50 text-gray-600"}`}>
                  Login
                </button>
                <button onClick={() => setActiveTab("register")} className={`flex-1 py-4 text-center font-semibold text-lg ${activeTab === "register" ? "bg-[#425A8B] text-white" : "bg-gray-50 text-gray-600"}`}>
                  Register
                </button>
              </div>

              <div className="p-8">
                {activeTab === "login" ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-[#425A8B]">Welcome Back</h2>
                      <p className="text-gray-600 mt-2">Sign in to your account</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425A8B]" placeholder="Enter your email" required disabled={loading} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425A8B]" placeholder="Enter your password" required disabled={loading} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" disabled={loading}>
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-3 bg-[#425A8B] text-white font-semibold rounded-lg hover:bg-[#334a7a] disabled:opacity-50 flex items-center justify-center">
                      {loading ? <Loader className="animate-spin h-5 w-5" /> : 'Sign In'}
                    </button>

                    <div className="text-center">
                      <button type="button" onClick={handleCreateTestUser} className="text-sm text-[#425A8B] hover:text-[#334a7a] font-medium" disabled={loading}>
                        Create Test User
                      </button>
                    </div>

                    <div className="text-center text-sm text-gray-600">
                      Don't have an account?{" "}
                      <button type="button" onClick={() => setActiveTab("register")} className="text-[#425A8B] hover:text-[#334a7a] font-semibold">
                        Sign up here
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-[#425A8B]">Create Account</h2>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425A8B]" placeholder="Enter your name" required disabled={loading} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425A8B]" placeholder="Enter your email" required disabled={loading} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425A8B]" placeholder="Enter your phone" disabled={loading} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425A8B]" placeholder="Create password" required disabled={loading} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" disabled={loading}>
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425A8B]" placeholder="Confirm password" required disabled={loading} />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" disabled={loading}>
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <input type="checkbox" id="agreeToTerms" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange} className="h-4 w-4 mt-1 text-[#425A8B] rounded focus:ring-[#425A8B]" required disabled={loading} />
                      <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
                        I agree to the Terms and Privacy Policy
                      </label>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-3 bg-[#425A8B] text-white font-semibold rounded-lg hover:bg-[#334a7a] disabled:opacity-50 flex items-center justify-center">
                      {loading ? <Loader className="animate-spin h-5 w-5" /> : 'Create Account'}
                    </button>

                    <div className="text-center text-sm text-gray-600">
                      Already have an account?{" "}
                      <button type="button" onClick={() => setActiveTab("login")} className="text-[#425A8B] hover:text-[#334a7a] font-semibold">
                        Sign in here
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginRegisterModal;