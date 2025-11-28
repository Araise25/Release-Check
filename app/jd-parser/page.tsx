"use client"

import { useState, useEffect, useMemo } from "react"
import { Bookmark, X, Quote, FileText, ArrowRight, CheckCircle, AlertTriangle, Copy, Info } from "lucide-react"
import { Header } from "@/components/header"
import { useTheme } from "next-themes"
import { getInvalidDialogues, validDialogues } from "@/lib/dialogues"
import { Technology } from "@/lib/types"
import { fetchTechnologies } from "@/lib/data"

// --- Types ---

export type ParsedRequirement = {
    technology: Technology
    requestedYears: number
    foundIndex: number // Where in text it was found
    isValid: boolean
    maxPossibleYears: number
}

export type ChangelogEntry = {
    technology: string
    original: number
    corrected: number
    position: number
}

// --- The Parsing Logic (Two-Pass Approach) ---
const parseJobDescription = (text: string, techList: Technology[]): ParsedRequirement[] => {
    const results: ParsedRequirement[] = []
    const currentYear = new Date().getFullYear()

    // PASS 1: Find all technology mentions in the text
    const techMatches: Array<{ tech: Technology; position: number; matchedText: string }> = []

    techList.forEach((tech) => {
        // Check technology name and all aliases
        const namesToCheck = [tech.name, ...(tech.aliases || [])]

        namesToCheck.forEach((name) => {
            const regex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
            let match

            while ((match = regex.exec(text)) !== null) {
                techMatches.push({
                    tech,
                    position: match.index,
                    matchedText: match[0]
                })
            }
        })
    })

    // Remove duplicates (same tech matched multiple times at same position)
    const uniqueTechMatches = techMatches.filter((match, index, self) =>
        index === self.findIndex((m) =>
            m.tech.name === match.tech.name && Math.abs(m.position - match.position) < 10
        )
    )

    // PASS 2: For each technology, find years in a window around it
    uniqueTechMatches.forEach((techMatch) => {
        const { tech, position, matchedText } = techMatch

        // Define search window: 50 chars before and after the tech name (reduced from 100)
        let windowStart = Math.max(0, position - 50)
        let windowEnd = Math.min(text.length, position + matchedText.length + 50)

        // Smart boundary: stop at delimiters to avoid cross-contamination
        // Look backwards from tech position for delimiters
        const beforeText = text.substring(windowStart, position)
        const delimitersBefore = [',', ';', '\n', '.']
        for (let i = beforeText.length - 1; i >= 0; i--) {
            if (delimitersBefore.includes(beforeText[i])) {
                windowStart = windowStart + i + 1
                break
            }
        }

        // Look forwards from tech position for delimiters
        const afterText = text.substring(position + matchedText.length, windowEnd)
        const delimitersAfter = [',', ';', '\n', '.', ' and ', ' or ']
        for (let i = 0; i < afterText.length; i++) {
            if (delimitersAfter.some(delim => afterText.substring(i).startsWith(delim))) {
                windowEnd = position + matchedText.length + i
                break
            }
        }

        const searchWindow = text.substring(windowStart, windowEnd)

        // Look for year patterns in the window
        // Patterns: "15 years", "10+ years", "8 yrs", etc.
        const yearPattern = /(\d+)\+?\s*(?:years?|yrs?|yoe)/gi
        const yearMatches: Array<{ years: number; distance: number }> = []

        let yearMatch
        while ((yearMatch = yearPattern.exec(searchWindow)) !== null) {
            const years = parseInt(yearMatch[1], 10)
            // Calculate distance from tech name to year mention
            const yearPositionInWindow = yearMatch.index
            const techPositionInWindow = position - windowStart
            const distance = Math.abs(yearPositionInWindow - techPositionInWindow)

            yearMatches.push({ years, distance })
        }

        // If we found years, use the closest one
        if (yearMatches.length > 0) {
            // Sort by distance and take the closest
            yearMatches.sort((a, b) => a.distance - b.distance)
            const closestYear = yearMatches[0].years

            const maxPossible = currentYear - tech.release_year

            results.push({
                technology: tech,
                requestedYears: closestYear,
                foundIndex: position,
                maxPossibleYears: maxPossible,
                isValid: closestYear <= maxPossible
            })
        }
    })

    // Deduplicate: Keep the result with the HIGHEST requested years if duplicates exist
    const uniqueResults = Object.values(
        results.reduce((acc, item) => {
            const key = item.technology.name
            if (!acc[key] || item.requestedYears > acc[key].requestedYears) {
                acc[key] = item
            }
            return acc
        }, {} as Record<string, ParsedRequirement>)
    )

    return uniqueResults
}

