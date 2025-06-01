import React from 'react';
import SideBar from '../SideBar/SideBar';
import styles from './ProfileLayout.module.css';

interface ProfileLayoutProps {
    children: React.ReactNode;
    userName?: string;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children, userName = 'Nombre Usuario' }) => {
    return (
        <div className={styles.layoutContainer}>
            <div className={styles.sidebarWrapper}>
                <SideBar userName={userName} />
            </div>
            <div className={styles.contentWrapper}>
                {children}
            </div>
        </div>
    );
};

export default ProfileLayout;