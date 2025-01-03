import { signUp } from '@/lib/actions/user.actions';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { headers } = req;
      const forwardedHost = headers['x-forwarded-host'];
      const origin = headers['origin'];

      if (forwardedHost !== origin) {
        res.status(400).json({ error: 'Invalid Server Actions request: header mismatch' });
        return;
      }

      const userData = req.body;
      const newUserAccount = await signUp(userData);
      res.status(200).json(newUserAccount);
    } catch (error) {
      console.error('Error during sign-up:', error);
      res.status(500).json({ error: 'Internal server error during sign-up' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}