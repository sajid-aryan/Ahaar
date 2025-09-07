// NOT IN USE


import {Ratelimit} from '@upstash/redis-rate-limiter';
import {Redis} from '@upstash/redis';

import dotenv from 'dotenv';
dotenv.config();

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '20 s'),
});

export default rateLimit;