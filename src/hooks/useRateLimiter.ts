/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';

interface RateLimiterOptions {
  cooldownMs?: number;
}

export function useRateLimiter({ cooldownMs = 1200 }: RateLimiterOptions = {}) {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState('');
  const lastActionTime = useRef(0);
  const cooldownTimeout = useRef<number | null>(null);

  useEffect(() => {
    const cleanCooldown = () => {
      if (cooldownTimeout.current !== null) {
        window.clearTimeout(cooldownTimeout.current);
        cooldownTimeout.current = null;
      }
    };

    const shouldLimitEvent = (event: Event) => {
      if (event.type === 'submit') {
        return true;
      }

      const target = event.target as HTMLElement | null;
      if (!target) {
        return false;
      }

      return !!target.closest(
        'button, [type="button"], [type="submit"], input[type="button"], input[type="submit"], a, [role="button"], form'
      );
    };

    const onUserAction = (event: Event) => {
      if (!shouldLimitEvent(event)) {
        return;
      }

      const now = Date.now();
      if (now - lastActionTime.current < cooldownMs) {
        event.preventDefault();
        event.stopImmediatePropagation();
        setRateLimitMessage(`Rate limit active. Please wait ${Math.ceil((cooldownMs - (now - lastActionTime.current)) / 1000)} second(s).`);
        return;
      }

      lastActionTime.current = now;
      setIsRateLimited(true);
      setRateLimitMessage('Processing request — rate limiting active for a brief moment.');
      cleanCooldown();
      cooldownTimeout.current = window.setTimeout(() => {
        setIsRateLimited(false);
        setRateLimitMessage('');
        cooldownTimeout.current = null;
      }, cooldownMs);
    };

    document.addEventListener('click', onUserAction, true);
    document.addEventListener('submit', onUserAction, true);

    return () => {
      document.removeEventListener('click', onUserAction, true);
      document.removeEventListener('submit', onUserAction, true);
      cleanCooldown();
    };
  }, [cooldownMs]);

  return { isRateLimited, rateLimitMessage };
}
