// Feedback.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

const Feedback = ({ message, type }) => {
    const getBgColor = () => {
        switch(type) {
            case 'success': return 'bg-success';
            case 'error': return 'bg-error';
            case 'hint': return 'bg-base-300';
            default: return 'bg-info-300';
        }
    };

    return (
        <div className={`alert ${getBgColor()} shadow-lg w-96`}>
            <AlertCircle className="w-6 h-6" />
            <span className="text-lg">{message}</span>
        </div>
    );
};

export default Feedback;