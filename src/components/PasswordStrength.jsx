import { getPasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor, validatePassword } from '../utils/validation';

const PasswordStrength = ({ password }) => {
    if (!password) return null;

    const strength = getPasswordStrength(password);
    const label = getPasswordStrengthLabel(strength);
    const colorClass = getPasswordStrengthColor(strength);
    const validation = validatePassword(password);

    // Calculate progress percentage
    const progress = (strength / 6) * 100;

    // Requirements checklist
    const requirements = [
        { test: password.length >= 8, text: 'At least 8 characters' },
        { test: /[A-Z]/.test(password), text: 'One uppercase letter' },
        { test: /[a-z]/.test(password), text: 'One lowercase letter' },
        { test: /[0-9]/.test(password), text: 'One number' },
        { test: /[!@#$%^&*(),.?":{}|<>_]/.test(password), text: 'One special character' }
    ];

    return (
        <div className="mt-3 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/30">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Password Strength:</span>
                <span className={`text-sm font-semibold ${colorClass}`}>{label}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                        strength <= 1 ? 'bg-red-500' :
                        strength <= 2 ? 'bg-orange-500' :
                        strength <= 3 ? 'bg-yellow-500' :
                        strength <= 4 ? 'bg-blue-500' :
                        strength <= 5 ? 'bg-green-500' : 'bg-green-600'
                    }`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Requirements Checklist */}
            <div className="space-y-1">
                {requirements.map((req, index) => (
                    <div key={index} className="flex items-center text-xs">
                        <span className={`mr-2 ${req.test ? 'text-green-500' : 'text-gray-400'}`}>
                            {req.test ? '✓' : '○'}
                        </span>
                        <span className={req.test ? 'text-green-700' : 'text-gray-500'}>
                            {req.text}
                        </span>
                    </div>
                ))}
            </div>
            
            {/* Overall validation status */}
            {validation.isValid && (
                <div className="mt-2 text-xs text-green-600 font-medium">
                    ✓ Password meets all requirements
                </div>
            )}
        </div>
    );
};

export default PasswordStrength;
