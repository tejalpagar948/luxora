import React, { useState } from 'react';
import { Container } from '../../components/layout/Container';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/forms/FormField';
import { Link } from 'react-router-dom';
import { loginUser } from '../../../services/authService';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("njanwsjhqa", formData);
    e.preventDefault();

    try {
      const response = await loginUser(formData);
      console.log("response", response.data);
      console.log("Before navigate");
      navigate("/");
      console.log("After navigate");
    } catch (err) {
      console.log(err);
      console.log(err.response);
      console.log(err.response?.data);
      console.log(err.response?.status);
    }
  };

  return (
    <div className="w-full bg-background-alt min-h-[80vh] flex items-center py-12" >
      <Container className="w-full flex justify-center">
        <div className="w-full max-w-md bg-background border border-border-light rounded-lg p-8 md:p-10 shadow-sm font-body">
          <div className="text-center mb-8">
            <span className="font-body text-label-caps text-accent tracking-[0.2em] block mb-2">
              WELCOME BACK
            </span>
            <h1 className="font-display text-headline-sm text-primary font-semibold">
              Sign In to Luxora
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <FormField label="Email Address">
              <Input type="email" placeholder="name@domain.com" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </FormField>

            <FormField label="Password">
              <Input type="password" placeholder="••••••••" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </FormField>

            <div className="flex justify-between items-center mb-6 text-xs text-neutral-500">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="accent-accent" />
                <span>Remember me</span>
              </label>
              <a href="#" className="hover:text-accent transition-colors">
                Forgot password?
              </a>
            </div>

            <Button type="submit" variant="primary" fullWidth className="mb-6">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-neutral-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-accent font-semibold underline transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </Container>
    </div >
  );
};
