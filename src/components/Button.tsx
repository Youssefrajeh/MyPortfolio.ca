import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    href?: string;
}

const Button: React.FC<ButtonProps> = ({ children, href, className = '', ...props }) => {
    const baseStyles = "win95-button text-xs font-semibold py-1 px-4 text-black border-2";

    if (href) {
        return (
            <a href={href} className={`${baseStyles} ${className}`} style={{ textDecoration: 'none' }}>
                {children}
            </a>
        );
    }

    return (
        <button className={`${baseStyles} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
