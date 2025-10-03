"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, Input, Button } from '@heroui/react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() { 
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      setAuth(data.user, data.token);
      router.push('/recipes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardBody className="gap-4">
          <h1 className="text-2xl font-bold text-center">Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" color="primary" isLoading={loading}>
              Login
            </Button>
          </form>
          <p className="text-center text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-500">
              Register
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}