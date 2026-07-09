"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { InputField } from "@/app/components/FormFields";
import { authAPI } from "@/app/lib/api";
import { useAuthStore } from "@/app/lib/auth-store";
import { Navbar } from "@/app/components/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      await authAPI.sendVerificationOTP(formData.email);
      router.push(
        `/verify-email?email=${encodeURIComponent(formData.email)}&username=${encodeURIComponent(formData.username)}&password=${encodeURIComponent(formData.password)}`,
      );
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-light flex items-center justify-center p-4">
        <div className="bg-surface rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-dark mb-6 text-center">
            Register
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(value) => handleChange("username", value)}
              error={errors.username}
              required
            />

            <InputField
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(value) => handleChange("email", value)}
              error={errors.email}
              required
            />

            <InputField
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(value) => handleChange("password", value)}
              error={errors.password}
              required
            />

            <InputField
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(value) => handleChange("confirmPassword", value)}
              error={errors.confirmPassword}
              required
            />

            {errors.submit && (
              <div className="p-3 bg-red-100 border border-red-400 rounded text-red-700">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary text-white font-bold rounded-lg hover:brightness-90 transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
