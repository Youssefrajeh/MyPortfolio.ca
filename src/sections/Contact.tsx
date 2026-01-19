import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import Button from '../components/Button';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        
        try {
            const response = await fetch('https://formspree.io/f/mvgrongo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                // Reset form after 5 seconds
                setTimeout(() => {
                    setFormData({ name: '', email: '', subject: '', message: '' });
                    setStatus('idle');
                }, 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="py-20 bg-dark-950 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In <span className="text-gradient">Touch</span></h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="text-2xl font-bold text-white mb-6 text-center md:text-left">Let's Connect</h3>
                        <p className="text-slate-300 mb-8 text-lg leading-relaxed text-center md:text-left">
                            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-300 justify-center md:justify-start">
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-primary text-xl">
                                    <FaEnvelope />
                                </div>
                                <div className="text-center md:text-left">
                                    <p className="text-sm text-slate-500">Email</p>
                                    <a href="mailto:youssefrrajeh@gmail.com" className="hover:text-primary transition-colors">youssefrrajeh@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-slate-300 justify-center md:justify-start">
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-primary text-xl">
                                    <FaPhone />
                                </div>
                                <div className="text-center md:text-left">
                                    <p className="text-sm text-slate-500">Phone</p>
                                    <a href="tel:+15483884360" className="hover:text-primary transition-colors">+1 (548) 388-4360</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-slate-300 justify-center md:justify-start">
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-primary text-xl">
                                    <FaMapMarkerAlt />
                                </div>
                                <div className="text-center md:text-left">
                                    <p className="text-sm text-slate-500">Location</p>
                                    <p>London, Ontario, Canada</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8 justify-center md:justify-start">
                            <a href="https://github.com/Youssefrajeh" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white transition-all duration-300">
                                <FaGithub size={20} />
                            </a>
                            <a href="https://www.linkedin.com/in/youssefrajeh" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white transition-all duration-300">
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="glass p-8 rounded-2xl"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-2">Name</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                                        placeholder="John Doe" 
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                                        placeholder="john@example.com" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-slate-400 mb-2">Subject</label>
                                <input 
                                    type="text" 
                                    id="subject" 
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                                    placeholder="Project Inquiry" 
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                                <textarea 
                                    id="message" 
                                    rows={4} 
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                                    placeholder="Your message..."
                                ></textarea>
                            </div>
                            
                            {status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary rounded-xl p-6 text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
                                    >
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                                    <p className="text-slate-300">
                                        Your message has been sent successfully. I'll get back to you as soon as possible!
                                    </p>
                                </motion.div>
                            )}

                            {status === 'error' && (
                                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                                    ✗ Something went wrong. Please try again or email me directly.
                                </div>
                            )}
                            
                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="w-full"
                                disabled={status === 'submitting'}
                            >
                                {status === 'submitting' ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
