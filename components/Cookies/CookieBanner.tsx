'use client';

import { useConsent } from '@/helpers/ConsentProvider';
import React from 'react';

export default function CookieBanner() {
    const { consent, setConsent } = useConsent();

    if (consent) return null;

    return (
        <div
            role="dialog"
            aria-label="Cookie consent banner"
            aria-live="polite"
            aria-modal="false"
            className="cookie-banner"
        >
            <div className="cookie-inner">
                <div className="cookie-text">
                    <h4 className="cookie-title">Your Privacy Matters</h4>
                    <p>
                        We use cookies to improve your browsing experience, deliver
                        personalized content, and analyze our traffic.{' '}
                        <a href="/privacy-policy" className="cookie-link">
                            Learn more
                        </a>
                        .
                    </p>
                </div>

                <div className="cookie-actions">
                    <button
                        className="cookie-btn accept"
                        onClick={() => setConsent('accepted')}
                    >
                        Accept all
                    </button>

                    <button
                        className="cookie-btn reject"
                        onClick={() => setConsent('rejected')}
                    >
                        Reject
                    </button>
                </div>
            </div>

            <style jsx>{`
                .cookie-banner {
                    position: fixed;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 100;
                    backdrop-filter: blur(12px);
                    background: rgba(15, 23, 42, 0.82);
                    padding: 18px 20px;
                    color: #f1f5f9;
                    box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.35);
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

                .cookie-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    gap: 20px;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .cookie-title {
                    margin: 0 0 6px;
                    font-size: 1.1rem;
                    font-weight: 700;
                }

                .cookie-text p {
                    margin: 0;
                    line-height: 1.5;
                    font-size: 0.95rem;
                }

                .cookie-link {
                    color: #93c5fd;
                    text-decoration: underline;
                    transition: color 0.2s ease;
                }

                .cookie-link:hover {
                    color: #bfdbfe;
                }

                .cookie-actions {
                    display: flex;
                    gap: 10px;
                }

                .cookie-btn {
                    border: 0;
                    padding: 10px 18px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 0.95rem;
                    transition:
                        background 0.25s ease,
                        color 0.25s ease,
                        transform 0.1s ease;
                }

                .cookie-btn:active {
                    transform: scale(0.95);
                }

                .accept {
                    background: #22c55e;
                    color: #082f1a;
                }

                .accept:hover {
                    background: #16a34a;
                }

                .reject {
                    background: transparent;
                    border: 2px solid #64748b;
                    color: #e2e8f0;
                }

                .reject:hover {
                    border-color: #94a3b8;
                    color: #ffffff;
                }

                @media (prefers-reduced-motion: reduce) {
                    .cookie-btn {
                        transition: none;
                    }
                }
            `}</style>
        </div>
    );
}