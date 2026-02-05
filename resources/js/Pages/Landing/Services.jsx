import React from 'react';
import { BarChart2, Package, Brain } from 'lucide-react'; // import ikon yang dibutuhkan

export default function Services() {
    const services = [
        {
            title: 'Analytics',
            description: 'Visualize your data in real-time & accurate with beautiful UI chart dashboards.',
            icon: <BarChart2 className="w-10 h-10 text-rose-500" />,
            bg: 'bg-gradient-to-br from-rose-100 to-rose-50/50',
            border: 'border border-rose-200',
        },
        {
            title: 'Management',
            description: 'Make your own application can do multitasking, high performance, secure, and efficien',
            icon: <Package className="w-10 h-10 text-pink-500" />,
            bg: 'bg-gradient-to-br from-pink-100 to-pink-50/50',
            border: 'border border-pink-200',
        },
        {
            title: 'Functionality',
            description: 'Make your own business management cashier more efficien with modern UI dan Friendly UX',
            icon: <Brain className="w-10 h-10 text-indigo-500" />,
            bg: 'bg-gradient-to-r from-indigo-100 to-indigo-50/50',
            border: 'border border-indigo-200',
        },
    ];

    return (
        <section id="services" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <div className="space-y-1 mb-12">
                    <h2 className="text-4xl font-bold text-gray-600">Our Services</h2>
                    <p className="text-md text-gray-400">See our services to know what kind of content we serve</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="p-8 rounded-2xl bg-white shadow-sm border-b-2 border-gray-300 ring ring-gray-200"
                        >
                            <div className={`${service.bg} ${service.border} w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full`}>
                                {service.icon}
                            </div>

                            <h3 className="text-2xl font-semibold mb-3 text-gray-600">{service.title}</h3>
                            <p className="text-gray-400">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