// --- JD Correction Logic (Simplified) ---
const correctJobDescription = (
    text: string,
    parsedResults: ParsedRequirement[]
): { correctedText: string; changelog: ChangelogEntry[] } => {
    let correctedText = text
    const changelog: ChangelogEntry[] = []

    // Sort by foundIndex in descending order to replace from end to start
    // This prevents position shifts from affecting subsequent replacements
    const invalidResults = parsedResults
        .filter(r => !r.isValid)
        .sort((a, b) => b.foundIndex - a.foundIndex)

    invalidResults.forEach((result) => {
        const { technology, requestedYears, maxPossibleYears, foundIndex } = result

        // Define search window around the technology (same as detection: 50 chars)
        const windowStart = Math.max(0, foundIndex - 50)
        const windowEnd = Math.min(correctedText.length, foundIndex + technology.name.length + 50)
        const beforeWindow = correctedText.substring(0, windowStart)
        const searchWindow = correctedText.substring(windowStart, windowEnd)
        const afterWindow = correctedText.substring(windowEnd)

        // Simple pattern: find the requested years and replace with max possible
        // Pattern: "15 years", "10+ years", "8 yrs", etc.
        const yearPattern = new RegExp(`\\b${requestedYears}\\+?\\s*(?:years?|yrs?|yoe)`, 'gi')

        // Replace only the first occurrence in the window (closest to the tech)
        let replaced = false
        const correctedWindow = searchWindow.replace(yearPattern, (match) => {
            if (!replaced) {
                replaced = true
                return match.replace(requestedYears.toString(), maxPossibleYears.toString())
            }
            return match
        })

        if (replaced) {
            correctedText = beforeWindow + correctedWindow + afterWindow

            changelog.push({
                technology: technology.name,
                original: requestedYears,
                corrected: maxPossibleYears,
                position: foundIndex
            })
        }
    })

    return { correctedText, changelog }
}

// --- Utility Functions ---
const detectOS = (): 'mac' | 'windows' | 'linux' => {
    if (typeof window === 'undefined') return 'windows'
    const platform = window.navigator.platform.toLowerCase()
    if (platform.includes('mac')) return 'mac'
    if (platform.includes('linux')) return 'linux'
    return 'windows'
}

// --- Components ---

function SarcasticRotator({ isValid, techName, requested, max }: { isValid: boolean; techName: string; requested: number; max: number }) {
    const message = useMemo(() => {
        const invalidList = getInvalidDialogues(techName, requested, max)
        const targetList = isValid ? validDialogues : invalidList
        return targetList[Math.floor(Math.random() * targetList.length)]
    }, [isValid, techName, requested, max])

    return (
        <p className={`text-sm font-medium italic ${isValid ? 'text-emerald-600' : 'text-rose-600'}`}>
            {message}
        </p>
    )
}

function Disclaimer({ darkMode }: { darkMode: boolean }) {
    return (
        <div className={`rounded-xl border-l-4 border-amber-500 p-4 mb-8 ${darkMode ? 'bg-amber-950/30 border-amber-500' : 'bg-amber-50 border-amber-500'}`}>
            <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                    <h3 className={`font-semibold mb-1 ${darkMode ? 'text-amber-400' : 'text-amber-900'}`}>
                        Regex-Based Parser (No AI)
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-amber-200/80' : 'text-amber-800'}`}>
                        This parser uses basic Regular Expressions (regex) to detect year requirements.
                        We cannot guarantee 100% accuracy as it may miss certain formats or make incorrect replacements in edge cases.
                    </p>
                </div>
            </div>
        </div>
    )
}

