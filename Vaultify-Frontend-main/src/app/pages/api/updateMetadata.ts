import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, hasCompletedOnboarding } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { hasCompletedOnboarding },
    });
    res.status(200).json({ message: 'Metadata updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update metadata' });
  }
}
