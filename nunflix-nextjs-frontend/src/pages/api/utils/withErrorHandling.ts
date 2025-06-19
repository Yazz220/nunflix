import { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';

type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void | NextApiResponse>;

export const withErrorHandling = (handler: ApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res);
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};
