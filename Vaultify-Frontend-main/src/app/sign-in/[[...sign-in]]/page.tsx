// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs';
import Head from 'next/head';

export default function Page() {
  return (
    <>
      <Head>
        <title>Sign In | Vaultify</title>
        <meta
          name="description"
          content="Sign in to Vaultify to access your secure identity management dashboard."
        />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-500 to-teal-500 p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In to Your Account</h1>
          <SignIn path="/sign-in" routing="path" fallbackRedirectUrl="/dashboard" />
        </div>
      </div>
    </>
  );
}