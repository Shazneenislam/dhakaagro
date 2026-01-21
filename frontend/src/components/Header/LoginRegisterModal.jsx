import React, { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Phone, Facebook, Twitter, Chrome, Loader } from "lucide-react";
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
    rememberMe: false,
    agreeToTerms: false,
  });

  const { login, register } = useAuth();

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

    try {
      if (activeTab === "login") {
        // Login logic
        await login({ email: formData.email, password: formData.password });
        toast.success("Login successful!");
        onClose();
      } else {
        // Register logic
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
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.success(`${provider} login would be implemented here!`);
    // Add actual social login logic here
  };

  const handleForgotPassword = () => {
    toast.success("Forgot password functionality would be implemented here!");
    // Add forgot password logic here
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} className="text-gray-600" />
              </button>

              {/* Tab Switcher */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`flex-1 py-4 text-center font-semibold text-lg transition-all duration-300 ${
                    activeTab === "login"
                      ? "bg-[#425A8B] text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab("register")}
                  className={`flex-1 py-4 text-center font-semibold text-lg transition-all duration-300 ${
                    activeTab === "register"
                      ? "bg-[#425A8B] text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Form Container */}
              <div className="p-8">
                {/* Login Form */}
                {activeTab === "login" ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-[#425A8B]">Welcome Back</h2>
                      <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Mail size={20} />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425A8B] focus:border-transparent"
                          placeholder="Enter your email"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-sm text-[#425A8B] hover:text-[#334a7a] font-medium"
                          disabled={loading}
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Lock size={20} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425A8B] focus:border-transparent"
                          placeholder="Enter your password"
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          disabled={loading}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#425A8B] rounded focus:ring-[#425A8B]"
                        disabled={loading}
                      />
                      <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>

                    {/* Login Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#425A8B] text-white font-semibold rounded-lg hover:bg-[#334a7a] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <Loader className="animate-spin h-5 w-5" />
                      ) : (
                        'Sign In'
                      )}
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => handleSocialLogin("Google")}
                        className="flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={loading}
                      >
                        <Chrome size={20} className="text-red-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSocialLogin("Facebook")}
                        className="flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={loading}
                      >
                        <Facebook size={20} className="text-blue-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSocialLogin("Twitter")}
                        className="flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={loading}
                      >
                        <Twitter size={20} className="text-blue-400" />
                      </button>
                    </div>

                    {/* Sign Up Prompt */}
                    <div className="text-center text-sm text-gray-600">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("register")}
                        className="text-[#425A8B] hover:text-[#334a7a] font-semibold disabled:opacity-50"
                        disabled={loading}
                      >
                        Sign up here
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Registration Form */
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-[#425A8B]">Create Account</h2>
                      <p className="text-gray-600 mt-2">Join our community today</p>
                    </div>

                    {/* Full Name Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <User size={20} />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425A8B] focus:border-transparent"
                          placeholder="Enter your full name"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Mail size={20} />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425A8B] focus:border-transparent"
                          placeholder="Enter your email"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Phone size={20} />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425A8B] focus:border-transparent"
                          placeholder="Enter your phone number"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Password</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Lock size={20} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425A8B] focus:border-transparent"
                          placeholder="Create a password"
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          disabled={loading}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Lock size={20} />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#425A8B] focus:border-transparent"
                          placeholder="Confirm your password"
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          disabled={loading}
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="h-4 w-4 mt-1 text-[#425A8B] rounded focus:ring-[#425A8B]"
                        required
                        disabled={loading}
                      />
                      <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
                        I agree to the{" "}
                        <button
                          type="button"
                          className="text-[#425A8B] hover:text-[#334a7a] font-medium"
                          disabled={loading}
                        >
                          Terms of Service
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          className="text-[#425A8B] hover:text-[#334a7a] font-medium"
                          disabled={loading}
                        >
                          Privacy Policy
                        </button>
                      </label>
                    </div>

                    {/* Register Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#425A8B] text-white font-semibold rounded-lg hover:bg-[#334a7a] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <Loader className="animate-spin h-5 w-5" />
                      ) : (
                        'Create Account'
                      )}
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                      </div>
                    </div>

                    {/* Social Registration Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => handleSocialLogin("Google")}
                        className="flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={loading}
                      >
                        <Chrome size={20} className="text-red-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSocialLogin("Facebook")}
                        className="flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={loading}
                      >
                        <Facebook size={20} className="text-blue-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSocialLogin("Twitter")}
                        className="flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={loading}
                      >
                        <Twitter size={20} className="text-blue-400" />
                      </button>
                    </div>

                    {/* Login Prompt */}
                    <div className="text-center text-sm text-gray-600">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("login")}
                        className="text-[#425A8B] hover:text-[#334a7a] font-semibold disabled:opacity-50"
                        disabled={loading}
                      >
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