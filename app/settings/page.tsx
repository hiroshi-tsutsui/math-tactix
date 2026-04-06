"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, Volume2, Monitor, Trash2, ShieldAlert } from 'lucide-react';

export default function SettingsPage() {
    const { resetProgress } = useProgress();
    const { t } = useLanguage();
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [purgeConfirm, setPurgeConfirm] = useState(false);

    useEffect(() => {
        const settings = localStorage.getItem('omega_settings');
        if (settings) {
            const parsed = JSON.parse(settings);
            setAudioEnabled(parsed.audio);
        }
    }, []);

    const saveSettings = (audio: boolean) => {
        const settings = { audio };
        localStorage.setItem('omega_settings', JSON.stringify(settings));
        setAudioEnabled(audio);
    };

    const handlePurge = () => {
        if (!purgeConfirm) {
            setPurgeConfirm(true);
            return;
        }
        resetProgress();
        localStorage.removeItem('omega_settings');
        window.location.href = '/';
    };

    return (
        <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
             
             {/* Navigation */}
             <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16">
                <div className="max-w-3xl mx-auto px-6 h-full flex items-center justify-between">
                <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {t('settings.back')}
                </Link>
                <span className="text-sm font-bold">{t('settings.title')}</span>
                </div>
            </nav>

             <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
                <header className="space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
                    <p className="text-slate-500 font-medium">{t('settings.subtitle')}</p>
                </header>

                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    {/* Audio */}
                    <div className="p-8 flex justify-between items-center border-b border-slate-100">
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Volume2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold">{t('settings.audio.title')}</h3>
                                <p className="text-xs text-slate-400">{t('settings.audio.desc')}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => saveSettings(!audioEnabled)}
                            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${audioEnabled ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        >
                            {audioEnabled ? t('settings.audio.on') : t('settings.audio.off')}
                        </button>
                    </div>

                    {/* Version Info */}
                    <div className="p-8 flex justify-between items-center bg-slate-50/50">
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                <Monitor className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-600">{t('settings.version.title')}</h3>
                                <p className="text-xs text-slate-400">{t('settings.version.desc')}</p>
                            </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-400">v2.7.0 (Stable)</span>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="space-y-4 pt-10">
                    <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" /> {t('settings.danger.title')}
                    </h3>
                    <div className="bg-red-50/50 border border-red-100 rounded-3xl p-8">
                        <h4 className="text-sm font-bold text-red-900 mb-2">{t('settings.danger.wipe_title')}</h4>
                        <p className="text-xs text-red-700/70 mb-8 leading-relaxed max-w-md">
                            {t('settings.danger.wipe_desc')}
                        </p>

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handlePurge}
                                className={`py-4 rounded-2xl text-sm font-bold transition-all ${purgeConfirm ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-white border border-red-200 text-red-600 hover:bg-red-50'}`}
                            >
                                {purgeConfirm ? t('settings.danger.wipe_confirm') : t('settings.danger.wipe_btn')}
                            </button>
                            {purgeConfirm && (
                                <button 
                                    onClick={() => setPurgeConfirm(false)}
                                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors py-2"
                                >
                                    {t('settings.danger.cancel')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
             </main>
        </div>
    );
}
