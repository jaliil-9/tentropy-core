// Open-core stub - no auth modal
interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    defaultTab?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    // Open-core: Auth not available
    return null;
}
