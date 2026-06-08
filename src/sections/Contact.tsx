import React, { useState } from 'react';

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
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    _replyto: formData.email,
                    subject: formData.subject,
                    message: `Sender Email: ${formData.email}\nSender Name: ${formData.name}\n\nMessage:\n${formData.message}`
                })
            });

            if (response.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setStatus('idle');
    };

    return (
        <div className="flex flex-col md:flex-row gap-3 bg-[#c0c0c0] text-black font-sans text-xs select-none" style={{ minHeight: '380px' }}>
            
            {/* Left Column: Outlook Composer */}
            <div className="flex-1 flex flex-col gap-2 win95-raised p-2 border-2">
                {/* Top Toolbar */}
                <div className="flex items-center gap-1.5 border-b border-[#808080] pb-2 select-none">
                    <button
                        onClick={handleSubmit}
                        disabled={status === 'submitting' || !formData.email || !formData.message}
                        className="win95-button flex flex-col items-center gap-1 px-3 py-1 font-bold border-2"
                        title="Send Message"
                    >
                        <span className="text-lg">✉️</span>
                        <span>Send</span>
                    </button>
                    <button
                        onClick={resetForm}
                        className="win95-button flex flex-col items-center gap-1 px-3 py-1 font-bold border-2"
                        title="Reset Form"
                    >
                        <span className="text-lg">❌</span>
                        <span>Clear</span>
                    </button>
                </div>

                {/* Form Header Fields */}
                <form onSubmit={handleSubmit} className="space-y-2 mt-1 flex-1 flex flex-col">
                    {/* To Field */}
                    <div className="flex items-center gap-1.5">
                        <span className="w-14 font-semibold text-right text-gray-700">To:</span>
                        <div className="flex-1 win95-sunken bg-[#dfdfdf] border px-2 py-1 select-text font-mono text-[11px] truncate">
                            📬 youssefrrajeh@gmail.com
                        </div>
                    </div>

                    {/* From / Sender Name Field */}
                    <div className="flex items-center gap-1.5">
                        <label htmlFor="name" className="w-14 font-semibold text-right text-gray-700">Name:</label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            className="flex-1 win95-sunken bg-white border px-2 py-1 text-black text-xs select-text focus:outline-none"
                        />
                    </div>

                    {/* From / Sender Email Field */}
                    <div className="flex items-center gap-1.5">
                        <label htmlFor="email" className="w-14 font-semibold text-right text-gray-700">From:</label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            className="flex-1 win95-sunken bg-white border px-2 py-1 text-black text-xs select-text focus:outline-none"
                        />
                    </div>

                    {/* Subject Field */}
                    <div className="flex items-center gap-1.5">
                        <label htmlFor="subject" className="w-14 font-semibold text-right text-gray-700">Subject:</label>
                        <input
                            type="text"
                            id="subject"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Project Proposal / Greeting"
                            className="flex-1 win95-sunken bg-white border px-2 py-1 text-black text-xs select-text focus:outline-none"
                        />
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] bg-[#808080] border-b border-white my-1" />

                    {/* Message Body Field */}
                    <div className="flex-1 flex flex-col">
                        <textarea
                            id="message"
                            required
                            rows={6}
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Type your email message here..."
                            className="w-full flex-1 win95-sunken bg-white border p-2 text-black text-xs select-text focus:outline-none resize-none min-h-[150px]"
                        />
                    </div>
                </form>
            </div>

            {/* Right Column: Address Book / Business Card */}
            <div className="w-full md:w-56 flex flex-col gap-2 win95-raised p-2 border-2 select-none">
                <div className="font-bold border-b border-[#808080] pb-1 text-[11px] text-[#000080]">
                    📇 Address Book Card
                </div>
                <div className="win95-sunken bg-white p-3 border-2 flex-1 flex flex-col gap-3">
                    <div>
                        <h3 className="font-bold text-sm text-black">Youssef Rajeh</h3>
                        <p className="text-[10px] text-gray-600">Software Developer</p>
                    </div>

                    <div className="h-[1px] bg-[#dfdfdf] my-1" />

                    {/* Contact items */}
                    <div className="space-y-2 text-[10px]">
                        <div>
                            <span className="font-semibold text-gray-700 block">📞 Phone:</span>
                            <a href="tel:+15483884360" className="text-blue-800 hover:underline select-text font-mono">+1 (548) 388-4360</a>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700 block">📍 Location:</span>
                            <span className="select-text font-sans">London, Ontario, Canada</span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700 block">🌐 Links:</span>
                            <div className="flex flex-col gap-1 mt-1">
                                <a 
                                    href="https://github.com/Youssefrajeh" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="win95-button py-0.5 px-2 text-center text-[9px] hover:no-underline font-bold border-2"
                                >
                                    💻 GitHub Profile
                                </a>
                                <a 
                                    href="https://www.linkedin.com/in/youssefrajeh" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="win95-button py-0.5 px-2 text-center text-[9px] hover:no-underline font-bold border-2"
                                >
                                    🔗 LinkedIn Network
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal Dialogue */}
            {status === 'success' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 pointer-events-auto">
                    <div className="win95-raised p-1 w-[320px] flex flex-col border-2 select-none text-black">
                        {/* Title Bar */}
                        <div className="flex items-center justify-between p-1 bg-gradient-to-r from-[#000080] to-[#1084d0] text-white font-bold text-xs">
                            <span className="flex items-center gap-1.5">ℹ️ Outlook Express</span>
                            <button 
                                onClick={resetForm}
                                className="win95-button w-4 h-4 p-0 text-xs font-bold leading-none flex items-center justify-center"
                            >
                                X
                            </button>
                        </div>
                        {/* Body */}
                        <div className="p-4 bg-[#c0c0c0] flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">🛈</span>
                                <div className="text-xs font-semibold">
                                    Your message was sent successfully to Youssef Rajeh. Thank you!
                                </div>
                            </div>
                            <div className="flex justify-end select-none">
                                <button
                                    onClick={resetForm}
                                    className="win95-button text-xs font-semibold py-1 px-4 border-2"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal Dialogue */}
            {status === 'error' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 pointer-events-auto">
                    <div className="win95-raised p-1 w-[320px] flex flex-col border-2 select-none text-black">
                        {/* Title Bar */}
                        <div className="flex items-center justify-between p-1 bg-gradient-to-r from-[#000080] to-[#1084d0] text-white font-bold text-xs">
                            <span className="flex items-center gap-1.5">⚠️ Error</span>
                            <button 
                                onClick={() => setStatus('idle')}
                                className="win95-button w-4 h-4 p-0 text-xs font-bold leading-none flex items-center justify-center"
                            >
                                X
                            </button>
                        </div>
                        {/* Body */}
                        <div className="p-4 bg-[#c0c0c0] flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl text-red-600">🛑</span>
                                <div className="text-xs font-semibold">
                                    Message failed to send. Please verify your internet connection or email directly.
                                </div>
                            </div>
                            <div className="flex justify-end select-none">
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="win95-button text-xs font-semibold py-1 px-4 border-2"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contact;
