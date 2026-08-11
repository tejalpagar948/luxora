import React, { useState } from 'react';
import { Container } from '../../components/layout/Container';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/forms/FormField';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from '../../../services/authService';

export const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login(formData);
      
      // Fetch profile directly to verify administrative privileges
      const profileRes = await getUserProfile();
      const user = profileRes.data?.data;

      if (user && user.isAdmin) {
        toast.success("Welcome to the Admin Portal");
        navigate("/admin");
      } else {
        // Not an admin, log out immediately to clear credentials/cookies
        await logout();
        toast.error("Access denied. You are not an administrator.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="w-full bg-background-alt min-h-screen flex items-center py-12">
      <Container className="w-full flex justify-center">
        <div className="w-full max-w-md bg-background border border-border-light rounded-lg p-8 md:p-10 shadow-sm font-body">
          <div className="text-center mb-8">
            <span className="font-body text-label-caps text-accent tracking-[0.2em] block mb-2">
              ADMIN CONTROL
            </span>
            <h1 className="font-display text-headline-sm text-primary font-semibold">
              Admin Portal Sign In
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <FormField label="Admin Email Address">
              <Input
                type="email"
                placeholder="admin@luxora.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </FormField>

            <FormField label="Password">
              <Input
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </FormField>

            <Button type="submit" variant="primary" fullWidth className="mt-6 mb-4">
              Sign In to Admin
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
};
