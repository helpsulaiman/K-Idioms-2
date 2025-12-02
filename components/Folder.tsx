import React, { useState } from 'react';
import styles from '../styles/Folder.module.css';

interface FolderProps {
    color?: string;
    size?: number;
    items?: React.ReactNode[];
    className?: string;
}

const darkenColor = (hex: string, percent: number) => {
    let color = hex.startsWith('#') ? hex.slice(1) : hex;
    if (color.length === 3) {
        color = color
            .split('')
            .map(c => c + c)
            .join('');
    }
    const num = parseInt(color, 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;
    r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
    g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
    b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const Folder: React.FC<FolderProps> = ({ color = '#5227FF', size = 1, items = [], className = '' }) => {
    const maxItems = 3;
    // Ensure we have exactly 3 items for the visual effect, filling with null if fewer
    const papers = [...items];
    while (papers.length < maxItems) {
        papers.push(null);
    }
    // Take only the first 3 if more provided
    const displayPapers = papers.slice(0, maxItems);

    const [open, setOpen] = useState(false);
    const [paperOffsets, setPaperOffsets] = useState(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));

    const folderBackColor = darkenColor(color, 0.08);
    const paper1 = darkenColor('#ffffff', 0.1);
    const paper2 = darkenColor('#ffffff', 0.05);
    const paper3 = '#ffffff';

    const handleClick = () => {
        setOpen(prev => !prev);
        if (open) {
            setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
        }
    };

    const handlePaperMouseMove = (e: React.MouseEvent, index: number) => {
        if (!open) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const offsetX = (e.clientX - centerX) * 0.15;
        const offsetY = (e.clientY - centerY) * 0.15;
        setPaperOffsets(prev => {
            const newOffsets = [...prev];
            newOffsets[index] = { x: offsetX, y: offsetY };
            return newOffsets;
        });
    };

    const handlePaperMouseLeave = (e: React.MouseEvent, index: number) => {
        setPaperOffsets(prev => {
            const newOffsets = [...prev];
            newOffsets[index] = { x: 0, y: 0 };
            return newOffsets;
        });
    };

    const folderStyle = {
        '--folder-color': color,
        '--folder-back-color': folderBackColor,
        '--paper-1': paper1,
        '--paper-2': paper2,
        '--paper-3': paper3
    } as React.CSSProperties;

    const folderClassName = `${styles.folder} ${open ? styles.open : ''}`.trim();
    const scaleStyle = { transform: `scale(${size})` };

    return (
        <div style={scaleStyle} className={`${styles.folderContainer} ${className}`}>
            <div className={folderClassName} style={folderStyle} onClick={handleClick}>
                <div className={styles.folderBack}>
                    {displayPapers.map((item, i) => (
                        <div
                            key={i}
                            className={`${styles.paper}`}
                            onMouseMove={e => handlePaperMouseMove(e, i)}
                            onMouseLeave={e => handlePaperMouseLeave(e, i)}
                            style={
                                open
                                    ? {
                                        transform: i === 0
                                            ? `translate(calc(-120% + ${paperOffsets[i]?.x || 0}px), calc(-70% + ${paperOffsets[i]?.y || 0}px)) rotateZ(-15deg)`
                                            : i === 1
                                                ? `translate(calc(10% + ${paperOffsets[i]?.x || 0}px), calc(-70% + ${paperOffsets[i]?.y || 0}px)) rotateZ(15deg)`
                                                : `translate(calc(-50% + ${paperOffsets[i]?.x || 0}px), calc(-100% + ${paperOffsets[i]?.y || 0}px)) rotateZ(5deg)`,
                                        zIndex: 10 // Bring to front when hovering/interacting logic handled by CSS hover usually, but here we just need them visible
                                    }
                                    : {}
                            }
                        >
                            {item}
                        </div>
                    ))}
                    <div className={styles.folderFront}></div>
                    <div className={`${styles.folderFront} ${styles.right}`}></div>
                </div>
            </div>
        </div>
    );
};

export default Folder;
