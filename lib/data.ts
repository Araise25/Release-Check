import { Technology } from "./types"

const localTechnologies: Technology[] = [
    {
        name: "TensorFlow",
        release_year: 2015,
        link: "https://www.tensorflow.org",
        aliases: ["TF", "TensorFlow 2", "TensorFlow 1"],
        category: "AI/ML"
    },
    {
        name: "LangChain",
        release_year: 2022,
        link: "https://langchain.com",
        aliases: ["LC"],
        category: "AI/ML"
    },
    {
        name: "PyTorch",
        release_year: 2016,
        link: "https://pytorch.org",
        aliases: ["Torch"],
        category: "AI/ML"
    },
    {
        name: "scikit-learn",
        release_year: 2007,
        link: "https://scikit-learn.org",
        aliases: ["sklearn"],
        category: "AI/ML"
    },
    {
        name: "Keras",
        release_year: 2015,
        link: "https://keras.io",
        aliases: [],
        category: "AI/ML"
    },
    {
        name: "React",
        release_year: 2013,
        link: "https://react.dev",
        aliases: ["React 18", "React 17", "React.js"],
        category: "Frontend"
    },
    {
        name: "Next.js",
        release_year: 2016,
        link: "https://nextjs.org",
        aliases: ["Next"],
        category: "Frontend"
    },
    {
        name: "Vue.js",
        release_year: 2014,
        link: "https://vuejs.org",
        aliases: ["Vue", "Vue2", "Vue3"],
        category: "Frontend"
    },
    {
        name: "Angular",
        release_year: 2010,
        link: "https://angular.io",
        aliases: ["AngularJS", "Angular 2+", "Ng"],
        category: "Frontend"
    },
    {
        name: "TypeScript",
        release_year: 2012,
        link: "https://www.typescriptlang.org",
        aliases: ["TS"],
        category: "Language"
    },
    {
        name: "Node.js",
        release_year: 2009,
        link: "https://nodejs.org",
        aliases: ["Node"],
        category: "Backend"
    },
    {
        name: "Python",
        release_year: 1991,
        link: "https://www.python.org",
        aliases: ["Py"],
        category: "Language"
    },
    {
        name: "Go",
        release_year: 2009,
        link: "https://golang.org",
        aliases: ["Golang"],
        category: "Language"
    },
    {
        name: "Rust",
        release_year: 2010,
        link: "https://www.rust-lang.org",
        aliases: [],
        category: "Language"
    },
    {
        name: "Docker",
        release_year: 2013,
        link: "https://www.docker.com",
        aliases: [],
        category: "Infrastructure"
    },
    {
        name: "Kubernetes",
        release_year: 2014,
        link: "https://kubernetes.io",
        aliases: ["K8s"],
        category: "Infrastructure"
    },
    {
        name: "Terraform",
        release_year: 2014,
        link: "https://www.terraform.io",
        aliases: ["TFM"],
        category: "Infrastructure"
    },
    {
        name: "ChatGPT",
        release_year: 2022,
        link: "https://openai.com",
        aliases: ["GPT"],
        category: "AI/ML"
    },
    {
        name: "FastAPI",
        release_year: 2018,
        link: "https://fastapi.tiangolo.com",
        aliases: [],
        category: "Backend"
    },
    {
        name: "Flutter",
        release_year: 2017,
        link: "https://flutter.dev",
        aliases: [],
        category: "Mobile"
    },
    {
        name: "Swift",
        release_year: 2014,
        link: "https://developer.apple.com/swift/",
        aliases: [],
        category: "Language"
    }
]

export async function fetchTechnologies(): Promise<Technology[]> {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(localTechnologies)
        }, 500) // Small delay to simulate network
    })
}
