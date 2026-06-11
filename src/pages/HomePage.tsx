import { ContactSection } from '../components/ContactSection';
import { DesignerSection } from '../components/DesignerSection';
import { Hero } from '../components/Hero';
import { ProcessSection } from '../components/ProcessSection';
import { WorkSection } from '../components/WorkSection';

interface Props {
  onPickPencil: () => void;
}

export function HomePage({ onPickPencil }: Props) {
  return (
    <>
      <Hero onPickPencil={onPickPencil} />
      <WorkSection />
      <ProcessSection />
      <DesignerSection />
      <ContactSection />
    </>
  );
}
