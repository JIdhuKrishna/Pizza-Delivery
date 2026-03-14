import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/Toast';

export default function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
                addToast('Email verified successfully! Please login.', 'success');
                navigate('/login');
            } catch (err) {
                if (err.response?.data?.message === "Invalid or expired token") {
                    addToast('Invalid or expired token. If already verified, please login.', 'error');
                    navigate('/login');
                } else {
                    addToast(err.response?.data?.message || 'Verification failed.', 'error');
                    navigate('/');
                }
            } finally {
                setVerifying(false);
            }
        };

        if (token) {
            verifyUser();
        }
    }, [token, navigate, addToast]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">
                <h2 className="mb-4 text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    {verifying ? 'Verifying your email...' : 'Redirecting...'}
                </h2>
                {verifying && (
                    <div className="mx-auto mt-4 h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-red-500" />
                )}
            </div>
        </div>
    );
}
