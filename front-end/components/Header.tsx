'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <Link href="/" className="font-bold text-xl">
          Recipe Book
        </Link>
      </NavbarBrand>

      {isAuthenticated && (
        <>
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem>
              <Link href="/recipes">Recipes</Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/meal-plan">Meal Plan</Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/shopping-list">Shopping List</Link>
            </NavbarItem>
          </NavbarContent>

          <NavbarContent justify="end">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="flat">{user?.name || user?.email}</Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="profile"
                  onPress={() => router.push('/profile')}
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onPress={handleLogout}
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        </>
      )}

      {!isAuthenticated && (
        <NavbarContent justify="end">
          <NavbarItem>
            <Button as={Link} href="/login" variant="flat">
              Login
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} href="/register" color="primary">
              Register
            </Button>
          </NavbarItem>
        </NavbarContent>
      )}
    </Navbar>
  );
}
