"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, Input, Button } from '@heroui/react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.register(formData);
      setAuth(data.user, data.token);
      router.push('/recipes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardBody className="gap-4">
          <h1 className="text-2xl font-bold text-center">Register</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Name (optional)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" color="primary" isLoading={loading}>
              Register
            </Button>
          </form>
          <p className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}