import ProjectCard from "../ProjectCard";
import { Project } from "../../types/types.d";
import ScrollReveal from "../ScrollReveal";

const ProjectData: Project[] = [
  {
    img: "./projects/erc.webp",
    url: "https://erc-react.vercel.app/",
    title: "Chronic Kidney Disease Mortality Risk Predictor",
    description:
      "An application that enables users to predict the risk of mortality due to chronic kidney disease (CKD)",
    technologies: ["JavaScript", "Tailwind", "TensorflowJS"],
  },
  {
    img: "./projects/type.webp",
    url: "https://typing-game-psi-pink.vercel.app/",
    title: "Typing Game",
    description:
      "A typing game designed to help users improve their typing speed and accuracy through engaging exercises.",
    technologies: ["TypeScript", "Tailwind"],
  },
  {
    img: "./projects/quiz.webp",
    url: "https://knowledge-quiz-jet.vercel.app/",
    title: "Knowledge Quiz",
    description:
      "An online platform offering quizzes across various categories, enabling users to assess and enhance their knowledge on different subjects.",
    technologies: ["TypeScript", "Tailwind"],
  },

  {
    img: "./projects/ip.webp",
    url: "https://ip-tracker-seven-vert.vercel.app/",
    title: "IP Tracker",
    description:
      "A tool that allows users to track and obtain detailed information about specific IP addresses.",
    technologies: ["TypeScript", "Tailwind"],
  },
];

const Projects = () => {
  return (
    <ScrollReveal>
      <div
        id="projects"
        className="flex min-h-screen w-full flex-col items-center justify-center gap-16 p-4 md:px-14 md:py-24"
      >
        <h1 className="text-4xl font-light text-white md:text-6xl">
          My Projects
        </h1>

        <div className="flex w-full max-w-[1000px] flex-col gap-16 text-white">
          {ProjectData.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default Projects;
