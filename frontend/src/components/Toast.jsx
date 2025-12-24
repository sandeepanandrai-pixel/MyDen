import React from 'react';
import { AlertCircle, XCircle, CheckCircle, Info } from 'lucide-react';

const Toast = ({ type = 'info', message, onClose }) => {
    const config = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-900/20',
            borderColor: 'border-green-600/30',
            textColor: 'text-green-200',
            iconColor: 'text-green-500'
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-900/20',
            borderColor: 'border-red-600/30',
            textColor: 'text-red-200',
            iconColor: 'text-red-500'
        },
        warning: {
            icon: AlertCircle,
            bgColor: 'bg-yellow-900/20',
            borderColor: 'border-yellow-600/30',
            textColor: 'text-yellow-200',
            iconColor: 'text-yellow-500'
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-900/20',
            borderColor: 'border-blue-600/30',
            textColor: 'text-blue-200',
            iconColor: 'text-blue-500'
        }
    };

    const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

    return (
        <div className={`${bgColor} ${borderColor} border rounded-lg p-4 flex items-start space-x-3 shadow-lg animate-slide-up`}>
            <Icon className={`${iconColor} flex-shrink-0 mt-0.5`} size={20} />
            <p className={`${textColor} text-sm flex-1`}>{message}</p>
            {onClose && (
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <XCircle size={18} />
                </button>
            )}
        </div>
    );
};

export default Toast;
