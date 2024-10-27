// app/sign-up/[[...rest]]/page.tsx
import { SignUp } from '@clerk/nextjs';
import Head from 'next/head';

export default function Page() {
  return (
    <>
      <Head>
        <title>Sign Up | Vaultify</title>
        <meta
          name="description"
          content="Sign up to Vaultify and gain secure access to your private identity management dashboard."
        />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-500 to-teal-500 p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Your Account</h1>
          <SignUp path="/sign-up" routing="path" fallbackRedirectUrl="/onboarding" />
        </div>
      </div>
    </>
  );
}
