'use client';

import React from 'react';
import { User, Settings, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProfileHeaderProps {
    user: any;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
    return (
        <div className="col-span-1 md:col-span-3 bg-deep-anthracite border border-tungsten-grey p-6 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-hazard-amber/10 border border-hazard-amber/30 flex items-center justify-center text-hazard-amber overflow-hidden relative">
                    {user.avatarUrl ? (
                        <Image
                            src={user.avatarUrl}
                            alt={user.email}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <span className="text-2xl font-bold">
                            {user.email?.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            {user.name || user.email?.split('@')[0]}
                        </h1>
                        <span className="px-2 py-0.5 bg-terminal-green/10 text-terminal-green text-[10px] font-bold uppercase border border-terminal-green/20 rounded-full">
                            OPERATOR
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-1">
                        ID: {user.id}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="hidden md:flex flex-col items-end mr-4">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">System Status</span>
                    <div className="flex items-center gap-1.5 text-terminal-green text-xs font-bold">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-terminal-green"></span>
                        </span>
                        ONLINE
                    </div>
                </div>
                <Link
                    href="/settings"
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-carbon-grey border border-tungsten-grey hover:border-white/30 text-gray-300 hover:text-white transition-all rounded-sm text-xs font-bold"
                >
                    <Settings className="w-4 h-4" />
                    EDIT PROFILE
                </Link>
            </div>
        </div>
    );
}
