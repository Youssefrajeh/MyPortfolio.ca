import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    children: React.ReactNode;
    href?: string;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, href, className = '', ...props }) => {
    const baseStyles = "inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";

    const variants = {
        primary: "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 focus:ring-primary hover:shadow-[0_0_30px_rgba(96,165,250,0.6)] border-2 border-white",
        secondary: "bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/30 focus:ring-secondary hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]",
        outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary hover:shadow-[0_0_30px_rgba(96,165,250,0.6)]",
    };

    if (href) {
        return (
            <a href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>
                {children}
            </a>
        );
    }

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
