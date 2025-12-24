import React, { useState, useEffect } from 'react';
import { X, Sparkles, TrendingUp, Shield, Target } from 'lucide-react';
import { useDemoMode } from '../context/DemoModeContext';

const steps = [
    {
        id: 1,
        title: 'Welcome to InvestApp!',
        description: "Let's get you started with smart crypto investing in just 3 steps.",
        icon: Sparkles,
        action: null
    },
    {
        id: 2,
        title: "What's your investing experience?",
        description: 'Help us personalize your experience',
        icon: Target,
        options: [
            { value: 'beginner', label: 'Beginner', description: "I'm new to crypto investing" },
            { value: 'intermediate', label: 'Intermediate', description: 'I have some experience' },
            { value: 'expert', label: 'Expert', description: 'I'm a seasoned trader' }
        ]
    },
    {
        id: 3,
        title: "What's your risk tolerance?",
        description: "We'll recommend strategies that match your comfort level",
        icon: Shield,
        options: [
            { value: 'conservative', label: 'Conservative', description: 'Protect my capital, steady growth' },
            { value: 'moderate', label: 'Moderate', description: 'Balanced risk and reward' },
            { value: 'aggressive', label: 'Aggressive', description: 'Maximum growth potential' }
        ]
    },
    {
        id: 4,
        title: 'Try Demo Mode First?',
        description: 'Practice with $10,000 virtual money before investing real funds',
        icon: TrendingUp,
        options: [
            { value: 'demo', label: 'Start with Demo', description: 'Safe practice environment' },
            { value: 'real', label: 'Start Investing', description: "I'm ready to invest real money" }
        ]
    }
];

const OnboardingFlow = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [answers, setAnswers] = useState({
        experience: '',
        riskTolerance: '',
        mode: ''
    });
    const [show, setShow] = useState(true);
    const { enableDemoMode } = useDemoMode();

    useEffect(() => {
        // Check if user has completed onboarding
        const hasOnboarded = localStorage.getItem('hasOnboarded');
        if (hasOnboarded === 'true') {
            setShow(false);
        }
    }, []);

    const handleSelectOption = (field, value) => {
        setAnswers({ ...answers, [field]: value });
    };

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = () => {
        // Save onboarding preferences
        localStorage.setItem('hasOnboarded', 'true');
        localStorage.setItem('userExperience', answers.experience);
        localStorage.setItem('userRiskTolerance', answers.riskTolerance);

        // Enable demo mode if selected
        if (answers.mode === 'demo') {
            enableDemoMode();
        }

        setShow(false);
        if (onComplete) onComplete(answers);
    };

    if (!show) return null;

    const step = steps[currentStep - 1];
    const Icon = step.icon;
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === steps.length;
    const canProceed = isFirstStep ||
        (currentStep === 2 && answers.experience) ||
        (currentStep === 3 && answers.riskTolerance) ||
        (currentStep === 4 && answers.mode);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Icon size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{step.title}</h2>
                            <p className="text-blue-100 text-sm">{step.description}</p>
                        </div>
                    </div>
                    <button onClick={handleSkip} className="text-white/80 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="bg-slate-800 px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Step {currentStep} of {steps.length}</span>
                        <span className="text-sm font-semibold text-white">{Math.round((currentStep / steps.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(currentStep / steps.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {isFirstStep ? (
                        <div className="text-center py-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                                <Sparkles size={48} className="text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">Ready to start your journey?</h3>
                            <p className="text-slate-400 text-lg mb-8">
                                Join thousands of smart investors using AI-powered strategies
                            </p>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-slate-800 rounded-lg p-4">
                                    <p className="text-3xl font-bold text-blue-500 mb-1">AI</p>
                                    <p className="text-sm text-slate-400">Powered Strategies</p>
                                </div>
                                <div className="bg-slate-800 rounded-lg p-4">
                                    <p className="text-3xl font-bold text-green-500 mb-1">$10K</p>
                                    <p className="text-sm text-slate-400">Demo Account</p>
                                </div>
                                <div className="bg-slate-800 rounded-lg p-4">
                                    <p className="text-3xl font-bold text-purple-500 mb-1">24/7</p>
                                    <p className="text-sm text-slate-400">Market Analysis</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {step.options?.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelectOption(
                                        currentStep === 2 ? 'experience' : currentStep === 3 ? 'riskTolerance' : 'mode',
                                        option.value
                                    )}
                                    className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 ${(currentStep === 2 && answers.experience === option.value) ||
                                            (currentStep === 3 && answers.riskTolerance === option.value) ||
                                            (currentStep === 4 && answers.mode === option.value)
                                            ? 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-600/20'
                                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-lg font-semibold text-white mb-1">{option.label}</h4>
                                            <p className="text-sm text-slate-400">{option.description}</p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 transition-all ${(currentStep === 2 && answers.experience === option.value) ||
                                                (currentStep === 3 && answers.riskTolerance === option.value) ||
                                                (currentStep === 4 && answers.mode === option.value)
                                                ? 'border-blue-500 bg-blue-500'
                                                : 'border-slate-600'
                                            }`}>
                                            {((currentStep === 2 && answers.experience === option.value) ||
                                                (currentStep === 3 && answers.riskTolerance === option.value) ||
                                                (currentStep === 4 && answers.mode === option.value)) && (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="bg-slate-800 px-8 py-6 flex items-center justify-between border-t border-slate-700">
                    <button
                        onClick={handleSkip}
                        className="text-slate-400 hover:text-white font-medium transition-colors"
                    >
                        Skip for now
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!canProceed}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${canProceed
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        {isLastStep ? 'Get Started' : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingFlow;
