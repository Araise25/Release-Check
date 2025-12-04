"use client"
import { useState, useEffect } from 'react';
import { Header } from "@/components/header";
import { useTheme } from "next-themes";
import { FileText, AlertCircle } from "lucide-react";
import { Technology } from "@/lib/types";
import { BookmarksDialog } from "@/components/bookmarks-dialog";
import { fetchTechnologies } from "@/lib/data";
import { useBookmarks } from "@/hooks/use-bookmarks";

interface InvalidJD {
    id: string;
    imageUrl: string;
}

export default function WallOfShamePage() {
    const [showBookmarks, setShowBookmarks] = useState(false);
    const { bookmarks, toggleBookmark, clearBookmarks } = useBookmarks();
    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Load technologies
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchTechnologies();
                setTechnologies(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const currentTheme = theme === 'system' ? systemTheme : theme;
    const darkMode = mounted && currentTheme === 'dark';



    // Simple list of JD images - just add your screenshots here
    const invalidJDs: InvalidJD[] = [
        { id: "jd-001", imageUrl: "/invalid-jds/jd-1.jpg" },
        { id: "jd-002", imageUrl: "/invalid-jds/jd-2.jpg" },
        { id: "jd-003", imageUrl: "/invalid-jds/jd-3.jpg" },
        { id: "jd-004", imageUrl: "/invalid-jds/jd-4.jpg" },
    ];

    return (
        <div
            className={`min-h-screen flex flex-col ${darkMode
                ? 'bg-[#101820] text-white'
                : 'bg-[#F6F6F6] text-black'
                }`}
        >
            <Header
                onBookmarksClick={() => setShowBookmarks(true)}
                bookmarkCount={bookmarks.size}
            />

            <main className="flex-1 container mx-auto px-4 pt-24 pb-12 max-w-7xl">
                <div className="w-full space-y-8 animate-in fade-in duration-500">
                    {/* Header Section */}
                    <div className="text-center space-y-4 mb-12">
                        <h1 className={`text-5xl font-black tracking-tight ${darkMode
                            ? 'text-white drop-shadow-[0_0_25px_rgba(242,170,76,0.5)]'
                            : 'text-slate-900'
                            }`}>
                            <span className="relative inline-block">
                                Wall of
                                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-600"></span>
                            </span>
                            {' '}
                            <span className="text-rose-500 font-black">Shame</span>
                        </h1>
                        <p className={`text-lg font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Real job descriptions with impossible experience requirements
                        </p>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${darkMode ? 'bg-rose-900/30 border border-rose-500/50' : 'bg-rose-50 border border-rose-200'}`}>
                            <AlertCircle className="w-4 h-4 text-rose-500" />
                            <span className={`text-sm font-medium ${darkMode ? 'text-rose-300' : 'text-rose-700'}`}>
                                {invalidJDs.length} impossible requirements found
                            </span>
                        </div>
                    </div>

                    {/* Grid of Invalid JD Screenshots */}
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                        {invalidJDs.map((jd) => (
                            <div key={jd.id} className="group relative">
                                {/* Gradient border effect */}
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-rose-500 to-red-600 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>

                                <div className={`relative rounded-xl overflow-hidden transition-all duration-300 ${darkMode
                                    ? 'bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-800'
                                    : 'bg-white/90 backdrop-blur-xl border border-slate-200/50 hover:bg-white'
                                    } group-hover:shadow-2xl group-hover:scale-[1.02] group-hover:-translate-y-1`}>

                                    {/* Image placeholder */}
                                    <div className={`w-full aspect-[4/3] flex items-center justify-center ${darkMode ? 'bg-slate-900/50' : 'bg-slate-100'}`}>
                                        <div className="text-center space-y-3 p-8">
                                            <FileText className={`w-16 h-16 mx-auto ${darkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                                            <p className={`text-sm font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                JD Screenshot Placeholder
                                            </p>
                                            <p className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-500'}`}>
                                                Add image: {jd.imageUrl}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </main>

            <BookmarksDialog
                open={showBookmarks}
                onOpenChange={setShowBookmarks}
                bookmarkedTechnologies={technologies.filter((tech) => bookmarks.has(tech.name))}
                onToggleBookmark={toggleBookmark}
                onClearBookmarks={clearBookmarks}
                darkMode={darkMode}
            />
        </div>
    );
}
