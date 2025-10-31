import { NavLink as RouterNavLink, NavLinkProps } from 'react-router-dom';

export const NavLink = ({ children, to, ...props }: NavLinkProps) => {
    const activeClassName = "font-bold text-[#3182F7] border-[#3182F7]";

    const inactiveClassName = "border-transparent";

    return (
        <RouterNavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center text-[14px] transition-colors h-10 px-[6px] gap-2 border-b-2 ${isActive ? activeClassName : inactiveClassName
                }`
            }
            {...props}
        >
            {children}
        </RouterNavLink>
    );
};