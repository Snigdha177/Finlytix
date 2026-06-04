import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Invalid link
  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-purple-900 flex items-center justify-center p-4">
        <div className="card w-full max-w-md p-8 animate-fadeIn text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Finlytix</h1>
          <p className="text-red-600 dark:text-red-400 mb-6">Invalid link</p>
          <Link to="/login" className="text-primary font-medium hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password || !confirmPwd) {
      toast.error('Fill in all fields');
      return;
    }

    if (password !== confirmPwd) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be 6+ characters');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          token,
          newPassword: password,
          confirmPassword: confirmPwd,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setDone(true);
        toast.success('Password updated!');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-purple-900 flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8 animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Finlytix</h1>
          <p className="text-gray-600 dark:text-gray-400">New password</p>
        </div>

        {!done ? (
          <>
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="label">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-6"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              All set!
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              You can now sign in with your new password.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary w-full"
            >
              Go to Login
            </button>
          </div>
        )}

        {!done && (
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-primary font-medium hover:underline mt-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        )}
      </div>
    </div>
  );
}
