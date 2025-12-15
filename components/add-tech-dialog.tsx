"use client"

import { useState, useEffect } from "react"
import { X, ExternalLink, Github, Send } from "lucide-react"

type AddTechDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    darkMode: boolean
    categories: string[]
}

export function AddTechDialog({
    open,
    onOpenChange,
    darkMode,
    categories,
}: AddTechDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        releaseYear: "",
        releaseDate: "",
        link: "",
        description: "",
    })

    // Handle ESC key to close dialog
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                onOpenChange(false)
            }
        }

        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [open, onOpenChange])

    if (!open) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const workerUrl = "https://add-release-worker.rushi2004rushi.workers.dev/";

        const res = await fetch(workerUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            alert("Submitted successfully! Your data will be reviewed.");
        } else {
            alert("Failed to submit. Try again later.");
        }

        onOpenChange(false);

        setFormData({
            name: "",
            category: "",
            releaseYear: "",
            releaseDate: "",
            link: "",
            description: "",
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const getIssueUrl = () => {
        const title = formData.name ? `New Tech: ${formData.name}` : "New Tech Request";
        const body = `
### Technology Details
- **Name:** ${formData.name}
- **Category:** ${formData.category}
- **Release Year:** ${formData.releaseYear}
- **Release Date:** ${formData.releaseDate}
- **Documentation:** ${formData.link}

### Additional Notes
${formData.description}
        `.trim();

        return `https://github.com/Araise25/Release-Check-DB/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    };

    const handleGithubClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!formData.name || !formData.category || !formData.releaseYear) {
            e.preventDefault();
            alert("Please fill in the required fields (Name, Category, Release Year) before opening an issue.");
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => onOpenChange(false)}
        >
            <div
                className={`rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'
                    }`}>
                    <div>
                        <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            Add Unlisted Data
                        </h2>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Contribute to the database via GitHub Issues
                        </p>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className={`p-2.5 rounded-xl transition-all duration-300 ${darkMode ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Technology Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Next.js"
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F2AA4C] ${darkMode
                                ? 'bg-slate-900/50 border-slate-600 text-white placeholder-slate-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                                }`}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F2AA4C] appearance-none ${darkMode
                                    ? 'bg-slate-900/50 border-slate-600 text-white'
                                    : 'bg-slate-50 border-slate-200 text-slate-900'
                                    }`}
                            >
                                <option value="" disabled>Select...</option>
                                {categories.filter(c => c !== "All").map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                Release Year <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type="number"
                                name="releaseYear"
                                value={formData.releaseYear}
                                onChange={handleChange}
                                placeholder="e.g. 2016"
                                min="1950"
                                max={new Date().getFullYear()}
                                className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F2AA4C] ${darkMode
                                    ? 'bg-slate-900/50 border-slate-600 text-white placeholder-slate-500'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                                    }`}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Release Date <span className="text-xs font-normal opacity-70">(Optional)</span>
                        </label>
                        <input
                            type="date"
                            name="releaseDate"
                            value={formData.releaseDate}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F2AA4C] ${darkMode
                                ? 'bg-slate-900/50 border-slate-600 text-white placeholder-slate-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                                }`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Documentation Link <span className="text-xs font-normal opacity-70">(Optional)</span>
                        </label>
                        <input
                            type="url"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            placeholder="https://..."
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F2AA4C] ${darkMode
                                ? 'bg-slate-900/50 border-slate-600 text-white placeholder-slate-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                                }`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Additional Notes
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Any extra details..."
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F2AA4C] resize-none ${darkMode
                                ? 'bg-slate-900/50 border-slate-600 text-white placeholder-slate-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                                }`}
                        />
                    </div>

                    <div className="pt-4 space-y-3">
                        <button
                            type="submit"
                            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${darkMode
                                ? 'bg-[#F2AA4C] text-[#101820] hover:bg-[#F2AA4C]/90 shadow-[0_0_20px_rgba(242,170,76,0.3)] hover:shadow-[0_0_30px_rgba(242,170,76,0.5)]'
                                : 'bg-[#101820] text-[#F2AA4C] hover:bg-[#101820]/90 shadow-xl hover:shadow-2xl'
                                }`}
                        >
                            <Send className="w-5 h-5" />
                            Submit Data
                        </button>

                        <a
                            href={getIssueUrl()}
                            onClick={handleGithubClick}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 border-2 ${darkMode
                                ? 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white hover:bg-slate-800'
                                : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            <Github className="w-5 h-5" />
                            Or open an issue on GitHub
                        </a>

                        <p className={`text-xs text-center mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            Your submission will be reviewed before being added to the database.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
