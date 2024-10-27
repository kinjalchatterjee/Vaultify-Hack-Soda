import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} dynamic>
      <html lang="en">
        <body>
          {/* SignedIn and SignedOut should typically be used in specific page components */}
          <SignedOut>
            <div className="fixed top-4 right-4">
              <SignInButton />
            </div>
          </SignedOut>
          <SignedIn>
            <div className="fixed top-4 right-4">
              <UserButton />
            </div>
          </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
