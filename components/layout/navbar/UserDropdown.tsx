// Open-core stub - no user dropdown (no auth)
import { AuthUser } from '@/context/AuthContext';

interface UserDropdownProps {
    user: AuthUser;
    onLogoutClick: () => void;
    isSigningOut: boolean;
}

export default function UserDropdown({ user }: UserDropdownProps) {
    // Open-core: No user dropdown, users are always anonymous
    return null;
}