function JDParsingArea({
    onParse,
    darkMode,
    onManualClick
}: {
    onParse: (text: string) => void
    darkMode: boolean
    onManualClick: () => void
}) {
    const [text, setText] = useState("")
    const [showHint, setShowHint] = useState(false)
    const os = useMemo(() => detectOS(), [])
    const shortcutKey = os === 'mac' ? '⌘' : 'Ctrl'

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault()
            if (text.trim()) {
                onParse(text)
            }
        }
    }

    const handleManualClick = () => {
        setShowHint(true)
        setTimeout(() => setShowHint(false), 3000)
        onManualClick()
        onParse(text)
    }

    return (
        <div className="space-y-4">
            <div className="relative group">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Paste the Job Description here (e.g., 'We are looking for a React expert with 12 years of experience...')"
                    className={`w-full h-48 p-5 rounded-2xl border-2 shadow-lg focus:outline-none focus:ring-2 transition-all resize-none ${darkMode
                        ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-500 focus:ring-[#F2AA4C] focus:border-[#F2AA4C]'
                        : 'bg-white/90 border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-[#F2AA4C] focus:border-[#F2AA4C]'
                        } backdrop-blur-sm`}
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    {showHint && (
                        <div className={`text-xs px-3 py-1.5 rounded-lg font-semibold animate-in fade-in slide-in-from-right-2 ${darkMode ? 'bg-slate-700 text-[#F2AA4C]' : 'bg-slate-200 text-[#F2AA4C]'
                            }`}>
                            💡 Tip: Use {shortcutKey}+Enter
                        </div>
                    )}
                    <button
                        onClick={handleManualClick}
                        disabled={!text.trim()}
                        className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${darkMode
                            ? 'bg-gradient-to-r from-[#101820] to-[#F2AA4C] text-white hover:shadow-[#F2AA4C]/50 hover:scale-105'
                            : 'bg-gradient-to-r from-[#101820] to-[#F2AA4C] text-white hover:shadow-[#F2AA4C]/50 hover:scale-105'
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        Scan JD
                    </button>
                </div>
            </div>
        </div>
    )
}

function ResultCard({ result, darkMode }: { result: ParsedRequirement; darkMode: boolean }) {
    return (
        <div className="group relative">
            {/* Gradient border effect */}
            <div className={`absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 ${result.isValid
                ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                : 'bg-gradient-to-r from-rose-400 to-red-500'
                }`}></div>

            <div className={`relative rounded-xl p-5 transition-all duration-300 ${darkMode
                ? 'bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-800'
                : 'bg-white/90 backdrop-blur-xl border border-slate-200/50 hover:bg-white'
                } group-hover:shadow-2xl group-hover:scale-[1.02]`}>
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} selection:bg-red-900/60 selection:text-red-100`}>
                                {result.technology.name}
                            </h3>
                            <span className={`text-xs px-3 py-1 rounded-full font-bold shadow-lg ${result.isValid
                                ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white'
                                : 'bg-gradient-to-r from-rose-400 to-red-500 text-white'
                                }`}>
                                {result.isValid ? '✓ VALID' : '✗ IMPOSSIBLE'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm mt-3">
                            <div className={`px-3 py-1.5 rounded-lg border ${darkMode
                                ? 'bg-slate-900/50 border-slate-600/50'
                                : 'bg-slate-50 border-slate-200'
                                }`}>
                                <span className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Released: {result.technology.release_year}
                                </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                            <div className={`px-3 py-1.5 rounded-lg border ${darkMode
                                ? 'bg-slate-900/50 border-slate-600/50'
                                : 'bg-slate-50 border-slate-200'
                                }`}>
                                <span className={`text-xs font-bold ${result.isValid ? 'text-emerald-500' : 'text-rose-500'
                                    }`}>
                                    Asked: {result.requestedYears}y
                                </span>
                            </div>
                        </div>
                    </div>

                    {result.isValid ? (
                        <CheckCircle className="w-8 h-8 text-emerald-500 opacity-30" />
                    ) : (
                        <AlertTriangle className="w-8 h-8 text-rose-500 opacity-30" />
                    )}
                </div>

                <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div className="flex items-start gap-2">
                        <Quote className={`w-5 h-5 flex-shrink-0 opacity-50 ${result.isValid ? 'text-emerald-500' : 'text-rose-500'}`} />
                        <SarcasticRotator
                            isValid={result.isValid}
                            techName={result.technology.name}
                            requested={result.requestedYears}
                            max={result.maxPossibleYears}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

function ChangelogSection({ changelog, darkMode }: { changelog: ChangelogEntry[]; darkMode: boolean }) {
    if (changelog.length === 0) return null

    return (
        <div className="mt-8">
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                📝 Corrections Made
            </h3>
            <div className="space-y-2">
                {changelog.map((entry, idx) => (
                    <div
                        key={idx}
                        className={`p-3 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                    >
                        <div className="flex items-center gap-2">
                            <span className={`font-semibold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                {entry.technology}
                            </span>
                            <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>:</span>
                            <span className="text-rose-600 line-through">{entry.original} years</span>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                            <span className="text-emerald-600 font-semibold">{entry.corrected} years</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function CorrectedJDSection({ correctedText, darkMode }: { correctedText: string; darkMode: boolean }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(correctedText)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ml-auto ${copied
                        ? 'bg-emerald-600 text-white'
                        : darkMode
                            ? 'bg-slate-700 hover:bg-slate-600 text-white'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                        }`}
                >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy All'}
                </button>
            </div>
            <div
                className={`p-4 rounded-xl border font-mono text-sm whitespace-pre-wrap ${darkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
            >
                {correctedText}
            </div>
        </div>
    )
}

// --- Tab Components ---

type TabType = 'analysis' | 'corrections' | 'corrected'

function TabButton({
    active,
    onClick,
    icon,
    label,
    count,
    darkMode
}: {
    active: boolean
    onClick: () => void
    icon: React.ReactNode
    label: string
    count?: number
    darkMode: boolean
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${active
                ? darkMode
                    ? 'bg-gradient-to-r from-[#101820] to-[#F2AA4C] text-slate-900 shadow-lg shadow-[#F2AA4C]/30'
                    : 'bg-gradient-to-r from-[#101820] to-[#F2AA4C] text-white shadow-lg shadow-[#F2AA4C]/30'
                : darkMode
                    ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
                    : 'bg-white/50 text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
                }`}
        >
            {icon}
            <span>{label}</span>
            {count !== undefined && count > 0 && (
                <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${active
                        ? 'bg-black/20 text-current'
                        : darkMode
                            ? 'bg-slate-700 text-slate-300'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                >
                    {count}
                </span>
            )}
        </button>
    )
}

