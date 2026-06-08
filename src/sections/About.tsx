import React, { useState } from 'react';

const About: React.FC = () => {
    const initialText = `ABOUT ME
=========
I am a dedicated software developer with a unique background in Applied Chemistry and extensive experience in quality control, production management, and team leadership. Currently pursuing an Advanced Diploma in Computer Programming and Analysis at Fanshawe College with an impressive 3.9 GPA.

PROFESSIONAL JOURNEY
--------------------
My diverse professional journey spans over 15 years in the chemical and manufacturing industries across Syria and Cameroon, where I developed strong analytical thinking, problem-solving skills, and attention to detail. These transferable skills now drive my passion for creating efficient, scalable software solutions.

LANGUAGES SPOKEN
----------------
* English: Fluent (C2)
* French: Conversational (B1)
* Arabic: Native

CONTACT INFO
------------
Location: London, Ontario, Canada
Email: youssefrrajeh@gmail.com
Phone: +1 (548) 388-4360`;

    const [text, setText] = useState(initialText);

    return (
        <div className="flex flex-col h-full font-mono text-black text-xs select-text" style={{ minHeight: '300px' }}>
            <textarea 
                className="w-full flex-1 p-2 border-none outline-none resize-none font-mono text-xs select-text focus:ring-0 bg-white text-black"
                value={text}
                onChange={(e) => setText(e.target.value)}
                spellCheck={false}
            />
            {/* Status Bar */}
            <div className="flex justify-between items-center mt-1 pt-1.5 px-2 bg-[#c0c0c0] win95-sunken-gray py-1 border-2">
                <span className="text-[10px] text-gray-700 font-sans">For Help, press F1</span>
                <a 
                  href="/Youssef Rajeh.pdf" 
                  download 
                  className="win95-button text-xs font-semibold py-0.5 px-3 text-black border-2 flex items-center gap-1 hover:no-underline"
                >
                  💾 Save & Download CV
                </a>
            </div>
        </div>
    );
};

export default About;
