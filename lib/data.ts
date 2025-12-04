import { Technology } from "./types"

const DATA_SOURCES = {
    "AI/ML": "https://raw.githubusercontent.com/Araise25/Release-Check-DB/master/tech-essentials/ai-ml.json",
    "Backend": "https://raw.githubusercontent.com/Araise25/Release-Check-DB/master/tech-essentials/backend.json",
    "Build Tools": "https://raw.githubusercontent.com/Araise25/Release-Check-DB/master/tech-essentials/build-tools.json",
    "CSS": "https://raw.githubusercontent.com/Araise25/Release-Check-DB/master/tech-essentials/css.json",
    "Database": "https://raw.githubusercontent.com/Araise25/Release-Check-DB/master/tech-essentials/databases.json",
    "DevOps": "https://raw.githubusercontent.com/Araise25/Release-Check-DB/master/tech-essentials/devops.json",
    "Frontend": "https://raw.githubusercontent.com/Araise25/Release-Check-DB/master/tech-essentials/frontend.json",
    "Language": "https://raw.githubusercontent.com/Araise25/Release-Check-DB/master/tech-essentials/languages.json",
    "Mobile": "https://raw.githubusercontent.com/Araise25/Release-Check-DB/master/tech-essentials/mobile.json",
    "Package Manager": "https://raw.githubusercontent.com/Araise25/Release-Check-DB/master/tech-essentials/package-managers.json",
    "Testing": "https://raw.githubusercontent.com/Araise25/Release-Check-DB/master/tech-essentials/testing.json",
    "Web": "https://raw.githubusercontent.com/Araise25/Release-Check-DB/master/tech-essentials/web.json"
}

interface ExternalTech {
    tool_name: string
    release_date: string
    year: number
    alias: string
    link: string
}

export async function fetchTechnologies(): Promise<Technology[]> {
    const allTechnologies: Technology[] = []

    try {
        const fetchPromises = Object.entries(DATA_SOURCES).map(async ([category, url]) => {
            try {
                const response = await fetch(url)
                if (!response.ok) {
                    console.error(`Failed to fetch ${category} from ${url}`)
                    return []
                }
                const data: ExternalTech[] = await response.json()

                return data.map(item => ({
                    name: item.tool_name,
                    release_year: item.year,
                    link: item.link,
                    aliases: item.alias ? [item.alias] : [],
                    category: category
                }))
            } catch (error) {
                console.error(`Error fetching ${category}:`, error)
                return []
            }
        })

        const results = await Promise.all(fetchPromises)
        results.forEach(techs => allTechnologies.push(...techs))

    } catch (error) {
        console.error("Error fetching technologies:", error)
    }

    // Deduplicate by name
    const uniqueTechnologies = Array.from(
        new Map(allTechnologies.map(item => [item.name, item])).values()
    )

    return uniqueTechnologies
}
