import { NavLink as RouterNavLink, NavLinkProps as RouterNavLinkProps } from 'react-router-dom';
import React from 'react';

interface NavLinkProps extends RouterNavLinkProps {
    children: React.ReactNode;
    disabled?: boolean; // 비활성화
}

export const NavLink = ({ children, to, disabled = false, ...props }: NavLinkProps) => {
    const activeClassName = "font-bold text-[#3182F7] border-[#3182F7]";

    const disabledClassName = "text-gray-400 cursor-not-allowed border-transparent pointer-events-none";

    const inactiveClassName = "border-transparent";

    return (
        <RouterNavLink
            to={to}
            onClick={(e) => {
                if (disabled) e.preventDefault();
            }}
            className={({ isActive }) =>
                `flex items-center text-[14px] transition-colors h-10 px-[6px] gap-2 border-b-2 ${disabled
                    ? disabledClassName
                    : isActive
                        ? activeClassName
                        : inactiveClassName
                }`
            }
            {...props}
        >
            {children}
        </RouterNavLink>
    );
};