import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { FaDownload } from 'react-icons/fa';

const About: React.FC = () => {
    return (
        <section id="about" className="py-20 bg-dark-950 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">About <span className="text-gradient">Me</span></h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="glass p-8 rounded-2xl shadow-xl"
                >
                    <p className="text-lg text-slate-300 mb-6 leading-relaxed text-center">
                        I am a dedicated software developer with a unique background in Applied Chemistry and extensive experience in quality control, production management, and team leadership. Currently pursuing an Advanced Diploma in Computer Programming and Analysis at Fanshawe College with an impressive 3.9 GPA.
                    </p>
                    <p className="text-lg text-slate-300 mb-6 leading-relaxed text-center">
                        My diverse professional journey spans over 15 years in the chemical and manufacturing industries across Syria and Cameroon, where I developed strong analytical thinking, problem-solving skills, and attention to detail. These transferable skills now drive my passion for creating efficient, scalable software solutions.
                    </p>
                    <p className="text-lg text-slate-300 mb-8 leading-relaxed text-center">
                        Fluent in English (C2), French (B1), and Arabic (Native), I bring a multicultural perspective and proven ability to work effectively in diverse, international environments.
                    </p>

                    <div className="text-center">
                        <Button href="/Youssef Rajeh.pdf" variant="primary" className="gap-2">
                            <FaDownload /> Download CV
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
