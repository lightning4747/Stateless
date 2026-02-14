import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useOutletContext } from "react-router";
import { CheckCircle2, ImageIcon, UploadIcon } from "lucide-react";
import { PROGRESS_INCREMENT, REDIRECT_DELAY_MS, PROGRESS_INTERVAL_MS } from "~/lib/constants";

interface UploadProps {
    onComplete?: (base64Data: string) => Promise<boolean | void> | boolean | void;
}

const Upload = ({ onComplete }: UploadProps) => {
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const base64DataRef = useRef<string | null>(null);

    const [hydrated, setHydrated] = useState(false);
    const { isSignedIn } = useOutletContext<AuthContext>();

    useEffect(() => {
        // This only runs on the client, after the first render
        setHydrated(true);
    }, []);

    const isActuallyDisabled = hydrated ? !isSignedIn : false;

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (progress === 100) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(async () => {
                if (base64DataRef.current) {
                    try {
                        await onComplete?.(base64DataRef.current);
                    } catch (e) {
                        console.error("Upload completion failed", e);
                    }
                }
                timeoutRef.current = null;
            }, REDIRECT_DELAY_MS);
        }
    }, [progress, onComplete]);

    const processFile = useCallback((file: File) => {
        if (!isSignedIn) return;

        setFile(file);
        setProgress(0);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        const reader = new FileReader();
        reader.onerror = () => {
            setFile(null);
            setProgress(0);
        };
        reader.onloadend = () => {
            base64DataRef.current = reader.result as string;

            intervalRef.current = setInterval(() => {
                setProgress((prev) => {
                    const next = prev + PROGRESS_INCREMENT;
                    return next >= 100 ? 100 : next;
                });
            }, PROGRESS_INTERVAL_MS);
        };
        reader.readAsDataURL(file);
    }, [isSignedIn]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!isSignedIn) return;
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (!isSignedIn) return;

        const droppedFile = e.dataTransfer.files[0];

        if (droppedFile && ALLOWED_TYPES.includes(droppedFile.type)) {
            processFile(droppedFile);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isSignedIn) return;

        const selectedFile = e.target.files?.[0];
        if (selectedFile && ALLOWED_TYPES.includes(selectedFile.type)) {
            processFile(selectedFile);
        }
    };

    return (
        <div className="upload">
            {!file ? (
                <div
                    className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className="drop-input"
                        accept=".jpg,.jpeg,.png,.webp"
                        disabled={isActuallyDisabled}
                        onChange={handleChange}
                    />

                    <div className="drop-content">
                        <div className="drop-icon">
                            <UploadIcon size={20} />
                        </div>
                        <p>
                            {isSignedIn ? (
                                "Click to upload or just drag and drop"
                            ) : ("Sign in or sign up with Puter to upload")}
                        </p>
                        <p className="help">Maximum file size 50 MB.</p>
                    </div>
                </div>
            ) : (
                <div className="upload-status">
                    <div className="status-content">
                        <div className="status-icon">
                            {progress === 100 ? (
                                <CheckCircle2 className="check" />
                            ) : (
                                <ImageIcon className="image" />
                            )}
                        </div>

                        <h3>{file.name}</h3>

                        <div className='progress'>
                            <div className="bar" style={{ width: `${progress}%` }} />

                            <p className="status-text">
                                {progress < 100 ? 'Analyzing Floor Plan...' : 'Redirecting...'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Upload