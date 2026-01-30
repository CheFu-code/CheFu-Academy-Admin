'use client';

import { useConsent } from '@/helpers/ConsentProvider';
import React from 'react';

export default function CookieBanner() {
    const { consent, setConsent } = useConsent();

    if (consent) return null; // already decided

    return (
        <div
            role="dialog"
            aria-live="polite"
            aria-label="Cookie consent"
            aria-modal="false"
            className="cc-banner"
        >
            <div className="cc-inner">
                <p className="cc-text">
                    We use cookies to enhance your experience and analyze
                    traffic.{' '}
                    <a href="/privacy-policy" className="cc-link">
                        Learn more
                    </a>
                    .
                </p>
                <div className="cc-actions">
                    <button
                        className="cc-btn cc-accept"
                        onClick={() => setConsent('accepted')}
                    >
                        Accept
                    </button>
                    <button
                        className="cc-btn cc-reject"
                        onClick={() => setConsent('rejected')}
                    >
                        Reject
                    </button>
                </div>
            </div>
            <style jsx>{`
                .cc-banner {
                    position: fixed;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 50;
                    background: #0f172a;
                    color: #e2e8f0;
                    padding: 14px 16px;
                    box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.25);
                    font-family:
                        system-ui,
                        -apple-system,
                        Segoe UI,
                        Roboto,
                        Ubuntu,
                        Cantarell,
                        'Helvetica Neue',
                        Arial,
                        'Noto Sans',
                        sans-serif;
                }
                .cc-inner {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    justify-content: space-between;
                    max-width: 1100px;
                    margin: 0 auto;
                    flex-wrap: wrap;
                }
                .cc-text {
                    margin: 0;
                    font-size: 0.95rem;
                    line-height: 1.4;
                }
                .cc-link {
                    color: #93c5fd;
                    text-decoration: underline;
                }
                .cc-actions {
                    display: flex;
                    gap: 8px;
                }
                .cc-btn {
                    appearance: none;
                    border: 0;
                    border-radius: 6px;
                    padding: 8px 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition:
                        transform 0.02s ease,
                        background 0.2s ease,
                        color 0.2s ease,
                        border-color 0.2s ease;
                }
                .cc-accept {
                    background: #22c55e;
                    color: #0b2f16;
                }
                .cc-accept:hover {
                    background: #16a34a;
                }
                .cc-reject {
                    background: transparent;
                    color: #e2e8f0;
                    border: 2px solid #475569;
                }
                .cc-reject:hover {
                    border-color: #94a3b8;
                }
                @media (prefers-reduced-motion: reduce) {
                    .cc-btn {
                        transition: none;
                    }
                }
            `}</style>
        </div>
    );
}
