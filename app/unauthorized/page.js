import { Button } from '@/components/ui/button';
import { SignOutButton } from '@clerk/nextjs'

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
      <p className="mb-4">You do not have permission to access this page.</p>
      <SignOutButton>
        <Button
        variant="outline"
        >
          Sign out
        </Button>
      </SignOutButton>
    </div>
  );
}