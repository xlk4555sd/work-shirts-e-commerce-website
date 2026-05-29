import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { UserProfile } from '../backend';

interface UserProfileSetupProps {
  open: boolean;
  onClose: () => void;
}

export default function UserProfileSetup({ open, onClose }: UserProfileSetupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const profile: UserProfile = {
      name: name.trim(),
      email: email.trim(),
    };

    try {
      await saveProfile.mutateAsync(profile);
      onClose();
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Welcome to WorkShirts!</DialogTitle>
          <DialogDescription>
            Please tell us a bit about yourself to get started.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={saveProfile.isPending || !name.trim() || !email.trim()}
          >
            {saveProfile.isPending ? 'Saving...' : 'Get Started'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
