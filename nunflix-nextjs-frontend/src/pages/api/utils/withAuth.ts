import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { withErrorHandling } from './withErrorHandling';

type AuthenticatedApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => Promise<void | NextApiResponse>;

export const withAuth = (handler: AuthenticatedApiHandler) => {
  return withErrorHandling(async (req: NextApiRequest, res: NextApiResponse) => {
    const { data, error } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return handler(req, res, data.user.id);
  });
};
