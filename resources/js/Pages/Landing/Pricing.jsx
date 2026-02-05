import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function Pricing() {
    const plans = [
        {
            title: 'Basic',
            price: '$19/mo',
            description: 'Ideal for individuals',
            features: ['Analytics Dashboard', '5 Projects', 'Basic Support'],
            bg: 'bg-gray-50',
            text: 'text-gray-800',
            border: 'border border-gray-200',
            buttonBg: 'bg-blue-600 text-white hover:bg-blue-700',
        },
        {
            title: 'Pro',
            price: '$49/mo',
            description: 'Perfect for startups & teams',
            features: ['All Basic Features', 'Unlimited Projects', 'Priority Support'],
            bg: 'bg-gradient-to-br from-gray-900 to-gray-700',
            text: 'text-white',
            border: 'border-2 border-gray-700',
            buttonBg: 'bg-white text-indigo-600 hover:bg-gray-100',
            shadow: 'shadow-2xl',
            scale: 'scale-110',
        },
    ];

    return (
        <section id="pricing" className="py-40 bg-white rounded-t-full">
            <div className="container mx-auto px-6 text-center md:text-left">
                <h2 className="text-4xl font-bold text-gray-600">Pricing Plans</h2>
                <p className="text-lg mt-1 mb-12 text-gray-400">Subscription make us more enthusiastic</p>

                <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-0">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`
                                p-10 rounded-3xl md:rounded-l-3xl md:rounded-r-none md:first:rounded-l-3xl md:last:rounded-r-3xl
                                ${plan.bg} ${plan.text} ${plan.border} ${plan.shadow ? plan.shadow : ''}
                                ${plan.scale ? plan.scale : ''}
                                flex-1
                            `}
                        >
                            <div className="flex flex-col items-start mb-6">
                                <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                                <p className="text-md mb-4">{plan.description}</p>
                                <span className="text-4xl font-extrabold">{plan.price}</span>
                            </div>

                            <ul className="mb-6 space-y-3 text-left">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <CheckCircle className={`w-5 h-5 ${plan.text === 'text-white' ? 'text-green-400' : 'text-green-500'}`} />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="/register"
                                className={`px-6 py-3 rounded-lg font-semibold transition ${plan.buttonBg}`}
                            >
                                Choose Plan
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
