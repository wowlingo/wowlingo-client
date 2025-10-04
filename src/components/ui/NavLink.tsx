import { NavLink as RouterNavLink, NavLinkProps } from 'react-router-dom';

export const NavLink = ({ children, to, ...props }: NavLinkProps) => {
    const activeClassName = "font-bold text-black";
    return (
        <RouterNavLink
            to={to}
            className={({ isActive }) =>
                `text-sm transition-colors hover:text-black ${isActive ? activeClassName : ''}`
            }
            {...props}
        >
            {children}
        </RouterNavLink>
    );
};