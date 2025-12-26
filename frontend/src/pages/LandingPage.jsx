import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const heroStatsRef = useRef(null);

    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const newParticles = [];
        for (let i = 0; i < 30; i++) {
            newParticles.push({
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                left: Math.random() * 100,
                top: Math.random() * 100,
                animationDuration: Math.random() * 10 + 10,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        setParticles(newParticles);
    }, []);

    // Toggle mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Close mobile menu when clicking a link
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Smooth Scroll
    const handleScrollLink = (e, id) => {
        e.preventDefault();
        closeMenu();
        const element = document.getElementById(id);
        if (element) {
            const offsetTop = element.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    };

    // Scroll Effect & Intersection Observer
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        const animateElements = document.querySelectorAll('.feature-card, .step, .pricing-card');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });

        // Stats Counter Animation
        const formatNumber = (num) => {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M+';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K+';
            } else {
                return num + '%';
            }
        };

        const animateCounter = (element, target, duration = 2000) => {
            let start = 0;
            const increment = target / (duration / 16);
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = formatNumber(target);
                    clearInterval(timer);
                } else {
                    element.textContent = formatNumber(Math.floor(current));
                }
            }, 16);
        };

        let statsCounted = false;
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsCounted) {
                    statsCounted = true;
                    const statNumbers = heroStatsRef.current.querySelectorAll('.stat-number');
                    if (statNumbers.length >= 3) {
                        setTimeout(() => animateCounter(statNumbers[0], 2500000, 2000), 200);
                        setTimeout(() => animateCounter(statNumbers[1], 15000, 2000), 400);
                        setTimeout(() => animateCounter(statNumbers[2], 98, 2000), 600);
                    }
                }
            });
        }, { threshold: 0.5 });

        if (heroStatsRef.current) {
            statsObserver.observe(heroStatsRef.current);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
            statsObserver.disconnect();
        };

    }, []);

    // Pricing Card Hover Effect
    const handlePricingMouseEnter = (e) => {
        e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)';
    };

    const handlePricingMouseLeave = (e, isFeatured) => {
        if (!isFeatured) {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
        }
    };

    // Feature Card Tilt Effect
    const handleFeatureMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    };

    const handleFeatureMouseLeave = (e) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    };

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-navbar" style={{
                background: scrolled ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.8)',
                boxShadow: scrolled ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none'
            }}>
                <div className="container">
                    <div className="nav-content">
                        <Link to="/" className="landing-logo">
                            <span className="logo-icon">💎</span>
                            <span className="logo-text">MyDen</span>
                        </Link>
                        <div className="nav-links">
                            <a href="#features" onClick={(e) => handleScrollLink(e, 'features')}>Features</a>
                            <a href="#how-it-works" onClick={(e) => handleScrollLink(e, 'how-it-works')}>How It Works</a>
                            <a href="#pricing" onClick={(e) => handleScrollLink(e, 'pricing')}>Pricing</a>
                            <a href="#contact" onClick={(e) => handleScrollLink(e, 'contact')}>Contact</a>
                            <Link to="/login" className="btn-login">Login</Link>
                            <Link to="/signup" className="btn-primary">Get Started</Link>
                        </div>
                        <button className="mobile-menu-btn" onClick={toggleMenu}>
                            <span style={isMenuOpen ? { transform: 'rotate(45deg) translate(5px, 5px)' } : {}}></span>
                            <span style={isMenuOpen ? { opacity: 0 } : {}}></span>
                            <span style={isMenuOpen ? { transform: 'rotate(-45deg) translate(7px, -6px)' } : {}}></span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                <a href="#features" onClick={(e) => handleScrollLink(e, 'features')}>Features</a>
                <a href="#how-it-works" onClick={(e) => handleScrollLink(e, 'how-it-works')}>How It Works</a>
                <a href="#pricing" onClick={(e) => handleScrollLink(e, 'pricing')}>Pricing</a>
                <a href="#contact" onClick={(e) => handleScrollLink(e, 'contact')}>Contact</a>
                <Link to="/login" className="btn-login" onClick={closeMenu}>Login</Link>
                <Link to="/signup" className="btn-primary" onClick={closeMenu}>Get Started</Link>
            </div>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background"></div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <span className="badge-text">✨ Now with AI-Powered Strategies</span>
                        </div>
                        <h1 className="hero-title">
                            Smarter Way to<br />
                            <span className="gradient-text">Invest in Crypto</span>
                        </h1>
                        <p className="hero-description">
                            Manage your cryptocurrency portfolio with AI-powered insights,
                            real-time analytics, and smart price alerts. Make informed investment
                            decisions with confidence.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/signup" className="btn-hero-primary">
                                Start Investing Free
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                            <a href="#demo" className="btn-hero-secondary">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
                                    <path d="M8 7L13 10L8 13V7Z" fill="currentColor" />
                                </svg>
                                Watch Demo
                            </a>
                        </div>
                        <div className="hero-stats" ref={heroStatsRef}>
                            <div className="stat">
                                <div className="stat-number">2.5M+</div>
                                <div className="stat-label">Assets Managed</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">15K+</div>
                                <div className="stat-label">Active Users</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">98%</div>
                                <div className="stat-label">Satisfaction Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features" id="features">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Powerful Features for Smart Investors</h2>
                        <p className="section-description">Everything you need to manage and grow your crypto portfolio</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card" onMouseMove={handleFeatureMouseMove} onMouseLeave={handleFeatureMouseLeave}>
                            <div className="feature-icon">📊</div>
                            <h3 className="feature-title">Portfolio Tracking</h3>
                            <p className="feature-description">
                                Track all your crypto holdings in one place with real-time price updates and performance metrics.
                            </p>
                        </div>

                        <div className="feature-card" onMouseMove={handleFeatureMouseMove} onMouseLeave={handleFeatureMouseLeave}>
                            <div className="feature-icon">🤖</div>
                            <h3 className="feature-title">AI Strategies</h3>
                            <p className="feature-description">
                                Get personalized investment strategies powered by AI based on market conditions and your risk profile.
                            </p>
                        </div>

                        <div className="feature-card" onMouseMove={handleFeatureMouseMove} onMouseLeave={handleFeatureMouseLeave}>
                            <div className="feature-icon">🔔</div>
                            <h3 className="feature-title">Smart Alerts</h3>
                            <p className="feature-description">
                                Never miss an opportunity with intelligent price alerts and market notifications.
                            </p>
                        </div>

                        <div className="feature-card" onMouseMove={handleFeatureMouseMove} onMouseLeave={handleFeatureMouseLeave}>
                            <div className="feature-icon">📈</div>
                            <h3 className="feature-title">Real-Time Analytics</h3>
                            <p className="feature-description">
                                Visualize your portfolio performance with interactive charts and detailed analytics.
                            </p>
                        </div>

                        <div className="feature-card" onMouseMove={handleFeatureMouseMove} onMouseLeave={handleFeatureMouseLeave}>
                            <div className="feature-icon">🔐</div>
                            <h3 className="feature-title">Bank-Level Security</h3>
                            <p className="feature-description">
                                Your data is protected with industry-standard encryption and security measures.
                            </p>
                        </div>

                        <div className="feature-card" onMouseMove={handleFeatureMouseMove} onMouseLeave={handleFeatureMouseLeave}>
                            <div className="feature-icon">💬</div>
                            <h3 className="feature-title">AI Chat Assistant</h3>
                            <p className="feature-description">
                                Get instant answers to your investment questions with our AI-powered chat assistant.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works" id="how-it-works">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Start in 3 Simple Steps</h2>
                        <p className="section-description">Get started with MyDen in minutes</p>
                    </div>

                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3 className="step-title">Create Your Account</h3>
                                <p className="step-description">
                                    Sign up with your email and verify your account. It takes less than 2 minutes.
                                </p>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3 className="step-title">Add Your Holdings</h3>
                                <p className="step-description">
                                    Input your existing crypto holdings or start fresh with our guided setup.
                                </p>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3 className="step-title">Start Investing</h3>
                                <p className="step-description">
                                    Get AI-powered insights, track performance, and make smarter investment decisions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="pricing" id="pricing">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Simple, Transparent Pricing</h2>
                        <p className="section-description">Choose the plan that works best for you</p>
                    </div>

                    <div className="pricing-cards">
                        <div className="pricing-card" onMouseEnter={handlePricingMouseEnter} onMouseLeave={(e) => handlePricingMouseLeave(e, false)}>
                            <div className="pricing-header">
                                <h3 className="pricing-title">Free</h3>
                                <div className="pricing-price">
                                    <span className="price">$0</span>
                                    <span className="period">/month</span>
                                </div>
                            </div>
                            <ul className="pricing-features">
                                <li>✅ Portfolio Tracking</li>
                                <li>✅ Basic Analytics</li>
                                <li>✅ Price Alerts (5)</li>
                                <li>✅ Email Support</li>
                                <li>❌ AI Strategies</li>
                                <li>❌ Advanced Charts</li>
                            </ul>
                            <Link to="/signup" className="pricing-button">Get Started</Link>
                        </div>

                        <div className="pricing-card featured" style={{ borderColor: 'rgba(102, 126, 234, 0.3)' }}>
                            <div className="pricing-badge">Most Popular</div>
                            <div className="pricing-header">
                                <h3 className="pricing-title">Pro</h3>
                                <div className="pricing-price">
                                    <span className="price">$19</span>
                                    <span className="period">/month</span>
                                </div>
                            </div>
                            <ul className="pricing-features">
                                <li>✅ Everything in Free</li>
                                <li>✅ AI Investment Strategies</li>
                                <li>✅ Unlimited Price Alerts</li>
                                <li>✅ Advanced Analytics</li>
                                <li>✅ AI Chat Assistant</li>
                                <li>✅ Priority Support</li>
                            </ul>
                            <Link to="/signup?plan=pro" className="pricing-button primary">Start Free Trial</Link>
                        </div>

                        <div className="pricing-card" onMouseEnter={handlePricingMouseEnter} onMouseLeave={(e) => handlePricingMouseLeave(e, false)}>
                            <div className="pricing-header">
                                <h3 className="pricing-title">Enterprise</h3>
                                <div className="pricing-price">
                                    <span className="price">Custom</span>
                                </div>
                            </div>
                            <ul className="pricing-features">
                                <li>✅ Everything in Pro</li>
                                <li>✅ Custom Integrations</li>
                                <li>✅ API Access</li>
                                <li>✅ Dedicated Support</li>
                                <li>✅ Custom Features</li>
                                <li>✅ SLA Guarantee</li>
                            </ul>
                            <a href="#contact" className="pricing-button" onClick={(e) => handleScrollLink(e, 'contact')}>Contact Sales</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Take Control of Your Crypto Investments?</h2>
                        <p className="cta-description">
                            Join thousands of investors using MyDen to make smarter investment decisions
                        </p>
                        <Link to="/signup" className="btn-cta">
                            Start Investing Today
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                    strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" id="contact">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <div className="footer-logo">
                                <span className="logo-icon">💎</span>
                                <span className="logo-text">MyDen</span>
                            </div>
                            <p className="footer-description">
                                Smart cryptocurrency investment management platform with AI-powered insights.
                            </p>
                            <div className="social-links">
                                <a href="#" className="social-link">Twitter</a>
                                <a href="#" className="social-link">LinkedIn</a>
                                <a href="#" className="social-link">GitHub</a>
                            </div>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-title">Product</h4>
                            <ul className="footer-links">
                                <li><a href="#features" onClick={(e) => handleScrollLink(e, 'features')}>Features</a></li>
                                <li><a href="#pricing" onClick={(e) => handleScrollLink(e, 'pricing')}>Pricing</a></li>
                                <li><a href="#demo">Demo</a></li>
                                <li><a href="/docs">Documentation</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-title">Company</h4>
                            <ul className="footer-links">
                                <li><a href="#about">About Us</a></li>
                                <li><a href="#blog">Blog</a></li>
                                <li><a href="#careers">Careers</a></li>
                                <li><a href="#contact" onClick={(e) => handleScrollLink(e, 'contact')}>Contact</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-title">Legal</h4>
                            <ul className="footer-links">
                                <li><a href="#privacy">Privacy Policy</a></li>
                                <li><a href="#terms">Terms of Service</a></li>
                                <li><a href="#security">Security</a></li>
                                <li><a href="#compliance">Compliance</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; 2024 MyDen. All rights reserved.</p>
                        <p>Made with ❤️ for crypto investors</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
