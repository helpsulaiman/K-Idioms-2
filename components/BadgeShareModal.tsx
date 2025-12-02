import React from 'react';
import styles from '../styles/learn.module.css';
import Folder from './Folder';

interface BadgeShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    badgeName: string;
    badgeDescription: string | null;
    badgeImageUrl: string | null;
}

const BadgeShareModal: React.FC<BadgeShareModalProps> = ({ isOpen, onClose, badgeName, badgeDescription, badgeImageUrl }) => {
    if (!isOpen) return null;

    const handleDownload = async () => {
        if (!badgeImageUrl) return;
        try {
            const response = await fetch(badgeImageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${badgeName.replace(/\s+/g, '_')}_badge.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download image.');
        }
    };

    const handleShareLink = async () => {
        const shareData = {
            title: `I earned the ${badgeName} badge!`,
            text: `I just earned the ${badgeName} badge on Hečhun! ${badgeDescription}`,
            url: window.location.href, // Or a specific shareable link if we have one
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
                alert('Link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const folderItems = [
        <div key="title" className="flex items-center justify-center h-full w-full bg-white p-2 text-center font-bold text-gray-800 text-xs border border-gray-200 rounded">
            {badgeName}
        </div>,
        <div key="image" className="flex items-center justify-center h-full w-full bg-white p-1 border border-gray-200 rounded">
            {badgeImageUrl ? (
                <img src={badgeImageUrl} alt={badgeName} className="max-h-full max-w-full object-contain" />
            ) : (
                <span className="text-2xl">🏅</span>
            )}
        </div>,
        <div key="desc" className="flex items-center justify-center h-full w-full bg-white p-2 text-center text-gray-600 text-[10px] border border-gray-200 rounded overflow-hidden">
            {badgeDescription}
        </div>
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className={`relative ${styles.popupAnimation} w-full max-w-sm flex flex-col items-center justify-center`}>
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white hover:text-gray-200 transition-colors z-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="mb-8">
                    <Folder
                        items={folderItems}
                        color="#fbbf24" // Gold/Yellow for badges
                        size={2.5}
                    />
                </div>

                <div className="text-white text-center mt-12 mb-4">
                    <p className="text-sm opacity-80">Click the folder to open!</p>
                </div>

                {/* Download button below the card */}
                <button
                    onClick={handleDownload}
                    className="text-white hover:text-blue-200 font-bold flex items-center gap-2 transition-colors z-50 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Image
                </button>
            </div>
        </div>
    );
};

export default BadgeShareModal;
