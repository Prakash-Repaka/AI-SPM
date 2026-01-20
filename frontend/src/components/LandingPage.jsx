import React from 'react';
import { Shield, Zap, Eye, Lock, ArrowRight, CheckCircle, Server, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-purple-500 selection:text-white">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <Shield className="h-8 w-8 text-indigo-500 mr-2" />
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                                AegisAI-SPM
                            </span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">
                                Sign In
                            </Link>
                            <Link to="/signup" className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg hover:shadow-indigo-500/25">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent blur-3xl -z-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-900/50 border border-indigo-700/50 text-indigo-300 text-sm font-medium mb-8 animate-fade-in-up">
                        <Zap size={16} className="mr-2" />
                        Next-Gen AI Security Posture Management
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-fade-in-up delay-100">
                        Secure Your AI <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                            Before It's Too Late
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400 mb-10 animate-fade-in-up delay-200">
                        Detect Shadow AI, automate remediation, and simulate adversarial attacks.
                        The comprehensive platform for securing your GenAI infrastructure.
                    </p>
                    <div className="flex justify-center space-x-4 animate-fade-in-up delay-300">
                        <Link to="/signup" className="px-8 py-4 rounded-xl bg-white text-indigo-900 font-bold text-lg hover:bg-slate-100 transition-all transform hover:scale-105 shadow-xl">
                            Start Protecting Now
                        </Link>
                        <Link to="#features" className="px-8 py-4 rounded-xl bg-slate-800 text-white font-bold text-lg border border-slate-700 hover:bg-slate-700 transition-all">
                            How It Works
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div id="features" className="py-24 bg-slate-900 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Complete AI Security Suite</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Three powerful engines working in unison to defend your organization against modern AI threats.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 transition-all hover:-translate-y-1 group">
                            <div className="h-14 w-14 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                                <Eye className="text-indigo-400" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Shadow AI Discovery</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Automatically analyze network logs to detect unauthorized AI usage. Identify risky applications like ChatGPT, Claude, or huggingface DL.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-all hover:-translate-y-1 group">
                            <div className="h-14 w-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                                <Zap className="text-purple-400" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Red Teaming Simulator</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Test your guardrails with real adversarial attacks. Simulate prompt injections, jailbreaks, and data exfiltration attempts in a safe sandbox.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-green-500/50 transition-all hover:-translate-y-1 group">
                            <div className="h-14 w-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                                <Lock className="text-green-400" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Automated Remediation</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Fix security gaps with a single click. Generate Terraform code or CLI commands to encrypt buckets, restrict IAM roles, and secure endpoints.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="py-24 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-8">End-to-End Protection Workflow</h2>
                            <div className="space-y-8">
                                <div className="flex">
                                    <div className="flex-shrink-0 mr-4">
                                        <div className="h-10 w-10 rounded-full bg-indigo-900 border border-indigo-500 flex items-center justify-center text-indigo-400 font-bold">1</div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">Scan & Detect</h4>
                                        <p className="text-slate-400">Connect your cloud accounts and upload firewall logs. Our engine maps your AI asset inventory instantly.</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="flex-shrink-0 mr-4">
                                        <div className="h-10 w-10 rounded-full bg-indigo-900 border border-indigo-500 flex items-center justify-center text-indigo-400 font-bold">2</div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">Analyze Risks</h4>
                                        <p className="text-slate-400">Identify public endpoints, unencrypted data, and over-privileged roles. Graph visualization reveals attack paths.</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="flex-shrink-0 mr-4">
                                        <div className="h-10 w-10 rounded-full bg-indigo-900 border border-indigo-500 flex items-center justify-center text-indigo-400 font-bold">3</div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">Remediate & Defend</h4>
                                        <p className="text-slate-400">Apply automated fixes and deploy guardrails. Continuously monitor for new threats with our active defense system.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-3xl opacity-20 rounded-full"></div>
                            <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
                                {/* Abstract UI Mockup */}
                                <div className="flex items-center space-x-2 mb-6 border-b border-slate-700 pb-4">
                                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    <div className="ml-4 h-2 w-32 bg-slate-600 rounded-full opacity-50"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex space-x-4">
                                        <div className="w-1/3 h-24 bg-slate-700 rounded-lg animate-pulse"></div>
                                        <div className="w-2/3 h-24 bg-slate-700 rounded-lg animate-pulse"></div>
                                    </div>
                                    <div className="h-40 bg-slate-700/50 rounded-lg border border-slate-600/50 p-4">
                                        <div className="h-4 w-3/4 bg-slate-600 rounded mb-3"></div>
                                        <div className="h-4 w-1/2 bg-slate-600 rounded mb-3"></div>
                                        <div className="h-4 w-5/6 bg-slate-600 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-950 py-12 border-t border-slate-900">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-500 mb-4">&copy; 2026 AegisAI-SPM. All rights reserved.</p>
                    <div className="flex justify-center space-x-6 text-slate-400 text-sm">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Contact Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
