
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
    const baseClasses = "inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantClasses = {
        primary: "text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500",
        secondary: "text-cyan-300 bg-gray-700 hover:bg-gray-600 focus:ring-cyan-500",
        ghost: "text-cyan-400 bg-transparent hover:bg-cyan-900/50 focus:ring-cyan-500",
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
