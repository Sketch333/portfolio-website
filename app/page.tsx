import { HeroSection } from "@/components/sections/hero-section";
import { SelectedWork } from "@/components/sections/selected-work";
import { Capabilities } from "@/components/sections/capabilities";
import { ExperienceSection } from "@/components/sections/experience-section";
import { AskPortfolio } from "@/components/sections/ask-portfolio";
import { WritingPreview } from "@/components/sections/writing-preview";
import { BeyondWork } from "@/components/sections/beyond-work";
import { ContactPreview } from "@/components/sections/contact-preview";
import { getAllProjects } from "@/lib/content/projects";
import { getExperience } from "@/lib/content/experience";
import { getAllPosts } from "@/lib/content/blog";

export default async function HomePage() {
  const [projects, experience, posts] = await Promise.all([
    getAllProjects(),
    getExperience(),
    getAllPosts(),
  ]);
  const selected = projects.filter(
    (project) =>
      project.tier === "flagship" ||
      (project.tier === "featured" && project.featured),
  );
  return (
    <div className="home-narrative">
      <HeroSection />
      <SelectedWork projects={selected} />
      <Capabilities />
      <ExperienceSection experience={experience} />
      <AskPortfolio />
      <WritingPreview posts={posts.slice(0, 3)} />
      <BeyondWork />
      <ContactPreview />
    </div>
  );
}
