import React, { useState } from "react";
import { Container } from '../../components/layout/Container';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/forms/FormField';
import { Link } from 'react-router-dom';
import { registerUser } from "../../../services/authService";
import { toast } from 'react-hot-toast';

export const Register: React.FC = () => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await registerUser(formData);
      console.log(res.data);
      toast.success(res.data.message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  return (
    <div className="w-full bg-background-alt min-h-[80vh] flex items-center py-12">
      <Container className="w-full flex justify-center">
        <div className="w-full max-w-md bg-background border border-border-light rounded-2xl p-8 md:p-10 shadow-md hover:shadow-lg transition-all duration-300 font-body animate-fadeIn">
          <div className="text-center mb-8">
            <span className="font-body text-label-caps text-accent tracking-[0.2em] block mb-2">
              JOIN THE CIRCLE
            </span>
            <h1 className="font-display text-headline-sm text-primary font-semibold">
              Create Account
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <FormField label="Full Name">
              <Input type="text" placeholder="John Doe" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
            </FormField>

            <FormField label="Email Address">
              <Input type="email" placeholder="name@domain.com" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </FormField>

            <FormField label="Password">
              <Input type="password" placeholder="At least 8 characters" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </FormField>

            <div className="flex items-start mb-6 text-xs text-neutral-500">
              <input type="checkbox" className="accent-accent mt-0.5 mr-2" required />
              <span>
                I agree to the{' '}
                <a href="#" className="underline hover:text-accent">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="underline hover:text-accent">Privacy Policy</a>.
              </span>
            </div>

            <Button type="submit" variant="primary" fullWidth className="mb-6">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-accent font-semibold underline transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
};