function TabNavigation({
    activeTab,
    onTabChange,
    resultsCount,
    correctionsCount,
    darkMode
}: {
    activeTab: TabType
    onTabChange: (tab: TabType) => void
    resultsCount: number
    correctionsCount: number
    darkMode: boolean
}) {
    return (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <TabButton
                active={activeTab === 'analysis'}
                onClick={() => onTabChange('analysis')}
                icon={<FileText className="w-4 h-4" />}
                label="Analysis"
                count={resultsCount}
                darkMode={darkMode}
            />
            <TabButton
                active={activeTab === 'corrections'}
                onClick={() => onTabChange('corrections')}
                icon={<AlertTriangle className="w-4 h-4" />}
                label="Corrections"
                count={correctionsCount}
                darkMode={darkMode}
            />
            {correctionsCount > 0 && (
                <TabButton
                    active={activeTab === 'corrected'}
                    onClick={() => onTabChange('corrected')}
                    icon={<CheckCircle className="w-4 h-4" />}
                    label="Corrected JD"
                    darkMode={darkMode}
                />
            )}
        </div>
    )
}

// --- Main Page ---

export default function JDParserPage() {
    const [technologies, setTechnologies] = useState<Technology[]>([])
    const [parsedResults, setParsedResults] = useState<ParsedRequirement[]>([])
    const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
    const [showBookmarks, setShowBookmarks] = useState(false)
    const { theme, systemTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [hasScanned, setHasScanned] = useState(false)
    const [correctedJD, setCorrectedJD] = useState('')
    const [changelog, setChangelog] = useState<ChangelogEntry[]>([])
    const [originalJD, setOriginalJD] = useState('')
    const [scanMethod, setScanMethod] = useState<'keyboard' | 'click'>('click')
    const [activeTab, setActiveTab] = useState<TabType>('analysis')

    useEffect(() => {
        setMounted(true)
    }, [])

    const currentTheme = theme === 'system' ? systemTheme : theme
    const darkMode = mounted && currentTheme === 'dark'

    // Load Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchTechnologies()
                setTechnologies(data)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
    }, [])

    const handleParse = (text: string) => {
        const results = parseJobDescription(text, technologies)
        setParsedResults(results)
        setOriginalJD(text)

        // Generate corrected JD and changelog
        const { correctedText, changelog: changes } = correctJobDescription(text, results)
        setCorrectedJD(correctedText)
        setChangelog(changes)

        setHasScanned(true)
    }

    const handleManualClick = () => {
        setScanMethod('click')
    }

    const toggleBookmark = (name: string) => {
        setBookmarks((prev) => {
            const newBookmarks = new Set(prev)
            if (newBookmarks.has(name)) newBookmarks.delete(name)
            else newBookmarks.add(name)
            return newBookmarks
        })
    }

    return (
        <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-[#101820]' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
            <Header
                onBookmarksClick={() => setShowBookmarks(true)}
            />

            <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <div className="w-full space-y-8 animate-in fade-in duration-500">
                    <div className="text-center space-y-3 mb-12">
                        <h1 className={`text-6xl font-black tracking-tight ${darkMode
                            ? 'text-white drop-shadow-[0_0_25px_rgba(34,211,238,0.5)]'
                            : 'text-slate-900'
                            } relative`}>
                            <span className="relative">
                                JD Bullsh*t
                                <span className={`absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#101820] to-[#F2AA4C]`}></span>
                            </span>
                            {' '}
                            <span className={`text-[#F2AA4C] font-black`}>Detector</span>
                        </h1>
                        <p className={`text-lg font-semibold text-[#F2AA4C]`}>
                            Paste a Job Description. We'll check if the experience requirements exist in physical reality.
                        </p>
                    </div>

                    {/* Disclaimer */}
                    <Disclaimer darkMode={darkMode} />

                    {/* Input Area */}
                    <JDParsingArea onParse={handleParse} darkMode={darkMode} onManualClick={handleManualClick} />

                    {/* Results Area */}
                    {hasScanned && (
                        <div className="space-y-6 mt-12">
                            <div className="flex items-center justify-between">
                                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                    Scan Results
                                </h2>
                                <span className={`text-sm px-3 py-1 rounded-full ${parsedResults.some(r => !r.isValid)
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                    {parsedResults.length} requirements found
                                </span>
                            </div>

                            {/* Tab Navigation */}
                            <TabNavigation
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                resultsCount={parsedResults.length}
                                correctionsCount={changelog.length}
                                darkMode={darkMode}
                            />

                            {/* Tab Content */}
                            <div className="min-h-[400px]">
                                {/* Analysis Tab */}
                                {activeTab === 'analysis' && (
                                    <div className="animate-in fade-in duration-300">
                                        {parsedResults.length === 0 ? (
                                            <div className={`p-8 text-center border-2 border-dashed rounded-xl ${darkMode ? 'border-slate-700 text-slate-500' : 'border-slate-300 text-slate-500'}`}>
                                                <p>No specific years of experience requirements found for known technologies.</p>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4 grid-cols-2">
                                                {parsedResults.map((result, idx) => (
                                                    <ResultCard
                                                        key={`${result.technology.name}-${idx}`}
                                                        result={result}
                                                        darkMode={darkMode}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Corrections Tab */}
                                {activeTab === 'corrections' && (
                                    <div className="animate-in fade-in duration-300">
                                        {changelog.length === 0 ? (
                                            <div className={`p-8 text-center border-2 border-dashed rounded-xl ${darkMode ? 'border-slate-700 text-slate-500' : 'border-slate-300 text-slate-500'}`}>
                                                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500 opacity-50" />
                                                <p className="font-medium">No corrections needed!</p>
                                                <p className="text-sm mt-1">All experience requirements are valid.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {changelog.map((entry, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`p-4 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className={`font-semibold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                                                {entry.technology}
                                                            </span>
                                                            <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>:</span>
                                                            <span className="text-rose-600 line-through">{entry.original} years</span>
                                                            <ArrowRight className="w-4 h-4 text-slate-400" />
                                                            <span className="text-emerald-600 font-semibold">{entry.corrected} years</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Corrected JD Tab */}
                                {activeTab === 'corrected' && changelog.length > 0 && correctedJD && (
                                    <div className="animate-in fade-in duration-300">
                                        <CorrectedJDSection correctedText={correctedJD} darkMode={darkMode} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Reusing existing Dialog Logic */}
            {/* (BookmarksDialog component code is assumed to be same as previous provided snippet) */}
        </div>
    )
}